'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import WikiHeader from '@/components/WikiHeader'
import WikiSidebar from '@/components/WikiSidebar'
import { Edit, Trash2, Plus, UserCircle, Landmark, FileText } from 'lucide-react'

interface Article {
  slug: string
  title: string
  description: string
  category: string
  lastUpdated: string
}

export default function AdminPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/search')
      const data = await response.json()
      setArticles(data.results || data)
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (slug: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) return

    try {
      const response = await fetch(`/api/articles/${slug}`, { method: 'DELETE' })
      if (response.ok) {
        setArticles(articles.filter((a) => a.slug !== slug))
      } else {
        alert('خطأ في حذف المقال')
      }
    } catch (error) {
      console.error('Error deleting article:', error)
      alert('خطأ في حذف المقال')
    }
  }

  const imamCount = articles.filter(a => a.category === 'أئمة').length
  const mosqueCount = articles.filter(a => a.category === 'مساجد').length

  return (
    <div className="min-h-screen bg-bg-main">
      <WikiHeader />

      <div className="flex max-w-[1400px] mx-auto">
        <WikiSidebar />

        <main className="flex-1 px-4 md:px-6 py-4 max-w-[960px]">
          <h1 className="text-2xl md:text-4xl font-heading font-bold text-primary border-b-2 border-border-light pb-2 mb-4">
            لوحة التحكم
          </h1>
          <p className="text-text-secondary mb-6">إدارة مقالات موسوعة أئمة ومساجد الجزائر</p>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link
              href="/admin/submissions"
              className="card-islamic rounded-lg p-5 hover:no-underline"
            >
              <div className="flex items-center gap-3 mb-2">
                <FileText size={22} className="text-accent" />
                <h3 className="text-lg font-heading font-bold text-primary">المقالات المعلقة</h3>
              </div>
              <p className="text-sm text-text-secondary">مراجعة المقالات المقدمة من الزوار</p>
            </Link>
            <Link
              href="/wiki/create"
              className="card-islamic rounded-lg p-5 hover:no-underline"
            >
              <div className="flex items-center gap-3 mb-2">
                <Plus size={22} className="text-primary" />
                <h3 className="text-lg font-heading font-bold text-primary">إنشاء مقال</h3>
              </div>
              <p className="text-sm text-text-secondary">نشر مقال جديد مباشرة</p>
            </Link>
            <div className="card-islamic rounded-lg p-5">
              <h3 className="text-lg font-heading font-bold text-primary mb-3">إحصائيات</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="flex items-center gap-1 text-text-secondary">
                    <UserCircle size={14} /> أئمة
                  </span>
                  <span className="font-bold text-primary">{imamCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1 text-text-secondary">
                    <Landmark size={14} /> مساجد
                  </span>
                  <span className="font-bold text-primary">{mosqueCount}</span>
                </div>
                <div className="flex justify-between border-t border-border-light pt-1 mt-1">
                  <span className="text-text-secondary">المجموع</span>
                  <span className="font-bold text-primary">{articles.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Articles List */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-heading font-bold text-primary">جميع المقالات</h2>
            <Link
              href="/wiki/create"
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Plus size={16} />
              مقال جديد
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8 text-text-secondary">جاري التحميل...</div>
          ) : articles.length === 0 ? (
            <div className="text-center py-8 text-text-secondary">لا توجد مقالات</div>
          ) : (
            <div className="space-y-3">
              {articles.map((article) => (
                <div
                  key={article.slug}
                  className="card-islamic rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Link
                        href={`/wiki/${article.slug}`}
                        className="text-lg font-bold text-primary hover:underline"
                      >
                        {article.title}
                      </Link>
                      <p className="text-text-secondary text-sm mt-1">{article.description}</p>
                      <div className="flex gap-4 mt-2 text-xs text-text-secondary">
                        <span className="flex items-center gap-1">
                          {article.category === 'أئمة' ? <UserCircle size={12} /> : <Landmark size={12} />}
                          {article.category}
                        </span>
                        <span>آخر تحديث: {article.lastUpdated}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mr-4">
                      <Link
                        href={`/wiki/${article.slug}/edit`}
                        className="p-3 text-primary hover:bg-primary/10 rounded"
                        title="تعديل"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(article.slug)}
                        className="p-3 text-destructive hover:bg-red-50 rounded"
                        title="حذف"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
