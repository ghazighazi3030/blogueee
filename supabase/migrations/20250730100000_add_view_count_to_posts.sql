/*
# [Operation Name]
Add view_count to posts table

## Query Description: 
This operation adds a `view_count` column to the `posts` table to track post views. It defaults to 0 for existing posts, so no data will be lost. This is a non-destructive, structural change required for the dashboard analytics to function correctly.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Table: `posts`
- Column Added: `view_count` (INTEGER, NOT NULL, DEFAULT 0)

## Security Implications:
- RLS Status: Unchanged
- Policy Changes: No
- Auth Requirements: None

## Performance Impact:
- Indexes: None added. A new index might be beneficial later if posts are frequently sorted by views.
- Triggers: None
- Estimated Impact: Low. Adding a column with a default value can be slow on very large tables, but is generally fast for most use cases.
*/
ALTER TABLE public.posts
ADD COLUMN view_count INT NOT NULL DEFAULT 0;

COMMENT ON COLUMN public.posts.view_count IS 'The number of times the post has been viewed.';
