import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import AuthProvider from '@/components/AuthProvider'
import { getSiteFooterSettings } from '@/lib/site-settings'
import { getTotalViews } from '@/lib/wiki'
import { Eye } from 'lucide-react'
import './globals.css'

export const metadata: Metadata = {
  title: 'موسوعة أئمة ومساجد الجزائر',
  description: 'الموسوعة الحرة للأئمة والمساجد الجزائرية',
}

export const dynamic = 'force-dynamic'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [siteSettings, totalViews] = await Promise.all([
    getSiteFooterSettings(),
    getTotalViews(),
  ])

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
        <AuthProvider>{children}</AuthProvider>
        <Analytics />
        <footer className="border-t border-border-light bg-bg-sidebar">
          <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-3 px-4 py-5 text-center text-sm text-text-secondary md:px-6">
            {totalViews > 0 && (
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Eye size={16} />
                <span>{totalViews.toLocaleString('ar-DZ')}</span>
                <span className="font-normal text-text-secondary">مشاهدات الموقع</span>
              </div>
            )}
            <p className="w-full text-center">{siteSettings.footerText}</p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm">
              {siteSettings.contactLinks.slice(0, 2).map(link => (
                <a
                  key={link.id}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="transition-colors hover:text-primary"
                >
                  {link.value || link.label}
                </a>
              ))}
              {siteSettings.websiteLinks.slice(0, 2).map(link => (
                <a
                  key={link.id}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
