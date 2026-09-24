import Link from 'next/link';

export const metadata = {
  title: 'كيف تعمل المنصة | وظائف للجزائريين - Job for Algerians',
  description: 'تعرف على خطوات التقديم ومراحل مراجعة ملفك المهني على منصة وظائف للجزائريين.',
};

const DETAILED_STEPS = [
  {
    step: '01',
    title: 'تعبئة المعلومات الشخصية والإضافية',
    desc: 'املأ اسمك الكامل، بريدك الإلكتروني، رقم هاتفك، والولاية. يمكنك أيضاً تحميل صورتك الشخصية وإضافة أي مهارات أو تفاصيل خاصة في حقل (معلومات أخرى / Other).',
    tip: 'نصيحة: تأكد من صحة رقم هاتفك وبريدك الإلكتروني لتلقي إشعارات المقابلات.',
    icon: '👤',
  },
  {
    step: '02',
    title: 'إضافة المسار التعليمي والشهادات',
    desc: 'أدخل شهاداتك الجامعية أو المهنية (ليسانس، ماستر، مهندس دولة، تكوين مهني) مع اسم المؤسسة وسنة التخرج والتخصص الدقيق.',
    tip: 'نصيحة: يمكنك إضافة أكثر من مؤهل علمي واحد بالضغط على "إضافة المؤهل".',
    icon: '🎓',
  },
  {
    step: '03',
    title: 'توثيق الخبرات المهنية السابقة',
    desc: 'اذكر الشركات أو المؤسسات التي عملت معها، والمسميات الوظيفية، وفترة العمل، مع وصف موجز لأهم المهام والإنجازات التي حققتها.',
    tip: 'نصيحة: إذا كنت حديث التخرج، يمكنك تخطي هذه الخطوة أو ذكر فترات التدريب (Internships).',
    icon: '💼',
  },
  {
    step: '04',
    title: 'المراجعة، الإرسال، والتواصل',
    desc: 'تحقق من كل ما قمت بإدخاله في شاشة المراجعة، ثم اضغط على "تأكيد وإرسال الطلب". يتم حفظ طلبك مباشرة في قاعدة البيانات المركزية لدى مسؤولي التوظيف.',
    tip: 'نصيحة: بمجرد مطابقة مؤهلاتك مع متطلبات الوظائف، سيتصل بك فريق التوظيف مباشرة.',
    icon: '🚀',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 backdrop-blur bg-white/95 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Job for Algerians" className="w-12 h-12 rounded-full object-cover shadow-sm border border-slate-200" />
            <div className="leading-tight">
              <span className="block font-extrabold text-navy text-lg">وظائف للجزائريين</span>
              <span className="block text-xs font-semibold text-royal tracking-wide">Job for Algerians</span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-700">
            <Link href="/" className="hover:text-royal transition">الرئيسية</Link>
            <Link href="/how-it-works" className="text-royal transition">كيف تعمل المنصة</Link>
            <Link href="/about" className="hover:text-royal transition">من نحن</Link>
            <Link href="/faq" className="hover:text-royal transition">الأسئلة الشائعة</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/apply" className="btn-primary text-sm px-5 py-2.5">
              قدّم طلبك الآن
            </Link>
            <Link href="/admin/login" className="btn-ghost text-xs px-3 py-2 text-slate-600">
              الإدارة
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-navy text-white py-16 md:py-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block bg-royal/40 text-goldLight text-xs font-bold px-3.5 py-1.5 rounded-full mb-4 border border-royal/50">
            دليلك المبسط للتقديم 🇩🇿
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-snug">
            كيف تعمل منصة وظائف للجزائريين؟
          </h1>
          <p className="text-slate-300 mt-4 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            خطوات واضحة وسريعة تبدأ بها بناء مستقبلك الوظيفي دون تعقيدات وبدون الحاجة لإنشاء حساب أو حفظ كلمات مرور.
          </p>
        </div>
      </section>

      {/* Steps List */}
      <main className="max-w-4xl mx-auto px-6 py-16 space-y-12 flex-1">
        <div className="space-y-8">
          {DETAILED_STEPS.map((s, idx) => (
            <div key={s.step} className="card p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start hover:shadow-md transition">
              <div className="w-16 h-16 rounded-2xl bg-blue/10 text-royal flex items-center justify-center text-3xl shrink-0">
                {s.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold bg-royal text-white px-2.5 py-1 rounded-lg">
                    الخطوة {s.step}
                  </span>
                  <h2 className="text-xl font-bold text-navy">{s.title}</h2>
                </div>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed mt-2">{s.desc}</p>
                <div className="bg-amber-50 text-amber-800 text-xs sm:text-sm p-3 rounded-xl mt-4 border border-amber-200/60 font-medium">
                  💡 {s.tip}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-navy mb-4 text-center">ماذا يحدث بعد إرسال طلبك؟</h3>
          <div className="grid sm:grid-cols-3 gap-6 mt-6 text-center">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-2xl mb-2">📥</div>
              <h4 className="font-bold text-navy text-sm">1. وصول الطلب</h4>
              <p className="text-xs text-muted mt-1 leading-relaxed">يصل ملفك مباشرة إلى قاعدة بيانات الإدارة المشفرة والمحمية.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-2xl mb-2">🔍</div>
              <h4 className="font-bold text-navy text-sm">2. مراجعة المؤهلات</h4>
              <p className="text-xs text-muted mt-1 leading-relaxed">يقوم المراجعون بفحص الخبرات ومطابقتها مع فرص العمل النشطة.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-2xl mb-2">📞</div>
              <h4 className="font-bold text-navy text-sm">3. التواصل المباشر</h4>
              <p className="text-xs text-muted mt-1 leading-relaxed">يتم الاتصال بك عبر الهاتف أو البريد الإلكتروني لتحديد موعد مقابلة العمل.</p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-4">
          <Link href="/apply" className="btn-primary text-base px-10 py-4 shadow-lg hover:shadow-xl font-bold transition">
            ابدأ الآن بملء استمارتك ←
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-navy text-slate-300 py-10 mt-auto border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Job for Algerians" className="w-8 h-8 rounded-full object-cover" />
            <span className="font-bold text-white">وظائف للجزائريين · Job for Algerians</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-gold transition">الرئيسية</Link>
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
