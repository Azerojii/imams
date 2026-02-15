import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getWikiArticle, getAllWikiSlugs, generateTableOfContents } from '@/lib/wiki'
import WikiHeader from '@/components/WikiHeader'
import WikiSidebar from '@/components/WikiSidebar'
import TableOfContents from '@/components/TableOfContents'
import ImamInfobox from '@/components/ImamInfobox'
import MosqueInfobox from '@/components/MosqueInfobox'
import EditButton from '@/components/EditButton'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import YouTubeVideos from '@/components/YouTubeVideos'
import { BookOpen, Landmark } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateStaticParams() {
  const slugs = await getAllWikiSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getWikiArticle(slug)

  if (!article) {
    return { title: 'المقال غير موجود' }
  }

  return {
    title: `${article.title} - موسوعة أئمة ومساجد الجزائر`,
    description: article.description,
  }
}

export default async function WikiPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getWikiArticle(slug)

  if (!article) {
    notFound()
  }

  const toc = generateTableOfContents(article.rawContent)
  const isImam = article.articleType === 'imam'

  return (
    <div className="min-h-screen bg-bg-main">
      <WikiHeader />

      <div className="flex max-w-[1400px] mx-auto">
        <WikiSidebar />

        <main className="flex-1 px-6 py-4 max-w-[860px]">
          {/* Breadcrumbs */}
          <div className="text-sm text-text-secondary mb-4 flex items-center gap-2">
            <Link href="/" className="text-primary hover:underline">
              الرئيسية
            </Link>
            <span className="text-border">‹</span>
            <Link
              href={isImam ? '/imams' : '/mosques'}
              className="text-primary hover:underline flex items-center gap-1"
            >
              {isImam ? <BookOpen size={12} /> : <Landmark size={12} />}
              {isImam ? 'الأئمة' : 'المساجد'}
            </Link>
            {article.wilaya && (
              <>
                <span className="text-border">‹</span>
                <Link
                  href={`/wilaya/${encodeURIComponent(article.wilaya)}`}
                  className="text-primary hover:underline"
                >
                  {article.wilaya}
                </Link>
              </>
            )}
            <span className="text-border">‹</span>
            <span className="text-text-primary">{article.title}</span>
          </div>

          {/* Edit Button */}
          <EditButton slug={slug} />

          {/* Article Title */}
          <h1 className="text-4xl font-heading font-bold text-primary border-b-2 border-border-light pb-2 mb-4">
            {article.title}
          </h1>

          {/* Type badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded">
              {isImam ? <BookOpen size={12} /> : <Landmark size={12} />}
              {isImam ? 'إمام' : 'مسجد'}
            </span>
            {article.wilaya && (
              <span className="text-xs text-text-secondary">
                {article.wilaya}{article.commune ? ` - ${article.commune}` : ''}
              </span>
            )}
          </div>

          <div className="flex gap-6">
            <div className="flex-1">
              {/* Article Content */}
              <div className="prose-arabic">
                <MarkdownRenderer content={article.content} />
              </div>

              {/* YouTube Videos */}
              {article.youtubeVideos && article.youtubeVideos.length > 0 && (
                <YouTubeVideos videos={article.youtubeVideos} />
              )}

              {/* Footer */}
              <div className="mt-12 pt-6 border-t border-border-light">
                <div className="text-sm text-text-secondary">
                  <p>
                    <strong>آخر تحديث:</strong> {article.lastUpdated}
                  </p>
                  <p className="mt-2">
                    <strong>التصنيف:</strong>{' '}
                    <Link href={`/category/${article.category}`} className="text-primary">
                      {article.category}
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <aside className="w-72 flex-shrink-0">
              {isImam ? (
                <ImamInfobox
                  title={article.title}
                  image={article.image}
                  birthDate={article.birthDate}
                  deathDate={article.deathDate}
                  isAlive={article.isAlive}
                  rank={article.rank}
                  wilaya={article.wilaya}
                  commune={article.commune}
                  mosquesServed={article.mosquesServed}
                  customFields={article.customFields}
                />
              ) : (
                <MosqueInfobox
                  title={article.title}
                  image={article.image}
                  mosqueType={article.mosqueType}
                  dateBuilt={article.dateBuilt}
                  wilaya={article.wilaya}
                  commune={article.commune}
                  founders={article.founders}
                  imamsServed={article.imamsServed}
                />
              )}
              {toc.length > 0 && <TableOfContents items={toc} />}
            </aside>
          </div>
        </main>
      </div>
    </div>
  )
}
