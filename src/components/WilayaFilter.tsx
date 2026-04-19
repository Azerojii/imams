"use client"

import { useRouter, usePathname } from 'next/navigation'
import { MapPin } from 'lucide-react'

interface WilayaFilterProps {
  wilayas: string[]
  selectedWilaya: string
}

export default function WilayaFilter({ wilayas, selectedWilaya }: WilayaFilterProps) {
  const router = useRouter()
  const pathname = usePathname()

  function handleChange(value: string) {
    const params = new URLSearchParams()
    if (value) params.set('wilaya', value)
    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2 mb-5">
      <label htmlFor="wilaya-filter" className="flex items-center gap-1 text-sm text-text-secondary font-semibold whitespace-nowrap">
        <MapPin size={14} />
        الولاية:
      </label>
      <select
        id="wilaya-filter"
        value={selectedWilaya}
        onChange={e => handleChange(e.target.value)}
        className="border border-border-light rounded-md px-3 py-1.5 text-sm text-text-primary bg-bg-card focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors min-w-[160px]"
        dir="rtl"
      >
        <option value="">الكل</option>
        {wilayas.map(w => (
          <option key={w} value={w}>{w}</option>
        ))}
      </select>
      {selectedWilaya && (
        <button
          onClick={() => handleChange('')}
          className="text-xs text-primary hover:underline"
        >
          إلغاء التصفية
        </button>
      )}
    </div>
  )
}
