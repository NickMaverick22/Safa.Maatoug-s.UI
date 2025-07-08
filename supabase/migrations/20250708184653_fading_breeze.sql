/*
  # Add New Admin User Support

  1. Security Functions
    - Update is_admin() function to support multiple admin emails
    - Add new admin email: salimsoussi@mvrk22.com

  2. Admin User Setup
    - Support for multiple admin users
    - Email: salimsoussi@mvrk22.com
    - Password: Maverick221102 (to be set in Supabase Auth)

  3. Enhanced Security
    - Multiple admin access to CMS
    - Secure testimonials and appointments management
*/

-- Update the is_admin function to support multiple admin emails
CREATE OR REPLACE FUNCTION is_admin(user_email text)
RETURNS boolean AS $$
BEGIN
  RETURN user_email IN ('salim@admin.com', 'salimsoussi@mvrk22.com');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update all existing policies to use the new is_admin function
-- (The function is already referenced in existing policies, so they will automatically use the updated version)

-- Note: The actual user creation must be done through Supabase Auth Dashboard or API
-- Instructions:
-- 1. Go to your Supabase project dashboard
-- 2. Navigate to Authentication > Users
-- 3. Click "Add user"
-- 4. Enter email: salimsoussi@mvrk22.com
-- 5. Enter password: Maverick221102
-- 6. Confirm the user creation
-- 7. The user will now have admin access to the CMS