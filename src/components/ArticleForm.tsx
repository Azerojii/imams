"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Plus,
  Trash2,
  UserCircle,
  Landmark,
  BookOpen,
} from "lucide-react";
import HijabiWomanIcon from "./HijabiWomanIcon";
import LocationPicker from "./LocationPicker";
import ImageUploader from "./ImageUploader";
import QuillEditor, { type QuillEditorHandle } from "./QuillEditor";
import ReferencesManager from "./ReferencesManager";
import type { WikiArticle, Reference } from "@/lib/wiki";

interface MosqueRef {
  name: string;
  slug: string;
  startDate: string;
  endDate: string;
  wilaya: string;
  commune: string;
  wilayaCode: string;
}

interface CustomField {
  label: string;
  value: string;
}

interface ImamRef {
  name: string;
  slug: string;
  startDate: string;
  endDate: string;
  rutba: string;
}

interface MosqueWorkerEntry {
  name: string;
  rank: string;
  fromDate: string;
  toDate: string;
}

interface FounderRef {
  name: string;
  rutba: string;
}

interface RankEntry {
  rank: string;
  fromDate: string;
  toDate: string;
}

interface Wilaya {
  code: string;
  name: string;
  nameAscii: string;
  communes: { id: string; name: string; nameAscii: string; daira: string }[];
}

const RANK_OPTIONS = [
  "إمام خطيب",
  "إمام مدرس",
  "إمام واعظ",
  "إمام خطيب أول",
  "إمام ممتاز",
  "إمام مفتي",
  "إمام صلوات",
  "إمام منتدب",
  "مدرس حلقات علمية",
];

type ArticleType = "imam" | "mosque" | "quran_teacher" | "mourshida";

function isImamLike(type: ArticleType): boolean {
  return type === "imam" || type === "quran_teacher" || type === "mourshida";
}

function getCategoryLabel(type: ArticleType): string {
  switch (type) {
    case "imam":
      return "أئمة";
    case "mosque":
      return "مساجد";
    case "quran_teacher":
      return "معلمو القرآن الكريم";
    case "mourshida":
      return "مرشدات دينيات";
  }
}

function getTypeLabel(type: ArticleType): string {
  switch (type) {
    case "imam":
      return "إمام";
    case "mosque":
      return "مسجد";
    case "quran_teacher":
      return "معلم قرآن";
    case "mourshida":
      return "مرشدة دينية";
  }
}

function getTitlePlaceholder(type: ArticleType): string {
  switch (type) {
    case "imam":
      return "مثال: الشيخ عبد الحميد بن باديس";
    case "mosque":
      return "مثال: الجامع الأخضر";
    case "quran_teacher":
      return "مثال: الشيخ محمد العيد آل خليفة";
    case "mourshida":
      return "مثال: الأستاذة فاطمة الزهراء";
  }
}

function parseMembersText(value?: string): string[] {
  if (!value) return [];

  return value
    .split(/\r?\n|،|,|;/)
    .map((member) => member.trim())
    .filter(Boolean);
}

function parseFacilitiesText(value?: string): string[] {
  if (!value) return [];

  return value
    .split(/\r?\n|،|,|;/)
    .map((facility) => facility.trim())
    .filter(Boolean);
}

