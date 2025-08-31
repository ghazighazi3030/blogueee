import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Eye, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getComments } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const AdminComments = () => {
  const { data: comments, isLoading, isError, error } = useQuery({
    queryKey: ['admin-comments'],
    queryFn: getComments
  });

  const CommentSkeleton = () => (
    <div className="p-4 border border-border rounded-lg space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="space-y-1">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="flex gap-1">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Comments Management - Admin Panel</title>
        <meta name="description" content="Manage blog comments" />
      </Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Comments</h1>
          <p className="text-muted-foreground">Moderate and manage user comments</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Comments</CardTitle>
            <CardDescription>Review and moderate user comments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading && Array.from({ length: 3 }).map((_, i) => <CommentSkeleton key={i} />)}
              {isError && (
                <Alert variant="destructive">
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
              )}
              {comments?.map((comment) => (
                <div key={comment.id} className="p-4 border border-border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <h4 className="font-semibold text-foreground">{comment.author_name}</h4>
                        <p className="text-sm text-muted-foreground">{comment.author_email}</p>
                      </div>
                      <Badge 
                        variant={
                          comment.status === "approved" ? "default" :
                          comment.status === "pending" ? "secondary" : "destructive"
                        }
                      >
                        {comment.status}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      {comment.status === "pending" && (
                        <>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-foreground mb-3">{comment.content}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>On: {comment.post?.title || 'a post'}</span>
                    <span>•</span>
                    <span>{new Date(comment.created_at || Date.now()).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminComments;
