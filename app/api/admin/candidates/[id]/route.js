import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyAdminToken } from '@/lib/admin-auth';

export async function DELETE(request, { params }) {
  const token = request.cookies.get('admin_session_token')?.value;
  const session = verifyAdminToken(token);

  if (!session) {
    return NextResponse.json({ error: 'غير مصرح به (Unauthorized)' }, { status: 401 });
  }

  const supabase = createClient();
  const { error } = await supabase.from('profiles').delete().eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
