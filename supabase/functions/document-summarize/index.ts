import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Not authenticated' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { documentUrl, action, fileName } = await req.json();

    // Validate URL to prevent SSRF
    if (!documentUrl || typeof documentUrl !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid document URL' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    try {
      const url = new URL(documentUrl);

      // Only allow HTTPS
      if (url.protocol !== 'https:') {
        return new Response(
          JSON.stringify({ error: 'Only HTTPS URLs are allowed' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Restrict to Supabase storage domain
      const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
      const allowedHost = supabaseUrl.replace('https://', '').replace('http://', '');
      if (!url.hostname.endsWith('.supabase.co') && url.hostname !== allowedHost) {
        return new Response(
          JSON.stringify({ error: 'Invalid document source. Only project storage URLs are allowed.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Block internal/private IPs
      if (url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname.startsWith('10.') || url.hostname.startsWith('192.168.') || url.hostname.startsWith('169.254.')) {
        return new Response(
          JSON.stringify({ error: 'Invalid document URL' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid document URL format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Document summarization request:', { action, fileName });

    // Download document with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    let docResponse: Response;
    try {
      docResponse = await fetch(documentUrl, { signal: controller.signal });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!docResponse.ok) {
      throw new Error('Failed to download document');
    }

    // Limit response size (10MB max)
    const contentLength = docResponse.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ error: 'Document too large (max 10MB)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const docText = await docResponse.text();
    
    // Prepare prompt based on action
    let prompt = '';
    let noteTitle = '';
    
    switch (action) {
      case 'summarize':
        prompt = `Summarize this document concisely:\n\n${docText.slice(0, 10000)}`;
        noteTitle = `Summary: ${fileName}`;
        break;
      case 'extract-key-points':
        prompt = `Extract the key points from this document as bullet points:\n\n${docText.slice(0, 10000)}`;
        noteTitle = `Key Points: ${fileName}`;
        break;
      default:
        prompt = `Analyze this document:\n\n${docText.slice(0, 10000)}`;
        noteTitle = `Analysis: ${fileName}`;
    }

    // Call Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that summarizes and analyzes documents.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      throw new Error('AI request failed');
    }

    const aiData = await aiResponse.json();
    const summary = aiData.choices[0].message.content;

    // Save to notes table
    const { data: note, error: noteError } = await supabaseClient
      .from('notes')
      .insert({
        user_id: user.id,
        title: noteTitle,
        content: summary,
        note_type: 'document-summary',
      })
      .select()
      .single();

    if (noteError) throw noteError;

    return new Response(
      JSON.stringify({ success: true, noteId: note.id, summary }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in document-summarize function:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred processing the document' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});