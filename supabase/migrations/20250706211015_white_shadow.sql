/*
  # Create testimonials table with proper RLS policies for anonymous submissions

  1. New Tables
    - `testimonials`
      - `id` (uuid, primary key)
      - `name` (text, required, 2-100 chars)
      - `testimonial` (text, required, 10-1000 chars)
      - `status` (text, default 'pending')
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `testimonials` table
    - Allow anonymous users to submit testimonials
    - Allow authenticated users to manage testimonials
    - Allow public to read approved testimonials

  3. Functions & Triggers
    - Auto-update `updated_at` timestamp on changes
*/

-- Drop the table completely to start fresh and avoid conflicts
DROP TABLE IF EXISTS testimonials CASCADE;

-- Create the testimonials table with proper constraints
CREATE TABLE testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  testimonial text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Add constraints with trimmed length checks
  CONSTRAINT testimonials_name_length CHECK (length(trim(name)) >= 2 AND length(trim(name)) <= 100),
  CONSTRAINT testimonials_testimonial_length CHECK (length(trim(testimonial)) >= 10 AND length(trim(testimonial)) <= 1000),
  CONSTRAINT testimonials_status_check CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow anonymous users to insert testimonials with specific conditions
CREATE POLICY "Allow anonymous testimonial submission"
  ON testimonials
  FOR INSERT
  TO anon
  WITH CHECK (
    status = 'pending' AND
    name IS NOT NULL AND
    testimonial IS NOT NULL AND
    length(trim(name)) >= 2 AND
    length(trim(name)) <= 100 AND
    length(trim(testimonial)) >= 10 AND
    length(trim(testimonial)) <= 1000
  );

-- Policy 2: Allow authenticated users to insert testimonials
CREATE POLICY "Allow authenticated users to insert testimonials"
  ON testimonials
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy 3: Allow authenticated users to read all testimonials
CREATE POLICY "Allow authenticated users to read testimonials"
  ON testimonials
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy 4: Allow authenticated users to update testimonials
CREATE POLICY "Allow authenticated users to update testimonials"
  ON testimonials
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy 5: Allow authenticated users to delete testimonials
CREATE POLICY "Allow authenticated users to delete testimonials"
  ON testimonials
  FOR DELETE
  TO authenticated
  USING (true);

-- Policy 6: Allow public (including anon) to read approved testimonials
CREATE POLICY "Enable read access for approved testimonials"
  ON testimonials
  FOR SELECT
  TO public
  USING (status = 'approved');

-- Create the update function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample approved testimonials for testing
INSERT INTO testimonials (name, testimonial, status, created_at) VALUES
('Marie Dubois', 'Une expérience absolument magique ! Safa a créé la robe de mes rêves avec une attention aux détails exceptionnelle. Chaque moment passé dans l''atelier était un plaisir.', 'approved', now() - interval '30 days'),
('Sophie Laurent', 'Service impeccable et créativité sans limites. Je recommande vivement pour toutes les futures mariées qui cherchent l''excellence et l''originalité.', 'approved', now() - interval '25 days'),
('Emma Martin', 'Professionnalisme et élégance au rendez-vous. Ma robe était parfaite, exactement ce que j''imaginais et même au-delà de mes espérances.', 'approved', now() - interval '20 days'),
('Claire Rousseau', 'Un savoir-faire exceptionnel et une écoute remarquable. Safa a su transformer mes idées en une création unique et magnifique.', 'approved', now() - interval '15 days'),
('Amélie Durand', 'L''expérience complète était parfaite, de la première consultation à la livraison finale. Un service de haute couture authentique.', 'approved', now() - interval '10 days');