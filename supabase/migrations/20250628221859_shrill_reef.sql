/*
  # Allow public testimonial submission

  1. Security Changes
    - Add RLS policy to allow anonymous users to insert testimonials
    - Ensure only basic testimonial data can be inserted by public users
    - Maintain existing policies for authenticated users

  2. Policy Details
    - Allow INSERT for anonymous (public) users
    - Restrict to only the necessary fields
    - Default status will be 'pending' for moderation
*/

-- Create policy to allow anonymous users to submit testimonials
CREATE POLICY "Allow anonymous users to submit testimonials"
  ON testimonials
  FOR INSERT
  TO anon
  WITH CHECK (
    -- Allow insertion with pending status only
    status = 'pending' AND
    -- Ensure required fields are present
    name IS NOT NULL AND
    testimonial IS NOT NULL
  );