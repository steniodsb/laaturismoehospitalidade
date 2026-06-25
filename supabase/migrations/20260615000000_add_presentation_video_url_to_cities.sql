-- Add missing presentation_video_url column to cities.
-- The column is used by the admin form (CitiesAdminPage) and CityDetailPage,
-- and exists in the generated TypeScript types, but was never created in the
-- database. Saving a city failed with:
--   "Could not find the 'presentation_video_url' column of 'cities' in the schema cache"
ALTER TABLE public.cities ADD COLUMN IF NOT EXISTS presentation_video_url TEXT;
