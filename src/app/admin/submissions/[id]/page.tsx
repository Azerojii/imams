'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import WikiHeader from '@/components/WikiHeader'
import WikiSidebar from '@/components/WikiSidebar'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import { Loader2, Check, X, Edit } from 'lucide-react'

interface Submission {
  id: string
  title: string
  description: string
  category: string
  content: string
  submittedAt: string
  submitterName: string
  submitterEmail: string
}

export default function ReviewSubmissionPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [submission, setSubmission] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  
  // Edit mode
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState('')
  const [editedDescription, setEditedDescription] = useState('')
  const [editedCategory, setEditedCategory] = useState('')
  const [editedContent, setEditedContent] = useState('')

  useEffect(() => {
    fetchSubmission()
  }, [id])

  const fetchSubmission = async () => {
    try {
      const response = await fetch(`/api/submissions/${id}`)
      const data = await response.json()
      
      if (response.ok) {
        setSubmission(data)
        setEditedTitle(data.title)
        setEditedDescription(data.description)
        setEditedCategory(data.category)
        setEditedContent(data.content)
      } else {
        setError(data.error || 'Failed to load submission')
      }
    } catch (error) {
      console.error('Error fetching submission:', error)
      setError('Failed to load submission')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!confirm('Êtes-vous sûr de vouloir approuver et publier cet article ?')) {
      return
    }

    setProcessing(true)
    setError('')

    try {
      const response = await fetch(`/api/submissions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve',
          title: editedTitle,
          description: editedDescription,
          category: editedCategory,
          content: editedContent,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert('Article approuvé et publié avec succès !')
        router.push('/admin/submissions')
      } else {
        setError(data.error || 'Failed to approve submission')
      }
    } catch (error) {
      console.error('Error approving submission:', error)
      setError('Failed to approve submission')
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!confirm('Êtes-vous sûr de vouloir rejeter cette soumission ? Cette action est irréversible.')) {
      return
    }

    setProcessing(true)
    setError('')

    try {
      const response = await fetch(`/api/submissions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject' }),
      })

      const data = await response.json()

      if (response.ok) {
        alert('Soumission rejetée')
        router.push('/admin/submissions')
      } else {
        setError(data.error || 'Failed to reject submission')
      }
    } catch (error) {
      console.error('Error rejecting submission:', error)
      setError('Failed to reject submission')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <WikiHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      </div>
    )
  }

  if (error || !submission) {
    return (
      <div className="min-h-screen bg-white">
        <WikiHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Soumission introuvable'}</p>
            <button
              onClick={() => router.push('/admin/submissions')}
              className="px-4 py-2 bg-primary text-white rounded hover:opacity-90"
            >
              Retour aux soumissions
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <WikiHeader />
      
      <div className="flex max-w-[1400px] mx-auto">
        <WikiSidebar />
        
        <main className="flex-1 px-4 md:px-6 py-4 max-w-[900px]">
          <div className="mb-6">
            <h1 className="text-2xl md:text-4xl font-heading font-bold border-b border-border-light pb-2 mb-4 text-primary">
              مراجعة المقال المقدم
            </h1>
            
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <strong>المقدم:</strong> {submission.submitterName || 'مجهول'}
                </div>
                {submission.submitterEmail && (
                  <div className="break-all">
                    <strong>البريد:</strong> {submission.submitterEmail}
                  </div>
                )}
                <div>
                  <strong>التاريخ:</strong> {new Date(submission.submittedAt).toLocaleDateString('ar-DZ')}
                </div>
                <div>
                  <strong>التصنيف:</strong> {submission.category}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded hover:opacity-90 text-sm"
              >
                <Edit size={16} />
                {isEditing ? 'إلغاء التعديل' : 'تعديل قبل النشر'}
              </button>
              <button
                onClick={handleApprove}
                disabled={processing}
                className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm"
              >
                <Check size={16} />
                {processing ? 'جاري...' : 'موافقة ونشر'}
              </button>
              <button
                onClick={handleReject}
                disabled={processing}
                className="flex items-center gap-2 px-4 py-2.5 bg-destructive text-white rounded hover:opacity-90 disabled:opacity-50 text-sm"
              >
                <X size={16} />
                رفض
              </button>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Titre</label>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Description</label>
                <input
                  type="text"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Catégorie</label>
                <select
                  value={editedCategory}
                  onChange={(e) => setEditedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option>Histoire</option>
                  <option>Architecture</option>
                  <option>Culture</option>
                  <option>Religion</option>
                  <option>Événements</option>
                  <option>Personnalités</option>
                  <option>Général</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Contenu (Markdown)</label>
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  rows={20}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                />
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-3xl font-serif font-bold mb-2">{submission.title}</h2>
              {submission.description && (
                <p className="text-gray-600 italic mb-6">{submission.description}</p>
              )}
              <MarkdownRenderer content={submission.content} />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

