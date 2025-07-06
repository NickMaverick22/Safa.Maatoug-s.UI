/*
  # Create Collections and Gallery Images Tables

  1. New Tables
    - `collections`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `description` (text, not null)
      - `cover_image_url` (text)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `gallery_images`
      - `id` (uuid, primary key)
      - `filename` (text, not null)
      - `original_name` (text, not null)
      - `url` (text, not null)
      - `alt` (text, not null)
      - `category` (text, not null)
      - `tags` (text array)
      - `uploaded_at` (timestamp)
      - `uploaded_by` (text)
      - `size` (integer)
      - `dimensions` (jsonb)
    - `collection_images`
      - `id` (uuid, primary key)
      - `collection_id` (uuid, foreign key)
      - `image_id` (uuid, foreign key)
      - `order_index` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add admin-only policies for full access
    - Add public read policies for active collections and their images
*/

-- Create collections table
CREATE TABLE IF NOT EXISTS collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  cover_image_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create gallery_images table
CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  original_name text NOT NULL,
  url text NOT NULL,
  alt text NOT NULL,
  category text NOT NULL DEFAULT 'collection',
  tags text[] DEFAULT '{}',
  uploaded_at timestamptz DEFAULT now(),
  uploaded_by text,
  size integer DEFAULT 0,
  dimensions jsonb DEFAULT '{"width": 0, "height": 0}'
);

-- Create collection_images junction table
CREATE TABLE IF NOT EXISTS collection_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id uuid REFERENCES collections(id) ON DELETE CASCADE,
  image_id uuid REFERENCES gallery_images(id) ON DELETE CASCADE,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(collection_id, image_id)
);

-- Add constraints
ALTER TABLE collections ADD CONSTRAINT collections_name_length 
  CHECK (length(TRIM(BOTH FROM name)) >= 2 AND length(TRIM(BOTH FROM name)) <= 100);

ALTER TABLE collections ADD CONSTRAINT collections_description_length 
  CHECK (length(TRIM(BOTH FROM description)) >= 10 AND length(TRIM(BOTH FROM description)) <= 1000);

ALTER TABLE gallery_images ADD CONSTRAINT gallery_images_alt_length 
  CHECK (length(TRIM(BOTH FROM alt)) >= 2 AND length(TRIM(BOTH FROM alt)) <= 200);

ALTER TABLE gallery_images ADD CONSTRAINT gallery_images_category_check 
  CHECK (category IN ('collection', 'atelier', 'hero', 'testimonials'));

-- Enable RLS
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_images ENABLE ROW LEVEL SECURITY;

-- Collections policies
CREATE POLICY "Allow public read access to active collections"
  ON collections
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Allow admin full access to collections"
  ON collections
  FOR ALL
  TO authenticated
  USING (is_admin(auth.jwt() ->> 'email'))
  WITH CHECK (is_admin(auth.jwt() ->> 'email'));

-- Gallery images policies
CREATE POLICY "Allow public read access to gallery images"
  ON gallery_images
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow admin full access to gallery images"
  ON gallery_images
  FOR ALL
  TO authenticated
  USING (is_admin(auth.jwt() ->> 'email'))
  WITH CHECK (is_admin(auth.jwt() ->> 'email'));

-- Collection images policies
CREATE POLICY "Allow public read access to collection images"
  ON collection_images
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow admin full access to collection images"
  ON collection_images
  FOR ALL
  TO authenticated
  USING (is_admin(auth.jwt() ->> 'email'))
  WITH CHECK (is_admin(auth.jwt() ->> 'email'));

-- Create updated_at triggers
CREATE TRIGGER update_collections_updated_at 
  BEFORE UPDATE ON collections 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO collections (name, description, cover_image_url, is_active) VALUES
  ('Haute Couture 2024', 'Notre collection exclusive de robes haute couture pour 2024, alliant tradition et modernité.', '/lovable-uploads/88c2ef1d-431e-419a-ba66-607284097b92.png', true),
  ('Cérémonie Élégante', 'Des créations raffinées pour vos cérémonies les plus importantes.', '/lovable-uploads/6254dd8b-8e1d-44e8-af43-adb58b41fa97.png', true),
  ('Mariage Civil', 'Des robes parfaites pour votre mariage civil, alliant simplicité et élégance.', '/lovable-uploads/2c7222b1-a23a-4739-8373-3dfadc9633e5.png', true);

