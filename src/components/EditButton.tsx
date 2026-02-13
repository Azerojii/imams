'use client'

import Link from 'next/link'
import { Edit } from 'lucide-react'

export default function EditButton({ slug }: { slug: string }) {
  return (
    <Link
      href={`/wiki/${slug}/edit`}
      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-light text-sm font-medium mb-4 transition-colors"
    >
      <Edit size={16} />
      تعديل المقال
    </Link>
  )
}
