import { ReactNode, useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Calendar as CalendarIcon, Bell, Search, Menu, PanelLeftClose, PanelLeft, CheckCircle2, AlertCircle, Megaphone, Percent, Gift, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Calendar } from "@/components/ui/calendar";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/contexts/SidebarContext";
import { HalicKahveLogo } from "@/components/Logo";
import { SearchModal } from "@/components/search/SearchModal";
import { isWithinInterval, format } from "date-fns";
import { tr } from "date-fns/locale";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

const getTitleFromPath = (pathname: string): string => {
  const routes: Record<string, string> = {
    "/": "Dashboard",
    "/customers": "Müşteriler",
    "/campaigns": "Kampanyalar",
    "/team": "Ekip",
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  // Notifications state
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "Yeni Kampanya Oluşturuldu",
      description: '"Hafta Sonu İndirimi" kampanyası başarıyla oluşturuldu ve aktif hale getirildi.',
      time: "5 dakika önce",
      type: "success" as const,
    },
    {
      id: "2",
      title: "Yeni Müşteri Eklendi",
      description: "Ahmet Yılmaz müşteri listesine eklendi.",
      time: "1 saat önce",
      type: "warning" as const,
    },
  ]);

  // Mock active campaigns with dates
  const activeCampaigns = [
    {
      id: "1",
      name: "Yaz İndirimi",
      startDate: new Date(2024, 5, 1), // June 1, 2024
      endDate: new Date(2024, 7, 31), // August 31, 2024
      type: "discount" as const,
    },
    {
      id: "2",
      name: "Sadakat Ödülü x2",
      startDate: new Date(2024, 5, 15), // June 15, 2024
      endDate: new Date(2024, 6, 15), // July 15, 2024
      type: "reward" as const,
    },
  ];

  // Helper function to check if a date is within any campaign range
  const isDateInCampaignRange = (date: Date): boolean => {
    return activeCampaigns.some(campaign => 
      isWithinInterval(date, { start: campaign.startDate, end: campaign.endDate })
    );
  };

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((open) => !open);
      }
      // Close search with Escape
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen]);

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
              className="lg:hidden text-muted-foreground/60 hover:text-muted-foreground hover:bg-transparent rounded-lg w-7 h-7 p-0"
            >
              <Menu className="w-3.5 h-3.5" />
            </Button>
            
            {/* Sidebar Toggle - Desktop */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleDesktopSidebar}
              className="hidden lg:flex text-muted-foreground/60 hover:text-muted-foreground hover:bg-transparent rounded-lg w-7 h-7 p-0"
            >
              {isDesktopSidebarCollapsed ? (
                <PanelLeft className="w-3.5 h-3.5" />
              ) : (
                <PanelLeftClose className="w-3.5 h-3.5" />
              )}
            </Button>
          </div>
          <div className="flex items-center gap-1 lg:gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSearchOpen(true)}
              className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl w-9 h-9 lg:w-10 lg:h-10"
              aria-label="Ara"
            >
              <Search className="w-4 h-4 lg:w-5 lg:h-5" />
            </Button>
            <SearchModal open={isSearchOpen} onOpenChange={setIsSearchOpen} />
            <Popover open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl w-9 h-9 lg:w-10 lg:h-10 relative">
                  <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
                  {notifications.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 lg:top-2 lg:right-2 w-2 h-2 bg-gold rounded-full" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 rounded-xl" align="end">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-foreground">Bildirimler</h3>
                  {notifications.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setNotifications([])}
                      className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      Hepsini Okundu İşaretle
                    </Button>
                  )}
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div className="p-2 space-y-1">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            notification.type === "success" ? "bg-success/10" : "bg-gold/10"
                          }`}>
                            {notification.type === "success" ? (
                              <CheckCircle2 className="w-4 h-4 text-success" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-gold" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">{notification.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notification.description}</p>
                            <p className="text-[10px] text-muted-foreground/70 mt-1.5">{notification.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <Bell className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Bildirim yok</p>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden sm:flex text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl w-9 h-9 lg:w-10 lg:h-10">
                  <CalendarIcon className="w-4 h-4 lg:w-5 lg:h-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-xl" align="end">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold text-sm text-foreground">Aktif Kampanyalar</h3>
                  <p className="text-xs text-muted-foreground mt-1">Geçerli tarih aralıkları</p>
                </div>
                <div className="p-4">
                  <Calendar
                    modifiers={{
                      campaign: (date) => isDateInCampaignRange(date),
                    }}
                    modifiersClassNames={{
                      campaign: "bg-primary/20 border border-primary/40 rounded-md",
                    }}
                    className="rounded-md border-0"
                  />
                </div>
                {activeCampaigns.length > 0 && (
                  <Collapsible defaultOpen={false} className="border-t border-border">
                    <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                      <p className="text-xs font-medium text-muted-foreground">Kampanya Detayları</p>
                      <ChevronUp className="w-3 h-3 text-muted-foreground data-[state=closed]:rotate-180 transition-transform" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 pb-4 space-y-2">
                      {activeCampaigns.map((campaign) => {
                        const Icon = campaign.type === "discount" ? Percent : campaign.type === "reward" ? Gift : Megaphone;
                        return (
                          <div
                            key={campaign.id}
                            className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Icon className="w-3 h-3 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-foreground">{campaign.name}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <CalendarIcon className="w-3 h-3 text-muted-foreground" />
                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                  <span>{format(campaign.startDate, 'd MMM', { locale: tr })}</span>
                                  <span>-</span>
                                  <span>{format(campaign.endDate, 'd MMM', { locale: tr })}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </PopoverContent>
            </Popover>
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
