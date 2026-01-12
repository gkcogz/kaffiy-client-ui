import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Calendar, Bell, Search, Menu, PanelLeftClose, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/contexts/SidebarContext";
import { HalicKahveLogo } from "@/components/Logo";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

const getTitleFromPath = (pathname: string): string => {
  const routes: Record<string, string> = {
    "/": "Dashboard",
    "/customers": "Müşteriler",
    "/campaigns": "Kampanyalar",
    "/rewards": "Ödüller",
    "/settings": "Ayarlar",
    "/profile": "Profil",
  };
  return routes[pathname] || "Dashboard";
};

export const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const {
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    isDesktopSidebarCollapsed,
    setIsDesktopSidebarCollapsed,
    toggleDesktopSidebar,
    toggleMobileSidebar,
  } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const pageTitle = title || getTitleFromPath(location.pathname);

  return (
    <div className="flex h-screen bg-background premium-gradient overflow-hidden">
      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:flex flex-col h-full transition-all duration-300 ease-in-out flex-shrink-0",
        isDesktopSidebarCollapsed ? "w-0 overflow-hidden" : "w-56"
      )}>
        <div className="w-56 h-full">
          <Sidebar />
        </div>
      </div>

      {/* Mobile/Tablet Sidebar - Sheet */}
      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <SheetContent side="left" className="p-0 w-72">
          <Sidebar />
        </SheetContent>
      </Sheet>
      
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 lg:h-[72px] border-b border-border/50 bg-card/60 backdrop-blur-xl flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10">
          <div className="flex items-center gap-3 lg:gap-4">
            {/* Menu Button - Mobile/Tablet */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMobileSidebar}
              className="lg:hidden text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl"
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            {/* Sidebar Toggle - Desktop */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleDesktopSidebar}
              className="hidden lg:flex text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl"
            >
              {isDesktopSidebarCollapsed ? (
                <PanelLeft className="w-5 h-5" />
              ) : (
                <PanelLeftClose className="w-5 h-5" />
              )}
            </Button>
            
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-success shadow-sm" />
              <span className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-gold shadow-sm" />
              <span className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-destructive/80 shadow-sm" />
            </div>
          </div>
          <div className="flex items-center gap-1 lg:gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl w-9 h-9 lg:w-10 lg:h-10">
              <Search className="w-4 h-4 lg:w-5 lg:h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl w-9 h-9 lg:w-10 lg:h-10 relative">
              <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="absolute top-1.5 right-1.5 lg:top-2 lg:right-2 w-2 h-2 bg-gold rounded-full" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:flex text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl w-9 h-9 lg:w-10 lg:h-10">
              <Calendar className="w-4 h-4 lg:w-5 lg:h-5" />
            </Button>
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-muted/50 transition-colors group"
            >
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                <HalicKahveLogo className="w-5 h-5" />
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-medium text-foreground">Halic Kahve</p>
                <a
                  href="https://www.halickahve.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-[10px] text-muted-foreground hover:text-foreground transition-colors underline"
                >
                  halickahve.com
                </a>
              </div>
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
