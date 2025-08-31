import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";

// Sample data for demo
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

const Home = () => {
  return (
    <>
      <Helmet>
        <title>ASA Sports Blog - Latest Sports News & Updates</title>
        <meta name="description" content="Stay updated with the latest sports news, analysis, and insights from ASA Sports Blog." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {samplePosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Home;
