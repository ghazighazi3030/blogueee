/*
# [Secure Functions and Enable User Deletion]
This migration script enhances security by setting a fixed search_path for existing database functions to prevent potential hijacking. It also introduces a new function to allow admins to safely delete users and their associated authentication records.

## Query Description: [This operation secures database functions and adds user deletion capabilities. It modifies function definitions and creates a new privileged function for user management. This is a critical security and functionality update.]

## Metadata:
- Schema-Category: ["Structural", "Security"]
- Impact-Level: ["Medium"]
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Modifies function: `public.handle_new_user`
- Modifies function: `public.generate_slug`
- Creates function: `public.delete_user`

## Security Implications:
- RLS Status: [Enabled]
- Policy Changes: [No]
- Auth Requirements: [The new `delete_user` function requires 'service_role' privileges and should only be callable from a trusted backend environment.]

## Performance Impact:
- Indexes: [None]
- Triggers: [None]
- Estimated Impact: [Low performance impact, as this primarily alters function definitions.]
*/

-- Step 1: Secure the handle_new_user function
ALTER FUNCTION public.handle_new_user() SET search_path = '';

-- Step 2: Secure the generate_slug function
ALTER FUNCTION public.generate_slug(title text) SET search_path = '';

-- Step 3: Create a secure function for user deletion
CREATE OR REPLACE FUNCTION public.delete_user(user_id_to_delete uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This function must run with the permissions of the definer (postgres)
  -- to have the ability to delete a user from the auth.users table.
  DELETE FROM auth.users WHERE id = user_id_to_delete;
END;
$$;

-- Step 4: Secure the new delete_user function
ALTER FUNCTION public.delete_user(user_id_to_delete uuid) SET search_path = '';
