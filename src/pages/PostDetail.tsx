import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";

// Sample post data
const samplePost = {
  id: "1",
  title: "Getting Started with React and TypeScript",
  content: `
    <p>React and TypeScript make a powerful combination for building modern web applications. In this comprehensive guide, we'll explore how to set up and work with both technologies.</p>
    
    <h2>Why Use TypeScript with React?</h2>
    <p>TypeScript provides static type checking, which helps catch errors early in development and improves code maintainability. When combined with React, it offers several benefits:</p>
    
    <ul>
      <li>Better IDE support with autocomplete and refactoring</li>
      <li>Catch type-related bugs at compile time</li>
      <li>Improved code documentation through type definitions</li>
      <li>Enhanced team collaboration with clear interfaces</li>
    </ul>
    
    <h2>Setting Up Your Project</h2>
    <p>Getting started with React and TypeScript is easier than ever. You can use Create React App with TypeScript template or set up Vite for a faster development experience.</p>
    
    <p>This is just the beginning of your journey with React and TypeScript. There's much more to explore and learn!</p>
  `,
  featured_image: "/placeholder.svg",
  slug: "getting-started-react-typescript",
  published_at: "2024-08-30",
  author: { name: "John Doe", avatar: "/placeholder.svg" },
  categories: [{ name: "Technology", slug: "technology" }],
  tags: [{ name: "React" }, { name: "TypeScript" }, { name: "Web Development" }]
};

const PostDetail = () => {
  const { slug } = useParams();
  const post = samplePost; // In a real app, you'd fetch based on slug

  return (
    <>
      <Helmet>
        <title>{post.title} - ASA Sports Blog</title>
        <meta name="description" content={`Read ${post.title} on ASA Sports Blog`} />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <article className="max-w-4xl mx-auto">
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">{post.title}</h1>
              <div className="flex items-center gap-4 text-muted-foreground mb-4">
                <span>By {post.author.name}</span>
                <span>•</span>
                <span>{new Date(post.published_at).toLocaleDateString()}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {post.categories.map((category) => (
                  <Badge key={category.slug} variant="secondary">
                    {category.name}
                  </Badge>
                ))}
                {post.tags.map((tag) => (
                  <Badge key={tag.name} variant="outline">
                    {tag.name}
                  </Badge>
                ))}
              </div>
              <img 
                src={post.featured_image} 
                alt={post.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </header>
            
            <div 
              className="prose prose-lg max-w-none text-foreground dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            <footer className="mt-12 pt-8 border-t border-border">
              <div className="flex items-center gap-4">
                <img 
                  src={post.author.avatar} 
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-foreground">{post.author.name}</h4>
                  <p className="text-muted-foreground">Author at ASA Sports Blog</p>
                </div>
              </div>
            </footer>
          </article>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default PostDetail;
