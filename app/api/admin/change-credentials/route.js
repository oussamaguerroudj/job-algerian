import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  getAdminCredentials,
  verifyPassword,
  saveAdminCredentials,
  verifyAdminToken,
  createAdminToken,
} from '@/lib/admin-auth';

export async function POST(request) {
  try {
    // 1. Verify admin session
    const token = request.cookies.get('admin_session_token')?.value;
    const session = verifyAdminToken(token);
    if (!session) {
      return NextResponse.json({ error: 'غير مصرح به. يرجى تسجيل الدخول أولاً.' }, { status: 401 });
    }

    const { currentPassword, newEmail, newPassword } = await request.json();

    if (!currentPassword || !newEmail || !newPassword) {
      return NextResponse.json({ error: 'جميع الحقول مطلوبة' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'يجب ألا تقل كلمة المرور الجديدة عن 6 أحرف' }, { status: 400 });
    }

    const supabase = createClient();
    const currentCreds = await getAdminCredentials(supabase);

    // 2. Verify current password
    const isCurrentValid = verifyPassword(currentPassword, currentCreds.password_hash);
    if (!isCurrentValid) {
      return NextResponse.json({ error: 'كلمة المرور الحالية غير صحيحة' }, { status: 403 });
    }

    // 3. Save new email & password directly to DB (old credentials become invalid immediately)
    await saveAdminCredentials(newEmail.trim(), newPassword, supabase);

    // 4. Issue a new session token with the new email
    const newToken = createAdminToken(newEmail.trim());

    const response = NextResponse.json({
      success: true,
      newEmail: newEmail.trim(),
      message: 'تم تحديث البريد الإلكتروني وكلمة المرور مباشرة في قاعدة البيانات. أصبحت البيانات القديمة ملغاة فوراً.',
    });

    response.cookies.set('admin_session_token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (err) {
    console.error('Error changing admin credentials:', err);
    return NextResponse.json({ error: 'حدث خطأ أثناء تحديث بيانات المسؤول' }, { status: 500 });
  }
}
