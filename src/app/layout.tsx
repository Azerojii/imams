import type { Metadata } from 'next'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'

export const metadata: Metadata = {
  title: 'موسوعة أئمة ومساجد الجزائر',
  description: 'الموسوعة الحرة للأئمة والمساجد الجزائرية',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500;600;700&family=Aref+Ruqaa:wght@400;700&family=Amiri:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
        <footer className="text-center text-xs text-text-secondary py-4 border-t border-border-light bg-bg-sidebar">
          جميع الحقوق محفوظة © 2026
        </footer>
      </body>
    </html>
  )
}
