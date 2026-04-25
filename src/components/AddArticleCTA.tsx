import Link from 'next/link'
import { Plus } from 'lucide-react'

type ArticleType = 'imam' | 'mosque' | 'quran_teacher' | 'mourshida'

function getTypeLabel(type: ArticleType): string {
  switch (type) {
    case 'imam': return 'إمام'
    case 'mosque': return 'مسجد'
    case 'quran_teacher': return 'معلم قرآن'
    case 'mourshida': return 'مرشدة دينية'
  }
}

export default function AddArticleCTA({ articleType }: { articleType: ArticleType }) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4 rounded-lg border border-yellow-300 bg-yellow-50 px-5 py-3">
      <div dir="rtl">
        <p className="text-sm font-semibold text-yellow-800 font-heading">أضف إلى هذه المقالات</p>
        <p className="text-xs text-yellow-700 mt-0.5">
          ساهم بتوثيق {getTypeLabel(articleType)} جديد في الموسوعة
        </p>
      </div>
      <Link
        href={`/submit?type=${articleType}`}
        className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 hover:no-underline transition-colors whitespace-nowrap flex-shrink-0"
      >
        <Plus size={15} />
        إضافة مقال
      </Link>
    </div>
  )
}
