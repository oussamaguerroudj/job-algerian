import Link from 'next/link';

export default function ApplySuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-6 bg-bg py-12">
      <div className="card max-w-md w-full py-12 shadow-lg">
        <img src="/logo.png" alt="Job for Algerians" className="w-20 h-20 rounded-full object-cover mx-auto mb-6 border-2 border-gold/40 shadow-md" />
        <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-4 border border-green-200">
          <span className="text-3xl">✓</span>
        </div>
        <h1 className="text-2xl font-extrabold text-navy">تم استلام طلبك بنجاح!</h1>
        <p className="text-muted text-sm mt-3 leading-relaxed px-4">
          شكراً لك، تم حفظ ملفك المهني بنجاح وأصبح متاحاً لدى مسؤولي التوظيف للمراجعة والتواصل معك في حال مطابقة مؤهلاتك.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8 px-6">
          <Link href="/apply" className="btn-primary">
            تقديم طلب آخر
          </Link>
          <Link href="/" className="btn-ghost">
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
