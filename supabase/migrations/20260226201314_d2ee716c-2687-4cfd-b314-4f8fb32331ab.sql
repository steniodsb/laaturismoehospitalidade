
-- Create storage bucket for establishment images
INSERT INTO storage.buckets (id, name, public)
VALUES ('establishment-images', 'establishment-images', true);

-- Allow anyone to view files (public bucket)
CREATE POLICY "Public read access for establishment images"
ON storage.objects FOR SELECT
USING (bucket_id = 'establishment-images');

-- Allow admins to upload files
CREATE POLICY "Admins can upload establishment images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'establishment-images'
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow admins to update files
CREATE POLICY "Admins can update establishment images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'establishment-images'
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow admins to delete files
CREATE POLICY "Admins can delete establishment images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'establishment-images'
  AND has_role(auth.uid(), 'admin'::app_role)
);
