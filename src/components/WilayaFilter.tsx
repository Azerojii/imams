"use client"

import { useState, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { MapPin, Search } from 'lucide-react'

interface WilayaFilterProps {
  wilayas: string[]
  selectedWilaya: string
  searchQuery?: string
}

export default function WilayaFilter({ wilayas, selectedWilaya, searchQuery = '' }: WilayaFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [localSearch, setLocalSearch] = useState(searchQuery)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function pushParams(q: string, wilaya: string) {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (wilaya) params.set('wilaya', wilaya)
    params.set('page', '1')
    const qs = params.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }

  function handleWilayaChange(value: string) {
    pushParams(localSearch, value)
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setLocalSearch(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      pushParams(value, selectedWilaya)
    }, 400)
  }

  function handleClear() {
    setLocalSearch('')
    router.push(pathname)
  }

  const hasFilter = selectedWilaya || localSearch

  return (
    <div className="mb-5">
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Search input */}
        <div className="relative flex-1">
          <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
          <input
            type="text"
            placeholder="البحث بالاسم..."
            value={localSearch}
            onChange={handleSearchChange}
            className="w-full border border-border-light rounded-md pr-9 pl-3 py-1.5 text-sm text-text-primary bg-bg-card focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
            dir="rtl"
          />
        </div>

        {/* Wilaya dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="wilaya-filter" className="flex items-center gap-1 text-sm text-text-secondary font-semibold whitespace-nowrap">
            <MapPin size={14} />
            الولاية:
          </label>
          <select
            id="wilaya-filter"
            value={selectedWilaya}
            onChange={e => handleWilayaChange(e.target.value)}
            className="border border-border-light rounded-md px-3 py-1.5 text-sm text-text-primary bg-bg-card focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors min-w-[160px]"
            dir="rtl"
          >
            <option value="">الكل</option>
            {wilayas.map(w => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </div>

        {hasFilter && (
          <button
            onClick={handleClear}
            className="text-xs text-primary hover:underline whitespace-nowrap self-center"
          >
            إلغاء التصفية
          </button>
        )}
      </div>
    </div>
  )
}
