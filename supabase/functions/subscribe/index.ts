import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://rainwang.art,http://localhost:3000',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'content-type',
};

serve(async req => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({
        success: false,
        code: 'METHOD_NOT_ALLOWED',
        message: 'Only POST method is allowed.',
      }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    // Parse request body
    const { email, source = 'about_page' } = await req.json();

    // Validate email
    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({
          success: false,
          code: 'INVALID_EMAIL',
          message: 'Please enter a valid email.',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Trim and lowercase email
    const cleanEmail = email.trim().toLowerCase();

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail) || cleanEmail.length >= 254) {
      return new Response(
        JSON.stringify({
          success: false,
          code: 'INVALID_EMAIL',
          message: 'Please enter a valid email.',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if subscriber exists
    const { data: existingSubscriber, error: selectError } = await supabase
      .from('subscribers')
      .select('id, status')
      .eq('email', cleanEmail)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      // PGRST116 = no rows returned
      console.error('Database select error:', selectError);
      return new Response(
        JSON.stringify({
          success: false,
          code: 'DB_ERROR',
          message: 'Something went wrong. Please try again later.',
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    let resultCode = '';
    let resultMessage = '';

    if (!existingSubscriber) {
      // New subscriber - insert
      const { error: insertError } = await supabase.from('subscribers').insert({
        email: cleanEmail,
        status: 'active',
        source,
      });

      if (insertError) {
        console.error('Database insert error:', insertError);
        return new Response(
          JSON.stringify({
            success: false,
            code: 'DB_ERROR',
            message: 'Something went wrong. Please try again later.',
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      resultCode = 'SUBSCRIBED';
      resultMessage = 'Thanks! Please watch your inbox for TAG updates.';
    } else if (existingSubscriber.status === 'active') {
      // Already subscribed
      resultCode = 'ALREADY_SUBSCRIBED';
      resultMessage = "You're already subscribed—thank you!";
    } else if (existingSubscriber.status === 'unsubscribed') {
      // Resubscribe
      const { error: updateError } = await supabase
        .from('subscribers')
        .update({
          status: 'active',
          unsubscribed_at: null,
        })
        .eq('id', existingSubscriber.id);

      if (updateError) {
        console.error('Database update error:', updateError);
        return new Response(
          JSON.stringify({
            success: false,
            code: 'DB_ERROR',
            message: 'Something went wrong. Please try again later.',
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      resultCode = 'RESUBSCRIBED';
      resultMessage = "Welcome back! You're subscribed again.";
    }

    // Log the operation
    console.log(`${cleanEmail} | ${source} | ${resultCode}`);

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        code: resultCode,
        message: resultMessage,
        data: { email: cleanEmail },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        code: 'UNEXPECTED_ERROR',
        message: 'Something went wrong. Please try again later.',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