-- Insert sample gallery images
INSERT INTO gallery_images (filename, original_name, url, alt, category, tags, uploaded_by, size, dimensions) VALUES
  ('88c2ef1d-431e-419a-ba66-607284097b92.png', 'etoile-azure.png', '/lovable-uploads/88c2ef1d-431e-419a-ba66-607284097b92.png', 'Étoile Azure - Plumes et Éclats', 'collection', ARRAY['haute-couture', 'plumes', 'bleu'], 'salim@admin.com', 2048576, '{"width": 800, "height": 1200}'),
  ('6254dd8b-8e1d-44e8-af43-adb58b41fa97.png', 'lumiere-champagne.png', '/lovable-uploads/6254dd8b-8e1d-44e8-af43-adb58b41fa97.png', 'Lumière Champagne', 'collection', ARRAY['ceremonie', 'champagne', 'tulle'], 'salim@admin.com', 1876543, '{"width": 800, "height": 1200}'),
  ('f231d151-f79a-45c9-99b4-aff96b6b9a6b.png', 'royaute-scintillante.png', '/lovable-uploads/f231d151-f79a-45c9-99b4-aff96b6b9a6b.png', 'Royauté Scintillante', 'collection', ARRAY['haute-couture', 'or', 'brocart'], 'salim@admin.com', 2156789, '{"width": 800, "height": 1200}'),
  ('751c5221-23b0-45db-ae85-970443bf024e.png', 'soleil-or.png', '/lovable-uploads/751c5221-23b0-45db-ae85-970443bf024e.png', 'Soleil d''Or', 'collection', ARRAY['haute-couture', 'jaune', 'tulle'], 'salim@admin.com', 1987654, '{"width": 800, "height": 1200}'),
  ('b7d5454b-f7aa-42e9-a591-a5636043dad3.png', 'symphonie-argentee.png', '/lovable-uploads/b7d5454b-f7aa-42e9-a591-a5636043dad3.png', 'Symphonie Argentée', 'collection', ARRAY['ceremonie', 'argent', 'brocart'], 'salim@admin.com', 1765432, '{"width": 800, "height": 1200}'),
  ('8630b707-80e4-4ccb-a99e-6ab29491ce9e.png', 'eclat-noir.png', '/lovable-uploads/8630b707-80e4-4ccb-a99e-6ab29491ce9e.png', 'Éclat Noir', 'collection', ARRAY['ceremonie', 'noir', 'crepe'], 'salim@admin.com', 1654321, '{"width": 800, "height": 1200}'),
  ('2c7222b1-a23a-4739-8373-3dfadc9633e5.png', 'grace-perlee.png', '/lovable-uploads/2c7222b1-a23a-4739-8373-3dfadc9633e5.png', 'Grâce Perlée', 'collection', ARRAY['mariage-civil', 'blanc', 'dentelle'], 'salim@admin.com', 1543210, '{"width": 800, "height": 1200}'),
  ('4c0ac742-ef06-42c2-b9f0-b01290af4dd2.png', 'romance-printaniere.png', '/lovable-uploads/4c0ac742-ef06-42c2-b9f0-b01290af4dd2.png', 'Romance Printanière', 'collection', ARRAY['mariage-civil', 'blanc', 'dentelle'], 'salim@admin.com', 1432109, '{"width": 800, "height": 1200}'),
  ('1e066b73-bcc6-4941-89b2-4fccd4acdc32.png', 'constellation-doree.png', '/lovable-uploads/1e066b73-bcc6-4941-89b2-4fccd4acdc32.png', 'Constellation Dorée', 'collection', ARRAY['haute-couture', 'champagne', 'mikado'], 'salim@admin.com', 1876543, '{"width": 800, "height": 1200}');

-- Link images to collections
INSERT INTO collection_images (collection_id, image_id, order_index)
SELECT 
  c.id,
  gi.id,
  ROW_NUMBER() OVER (PARTITION BY c.id ORDER BY gi.uploaded_at) - 1
FROM collections c
CROSS JOIN gallery_images gi
WHERE 
  (c.name = 'Haute Couture 2024' AND gi.alt IN ('Étoile Azure - Plumes et Éclats', 'Royauté Scintillante', 'Soleil d''Or', 'Constellation Dorée'))
  OR (c.name = 'Cérémonie Élégante' AND gi.alt IN ('Lumière Champagne', 'Symphonie Argentée', 'Éclat Noir'))
  OR (c.name = 'Mariage Civil' AND gi.alt IN ('Grâce Perlée', 'Romance Printanière'));