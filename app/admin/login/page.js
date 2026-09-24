'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error || 'البريد الإلكتروني أو كلمة المرور غير صحيحة');
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch (err) {
      setLoading(false);
      setError('تعذر الاتصال بالخادم، يرجى المحاولة مرة أخرى.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4 py-12">
      <form onSubmit={handleSubmit} className="w-full max-w-sm card shadow-md">
        <div className="text-center mb-6">
          <Link href="/">
            <img src="/logo.png" alt="Job for Algerians" className="w-16 h-16 rounded-full object-cover mx-auto mb-3 border border-slate-200" />
          </Link>
          <h1 className="text-2xl font-extrabold text-navy">تسجيل دخول المسؤول</h1>
          <p className="text-muted text-xs mt-1">الدخول المباشر إلى لوحة إدارة ومراجعة المترشحين.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 text-sm p-3 rounded-xl mb-4 border border-red-200 flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">البريد الإلكتروني</label>
          <input
            required
            type="email"
            className="input dir-ltr text-right"
            placeholder="admin@jobforalgerians.dz"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">كلمة المرور</label>
          <input
            required
            className="input dir-ltr text-right"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button disabled={loading} className="btn-primary w-full mt-2">
          {loading ? 'جارٍ التحقق والدخول...' : 'تسجيل الدخول مباشرة'}
        </button>

        <div className="text-center mt-6">
          <Link href="/" className="text-xs text-muted hover:text-royal">
            ← العودة للصفحة الرئيسية
          </Link>
        </div>
      </form>
    </div>
  );
}
