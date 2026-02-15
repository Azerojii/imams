'use client'

import Link from 'next/link'
import SearchBar from './SearchBar'
import UserMenu from './UserMenu'
import { UserCircle, Landmark } from 'lucide-react'

export default function WikiHeader() {
  return (
    <header className="sticky top-0 z-50 bg-primary text-white shadow-lg">
      <div className="max-w-[1400px] mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 hover:no-underline">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <Landmark size={22} className="text-accent" />
              </div>
              <div className="font-heading text-xl text-white">
                موسوعة أئمة ومساجد الجزائر
              </div>
            </Link>

            <nav className="hidden md:flex gap-6 text-sm">
              <Link href="/" className="text-white/80 hover:text-accent transition-colors hover:no-underline">
                الرئيسية
              </Link>
              <Link href="/imams" className="text-white/80 hover:text-accent transition-colors hover:no-underline flex items-center gap-1">
                <UserCircle size={14} />
                الأئمة
              </Link>
              <Link href="/mosques" className="text-white/80 hover:text-accent transition-colors hover:no-underline flex items-center gap-1">
                <Landmark size={14} />
                المساجد
              </Link>
              <Link href="/submit" className="text-white/80 hover:text-accent transition-colors hover:no-underline">
                تقديم مقال
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <SearchBar />
            <UserMenu />
          </div>
        </div>
      </div>
      {/* Islamic decorative border */}
      <div className="h-1 bg-gradient-to-l from-accent via-accent-light to-accent"></div>
    </header>
  )
}
