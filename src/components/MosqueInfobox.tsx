import Link from 'next/link'
import { checkArticleExists } from '@/lib/wiki'
import type { ImamReference } from '@/lib/wiki'

interface MosqueInfoboxProps {
  title: string
  image?: {
    src: string
    caption: string
  }
  dateBuilt?: string
  wilaya?: string
  commune?: string
  imamsServed?: ImamReference[]
}

export default function MosqueInfobox({
  title,
  image,
  dateBuilt,
  wilaya,
  commune,
  imamsServed,
}: MosqueInfoboxProps) {
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

      {/* Mosque Info */}
      <div className="infobox-section-header">معلومات المسجد</div>
      <table className="w-full border-collapse text-sm">
        <tbody>
          {dateBuilt && (
            <tr className="border-t border-border-light">
              <td className="py-1.5 px-3 text-text-secondary font-medium w-[35%]">تاريخ البناء</td>
              <td className="py-1.5 px-3">{dateBuilt}</td>
            </tr>
          )}
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

      {/* Imams Served */}
      {imamsServed && imamsServed.length > 0 && (
        <>
          <div className="infobox-section-header">الأئمة الذين خدموا فيه</div>
          <table className="w-full border-collapse text-sm">
            <tbody>
              {imamsServed.map((imam, idx) => {
                const exists = imam.slug ? checkArticleExists(imam.slug) : false
                return (
                  <tr key={idx} className="border-t border-border-light">
                    <td className="py-1.5 px-3">
                      {exists && imam.slug ? (
                        <Link
                          href={`/wiki/${imam.slug}`}
                          className="text-primary hover:underline font-medium"
                        >
                          {imam.name}
                        </Link>
                      ) : (
                        <span className="text-text-secondary">{imam.name}</span>
                      )}
                    </td>
                    <td className="py-1.5 px-3 text-xs text-text-secondary text-left whitespace-nowrap">
                      {imam.startDate && imam.endDate
                        ? `${imam.startDate} - ${imam.endDate}`
                        : imam.startDate
                          ? `منذ ${imam.startDate}`
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
