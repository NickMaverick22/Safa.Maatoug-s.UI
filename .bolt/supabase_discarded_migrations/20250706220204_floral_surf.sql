/*
  # Remove status column from testimonials table

  1. Changes
    - Remove status column from testimonials table
    - Remove status-related check constraints
    - Update RLS policies to allow all testimonials to be visible
    - Simplify testimonial submission process

  2. Security
    - Keep RLS enabled for data protection
    - Allow anonymous users to insert testimonials
    - Allow public read access to all testimonials
*/

-- Remove the status check constraint first
ALTER TABLE testimonials DROP CONSTRAINT IF EXISTS testimonials_status_check;

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Allow anonymous users to submit testimonials" ON testimonials;
DROP POLICY IF EXISTS "Allow authenticated users to delete testimonials" ON testimonials;
DROP POLICY IF EXISTS "Allow authenticated users to insert testimonials" ON testimonials;
DROP POLICY IF EXISTS "Allow authenticated users to read testimonials" ON testimonials;
DROP POLICY IF EXISTS "Allow authenticated users to update testimonials" ON testimonials;
DROP POLICY IF EXISTS "Enable read access for approved testimonials" ON testimonials;

-- Remove the status column
ALTER TABLE testimonials DROP COLUMN IF EXISTS status;

-- Create new simplified RLS policies
CREATE POLICY "Allow anonymous users to submit testimonials"
  ON testimonials
  FOR INSERT
  TO anon
  WITH CHECK (
    name IS NOT NULL AND 
    testimonial IS NOT NULL AND 
    length(TRIM(BOTH FROM name)) >= 2 AND 
    length(TRIM(BOTH FROM name)) <= 100 AND 
    length(TRIM(BOTH FROM testimonial)) >= 10 AND 
    length(TRIM(BOTH FROM testimonial)) <= 1000
  );

CREATE POLICY "Allow public read access to all testimonials"
  ON testimonials
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users full access"
  ON testimonials
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);