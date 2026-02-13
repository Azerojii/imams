'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import WikiHeader from '@/components/WikiHeader'
import WikiSidebar from '@/components/WikiSidebar'
import { Eye, Clock } from 'lucide-react'

interface Submission {
  id: string
  title: string
  description: string
  category: string
  submittedAt: string
  submitterName: string
  submitterEmail: string
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/submissions')
      const data = await response.json()
      setSubmissions(data.submissions || [])
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-DZ', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-bg-main">
      <WikiHeader />

      <div className="flex max-w-[1400px] mx-auto">
        <WikiSidebar />

        <main className="flex-1 px-6 py-4 max-w-[960px]">
          <h1 className="text-4xl font-heading font-bold text-primary border-b-2 border-border-light pb-2 mb-4">
            المقالات المعلقة
          </h1>
          <div className="mb-6">
            <Link href="/admin" className="text-primary hover:underline text-sm">
              → العودة إلى لوحة التحكم
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8 text-text-secondary">جاري التحميل...</div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12 text-text-secondary bg-bg-card rounded-lg border border-border-light">
              <Clock size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg font-semibold mb-2">لا توجد مقالات معلقة</p>
              <p className="text-sm">المقالات الجديدة المقدمة ستظهر هنا</p>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((submission) => (
                <div key={submission.id} className="card-islamic rounded-lg p-5">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-text-primary mb-2">
                        {submission.title}
                      </h2>
                      <p className="text-text-secondary mb-3">{submission.description}</p>

                      <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
                        <span><strong>التصنيف:</strong> {submission.category}</span>
                        <span><strong>المقدم:</strong> {submission.submitterName || 'مجهول'}</span>
                        {submission.submitterEmail && (
                          <span><strong>البريد:</strong> {submission.submitterEmail}</span>
                        )}
                        <span><strong>التاريخ:</strong> {formatDate(submission.submittedAt)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mr-4">
                      <Link
                        href={`/admin/submissions/${submission.id}`}
                        className="p-2 text-primary hover:bg-primary/10 rounded border border-primary"
                        title="مراجعة"
                      >
                        <Eye size={18} />
                      </Link>
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
