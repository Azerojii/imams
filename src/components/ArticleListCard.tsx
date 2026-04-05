import Image from 'next/image'
import Link from 'next/link'
import { BookOpen, Landmark, MapPin, UserCircle } from 'lucide-react'
import HijabiWomanIcon from './HijabiWomanIcon'
import type { WikiMetadata } from '@/lib/wiki'

function getTypeIcon(type: WikiMetadata['articleType']) {
  switch (type) {
    case 'imam':
      return <UserCircle size={14} className="text-accent-dark" />
    case 'mosque':
      return <Landmark size={14} className="text-accent-dark" />
    case 'quran_teacher':
      return <BookOpen size={14} className="text-accent-dark" />
    case 'mourshida':
      return <HijabiWomanIcon size={14} className="text-accent-dark" />
    default:
      return <UserCircle size={14} className="text-accent-dark" />
  }
}

function getTypeLabel(type: WikiMetadata['articleType']) {
  switch (type) {
    case 'imam':
      return 'إمام'
    case 'mosque':
      return 'مسجد'
    case 'quran_teacher':
      return 'معلم قرآن'
    case 'mourshida':
      return 'مرشدة دينية'
    default:
      return ''
  }
}

export default function ArticleListCard({ article }: { article: WikiMetadata }) {
  return (
    <Link
      href={`/wiki/${article.slug}`}
      className="card-islamic group block rounded-2xl p-4 sm:p-5 hover:no-underline"
    >
      <div className="flex items-start gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-full border border-border-light bg-bg-sidebar flex-shrink-0 sm:h-20 sm:w-20">
          {article.imageSrc ? (
            <Image
              src={article.imageSrc}
              alt={article.title}
              fill
              sizes="80px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-bg-sidebar to-accent/15">
              {getTypeIcon(article.articleType)}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            <span className="flex items-center gap-1 text-accent-dark font-semibold">
              {getTypeIcon(article.articleType)}
              {getTypeLabel(article.articleType)}
            </span>
            {article.wilaya && (
              <span className="flex items-center gap-1 text-text-secondary">
                <MapPin size={12} className="text-accent-dark" />
                {article.wilaya}
              </span>
            )}
            <span className="text-text-secondary sm:mr-auto">{article.lastUpdated}</span>
          </div>

          <h3 className="text-lg font-bold text-primary sm:text-xl">{article.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-text-secondary sm:text-base">{article.description}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            {article.commune && (
              <span className="rounded-full bg-accent/10 px-2.5 py-1 font-medium text-accent-dark">
                {article.commune}
              </span>
            )}
            {article.authorName && (
              <span className="text-text-secondary">بقلم: {article.authorName}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
