import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from './AdminLayout';
import { Skeleton } from '@/components/ui/skeleton';

const AdminRouteLayout = () => {
    const { session, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !session) {
            navigate('/admin', { replace: true });
        }
    }, [session, loading, navigate]);

    // If we are loading, or if we are not loading but have no session yet
    // (and are about to be redirected), show the loader.
    // This prevents the component from returning `null` and triggering the 404 route.
    if (loading || !session) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                </div>
            </div>
        );
    }

    // Only if we are done loading AND we have a session, render the layout.
    return (
        <AdminLayout>
            <Outlet />
        </AdminLayout>
    );
}

export default AdminRouteLayout;
