import './globals.css';

export const metadata = {
  title: 'وظائف للجزائريين | Job for Algerians',
  description: 'أنشئ ملفك المهني المتميز وتواصل مع أفضل فرص العمل في الجزائر والخارج.',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-bg text-ink min-h-screen">{children}</body>
    </html>
  );
}
