import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About - ASA Sports Blog</title>
        <meta name="description" content="Learn more about ASA Sports Blog and our mission to bring you the latest sports news and insights." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-6">About ASA Sports Blog</h1>
            <div className="prose prose-lg text-muted-foreground">
              <p className="mb-4">
                Welcome to ASA Sports Blog, your premier destination for comprehensive sports coverage, 
                analysis, and insights. We are dedicated to bringing you the latest news, expert opinions, 
                and in-depth coverage from the world of sports.
              </p>
              <p className="mb-4">
                Our team of experienced sports journalists and analysts work around the clock to provide 
                you with accurate, timely, and engaging content across all major sports leagues and events.
              </p>
              <p>
                Whether you're a casual fan or a sports enthusiast, ASA Sports Blog is your trusted source 
                for staying informed and entertained in the ever-evolving world of sports.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default About;
