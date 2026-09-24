import { NextResponse } from 'next/server';
import { verifyAdminToken, getAdminCredentials } from '@/lib/admin-auth';
import { createClient } from '@/lib/supabase/server';

export async function GET(request) {
  const token = request.cookies.get('admin_session_token')?.value;
  const session = verifyAdminToken(token);

  if (!session) {
    return NextResponse.json({ isAdmin: false });
  }

  const supabase = createClient();
  const creds = await getAdminCredentials(supabase);

  return NextResponse.json({
    isAdmin: true,
    email: creds.email || session.email,
  });
}
