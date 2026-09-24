'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

const TABS = [
  { id: 'personal', label: '1. المعلومات الشخصية' },
  { id: 'education', label: '2. المسار التعليمي' },
  { id: 'experience', label: '3. الخبرات المهنية' },
  { id: 'review', label: '4. مراجعة وإرسال الطلب' },
];

const STEPS = [
  ['01', 'أدخل معلوماتك الأساسية', 'املأ بيانات الاتصال، صورتك الشخصية، ومعلوماتك الإضافية في حقل (أخرى).'],
  ['02', 'أضف مؤهلاتك العلمية', 'سجّل جامعتك وتخصصك والشهادات التي حصلت عليها.'],
  ['03', 'أضف خبراتك العملية', 'اذكر الشركات والمناصب والمسؤوليات السابقة (أو تجاوزها إن كنت خريجاً جديداً).'],
  ['04', 'أرسل طلبك بنقرة واحدة', 'راجع بياناتك وأرسل طلبك مباشرة لمراجعي التوظيف.'],
];

export default function HomePage() {
  const supabase = createClient();
  const formRef = useRef(null);

  // Form is hidden by default as requested
  const [showForm, setShowForm] = useState(false);

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
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  function openAndScrollToForm() {
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

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

      if (profErr) throw new Error(profErr.message);

      if (education.length > 0) {
        await supabase.from('education').insert(
          education.map((e) => ({
            profile_id: profileId,
            school: e.school,
            degree: e.degree,
            field: e.field,
            year: e.year,
          }))
        );
      }

      if (experience.length > 0) {
        await supabase.from('experience').insert(
          experience.map((x) => ({
            profile_id: profileId,
            company: x.company,
            title: x.title,
            start_date: x.start_date,
            end_date: x.end_date,
            description: x.description,
          }))
        );
      }

      setSubmitting(false);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitting(false);
      setErrorMessage(err.message || 'حدث خطأ أثناء إرسال الطلب، يرجى المحاولة ثانية.');
    }
  }

  function resetForm() {
    setPersonal({ full_name: '', dob: '', email: '', phone: '', address: '', other: '' });
    setPhotoFile(null);
    setPhotoPreview('');
    setEducation([]);
    setExperience([]);
    setSubmitted(false);
    setTab('personal');
    setShowForm(false);
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-30 backdrop-blur bg-white/95 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Job for Algerians" className="w-12 h-12 rounded-full object-cover shadow-sm border border-slate-200" />
            <div className="leading-tight">
              <span className="block font-extrabold text-navy text-lg">وظائف للجزائريين</span>
              <span className="block text-xs font-semibold text-royal tracking-wide">Job for Algerians</span>
            </div>
          </Link>

          {/* Links for How it works, About us, FAQ */}
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-700">
            <Link href="/" className="text-royal transition">الرئيسية</Link>
            <Link href="/how-it-works" className="hover:text-royal transition">كيف تعمل المنصة</Link>
            <Link href="/about" className="hover:text-royal transition">من نحن</Link>
            <Link href="/faq" className="hover:text-royal transition">الأسئلة الشائعة</Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openAndScrollToForm}
              className="btn-primary text-sm px-5 py-2.5 shadow-sm hover:shadow transition"
            >
              <span>قدّم طلبك الآن</span>
              <span>←</span>
            </button>
            <Link
              href="/admin/login"
              className="btn-ghost text-xs px-3.5 py-2 text-slate-600 hover:text-royal"
            >
              دخول الإدارة
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-navy text-white py-16 md:py-24 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-royal/40 text-goldLight text-xs font-bold px-3.5 py-1.5 rounded-full mb-4 border border-royal/50">
              تقديم مباشر فوري — بدون الحاجة لإنشاء حساب أو كلمة مرور 🇩🇿 🇪🇺
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-snug">
              ابنِ ملفك المهني وقدّم طلبك مباشرة
            </h1>
            <p className="text-slate-300 mt-5 text-base md:text-lg leading-relaxed max-w-lg">
              منصة <strong>Job for Algerians</strong> تتيح للكفاءات الجزائرية التقديم الفوري وبناء ملف وظيفي متكامل وموثق ليصل إلى أصحاب العمل والشركات في دقائق.
            </p>
            <div className="flex gap-4 mt-8 flex-wrap">
              <button
                onClick={openAndScrollToForm}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-gold to-goldLight text-navy font-bold px-8 py-3.5 rounded-xl shadow-lg hover:opacity-95 transition text-base"
              >
                <span>قدّم طلبك الآن مباشرة</span>
                <span>←</span>
              </button>
              <Link href="/how-it-works" className="btn-ghost text-white border-white/25 hover:bg-white/10">
                كيف تعمل المنصة؟
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-royal to-gold rounded-full blur-xl opacity-40 group-hover:opacity-75 transition duration-500"></div>
              <img
                src="/logo.png"
                alt="Job for Algerians Logo"
                className="relative w-64 h-64 md:w-80 md:h-80 rounded-full object-cover shadow-2xl border-4 border-white/10 bg-navy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation Cards */}
      <section className="py-12 max-w-6xl mx-auto px-6 grid sm:grid-cols-3 gap-6 -mt-8 relative z-10">
        <Link href="/how-it-works" className="card p-6 hover:shadow-lg hover:border-royal transition group">
          <div className="w-10 h-10 rounded-xl bg-blue/10 text-royal text-xl flex items-center justify-center mb-3">
            📋
          </div>
          <h3 className="font-bold text-navy text-lg group-hover:text-royal transition">كيف تعمل المنصة؟</h3>
          <p className="text-muted text-xs sm:text-sm mt-1 leading-relaxed">
            دليل كامل بالخطوات الأربعة من ملء الاستمارة إلى التواصل مع أصحاب العمل.
          </p>
        </Link>

        <Link href="/about" className="card p-6 hover:shadow-lg hover:border-royal transition group">
          <div className="w-10 h-10 rounded-xl bg-gold/15 text-gold text-xl flex items-center justify-center mb-3">
            🤝
          </div>
          <h3 className="font-bold text-navy text-lg group-hover:text-royal transition">من نحن ورؤيتنا</h3>
          <p className="text-muted text-xs sm:text-sm mt-1 leading-relaxed">
            تعرف على مهمتنا في ربط الكفاءات الجزائرية بفرص العمل والشركات الشريكة.
          </p>
        </Link>

        <Link href="/faq" className="card p-6 hover:shadow-lg hover:border-royal transition group">
          <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 text-xl flex items-center justify-center mb-3">
            ❓
          </div>
          <h3 className="font-bold text-navy text-lg group-hover:text-royal transition">الأسئلة الشائعة (FAQ)</h3>
          <p className="text-muted text-xs sm:text-sm mt-1 leading-relaxed">
            إجابات عن مجانية التقديم، حماية البيانات، وكيفية مراجعة السير الذاتية.
          </p>
        </Link>
      </section>

      {/* Application Form Section: ONLY DISPLAYED WHEN CLICKING 'APPLY NOW' */}
      <div ref={formRef}>
        {showForm && (
          <section id="apply-form" className="py-16 max-w-4xl mx-auto px-6 w-full animate-fadeIn">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-200">
              <div>
                <span className="text-royal font-bold text-xs uppercase tracking-wider bg-blue/10 px-3 py-1 rounded-full">
                  استمارة التقديم المباشر
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-navy mt-2">نموذج التقديم للوظائف</h2>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="text-xs text-muted hover:text-red-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
              >
                ✕ إغلاق الاستمارة
              </button>
            </div>

            {submitted ? (
              <div className="card text-center py-16 shadow-lg border-green-200 bg-white">
                <img src="/logo.png" alt="Job for Algerians" className="w-20 h-20 rounded-full object-cover mx-auto mb-6 border-2 border-gold/40 shadow-md" />
                <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-4 border border-green-200">
                  <span className="text-3xl">✓</span>
                </div>
                <h3 className="text-2xl font-extrabold text-navy">تم استلام طلبك بنجاح!</h3>
                <p className="text-muted text-sm mt-3 max-w-md mx-auto leading-relaxed">
                  شكراً لك، تم حفظ ملفك المهني بنجاح وأصبح متاحاً لدى مسؤولي التوظيف للمراجعة والتواصل معك.
                </p>
                <div className="mt-8">
                  <button onClick={resetForm} className="btn-primary">
                    تقديم طلب جديد
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-6 sm:p-8">
                {errorMessage && (
                  <div className="bg-red-50 text-red-700 text-sm p-4 rounded-xl mb-6 border border-red-200 flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Step tabs */}
                <div className="flex gap-3 sm:gap-6 border-b border-slate-200 mb-8 overflow-x-auto pb-1">
                  {TABS.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      className={`pb-3 font-bold text-xs sm:text-sm whitespace-nowrap transition border-b-2 ${
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
                  <div className="space-y-5">
                    <h3 className="text-lg font-bold text-navy border-b pb-2">1. المعلومات الشخصية</h3>

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
                          placeholder="مثال: يوسف بلايلي"
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
                        placeholder="مثال: الجزائر العاصمة، وهران، قسنطينة، سطيف..."
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
                  <div className="space-y-5">
                    <h3 className="text-lg font-bold text-navy border-b pb-2">2. المسار التعليمي والشهادات</h3>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                      <div className="font-semibold text-sm text-navy mb-2">إضافة مؤهل جديد:</div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">المؤسسة التعليمية / الجامعة</label>
                          <input
                            className="input mb-0"
                            placeholder="مثال: جامعة هواري بومدين (USTHB)"
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
                            placeholder="مثال: إعلام آلي، هندسة، تجارة..."
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
                        <h4 className="font-semibold text-sm text-navy">المؤهلات المضافة ({education.length}):</h4>
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
                      <p className="text-sm text-muted italic">يمكنك إضافة مؤهل تعليمي أو المتابعة للخطوة التالية.</p>
                    )}

                    <div className="flex justify-between pt-4 border-t">
                      <button className="btn-ghost" onClick={() => setTab('personal')}>
                        → السابق (المعلومات الشخصية)
                      </button>
                      <button className="btn-primary" onClick={() => setTab('experience')}>
                        <span>المتابعة إلى الخبرات المهنية</span>
                        <span>←</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 3: Experience */}
                {tab === 'experience' && (
                  <div className="space-y-5">
                    <h3 className="text-lg font-bold text-navy border-b pb-2">3. الخبرة المهنية السابقة</h3>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                      <div className="font-semibold text-sm text-navy mb-2">إضافة خبرة سابقة:</div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">الشركة أو المؤسسة</label>
                          <input
                            className="input mb-0"
                            placeholder="مثال: سونلغاز، بريد الجزائر، شركة خاصة..."
                            value={expDraft.company}
                            onChange={(e) => setExpDraft({ ...expDraft, company: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">المسمى الوظيفي</label>
                          <input
                            className="input mb-0"
                            placeholder="مثال: مطور ويب، مسؤول شبكات..."
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
                        <h4 className="font-semibold text-sm text-navy">الخبرات المضافة ({experience.length}):</h4>
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
                      <p className="text-sm text-muted italic">يمكنك المتابعة إذا لم تكن لديك خبرة سابقة.</p>
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
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-navy border-b pb-2">4. مراجعة بيانات الطلب قبل الإرسال</h3>

                    <div className="flex items-center gap-4 py-2">
                      <div className="w-16 h-16 rounded-full bg-slate-100 overflow-hidden border">
                        {photoPreview ? (
                          <img src={photoPreview} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="w-full h-full flex items-center justify-center text-muted font-bold text-xs">لا صورة</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-navy text-lg">{personal.full_name || 'لم يُحدد اسم'}</h4>
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
              </div>
            )}
          </section>
        )}
      </div>

      {/* How It Works Section */}
      <section className="py-16 max-w-6xl mx-auto px-6 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-royal font-bold text-xs uppercase tracking-wider bg-blue/10 px-3 py-1 rounded-full">
            بساطة وسرعة
          </span>
          <h2 className="text-3xl font-extrabold text-navy mt-2">كيف تعمل المنصة؟</h2>
          <p className="text-muted text-sm mt-2">أربع خطوات سهلة ومباشرة للانضمام لكبرى الشركات</p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {STEPS.map(([n, t, d]) => (
            <div key={n} className="card hover:border-royal/40 hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-blue/10 text-royal font-black flex items-center justify-center text-sm mb-4">
                {n}
              </div>
              <h3 className="font-bold text-navy text-lg">{t}</h3>
              <p className="text-sm text-muted mt-2 leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/how-it-works" className="text-royal font-bold text-sm hover:underline">
            عرض الدليل والشرح التفصيلي للتقديم ←
          </Link>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 bg-navy text-white text-center px-6">
        <div className="max-w-2xl mx-auto">
          <img src="/logo.png" alt="Logo" className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border border-white/20" />
          <h2 className="text-3xl font-extrabold">ابدأ مسيرتك المهنية اليوم</h2>
          <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
            لا تتردد، انضم الآن إلى قاعدة بيانات الكفاءات الجزائرية واجعل ملفك متاحاً أمام أبرز الجهات الموظفة.
          </p>
          <div className="mt-8 flex gap-4 justify-center flex-wrap">
            <button
              onClick={openAndScrollToForm}
              className="btn-primary bg-gradient-to-r from-gold to-goldLight text-navy font-bold px-8 py-3.5 shadow-lg text-base"
            >
              تقديم طلب توظيف الآن ←
            </button>
            <Link href="/about" className="btn-ghost text-white border-white/30 hover:bg-white/10">
              تعرف علينا أكثر
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy text-slate-300 py-10 mt-auto border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Job for Algerians" className="w-8 h-8 rounded-full object-cover" />
            <span className="font-bold text-white">وظائف للجزائريين · Job for Algerians</span>
          </div>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link href="/" className="hover:text-gold transition">الرئيسية</Link>
            <Link href="/how-it-works" className="hover:text-gold transition">كيف تعمل المنصة</Link>
            <Link href="/about" className="hover:text-gold transition">من نحن</Link>
            <Link href="/faq" className="hover:text-gold transition">الأسئلة الشائعة</Link>
            <Link href="/admin/login" className="hover:text-gold transition">بوابة الإدارة</Link>
          </div>
          <span className="text-slate-400">© 2026 جميع الحقوق محفوظة</span>
        </div>
      </footer>
    </div>
  );
}
