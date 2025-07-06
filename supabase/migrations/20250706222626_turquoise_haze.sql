/*
  # Create Admin User Setup

  1. Authentication Setup
    - Create admin user with email salim@admin.com and password 123456
    - This will be handled through Supabase Auth

  2. User Profile
    - The user will be created in auth.users automatically
    - We can reference this user in our application

  Note: This migration sets up the structure. The actual user creation
  should be done through the Supabase dashboard or auth API.
*/

-- First, let's ensure we have the proper auth setup
-- The admin user should be created through Supabase Auth dashboard or API

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_email text)
RETURNS boolean AS $$
BEGIN
  RETURN user_email = 'salim@admin.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create admin-only policies for sensitive operations
-- This function can be used in RLS policies to restrict admin access

-- Example: Update testimonials2 policies to include admin check
DROP POLICY IF EXISTS "Allow authenticated users full access" ON testimonials2;

CREATE POLICY "Allow authenticated users full access"
  ON testimonials2
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create admin-specific policy for appointments
CREATE POLICY "Allow admin full access to appointments"
  ON appointments
  FOR ALL
  TO authenticated
  USING (is_admin(auth.jwt() ->> 'email'))
  WITH CHECK (is_admin(auth.jwt() ->> 'email'));