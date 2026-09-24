import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminCredentials, verifyPassword, createAdminToken } from '@/lib/admin-auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' }, { status: 400 });
    }

    const supabase = createClient();
    const creds = await getAdminCredentials(supabase);

    // Validate email (case-insensitive) and password
    const emailMatch = creds.email.toLowerCase().trim() === email.toLowerCase().trim();
    const passMatch = verifyPassword(password, creds.password_hash);

    if (!emailMatch || !passMatch) {
      return NextResponse.json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }, { status: 401 });
    }

    // Create session token
    const token = createAdminToken(creds.email);

    const response = NextResponse.json({ success: true, email: creds.email });

    // Set secure HTTP-only cookie
    response.cookies.set('admin_session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (err) {
    console.error('Admin login error:', err);
    return NextResponse.json({ error: 'حدث خطأ في الخادم أثناء تسجيل الدخول' }, { status: 500 });
  }
}
