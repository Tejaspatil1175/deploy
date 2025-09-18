import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Bell, Settings, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
DropdownMenu,
DropdownMenuContent,
DropdownMenuItem,
DropdownMenuSeparator,
DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { logout, admin } = useAuth();

  const handleLogout = () => {
    logout();
  };
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        
        <div className="flex flex-1 flex-col">
          {/* Top Header */}
          <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-card px-4 shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-sidebar-foreground" />
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-foreground">DM</span>
                </div>
                <h1 className="text-lg font-semibold text-foreground">Disaster Management Command</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 h-2 w-2 bg-danger rounded-full animate-pulse"></span>
            </Button>
            <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
            </Button>
              
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
            <User className="h-4 w-4" />
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
            <p className="text-sm font-medium">{admin?.name || 'Admin User'}</p>
            <p className="text-xs text-muted-foreground">{admin?.email || 'admin@example.com'}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
            </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};