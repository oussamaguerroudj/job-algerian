'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function CandidateDetail({ params }) {
  const [candidate, setCandidate] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from('profiles')
      .select('*, education(*), experience(*)')
      .eq('id', params.id)
      .single()
      .then(({ data }) => setCandidate(data));
  }, [params.id]);

  if (!candidate) return <p className="p-8 text-center text-muted">جارٍ تحميل بيانات المترشح...</p>;

  return (
    <div className="min-h-screen bg-bg">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/admin" className="text-royal text-sm font-bold flex items-center gap-1 hover:underline">
            <span>→</span>
            <span>العودة للوحة الإدارة</span>
          </Link>
          <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full object-cover" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="card shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b pb-6">
            <div className="w-20 h-20 rounded-full bg-slate-100 overflow-hidden border-2 border-royal/30 shrink-0">
              {candidate.photo_url ? (
                <img src={candidate.photo_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-royal text-xl bg-blue/10">
                  {(candidate.full_name || '؟').slice(0, 2)}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-navy">{candidate.full_name || 'مترشح بدون اسم'}</h1>
              <p className="text-sm text-royal font-semibold mt-1">
                نسبة اكتمال الملف: {candidate.completion || 0}%
              </p>
              {candidate.submitted_at && (
                <p className="text-xs text-muted mt-1">
                  تاريخ الإرسال: {new Date(candidate.submitted_at).toLocaleDateString('ar-DZ')}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3 pt-4 text-sm">
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted font-medium">البريد الإلكتروني:</span>
              <span className="font-semibold text-navy dir-ltr">{candidate.email || '—'}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted font-medium">رقم الهاتف:</span>
              <span className="font-semibold text-navy dir-ltr">{candidate.phone || '—'}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted font-medium">تاريخ الميلاد:</span>
              <span className="font-semibold text-navy">{candidate.dob || '—'}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted font-medium">العنوان / الولاية:</span>
              <span className="font-semibold text-navy">{candidate.address || '—'}</span>
            </div>
            <div className="py-2">
              <span className="text-muted font-medium block mb-1">أخرى / معلومات إضافية (Other):</span>
              <p className="font-medium text-navy bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs sm:text-sm whitespace-pre-wrap">
                {candidate.other || 'لا توجد معلومات إضافية مسجلة'}
              </p>
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="card shadow-sm mb-6">
          <h2 className="text-lg font-bold text-navy mb-4 border-b pb-2">المسار التعليمي والشهادات</h2>
          {(candidate.education && candidate.education.length > 0) ? (
            candidate.education.map((e) => (
              <div key={e.id} className="border-r-2 border-royal pr-4 pb-4 mb-4 last:mb-0">
                <b className="text-navy text-base block">{e.school}</b>
                <div className="text-sm text-muted mt-0.5">
                  {e.degree} {e.field && `· ${e.field}`} {e.year && `(${e.year})`}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted">لم يتم إضافة مؤهلات تعليمية.</p>
          )}
        </div>

        {/* Experience */}
        <div className="card shadow-sm">
          <h2 className="text-lg font-bold text-navy mb-4 border-b pb-2">الخبرات المهنية السابقة</h2>
          {(candidate.experience && candidate.experience.length > 0) ? (
            candidate.experience.map((x) => (
              <div key={x.id} className="border-r-2 border-gold pr-4 pb-4 mb-4 last:mb-0">
                <b className="text-navy text-base block">{x.title}</b>
                <div className="text-sm font-semibold text-royal mt-0.5">
                  {x.company} · {x.start_date} إلى {x.end_date || 'حتى الآن'}
                </div>
                {x.description && <p className="text-sm text-slate-700 mt-2 leading-relaxed">{x.description}</p>}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted">لم يتم إضافة خبرات مهنية.</p>
          )}
        </div>
      </main>
    </div>
  );
}
