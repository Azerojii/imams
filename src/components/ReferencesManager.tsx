'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react'
import type { Reference } from '@/lib/wiki'

interface ReferencesManagerProps {
  references: Reference[]
  onChange: (references: Reference[]) => void
  onInsertCitation?: (refId: string) => void
}

export default function ReferencesManager({ references, onChange, onInsertCitation }: ReferencesManagerProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', author: '', year: '', url: '', publisher: '' })

  const resetForm = () => {
    setForm({ title: '', author: '', year: '', url: '', publisher: '' })
    setIsAdding(false)
    setEditingId(null)
  }

  const handleSave = () => {
    if (!form.title.trim()) return

    if (editingId) {
      onChange(references.map(r => r.id === editingId ? {
        ...r,
        title: form.title,
        author: form.author || undefined,
        year: form.year || undefined,
        url: form.url || undefined,
        publisher: form.publisher || undefined,
      } : r))
    } else {
      const newRef: Reference = {
        id: crypto.randomUUID(),
        title: form.title,
        author: form.author || undefined,
        year: form.year || undefined,
        url: form.url || undefined,
        publisher: form.publisher || undefined,
      }
      onChange([...references, newRef])
    }
    resetForm()
  }

  const handleEdit = (ref: Reference) => {
    setEditingId(ref.id)
    setForm({
      title: ref.title,
      author: ref.author || '',
      year: ref.year || '',
      url: ref.url || '',
      publisher: ref.publisher || '',
    })
    setIsAdding(true)
  }

  const handleDelete = (id: string) => {
    onChange(references.filter(r => r.id !== id))
  }

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen size={18} className="text-gray-600" />
        <label className="text-sm font-bold">المراجع والتهميشات</label>
      </div>
      <p className="text-xs text-gray-600 mb-4">
        أضف المراجع ثم أدرج الاستشهادات في النص بزر &quot;استشهد&quot;.
      </p>

      {references.length > 0 && (
        <div className="space-y-2 mb-4">
          {references.map((ref, index) => (
            <div key={ref.id} className="flex items-start gap-2 bg-white border border-gray-200 rounded p-2 text-sm">
              <span className="font-bold text-gray-500 mt-0.5">[{index + 1}]</span>
              <div className="flex-1 min-w-0">
                <span className="font-medium">{ref.title}</span>
                {ref.author && <span className="text-gray-600"> — {ref.author}</span>}
                {ref.year && <span className="text-gray-500"> ({ref.year})</span>}
                {ref.publisher && <span className="text-gray-500">، {ref.publisher}</span>}
                {ref.url && (
                  <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline mr-1 text-xs">
                    [رابط]
                  </a>
                )}
              </div>
              <div className="flex gap-1 flex-shrink-0">
                {onInsertCitation && (
                  <button
                    type="button"
                    onClick={() => onInsertCitation(ref.id)}
                    className="px-2 py-1 bg-primary text-white rounded text-xs hover:opacity-90"
                    title="إدراج الاستشهاد في النص"
                  >
                    استشهد
                  </button>
                )}
                <button type="button" onClick={() => handleEdit(ref)} className="p-1 text-gray-500 hover:text-blue-600" title="تعديل">
                  <Pencil size={14} />
                </button>
                <button type="button" onClick={() => handleDelete(ref.id)} className="p-1 text-gray-500 hover:text-red-600" title="حذف">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isAdding ? (
        <div className="space-y-2 bg-white border border-gray-200 rounded p-3">
          <input
            type="text"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="العنوان *"
            className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={form.author}
              onChange={e => setForm({ ...form, author: e.target.value })}
              placeholder="المؤلف"
              className="px-3 py-1.5 border border-gray-300 rounded text-sm"
            />
            <input
              type="text"
              value={form.year}
              onChange={e => setForm({ ...form, year: e.target.value })}
              placeholder="السنة"
              className="px-3 py-1.5 border border-gray-300 rounded text-sm"
            />
          </div>
          <input
            type="text"
            value={form.publisher}
            onChange={e => setForm({ ...form, publisher: e.target.value })}
            placeholder="الناشر / المصدر"
            className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
          />
          <input
            type="url"
            value={form.url}
            onChange={e => setForm({ ...form, url: e.target.value })}
            placeholder="الرابط (اختياري)"
            className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
          />
          <div className="flex gap-2">
            <button type="button" onClick={handleSave} disabled={!form.title.trim()} className="px-3 py-1.5 bg-primary text-white rounded text-xs hover:opacity-90 disabled:bg-gray-300">
              {editingId ? 'تحديث' : 'إضافة'}
            </button>
            <button type="button" onClick={resetForm} className="px-3 py-1.5 bg-gray-200 rounded text-xs hover:bg-gray-300">
              إلغاء
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
        >
          <Plus size={16} />
          إضافة مرجع
        </button>
      )}
    </div>
  )
}
