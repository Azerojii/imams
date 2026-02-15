import Link from 'next/link'
import { UserCircle, Landmark, MapPin, ArrowLeft } from 'lucide-react'
import SearchBar from '@/components/SearchBar'
import WikiHeader from '@/components/WikiHeader'
import { getAllWikiMetadata } from '@/lib/wiki'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  const articles = await getAllWikiMetadata()
  const imams = articles.filter(a => a.articleType === 'imam')
  const mosques = articles.filter(a => a.articleType === 'mosque')

  // Get unique wilayas
  const wilayasSet = new Set<string>()
  articles.forEach(a => { if (a.wilaya) wilayasSet.add(a.wilaya) })
  const wilayas = Array.from(wilayasSet).sort()

  // Recent articles (last 5)
  const recentArticles = [...articles]
    .sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated))
    .slice(0, 5)

  return (
    <main className="min-h-screen bg-bg-main">
      <WikiHeader />

      {/* Hero Section */}
      <div className="bg-primary islamic-pattern">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="font-heading text-5xl md:text-6xl text-white mb-4">
            موسوعة أئمة ومساجد الجزائر
          </h1>
          <p className="text-white/80 text-lg mb-2">
            الموسوعة الحرة للأئمة والمساجد الجزائرية
          </p>
          <p className="text-accent/70 text-sm mb-8 font-amiri italic">
            توثيق التراث الديني والمعماري للجزائر
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">{imams.length}</div>
              <div className="text-white/60 text-sm">إمام</div>
            </div>
            <div className="w-px bg-white/20"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">{mosques.length}</div>
              <div className="text-white/60 text-sm">مسجد</div>
            </div>
            <div className="w-px bg-white/20"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">{wilayas.length}</div>
              <div className="text-white/60 text-sm">ولاية</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Main Categories */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Imams Card */}
          <Link href="/imams" className="card-islamic rounded-lg p-8 group hover:no-underline">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <UserCircle size={28} className="text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-heading font-bold text-primary">الأئمة</h2>
                <p className="text-sm text-text-secondary">{imams.length} مقال</p>
              </div>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              تصفح سير الأئمة الجزائريين عبر التاريخ، من العلماء المصلحين إلى أئمة المساجد في مختلف ولايات الجزائر.
            </p>
            <div className="flex items-center gap-1 text-primary text-sm mt-4 font-semibold group-hover:gap-2 transition-all">
              <span>تصفح الأئمة</span>
              <ArrowLeft size={16} />
            </div>
          </Link>

          {/* Mosques Card */}
          <Link href="/mosques" className="card-islamic rounded-lg p-8 group hover:no-underline">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Landmark size={28} className="text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-heading font-bold text-primary">المساجد</h2>
                <p className="text-sm text-text-secondary">{mosques.length} مقال</p>
              </div>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              اكتشف المساجد الجزائرية التاريخية والمعاصرة، عمارتها وتاريخها والأئمة الذين خدموا فيها.
            </p>
            <div className="flex items-center gap-1 text-primary text-sm mt-4 font-semibold group-hover:gap-2 transition-all">
              <span>تصفح المساجد</span>
              <ArrowLeft size={16} />
            </div>
          </Link>
        </div>

        {/* Browse by Wilaya */}
        {wilayas.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-heading font-bold text-primary mb-4 flex items-center gap-2">
              <MapPin size={22} />
              حسب الولاية
            </h2>
            <div className="bg-bg-card border border-border-light rounded-lg p-6">
              <div className="flex flex-wrap gap-2">
                {wilayas.map(wilaya => {
                  const count = articles.filter(a => a.wilaya === wilaya).length
                  return (
                    <Link
                      key={wilaya}
                      href={`/wilaya/${encodeURIComponent(wilaya)}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-bg-sidebar border border-border-light rounded-full text-sm text-primary hover:bg-primary hover:text-white hover:border-primary transition-colors hover:no-underline"
                    >
                      {wilaya}
                      <span className="text-xs opacity-60">({count})</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* Recent Articles */}
        {recentArticles.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-heading font-bold text-primary mb-4">
              أحدث المقالات
            </h2>
            <div className="space-y-3">
              {recentArticles.map(article => (
                <Link
                  key={article.slug}
                  href={`/wiki/${article.slug}`}
                  className="card-islamic block rounded-lg p-5 hover:no-underline"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {article.articleType === 'imam' ? (
                          <UserCircle size={14} className="text-accent-dark" />
                        ) : (
                          <Landmark size={14} className="text-accent-dark" />
                        )}
                        <span className="text-xs text-accent-dark font-semibold">
                          {article.articleType === 'imam' ? 'إمام' : 'مسجد'}
                        </span>
                        {article.wilaya && (
                          <>
                            <span className="text-border">|</span>
                            <span className="text-xs text-text-secondary">{article.wilaya}</span>
                          </>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-primary">{article.title}</h3>
                      <p className="text-sm text-text-secondary mt-1">{article.description}</p>
                    </div>
                    <span className="text-xs text-text-secondary mr-4 flex-shrink-0">
                      {article.lastUpdated}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-text-secondary py-8 border-t border-border-light">
          <p>
            موسوعة أئمة ومساجد الجزائر تحتوي على {articles.length} مقال
            ({imams.length} إمام و {mosques.length} مسجد)
          </p>
        </div>
      </div>
    </main>
  )
}
