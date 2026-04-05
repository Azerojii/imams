import type { Metadata } from 'next'
import AuthProvider from '@/components/AuthProvider'
import { getSiteFooterSettings } from '@/lib/site-settings'
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
  const siteSettings = await getSiteFooterSettings()

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
        <footer className="border-t border-border-light bg-bg-sidebar">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-4 py-5 text-sm text-text-secondary md:flex-row md:items-center md:justify-between md:px-6">
            <p>{siteSettings.footerText}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
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
