import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Image, Video, File, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getMedia } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const getFileType = (mimeType: string) => {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  return "document";
};

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const AdminMedia = () => {
  const { data: media, isLoading, isError, error } = useQuery({
    queryKey: ['admin-media'],
    queryFn: getMedia
  });

  const MediaSkeleton = () => (
    <div className="border border-border rounded-lg overflow-hidden">
      <Skeleton className="aspect-square bg-muted" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Media Library - Admin Panel</title>
        <meta name="description" content="Manage media files" />
      </Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Media Library</h1>
            <p className="text-muted-foreground">Upload and manage your media files</p>
          </div>
          <Button className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Files
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Media</CardTitle>
            <CardDescription>Organize your images, videos, and documents</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => <MediaSkeleton key={i} />)}
              </div>
            )}
            {isError && (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}
            {media && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {media.map((file) => {
                  const fileType = getFileType(file.mime_type);
                  return (
                    <div key={file.id} className="border border-border rounded-lg overflow-hidden">
                      <div className="aspect-square bg-muted flex items-center justify-center">
                        {fileType === "image" ? (
                          <img src={file.url} alt={file.alt_text || file.filename} className="w-full h-full object-cover" />
                        ) : fileType === "video" ? (
                          <Video className="h-12 w-12 text-muted-foreground" />
                        ) : (
                          <File className="h-12 w-12 text-muted-foreground" />
                        )}
                      </div>
                      <div className="p-3">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-foreground text-sm truncate" title={file.filename}>{file.filename}</h4>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive flex-shrink-0">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <p>{formatBytes(file.size_bytes)}</p>
                          <p>{new Date(file.created_at || Date.now()).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminMedia;
