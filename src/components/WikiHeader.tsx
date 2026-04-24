'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Landmark, Mail, Menu, X } from 'lucide-react'
import HijabiWomanIcon from './HijabiWomanIcon'
import ImamIcon from './ImamIcon'
import MosqueIcon from './MosqueIcon'
import SearchBar from './SearchBar'

export default function WikiHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-primary text-white shadow-lg">
      <div className="mx-auto max-w-[1400px] px-4 py-3 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-8">
            <Link href="/" className="flex flex-shrink-0 items-center gap-2 hover:no-underline">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/20">
                <Landmark size={20} className="text-accent" />
              </div>
              <div className="hidden font-heading text-base text-white sm:block md:text-xl">
                موسوعة أئمة ومساجد الجزائر
              </div>
            </Link>

            <nav className="hidden gap-6 text-sm md:flex">
              <Link href="/" className="text-white/80 transition-colors hover:text-accent hover:no-underline">
                الرئيسية
              </Link>
              <Link
                href="/imams"
                className="flex items-center gap-1 text-white/80 transition-colors hover:text-accent hover:no-underline"
              >
                <ImamIcon size={14} />
                الأئمة
              </Link>
              <Link
                href="/mosques"
                className="flex items-center gap-1 text-white/80 transition-colors hover:text-accent hover:no-underline"
              >
                <MosqueIcon size={14} />
                المساجد
              </Link>
              <Link
                href="/quran-teachers"
                className="flex items-center gap-1 text-white/80 transition-colors hover:text-accent hover:no-underline"
              >
                <BookOpen size={14} />
                معلمو القرآن
              </Link>
              <Link
                href="/mourshidat"
                className="flex items-center gap-1 text-white/80 transition-colors hover:text-accent hover:no-underline"
              >
                <HijabiWomanIcon size={14} />
                المرشدات
              </Link>
              <Link href="/submit" className="text-white/80 transition-colors hover:text-accent hover:no-underline">
                تقديم مقال
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:block">
              <SearchBar />
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 font-semibold text-primary-dark transition-all hover:bg-accent-light hover:no-underline hover:shadow-md"
            >
              <Mail size={16} />
              <span className="hidden sm:inline">تواصل</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2.5 transition-colors hover:bg-white/10 md:hidden"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="space-y-1 border-t border-white/10 bg-primary-dark px-4 py-4 md:hidden">
          <div className="mb-3">
            <SearchBar />
          </div>
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-accent hover:no-underline"
          >
            الرئيسية
          </Link>
          <Link
            href="/imams"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-accent hover:no-underline"
          >
            <ImamIcon size={16} />
            الأئمة
          </Link>
          <Link
            href="/mosques"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-accent hover:no-underline"
          >
            <MosqueIcon size={16} />
            المساجد
          </Link>
          <Link
            href="/quran-teachers"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-accent hover:no-underline"
          >
            <BookOpen size={16} />
            معلمو القرآن الكريم
          </Link>
          <Link
            href="/mourshidat"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-accent hover:no-underline"
          >
            <HijabiWomanIcon size={16} />
            المرشدات الدينيات
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-accent hover:no-underline"
          >
            <Mail size={16} />
            تواصل
          </Link>
          <Link
            href="/submit"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-accent hover:no-underline"
          >
            تقديم مقال
          </Link>
        </div>
      )}

      <div className="h-1 bg-gradient-to-l from-accent via-accent-light to-accent" />
    </header>
  )
}
