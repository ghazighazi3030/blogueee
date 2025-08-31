/*
# [Schema-Update] Add Row-Level Security (RLS) Policies for Posts and Categories
This script enables and configures Row-Level Security for the `posts` and `categories` tables to ensure that only authorized users can create, update, or delete content.

## Query Description: This operation is non-destructive and enhances security. It applies security policies to your database tables. It ensures:
1.  **Public Read Access:** Anyone can read published posts and all categories.
2.  **Authenticated Write Access:** Only logged-in users with appropriate roles (admin, editor, author) can create or modify content.
3.  **Ownership:** Authors can only manage their own posts, while admins and editors have broader permissions.
This will fix the "violates row-level security policy" errors you are encountering. There is no risk to existing data.

## Metadata:
- Schema-Category: "Security"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true (by disabling RLS or dropping policies)

## Structure Details:
- **Tables Affected:** `public.posts`, `public.categories`
- **Functions Created:** `public.get_my_role()`
- **Policies Created:**
  - `categories`: SELECT (public), INSERT (admin, editor), UPDATE (admin, editor), DELETE (admin)
  - `posts`: SELECT (public for published, owner/admin/editor for all), INSERT (owner), UPDATE (owner/admin/editor), DELETE (owner/admin/editor)

## Security Implications:
- RLS Status: Enabled
- Policy Changes: Yes
- Auth Requirements: Policies are based on `auth.uid()` and a custom `get_my_role()` function which checks the `profiles` table.

## Performance Impact:
- Indexes: None
- Triggers: None
- Estimated Impact: Negligible. RLS policies are highly optimized by PostgreSQL.
*/

-- =============================================
-- HELPER FUNCTION
-- =============================================
-- Create a helper function to get the role of the currently authenticated user.
-- This makes the policies below cleaner and easier to read.
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT role::text FROM public.profiles WHERE id = auth.uid()
$$;


-- =============================================
-- CATEGORIES TABLE POLICIES
-- =============================================

-- 1. Enable RLS on the categories table
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access" ON public.categories;
DROP POLICY IF EXISTS "Allow admins and editors to insert categories" ON public.categories;
DROP POLICY IF EXISTS "Allow admins and editors to update categories" ON public.categories;
DROP POLICY IF EXISTS "Allow admins to delete categories" ON public.categories;

-- 3. Create new policies
-- Allow anyone to read categories
CREATE POLICY "Allow public read access" ON public.categories
FOR SELECT USING (true);

-- Allow users with 'admin' or 'editor' role to insert new categories
CREATE POLICY "Allow admins and editors to insert categories" ON public.categories
FOR INSERT WITH CHECK (public.get_my_role() IN ('admin', 'editor'));

-- Allow users with 'admin' or 'editor' role to update categories
CREATE POLICY "Allow admins and editors to update categories" ON public.categories
FOR UPDATE USING (public.get_my_role() IN ('admin', 'editor'));

-- Allow only users with 'admin' role to delete categories
CREATE POLICY "Allow admins to delete categories" ON public.categories
FOR DELETE USING (public.get_my_role() = 'admin');


-- =============================================
-- POSTS TABLE POLICIES
-- =============================================

-- 1. Enable RLS on the posts table
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access for published posts" ON public.posts;
DROP POLICY IF EXISTS "Allow authors, admins, editors to read all posts" ON public.posts;
DROP POLICY IF EXISTS "Allow authenticated users to create posts" ON public.posts;
DROP POLICY IF EXISTS "Allow authors, admins, editors to update posts" ON public.posts;
DROP POLICY IF EXISTS "Allow authors, admins, editors to delete posts" ON public.posts;

-- 3. Create new policies
-- Allow public access to read posts that are 'published'
CREATE POLICY "Allow public read access for published posts" ON public.posts
FOR SELECT USING (status = 'published'::public.post_status);

-- Allow authors, admins, and editors to read all posts regardless of status
CREATE POLICY "Allow authors, admins, editors to read all posts" ON public.posts
FOR SELECT USING (auth.uid() = author_id OR public.get_my_role() IN ('admin', 'editor'));

-- Allow authenticated users to insert posts, checking they are the author
CREATE POLICY "Allow authenticated users to create posts" ON public.posts
FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Allow authors, admins, or editors to update posts
CREATE POLICY "Allow authors, admins, editors to update posts" ON public.posts
FOR UPDATE USING (auth.uid() = author_id OR public.get_my_role() IN ('admin', 'editor'));

-- Allow authors, admins, or editors to delete posts
CREATE POLICY "Allow authors, admins, editors to delete posts" ON public.posts
FOR DELETE USING (auth.uid() = author_id OR public.get_my_role() IN ('admin', 'editor'));
