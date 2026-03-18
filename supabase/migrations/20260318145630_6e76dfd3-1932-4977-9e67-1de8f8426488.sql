
-- Create storage bucket for organization assets
INSERT INTO storage.buckets (id, name, public) VALUES ('organization-assets', 'organization-assets', true);

-- Allow authenticated users to upload to organization-assets
CREATE POLICY "Authenticated users can upload org assets"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'organization-assets');

-- Allow public read access
CREATE POLICY "Public can read org assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'organization-assets');