function MosqueLocationPicker({
  mosqueIndex,
  wilaya,
  commune,
  wilayaCode,
  onUpdate,
}: {
  mosqueIndex: number;
  wilaya: string;
  commune: string;
  wilayaCode: string;
  onUpdate: (idx: number, field: keyof MosqueRef, value: string) => void;
}) {
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [loading, setLoading] = useState(true);
  const [customCommune, setCustomCommune] = useState(false);

  useEffect(() => {
    fetch("/api/locations")
      .then((res) => res.json())
      .then((data) => {
        setWilayas(data.wilayas);
        setLoading(false);
        if (commune && wilayaCode) {
          const w = data.wilayas.find((w: Wilaya) => w.code === wilayaCode);
          if (
            w &&
            !w.communes.some((c: { name: string }) => c.name === commune)
          ) {
            setCustomCommune(true);
          }
        }
      })
      .catch(() => setLoading(false));
  }, []);

  const currentWilaya = wilayas.find((w) => w.code === wilayaCode);

  if (loading) {
    return <p className="text-xs text-text-secondary">جاري تحميل المواقع...</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <div>
        <label className="block text-xs text-text-secondary mb-0.5">
          ولاية المسجد
        </label>
        <select
          value={wilayaCode}
          onChange={(e) => {
            const code = e.target.value;
            const w = wilayas.find((w) => w.code === code);
            onUpdate(mosqueIndex, "wilayaCode", code);
            onUpdate(mosqueIndex, "wilaya", w?.name || "");
            onUpdate(mosqueIndex, "commune", "");
            setCustomCommune(false);
          }}
          className="w-full px-2 py-1.5 border border-border-light rounded text-sm bg-white"
        >
          <option value="">اختر الولاية</option>
          {wilayas.map((w) => (
            <option key={w.code} value={w.code}>
              {w.code} - {w.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <div className="flex items-center justify-between mb-0.5">
          <label className="block text-xs text-text-secondary">
            بلدية المسجد
          </label>
          {wilayaCode && (
            <button
              type="button"
              onClick={() => {
                setCustomCommune(!customCommune);
                if (!customCommune) onUpdate(mosqueIndex, "commune", "");
              }}
              className="text-xs text-primary hover:underline"
            >
              {customCommune ? "اختيار من القائمة" : "كتابة يدوية"}
            </button>
          )}
        </div>
        {customCommune ? (
          <input
            type="text"
            value={commune}
            onChange={(e) => onUpdate(mosqueIndex, "commune", e.target.value)}
            className="w-full px-2 py-1.5 border border-border-light rounded text-sm"
            placeholder="اكتب اسم البلدية"
          />
        ) : (
          <select
            value={commune}
            onChange={(e) => onUpdate(mosqueIndex, "commune", e.target.value)}
            disabled={!wilayaCode}
            className="w-full px-2 py-1.5 border border-border-light rounded text-sm bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">اختر البلدية</option>
            {currentWilaya?.communes.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}

interface ArticleFormProps {
  mode: "submit" | "create" | "edit";
  initialTitle?: string;
  initialData?: WikiArticle;
  slug?: string;
}

export default function ArticleForm({
  mode,
  initialTitle = "",
  initialData,
  slug,
}: ArticleFormProps) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<QuillEditorHandle>(null);

  const [articleType, setArticleType] = useState<ArticleType>("imam");
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [useRichText, setUseRichText] = useState(true);
  const [references, setReferences] = useState<Reference[]>([]);

  // Submitter info (only for submit mode)
  const [submitterName, setSubmitterName] = useState("");
  const [submitterEmail, setSubmitterEmail] = useState("");

  // Shared fields
  const [wilaya, setWilaya] = useState("");
  const [commune, setCommune] = useState("");
  const [wilayaCode, setWilayaCode] = useState("");
  const [image, setImage] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [youtubeVideos, setYoutubeVideos] = useState<string[]>([]);

  // Contact info (all types)
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [facebook, setFacebook] = useState("");
  const [youtubeChannel, setYoutubeChannel] = useState("");

  // Imam-like fields (imam, quran_teacher, mourshida)
  const [birthDate, setBirthDate] = useState("");
  const [deathDate, setDeathDate] = useState("");
  const [isAlive, setIsAlive] = useState(true);
  const [currentRankEntry, setCurrentRankEntry] = useState<{
    rank: string;
    fromDate: string;
  }>({ rank: "", fromDate: "" });
  const [oldRanks, setOldRanks] = useState<RankEntry[]>([]);
  const [currentMosqueEntry, setCurrentMosqueEntry] = useState<MosqueRef>({
    name: "",
    slug: "",
    startDate: "",
    endDate: "",
    wilaya: "",
    commune: "",
    wilayaCode: "",
  });
  const [oldMosques, setOldMosques] = useState<MosqueRef[]>([]);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  // Mosque fields
  const [mosqueType, setMosqueType] = useState("");
  const [dateBuilt, setDateBuilt] = useState("");
  const [founders, setFounders] = useState<FounderRef[]>([]);
  const [imamsServed, setImamsServed] = useState<ImamRef[]>([]);
  const [prayerHallArea, setPrayerHallArea] = useState("");
  const [prayerHallCapacity, setPrayerHallCapacity] = useState("");
  const [minaretHeight, setMinaretHeight] = useState("");
  const [totalArea, setTotalArea] = useState("");
  const [otherFacilities, setOtherFacilities] = useState<string[]>([]);
  const [customMosqueFields, setCustomMosqueFields] = useState<CustomField[]>(
    [],
  );
  const [currentImam, setCurrentImam] = useState("");
  const [currentAssociation, setCurrentAssociation] = useState("");
  const [associationMembers, setAssociationMembers] = useState("");
  const [currentAssociationMembers, setCurrentAssociationMembers] = useState<
    string[]
  >([]);
  const [formerCommitteeMembers, setFormerCommitteeMembers] = useState<
    string[]
  >([]);
  const [mosqueWorkers, setMosqueWorkers] = useState<MosqueWorkerEntry[]>([]);

  // New fields
  const [website, setWebsite] = useState("");
  const [dateInauguration, setDateInauguration] = useState("");
  const [mosqueGallery, setMosqueGallery] = useState<string[]>([]);
  const [mosqueTypeCustom, setMosqueTypeCustom] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Pre-fill form from initialData (edit mode)
  useEffect(() => {
    if (!initialData) return;
    setArticleType(initialData.articleType);
    setTitle(initialData.title);
    setDescription((initialData.description || "").slice(0, 70));
    setContent(initialData.rawContent || "");
    setWilaya(initialData.wilaya || "");
    setCommune(initialData.commune || "");
    setWilayaCode(initialData.wilayaCode || "");
    setImage(initialData.image?.src || "");
    setImageCaption(initialData.image?.caption || "");
    setYoutubeVideos(initialData.youtubeVideos || []);
    setPhone(initialData.phone || "");
    setEmail(initialData.email || "");
    setWhatsapp(initialData.whatsapp || "");
    setFacebook(initialData.facebook || "");
    setYoutubeChannel(initialData.youtubeChannel || "");
    setWebsite(initialData.website || "");
    // Imam-like
    setBirthDate(initialData.birthDate || "");
    setDeathDate(initialData.deathDate || "");
    setIsAlive(initialData.isAlive !== false);
    // Split ranks into current (no toDate) and old (with toDate)
    const allRanksInit =
      initialData.ranks?.map((r) => ({
        rank: r.rank,
        fromDate: r.fromDate || "",
        toDate: r.toDate || "",
      })) || [];
    const currentRankInit = allRanksInit.find((r) => !r.toDate);
    setCurrentRankEntry(
      currentRankInit
        ? { rank: currentRankInit.rank, fromDate: currentRankInit.fromDate }
        : { rank: "", fromDate: "" },
    );
    setOldRanks(allRanksInit.filter((r) => r.toDate));
    // Split mosques into current (no endDate) and old (with endDate)
    const allMosquesInit =
      initialData.mosquesServed?.map((m) => ({
        name: m.name,
        slug: m.slug || "",
        startDate: m.startDate || "",
        endDate: m.endDate || "",
        wilaya: m.wilaya || "",
        commune: m.commune || "",
        wilayaCode: m.wilayaCode || "",
      })) || [];
    const currentMosqueInit = allMosquesInit.find((m) => !m.endDate);
    setCurrentMosqueEntry(
      currentMosqueInit || {
        name: "",
        slug: "",
        startDate: "",
        endDate: "",
        wilaya: "",
        commune: "",
        wilayaCode: "",
      },
    );
    setOldMosques(allMosquesInit.filter((m) => m.endDate));
    setCustomFields(initialData.customFields || []);
    setCurrentImam(initialData.currentImam || "");
    setCurrentAssociation(initialData.currentAssociation || "");
    setAssociationMembers(initialData.associationMembers || "");
    const currentMembersFromData = initialData.currentAssociationMembers?.length
      ? initialData.currentAssociationMembers
      : parseMembersText(initialData.associationMembers);
    setCurrentAssociationMembers(currentMembersFromData);
    setFormerCommitteeMembers(initialData.formerCommitteeMembers || []);
    setMosqueWorkers(
      initialData.mosqueWorkers?.map((worker) => ({
        name: worker.name || "",
        rank: worker.rank || "",
        fromDate: worker.fromDate || "",
        toDate: worker.toDate || "",
      })) || [],
    );
    // Mosque
    const mt = initialData.mosqueType || "";
    const knownTypes = [
      "جامع الجزائر",
      "مسجد تاريخي",
      "مسجد رئيسي",
      "مسجد وطني",
      "مسجد محلي",
      "مسجد حي",
      "مسجد قطب",
      "زاوية علمية",
    ];
    if (mt && !knownTypes.includes(mt)) {
      setMosqueType(mt);
      setMosqueTypeCustom(true);
    } else {
      setMosqueType(mt);
      setMosqueTypeCustom(false);
    }
    setDateBuilt(initialData.dateBuilt || "");
    setDateInauguration(initialData.dateInauguration || "");
    setFounders(
      initialData.founders?.map((f) => ({
        name: f.name,
        rutba: f.rutba || "",
      })) || [],
    );
    setImamsServed(
      initialData.imamsServed?.map((i) => ({
        name: i.name,
        slug: i.slug || "",
        startDate: i.startDate || "",
        endDate: i.endDate || "",
        rutba: i.rutba || "",
      })) || [],
    );
    setPrayerHallArea(initialData.prayerHallArea || "");
    setPrayerHallCapacity(initialData.prayerHallCapacity || "");
    setMinaretHeight(initialData.minaretHeight || "");
    setTotalArea(initialData.totalArea || "");
    setOtherFacilities(parseFacilitiesText(initialData.otherFacilities));
    setCustomMosqueFields(initialData.customMosqueFields || []);
    setMosqueGallery(initialData.mosqueGallery || []);
    setReferences(initialData.references || []);
  }, [initialData]);

  const handleLocationChange = (loc: {
    wilaya: string;
    commune: string;
    wilayaCode: string;
  }) => {
    setWilaya(loc.wilaya);
    setCommune(loc.commune);
    setWilayaCode(loc.wilayaCode);
  };

  const handleImageSelected = ({
    src,
    caption,
  }: {
    src: string;
    caption?: string;
  }) => {
    setImage(src);
    setImageCaption(caption || "");
  };

  // Old mosque refs
  const addOldMosque = () => {
    setOldMosques([
      ...oldMosques,
      {
        name: "",
        slug: "",
        startDate: "",
        endDate: "",
        wilaya: "",
        commune: "",
        wilayaCode: "",
      },
    ]);
  };
  const updateOldMosque = (
    idx: number,
    field: keyof MosqueRef,
    value: string,
  ) => {
    const updated = [...oldMosques];
    updated[idx][field] = value;
    if (field === "name") updated[idx].slug = value.replace(/\s+/g, "_");
    setOldMosques(updated);
  };
  const removeOldMosque = (idx: number) =>
    setOldMosques(oldMosques.filter((_, i) => i !== idx));

  // Current mosque entry
  const updateCurrentMosque = (field: keyof MosqueRef, value: string) => {
    setCurrentMosqueEntry((prev) => {
      const updated = { ...prev };
      updated[field] = value;
      if (field === "name") updated.slug = value.replace(/\s+/g, "_");
      return updated;
    });
  };

  // Custom fields
  const addCustomField = () =>
    setCustomFields([...customFields, { label: "", value: "" }]);
  const updateCustomField = (
    idx: number,
    field: keyof CustomField,
    value: string,
  ) => {
    const updated = [...customFields];
    updated[idx][field] = value;
    setCustomFields(updated);
  };
  const removeCustomField = (idx: number) =>
    setCustomFields(customFields.filter((_, i) => i !== idx));

  // Other facilities
  const addOtherFacility = () => setOtherFacilities([...otherFacilities, ""]);
  const updateOtherFacility = (idx: number, value: string) => {
    const updated = [...otherFacilities];
    updated[idx] = value;
    setOtherFacilities(updated);
  };
  const removeOtherFacility = (idx: number) =>
    setOtherFacilities(otherFacilities.filter((_, i) => i !== idx));

  // Old ranks
  const addOldRank = () =>
    setOldRanks([...oldRanks, { rank: "", fromDate: "", toDate: "" }]);
  const updateOldRank = (
    idx: number,
    field: keyof RankEntry,
    value: string,
  ) => {
    const updated = [...oldRanks];
    updated[idx][field] = value;
    setOldRanks(updated);
  };
  const removeOldRank = (idx: number) =>
    setOldRanks(oldRanks.filter((_, i) => i !== idx));

  // Imam refs
  const addImamRef = () =>
    setImamsServed([
      ...imamsServed,
      { name: "", slug: "", startDate: "", endDate: "", rutba: "" },
    ]);
  const updateImamRef = (idx: number, field: keyof ImamRef, value: string) => {
    const updated = [...imamsServed];
    updated[idx][field] = value;
    if (field === "name") updated[idx].slug = value.replace(/\s+/g, "_");
    setImamsServed(updated);
  };
  const removeImamRef = (idx: number) =>
    setImamsServed(imamsServed.filter((_, i) => i !== idx));

  // Mosque workers
  const addMosqueWorker = () =>
    setMosqueWorkers([
      ...mosqueWorkers,
      { name: "", rank: "", fromDate: "", toDate: "" },
    ]);
  const updateMosqueWorker = (
    idx: number,
    field: keyof MosqueWorkerEntry,
    value: string,
  ) => {
    const updated = [...mosqueWorkers];
    updated[idx][field] = value;
    setMosqueWorkers(updated);
  };
  const removeMosqueWorker = (idx: number) =>
    setMosqueWorkers(mosqueWorkers.filter((_, i) => i !== idx));

  // Founders
  const addFounder = () => setFounders([...founders, { name: "", rutba: "" }]);
  const updateFounder = (
    idx: number,
    field: keyof FounderRef,
    value: string,
  ) => {
    const updated = [...founders];
    updated[idx][field] = value;
    setFounders(updated);
  };
  const removeFounder = (idx: number) =>
    setFounders(founders.filter((_, i) => i !== idx));

  // Custom mosque fields
  const addCustomMosqueField = () =>
    setCustomMosqueFields([...customMosqueFields, { label: "", value: "" }]);
  const updateCustomMosqueField = (
    idx: number,
    field: keyof CustomField,
    value: string,
  ) => {
    const updated = [...customMosqueFields];
    updated[idx][field] = value;
    setCustomMosqueFields(updated);
  };
  const removeCustomMosqueField = (idx: number) =>
    setCustomMosqueFields(customMosqueFields.filter((_, i) => i !== idx));

  const addCurrentAssociationMember = () =>
    setCurrentAssociationMembers([...currentAssociationMembers, ""]);
  const updateCurrentAssociationMember = (idx: number, value: string) => {
    const updated = [...currentAssociationMembers];
    updated[idx] = value;
    setCurrentAssociationMembers(updated);
  };
  const removeCurrentAssociationMember = (idx: number) =>
    setCurrentAssociationMembers(
      currentAssociationMembers.filter((_, i) => i !== idx),
    );

  const addFormerCommitteeMember = () =>
    setFormerCommitteeMembers([...formerCommitteeMembers, ""]);
  const updateFormerCommitteeMember = (idx: number, value: string) => {
    const updated = [...formerCommitteeMembers];
    updated[idx] = value;
    setFormerCommitteeMembers(updated);
  };
  const removeFormerCommitteeMember = (idx: number) =>
    setFormerCommitteeMembers(
      formerCommitteeMembers.filter((_, i) => i !== idx),
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const validYoutubeVideos = youtubeVideos.filter((v) => v.trim() !== "");

      const articleData: Record<string, unknown> = {
        title,
        description: description.slice(0, 70),
        category: getCategoryLabel(articleType),
        articleType,
        content,
        wilaya,
        commune,
        wilayaCode,
        image: image ? { src: image, caption: imageCaption } : undefined,
        youtubeVideos:
          validYoutubeVideos.length > 0 ? validYoutubeVideos : undefined,
        references: references.length > 0 ? references : undefined,
        // Contact info
        phone: phone || undefined,
        email: email || undefined,
        whatsapp: whatsapp || undefined,
        facebook: facebook || undefined,
        youtubeChannel: youtubeChannel || undefined,
        website: website || undefined,
      };

      if (isImamLike(articleType)) {
        articleData.birthDate = birthDate || undefined;
        articleData.deathDate = isAlive ? undefined : deathDate || undefined;
        articleData.isAlive = isAlive;
        const allRanks = [
          ...(currentRankEntry.rank.trim()
            ? [{ ...currentRankEntry, toDate: "" }]
            : []),
          ...oldRanks.filter((r) => r.rank.trim() !== ""),
        ];
        articleData.ranks = allRanks;
        const allMosques = [
          ...(currentMosqueEntry.name.trim()
            ? [{ ...currentMosqueEntry, endDate: "" }]
            : []),
          ...oldMosques.filter((m) => m.name.trim() !== ""),
        ];
        articleData.mosquesServed = allMosques;
        articleData.customFields = customFields.filter(
          (f) => f.label.trim() !== "" && f.value.trim() !== "",
        );
      } else {
        articleData.mosqueType = mosqueType || undefined;
        articleData.dateBuilt = dateBuilt || undefined;
        articleData.founders = founders.filter((f) => f.name.trim() !== "");
        articleData.imamsServed = imamsServed.filter(
          (i) => i.name.trim() !== "",
        );
        articleData.prayerHallArea = prayerHallArea || undefined;
        articleData.prayerHallCapacity = prayerHallCapacity || undefined;
        articleData.minaretHeight = minaretHeight || undefined;
        articleData.totalArea = totalArea || undefined;
        const normalizedFacilities = otherFacilities
          .map((f) => f.trim())
          .filter(Boolean);
        articleData.otherFacilities = normalizedFacilities.length
          ? normalizedFacilities.join("، ")
          : undefined;
        articleData.customMosqueFields = customMosqueFields.filter(
          (f) => f.label.trim() !== "" && f.value.trim() !== "",
        );
        articleData.dateInauguration = dateInauguration || undefined;
        articleData.mosqueGallery = mosqueGallery.filter(
          (g) => g.trim() !== "",
        );
        articleData.currentImam = currentImam || undefined;
        articleData.currentAssociation = currentAssociation || undefined;
        const sanitizedCurrentMembers = currentAssociationMembers
          .map((member) => member.trim())
          .filter(Boolean);
        const sanitizedFormerMembers = formerCommitteeMembers
          .map((member) => member.trim())
          .filter(Boolean);
        articleData.currentAssociationMembers = sanitizedCurrentMembers.length
          ? sanitizedCurrentMembers
          : undefined;
        articleData.formerCommitteeMembers = sanitizedFormerMembers.length
          ? sanitizedFormerMembers
          : undefined;
        articleData.associationMembers = sanitizedCurrentMembers.length
          ? sanitizedCurrentMembers.join("، ")
          : associationMembers || undefined;
        articleData.mosqueWorkers = mosqueWorkers.filter(
          (worker) => worker.name.trim() !== "",
        );
      }

      if (mode === "submit") {
        articleData.submitterName = submitterName;
        articleData.submitterEmail = submitterEmail;
      }

      let response: Response;
      if (mode === "edit") {
        response = await fetch(`/api/articles/${slug}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(articleData),
        });
      } else {
        const endpoint =
          mode === "submit" ? "/api/submissions" : "/api/articles";
        response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(articleData),
        });
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "فشل في إرسال المقال");

      if (mode === "submit") {
        setSuccess(true);
        setTimeout(() => router.push("/"), 3000);
      } else if (mode === "edit") {
        router.push(`/wiki/${slug}`);
      } else {
        router.push(`/wiki/${data.slug}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل في إرسال المقال");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-heading font-bold text-green-800 mb-4">
          تم التقديم بنجاح!
        </h2>
        <p className="text-green-700 mb-4">
          تم تقديم مقالك بنجاح. سيتم مراجعته من قبل الإدارة قبل النشر.
        </p>
        <p className="text-sm text-green-600">
          جاري إعادة التوجيه إلى الصفحة الرئيسية...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-destructive px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Article Type Selector */}
      <div>
        <label className="block text-sm font-bold mb-3 text-black">
          نوع المقال <span className="text-destructive">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { type: "imam" as const, icon: UserCircle, label: "إمام" },
            { type: "mosque" as const, icon: Landmark, label: "مسجد" },
            {
              type: "quran_teacher" as const,
              icon: BookOpen,
              label: "معلم قرآن",
            },
            {
              type: "mourshida" as const,
              icon: HijabiWomanIcon,
              label: "مرشدة دينية",
            },
          ].map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              type="button"
              onClick={() => setArticleType(type)}
              className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                articleType === type
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border-light hover:border-border text-text-secondary"
              }`}
            >
              <Icon size={22} />
              <span className="font-heading text-base font-bold">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mandatory fields note */}
      <p className="text-sm text-text-secondary bg-amber-50 border border-amber-200 rounded px-3 py-2">
        الحقول المُعلَّمة بـ{" "}
        <span className="text-destructive font-bold">*</span> إلزامية والبقية
        اختيارية
      </p>

      {/* Submitter Info (submit mode only) */}
      {mode === "submit" && (
        <div className="bg-bg-sidebar rounded-lg p-4 space-y-4 border border-border-light">
          <h3 className="font-bold text-lg font-heading text-primary">
            معلوماتك
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-black">
                الاسم <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={submitterName}
                onChange={(e) => setSubmitterName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-border-light rounded"
                placeholder="اسمك"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-black">
                البريد الإلكتروني <span className="text-destructive">*</span>
              </label>
              <input
                type="email"
                value={submitterEmail}
                onChange={(e) => setSubmitterEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-border-light rounded"
                placeholder="email@example.com"
              />
            </div>
          </div>
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-bold mb-2 text-black">
          {articleType === "mosque"
            ? "اسم المسجد"
            : `اسم ${getTypeLabel(articleType)}`}{" "}
          <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2 border border-border-light rounded text-lg"
          placeholder={getTitlePlaceholder(articleType)}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-bold mb-2 text-black">
          وصف مختصر
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, 70))}
          maxLength={70}
          className="w-full px-4 py-2 border border-border-light rounded"
          placeholder="وصف موجز في سطر واحد"
        />
        <p className="mt-1 text-xs text-text-secondary">
          {description.length}/70
        </p>
      </div>

      {/* Location */}
      <div className="bg-bg-sidebar rounded-lg p-4 border border-border-light">
        <LocationPicker
          selectedWilaya={wilaya}
          selectedCommune={commune}
          selectedWilayaCode={wilayaCode}
          onSelect={handleLocationChange}
        />
      </div>

      {/* Type-Specific Fields */}
      {isImamLike(articleType) ? (
        <div className="bg-bg-sidebar rounded-lg p-4 border border-border-light space-y-4">
          <h3 className="font-bold text-lg font-heading text-primary">
            معلومات {getTypeLabel(articleType)}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-black">
                تاريخ الميلاد
              </label>
              <input
                type="text"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-2 border border-border-light rounded"
                placeholder="مثال: 1889-12-05 أو 1889"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-black">
                  تاريخ الوفاة
                </label>
                <label className="flex items-center gap-2 text-sm text-black">
                  <input
                    type="checkbox"
                    checked={isAlive}
                    onChange={(e) => setIsAlive(e.target.checked)}
                    className="rounded"
                  />
                  <span>على قيد الحياة</span>
                </label>
              </div>
              <input
                type="text"
                value={deathDate}
                onChange={(e) => setDeathDate(e.target.value)}
                disabled={isAlive}
                className="w-full px-4 py-2 border border-border-light rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="مثال: 1940-04-16 أو 1940"
              />
            </div>
          </div>

          {/* Current Rank */}
          <div>
            <label className="block text-sm font-bold mb-2 text-black">
              الرتبة الحالية
            </label>
            <div className="bg-white p-3 rounded border border-border-light space-y-2">
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <div className="flex-1">
                  <select
                    value={
                      RANK_OPTIONS.includes(currentRankEntry.rank)
                        ? currentRankEntry.rank
                        : currentRankEntry.rank
                          ? "__custom__"
                          : ""
                    }
                    onChange={(e) => {
                      if (e.target.value === "__custom__") {
                        setCurrentRankEntry((prev) => ({ ...prev, rank: "" }));
                      } else {
                        setCurrentRankEntry((prev) => ({
                          ...prev,
                          rank: e.target.value,
                        }));
                      }
                    }}
                    className="w-full px-2 py-1.5 border border-border-light rounded text-sm bg-white"
                  >
                    <option value="">اختر الرتبة الحالية</option>
                    {RANK_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                    <option value="__custom__">أخرى (كتابة يدوية)</option>
                  </select>
                </div>
                <input
                  type="text"
                  value={currentRankEntry.fromDate}
                  onChange={(e) =>
                    setCurrentRankEntry((prev) => ({
                      ...prev,
                      fromDate: e.target.value,
                    }))
                  }
                  className="w-full sm:w-28 px-2 py-1.5 border border-border-light rounded text-sm text-center"
                  placeholder="منذ (السنة)"
                />
              </div>
              {!RANK_OPTIONS.includes(currentRankEntry.rank) &&
                currentRankEntry.rank !== "" && (
                  <input
                    type="text"
                    value={currentRankEntry.rank}
                    onChange={(e) =>
                      setCurrentRankEntry((prev) => ({
                        ...prev,
                        rank: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-1.5 border border-border-light rounded text-sm"
                    placeholder="اكتب الرتبة يدوياً"
                  />
                )}
            </div>
          </div>

          {/* Old Ranks */}
          <div>
            <label className="block text-sm font-bold mb-2 text-black">
              الرتب السابقة
            </label>
            <div className="space-y-3">
              {oldRanks.map((r, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3 rounded border border-border-light space-y-2"
                >
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                    <div className="flex-1">
                      <select
                        value={
                          RANK_OPTIONS.includes(r.rank) ? r.rank : "__custom__"
                        }
                        onChange={(e) => {
                          if (e.target.value === "__custom__") {
                            updateOldRank(idx, "rank", "");
                          } else {
                            updateOldRank(idx, "rank", e.target.value);
                          }
                        }}
                        className="w-full px-2 py-1.5 border border-border-light rounded text-sm bg-white"
                      >
                        <option value="">اختر الرتبة</option>
                        {RANK_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                        <option value="__custom__">أخرى (كتابة يدوية)</option>
                      </select>
                    </div>
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={r.fromDate}
                        onChange={(e) =>
                          updateOldRank(idx, "fromDate", e.target.value)
                        }
                        className="w-full sm:w-24 px-2 py-1.5 border border-border-light rounded text-sm text-center"
                        placeholder="من"
                      />
                      <input
                        type="text"
                        value={r.toDate}
                        onChange={(e) =>
                          updateOldRank(idx, "toDate", e.target.value)
                        }
                        className="w-full sm:w-24 px-2 py-1.5 border border-border-light rounded text-sm text-center"
                        placeholder="إلى"
                      />
                      <button
                        type="button"
                        onClick={() => removeOldRank(idx)}
                        className="p-1.5 text-destructive hover:bg-red-50 rounded flex-shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  {!RANK_OPTIONS.includes(r.rank) && (
                    <input
                      type="text"
                      value={r.rank}
                      onChange={(e) =>
                        updateOldRank(idx, "rank", e.target.value)
                      }
                      className="w-full px-3 py-1.5 border border-border-light rounded text-sm"
                      placeholder="اكتب الرتبة يدوياً"
                    />
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addOldRank}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded text-sm text-primary font-medium transition-colors"
              >
                <Plus size={16} />
                إضافة رتبة سابقة
              </button>
            </div>
          </div>

          {/* Current Mosque */}
          <div>
            <label className="block text-sm font-bold mb-2 text-black">
              المسجد الحالي
            </label>
            <div className="bg-white p-3 rounded border border-border-light space-y-2">
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <input
                  type="text"
                  value={currentMosqueEntry.name}
                  onChange={(e) => updateCurrentMosque("name", e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-border-light rounded text-sm"
                  placeholder="اسم المسجد الحالي"
                />
                <input
                  type="text"
                  value={currentMosqueEntry.startDate}
                  onChange={(e) =>
                    updateCurrentMosque("startDate", e.target.value)
                  }
                  className="w-full sm:w-28 px-2 py-1.5 border border-border-light rounded text-sm text-center"
                  placeholder="منذ (السنة)"
                />
              </div>
              <MosqueLocationPicker
                mosqueIndex={0}
                wilaya={currentMosqueEntry.wilaya}
                commune={currentMosqueEntry.commune}
                wilayaCode={currentMosqueEntry.wilayaCode}
                onUpdate={(_, field, value) =>
                  updateCurrentMosque(field, value)
                }
              />
            </div>
          </div>

          {/* Old Mosques */}
          <div>
            <label className="block text-sm font-bold mb-2 text-black">
              المساجد السابقة
            </label>
            <div className="space-y-3">
              {oldMosques.map((m, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3 rounded border border-border-light space-y-2"
                >
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                    <input
                      type="text"
                      value={m.name}
                      onChange={(e) =>
                        updateOldMosque(idx, "name", e.target.value)
                      }
                      className="flex-1 px-3 py-1.5 border border-border-light rounded text-sm"
                      placeholder="اسم المسجد"
                    />
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={m.startDate}
                        onChange={(e) =>
                          updateOldMosque(idx, "startDate", e.target.value)
                        }
                        className="w-full sm:w-24 px-2 py-1.5 border border-border-light rounded text-sm text-center"
                        placeholder="من"
                      />
                      <input
                        type="text"
                        value={m.endDate}
                        onChange={(e) =>
                          updateOldMosque(idx, "endDate", e.target.value)
                        }
                        className="w-full sm:w-24 px-2 py-1.5 border border-border-light rounded text-sm text-center"
                        placeholder="إلى"
                      />
                      <button
                        type="button"
                        onClick={() => removeOldMosque(idx)}
                        className="p-1.5 text-destructive hover:bg-red-50 rounded flex-shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <MosqueLocationPicker
                    mosqueIndex={idx}
                    wilaya={m.wilaya}
                    commune={m.commune}
                    wilayaCode={m.wilayaCode}
                    onUpdate={updateOldMosque}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addOldMosque}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded text-sm text-primary font-medium transition-colors"
              >
                <Plus size={16} />
                إضافة مسجد سابق
              </button>
            </div>
          </div>

          {/* Custom fields */}
          <div>
            <label className="block text-sm font-bold mb-2 text-black">
              معلومات إضافية
            </label>
            <div className="space-y-2">
              {customFields.map((f, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row gap-2 sm:items-center bg-white p-2 rounded border border-border-light"
                >
                  <input
                    type="text"
                    value={f.label}
                    onChange={(e) =>
                      updateCustomField(idx, "label", e.target.value)
                    }
                    className="w-full sm:w-1/3 px-3 py-1.5 border border-border-light rounded text-sm"
                    placeholder="العنوان (مثال: الطريقة، المذهب...)"
                  />
                  <div className="flex gap-2 items-center flex-1">
                    <input
                      type="text"
                      value={f.value}
                      onChange={(e) =>
                        updateCustomField(idx, "value", e.target.value)
                      }
                      className="flex-1 px-3 py-1.5 border border-border-light rounded text-sm"
                      placeholder="القيمة"
                    />
                    <button
                      type="button"
                      onClick={() => removeCustomField(idx)}
                      className="p-1.5 text-destructive hover:bg-red-50 rounded flex-shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addCustomField}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded text-sm text-primary font-medium transition-colors"
              >
                <Plus size={16} />
                إضافة معلومة
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-bg-sidebar rounded-lg p-4 border border-border-light space-y-4">
          <h3 className="font-bold text-lg font-heading text-primary">
            معلومات المسجد
          </h3>

          <div>
            <label className="block text-sm font-bold mb-2 text-black">
              نوع المسجد
            </label>
            <select
              value={mosqueTypeCustom ? "__custom__" : mosqueType}
              onChange={(e) => {
                if (e.target.value === "__custom__") {
                  setMosqueTypeCustom(true);
                  setMosqueType("");
                } else {
                  setMosqueTypeCustom(false);
                  setMosqueType(e.target.value);
                }
              }}
              className="w-full px-4 py-2 border border-border-light rounded bg-white"
            >
              <option value="">اختر نوع المسجد</option>
              <option value="جامع الجزائر">جامع الجزائر</option>
              <option value="مسجد تاريخي">مسجد تاريخي</option>
              <option value="مسجد رئيسي">مسجد رئيسي</option>
              <option value="مسجد وطني">مسجد وطني</option>
              <option value="مسجد محلي">مسجد محلي</option>
              <option value="مسجد حي">مسجد حي</option>
              <option value="مسجد قطب">مسجد قطب</option>
              <option value="زاوية علمية">زاوية علمية</option>
              <option value="__custom__">أخرى (كتابة يدوية)</option>
            </select>
            {mosqueTypeCustom && (
              <input
                type="text"
                value={mosqueType}
                onChange={(e) => setMosqueType(e.target.value)}
                className="w-full mt-2 px-4 py-2 border border-border-light rounded"
                placeholder="اكتب نوع المسجد"
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-black">
                تاريخ البناء
              </label>
              <input
                type="text"
                value={dateBuilt}
                onChange={(e) => setDateBuilt(e.target.value)}
                className="w-full px-4 py-2 border border-border-light rounded"
                placeholder="مثال: 1730 أو القرن 18"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-black">
                تاريخ الافتتاح
              </label>
              <input
                type="text"
                value={dateInauguration}
                onChange={(e) => setDateInauguration(e.target.value)}
                className="w-full px-4 py-2 border border-border-light rounded"
                placeholder="مثال: 1735"
              />
            </div>
          </div>

          {/* Mosque detail fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-black">
                مساحة قاعة الصلاة
              </label>
              <input
                type="text"
                value={prayerHallArea}
                onChange={(e) => setPrayerHallArea(e.target.value)}
                className="w-full px-4 py-2 border border-border-light rounded"
                placeholder="مثال: 500 م²"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-black">
                عدد المصلين
              </label>
              <input
                type="text"
                value={prayerHallCapacity}
                onChange={(e) => setPrayerHallCapacity(e.target.value)}
                className="w-full px-4 py-2 border border-border-light rounded"
                placeholder="مثال: 1000"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-black">
                طول المئذنة
              </label>
              <input
                type="text"
                value={minaretHeight}
                onChange={(e) => setMinaretHeight(e.target.value)}
                className="w-full px-4 py-2 border border-border-light rounded"
                placeholder="مثال: 30 م"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-black">
                المساحة الكلية
              </label>
              <input
                type="text"
                value={totalArea}
                onChange={(e) => setTotalArea(e.target.value)}
                className="w-full px-4 py-2 border border-border-light rounded"
                placeholder="مثال: 2000 م²"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-black">
              مرافق أخرى
            </label>
            <div className="space-y-2">
              {otherFacilities.map((facility, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={facility}
                    onChange={(e) => updateOtherFacility(idx, e.target.value)}
                    className="flex-1 px-4 py-2 border border-border-light rounded"
                    placeholder="اكتب اسم المرفق"
                  />
                  <button
                    type="button"
                    onClick={() => removeOtherFacility(idx)}
                    className="p-2 text-destructive hover:bg-red-50 rounded flex-shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addOtherFacility}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded text-sm text-primary font-medium transition-colors"
              >
                <Plus size={16} />
                إضافة مرفق آخر
              </button>
            </div>
          </div>

          {/* Current Imam & Association */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-black">
                الإمام الحالي
              </label>
              <input
                type="text"
                value={currentImam}
                onChange={(e) => setCurrentImam(e.target.value)}
                className="w-full px-4 py-2 border border-border-light rounded"
                placeholder="اسم الإمام الحالي"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-black">
                الجمعية الحالية
              </label>
              <input
                type="text"
                value={currentAssociation}
                onChange={(e) => setCurrentAssociation(e.target.value)}
                className="w-full px-4 py-2 border border-border-light rounded"
                placeholder="اسم الجمعية الحالية"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold mb-2 text-black">
                أعضاء الجمعية الحالية
              </label>
              <div className="space-y-2">
                {currentAssociationMembers.map((member, idx) => (
                  <div
                    key={`current-member-${idx}`}
                    className="flex gap-2 items-center"
                  >
                    <input
                      type="text"
                      value={member}
                      onChange={(e) =>
                        updateCurrentAssociationMember(idx, e.target.value)
                      }
                      className="flex-1 px-3 py-1.5 border border-border-light rounded text-sm"
                      placeholder="اسم عضو الجمعية"
                    />
                    <button
                      type="button"
                      onClick={() => removeCurrentAssociationMember(idx)}
                      className="p-1.5 text-destructive hover:bg-red-50 rounded flex-shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addCurrentAssociationMember}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded text-sm text-primary font-medium transition-colors"
                >
                  <Plus size={16} />
                  إضافة عضو
                </button>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold mb-2 text-black">
                أعضاء لجنة سابقون
              </label>
              <div className="space-y-2">
                {formerCommitteeMembers.map((member, idx) => (
                  <div
                    key={`former-member-${idx}`}
                    className="flex gap-2 items-center"
                  >
                    <input
                      type="text"
                      value={member}
                      onChange={(e) =>
                        updateFormerCommitteeMember(idx, e.target.value)
                      }
                      className="flex-1 px-3 py-1.5 border border-border-light rounded text-sm"
                      placeholder="اسم عضو لجنة سابق"
                    />
                    <button
                      type="button"
                      onClick={() => removeFormerCommitteeMember(idx)}
                      className="p-1.5 text-destructive hover:bg-red-50 rounded flex-shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFormerCommitteeMember}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded text-sm text-primary font-medium transition-colors"
                >
                  <Plus size={16} />
                  إضافة عضو
                </button>
              </div>
            </div>
          </div>

          {/* Mosque workers */}
          <div>
            <label className="block text-sm font-bold mb-2 text-black">
              عمال المساجد
            </label>
            <div className="space-y-2">
              {mosqueWorkers.map((worker, idx) => (
                <div
                  key={idx}
                  className="bg-white p-2 rounded border border-border-light space-y-2"
                >
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={worker.name}
                      onChange={(e) =>
                        updateMosqueWorker(idx, "name", e.target.value)
                      }
                      className="flex-1 px-3 py-1.5 border border-border-light rounded text-sm"
                      placeholder="اسم العامل"
                    />
                    <button
                      type="button"
                      onClick={() => removeMosqueWorker(idx)}
                      className="p-1.5 text-destructive hover:bg-red-50 rounded flex-shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={worker.rank}
                      onChange={(e) =>
                        updateMosqueWorker(idx, "rank", e.target.value)
                      }
                      className="flex-1 px-3 py-1.5 border border-border-light rounded text-sm"
                      placeholder="الرتبة"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={worker.fromDate}
                        onChange={(e) =>
                          updateMosqueWorker(idx, "fromDate", e.target.value)
                        }
                        className="w-full sm:w-24 px-2 py-1.5 border border-border-light rounded text-sm text-center"
                        placeholder="من"
                      />
                      <input
                        type="text"
                        value={worker.toDate}
                        onChange={(e) =>
                          updateMosqueWorker(idx, "toDate", e.target.value)
                        }
                        className="w-full sm:w-24 px-2 py-1.5 border border-border-light rounded text-sm text-center"
                        placeholder="إلى"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addMosqueWorker}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded text-sm text-primary font-medium transition-colors"
              >
                <Plus size={16} />
                إضافة عامل
              </button>
            </div>
          </div>

          {/* Founders */}
          <div>
            <label className="block text-sm font-bold mb-2 text-black">
              المؤسسون
            </label>
            <div className="space-y-2">
              {founders.map((f, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row gap-2 sm:items-center bg-white p-2 rounded border border-border-light"
                >
                  <input
                    type="text"
                    value={f.name}
                    onChange={(e) => updateFounder(idx, "name", e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-border-light rounded text-sm"
                    placeholder="اسم المؤسس"
                  />
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={f.rutba}
                      onChange={(e) =>
                        updateFounder(idx, "rutba", e.target.value)
                      }
                      className="flex-1 sm:w-40 px-3 py-1.5 border border-border-light rounded text-sm"
                      placeholder="الرتبة"
                    />
                    <button
                      type="button"
                      onClick={() => removeFounder(idx)}
                      className="p-1.5 text-destructive hover:bg-red-50 rounded flex-shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addFounder}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded text-sm text-primary font-medium transition-colors"
              >
                <Plus size={16} />
                إضافة مؤسس
              </button>
            </div>
          </div>

          {/* Imams served */}
          <div>
            <label className="block text-sm font-bold mb-2 text-black">
              الأئمة الذين عملو فيه
            </label>
            <div className="space-y-2">
              {imamsServed.map((im, idx) => (
                <div
                  key={idx}
                  className="bg-white p-2 rounded border border-border-light space-y-2"
                >
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={im.name}
                      onChange={(e) =>
                        updateImamRef(idx, "name", e.target.value)
                      }
                      className="flex-1 px-3 py-1.5 border border-border-light rounded text-sm"
                      placeholder="اسم الإمام"
                    />
                    <button
                      type="button"
                      onClick={() => removeImamRef(idx)}
                      className="p-1.5 text-destructive hover:bg-red-50 rounded flex-shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={im.rutba}
                      onChange={(e) =>
                        updateImamRef(idx, "rutba", e.target.value)
                      }
                      className="flex-1 px-3 py-1.5 border border-border-light rounded text-sm"
                      placeholder="الرتبة"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={im.startDate}
                        onChange={(e) =>
                          updateImamRef(idx, "startDate", e.target.value)
                        }
                        className="w-full sm:w-24 px-2 py-1.5 border border-border-light rounded text-sm text-center"
                        placeholder="من"
                      />
                      <input
                        type="text"
                        value={im.endDate}
                        onChange={(e) =>
                          updateImamRef(idx, "endDate", e.target.value)
                        }
                        className="w-full sm:w-24 px-2 py-1.5 border border-border-light rounded text-sm text-center"
                        placeholder="إلى"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addImamRef}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded text-sm text-primary font-medium transition-colors"
              >
                <Plus size={16} />
                إضافة إمام
              </button>
            </div>
          </div>

          {/* Mosque Gallery */}
          <div>
            <label className="block text-sm font-bold mb-2 text-black">
              معرض صور المسجد
            </label>
            <div className="space-y-3">
              {mosqueGallery.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3 rounded border border-border-light"
                >
                  <div className="flex gap-2 items-start">
                    <div className="flex-1">
                      <ImageUploader
                        onImageInsert={() => {}}
                        onImageSelected={({ src }) => {
                          const updated = [...mosqueGallery];
                          updated[idx] = src;
                          setMosqueGallery(updated);
                        }}
                      />
                      {imgUrl && (
                        <img
                          src={imgUrl}
                          alt={`صورة ${idx + 1}`}
                          className="w-24 h-24 object-cover rounded mt-2"
                        />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setMosqueGallery(
                          mosqueGallery.filter((_, i) => i !== idx),
                        )
                      }
                      className="p-1.5 text-destructive hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setMosqueGallery([...mosqueGallery, ""])}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded text-sm text-primary font-medium transition-colors"
                >
                  <Plus size={16} />
                  إضافة صورة
                </button>
                <label className={`flex items-center gap-2 px-4 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded text-sm text-amber-800 font-medium transition-colors cursor-pointer ${galleryUploading ? "opacity-50 pointer-events-none" : ""}`}>
                  {galleryUploading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Plus size={16} />
                  )}
                  {galleryUploading ? "جاري الرفع..." : "رفع صور متعددة"}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    disabled={galleryUploading}
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length === 0) return;
                      setGalleryUploading(true);
                      const newUrls: string[] = [];
                      for (const file of files) {
                        const fd = new FormData();
                        fd.append("file", file);
                        try {
                          const res = await fetch("/api/upload", { method: "POST", body: fd });
                          const data = await res.json();
                          if (data.url) newUrls.push(data.url);
                        } catch {
                          // skip failed uploads silently
                        }
                      }
                      setMosqueGallery((prev) => [...prev, ...newUrls]);
                      setGalleryUploading(false);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Custom mosque fields */}
          <div>
            <label className="block text-sm font-bold mb-2 text-black">
              معلومات إضافية عن المسجد
            </label>
            <div className="space-y-2">
              {customMosqueFields.map((f, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row gap-2 sm:items-center bg-white p-2 rounded border border-border-light"
                >
                  <input
                    type="text"
                    value={f.label}
                    onChange={(e) =>
                      updateCustomMosqueField(idx, "label", e.target.value)
                    }
                    className="w-full sm:w-1/3 px-3 py-1.5 border border-border-light rounded text-sm"
                    placeholder="العنوان"
                  />
                  <div className="flex gap-2 items-center flex-1">
                    <input
                      type="text"
                      value={f.value}
                      onChange={(e) =>
                        updateCustomMosqueField(idx, "value", e.target.value)
                      }
                      className="flex-1 px-3 py-1.5 border border-border-light rounded text-sm"
                      placeholder="القيمة"
                    />
                    <button
                      type="button"
                      onClick={() => removeCustomMosqueField(idx)}
                      className="p-1.5 text-destructive hover:bg-red-50 rounded flex-shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addCustomMosqueField}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded text-sm text-primary font-medium transition-colors"
              >
                <Plus size={16} />
                إضافة معلومة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Info (all types) */}
      <div className="bg-bg-sidebar rounded-lg p-4 border border-border-light space-y-4">
        <h3 className="font-bold text-lg font-heading text-primary">
          معلومات الاتصال
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-2 text-black">
              رقم الهاتف
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border border-border-light rounded"
              placeholder="مثال: 0550000000"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 text-black">
              رقم الواتساب
            </label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full px-4 py-2 border border-border-light rounded"
              placeholder="مثال: +213550000000"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 text-black">
              الإيميل
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              dir="ltr"
              className="w-full px-4 py-2 border border-border-light rounded"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 text-black">
              الفيسبوك
            </label>
            <input
              type="url"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              className="w-full px-4 py-2 border border-border-light rounded"
              placeholder="رابط صفحة الفيسبوك"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-bold mb-2 text-black">
              قناة اليوتيوب
            </label>
            <input
              type="url"
              value={youtubeChannel}
              onChange={(e) => setYoutubeChannel(e.target.value)}
              className="w-full px-4 py-2 border border-border-light rounded"
              placeholder="رابط قناة اليوتيوب"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-bold mb-2 text-black">
              الموقع الإلكتروني
            </label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full px-4 py-2 border border-border-light rounded"
              placeholder="https://example.com"
            />
          </div>
        </div>
      </div>

      {/* Image */}
      <div className="bg-bg-sidebar rounded-lg p-4 border border-border-light">
        <label className="block text-sm font-bold mb-2 text-black">
          الصورة
        </label>
        <ImageUploader
          onImageInsert={() => {}}
          onImageSelected={handleImageSelected}
        />
        {image && (
          <div className="mt-2 p-2 bg-white border border-border-light rounded">
            <p className="text-xs text-text-secondary mb-1">الصورة المختارة:</p>
            <img
              src={image}
              alt="معاينة"
              className="w-32 h-32 object-cover rounded"
            />
            {imageCaption && (
              <p className="text-xs text-text-secondary mt-1">{imageCaption}</p>
            )}
            <button
              type="button"
              onClick={() => {
                setImage("");
                setImageCaption("");
              }}
              className="mt-2 text-xs text-destructive hover:underline"
            >
              حذف الصورة
            </button>
          </div>
        )}
      </div>

      {/* YouTube Videos */}
      <div>
        <label className="block text-sm font-bold mb-2 text-black">
          فيديوهات يوتيوب (اختياري)
        </label>
        <div className="space-y-2">
          {youtubeVideos.map((video, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="url"
                value={video}
                onChange={(e) => {
                  const updated = [...youtubeVideos];
                  updated[index] = e.target.value;
                  setYoutubeVideos(updated);
                }}
                placeholder="https://www.youtube.com/watch?v=..."
                className="flex-1 px-3 py-2 border border-border-light rounded text-sm"
              />
              <button
                type="button"
                onClick={() =>
                  setYoutubeVideos(youtubeVideos.filter((_, i) => i !== index))
                }
                className="px-3 py-2 bg-destructive text-white rounded hover:opacity-90 text-sm"
              >
                حذف
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setYoutubeVideos([...youtubeVideos, ""])}
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded text-sm text-primary font-medium"
          >
            <Plus size={16} />
            إضافة فيديو
          </button>
        </div>
      </div>

      {/* Content */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-bold text-black">
            محتوى المقال <span className="text-destructive">*</span>
          </label>
          <label className="flex items-center gap-2 text-sm text-black">
            <input
              type="checkbox"
              checked={useRichText}
              onChange={(e) => setUseRichText(e.target.checked)}
              className="rounded"
            />
            <span>المحرر المتقدم</span>
          </label>
        </div>
        {!useRichText && (
          <div className="text-xs text-text-secondary mb-2">
            استخدم صيغة Markdown. للروابط الداخلية استخدم: [[اسم المقال]]
          </div>
        )}

        {useRichText ? (
          <QuillEditor
            ref={editorRef}
            value={content}
            onChange={setContent}
            placeholder="ابدأ كتابة المقال هنا..."
          />
        ) : (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={15}
            className="w-full px-4 py-2 border border-border-light rounded font-arabic text-sm"
            placeholder={`## المقدمة\n\nاكتب محتوى المقال هنا...\n\n## انظر أيضاً\n\n- [[مقال مرتبط]]`}
          />
        )}
      </div>

      {/* References / تهميش */}
      <ReferencesManager
        references={references}
        onChange={setReferences}
        onInsertCitation={(refId) => {
          const idx = references.findIndex((r) => r.id === refId);
          editorRef.current?.insertCitation(refId, idx + 1);
        }}
      />

      {/* Submit */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={
            isSubmitting ||
            !title ||
            !content ||
            (mode === "submit" && (!submitterName || !submitterEmail))
          }
          className="btn-primary flex items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              جاري الإرسال...
            </>
          ) : mode === "submit" ? (
            "تقديم المقال"
          ) : mode === "edit" ? (
            "حفظ التعديلات"
          ) : (
            "إنشاء المقال"
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 bg-bg-sidebar hover:bg-border-light rounded font-medium transition-colors"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
}
