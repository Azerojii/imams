'use client'

import { useState, useEffect } from 'react'
import { MapPin } from 'lucide-react'

interface Commune {
  id: string
  name: string
  nameAscii: string
  daira: string
}

interface Wilaya {
  code: string
  name: string
  nameAscii: string
  communes: Commune[]
}

interface LocationPickerProps {
  selectedWilaya?: string
  selectedCommune?: string
  selectedWilayaCode?: string
  onSelect: (location: { wilaya: string; commune: string; wilayaCode: string }) => void
}

export default function LocationPicker({
  selectedWilaya,
  selectedCommune,
  selectedWilayaCode,
  onSelect,
}: LocationPickerProps) {
  const [wilayas, setWilayas] = useState<Wilaya[]>([])
  const [currentWilayaCode, setCurrentWilayaCode] = useState(selectedWilayaCode || '')
  const [currentCommune, setCurrentCommune] = useState(selectedCommune || '')
  const [loading, setLoading] = useState(true)
  const [customCommune, setCustomCommune] = useState(false)

  useEffect(() => {
    fetch('/api/locations')
      .then(res => res.json())
      .then(data => {
        setWilayas(data.wilayas)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Find matching wilaya by name if code not provided
  useEffect(() => {
    if (selectedWilaya && !currentWilayaCode && wilayas.length > 0) {
      const match = wilayas.find(w => w.name === selectedWilaya)
      if (match) setCurrentWilayaCode(match.code)
    }
  }, [selectedWilaya, wilayas, currentWilayaCode])

  const currentWilaya = wilayas.find(w => w.code === currentWilayaCode)

  const handleWilayaChange = (code: string) => {
    setCurrentWilayaCode(code)
    setCurrentCommune('')
    const wilaya = wilayas.find(w => w.code === code)
    if (wilaya) {
      onSelect({ wilaya: wilaya.name, commune: '', wilayaCode: code })
    }
  }

  const handleCommuneChange = (communeName: string) => {
    setCurrentCommune(communeName)
    const wilaya = wilayas.find(w => w.code === currentWilayaCode)
    if (wilaya) {
      onSelect({ wilaya: wilaya.name, commune: communeName, wilayaCode: currentWilayaCode })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-text-secondary text-sm py-2">
        <MapPin size={16} />
        <span>جاري تحميل المواقع...</span>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-primary-dark mb-1">
        <MapPin size={16} />
        <span>الموقع الجغرافي</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Wilaya dropdown */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">
            الولاية
          </label>
          <select
            value={currentWilayaCode}
            onChange={(e) => handleWilayaChange(e.target.value)}
            className="w-full px-3 py-2 border border-border-light rounded-md text-sm bg-white focus:border-primary"
          >
            <option value="">اختر الولاية</option>
            {wilayas.map(w => (
              <option key={w.code} value={w.code}>
                {w.code} - {w.name}
              </option>
            ))}
          </select>
        </div>

        {/* Commune dropdown */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-medium text-text-secondary">
              البلدية
            </label>
            {currentWilayaCode && (
              <button
                type="button"
                onClick={() => {
                  setCustomCommune(!customCommune)
                  if (!customCommune) {
                    setCurrentCommune('')
                    const wilaya = wilayas.find(w => w.code === currentWilayaCode)
                    if (wilaya) {
                      onSelect({ wilaya: wilaya.name, commune: '', wilayaCode: currentWilayaCode })
                    }
                  }
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
              value={currentCommune}
              onChange={(e) => handleCommuneChange(e.target.value)}
              disabled={!currentWilayaCode}
              className="w-full px-3 py-2 border border-border-light rounded-md text-sm bg-white disabled:bg-gray-100 disabled:cursor-not-allowed focus:border-primary"
              placeholder="اكتب اسم البلدية"
            />
          ) : (
            <select
              value={currentCommune}
              onChange={(e) => handleCommuneChange(e.target.value)}
              disabled={!currentWilayaCode}
              className="w-full px-3 py-2 border border-border-light rounded-md text-sm bg-white disabled:bg-gray-100 disabled:cursor-not-allowed focus:border-primary"
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
    </div>
  )
}
