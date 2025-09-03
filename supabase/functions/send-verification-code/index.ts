import { serve } from '@std/http';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// === 环境变量（注意：名字不要以 SUPABASE_ 开头）===
const resend = new Resend(Deno.env.get('RESEND_API_KEY')!);
const PROJECT_URL = Deno.env.get('PROJECT_URL')!; // 例如 Dhttps://ooaicpvsjmmxuccqlzuh.supabase.co
const SERVICE_ROLE_KEY = Deno.env.get('SERVICE_ROLE_KEY')!; // Service Role Key
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') ?? 'TAG <onboarding@resend.dev>'; // 你自己的域名发件人，如 TAG <noreply@rainwang.art>

// 开发阶段先用 *；上线请改成你的站点域名，例如：https://tag.rainwang.art
const CORS_ORIGIN = '*';

// ---------- 小工具 ----------
function cors(headers: HeadersInit = {}) {
  return {
    'Access-Control-Allow-Origin': CORS_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, apikey, x-client-info',
    ...headers,
  };
}

function gen6Digits() {
  const u32 = new Uint32Array(1);
  crypto.getRandomValues(u32);
  return String(u32[0] % 1_000_000).padStart(6, '0');
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
  // 非强制，但能过滤明显非法格式
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return null;
  return e;
}

// ---------- 入口 ----------
serve(async req => {
  // 预检
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors() });

  // 只允许 POST
  if (req.method !== 'POST')
    return new Response(
      JSON.stringify({ ok: false, error: 'Method not allowed' }),
      {
        status: 405,
        headers: cors({ 'Content-Type': 'application/json' }),
      }
    );

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
    if (!email) throw new Error('Email is required');

    const supabase = createClient(PROJECT_URL, SERVICE_ROLE_KEY);

    // 60 秒内不重发（存在有效未使用记录就拒绝）
    const nowIso = new Date().toISOString();
    const { data: existing, error: exErr } = await supabase
      .from('verification_codes')
      .select('id, expires_at')
      .eq('email', email)
      .eq('used', false)
      .gte('expires_at', nowIso)
      .maybeSingle();

    if (exErr) throw exErr;
    if (existing) {
      const remain = Math.max(
        0,
        Math.floor(
          (new Date(existing.expires_at).getTime() - Date.now()) / 1000
        )
      );
      return new Response(
        JSON.stringify({ ok: false, reason: 'cooldown', remaining: remain }),
        {
          headers: cors({ 'Content-Type': 'application/json' }),
          status: 429,
        }
      );
    }

    const code = gen6Digits();
    const code_hash = await sha256Hex(code);
    const expires_at = new Date(Date.now() + 60 * 1000).toISOString();

    // 可选：清理过期/历史记录，避免一邮箱存很多行（不影响正确性）
    await supabase
      .from('verification_codes')
      .delete()
      .lt('expires_at', nowIso)
      .eq('email', email);

    const { error: insErr } = await supabase
      .from('verification_codes')
      .insert({ email, code_hash, expires_at, purpose: 'signup' });

    if (insErr) throw insErr;

    // 发送邮件（你已验证域名的话，把 FROM_EMAIL 设为 "TAG <noreply@rainwang.art>"）
    const { error: mailErr } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'TAG verification code（60 seconds valid）',
      html: `
        <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; line-height:1.6;">
          <p>Your verification code:</p>
          <p style="font-size:24px; letter-spacing:4px; font-weight:700;">${code}</p>
          <p style="color:#666;">The verification code is valid for 60 seconds, please do not leak.</p>
        </div>
      `,
      text: `Your verification code: ${code}\n60 seconds valid, please do not leak.`,
    });
    if (mailErr) throw mailErr;

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
