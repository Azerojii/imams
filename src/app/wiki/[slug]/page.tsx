import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getWikiArticle, getAllWikiSlugs, generateTableOfContents, getArticleViewCounts } from '@/lib/wiki'
import WikiHeader from '@/components/WikiHeader'
import TableOfContents from '@/components/TableOfContents'
import ImamInfobox from '@/components/ImamInfobox'
import MosqueInfobox from '@/components/MosqueInfobox'
import ArticleReferences from '@/components/ArticleReferences'
import YouTubeVideos from '@/components/YouTubeVideos'
import PrintButton from '@/components/PrintButton'
import SuggestEditButton from '@/components/SuggestEditButton'
import SuggestedArticles from '@/components/SuggestedArticles'
import ViewTracker from '@/components/ViewTracker'
import { UserCircle, Landmark, BookOpen, Eye } from 'lucide-react'
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
    case 'imam': return 'Ø¥Ù…Ø§Ù…'
    case 'mosque': return 'Ù…Ø³Ø¬Ø¯'
    case 'quran_teacher': return 'Ù…Ø¹Ù„Ù… Ù‚Ø±Ø¢Ù†'
    case 'mourshida': return 'Ù…Ø±Ø´Ø¯Ø© Ø¯ÙŠÙ†ÙŠØ©'
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
    case 'imam': return 'Ø§Ù„Ø£Ø¦Ù…Ø©'
    case 'mosque': return 'Ø§Ù„Ù…Ø³Ø§Ø¬Ø¯'
    case 'quran_teacher': return 'Ù…Ø¹Ù„Ù…Ùˆ Ø§Ù„Ù‚Ø±Ø¢Ù†'
    case 'mourshida': return 'Ø§Ù„Ù…Ø±Ø´Ø¯Ø§Øª'
    default: return 'Ø§Ù„Ø£Ø¦Ù…Ø©'
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
    return { title: 'Ø§Ù„Ù…Ù‚Ø§Ù„ ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯' }
  }

  return {
    title: `${article.title} - Ù…ÙˆØ³ÙˆØ¹Ø© Ø£Ø¦Ù…Ø© ÙˆÙ…Ø³Ø§Ø¬Ø¯ Ø§Ù„Ø¬Ø²Ø§Ø¦Ø±`,
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
  const viewCounts = await getArticleViewCounts(slug)

  return (
    <div className="min-h-screen bg-bg-main">
      <ViewTracker slug={slug} />
      <WikiHeader />

      <div className="mx-auto max-w-[1680px]">
        <main className="px-4 py-4 md:px-8">
          {/* Breadcrumbs */}
          <div className="text-xs sm:text-sm text-text-secondary mb-4 flex items-center gap-1.5 sm:gap-2 flex-wrap print:hidden">
            <Link href="/" className="text-primary hover:underline">
              Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©
            </Link>
            <span className="text-border">â€¹</span>
            <Link
              href={getTypeListPath(article.articleType)}
              className="text-primary hover:underline flex items-center gap-1"
            >
              {getTypeIcon(article.articleType)}
              {getTypeCategoryLabel(article.articleType)}
            </Link>
            {article.wilaya && (
              <>
                <span className="text-border">â€¹</span>
                <Link
                  href={`/wilaya/${encodeURIComponent(article.wilaya)}`}
                  className="text-primary hover:underline"
                >
                  {article.wilaya}
                </Link>
              </>
            )}
            <span className="text-border">â€¹</span>
            <span className="text-text-primary">{article.title}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap print:hidden">
            <PrintButton />
            <SuggestEditButton article={article} />
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-primary border-b-2 border-border-light pb-2 mb-4">
            {article.title}
          </h1>

          {/* Last modification status */}
          {(article.lastUpdated || article.authorName) && (
            <div className="text-xs text-text-secondary mb-3 flex items-center gap-1">
              <span>Ø¢Ø®Ø± ØªØ¹Ø¯ÙŠÙ„:</span>
              {article.lastUpdated && <span className="font-medium">{article.lastUpdated}</span>}
              {article.authorName && (
                <>
                  <span>Ø¨ÙˆØ§Ø³Ø·Ø©</span>
                  <span className="font-medium">{article.authorName}</span>
                </>
              )}
            </div>
          )}

          {/* Type badge + view count */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded">
              {getTypeIcon(article.articleType)}
              {getTypeLabel(article.articleType)}
            </span>
            {article.wilaya && (
              <span className="text-xs text-text-secondary">
                {article.wilaya}{article.commune ? ` - ${article.commune}` : ''}
              </span>
            )}
            {viewCounts.total > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-border-light text-text-secondary text-xs rounded mr-auto print:hidden">
                <Eye size={11} />
                {viewCounts.total.toLocaleString('ar-DZ')} مطالعة
                {viewCounts.byCountry.length > 0 && (
                  <span className="mr-1 text-text-secondary/70">
                    ({viewCounts.byCountry.slice(0, 3).map(c => `${c.countryName} ${c.viewCount}`).join(' · ')})
                  </span>
                )}
              </span>
            )}
          </div>

          {/* Description as introductory sentence */}
          {article.description && (
            <p className="text-text-secondary text-base mb-6 leading-relaxed border-r-4 border-accent pr-4">
              {article.description}
            </p>
          )}

          <div className="flex flex-col-reverse gap-6 md:flex-row">
            <div className="min-w-0 flex-1">
              {/* Article Content */}
              <div className="prose-arabic">
                <ArticleReferences content={article.content} references={article.references} />
              </div>

              {/* YouTube Videos */}
              {article.youtubeVideos && article.youtubeVideos.length > 0 && (
                <YouTubeVideos videos={article.youtubeVideos} />
              )}

              {/* Contribution phrase */}
              <div className="mt-8 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <span aria-hidden="true">âœï¸</span>
                <span>هذه المقالة بحاجة إلى توسيع وتطوير، ويُرجى المساهمة في تحسينها.</span>
              </div>

              {/* Footer */}
              <div className="mt-12 pt-6 border-t border-border-light">
                <div className="text-sm text-text-secondary">
                  <p>
                    <strong>Ø¢Ø®Ø± ØªØ­Ø¯ÙŠØ«:</strong> {article.lastUpdated}
                  </p>
                  <p className="mt-2">
                    <strong>Ø§Ù„ØªØµÙ†ÙŠÙ:</strong>{' '}
                    <Link href={`/category/${article.category}`} className="text-primary">
                      {article.category}
                    </Link>
                  </p>
                  {article.authorName && (
                    <p className="mt-2">
                      <strong>Ø§Ù„ÙƒØ§ØªØ¨:</strong> {article.authorName}
                      {article.authorEmail && (
                        <span className="text-text-secondary"> ({article.authorEmail})</span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <aside className="w-full md:w-80 md:flex-shrink-0">
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
                  currentAssociation={article.currentAssociation}
                  currentAssociationMembers={article.currentAssociationMembers}
                  formerCommitteeMembers={article.formerCommitteeMembers}
                  associationOtherInfo={article.associationOtherInfo}
                  associationMembers={article.associationMembers}
                  mosqueWorkers={article.mosqueWorkers}
                  mosqueEngineer={article.mosqueEngineer}
                  historicalPeriod={article.historicalPeriod}
                  bankAccountName={article.bankAccountName}
                  bankAccountNumber={article.bankAccountNumber}
                  bankName={article.bankName}
                />
              )}
              {toc.length > 0 && <TableOfContents items={toc} />}
              <SuggestedArticles
                currentSlug={slug}
                wilaya={article.wilaya}
                articleType={article.articleType}
              />
            </aside>
          </div>
        </main>
      </div>
    </div>
  )
}

