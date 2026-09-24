'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

const TABS = [
  { id: 'personal', label: '1. المعلومات الشخصية' },
  { id: 'education', label: '2. المسار التعليمي' },
  { id: 'experience', label: '3. الخبرة المهنية' },
  { id: 'review', label: '4. مراجعة وإرسال الطلب' },
];

export default function ApplyPage() {
  const supabase = createClient();
  const router = useRouter();
  const [tab, setTab] = useState('personal');
  const [personal, setPersonal] = useState({
    full_name: '',
    dob: '',
    email: '',
    phone: '',
    address: '',
    other: '',
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [education, setEducation] = useState([]);
  const [eduDraft, setEduDraft] = useState({ school: '', degree: '', field: '', year: '' });
  const [experience, setExperience] = useState([]);
  const [expDraft, setExpDraft] = useState({ company: '', title: '', start_date: '', end_date: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  function handlePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function addEducation() {
    if (!eduDraft.school) return;
    setEducation([...education, eduDraft]);
    setEduDraft({ school: '', degree: '', field: '', year: '' });
  }

  function addExperience() {
    if (!expDraft.company) return;
    setExperience([...experience, expDraft]);
    setExpDraft({ company: '', title: '', start_date: '', end_date: '', description: '' });
  }

  async function handleSubmit() {
    setErrorMessage('');
    if (!personal.full_name || !personal.email) {
      setErrorMessage('يرجى ملء الاسم الكامل والبريد الإلكتروني على الأقل قبل إرسال الطلب.');
      setTab('personal');
      return;
    }

    setSubmitting(true);
    try {
      const profileId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : ('id-' + Date.now());

      let photo_url = '';
      if (photoFile) {
        const path = `${profileId}/${Date.now()}-${photoFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const { error: upErr } = await supabase.storage.from('avatars').upload(path, photoFile, { upsert: true });
        if (!upErr) {
          const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path);
          photo_url = pub.publicUrl;
        }
      }

      const completion = 60 + Math.min(40, education.length * 10 + experience.length * 10);

      // Insert profile directly without needing auth
      const { error: profErr } = await supabase.from('profiles').insert({
        id: profileId,
        full_name: personal.full_name,
        dob: personal.dob || null,
        email: personal.email,
        phone: personal.phone,
        address: personal.address,
        other: personal.other,
        photo_url,
        completion,
        submitted_at: new Date().toISOString(),
      });

      if (profErr) {
        throw new Error(profErr.message);
      }

      // Insert education entries
      if (education.length > 0) {
        const { error: eduErr } = await supabase.from('education').insert(
          education.map((e) => ({
            profile_id: profileId,
            school: e.school,
            degree: e.degree,
            field: e.field,
            year: e.year,
          }))
        );
        if (eduErr) console.warn('Education insert warning:', eduErr);
      }

      // Insert experience entries
      if (experience.length > 0) {
        const { error: expErr } = await supabase.from('experience').insert(
          experience.map((x) => ({
            profile_id: profileId,
            company: x.company,
            title: x.title,
            start_date: x.start_date,
            end_date: x.end_date,
            description: x.description,
          }))
        );
        if (expErr) console.warn('Experience insert warning:', expErr);
      }

      setSubmitting(false);
      router.push('/apply/success');
    } catch (err) {
      console.error(err);
      setSubmitting(false);
      setErrorMessage(err.message || 'حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى.');
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
            <div className="leading-tight">
              <span className="font-extrabold text-navy text-base block">وظائف للجزائريين</span>
              <span className="text-xs text-royal font-semibold block">تقديم طلب توظيف مباشر</span>
            </div>
          </Link>
          <div className="hidden sm:flex items-center gap-5 text-xs font-semibold text-slate-600">
            <Link href="/" className="hover:text-royal transition">الرئيسية</Link>
            <Link href="/how-it-works" className="hover:text-royal transition">كيف تعمل المنصة</Link>
            <Link href="/about" className="hover:text-royal transition">من نحن</Link>
            <Link href="/faq" className="hover:text-royal transition">الأسئلة الشائعة</Link>
          </div>
          <Link href="/" className="text-xs font-semibold text-muted hover:text-navy">
            ← الرئيسية
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-navy">نموذج التقديم للوظائف</h1>
          <p className="text-muted text-sm mt-1">
            لا حاجة لإنشاء حساب أو تسجيل الدخول. املأ بياناتك ومؤهلاتك لإرسالها لمسؤولي التوظيف مباشرة.
          </p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 text-red-700 text-sm p-4 rounded-xl mb-6 border border-red-200 flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Tab navigation */}
        <div className="flex gap-4 sm:gap-6 border-b border-slate-200 mb-8 overflow-x-auto pb-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`pb-3 font-bold text-sm sm:text-base whitespace-nowrap transition border-b-2 ${
                tab === t.id
                  ? 'text-royal border-royal'
                  : 'text-muted border-transparent hover:text-navy'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Personal */}
        {tab === 'personal' && (
          <div className="card space-y-5">
            <h2 className="text-lg font-bold text-navy border-b pb-2">المعلومات الشخصية</h2>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                الصورة الشخصية (اختياري)
              </label>
              <label className="w-24 h-24 rounded-full bg-blue-50 border-2 border-dashed border-royal flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-90 transition shadow-inner">
                {photoPreview ? (
                  <img src={photoPreview} alt="معاينة الصورة" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-royal">
                    <span className="text-2xl block leading-none">+</span>
                    <span className="text-[10px] font-bold">إضافة صورة</span>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
              </label>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  الاسم الكامل <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  className="input"
                  placeholder="مثال: كريم بلقاسم"
                  value={personal.full_name}
                  onChange={(e) => setPersonal({ ...personal, full_name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">تاريخ الميلاد</label>
                <input
                  className="input"
                  type="date"
                  value={personal.dob}
                  onChange={(e) => setPersonal({ ...personal, dob: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  البريد الإلكتروني <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="email"
                  className="input dir-ltr text-right"
                  placeholder="email@example.com"
                  value={personal.email}
                  onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">رقم الهاتف</label>
                <input
                  className="input dir-ltr text-right"
                  placeholder="06 XX XX XX XX"
                  value={personal.phone}
                  onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">العنوان / الولاية</label>
              <input
                className="input"
                placeholder="مثال: الجزائر العاصمة، وهران، سطيف، قسنطينة..."
                value={personal.address}
                onChange={(e) => setPersonal({ ...personal, address: e.target.value })}
              />
            </div>

            {/* Other / Additional info */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                أخرى / معلومات إضافية (Other / Additional Details)
              </label>
              <textarea
                rows="3"
                className="input"
                placeholder="أدخل أي مهارات إضافية، شهادات أخرى، لغات تتقنها، رابط حساب LinkedIn أو GitHub، أو نبذة تعريفية عنك..."
                value={personal.other}
                onChange={(e) => setPersonal({ ...personal, other: e.target.value })}
              />
              <span className="text-xs text-muted block -mt-2">
                حقل اختياري لإضافة أي تفاصيل ترغب في إطلاع مسؤولي التوظيف عليها.
              </span>
            </div>

            <div className="pt-2 flex justify-end">
              <button className="btn-primary" onClick={() => setTab('education')}>
                <span>المتابعة إلى المسار التعليمي</span>
                <span>←</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Education */}
        {tab === 'education' && (
          <div className="card space-y-5">
            <h2 className="text-lg font-bold text-navy border-b pb-2">المسار التعليمي والشهادات</h2>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="font-semibold text-sm text-navy mb-2">إضافة مؤهل جديد:</div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">المؤسسة التعليمية / الجامعة</label>
                  <input
                    className="input mb-0"
                    placeholder="مثال: جامعة هواري بومدين للعلوم والتكنولوجيا (USTHB)"
                    value={eduDraft.school}
                    onChange={(e) => setEduDraft({ ...eduDraft, school: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">الدرجة / الشهادة</label>
                  <input
                    className="input mb-0"
                    placeholder="مثال: ليسانس، ماستر، مهندس دولة..."
                    value={eduDraft.degree}
                    onChange={(e) => setEduDraft({ ...eduDraft, degree: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">التخصص</label>
                  <input
                    className="input mb-0"
                    placeholder="مثال: إعلام آلي، هندسة مدنية، مالية..."
                    value={eduDraft.field}
                    onChange={(e) => setEduDraft({ ...eduDraft, field: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">سنة التخرج</label>
                  <input
                    className="input mb-0"
                    placeholder="مثال: 2024"
                    value={eduDraft.year}
                    onChange={(e) => setEduDraft({ ...eduDraft, year: e.target.value })}
                  />
                </div>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  className="bg-royal/10 text-royal hover:bg-royal hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition"
                  onClick={addEducation}
                >
                  + إضافة المؤهل للقائمة
                </button>
              </div>
            </div>

            {education.length > 0 ? (
              <div className="space-y-3 pt-2">
                <h3 className="font-semibold text-sm text-navy">المؤهلات المضافة ({education.length}):</h3>
                {education.map((e, i) => (
                  <div key={i} className="border border-slate-200 bg-white rounded-xl p-4 flex justify-between items-center shadow-sm">
                    <div>
                      <b className="text-navy block">{e.school}</b>
                      <div className="text-sm text-muted mt-0.5">
                        {e.degree} {e.field && `· ${e.field}`} {e.year && `(${e.year})`}
                      </div>
                    </div>
                    <button
                      onClick={() => setEducation(education.filter((_, idx) => idx !== i))}
                      className="text-red-500 hover:text-red-700 text-sm font-bold p-2"
                      title="حذف"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted italic">يمكنك إضافة مؤهل تعليمي أو المتابعة إذا لم ترغب في إضافته الآن.</p>
            )}

            <div className="flex justify-between pt-4 border-t">
              <button className="btn-ghost" onClick={() => setTab('personal')}>
                → السابق (المعلومات الشخصية)
              </button>
              <button className="btn-primary" onClick={() => setTab('experience')}>
                <span>المتابعة إلى الخبرة المهنية</span>
                <span>←</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: Experience */}
        {tab === 'experience' && (
          <div className="card space-y-5">
            <h2 className="text-lg font-bold text-navy border-b pb-2">الخبرة المهنية السابقة</h2>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="font-semibold text-sm text-navy mb-2">إضافة خبرة سابقة:</div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">الشركة أو المؤسسة</label>
                  <input
                    className="input mb-0"
                    placeholder="مثال: سوناطراك، جيزي، شركة خاصة..."
                    value={expDraft.company}
                    onChange={(e) => setExpDraft({ ...expDraft, company: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">المسمى الوظيفي</label>
                  <input
                    className="input mb-0"
                    placeholder="مثال: مهندس برمجيات، محاسب..."
                    value={expDraft.title}
                    onChange={(e) => setExpDraft({ ...expDraft, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">تاريخ البدء</label>
                  <input
                    className="input mb-0"
                    placeholder="مثال: 01/2022"
                    value={expDraft.start_date}
                    onChange={(e) => setExpDraft({ ...expDraft, start_date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">تاريخ الانتهاء</label>
                  <input
                    className="input mb-0"
                    placeholder="مثال: 12/2023 أو الحاضر"
                    value={expDraft.end_date}
                    onChange={(e) => setExpDraft({ ...expDraft, end_date: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">وصف المهام والمسؤوليات</label>
                <textarea
                  rows="2"
                  className="input mb-0"
                  placeholder="اذكر بإيجاز أبرز ما قمت به في هذا المنصب..."
                  value={expDraft.description}
                  onChange={(e) => setExpDraft({ ...expDraft, description: e.target.value })}
                />
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  className="bg-royal/10 text-royal hover:bg-royal hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition"
                  onClick={addExperience}
                >
                  + إضافة الخبرة للقائمة
                </button>
              </div>
            </div>

            {experience.length > 0 ? (
              <div className="space-y-3 pt-2">
                <h3 className="font-semibold text-sm text-navy">الخبرات المضافة ({experience.length}):</h3>
                {experience.map((x, i) => (
                  <div key={i} className="border border-slate-200 bg-white rounded-xl p-4 flex justify-between items-start shadow-sm">
                    <div>
                      <b className="text-navy text-base block">{x.title}</b>
                      <div className="text-sm font-medium text-royal">
                        {x.company} · {x.start_date} إلى {x.end_date || 'حتى الآن'}
                      </div>
                      {x.description && <p className="text-sm text-muted mt-2 leading-relaxed">{x.description}</p>}
                    </div>
                    <button
                      onClick={() => setExperience(experience.filter((_, idx) => idx !== i))}
                      className="text-red-500 hover:text-red-700 text-sm font-bold p-2"
                      title="حذف"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted italic">يمكنك المتابعة إذا لم تكن لديك خبرة سابقة (للخريجين الجدد).</p>
            )}

            <div className="flex justify-between pt-4 border-t">
              <button className="btn-ghost" onClick={() => setTab('education')}>
                → السابق (المسار التعليمي)
              </button>
              <button className="btn-primary" onClick={() => setTab('review')}>
                <span>المتابعة إلى مراجعة وإرسال الطلب</span>
                <span>←</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: Review */}
        {tab === 'review' && (
          <div className="card space-y-4">
            <h2 className="text-lg font-bold text-navy border-b pb-2">مراجعة بيانات الطلب قبل الإرسال</h2>

            <div className="flex items-center gap-4 py-2">
              <div className="w-16 h-16 rounded-full bg-slate-100 overflow-hidden border">
                {photoPreview ? (
                  <img src={photoPreview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="w-full h-full flex items-center justify-center text-muted font-bold">لا صورة</span>
                )}
              </div>
              <div>
                <h3 className="font-bold text-navy text-lg">{personal.full_name || 'لم يُحدد اسم'}</h3>
                <span className="text-sm text-muted dir-ltr block text-right">{personal.email || '—'}</span>
              </div>
            </div>

            <div className="divide-y divide-slate-100 text-sm">
              <div className="flex justify-between py-2.5">
                <span className="text-muted font-medium">رقم الهاتف:</span>
                <span className="font-semibold text-navy dir-ltr">{personal.phone || '—'}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-muted font-medium">تاريخ الميلاد:</span>
                <span className="font-semibold text-navy">{personal.dob || '—'}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-muted font-medium">العنوان / الولاية:</span>
                <span className="font-semibold text-navy">{personal.address || '—'}</span>
              </div>
              <div className="py-2.5">
                <span className="text-muted font-medium block mb-1">أخرى / معلومات إضافية (Other):</span>
                <p className="font-medium text-navy bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs sm:text-sm whitespace-pre-wrap">
                  {personal.other || 'لا توجد معلومات إضافية مُدخلة'}
                </p>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-muted font-medium">المؤهلات التعليمية:</span>
                <span className="font-bold text-royal">{education.length} مؤهل(ات)</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-muted font-medium">الخبرات المهنية:</span>
                <span className="font-bold text-royal">{experience.length} خبرة(ات)</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <button className="btn-ghost" onClick={() => setTab('experience')}>
                → السابق (الخبرات)
              </button>
              <button
                disabled={submitting}
                className="btn-primary px-8"
                onClick={handleSubmit}
              >
                {submitting ? 'جارٍ إرسال الطلب...' : '✓ تأكيد وإرسال الطلب الآن'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
