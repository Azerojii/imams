-- Migration v8: add structured association committee fields

ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS current_association_members JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS former_committee_members JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS association_other_info TEXT;

ALTER TABLE submissions
  ADD COLUMN IF NOT EXISTS current_association_members JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS former_committee_members JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS association_other_info TEXT;

-- Backfill legacy single text field into current_association_members when possible
UPDATE articles
SET current_association_members = to_jsonb(
  array_remove(regexp_split_to_array(association_members, E'\\s*[\\n،,;]\\s*'), '')
)
WHERE association_members IS NOT NULL
  AND btrim(association_members) <> ''
  AND COALESCE(jsonb_array_length(current_association_members), 0) = 0;

UPDATE submissions
SET current_association_members = to_jsonb(
  array_remove(regexp_split_to_array(association_members, E'\\s*[\\n،,;]\\s*'), '')
)
WHERE association_members IS NOT NULL
  AND btrim(association_members) <> ''
  AND COALESCE(jsonb_array_length(current_association_members), 0) = 0;
