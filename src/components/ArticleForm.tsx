'use client'

import { useState, useRef, useEffect } from 'react'
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
  wilaya: string
  commune: string
  wilayaCode: string
}

interface CustomField {
  label: string
  value: string
}

interface ImamRef {
  name: string
  slug: string
  startDate: string
  endDate: string
  rutba: string
}

interface FounderRef {
  name: string
  rutba: string
}

interface Wilaya {
  code: string
  name: string
  nameAscii: string
  communes: { id: string; name: string; nameAscii: string; daira: string }[]
}

function MosqueLocationPicker({
  mosqueIndex,
  wilaya,
  commune,
  wilayaCode,
  onUpdate,
}: {
  mosqueIndex: number
  wilaya: string
  commune: string
  wilayaCode: string
  onUpdate: (idx: number, field: keyof MosqueRef, value: string) => void
}) {
  const [wilayas, setWilayas] = useState<Wilaya[]>([])
  const [loading, setLoading] = useState(true)
  const [customCommune, setCustomCommune] = useState(false)

  useEffect(() => {
    fetch('/api/locations')
      .then(res => res.json())
      .then(data => {
        setWilayas(data.wilayas)
        setLoading(false)
        // Check if current commune is custom (not in the list)
        if (commune && wilayaCode) {
          const w = data.wilayas.find((w: Wilaya) => w.code === wilayaCode)
          if (w && !w.communes.some((c: { name: string }) => c.name === commune)) {
            setCustomCommune(true)
          }
        }
      })
      .catch(() => setLoading(false))
  }, [])

  const currentWilaya = wilayas.find(w => w.code === wilayaCode)

  if (loading) {
    return <p className="text-xs text-text-secondary">جاري تحميل المواقع...</p>
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <div>
        <label className="block text-xs text-text-secondary mb-0.5">ولاية المسجد</label>
        <select
          value={wilayaCode}
          onChange={(e) => {
            const code = e.target.value
            const w = wilayas.find(w => w.code === code)
            onUpdate(mosqueIndex, 'wilayaCode', code)
            onUpdate(mosqueIndex, 'wilaya', w?.name || '')
            onUpdate(mosqueIndex, 'commune', '')
            setCustomCommune(false)
          }}
          className="w-full px-2 py-1.5 border border-border-light rounded text-sm bg-white"
        >
          <option value="">اختر الولاية</option>
          {wilayas.map(w => (
            <option key={w.code} value={w.code}>
              {w.code} - {w.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <div className="flex items-center justify-between mb-0.5">
          <label className="block text-xs text-text-secondary">بلدية المسجد</label>
          {wilayaCode && (
            <button
              type="button"
              onClick={() => {
                setCustomCommune(!customCommune)
                if (!customCommune) onUpdate(mosqueIndex, 'commune', '')
              }}
              className="text-xs text-primary hover:underline"
            >
              {customCommune ? 'اختيار من القائمة' : 'كتابة يدوية'}
            </button>
          )}
        </div>
        {customCommune ? (
          <input
            type="text"
            value={commune}
            onChange={(e) => onUpdate(mosqueIndex, 'commune', e.target.value)}
            className="w-full px-2 py-1.5 border border-border-light rounded text-sm"
            placeholder="اكتب اسم البلدية"
          />
        ) : (
          <select
            value={commune}
            onChange={(e) => onUpdate(mosqueIndex, 'commune', e.target.value)}
            disabled={!wilayaCode}
            className="w-full px-2 py-1.5 border border-border-light rounded text-sm bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">اختر البلدية</option>
            {currentWilaya?.communes.map(c => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  )
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
  const [useRichText, setUseRichText] = useState(true)

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
  const [rank, setRank] = useState('')
  const [mosquesServed, setMosquesServed] = useState<MosqueRef[]>([])
  const [customFields, setCustomFields] = useState<CustomField[]>([])

  // Mosque fields
  const [mosqueType, setMosqueType] = useState('')
  const [dateBuilt, setDateBuilt] = useState('')
  const [founders, setFounders] = useState<FounderRef[]>([])
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
    setMosquesServed([...mosquesServed, { name: '', slug: '', startDate: '', endDate: '', wilaya: '', commune: '', wilayaCode: '' }])
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

  const addCustomField = () => {
    setCustomFields([...customFields, { label: '', value: '' }])
  }

  const updateCustomField = (idx: number, field: keyof CustomField, value: string) => {
    const updated = [...customFields]
    updated[idx][field] = value
    setCustomFields(updated)
  }

  const removeCustomField = (idx: number) => {
    setCustomFields(customFields.filter((_, i) => i !== idx))
  }

  const addImamRef = () => {
    setImamsServed([...imamsServed, { name: '', slug: '', startDate: '', endDate: '', rutba: '' }])
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

  const addFounder = () => {
    setFounders([...founders, { name: '', rutba: '' }])
  }

  const updateFounder = (idx: number, field: keyof FounderRef, value: string) => {
    const updated = [...founders]
    updated[idx][field] = value
    setFounders(updated)
  }

  const removeFounder = (idx: number) => {
    setFounders(founders.filter((_, i) => i !== idx))
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
        articleData.rank = rank || undefined
        articleData.mosquesServed = mosquesServed.filter(m => m.name.trim() !== '')
        articleData.customFields = customFields.filter(f => f.label.trim() !== '' && f.value.trim() !== '')
      } else {
        articleData.mosqueType = mosqueType || undefined
        articleData.dateBuilt = dateBuilt || undefined
        articleData.founders = founders.filter(f => f.name.trim() !== '')
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

          {/* Rank */}
          <div>
            <label className="block text-sm font-bold mb-2">الرتبة</label>
            <input
              type="text"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              className="w-full px-4 py-2 border border-border-light rounded"
              placeholder="مثال: إمام مسجد، إمام خطيب، مفتي..."
            />
          </div>

          {/* Mosques served */}
          <div>
            <label className="block text-sm font-bold mb-2">المساجد التي عمل فيها</label>
            <div className="space-y-3">
              {mosquesServed.map((m, idx) => (
                <div key={idx} className="bg-white p-3 rounded border border-border-light space-y-2">
                  <div className="flex gap-2 items-center">
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
                  <MosqueLocationPicker
                    mosqueIndex={idx}
                    wilaya={m.wilaya}
                    commune={m.commune}
                    wilayaCode={m.wilayaCode}
                    onUpdate={updateMosqueRef}
                  />
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

          {/* Custom fields */}
          <div>
            <label className="block text-sm font-bold mb-2">معلومات إضافية</label>
            <div className="space-y-2">
              {customFields.map((f, idx) => (
                <div key={idx} className="flex gap-2 items-center bg-white p-2 rounded border border-border-light">
                  <input
                    type="text"
                    value={f.label}
                    onChange={(e) => updateCustomField(idx, 'label', e.target.value)}
                    className="w-1/3 px-3 py-1.5 border border-border-light rounded text-sm"
                    placeholder="العنوان (مثال: الطريقة، المذهب...)"
                  />
                  <input
                    type="text"
                    value={f.value}
                    onChange={(e) => updateCustomField(idx, 'value', e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-border-light rounded text-sm"
                    placeholder="القيمة"
                  />
                  <button type="button" onClick={() => removeCustomField(idx)} className="p-1.5 text-destructive hover:bg-red-50 rounded">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addCustomField}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded text-sm text-primary font-medium transition-colors"
              >
                <Plus size={16} />
                إضافة معلومة
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-bg-sidebar rounded-lg p-4 border border-border-light space-y-4">
          <h3 className="font-bold text-lg font-heading text-primary">معلومات المسجد</h3>

          <div>
            <label className="block text-sm font-bold mb-2">نوع المسجد</label>
            <select
              value={mosqueType}
              onChange={(e) => setMosqueType(e.target.value)}
              className="w-full px-4 py-2 border border-border-light rounded bg-white"
            >
              <option value="">اختر نوع المسجد</option>
              <option value="جامع الجزائر">جامع الجزائر</option>
              <option value="مسجد تاريخي">مسجد تاريخي</option>
              <option value="مسجد رئيسي">مسجد رئيسي</option>
              <option value="مسجد وطني">مسجد وطني</option>
              <option value="مسجد محلي">مسجد محلي</option>
              <option value="مسجد حي">مسجد حي</option>
            </select>
          </div>

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

          {/* Founders */}
          <div>
            <label className="block text-sm font-bold mb-2">المؤسسون</label>
            <div className="space-y-2">
              {founders.map((f, idx) => (
                <div key={idx} className="flex gap-2 items-center bg-white p-2 rounded border border-border-light">
                  <input
                    type="text"
                    value={f.name}
                    onChange={(e) => updateFounder(idx, 'name', e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-border-light rounded text-sm"
                    placeholder="اسم المؤسس"
                  />
                  <input
                    type="text"
                    value={f.rutba}
                    onChange={(e) => updateFounder(idx, 'rutba', e.target.value)}
                    className="w-40 px-3 py-1.5 border border-border-light rounded text-sm"
                    placeholder="الرتبة"
                  />
                  <button type="button" onClick={() => removeFounder(idx)} className="p-1.5 text-destructive hover:bg-red-50 rounded">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addFounder}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded text-sm text-primary font-medium transition-colors"
              >
                <Plus size={16} />
                إضافة مؤسس
              </button>
            </div>
          </div>

          {/* Imams served */}
          <div>
            <label className="block text-sm font-bold mb-2">الأئمة الذين عملو فيه</label>
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
                    value={im.rutba}
                    onChange={(e) => updateImamRef(idx, 'rutba', e.target.value)}
                    className="w-32 px-3 py-1.5 border border-border-light rounded text-sm"
                    placeholder="الرتبة"
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
