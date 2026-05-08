import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Rate limiting: max 3 demo accounts per IP per hour
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                     req.headers.get('x-real-ip') ||
                     'unknown';

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    // Check recent demo user creations from this IP using profiles
    const { count } = await supabaseAdmin
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .like('email', 'demo-%@example.com')
      .gte('created_at', oneHourAgo);

    // Global rate limit: max 20 demo accounts per hour total
    if (count !== null && count >= 20) {
      return new Response(
        JSON.stringify({ success: false, error: 'Demo account creation is temporarily limited. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate unique demo account credentials
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substring(2, 8)
    const demoEmail = `demo-${timestamp}-${randomSuffix}@example.com`
    const demoPassword = `demo-${randomSuffix}-${timestamp.toString(36)}`

    // Create the user account
    const { data: signUpData, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
      email: demoEmail,
      password: demoPassword,
      email_confirm: true,
    })

    if (signUpError) {
      console.error('Demo user creation error:', signUpError.message)
      throw new Error('Failed to create demo account')
    }

    if (!signUpData.user) {
      throw new Error('User creation failed')
    }

    // Create profile for the demo user
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        user_id: signUpData.user.id,
        display_name: "Demo User",
        email: demoEmail,
      })

    if (profileError) {
      console.error('Demo profile creation error:', profileError.message)
      throw new Error('Failed to create demo profile')
    }

    return new Response(
      JSON.stringify({
        success: true,
        credentials: {
          email: demoEmail,
          password: demoPassword
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error: any) {
    console.error('Error in create-demo-user function:', error.message)
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to create demo account. Please try again later.'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})