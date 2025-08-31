import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";

// Sample categories and posts
const categories = [
  { name: "Technology", slug: "technology" },
  { name: "Development", slug: "development" },
  { name: "Sports", slug: "sports" },
  { name: "Lifestyle", slug: "lifestyle" }
];

const samplePosts = [
  {
    id: "1",
    title: "Getting Started with React and TypeScript",
    excerpt: "Learn how to build modern web applications with React and TypeScript...",
    featured_image: "/placeholder.svg",
    slug: "getting-started-react-typescript",
    published_at: "2024-08-30",
    author: { name: "John Doe" },
    categories: [{ name: "Technology", slug: "technology" }],
    tags: [{ name: "React" }, { name: "TypeScript" }]
  },
  {
    id: "2", 
    title: "Best Practices for Web Development",
    excerpt: "Discover the essential practices every web developer should know...",
    featured_image: "/placeholder.svg",
    slug: "best-practices-web-development",
    published_at: "2024-08-29",
    author: { name: "Jane Smith" },
    categories: [{ name: "Development", slug: "development" }],
    tags: [{ name: "Best Practices" }, { name: "Web Dev" }]
  }
];

const Categories = () => {
  const { slug } = useParams();
  const category = categories.find(cat => cat.slug === slug);
  
  const filteredPosts = slug 
    ? samplePosts.filter(post => post.categories.some(cat => cat.slug === slug))
    : samplePosts;

  return (
    <>
      <Helmet>
        <title>{category ? `${category.name} - ` : "Categories - "}ASA Sports Blog</title>
        <meta name="description" content={category ? `Browse all posts in ${category.name} category` : "Browse all categories on ASA Sports Blog"} />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          {category ? (
            <>
              <h1 className="text-4xl font-bold text-foreground mb-8">{category.name}</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold text-foreground mb-8">All Categories</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category) => (
                  <div key={category.slug} className="bg-card rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{category.name}</h3>
                    <p className="text-muted-foreground">Browse all posts in {category.name}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Categories;
