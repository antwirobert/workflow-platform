import AppSidebar from "@/components/layout/AppSidebar";
import Topbar from "@/components/layout/Topbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/authStore";
import { Navigate, Outlet } from "react-router";

const ProtectedLayout = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex h-screen w-full flex-col overflow-hidden">
        <Topbar />
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
};

export default ProtectedLayout;
