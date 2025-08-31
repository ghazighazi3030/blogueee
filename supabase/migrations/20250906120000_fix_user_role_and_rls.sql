/*
          # Fix User Role and RLS Policies
          This script corrects a previous migration error by first creating the `user_role` ENUM type, then adding the `role` column to the `profiles` table, and finally setting up the necessary Row-Level Security (RLS) policies for `posts` and `categories`.

          ## Query Description: This operation is structural and adds security policies. It creates a new type, adds a column to the `profiles` table, and defines access rules. It is designed to be non-destructive to existing data. Your existing users will be defaulted to the 'author' role, which you may want to update manually.

          ## Metadata:
          - Schema-Category: ["Structural", "Safe"]
          - Impact-Level: ["Medium"]
          - Requires-Backup: false
          - Reversible: true

          ## Structure Details:
          - Creates ENUM type: `public.user_role`
          - Adds column `role` to `public.profiles`
          - Creates RLS policies on `public.posts` and `public.categories`

          ## Security Implications:
          - RLS Status: Enabled
          - Policy Changes: Yes
          - Auth Requirements: Policies are based on the new `role` column.

          ## Performance Impact:
          - Indexes: None
          - Triggers: None
          - Estimated Impact: Low. RLS checks will add a negligible overhead to queries.
          */

-- Step 1: Create the user_role ENUM type if it doesn't exist.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('admin', 'editor', 'author');
    END IF;
END$$;

-- Step 2: Add the 'role' column to the 'profiles' table if it doesn't exist.
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role public.user_role DEFAULT 'author';

-- Step 3: Enable RLS on tables if not already enabled.
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop existing policies to ensure a clean slate.
DROP POLICY IF EXISTS "Allow authenticated users to read categories" ON public.categories;
DROP POLICY IF EXISTS "Allow admin/editor to manage categories" ON public.categories;
DROP POLICY IF EXISTS "Allow authenticated users to read posts" ON public.posts;
DROP POLICY IF EXISTS "Allow authors to manage their own posts" ON public.posts;
DROP POLICY IF EXISTS "Allow admin/editor to manage all posts" ON public.posts;

-- Step 5: Create RLS policies for 'categories'.
CREATE POLICY "Allow authenticated users to read categories"
ON public.categories
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow admin/editor to manage categories"
ON public.categories
FOR ALL
TO authenticated
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'editor')
)
WITH CHECK (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'editor')
);

-- Step 6: Create RLS policies for 'posts'.
CREATE POLICY "Allow authenticated users to read posts"
ON public.posts
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authors to manage their own posts"
ON public.posts
FOR ALL
TO authenticated
USING (
  author_id = auth.uid()
)
WITH CHECK (
  author_id = auth.uid()
);

CREATE POLICY "Allow admin/editor to manage all posts"
ON public.posts
FOR ALL
TO authenticated
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'editor')
)
WITH CHECK (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'editor')
);
