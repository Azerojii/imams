import Link from "next/link";
import { checkArticleExists } from "@/lib/wiki";
import MosqueGalleryLightbox from "@/components/MosqueGalleryLightbox";
import type {
  ImamReference,
  Founder,
  CustomField,
  MosqueWorker,
} from "@/lib/wiki";
import {
  Phone,
  Mail,
  MessageCircle,
  Facebook,
  Youtube,
  Globe,
  HandCoins,
} from "lucide-react";

interface MosqueInfoboxProps {
  title: string;
  image?: {
    src: string;
    caption: string;
  };
  mosqueType?: string;
  dateBuilt?: string;
  wilaya?: string;
  commune?: string;
  founders?: Founder[];
  imamsServed?: ImamReference[];
  prayerHallArea?: string;
  prayerHallCapacity?: string;
  minaretHeight?: string;
  totalArea?: string;
  otherFacilities?: string;
  customMosqueFields?: CustomField[];
  phone?: string;
  email?: string;
  whatsapp?: string;
  facebook?: string;
  youtubeChannel?: string;
  website?: string;
  dateInauguration?: string;
  mosqueGallery?: string[];
  currentImam?: string;
  currentAssociation?: string;
  currentAssociationMembers?: string[];
  formerCommitteeMembers?: string[];
  associationOtherInfo?: string;
  // Legacy field kept for backward compatibility
  associationMembers?: string;
  mosqueWorkers?: MosqueWorker[];
  mosqueEngineer?: string;
  historicalPeriod?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankName?: string;
}

async function ImamLink({ imam }: { imam: ImamReference }) {
  const exists = imam.slug ? await checkArticleExists(imam.slug) : false;
  return exists && imam.slug ? (
    <Link
      href={`/wiki/${imam.slug}`}
      className="text-primary hover:underline font-medium"
    >
      {imam.name}
    </Link>
  ) : (
    <span className="text-text-secondary">{imam.name}</span>
  );
}

