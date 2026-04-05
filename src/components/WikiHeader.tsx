'use client'

import { useState } from 'react'
import Link from 'next/link'
import SearchBar from './SearchBar'
import UserMenu from './UserMenu'
import { UserCircle, Landmark, Menu, X, BookOpen } from 'lucide-react'
import HijabiWomanIcon from './HijabiWomanIcon'

export default function WikiHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-primary text-white shadow-lg">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo + Desktop Nav */}
          <div className="flex items-center gap-8 min-w-0">
            <Link href="/" className="flex items-center gap-2 hover:no-underline flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center">
                <Landmark size={20} className="text-accent" />
              </div>
              <div className="font-heading text-base md:text-xl text-white hidden sm:block">
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
              <Link href="/quran-teachers" className="text-white/80 hover:text-accent transition-colors hover:no-underline flex items-center gap-1">
                <BookOpen size={14} />
                معلمو القرآن
              </Link>
              <Link href="/mourshidat" className="text-white/80 hover:text-accent transition-colors hover:no-underline flex items-center gap-1">
                <HijabiWomanIcon size={14} />
                المرشدات
              </Link>
              <Link href="/submit" className="text-white/80 hover:text-accent transition-colors hover:no-underline">
                تقديم مقال
              </Link>
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:block">
              <SearchBar />
            </div>
            <UserMenu />
            {/* Hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary-dark border-t border-white/10 px-4 py-4 space-y-1">
          <div className="mb-3">
            <SearchBar />
          </div>
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-white/80 hover:bg-white/10 hover:text-accent transition-colors hover:no-underline text-sm"
          >
            الرئيسية
          </Link>
          <Link
            href="/imams"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-white/80 hover:bg-white/10 hover:text-accent transition-colors hover:no-underline text-sm"
          >
            <UserCircle size={16} />
            الأئمة
          </Link>
          <Link
            href="/mosques"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-white/80 hover:bg-white/10 hover:text-accent transition-colors hover:no-underline text-sm"
          >
            <Landmark size={16} />
            المساجد
          </Link>
          <Link
            href="/quran-teachers"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-white/80 hover:bg-white/10 hover:text-accent transition-colors hover:no-underline text-sm"
          >
            <BookOpen size={16} />
            معلمو القرآن الكريم
          </Link>
          <Link
            href="/mourshidat"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-white/80 hover:bg-white/10 hover:text-accent transition-colors hover:no-underline text-sm"
          >
            <HijabiWomanIcon size={16} />
            المرشدات الدينيات
          </Link>
          <Link
            href="/submit"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-white/80 hover:bg-white/10 hover:text-accent transition-colors hover:no-underline text-sm"
          >
            تقديم مقال
          </Link>
        </div>
      )}

      {/* Islamic decorative border */}
      <div className="h-1 bg-gradient-to-l from-accent via-accent-light to-accent"></div>
    </header>
  )
}
