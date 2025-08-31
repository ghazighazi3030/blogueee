import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    excerpt: string;
    featured_image: string;
    slug: string;
    published_at: string;
    author: { name: string };
    categories: { name: string; slug: string }[];
    tags: { name: string }[];
  };
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={post.featured_image} 
          alt={post.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          {post.categories.map((category) => (
            <Badge key={category.slug} variant="secondary" className="bg-primary text-primary-foreground">
              {category.name}
            </Badge>
          ))}
        </div>
      </div>
      
      <CardHeader>
        <CardTitle className="line-clamp-2">
          <Link 
            to={`/post/${post.slug}`} 
            className="hover:text-primary transition-colors"
          >
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription className="line-clamp-3">
          {post.excerpt}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>By {post.author.name}</span>
          <span>{new Date(post.published_at).toLocaleDateString()}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-3">
          {post.tags.slice(0, 3).map((tag) => (
            <Badge key={tag.name} variant="outline" className="text-xs">
              {tag.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
