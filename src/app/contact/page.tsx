import Link from 'next/link'
import { Mail, Phone, Globe2 } from 'lucide-react'
import WikiHeader from '@/components/WikiHeader'
import WikiSidebar from '@/components/WikiSidebar'
import { getSiteFooterSettings, type SiteFooterLink } from '@/lib/site-settings'

export const dynamic = 'force-dynamic'

function ContactGroup({
  title,
  icon,
  links,
}: {
  title: string
  icon: JSX.Element
  links: SiteFooterLink[]
}) {
  return (
    <section className="card-islamic rounded-2xl p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-full bg-accent/15 p-2 text-accent-dark">{icon}</div>
        <h2 className="text-xl font-heading font-bold text-primary">{title}</h2>
      </div>

      {links.length === 0 ? (
        <p className="text-sm text-text-secondary">لا توجد معلومات متاحة حالياً.</p>
      ) : (
        <div className="space-y-3">
          {links.map(link => (
            <a
              key={link.id}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="block rounded-xl border border-border-light bg-white px-4 py-3 transition-all hover:-translate-y-0.5 hover:no-underline hover:shadow-sm"
            >
              <div className="text-xs font-semibold text-accent-dark">{link.label}</div>
              <div className="text-base font-bold text-primary">{link.value}</div>
            </a>
          ))}
        </div>
      )}
    </section>
  )
}

export default async function ContactPage() {
  const settings = await getSiteFooterSettings()

  return (
    <div className="min-h-screen bg-bg-main">
      <WikiHeader />

      <div className="mx-auto flex max-w-[1400px]">
        <WikiSidebar />

        <main className="max-w-[960px] flex-1 px-4 py-4 md:px-6">
          <div className="mb-4 flex items-center gap-2 text-sm text-text-secondary">
            <Link href="/" className="text-primary hover:underline">
              الرئيسية
            </Link>
            <span className="text-border">‹</span>
            <span className="text-text-primary">تواصل معنا</span>
          </div>

          <section className="card-islamic mb-6 rounded-3xl px-5 py-6 sm:px-8 sm:py-8">
            <div className="gold-line mb-4 w-28" />
            <h1 className="text-3xl font-heading font-bold text-primary sm:text-5xl">تواصل معنا</h1>
            <p className="mt-4 max-w-2xl text-base text-text-secondary sm:text-lg">{settings.contactIntro}</p>
          </section>

          <div className="grid gap-5 lg:grid-cols-2">
            <ContactGroup
              title="وسائل التواصل"
              icon={<Mail size={18} />}
              links={settings.contactLinks}
            />
            <ContactGroup
              title="المواقع والمنصات"
              icon={<Globe2 size={18} />}
              links={settings.websiteLinks}
            />
          </div>

          {settings.contactLinks.length === 0 && settings.websiteLinks.length === 0 && (
            <div className="mt-6 rounded-2xl border border-dashed border-border bg-white/70 px-5 py-6 text-center text-text-secondary">
              <Phone size={28} className="mx-auto mb-3 text-accent-dark opacity-70" />
              سيتم إضافة بيانات التواصل من لوحة الإدارة قريباً.
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
