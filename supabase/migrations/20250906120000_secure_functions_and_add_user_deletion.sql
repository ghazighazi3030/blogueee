/*
          # [Function Security and User Deletion]
          This migration secures the `handle_new_user` function by setting a fixed search path, mitigating potential security risks. It also introduces a new function, `delete_user`, which allows an admin to securely delete a user from the system, including their authentication entry and profile data.

          ## Query Description: [This operation enhances security by hardening existing functions and adds a new, secure administrative capability. The `delete_user` function is destructive and will permanently remove a user and their associated data. This action is not reversible. Ensure you have backups if necessary.]
          
          ## Metadata:
          - Schema-Category: ["Structural", "Security"]
          - Impact-Level: ["Medium"]
          - Requires-Backup: [false]
          - Reversible: [false]
          
          ## Structure Details:
          - Modifies function: `public.handle_new_user`
          - Adds function: `public.delete_user(uuid)`
          
          ## Security Implications:
          - RLS Status: [Enabled]
          - Policy Changes: [No]
          - Auth Requirements: [Admin role required for `delete_user`]
          
          ## Performance Impact:
          - Indexes: [None]
          - Triggers: [None]
          - Estimated Impact: [Low]
          */

-- Step 1: Secure the existing handle_new_user function
ALTER FUNCTION public.handle_new_user() SET search_path = public;

-- Step 2: Create a function to check if the current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (
    SELECT role FROM public.profiles WHERE id = auth.uid()
  ) = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Create a secure function to delete a user
CREATE OR REPLACE FUNCTION public.delete_user(user_id_to_delete uuid)
RETURNS void AS $$
BEGIN
  -- Only allow admins to execute this function
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only admins can delete users.';
  END IF;

  -- Delete the user from the auth schema
  DELETE FROM auth.users WHERE id = user_id_to_delete;
  -- The corresponding profile will be deleted automatically due to the ON DELETE CASCADE trigger
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
