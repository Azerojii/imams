'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Plus, User, ChevronDown } from 'lucide-react'

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-accent text-primary-dark rounded-lg hover:bg-accent-light transition-all shadow-sm hover:shadow-md font-semibold"
      >
        <User size={18} />
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-60 sm:w-64 bg-white rounded-lg shadow-xl border border-border-light overflow-hidden z-50">
          <div className="py-2">
            {/* Contribute Section */}
            <div className="px-4 py-2 bg-bg-sidebar border-b border-border-light">
              <p className="text-xs font-semibold text-text-secondary font-heading">
                المساهمة
              </p>
            </div>
            <Link
              href="/submit"
              className="flex items-center gap-3 px-4 py-3 hover:bg-bg-main transition-colors group"
              onClick={() => setIsOpen(false)}
            >
              <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                <Plus size={18} className="text-accent-dark" />
              </div>
              <div>
                <div className="font-medium text-text-primary">تقديم مقال</div>
                <div className="text-xs text-text-secondary">اقتراح مقال جديد</div>
              </div>
            </Link>

          </div>
        </div>
      )}
    </div>
  )
}
