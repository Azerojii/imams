import Image from 'next/image'
import { getGlobalViewsByCountry } from '@/lib/wiki'

function getTwemojiUrl(code: string): string {
  const upper = code.toUpperCase()
  const cp1 = (0x1f1e6 + upper.charCodeAt(0) - 65).toString(16)
  const cp2 = (0x1f1e6 + upper.charCodeAt(1) - 65).toString(16)
  return `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${cp1}-${cp2}.svg`
}

export default async function FlagCounter() {
  const countries = await getGlobalViewsByCountry()
  if (countries.length === 0) return null

  const total = countries.reduce((sum, c) => sum + c.viewCount, 0)

  return (
    <div className="border-t border-border-light pt-4 mt-2 w-full">
      <p className="text-xs text-text-secondary text-center mb-3 font-semibold">زوار الموقع حسب الدولة</p>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
        {countries.map(c => (
          <div key={c.countryCode} className="flex items-center gap-1.5 text-xs text-text-secondary" title={c.countryName}>
            <Image
              src={getTwemojiUrl(c.countryCode)}
              alt={c.countryName}
              width={20}
              height={20}
              className="inline-block"
              unoptimized
            />
            <span className="font-semibold text-primary">{c.viewCount.toLocaleString('ar-DZ')}</span>
            <span className="text-text-secondary/70">{c.countryName}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-text-secondary/50 text-center mt-2">
        {countries.length} دولة · {total.toLocaleString('ar-DZ')} مشاهدة إجمالية
      </p>
    </div>
  )
}
