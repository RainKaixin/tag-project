import { serve } from '@std/http';
import { createClient } from '@supabase/supabase-js';

const PROJECT_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// 开发阶段先用 *；上线请改成你的前端域名（例如 https://tag.rainwang.art）
const CORS_ORIGIN = '*';

function cors(headers: HeadersInit = {}) {
  return {
    'Access-Control-Allow-Origin': CORS_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, apikey, x-client-info',
    ...headers,
  };
}

async function sha256Hex(s: string) {
  const buf = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(s)
  );
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function normalizeEmail(raw: unknown) {
  if (typeof raw !== 'string') return null;
  const e = raw.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return null;
  return e;
}

serve(async req => {
  // 预检
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors() });

  // 只允许 POST
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ ok: false, error: 'Method not allowed' }),
      {
        status: 405,
        headers: cors({ 'Content-Type': 'application/json' }),
      }
    );
  }

  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ ok: false, error: 'Invalid JSON body' }),
        {
          status: 400,
          headers: cors({ 'Content-Type': 'application/json' }),
        }
      );
    }

    const email = normalizeEmail(body?.email);
    const codeRaw = typeof body?.code === 'string' ? body.code.trim() : null;
    const password = typeof body?.password === 'string' ? body.password : null;

    if (!email || !codeRaw || !password) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'Email, code and password are required',
        }),
        {
          status: 400,
          headers: cors({ 'Content-Type': 'application/json' }),
        }
      );
    }

    const supabase = createClient(PROJECT_URL, SERVICE_ROLE_KEY);
    const code_hash = await sha256Hex(codeRaw);

    console.log(
      `[verify-code] Processing: email=${email}, code_hash=${code_hash}`
    );

    // 1) 查有效验证码（未使用、未过期、匹配 email+hash）
    const { data: row, error: findErr } = await supabase
      .from('verification_codes')
      .select('id')
      .eq('email', email)
      .eq('code_hash', code_hash)
      .eq('used', false)
      .gte('expires_at', new Date().toISOString())
      .maybeSingle();

    if (findErr) {
      console.error(`[verify-code] Database query error:`, findErr);
      throw findErr;
    }

    if (!row) {
      console.log(
        `[verify-code] No valid verification code found for email=${email}`
      );
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'Verification code error or expired',
        }),
        {
          status: 400,
          headers: cors({ 'Content-Type': 'application/json' }),
        }
      );
    }

    console.log(`[verify-code] Found valid code, row.id=${row.id}`);

    // 2) 创建并确认用户（如果用户已存在，返回 409，前端提示直接去登录）
    console.log(`[verify-code] Creating user for email=${email}`);

    const { error: createErr } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createErr) {
      console.error(`[verify-code] User creation error:`, createErr);
      // Supabase 返回的已存在错误 code 可能是 "user_already_exists" 或类似信息
      const msg = String(createErr.message ?? createErr);
      const conflict = /exist/i.test(msg);
      return new Response(
        JSON.stringify({
          ok: false,
          error: conflict
            ? 'The email has been registered, please log in directly'
            : msg,
          reason: conflict ? 'user_exists' : 'create_failed',
        }),
        {
          status: conflict ? 409 : 400,
          headers: cors({ 'Content-Type': 'application/json' }),
        }
      );
    }

    console.log(`[verify-code] User created successfully for email=${email}`);

    // 3) 标记验证码已使用
    const { error: updErr } = await supabase
      .from('verification_codes')
      .update({ used: true, used_at: new Date().toISOString() })
      .eq('id', row.id);

    if (updErr) throw updErr;

    return new Response(JSON.stringify({ ok: true }), {
      headers: cors({ 'Content-Type': 'application/json' }),
      status: 200,
    });
  } catch (e: any) {
    return new Response(
      JSON.stringify({ ok: false, error: e?.message ?? String(e) }),
      {
        headers: cors({ 'Content-Type': 'application/json' }),
        status: 400,
      }
    );
  }
});
