import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getPost, createPost, updatePost, getCategories } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Terminal, Save, ArrowLeft } from "lucide-react";

const postSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  slug: z.string().min(3, "Slug must be at least 3 characters."),
  content: z.string().optional(),
  excerpt: z.string().max(300, "Excerpt cannot be longer than 300 characters.").optional(),
  status: z.enum(["draft", "published", "scheduled", "archived"]),
  category_id: z.string().nullable().optional(),
});

type PostFormValues = z.infer<typeof postSchema>;

const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

const AdminPostEditor = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isEditMode = !!postId;

  const { data: post, isLoading: isLoadingPost, isError: isErrorPost, error: postError } = useQuery({
    queryKey: ['admin-post', postId],
    queryFn: () => getPost(postId!),
    enabled: isEditMode,
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: getCategories,
  });

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      status: "draft",
      category_id: null,
    },
  });

  useEffect(() => {
    if (isEditMode && post) {
      form.reset({
        title: post.title,
        slug: post.slug,
        content: post.content || "",
        excerpt: post.excerpt || "",
        status: post.status || "draft",
        category_id: post.category_id,
      });
    }
  }, [post, isEditMode, form]);

  const titleValue = form.watch("title");
  useEffect(() => {
    if (titleValue && !form.getValues("slug")) {
      form.setValue("slug", slugify(titleValue), { shouldValidate: true });
    }
  }, [titleValue, form]);

  const mutation = useMutation({
    mutationFn: (data: PostFormValues) => {
      const payload = { ...data, author_id: user!.id };
      return isEditMode ? updatePost(postId!, payload) : createPost(payload);
    },
    onSuccess: () => {
      toast.success(`Post ${isEditMode ? 'updated' : 'created'} successfully!`);
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      navigate("/admin/posts");
    },
    onError: (error) => toast.error(`Failed to ${isEditMode ? 'update' : 'create'} post: ${error.message}`),
  });

  const onSubmit = (data: PostFormValues) => {
    mutation.mutate(data);
  };

  if (isLoadingPost || isLoadingCategories) {
    return <Skeleton className="w-full h-96" />;
  }

  if (isErrorPost) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{postError.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <Helmet>
        <title>{isEditMode ? "Edit Post" : "New Post"} - Admin Panel</title>
      </Helmet>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{isEditMode ? "Edit Post" : "Create New Post"}</h1>
              <p className="text-muted-foreground">Fill in the details for your post.</p>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => navigate('/admin/posts')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Posts
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {mutation.isPending ? "Saving..." : "Save Post"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader><CardTitle>Content</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Your post title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Main Content</FormLabel>
                        <FormControl>
                          <RichTextEditor value={field.value || ''} onChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Excerpt</FormLabel>
                        <FormControl>
                          <Textarea placeholder="A short summary of your post" {...field} rows={4} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader><CardTitle>Details</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="your-post-slug" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(value === 'uncategorized' ? null : value)} 
                          value={field.value ?? 'uncategorized'}
                        >
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="uncategorized">No Category</SelectItem>
                            {categories?.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export default AdminPostEditor;
