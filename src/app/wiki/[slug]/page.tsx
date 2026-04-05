import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getWikiArticle, getAllWikiSlugs, generateTableOfContents } from '@/lib/wiki'
import WikiHeader from '@/components/WikiHeader'
import WikiSidebar from '@/components/WikiSidebar'
import TableOfContents from '@/components/TableOfContents'
import ImamInfobox from '@/components/ImamInfobox'
import MosqueInfobox from '@/components/MosqueInfobox'
import ArticleReferences from '@/components/ArticleReferences'
import YouTubeVideos from '@/components/YouTubeVideos'
import PrintButton from '@/components/PrintButton'
import SuggestEditButton from '@/components/SuggestEditButton'
import { UserCircle, Landmark, BookOpen } from 'lucide-react'
import HijabiWomanIcon from '@/components/HijabiWomanIcon'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function getTypeIcon(type: string) {
  switch (type) {
    case 'imam': return <UserCircle size={12} />
    case 'mosque': return <Landmark size={12} />
    case 'quran_teacher': return <BookOpen size={12} />
    case 'mourshida': return <HijabiWomanIcon size={12} />
    default: return <UserCircle size={12} />
  }
}

function getTypeLabel(type: string) {
  switch (type) {
    case 'imam': return 'إمام'
    case 'mosque': return 'مسجد'
    case 'quran_teacher': return 'معلم قرآن'
    case 'mourshida': return 'مرشدة دينية'
    default: return type
  }
}

function getTypeListPath(type: string) {
  switch (type) {
    case 'imam': return '/imams'
    case 'mosque': return '/mosques'
    case 'quran_teacher': return '/quran-teachers'
    case 'mourshida': return '/mourshidat'
    default: return '/imams'
  }
}

function getTypeCategoryLabel(type: string) {
  switch (type) {
    case 'imam': return 'الأئمة'
    case 'mosque': return 'المساجد'
    case 'quran_teacher': return 'معلمو القرآن'
    case 'mourshida': return 'المرشدات'
    default: return 'الأئمة'
  }
}

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
  const isImamLike = article.articleType === 'imam' || article.articleType === 'quran_teacher' || article.articleType === 'mourshida'

  return (
    <div className="min-h-screen bg-bg-main">
      <WikiHeader />

      <div className="flex max-w-[1400px] mx-auto">
        <WikiSidebar />

        <main className="flex-1 px-4 md:px-6 py-4 max-w-[860px]">
          {/* Breadcrumbs */}
          <div className="text-xs sm:text-sm text-text-secondary mb-4 flex items-center gap-1.5 sm:gap-2 flex-wrap print:hidden">
            <Link href="/" className="text-primary hover:underline">
              الرئيسية
            </Link>
            <span className="text-border">‹</span>
            <Link
              href={getTypeListPath(article.articleType)}
              className="text-primary hover:underline flex items-center gap-1"
            >
              {getTypeIcon(article.articleType)}
              {getTypeCategoryLabel(article.articleType)}
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

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap print:hidden">
            <PrintButton />
            <SuggestEditButton slug={slug} articleTitle={article.title} initialContent={article.rawContent} />
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-primary border-b-2 border-border-light pb-2 mb-4">
            {article.title}
          </h1>

          {/* Last modification status */}
          {(article.lastUpdated || article.authorName) && (
            <div className="text-xs text-text-secondary mb-3 flex items-center gap-1">
              <span>آخر تعديل:</span>
              {article.lastUpdated && <span className="font-medium">{article.lastUpdated}</span>}
              {article.authorName && (
                <>
                  <span>بواسطة</span>
                  <span className="font-medium">{article.authorName}</span>
                </>
              )}
            </div>
          )}

          {/* Type badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded">
              {getTypeIcon(article.articleType)}
              {getTypeLabel(article.articleType)}
            </span>
            {article.wilaya && (
              <span className="text-xs text-text-secondary">
                {article.wilaya}{article.commune ? ` - ${article.commune}` : ''}
              </span>
            )}
          </div>

          {/* Description as introductory sentence */}
          {article.description && (
            <p className="text-text-secondary text-base mb-6 leading-relaxed border-r-4 border-accent pr-4">
              {article.description}
            </p>
          )}

          <div className="flex flex-col-reverse md:flex-row gap-6">
            <div className="flex-1">
              {/* Article Content */}
              <div className="prose-arabic">
                <ArticleReferences content={article.content} references={article.references} />
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
                  {article.authorName && (
                    <p className="mt-2">
                      <strong>الكاتب:</strong> {article.authorName}
                      {article.authorEmail && (
                        <span className="text-text-secondary"> ({article.authorEmail})</span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <aside className="w-full md:w-72 md:flex-shrink-0">
              {isImamLike ? (
                <ImamInfobox
                  title={article.title}
                  image={article.image}
                  birthDate={article.birthDate}
                  deathDate={article.deathDate}
                  isAlive={article.isAlive}
                  rank={article.rank}
                  ranks={article.ranks}
                  wilaya={article.wilaya}
                  commune={article.commune}
                  mosquesServed={article.mosquesServed}
                  customFields={article.customFields}
                  phone={article.phone}
                  email={article.email}
                  whatsapp={article.whatsapp}
                  facebook={article.facebook}
                  youtubeChannel={article.youtubeChannel}
                  website={article.website}
                />
              ) : (
                <MosqueInfobox
                  title={article.title}
                  image={article.image}
                  mosqueType={article.mosqueType}
                  dateBuilt={article.dateBuilt}
                  dateInauguration={article.dateInauguration}
                  wilaya={article.wilaya}
                  commune={article.commune}
                  founders={article.founders}
                  imamsServed={article.imamsServed}
                  prayerHallArea={article.prayerHallArea}
                  prayerHallCapacity={article.prayerHallCapacity}
                  minaretHeight={article.minaretHeight}
                  totalArea={article.totalArea}
                  otherFacilities={article.otherFacilities}
                  customMosqueFields={article.customMosqueFields}
                  phone={article.phone}
                  email={article.email}
                  whatsapp={article.whatsapp}
                  facebook={article.facebook}
                  youtubeChannel={article.youtubeChannel}
                  website={article.website}
                  mosqueGallery={article.mosqueGallery}
                  currentImam={article.currentImam}
                  currentCouncil={article.currentCouncil}
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
