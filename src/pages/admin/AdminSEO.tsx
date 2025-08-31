import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";

const AdminSEO = () => {
  return (
    <>
      <Helmet>
        <title>SEO Management - Admin Panel</title>
        <meta name="description" content="Manage SEO settings" />
      </Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">SEO Management</h1>
          <p className="text-muted-foreground">Optimize your blog for search engines</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Global SEO Settings</CardTitle>
              <CardDescription>Set default SEO values for your blog</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-title">Site Title</Label>
                <Input id="site-title" defaultValue="ASA Sports Blog" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-description">Site Description</Label>
                <Textarea 
                  id="site-description" 
                  defaultValue="Your premier destination for comprehensive sports coverage, analysis, and insights."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-keywords">Default Keywords</Label>
                <Input id="site-keywords" defaultValue="sports, news, analysis, blog" />
              </div>
              <Button className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Global Settings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technical SEO</CardTitle>
              <CardDescription>Configure technical SEO features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="robots">Robots.txt Content</Label>
                <Textarea 
                  id="robots" 
                  defaultValue="User-agent: *&#10;Allow: /&#10;&#10;Sitemap: https://example.com/sitemap.xml"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="google-analytics">Google Analytics ID</Label>
                <Input id="google-analytics" placeholder="GA-XXXXXXXXX" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="google-search">Google Search Console</Label>
                <Input id="google-search" placeholder="Verification code" />
              </div>
              <Button className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Technical Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>SEO Performance</CardTitle>
            <CardDescription>Monitor your blog's SEO performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border border-border rounded-lg">
                <h3 className="text-2xl font-bold text-foreground">85</h3>
                <p className="text-muted-foreground">SEO Score</p>
              </div>
              <div className="text-center p-4 border border-border rounded-lg">
                <h3 className="text-2xl font-bold text-foreground">1,234</h3>
                <p className="text-muted-foreground">Indexed Pages</p>
              </div>
              <div className="text-center p-4 border border-border rounded-lg">
                <h3 className="text-2xl font-bold text-foreground">567</h3>
                <p className="text-muted-foreground">Backlinks</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminSEO;
