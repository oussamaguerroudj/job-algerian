import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyAdminToken } from '@/lib/admin-auth';

export async function GET(request) {
  const token = request.cookies.get('admin_session_token')?.value;
  const session = verifyAdminToken(token);

  if (!session) {
    return NextResponse.json({ error: 'غير مصرح به (Unauthorized)' }, { status: 401 });
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*, education(*), experience(*)')
    .order('submitted_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ candidates: data || [] });
}
