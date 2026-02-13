'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Plus, Trash2, BookOpen, Landmark } from 'lucide-react'
import LocationPicker from './LocationPicker'
import ImageUploader from './ImageUploader'
import RichTextEditor from './RichTextEditor'

interface MosqueRef {
  name: string
  slug: string
  startDate: string
  endDate: string
}

interface ImamRef {
  name: string
  slug: string
  startDate: string
  endDate: string
}

interface ArticleFormProps {
  mode: 'submit' | 'create'
  initialTitle?: string
}

export default function ArticleForm({ mode, initialTitle = '' }: ArticleFormProps) {
  const router = useRouter()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [articleType, setArticleType] = useState<'imam' | 'mosque'>('imam')
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [useRichText, setUseRichText] = useState(false)

  // Submitter info (only for submit mode)
  const [submitterName, setSubmitterName] = useState('')
  const [submitterEmail, setSubmitterEmail] = useState('')

  // Shared fields
  const [wilaya, setWilaya] = useState('')
  const [commune, setCommune] = useState('')
  const [wilayaCode, setWilayaCode] = useState('')
  const [image, setImage] = useState('')
  const [imageCaption, setImageCaption] = useState('')
  const [youtubeVideos, setYoutubeVideos] = useState<string[]>([])

  // Imam fields
  const [birthDate, setBirthDate] = useState('')
  const [deathDate, setDeathDate] = useState('')
  const [isAlive, setIsAlive] = useState(true)
  const [mosquesServed, setMosquesServed] = useState<MosqueRef[]>([])

  // Mosque fields
  const [dateBuilt, setDateBuilt] = useState('')
  const [imamsServed, setImamsServed] = useState<ImamRef[]>([])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleLocationChange = (loc: { wilaya: string; commune: string; wilayaCode: string }) => {
    setWilaya(loc.wilaya)
    setCommune(loc.commune)
    setWilayaCode(loc.wilayaCode)
  }

  const handleImageSelected = ({ src, caption }: { src: string; caption?: string }) => {
    setImage(src)
    setImageCaption(caption || '')
  }

  const addMosqueRef = () => {
    setMosquesServed([...mosquesServed, { name: '', slug: '', startDate: '', endDate: '' }])
  }

  const updateMosqueRef = (idx: number, field: keyof MosqueRef, value: string) => {
    const updated = [...mosquesServed]
    updated[idx][field] = value
    if (field === 'name') {
      updated[idx].slug = value.replace(/\s+/g, '_')
    }
    setMosquesServed(updated)
  }

  const removeMosqueRef = (idx: number) => {
    setMosquesServed(mosquesServed.filter((_, i) => i !== idx))
  }

  const addImamRef = () => {
    setImamsServed([...imamsServed, { name: '', slug: '', startDate: '', endDate: '' }])
  }

  const updateImamRef = (idx: number, field: keyof ImamRef, value: string) => {
    const updated = [...imamsServed]
    updated[idx][field] = value
    if (field === 'name') {
      updated[idx].slug = value.replace(/\s+/g, '_')
    }
    setImamsServed(updated)
  }

  const removeImamRef = (idx: number) => {
    setImamsServed(imamsServed.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const validYoutubeVideos = youtubeVideos.filter(v => v.trim() !== '')

      const articleData: Record<string, unknown> = {
        title,
        description,
        category: articleType === 'imam' ? 'أئمة' : 'مساجد',
        articleType,
        content,
        wilaya,
        commune,
        wilayaCode,
        image: image ? { src: image, caption: imageCaption } : undefined,
        youtubeVideos: validYoutubeVideos.length > 0 ? validYoutubeVideos : undefined,
      }

      if (articleType === 'imam') {
        articleData.birthDate = birthDate || undefined
        articleData.deathDate = isAlive ? undefined : deathDate || undefined
        articleData.isAlive = isAlive
        articleData.mosquesServed = mosquesServed.filter(m => m.name.trim() !== '')
      } else {
        articleData.dateBuilt = dateBuilt || undefined
        articleData.imamsServed = imamsServed.filter(i => i.name.trim() !== '')
      }

      if (mode === 'submit') {
        articleData.submitterName = submitterName
        articleData.submitterEmail = submitterEmail
      }

      const endpoint = mode === 'submit' ? '/api/submissions' : '/api/articles'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleData),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'فشل في إرسال المقال')

      if (mode === 'submit') {
        setSuccess(true)
        setTimeout(() => router.push('/'), 3000)
      } else {
        router.push(`/wiki/${data.slug}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في إرسال المقال')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-heading font-bold text-green-800 mb-4">تم التقديم بنجاح!</h2>
        <p className="text-green-700 mb-4">تم تقديم مقالك بنجاح. سيتم مراجعته من قبل الإدارة قبل النشر.</p>
        <p className="text-sm text-green-600">جاري إعادة التوجيه إلى الصفحة الرئيسية...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-destructive px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Article Type Selector */}
      <div>
        <label className="block text-sm font-bold mb-3">نوع المقال <span className="text-destructive">*</span></label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setArticleType('imam')}
            className={`flex items-center justify-center gap-3 p-4 rounded-lg border-2 transition-all ${
              articleType === 'imam'
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border-light hover:border-border text-text-secondary'
            }`}
          >
            <BookOpen size={24} />
            <span className="font-heading text-lg font-bold">إمام</span>
          </button>
          <button
            type="button"
            onClick={() => setArticleType('mosque')}
            className={`flex items-center justify-center gap-3 p-4 rounded-lg border-2 transition-all ${
              articleType === 'mosque'
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border-light hover:border-border text-text-secondary'
            }`}
          >
            <Landmark size={24} />
            <span className="font-heading text-lg font-bold">مسجد</span>
          </button>
        </div>
      </div>

      {/* Submitter Info (submit mode only) */}
      {mode === 'submit' && (
        <div className="bg-bg-sidebar rounded-lg p-4 space-y-4 border border-border-light">
          <h3 className="font-bold text-lg font-heading text-primary">معلوماتك</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">الاسم <span className="text-destructive">*</span></label>
              <input
                type="text"
                value={submitterName}
                onChange={(e) => setSubmitterName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-border-light rounded"
                placeholder="اسمك"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">البريد الإلكتروني <span className="text-destructive">*</span></label>
              <input
                type="email"
                value={submitterEmail}
                onChange={(e) => setSubmitterEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-border-light rounded"
                placeholder="email@example.com"
              />
            </div>
          </div>
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-bold mb-2">
          {articleType === 'imam' ? 'اسم الإمام' : 'اسم المسجد'} <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2 border border-border-light rounded text-lg"
          placeholder={articleType === 'imam' ? 'مثال: الشيخ عبد الحميد بن باديس' : 'مثال: الجامع الأخضر'}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-bold mb-2">وصف مختصر</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border border-border-light rounded"
          placeholder="وصف موجز في سطر واحد"
        />
      </div>

      {/* Location */}
      <div className="bg-bg-sidebar rounded-lg p-4 border border-border-light">
        <LocationPicker
          selectedWilaya={wilaya}
          selectedCommune={commune}
          selectedWilayaCode={wilayaCode}
          onSelect={handleLocationChange}
        />
      </div>

      {/* Type-Specific Fields */}
      {articleType === 'imam' ? (
        <div className="bg-bg-sidebar rounded-lg p-4 border border-border-light space-y-4">
          <h3 className="font-bold text-lg font-heading text-primary">معلومات الإمام</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">تاريخ الميلاد</label>
              <input
                type="text"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-2 border border-border-light rounded"
                placeholder="مثال: 1889-12-05 أو 1889"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold">تاريخ الوفاة</label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={isAlive}
                    onChange={(e) => setIsAlive(e.target.checked)}
                    className="rounded"
                  />
                  <span>على قيد الحياة</span>
                </label>
              </div>
              <input
                type="text"
                value={deathDate}
                onChange={(e) => setDeathDate(e.target.value)}
                disabled={isAlive}
                className="w-full px-4 py-2 border border-border-light rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="مثال: 1940-04-16 أو 1940"
              />
            </div>
          </div>

          {/* Mosques served */}
          <div>
            <label className="block text-sm font-bold mb-2">المساجد التي خدم فيها</label>
            <div className="space-y-2">
              {mosquesServed.map((m, idx) => (
                <div key={idx} className="flex gap-2 items-center bg-white p-2 rounded border border-border-light">
                  <input
                    type="text"
                    value={m.name}
                    onChange={(e) => updateMosqueRef(idx, 'name', e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-border-light rounded text-sm"
                    placeholder="اسم المسجد"
                  />
                  <input
                    type="text"
                    value={m.startDate}
                    onChange={(e) => updateMosqueRef(idx, 'startDate', e.target.value)}
                    className="w-24 px-2 py-1.5 border border-border-light rounded text-sm text-center"
                    placeholder="من"
                  />
                  <input
                    type="text"
                    value={m.endDate}
                    onChange={(e) => updateMosqueRef(idx, 'endDate', e.target.value)}
                    className="w-24 px-2 py-1.5 border border-border-light rounded text-sm text-center"
                    placeholder="إلى"
                  />
                  <button type="button" onClick={() => removeMosqueRef(idx)} className="p-1.5 text-destructive hover:bg-red-50 rounded">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addMosqueRef}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded text-sm text-primary font-medium transition-colors"
              >
                <Plus size={16} />
                إضافة مسجد
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-bg-sidebar rounded-lg p-4 border border-border-light space-y-4">
          <h3 className="font-bold text-lg font-heading text-primary">معلومات المسجد</h3>

          <div>
            <label className="block text-sm font-bold mb-2">تاريخ البناء</label>
            <input
              type="text"
              value={dateBuilt}
              onChange={(e) => setDateBuilt(e.target.value)}
              className="w-full px-4 py-2 border border-border-light rounded"
              placeholder="مثال: 1730 أو القرن 18"
            />
          </div>

          {/* Imams served */}
          <div>
            <label className="block text-sm font-bold mb-2">الأئمة الذين خدموا فيه</label>
            <div className="space-y-2">
              {imamsServed.map((im, idx) => (
                <div key={idx} className="flex gap-2 items-center bg-white p-2 rounded border border-border-light">
                  <input
                    type="text"
                    value={im.name}
                    onChange={(e) => updateImamRef(idx, 'name', e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-border-light rounded text-sm"
                    placeholder="اسم الإمام"
                  />
                  <input
                    type="text"
                    value={im.startDate}
                    onChange={(e) => updateImamRef(idx, 'startDate', e.target.value)}
                    className="w-24 px-2 py-1.5 border border-border-light rounded text-sm text-center"
                    placeholder="من"
                  />
                  <input
                    type="text"
                    value={im.endDate}
                    onChange={(e) => updateImamRef(idx, 'endDate', e.target.value)}
                    className="w-24 px-2 py-1.5 border border-border-light rounded text-sm text-center"
                    placeholder="إلى"
                  />
                  <button type="button" onClick={() => removeImamRef(idx)} className="p-1.5 text-destructive hover:bg-red-50 rounded">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addImamRef}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded text-sm text-primary font-medium transition-colors"
              >
                <Plus size={16} />
                إضافة إمام
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image */}
      <div className="bg-bg-sidebar rounded-lg p-4 border border-border-light">
        <label className="block text-sm font-bold mb-2">الصورة</label>
        <ImageUploader
          onImageInsert={() => {}}
          onImageSelected={handleImageSelected}
        />
        {image && (
          <div className="mt-2 p-2 bg-white border border-border-light rounded">
            <p className="text-xs text-text-secondary mb-1">الصورة المختارة:</p>
            <img src={image} alt="معاينة" className="w-32 h-32 object-cover rounded" />
            {imageCaption && <p className="text-xs text-text-secondary mt-1">{imageCaption}</p>}
            <button
              type="button"
              onClick={() => { setImage(''); setImageCaption('') }}
              className="mt-2 text-xs text-destructive hover:underline"
            >
              حذف الصورة
            </button>
          </div>
        )}
      </div>

      {/* YouTube Videos */}
      <div>
        <label className="block text-sm font-bold mb-2">فيديوهات يوتيوب (اختياري)</label>
        <div className="space-y-2">
          {youtubeVideos.map((video, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="url"
                value={video}
                onChange={(e) => {
                  const updated = [...youtubeVideos]
                  updated[index] = e.target.value
                  setYoutubeVideos(updated)
                }}
                placeholder="https://www.youtube.com/watch?v=..."
                className="flex-1 px-3 py-2 border border-border-light rounded text-sm"
              />
              <button
                type="button"
                onClick={() => setYoutubeVideos(youtubeVideos.filter((_, i) => i !== index))}
                className="px-3 py-2 bg-destructive text-white rounded hover:opacity-90 text-sm"
              >
                حذف
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setYoutubeVideos([...youtubeVideos, ''])}
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded text-sm text-primary font-medium"
          >
            <Plus size={16} />
            إضافة فيديو
          </button>
        </div>
      </div>

      {/* Content */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-bold">
            محتوى المقال <span className="text-destructive">*</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={useRichText}
              onChange={(e) => setUseRichText(e.target.checked)}
              className="rounded"
            />
            <span>المحرر المتقدم</span>
          </label>
        </div>
        {!useRichText && (
          <div className="text-xs text-text-secondary mb-2">
            استخدم صيغة Markdown. للروابط الداخلية استخدم: [[اسم المقال]]
          </div>
        )}

        {useRichText ? (
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="ابدأ كتابة المقال هنا..."
          />
        ) : (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={15}
            className="w-full px-4 py-2 border border-border-light rounded font-arabic text-sm"
            placeholder={`## المقدمة\n\nاكتب محتوى المقال هنا...\n\n## انظر أيضاً\n\n- [[مقال مرتبط]]`}
          />
        )}
      </div>

      {/* Submit */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting || !title || !content || (mode === 'submit' && (!submitterName || !submitterEmail))}
          className="btn-primary flex items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              جاري الإرسال...
            </>
          ) : mode === 'submit' ? (
            'تقديم المقال'
          ) : (
            'إنشاء المقال'
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 bg-bg-sidebar hover:bg-border-light rounded font-medium transition-colors"
        >
          إلغاء
        </button>
      </div>
    </form>
  )
}
