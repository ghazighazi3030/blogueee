/*
  # [Migration] Add Role Column and Fix RLS Policies
  This migration script addresses a "column does not exist" error by adding a `role` column to the `profiles` table and then correctly configures the Row-Level Security (RLS) policies for the `posts` and `categories` tables.

  ## Query Description:
  This operation modifies the `profiles` table by adding a new column and updates security policies on `posts` and `categories`. It is designed to be non-destructive to existing data. The new `role` column will have a default value of 'author'. Please ensure you have a database backup before applying schema changes.

  ## Metadata:
  - Schema-Category: "Structural"
  - Impact-Level: "Medium"
  - Requires-Backup: true
  - Reversible: true

  ## Structure Details:
  - **Tables Modified:** `public.profiles`, `public.posts`, `public.categories`
  - **Columns Added:** `role` to `public.profiles`
  - **Functions Created:** `get_user_role()`
  - **Policies Added/Updated:** RLS policies for `SELECT`, `INSERT`, `UPDATE`, `DELETE` on `posts` and `categories`.

  ## Security Implications:
  - RLS Status: Enabled on `posts` and `categories`.
  - Policy Changes: Yes. This script defines the core access control logic for content management.
  - Auth Requirements: Policies depend on the authenticated user's role.

  ## Performance Impact:
  - Indexes: None added or removed.
  - Triggers: None.
  - Estimated Impact: Low. The new policies and function will have a negligible impact on query performance.
*/

-- Step 1: Add the 'role' column to the 'profiles' table
-- This column is essential for role-based access control. It defaults to 'author' for existing and new users.
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role public.user_role DEFAULT 'author';

-- Step 2: Create a helper function to get the user's role
/*
  This helper function retrieves the role of the currently authenticated user.
  It uses `SECURITY DEFINER` to safely bypass the `profiles` table's own RLS policies,
  which is a standard pattern for this specific purpose.
*/
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (
    SELECT role::text FROM public.profiles WHERE id = auth.uid()
  );
END;
$$;

-- Step 3: Configure RLS for the 'categories' table
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access for all users" ON public.categories;
CREATE POLICY "Allow read access for all users"
ON public.categories
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow full access to admin and editor" ON public.categories;
CREATE POLICY "Allow full access to admin and editor"
ON public.categories
FOR ALL
TO authenticated
USING (get_user_role() IN ('admin', 'editor'))
WITH CHECK (get_user_role() IN ('admin', 'editor'));


-- Step 4: Configure RLS for the 'posts' table
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access for published posts" ON public.posts;
CREATE POLICY "Allow read access for published posts"
ON public.posts
FOR SELECT
USING (status = 'published'::public.post_status);

DROP POLICY IF EXISTS "Allow full access to admin and editor" ON public.posts;
CREATE POLICY "Allow full access to admin and editor"
ON public.posts
FOR ALL
TO authenticated
USING (get_user_role() IN ('admin', 'editor'))
WITH CHECK (get_user_role() IN ('admin', 'editor'));

DROP POLICY IF EXISTS "Allow authors to manage their own posts" ON public.posts;
CREATE POLICY "Allow authors to manage their own posts"
ON public.posts
FOR ALL
TO authenticated
USING (auth.uid() = author_id AND get_user_role() = 'author')
WITH CHECK (auth.uid() = author_id AND get_user_role() = 'author');
