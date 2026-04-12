type ArticleType = "imam" | "mosque" | "quran_teacher" | "mourshida";

type JsonRecord = Record<string, unknown>;

function cleanString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function cleanStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

function stableNormalize(value: unknown): unknown {
  if (value === undefined) return null;
  if (value === null) return null;
  if (typeof value === "string" && value.trim() === "") return null;
  if (Array.isArray(value)) return value.map(stableNormalize);
  if (typeof value !== "object") return value;

  const entries = Object.entries(value as JsonRecord).sort(([a], [b]) =>
    a.localeCompare(b),
  );
  const normalized: JsonRecord = {};
  for (const [key, entryValue] of entries) {
    normalized[key] = stableNormalize(entryValue);
  }
  return normalized;
}

function isEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(stableNormalize(a)) === JSON.stringify(stableNormalize(b));
}

function isImamLike(articleType: ArticleType): boolean {
  return (
    articleType === "imam" ||
    articleType === "quran_teacher" ||
    articleType === "mourshida"
  );
}

export function buildProposedArticleRow(
  proposedData: JsonRecord,
  articleType: ArticleType,
): JsonRecord {
  const image =
    proposedData.image && typeof proposedData.image === "object"
      ? (proposedData.image as JsonRecord)
      : null;

  const row: JsonRecord = {
    title: cleanString(proposedData.title),
    description:
      typeof proposedData.description === "string"
        ? proposedData.description.slice(0, 70)
        : "",
    content: typeof proposedData.content === "string" ? proposedData.content : null,
    category: cleanString(proposedData.category),
    wilaya: cleanString(proposedData.wilaya),
    commune: cleanString(proposedData.commune),
    wilaya_code: cleanString(proposedData.wilayaCode),
    image_src: cleanString(image?.src),
    image_caption: cleanString(image?.caption),
    youtube_videos: cleanStringArray(proposedData.youtubeVideos),
    references: Array.isArray(proposedData.references)
      ? proposedData.references
      : [],
    phone: cleanString(proposedData.phone),
    email: cleanString(proposedData.email),
    whatsapp: cleanString(proposedData.whatsapp),
    facebook: cleanString(proposedData.facebook),
    youtube_channel: cleanString(proposedData.youtubeChannel),
    website: cleanString(proposedData.website),
  };

  if (isImamLike(articleType)) {
    row.birth_date = cleanString(proposedData.birthDate);
    row.death_date = cleanString(proposedData.deathDate);
    row.is_alive =
      typeof proposedData.isAlive === "boolean" ? proposedData.isAlive : null;
    row.rank = cleanString(proposedData.rank);
    row.ranks = Array.isArray(proposedData.ranks) ? proposedData.ranks : [];
    row.mosques_served = Array.isArray(proposedData.mosquesServed)
      ? proposedData.mosquesServed
      : [];
    row.custom_fields = Array.isArray(proposedData.customFields)
      ? proposedData.customFields
      : [];
  }

  if (articleType === "mosque") {
    row.mosque_type = cleanString(proposedData.mosqueType);
    row.date_built = cleanString(proposedData.dateBuilt);
    row.founders = Array.isArray(proposedData.founders) ? proposedData.founders : [];
    row.imams_served = Array.isArray(proposedData.imamsServed)
      ? proposedData.imamsServed
      : [];
    row.prayer_hall_area = cleanString(proposedData.prayerHallArea);
    row.prayer_hall_capacity = cleanString(proposedData.prayerHallCapacity);
    row.minaret_height = cleanString(proposedData.minaretHeight);
    row.total_area = cleanString(proposedData.totalArea);
    row.other_facilities = cleanString(proposedData.otherFacilities);
    row.custom_mosque_fields = Array.isArray(proposedData.customMosqueFields)
      ? proposedData.customMosqueFields
      : [];
    row.date_inauguration = cleanString(proposedData.dateInauguration);
    row.mosque_gallery = cleanStringArray(proposedData.mosqueGallery);
    row.current_imam = cleanString(proposedData.currentImam);
    row.current_council = cleanString(proposedData.currentCouncil);
    row.current_association = cleanString(proposedData.currentAssociation);
    row.current_association_members = cleanStringArray(
      proposedData.currentAssociationMembers,
    );
    row.former_committee_members = cleanStringArray(
      proposedData.formerCommitteeMembers,
    );
    row.association_other_info = cleanString(proposedData.associationOtherInfo);
    row.association_members = cleanString(proposedData.associationMembers);
    row.mosque_workers = Array.isArray(proposedData.mosqueWorkers)
      ? proposedData.mosqueWorkers
      : [];
    row.mosque_engineer = cleanString(proposedData.mosqueEngineer);
    row.historical_period = cleanString(proposedData.historicalPeriod);
  }

  return row;
}

export function computeChangedFields(
  currentArticleRow: JsonRecord,
  proposedRow: JsonRecord,
) {
  const proposedChanges: JsonRecord = {};
  const originalSnapshot: JsonRecord = {};

  for (const [field, nextValue] of Object.entries(proposedRow)) {
    const previousValue = currentArticleRow[field] ?? null;
    const normalizedNext = nextValue ?? null;

    if (!isEqual(previousValue, normalizedNext)) {
      proposedChanges[field] = normalizedNext;
      originalSnapshot[field] = previousValue;
    }
  }

  return { proposedChanges, originalSnapshot };
}
