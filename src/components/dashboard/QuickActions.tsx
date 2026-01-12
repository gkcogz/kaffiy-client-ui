import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, TrendingDown, Users, Coffee, QrCode } from "lucide-react";
import { NewCampaignModal } from "./NewCampaignModal";
import { QRVerificationModal } from "./QRVerificationModal";
import { cn } from "@/lib/utils";

export const QuickActions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  // Mock data - geçen haftanın aynı günü verileri
  const stats = {
    visitors: {
      today: 47,
      lastWeek: 42,
    },
    rewards: {
      today: 5,
      lastWeek: 3,
    },
    qrScans: {
      today: 31,
      lastWeek: 28,
    },
  };

  const visitorsChange = ((stats.visitors.today - stats.visitors.lastWeek) / stats.visitors.lastWeek) * 100;
  const rewardsChange = ((stats.rewards.today - stats.rewards.lastWeek) / stats.rewards.lastWeek) * 100;
  const qrScansChange = ((stats.qrScans.today - stats.qrScans.lastWeek) / stats.qrScans.lastWeek) * 100;

  const isVisitorsPositive = visitorsChange >= 0;
  const isRewardsPositive = rewardsChange >= 0;
  const isQRScansPositive = qrScansChange >= 0;

  return (
    <>
      <div className="space-y-3">
        {/* Today's Quick Summary */}
        <div className="bg-gradient-to-br from-sage/10 via-sage/5 to-transparent rounded-2xl p-4 border border-sage/20">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-sage/20 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-sage" />
            </div>
            <span className="text-sm font-semibold text-foreground">Bugünün Özeti</span>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-background/60 rounded-xl p-3">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Users className="w-3.5 h-3.5 text-sage" />
                <span className="text-lg font-bold text-foreground">47</span>
              </div>
              <p className="text-[10px] text-muted-foreground text-center mb-1.5">Ziyaretçi</p>
              <div className={cn(
                "flex items-center justify-center gap-1 text-[9px] font-medium",
                isVisitorsPositive ? "text-success" : "text-destructive"
              )}>
                {isVisitorsPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>Geçen haftaya göre {Math.abs(visitorsChange).toFixed(0)}% {isVisitorsPositive ? "iyi" : "kötü"}</span>
              </div>
            </div>
            <div className="bg-background/60 rounded-xl p-3">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <QrCode className="w-3.5 h-3.5 text-primary" />
                <span className="text-lg font-bold text-foreground">31</span>
              </div>
              <p className="text-[10px] text-muted-foreground text-center mb-1.5">QR Tarama</p>
              <div className={cn(
                "flex items-center justify-center gap-1 text-[9px] font-medium",
                isQRScansPositive ? "text-success" : "text-destructive"
              )}>
                {isQRScansPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>Geçen haftaya göre {Math.abs(qrScansChange).toFixed(0)}% {isQRScansPositive ? "iyi" : "kötü"}</span>
              </div>
            </div>
            <div className="bg-background/60 rounded-xl p-3">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Coffee className="w-3.5 h-3.5 text-gold" />
                <span className="text-lg font-bold text-foreground">5</span>
              </div>
              <p className="text-[10px] text-muted-foreground text-center mb-1.5">Ödül Verildi</p>
              <div className={cn(
                "flex items-center justify-center gap-1 text-[9px] font-medium",
                isRewardsPositive ? "text-success" : "text-destructive"
              )}>
                {isRewardsPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>Geçen haftaya göre {Math.abs(rewardsChange).toFixed(0)}% {isRewardsPositive ? "iyi" : "kötü"}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons Row */}
        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 rounded-xl h-11 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Kampanya
          </Button>
          
          <Button 
            onClick={() => setIsQRModalOpen(true)}
            variant="outline"
            className="gap-2 rounded-xl h-11 text-sm font-medium border-primary/30 text-primary hover:bg-primary/10 hover:text-primary"
          >
            <QrCode className="w-4 h-4" />
            QR Oku
          </Button>
        </div>
      </div>
      
      <NewCampaignModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      <QRVerificationModal open={isQRModalOpen} onOpenChange={setIsQRModalOpen} />
    </>
  );
};
