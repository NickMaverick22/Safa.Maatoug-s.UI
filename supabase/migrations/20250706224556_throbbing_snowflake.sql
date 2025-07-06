/*
  # Add status field to testimonials2 table

  1. New Fields
    - `status` (text) - Status of the testimonial: 'pending', 'approved', or 'rejected'
  
  2. Security
    - Update RLS policies to enforce status restrictions
    - Only approved testimonials are publicly visible
    - Anonymous users can only submit pending testimonials
    - Admins can approve/reject testimonials
*/

-- Add status column to testimonials2 table
ALTER TABLE testimonials2 ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending';

-- Add constraint to ensure status is valid
ALTER TABLE testimonials2 ADD CONSTRAINT testimonials2_status_check 
  CHECK (status IN ('pending', 'approved', 'rejected'));

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access to all testimonials" ON testimonials2;
DROP POLICY IF EXISTS "Allow anonymous users to submit testimonials" ON testimonials2;

-- Create new policies
-- Only approved testimonials are publicly visible
CREATE POLICY "Enable read access for approved testimonials"
  ON testimonials2
  FOR SELECT
  TO public
  USING (status = 'approved');

-- Anonymous users can only submit pending testimonials
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
    length(TRIM(BOTH FROM testimonial)) <= 1000 AND
    status = 'pending'
  );

-- Ensure admin policy remains
DROP POLICY IF EXISTS "Allow authenticated users full access" ON testimonials2;

CREATE POLICY "Allow admin full access to testimonials"
  ON testimonials2
  FOR ALL
  TO authenticated
  USING (is_admin(auth.jwt() ->> 'email'))
  WITH CHECK (is_admin(auth.jwt() ->> 'email'));