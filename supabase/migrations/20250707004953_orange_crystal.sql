/*
  # Create testimonials table with proper RLS policies

  1. New Tables
    - `testimonials`
      - `id` (uuid, primary key)
      - `name` (text, required, 2-100 chars)
      - `testimonial` (text, required, 10-1000 chars)
      - `status` (text, default 'pending', enum: pending/approved/rejected)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `user_id` (uuid, optional foreign key to auth.users)

  2. Security
    - Enable RLS on `testimonials` table
    - Add policy for anonymous users to submit testimonials
    - Add policy for authenticated users to manage testimonials
    - Add policy for public to read approved testimonials

  3. Functions and Triggers
    - Create or update the update_updated_at_column function (if not exists)
    - Add trigger to automatically update updated_at timestamp

  4. Sample Data
    - Insert approved testimonials for testing
*/

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Allow anonymous users to submit testimonials" ON testimonials;
DROP POLICY IF EXISTS "Allow authenticated users to read testimonials" ON testimonials;
DROP POLICY IF EXISTS "Allow authenticated users to update testimonials" ON testimonials;
DROP POLICY IF EXISTS "Allow authenticated users to delete testimonials" ON testimonials;
DROP POLICY IF EXISTS "Enable read access for approved testimonials" ON testimonials;
DROP POLICY IF EXISTS "Enable read access for all users" ON testimonials;
DROP POLICY IF EXISTS "Allow public testimonial submissions" ON testimonials;
DROP POLICY IF EXISTS "Allow authenticated users to insert testimonials" ON testimonials;

-- Drop existing trigger if it exists (but keep the function since other tables use it)
DROP TRIGGER IF EXISTS update_testimonials_updated_at ON testimonials;

-- Create testimonials table if it doesn't exist
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (length(TRIM(BOTH FROM name)) >= 2 AND length(TRIM(BOTH FROM name)) <= 100),
  testimonial text NOT NULL CHECK (length(TRIM(BOTH FROM testimonial)) >= 10 AND length(TRIM(BOTH FROM testimonial)) <= 1000),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Create or replace the update function (only if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'update_updated_at_column'
  ) THEN
    CREATE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $func$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $func$ language 'plpgsql';
  END IF;
END $$;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Policy for anonymous users to submit testimonials
CREATE POLICY "Allow anonymous users to submit testimonials"
  ON testimonials
  FOR INSERT
  TO anon
  WITH CHECK (
    name IS NOT NULL AND
    TRIM(BOTH FROM name) <> '' AND
    testimonial IS NOT NULL AND
    TRIM(BOTH FROM testimonial) <> '' AND
    user_id IS NULL AND
    status = 'pending' AND
    created_at IS NOT NULL
  );

-- Policy for authenticated users to submit testimonials
CREATE POLICY "Allow authenticated users to insert testimonials"
  ON testimonials
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (user_id = auth.uid() OR user_id IS NULL)
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

-- Policy for public testimonial submissions (combined anon and authenticated)
CREATE POLICY "Allow public testimonial submissions"
  ON testimonials
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    name IS NOT NULL AND
    TRIM(BOTH FROM name) <> '' AND
    testimonial IS NOT NULL AND
    TRIM(BOTH FROM testimonial) <> '' AND
    (user_id IS NULL OR auth.uid() = user_id) AND
    status = 'pending' AND
    created_at IS NOT NULL
  );

-- Insert some sample data for testing (only if table is empty)
DO $$
BEGIN
  -- Only insert if table is empty
  IF NOT EXISTS (SELECT 1 FROM testimonials LIMIT 1) THEN
    INSERT INTO testimonials (name, testimonial, status) VALUES
    ('Marie Dubois', 'Une expérience absolument magique ! Safa a créé la robe de mes rêves avec une attention aux détails exceptionnelle.', 'approved'),
    ('Sophie Laurent', 'Service impeccable et créativité sans limites. Je recommande vivement pour toutes les futures mariées.', 'approved'),
    ('Emma Martin', 'Professionnalisme et élégance au rendez-vous. Ma robe était parfaite, exactement ce que j''imaginais.', 'approved'),
    ('Claire Rousseau', 'Un savoir-faire exceptionnel et une écoute parfaite. Chaque détail de ma robe reflétait mes envies.', 'approved'),
    ('Amélie Moreau', 'De la première consultation aux retouches finales, tout était parfait. Une expérience inoubliable.', 'approved');
  END IF;
END $$;