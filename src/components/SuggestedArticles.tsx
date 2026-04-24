import Link from 'next/link'
import Image from 'next/image'
import { BookOpen } from 'lucide-react'
import HijabiWomanIcon from '@/components/HijabiWomanIcon'
import ImamIcon from '@/components/ImamIcon'
import MosqueIcon from '@/components/MosqueIcon'
import { getSuggestedArticles } from '@/lib/wiki'
import type { WikiMetadata } from '@/lib/wiki'

interface SuggestedArticlesProps {
  currentSlug: string
  wilaya?: string
  articleType: string
}

function TypeIcon({ type, size = 14 }: { type: string; size?: number }) {
  switch (type) {
    case 'mosque': return <MosqueIcon size={size} />
    case 'quran_teacher': return <BookOpen size={size} />
    case 'mourshida': return <HijabiWomanIcon size={size} />
    default: return <ImamIcon size={size} />
  }
}

function typeLabel(type: string) {
  switch (type) {
    case 'imam': return 'أئمة'
    case 'mosque': return 'مساجد'
    case 'quran_teacher': return 'معلمو القرآن'
    case 'mourshida': return 'المرشدات'
    default: return 'مقترحة'
  }
}

function SuggestedCard({ article }: { article: WikiMetadata }) {
  return (
    <Link
      href={`/wiki/${encodeURIComponent(article.slug)}`}
      className="flex items-start gap-2 p-2 rounded hover:bg-primary/5 transition-colors group"
    >
      {article.imageSrc ? (
        <div className="w-10 h-10 flex-shrink-0 overflow-hidden rounded">
          <img
            src={article.imageSrc}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-10 h-10 flex-shrink-0 bg-primary/10 rounded flex items-center justify-center text-primary">
          <TypeIcon type={article.articleType} size={18} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors leading-tight line-clamp-2">
          {article.title}
        </p>
        {article.commune && (
          <p className="text-xs text-text-secondary mt-0.5">{article.commune}</p>
        )}
      </div>
    </Link>
  )
}

export default async function SuggestedArticles({
  currentSlug,
  wilaya,
  articleType,
}: SuggestedArticlesProps) {
  const suggested = await getSuggestedArticles(currentSlug, wilaya, articleType, 5)

  if (suggested.length === 0) return null

  return (
    <div className="infobox w-full mt-4">
      <div className="infobox-header flex items-center gap-1.5">
        <TypeIcon type={articleType} size={13} />
        {typeLabel(articleType)} مقترحة من {wilaya}
      </div>
      <div className="divide-y divide-border-light">
        {suggested.map((article) => (
          <SuggestedCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  )
}
