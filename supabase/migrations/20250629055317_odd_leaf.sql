/*
  # Create testimonials table with proper RLS policies

  1. New Tables
    - `testimonials`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `testimonial` (text, required)
      - `status` (text, default 'pending')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `testimonials` table
    - Add policy for anonymous users to insert testimonials
    - Add policy for authenticated users to read all testimonials
    - Add policy for authenticated users to update/delete testimonials
*/

-- Create testimonials table
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