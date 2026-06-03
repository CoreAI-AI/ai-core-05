import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Restrict to allowlisted local-model endpoints to prevent SSRF
const ALLOWED_ENDPOINTS = (Deno.env.get('LOCAL_MODEL_ALLOWED_ENDPOINTS') ?? '')
  .split(',').map(s => s.trim()).filter(Boolean);

const isAllowedEndpoint = (endpoint: string): boolean => {
  if (typeof endpoint !== 'string') return false;
  // Must be explicitly allowlisted via env var
  if (ALLOWED_ENDPOINTS.length === 0) return false;
  try {
    const url = new URL(endpoint);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
    return ALLOWED_ENDPOINTS.some(allowed => endpoint.startsWith(allowed));
  } catch {
    return false;
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );
    const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { prompt, endpoint, modelId, size } = await req.json();

    console.log('Local image generation request:', { modelId, userId: user.id });

    if (!endpoint || !isAllowedEndpoint(endpoint)) {
      return new Response(
        JSON.stringify({ error: 'Endpoint not allowed. Configure LOCAL_MODEL_ALLOWED_ENDPOINTS.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (typeof prompt !== 'string' || prompt.length > 2000) {
      return new Response(
        JSON.stringify({ error: 'Invalid prompt' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, size: size || '1024x1024' }),
      signal: AbortSignal.timeout(60000),
    });

    if (!response.ok) {
      throw new Error(`Local server returned ${response.status}`);
    }

    const data = await response.json();
    console.log('Local image generated successfully');

    return new Response(
      JSON.stringify({ success: true, imageUrl: data.imageUrl || data.image }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in local-image-gen function:', error);

    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
      if (error.name === 'TimeoutError') {
        errorMessage = 'Local server timeout. Is your model server running?';
      } else if (error.message.includes('fetch')) {
        errorMessage = 'Could not connect to local server. Check endpoint configuration.';
      }
    }

    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
