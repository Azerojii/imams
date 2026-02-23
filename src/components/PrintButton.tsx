'use client'

import { Printer } from 'lucide-react'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-1 px-3 py-1.5 text-sm text-text-secondary hover:text-primary hover:bg-primary/5 rounded transition-colors"
      title="طباعة المقال"
    >
      <Printer size={14} />
      <span>طباعة</span>
    </button>
  )
}
