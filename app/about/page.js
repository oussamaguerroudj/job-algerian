import Link from 'next/link';

export const metadata = {
  title: 'من نحن | وظائف للجزائريين - Job for Algerians',
  description: 'تعرف على رؤية ورسالة منصة وظائف للجزائريين لربط الكفاءات الجزائرية بالفرص المهنية المتميزة.',
};

export default function AboutPage() {
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
            <Link href="/how-it-works" className="hover:text-royal transition">كيف تعمل المنصة</Link>
            <Link href="/about" className="text-royal transition">من نحن</Link>
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
            رؤيتنا ورسالتنا نحو المستقبل 🇩🇿 🇪🇺
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-snug">
            نبني الجسور بين الكفاءات الجزائرية وأفضل فرص العمل
          </h1>
          <p className="text-slate-300 mt-4 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            منصة <strong>Job for Algerians</strong> هي مبادرة تهدف إلى إبراز وتسهيل وصول الكفاءات الشابة والمهنية في الجزائر إلى الشركاء وأصحاب العمل المحليين والدوليين.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-16 space-y-16 flex-1">
        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-royal font-bold text-sm">قصتنا وهدفنا</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-navy mt-2">لماذا أنشأنا هذه المنصة؟</h2>
            <p className="text-slate-600 mt-4 leading-relaxed text-sm md:text-base">
              تزخر الجزائر بآلاف الخريجين والمهندسين وأصحاب الحرف والمهارات العالية سنوياً. ومع ذلك، يواجه العديد من الشباب صعوبة في الوصول إلى مسؤولي التوظيف والشركات التي تبحث عن مهاراتهم بدقة وبدون تعقيدات البيروقراطية.
            </p>
            <p className="text-slate-600 mt-3 leading-relaxed text-sm md:text-base">
              لذلك صممنا هذه المنصة لتكون جسراً مباشراً وسلساً: لا حاجة لحفظ كلمات مرور أو إنشاء حسابات معقدة؛ كل ما يحتاجه المترشح هو إدخال خبراته ومؤهلاته لتصل مباشرة إلى طاولة مراجعي التوظيف المعتمدين.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-3xl shadow-xl border border-slate-200 text-center">
              <img src="/logo.png" alt="Logo" className="w-56 h-56 rounded-2xl object-cover mx-auto mb-4" />
              <div className="font-extrabold text-navy text-lg">منصة موثوقة ومفتوحة</div>
              <div className="text-xs text-muted mt-1">دعماً للشباب الجزائري وشراكات العمل الدولية</div>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-royal font-bold text-sm">مبادئنا الأساسية</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-navy mt-2">قيم نلتزم بها في كل خطوة</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="card text-center p-6 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-blue/10 text-royal text-2xl flex items-center justify-center mx-auto mb-4">
                ⚡
              </div>
              <h3 className="font-bold text-navy text-lg">السهولة والسرعة</h3>
              <p className="text-muted text-sm mt-2 leading-relaxed">
                تقديم مباشر وفوري دون حواجز تسجيل معقدة، لتقليل وقت التقديم وزيادة الفعالية.
              </p>
            </div>

            <div className="card text-center p-6 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold text-2xl flex items-center justify-center mx-auto mb-4">
                🛡️
              </div>
              <h3 className="font-bold text-navy text-lg">الشفافية والأمان</h3>
              <p className="text-muted text-sm mt-2 leading-relaxed">
                بيانات المرشحين محمية ومخصصة حصراً للمسؤولين ومراجعي التوظيف المعتمدين.
              </p>
            </div>

            <div className="card text-center p-6 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 text-2xl flex items-center justify-center mx-auto mb-4">
                🎯
              </div>
              <h3 className="font-bold text-navy text-lg">التركيز على الكفاءة</h3>
              <p className="text-muted text-sm mt-2 leading-relaxed">
                إبراز الخبرات الفعلية والمهارات والشهادات لتمكين أصحاب العمل من الاختيار الأنسب.
              </p>
            </div>
          </div>
        </div>

        {/* CTA banner */}
        <div className="bg-gradient-to-r from-royal to-darkBlue text-white p-8 md:p-12 rounded-3xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold">هل أنت مستعد لبدء خطوتك المهنية التالية؟</h3>
            <p className="text-slate-200 mt-2 text-sm">املأ استمارتك الآن وانضم إلى قائمة الكفاءات الجزائرية المرشحة.</p>
          </div>
          <Link href="/apply" className="btn-primary bg-gold text-navy hover:bg-goldLight font-bold px-8 py-3 whitespace-nowrap shadow-md">
            تقديم طلب توظيف الآن ←
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
            <Link href="/how-it-works" className="hover:text-gold transition">كيف تعمل المنصة</Link>
            <Link href="/faq" className="hover:text-gold transition">الأسئلة الشائعة</Link>
            <Link href="/admin/login" className="hover:text-gold transition">بوابة الإدارة</Link>
          </div>
          <span className="text-slate-400">© 2026 جميع الحقوق محفوظة</span>
        </div>
      </footer>
    </div>
  );
}
