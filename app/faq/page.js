'use client';
import { useState } from 'react';
import Link from 'next/link';

const FAQS = [
  {
    q: 'هل التقديم على المنصة مجاني بالكامل؟',
    a: 'نعم، التقديم مجاني 100% لجميع الكفاءات والشباب الجزائري. لا توجد أي رسوم تسجيل أو اشتراكات أو تكاليف خفية.',
  },
  {
    q: 'لماذا لا تتطلب المنصة إنشاء حساب وكلمة مرور؟',
    a: 'حرصنا على إزالة كافة الحواجز الروتينية والبيروقراطية لتمكين أي كفاءة جزائرية من التقديم فوراً في دقائق معدودة دون القلق بشأن حفظ كلمات المرور أو تفعيل البريد الإلكتروني المعقد.',
  },
  {
    q: 'ما هي أهمية حقل «أخرى / معلومات إضافية (Other)» في الاستمارة؟',
    a: 'هذا الحقل مخصص ليبرز كل ما يميزك عن غيرك: شهادات مهنية أو دورات تدريبية إضافية، لغات أجنبية، رابط ملفك على LinkedIn أو GitHub، أو نبذة شخصية تشرح طموحك الوظيفي.',
  },
  {
    q: 'هل يمكن للطلبة والخريجين الجدد التقديم بدون خبرة مهنية سابقة؟',
    a: 'بالتأكيد! المنصة ترحب بالخريجين الجدد، ويمكنك تخطي قسم الخبرة المهنية أو إضافة فترات التدريب الميداني (Internships) ومشاريع التخرج.',
  },
  {
    q: 'من يحق له الاطلاع على ملفي وبياناتي وصورتي؟',
    a: 'بياناتك محفوظة بأمان تام في قاعدة البيانات المشفرة ولا يمكن لأي زائر عادي رؤيتها. فقط مسؤولو التوظيف المعتمدون في المنصة هم من يملكون صلاحيات مراجعة السير الذاتية للتواصل مع المؤهلين.',
  },
  {
    q: 'كيف ومتى يتم التواصل معي بعد إرسال الطلب؟',
    a: 'بمجرد أن تقوم الشركات أو الجهات الموظفة بالبحث عن مرشحين يطابقون تخصصك وخبراتك، سيتواصل معك مسؤولو التوظيف مباشرة عبر الهاتف أو البريد الإلكتروني لتحديد موعد المقابلة.',
  },
  {
    q: 'إذا أردت تعديل أو تحديث معلوماتي، ماذا أفعل؟',
    a: 'ببساطة يمكنك ملء الاستمارة مجدداً بنفس البريد الإلكتروني ورقم الهاتف، وسيتم تسجيل أحدث نسخة من ملفك لدى مسؤولي المراجعة.',
  },
  {
    q: 'كيف يستطيع مسؤولو الشركات والإدارة الدخول للنظام؟',
    a: 'المسؤولون المعتمدون لديهم بوابة خاصة عبر رابط "دخول الإدارة" في أعلى وأسفل الصفحة، ويمكنهم تسجيل حساب إدارة ومراجعة كافة الطلبات عبر لوحة التحكم المركزية.',
  },
];

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState(0);

  function toggle(idx) {
    setOpenIdx(openIdx === idx ? -1 : idx);
  }

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
            <Link href="/about" className="hover:text-royal transition">من نحن</Link>
            <Link href="/faq" className="text-royal transition">الأسئلة الشائعة</Link>
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
            مركز المساعدة والإجابات 💡
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-snug">
            الأسئلة الأكثر شيوعاً
          </h1>
          <p className="text-slate-300 mt-4 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            إجابات وافية وشاملة حول طريقة التقديم، حماية البيانات، والفرص الوظيفية المتاحة.
          </p>
        </div>
      </section>

      {/* FAQ Accordion */}
      <main className="max-w-3xl mx-auto px-6 py-16 flex-1 w-full space-y-4">
        {FAQS.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className={`border rounded-2xl transition bg-white overflow-hidden ${
                isOpen ? 'border-royal shadow-sm ring-1 ring-royal/20' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full text-right p-5 sm:p-6 font-bold text-navy flex justify-between items-center gap-4 text-base sm:text-lg"
              >
                <span>{item.q}</span>
                <span className={`text-royal text-xl transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                  ▾
                </span>
              </button>
              {isOpen && (
                <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100 pt-4 bg-slate-50/50">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}

        {/* Bottom CTA Card */}
        <div className="card text-center p-8 mt-12 bg-white border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold text-navy">هل لديك استفسار آخر؟</h3>
          <p className="text-muted text-sm mt-1">ابدأ بملء استمارتك الآن وكن على تواصل مباشر مع فريق التوظيف.</p>
          <div className="mt-5">
            <Link href="/apply" className="btn-primary text-sm px-8 py-3">
              تقديم طلب توظيف الآن ←
            </Link>
          </div>
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
            <Link href="/about" className="hover:text-gold transition">من نحن</Link>
            <Link href="/admin/login" className="hover:text-gold transition">بوابة الإدارة</Link>
          </div>
          <span className="text-slate-400">© 2026 جميع الحقوق محفوظة</span>
        </div>
      </footer>
    </div>
  );
}
