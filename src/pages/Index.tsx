import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { VisitsChart } from "@/components/dashboard/VisitsChart";
import { TrialProgress } from "@/components/dashboard/TrialProgress";
import { ChurnAlert } from "@/components/dashboard/ChurnAlert";
import { LockedChurnAlert } from "@/components/dashboard/LockedChurnAlert";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { WeeklyStatsCard } from "@/components/dashboard/WeeklyStatsCard";
import { ActiveCampaignsCard } from "@/components/dashboard/ActiveCampaignsCard";
import { LiveFeed } from "@/components/dashboard/LiveFeed";
import { Chatbot } from "@/components/dashboard/Chatbot";
import { BaristaView } from "@/components/barista/BaristaView";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePremium } from "@/contexts/PremiumContext";
import { useDashboardCards } from "@/contexts/DashboardCardsContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const isMobile = useIsMobile();
  const { isPremium } = usePremium();
  const { getCardVisibility } = useDashboardCards();
  const { isDesktopSidebarCollapsed, toggleDesktopSidebar, toggleMobileSidebar } = useSidebar();
  const navigate = useNavigate();

  const handleSettingsClick = () => {
    navigate("/settings?tab=dashboard");
  };

  // Mobile: Show Barista View
  if (isMobile) {
    return <BaristaView />;
  }

  // Desktop & Tablet: Show Full Dashboard
  return (
    <DashboardLayout>
      {/* Settings Shortcut - Fixed top right */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSettingsClick}
        className={cn(
          "fixed top-20 right-4 z-50 w-8 h-8 rounded-full",
          "bg-background/80 backdrop-blur-sm border border-border/50",
          "text-muted-foreground hover:text-foreground hover:bg-muted/50",
          "shadow-sm transition-all duration-200",
          "lg:top-24 lg:right-6"
        )}
        aria-label="Dashboard Ayarları"
      >
        <Settings className="w-4 h-4" />
      </Button>

      <div className="space-y-4 lg:space-y-5">
        
        {/* Trial Progress Banner - Show at very top for non-premium users */}
        {!isPremium && (
          <div className="lg:hidden">
            <TrialProgress current={47} limit={50} />
          </div>
        )}
        
        {/* Main Grid - Responsive for tablet */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5">
          
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-4 lg:space-y-5">
            {/* Main Stats Card */}
            {getCardVisibility("card-visits-chart") && <VisitsChart />}

            {/* Tablet: Important widgets row */}
            {(getCardVisibility("card-quick-actions") || getCardVisibility("card-weekly-stats")) && (
              <div className="grid grid-cols-2 gap-4 lg:hidden">
                {getCardVisibility("card-quick-actions") && <QuickActions />}
                {getCardVisibility("card-weekly-stats") && (
                  <WeeklyStatsCard 
                    predictedVisits={120}
                    confidence={85}
                    peakDay="Cumartesi"
                    peakHour="14:00-16:00"
                  />
                )}
              </div>
            )}

            {/* Active Campaigns with Live Feed - Side by side */}
            {getCardVisibility("card-active-campaigns") && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 items-stretch">
                <ActiveCampaignsCard />
                <LiveFeed />
              </div>
            )}

            {/* Churn Alert - Premium only, otherwise show locked version */}
            {getCardVisibility("card-churn-alert") && (isPremium ? <ChurnAlert /> : <LockedChurnAlert />)}
          </div>

          {/* Right Column - Desktop Only Sidebar */}
          <div className="hidden lg:block lg:col-span-4 space-y-5">
            {/* Trial Progress - Top priority for non-premium */}
            {!isPremium && getCardVisibility("card-trial-progress") && <TrialProgress current={47} limit={50} />}
            
            {/* Quick Actions */}
            {getCardVisibility("card-quick-actions") && <QuickActions />}
            
            {/* Weekly Stats Card */}
            {getCardVisibility("card-weekly-stats") && (
              <WeeklyStatsCard 
                predictedVisits={120}
                confidence={85}
                peakDay="Cumartesi"
                peakHour="14:00-16:00"
              />
            )}
            
          </div>
        </div>
      </div>

      {/* Chatbot - Fixed bottom right */}
      <Chatbot />
    </DashboardLayout>
  );
};

export default Index;