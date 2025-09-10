import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// 允许的来源（按需增减）
const ALLOW_ORIGINS = new Set([
  'https://techartguide.com',   
  'https://www.techartguide.com',
  'https://rainwang.art',
  'https://tag-project-49wp5aico-rain-wangs-projects.vercel.app/',
  'http://localhost:3000',
])

function buildCorsHeaders(req: Request) {
  const origin = req.headers.get('Origin') || ''
  const allowOrigin = ALLOW_ORIGINS.has(origin) ? origin : 'https://www.techartguide.com'
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    // 注意：要包含 supabase-js 常带的几个头
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Vary': 'Origin',
  }
}

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req)

  // 预检
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({
      success: false,
      code: 'METHOD_NOT_ALLOWED',
      message: 'Only POST method is allowed.',
    }), { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  try {
    const { email, source = 'about_page' } = await req.json()

    if (!email || typeof email !== 'string') {
      return new Response(JSON.stringify({
        success: false, code: 'INVALID_EMAIL', message: 'Please enter a valid email.',
      }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const cleanEmail = email.trim().toLowerCase()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(cleanEmail) || cleanEmail.length >= 254) {
      return new Response(JSON.stringify({
        success: false, code: 'INVALID_EMAIL', message: 'Please enter a valid email.',
      }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: existing, error: selErr } = await supabase
      .from('subscribers')
      .select('id, status')
      .eq('email', cleanEmail)
      .single()

    // PGRST116 = no rows；其余报错才算异常
    if (selErr && selErr.code !== 'PGRST116') {
      console.error('Database select error:', selErr)
      return new Response(JSON.stringify({
        success: false, code: 'DB_ERROR', message: 'Something went wrong. Please try again later.',
      }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    let code = '', message = ''

    if (!existing) {
      const { error: insErr } = await supabase.from('subscribers').insert({
        email: cleanEmail, status: 'active', source,
      })
      if (insErr) {
        console.error('Database insert error:', insErr)
        return new Response(JSON.stringify({
          success: false, code: 'DB_ERROR', message: 'Something went wrong. Please try again later.',
        }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }
      code = 'SUBSCRIBED'; message = 'Thanks! Please watch your inbox for TAG updates.'
    } else if (existing.status === 'active') {
      code = 'ALREADY_SUBSCRIBED'; message = "You're already subscribed—thank you!"
    } else {
      const { error: updErr } = await supabase
        .from('subscribers')
        .update({ status: 'active', unsubscribed_at: null })
        .eq('id', existing.id)
      if (updErr) {
        console.error('Database update error:', updErr)
        return new Response(JSON.stringify({
          success: false, code: 'DB_ERROR', message: 'Something went wrong. Please try again later.',
        }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }
      code = 'RESUBSCRIBED'; message = "Welcome back! You're subscribed again."
    }

    console.log(`${cleanEmail} | ${source} | ${code}`)

    return new Response(JSON.stringify({
      success: true, code, message, data: { email: cleanEmail },
    }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(JSON.stringify({
      success: false, code: 'UNEXPECTED_ERROR', message: 'Something went wrong. Please try again later.',
    }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
