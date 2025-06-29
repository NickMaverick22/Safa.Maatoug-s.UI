/*
  # Create testimonials table with RLS policies

  1. New Tables
    - `testimonials`
      - `id` (uuid, primary key)
      - `name` (text, required, 2-100 chars)
      - `testimonial` (text, required, 10-1000 chars)
      - `status` (text, default 'pending')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `testimonials` table
    - Allow anonymous users to submit testimonials
    - Allow authenticated users to manage testimonials
    - Allow public to read approved testimonials

  3. Functions & Triggers
    - Auto-update `updated_at` timestamp on changes
*/

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Allow anonymous users to submit testimonials" ON testimonials;
DROP POLICY IF EXISTS "Allow authenticated users to read testimonials" ON testimonials;
DROP POLICY IF EXISTS "Allow authenticated users to update testimonials" ON testimonials;
DROP POLICY IF EXISTS "Allow authenticated users to delete testimonials" ON testimonials;
DROP POLICY IF EXISTS "Enable read access for approved testimonials" ON testimonials;
DROP POLICY IF EXISTS "Enable read access for all users" ON testimonials;

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS update_testimonials_updated_at ON testimonials;
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Create testimonials table if it doesn't exist
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (length(name) >= 2 AND length(name) <= 100),
  testimonial text NOT NULL CHECK (length(testimonial) >= 10 AND length(testimonial) <= 1000),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Policy for anonymous users to submit testimonials
CREATE POLICY "Allow anonymous users to submit testimonials"
  ON testimonials
  FOR INSERT
  TO anon
  WITH CHECK (
    status = 'pending' AND
    name IS NOT NULL AND
    testimonial IS NOT NULL AND
    length(name) >= 2 AND
    length(testimonial) >= 10
  );

-- Policy for authenticated users to read all testimonials
CREATE POLICY "Allow authenticated users to read testimonials"
  ON testimonials
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for authenticated users to update testimonials
CREATE POLICY "Allow authenticated users to update testimonials"
  ON testimonials
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy for authenticated users to delete testimonials
CREATE POLICY "Allow authenticated users to delete testimonials"
  ON testimonials
  FOR DELETE
  TO authenticated
  USING (true);

-- Policy for public to read approved testimonials
CREATE POLICY "Enable read access for approved testimonials"
  ON testimonials
  FOR SELECT
  TO public
  USING (status = 'approved');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing (optional)
DO $$
BEGIN
  -- Only insert if table is empty
  IF NOT EXISTS (SELECT 1 FROM testimonials LIMIT 1) THEN
    INSERT INTO testimonials (name, testimonial, status) VALUES
    ('Marie Dubois', 'Une expérience absolument magique ! Safa a créé la robe de mes rêves avec une attention aux détails exceptionnelle.', 'approved'),
    ('Sophie Laurent', 'Service impeccable et créativité sans limites. Je recommande vivement pour toutes les futures mariées.', 'approved'),
    ('Emma Martin', 'Professionnalisme et élégance au rendez-vous. Ma robe était parfaite, exactement ce que j''imaginais.', 'approved');
  END IF;
END $$;