/*
  # Create Admin User Authentication Setup

  1. Security Functions
    - Create is_admin() function to check admin privileges
    - Set up admin-only policies for sensitive operations

  2. Admin User Setup
    - Instructions for creating admin user via Supabase Dashboard
    - Email: salim@admin.com
    - Password: 123456

  3. Enhanced Security
    - Admin-only access to appointments management
    - Secure testimonials management
*/

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_email text)
RETURNS boolean AS $$
BEGIN
  RETURN user_email = 'salim@admin.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create admin-only policies for appointments
DROP POLICY IF EXISTS "Allow admin full access to appointments" ON appointments;

CREATE POLICY "Allow admin full access to appointments"
  ON appointments
  FOR ALL
  TO authenticated
  USING (is_admin(auth.jwt() ->> 'email'))
  WITH CHECK (is_admin(auth.jwt() ->> 'email'));

-- Ensure testimonials2 has proper admin access
DROP POLICY IF EXISTS "Allow authenticated users full access" ON testimonials2;

CREATE POLICY "Allow authenticated users full access"
  ON testimonials2
  FOR ALL
  TO authenticated
  USING (is_admin(auth.jwt() ->> 'email'))
  WITH CHECK (is_admin(auth.jwt() ->> 'email'));