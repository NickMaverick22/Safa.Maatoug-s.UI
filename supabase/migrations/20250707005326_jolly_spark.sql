-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Allow anonymous users to submit testimonials" ON testimonials2;
DROP POLICY IF EXISTS "Allow authenticated users to read testimonials" ON testimonials2;
DROP POLICY IF EXISTS "Allow authenticated users to update testimonials" ON testimonials2;
DROP POLICY IF EXISTS "Allow authenticated users to delete testimonials" ON testimonials2;
DROP POLICY IF EXISTS "Enable read access for approved testimonials" ON testimonials2;
DROP POLICY IF EXISTS "Enable read access for all users" ON testimonials2;
DROP POLICY IF EXISTS "Allow public testimonial submissions" ON testimonials2;
DROP POLICY IF EXISTS "Allow authenticated users to insert testimonials" ON testimonials2;
DROP POLICY IF EXISTS "Allow admin full access to testimonials" ON testimonials2;

-- Drop existing trigger if it exists (but keep the function since other tables use it)
DROP TRIGGER IF EXISTS update_testimonials2_updated_at ON testimonials2;

-- Ensure RLS is enabled on testimonials2
ALTER TABLE testimonials2 ENABLE ROW LEVEL SECURITY;

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
CREATE TRIGGER update_testimonials2_updated_at
  BEFORE UPDATE ON testimonials2
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Policy for anonymous users to submit testimonials
CREATE POLICY "Allow anonymous users to submit testimonials"
  ON testimonials2
  FOR INSERT
  TO anon
  WITH CHECK (
    name IS NOT NULL AND
    TRIM(BOTH FROM name) <> '' AND
    testimonial IS NOT NULL AND
    TRIM(BOTH FROM testimonial) <> '' AND
    (user_id IS NULL) AND
    status = 'pending' AND
    length(TRIM(BOTH FROM name)) >= 2 AND
    length(TRIM(BOTH FROM name)) <= 100 AND
    length(TRIM(BOTH FROM testimonial)) >= 10 AND
    length(TRIM(BOTH FROM testimonial)) <= 1000
  );

-- Policy for authenticated users to submit testimonials
CREATE POLICY "Allow authenticated users to insert testimonials"
  ON testimonials2
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (user_id = auth.uid() OR user_id IS NULL)
  );

-- Policy for authenticated users to read all testimonials
CREATE POLICY "Allow authenticated users to read testimonials"
  ON testimonials2
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for authenticated users to update testimonials
CREATE POLICY "Allow authenticated users to update testimonials"
  ON testimonials2
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy for authenticated users to delete testimonials
CREATE POLICY "Allow authenticated users to delete testimonials"
  ON testimonials2
  FOR DELETE
  TO authenticated
  USING (true);

-- Policy for public to read approved testimonials
CREATE POLICY "Enable read access for approved testimonials"
  ON testimonials2
  FOR SELECT
  TO public
  USING (status = 'approved');

-- Policy for public testimonial submissions (combined anon and authenticated)
CREATE POLICY "Allow public testimonial submissions"
  ON testimonials2
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

-- Policy for admin full access to testimonials
CREATE POLICY "Allow admin full access to testimonials"
  ON testimonials2
  FOR ALL
  TO authenticated
  USING (is_admin((jwt() ->> 'email'::text)))
  WITH CHECK (is_admin((jwt() ->> 'email'::text)));

-- Insert some sample data for testing (only if table is empty)
DO $$
BEGIN
  -- Only insert if table is empty
  IF NOT EXISTS (SELECT 1 FROM testimonials2 LIMIT 1) THEN
    INSERT INTO testimonials2 (name, testimonial, status) VALUES
    ('Marie Dubois', 'Une expérience absolument magique ! Safa a créé la robe de mes rêves avec une attention aux détails exceptionnelle.', 'approved'),
    ('Sophie Laurent', 'Service impeccable et créativité sans limites. Je recommande vivement pour toutes les futures mariées.', 'approved'),
    ('Emma Martin', 'Professionnalisme et élégance au rendez-vous. Ma robe était parfaite, exactement ce que j''imaginais.', 'approved'),
    ('Claire Rousseau', 'Un savoir-faire exceptionnel et une écoute parfaite. Chaque détail de ma robe reflétait mes envies.', 'approved'),
    ('Amélie Moreau', 'De la première consultation aux retouches finales, tout était parfait. Une expérience inoubliable.', 'approved');
  END IF;
END $$;