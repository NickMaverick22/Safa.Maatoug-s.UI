/*
  # Create new testimonials2 table without status column

  1. New Tables
    - `testimonials2`
      - `id` (uuid, primary key)
      - `name` (text, required, 2-100 chars)
      - `testimonial` (text, required, 10-1000 chars)
      - `user_id` (uuid, nullable, references auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `testimonials2` table
    - Add policy for anonymous users to submit testimonials
    - Add policy for public read access
    - Add policy for authenticated users (CMS) full access

  3. Constraints
    - Name length validation (2-100 characters)
    - Testimonial length validation (10-1000 characters)
*/

-- Create the new testimonials2 table
CREATE TABLE IF NOT EXISTS testimonials2 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  testimonial text NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add constraints for validation
ALTER TABLE testimonials2 ADD CONSTRAINT testimonials2_name_length 
  CHECK (length(TRIM(BOTH FROM name)) >= 2 AND length(TRIM(BOTH FROM name)) <= 100);

ALTER TABLE testimonials2 ADD CONSTRAINT testimonials2_testimonial_length 
  CHECK (length(TRIM(BOTH FROM testimonial)) >= 10 AND length(TRIM(BOTH FROM testimonial)) <= 1000);

-- Enable RLS
ALTER TABLE testimonials2 ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow anonymous users to submit testimonials"
  ON testimonials2
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
  ON testimonials2
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users full access"
  ON testimonials2
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_testimonials2_updated_at 
  BEFORE UPDATE ON testimonials2 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();