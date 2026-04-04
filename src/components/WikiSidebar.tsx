'use client'

import Link from 'next/link'
import { UserCircle, Landmark, Home, PenSquare } from 'lucide-react'

export default function WikiSidebar() {
  return (
    <aside className="w-52 flex-shrink-0 bg-bg-sidebar border-l border-border-light px-4 py-6 hidden lg:block">
      <nav className="space-y-5">
        {/* Navigation */}
        <div>
          <h3 className="text-xs font-bold text-text-secondary mb-3 font-heading">التصفح</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary-light transition-colors">
                <Home size={15} />
                الرئيسية
              </Link>
            </li>
            <li>
              <Link href="/imams" className="flex items-center gap-2 text-primary hover:text-primary-light transition-colors">
                <UserCircle size={15} />
                الأئمة
              </Link>
            </li>
            <li>
              <Link href="/mosques" className="flex items-center gap-2 text-primary hover:text-primary-light transition-colors">
                <Landmark size={15} />
                المساجد
              </Link>
            </li>
          </ul>
        </div>

        {/* Divider */}
        <div className="gold-line"></div>

        {/* Categories */}
        <div>
          <h3 className="text-xs font-bold text-text-secondary mb-3 font-heading">التصنيفات</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/category/أئمة" className="text-primary hover:text-primary-light transition-colors">
                أئمة
              </Link>
            </li>
            <li>
              <Link href="/category/مساجد" className="text-primary hover:text-primary-light transition-colors">
                مساجد
              </Link>
            </li>
          </ul>
        </div>

        {/* Divider */}
        <div className="gold-line"></div>

        {/* Tools */}
        <div>
          <h3 className="text-xs font-bold text-text-secondary mb-3 font-heading">الأدوات</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/submit" className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors">
                <PenSquare size={15} />
                تقديم مقال
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  )
}
