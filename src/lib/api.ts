import { supabase } from "@/integrations/supabase/client";
import type { AuthCredentials } from "@supabase/supabase-js";
import type { TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

// Auth
export const signIn = (credentials: AuthCredentials) => {
  return supabase.auth.signInWithPassword(credentials);
};

export const signOut = () => {
  return supabase.auth.signOut();
};

export const getSession = () => {
  return supabase.auth.getSession();
};

export const onAuthStateChange = (callback: (event: string, session: import("@supabase/supabase-js").Session | null) => void) => {
    return supabase.auth.onAuthStateChange(callback);
}

// Dashboard
export const getStats = async () => {
    const { count: postCount, error: postError } = await supabase.from('posts').select('*', { count: 'exact', head: true });
    const { count: commentCount, error: commentError } = await supabase.from('comments').select('*', { count: 'exact', head: true });
    const { count: userCount, error: userError } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

    if (postError || commentError || userError) {
        console.error("Error fetching stats:", postError || commentError || userError);
        throw new Error('Failed to fetch stats');
    }

    const { data: postsData, error: postsError } = await supabase.from('posts').select('view_count');
    if (postsError) {
        console.error("Error fetching post views:", postsError);
        throw new Error(postsError.message);
    }
    const totalViews = postsData.reduce((acc, post) => acc + (post.view_count || 0), 0);

    return { postCount, commentCount, userCount, totalViews };
};

// Posts
export const getPosts = async () => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, author:profiles(full_name)")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

export const getPost = async (id: string) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, author:profiles(*), category:categories(*)")
    .eq("id", id)
    .single();
  
  if (error) throw new Error(error.message);
  return data;
};

export const createPost = async (post: TablesInsert<'posts'>) => {
  const { data, error } = await supabase.from('posts').insert(post).select().single();
  if (error) throw new Error(error.message);
  return data;
};

export const updatePost = async (id: string, post: TablesUpdate<'posts'>) => {
  const { data, error } = await supabase.from('posts').update(post).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data;
};

export const deletePost = async (id: string) => {
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return { success: true };
};


// Categories
export const getCategories = async () => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
};

export const createCategory = async (category: TablesInsert<'categories'>) => {
  const { data, error } = await supabase.from('categories').insert(category).select().single();
  if (error) throw new Error(error.message);
  return data;
};

export const updateCategory = async (id: string, category: TablesUpdate<'categories'>) => {
  const { data, error } = await supabase.from('categories').update(category).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data;
};

export const deleteCategory = async (id: string) => {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return { success: true };
};


// Comments
export const getComments = async () => {
  const { data, error } = await supabase
    .from("comments")
    .select("*, post:posts(title)")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

// Users
export const getUsers = async () => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

export const updateUser = async (id: string, user: TablesUpdate<'profiles'>) => {
  const { data, error } = await supabase.from('profiles').update(user).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data;
};

export const deleteUser = async (id: string) => {
  const { error } = await supabase.rpc('delete_user', { user_id_to_delete: id });
  if (error) throw new Error(error.message);
  return { success: true };
};


// Media
export const getMedia = async () => {
  const { data, error } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};
