'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminSettingsPage() {
  const router = useRouter();
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetch('/api/admin/verify')
      .then((res) => res.json())
      .then((data) => {
        if (data.isAdmin && data.email) {
          setCurrentEmail(data.email);
          setNewEmail(data.email);
        }
      })
      .catch(() => {});
  }, []);

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword !== confirmPassword) {
      setErrorMsg('كلمتا المرور الجديدتان غير متطابقتين');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('يجب ألا تقل كلمة المرور الجديدة عن 6 أحرف');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/change-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newEmail: newEmail.trim(),
          newPassword,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setErrorMsg(data.error || 'فشل تحديث البيانات، تأكد من صحة كلمة المرور الحالية');
        return;
      }

      setSuccessMsg(
        '✓ تم تحديث البريد الإلكتروني وكلمة المرور بنجاح ومباشرة في قاعدة البيانات! أصبحت البيانات القديمة ملغاة فوراً.'
      );
      setCurrentEmail(data.newEmail || newEmail.trim());
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setLoading(false);
      setErrorMsg('تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً');
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Top Navbar */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
            <div>
              <div className="font-extrabold text-navy leading-none">وظائف للجزائريين</div>
              <div className="text-[11px] text-royal font-bold">إعدادات حساب الإدارة والأمان</div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link href="/admin" className="text-royal hover:underline flex items-center gap-1 font-bold">
              <span>←</span>
              <span>لوحة المرشحين</span>
            </Link>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 font-bold border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-6">
          <Link href="/admin" className="text-xs text-royal font-bold hover:underline mb-2 inline-block">
            ← العودة إلى لوحة المرشحين
          </Link>
          <h1 className="text-2xl font-extrabold text-navy">إعدادات الأمان وبيانات الدخول</h1>
          <p className="text-muted text-sm mt-1">
            تغيير فوري للبريد الإلكتروني وكلمة المرور مباشرة في قاعدة البيانات وبدون أي رموز تأكيد.
          </p>
        </div>

        {successMsg && (
          <div className="bg-green-50 text-green-800 text-sm p-4 rounded-2xl mb-6 border border-green-200 shadow-sm">
            <div className="font-bold flex items-center gap-2 mb-1">
              <span>✅</span>
              <span>تم التحديث بنجاح</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed">{successMsg}</p>
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-50 text-red-700 text-sm p-4 rounded-2xl mb-6 border border-red-200 flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="card shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Current Email Display */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
              <span className="text-muted font-semibold block mb-0.5">البريد الإلكتروني الحالي النشط:</span>
              <span className="font-mono font-bold text-navy dir-ltr block text-right text-sm">
                {currentEmail || 'admin@jobforalgerians.dz'}
              </span>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                البريد الإلكتروني الجديد <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="email"
                className="input dir-ltr text-right"
                placeholder="new-admin@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <span className="text-xs text-muted block -mt-2">
                سيصبح هذا البريد هو المعتمد لدخول لوحة التحكم وسيلغى البريد السابق فوراً.
              </span>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                كلمة المرور الحالية (لتأكيد الهوية) <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="password"
                className="input dir-ltr text-right"
                placeholder="أدخل كلمة المرور الحالية"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  كلمة المرور الجديدة <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="password"
                  className="input dir-ltr text-right"
                  placeholder="6 أحرف كحد أدنى"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  تأكيد كلمة المرور الجديدة <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="password"
                  className="input dir-ltr text-right"
                  placeholder="أعد إدخال كلمة المرور"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                disabled={loading}
                className="btn-primary w-full py-3.5 font-bold shadow-md hover:shadow-lg transition"
              >
                {loading ? 'جارٍ الحفظ والتحديث في قاعدة البيانات...' : '💾 حفظ وتحديث البيانات في قاعدة البيانات مباشرة'}
              </button>
            </div>

            <div className="text-xs text-slate-500 bg-amber-50 p-3 rounded-xl border border-amber-200/60 leading-relaxed">
              💡 <strong>تنبيه أمان:</strong> بمجرد الضغط على الحفظ، سيتم تحديث السجل فوراً في قاعدة البيانات ولن يعود بإمكانك استخدام كلمة المرور أو البريد القديم. احتفظ ببياناتك الجديدة في مكان آمن.
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
