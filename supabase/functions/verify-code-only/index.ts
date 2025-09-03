import { serve } from '@std/http';
import { createClient } from '@supabase/supabase-js';

const PROJECT_URL = Deno.env.get('PROJECT_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SERVICE_ROLE_KEY')!;

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

    if (!email || !codeRaw) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'Email and code are required',
        }),
        {
          status: 400,
          headers: cors({ 'Content-Type': 'application/json' }),
        }
      );
    }

    const supabase = createClient(PROJECT_URL, SERVICE_ROLE_KEY);
    const code_hash = await sha256Hex(codeRaw);

    // 查有效验证码（未使用、未过期、匹配 email+hash）
    const { data: row, error: findErr } = await supabase
      .from('verification_codes')
      .select('id')
      .eq('email', email)
      .eq('code_hash', code_hash)
      .eq('used', false)
      .gte('expires_at', new Date().toISOString())
      .maybeSingle();

    if (findErr) throw findErr;
    if (!row) {
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

    // 驗證成功，但不創建用戶，只返回成功狀態
    return new Response(
      JSON.stringify({
        ok: true,
        message: 'Verification code is valid',
        email: email,
      }),
      {
        status: 200,
        headers: cors({ 'Content-Type': 'application/json' }),
      }
    );
  } catch (error) {
    console.error('Error in verify-code-only:', error);
    return new Response(
      JSON.stringify({
        ok: false,
        error: 'Internal server error',
      }),
      {
        status: 500,
        headers: cors({ 'Content-Type': 'application/json' }),
      }
    );
  }
});
