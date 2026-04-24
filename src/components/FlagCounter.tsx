import { getGlobalViewsByCountry } from '@/lib/wiki'

function countryCodeToFlag(code: string): string {
  return code
    .toUpperCase()
    .split('')
    .map(char => String.fromCodePoint(char.charCodeAt(0) - 65 + 0x1f1e6))
    .join('')
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
            <span className="text-base leading-none">{countryCodeToFlag(c.countryCode)}</span>
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
