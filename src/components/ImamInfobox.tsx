import Link from 'next/link'
import { checkArticleExists } from '@/lib/wiki'
import type { MosqueReference, CustomField, RankEntry } from '@/lib/wiki'
import { Phone, Mail, MessageCircle, Facebook, Youtube, Globe } from 'lucide-react'

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
  ranks?: RankEntry[]
  wilaya?: string
  commune?: string
  mosquesServed?: MosqueReference[]
  customFields?: CustomField[]
  phone?: string
  email?: string
  whatsapp?: string
  facebook?: string
  youtubeChannel?: string
  website?: string
}

async function MosqueLink({ mosque }: { mosque: MosqueReference }) {
  const exists = mosque.slug ? await checkArticleExists(mosque.slug) : false
  return exists && mosque.slug ? (
    <Link
      href={`/wiki/${mosque.slug}`}
      className="text-primary hover:underline font-bold text-base"
    >
      {mosque.name}
    </Link>
  ) : (
    <span className="font-bold text-base text-text-primary">{mosque.name}</span>
  )
}

export default async function ImamInfobox({
  title,
  image,
  birthDate,
  deathDate,
  isAlive,
  rank,
  ranks,
  wilaya,
  commune,
  mosquesServed,
  customFields,
  phone,
  email,
  whatsapp,
  facebook,
  youtubeChannel,
  website,
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
          {/* Ranks display - current vs previous */}
          {ranks && ranks.length > 0 ? (
            <>
              {ranks.find(r => !r.toDate) && (() => {
                const cr = ranks.find(r => !r.toDate)!
                return (
                  <tr className="border-t border-border-light">
                    <td className="py-1.5 px-3 text-text-secondary font-medium w-[35%]">الرتبة الحالية</td>
                    <td className="py-1.5 px-3">
                      <span className="font-semibold">{cr.rank}</span>
                      {cr.fromDate && (
                        <span className="text-xs text-text-secondary mr-1">(منذ {cr.fromDate})</span>
                      )}
                      <span className="mr-1 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">حالي</span>
                    </td>
                  </tr>
                )
              })()}
              {ranks.filter(r => !!r.toDate).map((r, idx) => (
                <tr key={idx} className="border-t border-border-light">
                  <td className="py-1.5 px-3 text-text-secondary font-medium w-[35%]">
                    {idx === 0 ? 'الرتب السابقة' : ''}
                  </td>
                  <td className="py-1.5 px-3">
                    <span>{r.rank}</span>
                    {(r.fromDate || r.toDate) && (
                      <span className="text-xs text-text-secondary mr-1">
                        ({r.fromDate}{r.fromDate && r.toDate ? ' - ' : ''}{r.toDate})
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </>
          ) : rank ? (
            <tr className="border-t border-border-light">
              <td className="py-1.5 px-3 text-text-secondary font-medium w-[35%]">الرتبة</td>
              <td className="py-1.5 px-3">{rank}</td>
            </tr>
          ) : null}
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
                  <td className="py-2 px-3">
                    <div>
                      <MosqueLink mosque={mosque} />
                      {(mosque.wilaya || mosque.commune) && (
                        <div className="text-xs text-text-secondary mt-0.5">
                          {[mosque.commune, mosque.wilaya].filter(Boolean).join('، ')}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-3 text-xs text-text-secondary text-left align-top">
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

      {/* Contact Info */}
      {(phone || email || whatsapp || facebook || youtubeChannel || website) && (
        <>
          <div className="infobox-section-header">معلومات الاتصال</div>
          <table className="w-full border-collapse text-sm">
            <tbody>
              {phone && (
                <tr className="border-t border-border-light">
                  <td className="py-1.5 px-3 text-text-secondary font-medium w-[35%]">
                    <span className="flex items-center gap-1"><Phone size={12} /> الهاتف</span>
                  </td>
                  <td className="py-1.5 px-3" dir="ltr">{phone}</td>
                </tr>
              )}
              {whatsapp && (
                <tr className="border-t border-border-light">
                  <td className="py-1.5 px-3 text-text-secondary font-medium">
                    <span className="flex items-center gap-1"><MessageCircle size={12} /> واتساب</span>
                  </td>
                  <td className="py-1.5 px-3" dir="ltr">{whatsapp}</td>
                </tr>
              )}
              {email && (
                <tr className="border-t border-border-light">
                  <td className="py-1.5 px-3 text-text-secondary font-medium">
                    <span className="flex items-center gap-1"><Mail size={12} /> إيميل</span>
                  </td>
                  <td className="py-1.5 px-3 break-all text-left" dir="ltr">{email}</td>
                </tr>
              )}
              {facebook && (
                <tr className="border-t border-border-light">
                  <td className="py-1.5 px-3 text-text-secondary font-medium">
                    <span className="flex items-center gap-1"><Facebook size={12} /> فيسبوك</span>
                  </td>
                  <td className="py-1.5 px-3">
                    <a href={facebook} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">رابط</a>
                  </td>
                </tr>
              )}
              {youtubeChannel && (
                <tr className="border-t border-border-light">
                  <td className="py-1.5 px-3 text-text-secondary font-medium">
                    <span className="flex items-center gap-1"><Youtube size={12} /> يوتيوب</span>
                  </td>
                  <td className="py-1.5 px-3">
                    <a href={youtubeChannel} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">رابط</a>
                  </td>
                </tr>
              )}
              {website && (
                <tr className="border-t border-border-light">
                  <td className="py-1.5 px-3 text-text-secondary font-medium">
                    <span className="flex items-center gap-1"><Globe size={12} /> الموقع</span>
                  </td>
                  <td className="py-1.5 px-3">
                    <a href={website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">رابط</a>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}
