/*
          # Create Profile for New User
          This migration creates a trigger that automatically inserts a new row into the `public.profiles` table whenever a new user signs up and is added to the `auth.users` table. This ensures that every user has a corresponding profile, which is necessary for creating posts and other content.

          ## Query Description: 
          This operation is safe and does not affect existing data. It creates a new function `handle_new_user` and a trigger `on_auth_user_created`. The trigger will fire after a new user is inserted into `auth.users`, calling the function to populate the `public.profiles` table with the new user's ID and email. This resolves foreign key constraint violations when creating content linked to an author.

          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true (by dropping the trigger and function)
          
          ## Structure Details:
          - Adds function: `public.handle_new_user()`
          - Adds trigger: `on_auth_user_created` on table `auth.users`
          
          ## Security Implications:
          - RLS Status: Unchanged
          - Policy Changes: No
          - Auth Requirements: The function uses `SECURITY DEFINER` to access the `auth.users` table, which is a standard and secure practice for this use case.
          
          ## Performance Impact:
          - Indexes: None
          - Triggers: Added
          - Estimated Impact: Negligible. A single insert operation on user creation.
          */

-- 1. Create the function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'author'); -- Default role for new users is 'author'
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the trigger to call the function on new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
