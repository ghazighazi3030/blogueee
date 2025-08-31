import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getStats } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

const statsData = [
  { name: "Jan", posts: 12, comments: 45, views: 1200 },
  { name: "Feb", posts: 19, comments: 52, views: 1400 },
  { name: "Mar", posts: 15, comments: 38, views: 1100 },
  { name: "Apr", posts: 22, comments: 67, views: 1800 },
  { name: "May", posts: 18, comments: 44, views: 1300 },
  { name: "Jun", posts: 25, comments: 71, views: 2100 },
];

const AdminDashboard = () => {
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: getStats,
  });

  return (
    <>
      <Helmet>
        <title>Dashboard - Admin Panel</title>
        <meta name="description" content="Admin dashboard for ASA Sports Blog" />
      </Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your blog.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Posts</CardDescription>
              {isLoading ? <Skeleton className="h-8 w-20 mt-1" /> : <CardTitle className="text-3xl">{stats?.postCount ?? 0}</CardTitle>}
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">All-time posts</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Comments</CardDescription>
              {isLoading ? <Skeleton className="h-8 w-20 mt-1" /> : <CardTitle className="text-3xl">{stats?.commentCount ?? 0}</CardTitle>}
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">All-time comments</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Views</CardDescription>
              {isLoading ? <Skeleton className="h-8 w-24 mt-1" /> : <CardTitle className="text-3xl">{stats?.totalViews ?? 0}</CardTitle>}
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">All-time views</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Users</CardDescription>
              {isLoading ? <Skeleton className="h-8 w-16 mt-1" /> : <CardTitle className="text-3xl">{stats?.userCount ?? 0}</CardTitle>}
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Statistics</CardTitle>
              <CardDescription>Posts, comments, and views over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="posts" fill="hsl(var(--primary))" name="Posts" />
                  <Bar dataKey="comments" fill="hsl(var(--secondary))" name="Comments" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions on your blog</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">New post published</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Comment approved</p>
                    <p className="text-xs text-muted-foreground">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">New user registered</p>
                    <p className="text-xs text-muted-foreground">6 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
