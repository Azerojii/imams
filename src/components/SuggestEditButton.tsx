'use client'

import { useState } from 'react'
import { Pencil, Loader2, X } from 'lucide-react'

import QuillEditor from './QuillEditor'

interface SuggestEditButtonProps {
  slug: string
  articleTitle: string
  initialContent: string
}

export default function SuggestEditButton({ slug, articleTitle, initialContent }: SuggestEditButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [description, setDescription] = useState('')
  const [newContent, setNewContent] = useState(initialContent)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/edit-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: decodeURIComponent(slug),
          articleTitle,
          suggestedBy: name,
          suggestedByEmail: email,
          description,
          newContent: newContent || undefined,
          originalContent: initialContent || undefined,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'فشل في إرسال الاقتراح')

      setSuccess(true)
      setTimeout(() => {
        setIsOpen(false)
        setSuccess(false)
        setName('')
        setEmail('')
        setDescription('')
        setNewContent('')
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في إرسال الاقتراح')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1 px-3 py-1.5 text-sm text-text-secondary hover:text-primary hover:bg-primary/5 rounded transition-colors"
        title="اقتراح تعديل"
      >
        <Pencil size={14} />
        <span>اقتراح تعديل</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start gap-3 mb-4">
              <h2 className="text-lg sm:text-xl font-heading font-bold text-primary">اقتراح تعديل على: {articleTitle}</h2>
              <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-gray-100 rounded flex-shrink-0">
                <X size={20} />
              </button>
            </div>

            {success ? (
              <div className="bg-green-50 border border-green-200 rounded p-4 text-center">
                <p className="text-green-800 font-bold">تم إرسال اقتراحك بنجاح!</p>
                <p className="text-green-700 text-sm">سيتم مراجعته من قبل الإدارة.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-destructive px-4 py-2 rounded text-sm">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-1 text-black">الاسم <span className="text-destructive">*</span></label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-border-light rounded text-base sm:text-sm"
                      placeholder="اسمك"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1 text-black">البريد الإلكتروني <span className="text-destructive">*</span></label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-border-light rounded text-base sm:text-sm"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1 text-black">وصف التعديل المقترح <span className="text-destructive">*</span></label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-border-light rounded text-sm"
                    placeholder="اشرح ما تريد تعديله أو إضافته..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1 text-black">المحتوى الجديد (اختياري)</label>
                  <QuillEditor
                    value={newContent}
                    onChange={setNewContent}
                    placeholder="قم بإجراء التعديلات اللازمة هنا..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary flex items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        جاري الإرسال...
                      </>
                    ) : (
                      'إرسال الاقتراح'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-bg-sidebar hover:bg-border-light rounded font-medium transition-colors text-sm"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
