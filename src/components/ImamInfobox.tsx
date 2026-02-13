import Link from 'next/link'
import { checkArticleExists } from '@/lib/wiki'
import type { MosqueReference } from '@/lib/wiki'

interface ImamInfoboxProps {
  title: string
  image?: {
    src: string
    caption: string
  }
  birthDate?: string
  deathDate?: string
  isAlive?: boolean
  wilaya?: string
  commune?: string
  mosquesServed?: MosqueReference[]
}

export default function ImamInfobox({
  title,
  image,
  birthDate,
  deathDate,
  isAlive,
  wilaya,
  commune,
  mosquesServed,
}: ImamInfoboxProps) {
  return (
    <div className="infobox w-full">
      {/* Header */}
      <div className="infobox-header">{title}</div>

      {/* Image */}
      {image && (
        <div className="bg-white p-2">
          <img src={image.src} alt={title} className="w-full h-auto" />
          {image.caption && (
            <p className="text-xs italic text-text-secondary text-center mt-1 px-1">
              {image.caption}
            </p>
          )}
        </div>
      )}

      {/* Personal Info */}
      <div className="infobox-section-header">معلومات شخصية</div>
      <table className="w-full border-collapse text-sm">
        <tbody>
          {birthDate && (
            <tr className="border-t border-border-light">
              <td className="py-1.5 px-3 text-text-secondary font-medium w-[35%]">الميلاد</td>
              <td className="py-1.5 px-3">{birthDate}</td>
            </tr>
          )}
          {isAlive ? (
            <tr className="border-t border-border-light">
              <td className="py-1.5 px-3 text-text-secondary font-medium">الحالة</td>
              <td className="py-1.5 px-3 text-primary font-semibold">على قيد الحياة</td>
            </tr>
          ) : deathDate ? (
            <tr className="border-t border-border-light">
              <td className="py-1.5 px-3 text-text-secondary font-medium">الوفاة</td>
              <td className="py-1.5 px-3">{deathDate}</td>
            </tr>
          ) : null}
          {wilaya && (
            <tr className="border-t border-border-light">
              <td className="py-1.5 px-3 text-text-secondary font-medium">الولاية</td>
              <td className="py-1.5 px-3">{wilaya}</td>
            </tr>
          )}
          {commune && (
            <tr className="border-t border-border-light">
              <td className="py-1.5 px-3 text-text-secondary font-medium">البلدية</td>
              <td className="py-1.5 px-3">{commune}</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Mosques Served */}
      {mosquesServed && mosquesServed.length > 0 && (
        <>
          <div className="infobox-section-header">المساجد التي خدم فيها</div>
          <table className="w-full border-collapse text-sm">
            <tbody>
              {mosquesServed.map((mosque, idx) => {
                const exists = mosque.slug ? checkArticleExists(mosque.slug) : false
                return (
                  <tr key={idx} className="border-t border-border-light">
                    <td className="py-1.5 px-3">
                      {exists && mosque.slug ? (
                        <Link
                          href={`/wiki/${mosque.slug}`}
                          className="text-primary hover:underline font-medium"
                        >
                          {mosque.name}
                        </Link>
                      ) : (
                        <span className="text-text-secondary">{mosque.name}</span>
                      )}
                    </td>
                    <td className="py-1.5 px-3 text-xs text-text-secondary text-left whitespace-nowrap">
                      {mosque.startDate && mosque.endDate
                        ? `${mosque.startDate} - ${mosque.endDate}`
                        : mosque.startDate
                          ? `منذ ${mosque.startDate}`
                          : ''}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}
