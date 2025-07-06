/*
  # Add user_id column to testimonials table

  1. Changes
    - Add user_id column as nullable UUID referencing auth.users(id)
    - Update RLS policies to handle both authenticated and anonymous users
    - Ensure anonymous users can submit testimonials with user_id = NULL

  2. Security
    - Maintain existing RLS policies
    - Allow anonymous submissions with NULL user_id
    - Allow authenticated users to manage testimonials
*/

-- Add user_id column to testimonials table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'testimonials' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.testimonials ADD COLUMN user_id UUID REFERENCES auth.users(id);
  END IF;
END $$;

-- Drop existing policies to recreate them with user_id support
DROP POLICY IF EXISTS "Allow anonymous users to submit testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Allow authenticated users to insert testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Allow authenticated users to read testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Allow authenticated users to update testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Allow authenticated users to delete testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Enable read access for approved testimonials" ON public.testimonials;

-- Policy for anonymous users to submit testimonials (user_id = NULL)
CREATE POLICY "Allow anonymous users to submit testimonials"
  ON public.testimonials
  FOR INSERT
  TO anon
  WITH CHECK (
    status = 'pending' AND
    user_id IS NULL AND
    name IS NOT NULL AND
    testimonial IS NOT NULL AND
    length(trim(name)) >= 2 AND
    length(trim(name)) <= 100 AND
    length(trim(testimonial)) >= 10 AND
    length(trim(testimonial)) <= 1000
  );

-- Policy for authenticated users to insert testimonials (user_id = auth.uid())
CREATE POLICY "Allow authenticated users to insert testimonials"
  ON public.testimonials
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() OR user_id IS NULL
  );

-- Policy for authenticated users to read all testimonials
CREATE POLICY "Allow authenticated users to read testimonials"
  ON public.testimonials
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for authenticated users to update testimonials
CREATE POLICY "Allow authenticated users to update testimonials"
  ON public.testimonials
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy for authenticated users to delete testimonials
CREATE POLICY "Allow authenticated users to delete testimonials"
  ON public.testimonials
  FOR DELETE
  TO authenticated
  USING (true);

-- Policy for public to read approved testimonials
CREATE POLICY "Enable read access for approved testimonials"
  ON public.testimonials
  FOR SELECT
  TO public
  USING (status = 'approved');