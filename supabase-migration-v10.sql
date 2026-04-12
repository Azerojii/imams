-- Migration v10: structured edit suggestion payloads
ALTER TABLE edit_suggestions
  ADD COLUMN IF NOT EXISTS proposed_changes JSONB,
  ADD COLUMN IF NOT EXISTS original_snapshot JSONB;