export default async function MosqueInfobox({
  title,
  image,
  mosqueType,
  dateBuilt,
  wilaya,
  commune,
  founders,
  imamsServed,
  prayerHallArea,
  prayerHallCapacity,
  minaretHeight,
  totalArea,
  otherFacilities,
  customMosqueFields,
  phone,
  email,
  whatsapp,
  facebook,
  youtubeChannel,
  website,
  dateInauguration,
  mosqueGallery,
  currentImam,
  currentAssociation,
  currentAssociationMembers,
  formerCommitteeMembers,
  associationOtherInfo,
  associationMembers,
  mosqueWorkers,
  mosqueEngineer,
  historicalPeriod,
  bankAccountName,
  bankAccountNumber,
  bankName,
}: MosqueInfoboxProps) {
  const parsedLegacyMembers = (associationMembers || "")
    .split(/\r?\n|،|,|;/)
    .map((member) => member.trim())
    .filter(Boolean);
  const resolvedCurrentMembers = (
    currentAssociationMembers && currentAssociationMembers.length > 0
      ? currentAssociationMembers
      : parsedLegacyMembers
  )
    .map((member) => member.trim())
    .filter(Boolean);
  const resolvedFormerMembers = (formerCommitteeMembers || [])
    .map((member) => member.trim())
    .filter(Boolean);

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
          {mosqueType && (
            <tr className="border-t border-border-light">
              <td className="py-1.5 px-3 text-text-secondary font-medium w-[35%]">
                النوع
              </td>
              <td className="py-1.5 px-3">{mosqueType}</td>
            </tr>
          )}
          {dateBuilt && (
            <tr className="border-t border-border-light">
              <td className="py-1.5 px-3 text-text-secondary font-medium w-[35%]">
                تاريخ البناء
              </td>
              <td className="py-1.5 px-3">{dateBuilt}</td>
            </tr>
          )}
          {historicalPeriod && (
            <tr className="border-t border-border-light">
              <td className="py-1.5 px-3 text-text-secondary font-medium w-[35%]">
                العهد / الدولة
              </td>
              <td className="py-1.5 px-3">{historicalPeriod}</td>
            </tr>
          )}
          {mosqueEngineer && (
            <tr className="border-t border-border-light">
              <td className="py-1.5 px-3 text-text-secondary font-medium w-[35%]">
                مهندس المسجد
              </td>
              <td className="py-1.5 px-3">{mosqueEngineer}</td>
            </tr>
          )}
          {dateInauguration && (
            <tr className="border-t border-border-light">
              <td className="py-1.5 px-3 text-text-secondary font-medium w-[35%]">
                تاريخ الافتتاح
              </td>
              <td className="py-1.5 px-3">{dateInauguration}</td>
            </tr>
          )}
          {wilaya && (
            <tr className="border-t border-border-light">
              <td className="py-1.5 px-3 text-text-secondary font-medium">
                الولاية
              </td>
              <td className="py-1.5 px-3">{wilaya}</td>
            </tr>
          )}
          {commune && (
            <tr className="border-t border-border-light">
              <td className="py-1.5 px-3 text-text-secondary font-medium">
                البلدية
              </td>
              <td className="py-1.5 px-3">{commune}</td>
            </tr>
          )}
          {prayerHallArea && (
            <tr className="border-t border-border-light">
              <td className="py-1.5 px-3 text-text-secondary font-medium">
                مساحة قاعة الصلاة
              </td>
              <td className="py-1.5 px-3">{prayerHallArea}</td>
            </tr>
          )}
          {prayerHallCapacity && (
            <tr className="border-t border-border-light">
              <td className="py-1.5 px-3 text-text-secondary font-medium">
                عدد المصلين
              </td>
              <td className="py-1.5 px-3">{prayerHallCapacity}</td>
            </tr>
          )}
          {minaretHeight && (
            <tr className="border-t border-border-light">
              <td className="py-1.5 px-3 text-text-secondary font-medium">
                طول المئذنة
              </td>
              <td className="py-1.5 px-3">{minaretHeight}</td>
            </tr>
          )}
          {totalArea && (
            <tr className="border-t border-border-light">
              <td className="py-1.5 px-3 text-text-secondary font-medium">
                المساحة الكلية
              </td>
              <td className="py-1.5 px-3">{totalArea}</td>
            </tr>
          )}
          {otherFacilities && (
            <tr className="border-t border-border-light">
              <td className="py-1.5 px-3 text-text-secondary font-medium">
                مرافق أخرى
              </td>
              <td className="py-1.5 px-3">{otherFacilities}</td>
            </tr>
          )}
          {currentImam && (
            <tr className="border-t border-border-light">
              <td className="py-1.5 px-3 text-text-secondary font-medium w-[35%]">
                الإمام الحالي
              </td>
              <td className="py-1.5 px-3">{currentImam}</td>
            </tr>
          )}
          {currentAssociation && (
            <tr className="border-t border-border-light">
              <td className="py-1.5 px-3 text-text-secondary font-medium w-[35%]">
                الجمعية الحالية
              </td>
              <td className="py-1.5 px-3">{currentAssociation}</td>
            </tr>
          )}
          {resolvedCurrentMembers.length > 0 && (
            <tr className="border-t border-border-light">
              <td className="py-1.5 px-3 text-text-secondary font-medium w-[35%]">
                أعضاء الجمعية الحالية
              </td>
              <td className="py-1.5 px-3">
                <ul className="list-inside list-disc space-y-0.5">
                  {resolvedCurrentMembers.map((member, idx) => (
                    <li key={`current-association-member-${idx}`}>{member}</li>
                  ))}
                </ul>
              </td>
            </tr>
          )}
          {resolvedFormerMembers.length > 0 && (
            <tr className="border-t border-border-light">
              <td className="py-1.5 px-3 text-text-secondary font-medium w-[35%]">
                أعضاء لجنة سابقون
              </td>
              <td className="py-1.5 px-3">
                <ul className="list-inside list-disc space-y-0.5">
                  {resolvedFormerMembers.map((member, idx) => (
                    <li key={`former-committee-member-${idx}`}>{member}</li>
                  ))}
                </ul>
              </td>
            </tr>
          )}
          {associationOtherInfo && (
            <tr className="border-t border-border-light">
              <td className="py-1.5 px-3 text-text-secondary font-medium w-[35%]">
                خانة أخرى
              </td>
              <td className="py-1.5 px-3">{associationOtherInfo}</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Custom Mosque Fields */}
      {customMosqueFields && customMosqueFields.length > 0 && (
        <>
          <div className="infobox-section-header">معلومات إضافية</div>
          <table className="w-full border-collapse text-sm">
            <tbody>
              {customMosqueFields.map((field, idx) => (
                <tr key={idx} className="border-t border-border-light">
                  <td className="py-1.5 px-3 text-text-secondary font-medium w-[35%]">
                    {field.label}
                  </td>
                  <td className="py-1.5 px-3">{field.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Founders */}
      {founders && founders.length > 0 && (
        <>
          <div className="infobox-section-header">المؤسسون</div>
          <table className="w-full border-collapse text-sm">
            <tbody>
              {founders.map((founder, idx) => (
                <tr key={idx} className="border-t border-border-light">
                  <td className="py-1.5 px-3">
                    <span className="font-medium">{founder.name}</span>
                  </td>
                  <td className="py-1.5 px-3 text-xs text-text-secondary text-left">
                    {founder.rutba || ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Imams Served */}
      {imamsServed && imamsServed.length > 0 && (
        <>
          <div className="infobox-section-header">الأئمة الذين عملوا فيه</div>
          <table className="w-full border-collapse text-sm">
            <tbody>
              {imamsServed.map((imam, idx) => (
                <tr key={idx} className="border-t border-border-light">
                  <td className="py-1.5 px-3">
                    <div>
                      <ImamLink imam={imam} />
                      {imam.rutba && (
                        <div className="text-xs text-text-secondary mt-0.5">
                          {imam.rutba}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-1.5 px-3 text-xs text-text-secondary text-left align-top">
                    {imam.startDate && imam.endDate
                      ? `${imam.startDate} - ${imam.endDate}`
                      : imam.startDate
                        ? `منذ ${imam.startDate}`
                        : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Mosque workers */}
      {mosqueWorkers && mosqueWorkers.length > 0 && (
        <>
          <div className="infobox-section-header">عمال المسجد</div>
          <table className="w-full border-collapse text-sm">
            <tbody>
              {mosqueWorkers.map((worker, idx) => (
                <tr key={idx} className="border-t border-border-light">
                  <td className="py-1.5 px-3">
                    <div>
                      <span className="font-medium">{worker.name}</span>
                      {worker.rank && (
                        <div className="text-xs text-text-secondary mt-0.5">
                          {worker.rank}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-1.5 px-3 text-xs text-text-secondary text-left align-top">
                    {worker.fromDate && worker.toDate
                      ? `${worker.fromDate} - ${worker.toDate}`
                      : worker.fromDate
                        ? `منذ ${worker.fromDate}`
                        : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Contact Info */}
      {(phone ||
        email ||
        whatsapp ||
        facebook ||
        youtubeChannel ||
        website) && (
        <>
          <div className="infobox-section-header">معلومات الاتصال</div>
          <table className="w-full border-collapse text-sm">
            <tbody>
              {phone && (
                <tr className="border-t border-border-light">
                  <td className="py-1.5 px-3 text-text-secondary font-medium w-[35%]">
                    <span className="flex items-center gap-1">
                      <Phone size={12} /> الهاتف
                    </span>
                  </td>
                  <td className="py-1.5 px-3" dir="ltr">
                    {phone}
                  </td>
                </tr>
              )}
              {whatsapp && (
                <tr className="border-t border-border-light">
                  <td className="py-1.5 px-3 text-text-secondary font-medium">
                    <span className="flex items-center gap-1">
                      <MessageCircle size={12} /> واتساب
                    </span>
                  </td>
                  <td className="py-1.5 px-3" dir="ltr">
                    {whatsapp}
                  </td>
                </tr>
              )}
              {email && (
                <tr className="border-t border-border-light">
                  <td className="py-1.5 px-3 text-text-secondary font-medium">
                    <span className="flex items-center gap-1">
                      <Mail size={12} /> إيميل
                    </span>
                  </td>
                  <td className="py-1.5 px-3 break-all text-left" dir="ltr">
                    {email}
                  </td>
                </tr>
              )}
              {facebook && (
                <tr className="border-t border-border-light">
                  <td className="py-1.5 px-3 text-text-secondary font-medium">
                    <span className="flex items-center gap-1">
                      <Facebook size={12} /> فيسبوك
                    </span>
                  </td>
                  <td className="py-1.5 px-3">
                    <a
                      href={facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-xs"
                    >
                      رابط
                    </a>
                  </td>
                </tr>
              )}
              {youtubeChannel && (
                <tr className="border-t border-border-light">
                  <td className="py-1.5 px-3 text-text-secondary font-medium">
                    <span className="flex items-center gap-1">
                      <Youtube size={12} /> يوتيوب
                    </span>
                  </td>
                  <td className="py-1.5 px-3">
                    <a
                      href={youtubeChannel}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-xs"
                    >
                      رابط
                    </a>
                  </td>
                </tr>
              )}
              {website && (
                <tr className="border-t border-border-light">
                  <td className="py-1.5 px-3 text-text-secondary font-medium">
                    <span className="flex items-center gap-1">
                      <Globe size={12} /> الموقع
                    </span>
                  </td>
                  <td className="py-1.5 px-3">
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-xs"
                    >
                      رابط
                    </a>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}

      {/* Mosque Gallery */}
      {mosqueGallery && mosqueGallery.length > 0 && (
        <>
          <div className="infobox-section-header">معرض الصور</div>
          <MosqueGalleryLightbox images={mosqueGallery} />
        </>
      )}

      {/* Donation / Bank Info */}
      {(bankAccountName || bankAccountNumber || bankName) && (
        <>
          <div className="infobox-section-header flex items-center gap-1.5">
            <HandCoins size={13} />
            تصدق للمسجد
          </div>
          <div className="bg-amber-50 border-t border-amber-200 px-3 py-3 text-sm space-y-2">
            {bankName && (
              <div className="flex justify-between gap-2">
                <span className="text-text-secondary font-medium">البنك</span>
                <span className="font-semibold text-amber-900">{bankName}</span>
              </div>
            )}
            {bankAccountName && (
              <div className="flex justify-between gap-2">
                <span className="text-text-secondary font-medium">اسم الحساب</span>
                <span className="font-semibold text-amber-900">{bankAccountName}</span>
              </div>
            )}
            {bankAccountNumber && (
              <div className="flex justify-between gap-2">
                <span className="text-text-secondary font-medium">رقم الحساب</span>
                <span className="font-mono font-bold text-amber-900 text-xs" dir="ltr">
                  {bankAccountNumber}
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

