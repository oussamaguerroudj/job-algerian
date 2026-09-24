'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AdminDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [adminEmail, setAdminEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [confirmId, setConfirmId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    load();
    fetch('/api/admin/verify')
      .then((res) => res.json())
      .then((data) => {
        if (data.email) setAdminEmail(data.email);
      })
      .catch(() => {});
  }, []);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/candidates');
    const data = await res.json();
    setCandidates(data.candidates || []);
    setLoading(false);
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  async function handleDelete(id) {
    await fetch(`/api/admin/candidates/${id}`, { method: 'DELETE' });
    setConfirmId(null);
    load();
  }

  const filtered = candidates.filter((c) =>
    [c.full_name, c.email, c.phone, c.other].join(' ').toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-bg">
      <div className="border-b border-slate-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
            <div>
              <div className="font-extrabold text-navy leading-none">وظائف للجزائريين</div>
              <div className="text-[11px] text-royal font-bold">لوحة تحكم الإدارة والمراجعة</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {adminEmail && (
              <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full hidden sm:inline font-mono">
                {adminEmail}
              </span>
            )}
            <Link
              href="/admin/settings"
              className="btn-ghost text-xs px-3 py-1.5 font-bold flex items-center gap-1.5 border-slate-300 hover:border-royal"
            >
              <span>⚙️</span>
              <span>إعدادات الحساب</span>
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs text-red-600 font-bold border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-navy">لوحة إدارة المرشحين</h1>
          <p className="text-muted text-sm mt-1">مراجعة والاطلاع على الملفات المهنية للمتقدمين.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <p className="text-xs font-semibold text-muted">إجمالي المرشحين</p>
            <div className="text-3xl font-extrabold text-navy mt-1">{candidates.length}</div>
          </div>
          <div className="card">
            <p className="text-xs font-semibold text-muted">ملفات مكتملة (90%+)</p>
            <div className="text-3xl font-extrabold text-green-600 mt-1">
              {candidates.filter((c) => c.completion >= 90).length}
            </div>
          </div>
          <div className="card">
            <p className="text-xs font-semibold text-muted">ملفات قيد الاستكمال</p>
            <div className="text-3xl font-extrabold text-amber-500 mt-1">
              {candidates.filter((c) => c.completion < 90).length}
            </div>
          </div>
          <div className="card">
            <p className="text-xs font-semibold text-muted">متوسط اكتمال البيانات</p>
            <div className="text-3xl font-extrabold text-royal mt-1">
              {candidates.length ? Math.round(candidates.reduce((a, c) => a + (c.completion || 0), 0) / candidates.length) : 0}%
            </div>
          </div>
        </div>

        <div className="mb-6">
          <input
            className="input max-w-md bg-white"
            placeholder="بحث بالاسم، البريد، الهاتف أو التخصص..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="text-muted text-center py-12">جارٍ تحميل بيانات المرشحين...</p>
        ) : filtered.length === 0 ? (
          <div className="card text-center py-16">
            <img src="/logo.png" alt="Logo" className="w-16 h-16 rounded-full object-cover mx-auto mb-3 opacity-40" />
            <h3 className="font-bold text-navy text-lg">لا توجد ملفات مرشحين حتى الآن</h3>
            <p className="text-muted text-sm mt-1">
              بمجرد أن يُسجّل المتقدمون ويرسلوا ملفاتهم، ستظهر هنا للإدارة.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((c) => (
              <div key={c.id} className="card hover:shadow-lg hover:border-royal transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-royal to-navy text-white flex items-center justify-center font-bold overflow-hidden shrink-0 shadow-sm">
                      {c.photo_url ? (
                        <img src={c.photo_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        (c.full_name || '؟').slice(0, 2)
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-bold text-navy truncate">{c.full_name || 'مترشح بدون اسم'}</h3>
                      <p className="text-xs text-royal font-semibold truncate">{c.experience?.[0]?.title || 'مترشح'}</p>
                    </div>
                  </div>

                  <div className="text-xs text-muted mt-3 space-y-1">
                    <div className="dir-ltr text-right truncate">📧 {c.email || '—'}</div>
                    <div className="dir-ltr text-right truncate">📞 {c.phone || '—'}</div>
                    <div className="truncate">🎓 {c.education?.[0]?.school || '—'} ({c.education?.length || 0} مؤهل)</div>
                    {c.other && (
                      <div className="text-[11px] bg-slate-50 p-1.5 rounded text-slate-700 truncate mt-1">
                        📝 {c.other}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t">
                  <div className="flex justify-between text-xs text-muted mb-1">
                    <span>نسبة الاكتمال</span>
                    <span className="font-bold">{c.completion || 0}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-gradient-to-l from-royal to-gold transition-all"
                      style={{ width: `${c.completion || 0}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <Link
                      href={`/admin/candidates/${c.id}`}
                      className="btn-ghost text-xs px-3 py-1.5 font-bold"
                    >
                      عرض الملف الكامل
                    </Link>
                    {confirmId === c.id ? (
                      <div className="flex gap-2 text-xs">
                        <button onClick={() => handleDelete(c.id)} className="text-red-600 font-bold hover:underline">
                          تأكيد الحذف
                        </button>
                        <button onClick={() => setConfirmId(null)} className="text-muted hover:underline">
                          إلغاء
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmId(c.id)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        حذف
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
