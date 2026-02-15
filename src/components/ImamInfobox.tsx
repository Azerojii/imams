import Link from 'next/link'
import { checkArticleExists } from '@/lib/wiki'
import type { MosqueReference, CustomField } from '@/lib/wiki'

interface ImamInfoboxProps {
  title: string
  image?: {
    src: string
    caption: string
  }
  birthDate?: string
  deathDate?: string
  isAlive?: boolean
  rank?: string
  wilaya?: string
  commune?: string
  mosquesServed?: MosqueReference[]
  customFields?: CustomField[]
}

async function MosqueLink({ mosque }: { mosque: MosqueReference }) {
  const exists = mosque.slug ? await checkArticleExists(mosque.slug) : false
  return exists && mosque.slug ? (
    <Link
      href={`/wiki/${mosque.slug}`}
      className="text-primary hover:underline font-medium"
    >
      {mosque.name}
    </Link>
  ) : (
    <span className="text-text-secondary">{mosque.name}</span>
  )
}

export default async function ImamInfobox({
  title,
  image,
  birthDate,
  deathDate,
  isAlive,
  rank,
  wilaya,
  commune,
  mosquesServed,
  customFields,
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
          {rank && (
            <tr className="border-t border-border-light">
              <td className="py-1.5 px-3 text-text-secondary font-medium w-[35%]">الرتبة</td>
              <td className="py-1.5 px-3">{rank}</td>
            </tr>
          )}
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

      {/* Custom Fields */}
      {customFields && customFields.length > 0 && (
        <>
          <div className="infobox-section-header">معلومات إضافية</div>
          <table className="w-full border-collapse text-sm">
            <tbody>
              {customFields.map((field, idx) => (
                <tr key={idx} className="border-t border-border-light">
                  <td className="py-1.5 px-3 text-text-secondary font-medium w-[35%]">{field.label}</td>
                  <td className="py-1.5 px-3">{field.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Mosques Served */}
      {mosquesServed && mosquesServed.length > 0 && (
        <>
          <div className="infobox-section-header">المساجد التي خدم فيها</div>
          <table className="w-full border-collapse text-sm">
            <tbody>
              {mosquesServed.map((mosque, idx) => (
                <tr key={idx} className="border-t border-border-light">
                  <td className="py-1.5 px-3">
                    <div>
                      <MosqueLink mosque={mosque} />
                      {(mosque.wilaya || mosque.commune) && (
                        <div className="text-xs text-text-secondary mt-0.5">
                          {[mosque.commune, mosque.wilaya].filter(Boolean).join('، ')}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-1.5 px-3 text-xs text-text-secondary text-left whitespace-nowrap align-top">
                    {mosque.startDate && mosque.endDate
                      ? `${mosque.startDate} - ${mosque.endDate}`
                      : mosque.startDate
                        ? `منذ ${mosque.startDate}`
                        : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}
