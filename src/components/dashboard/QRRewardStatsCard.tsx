import { useState } from "react";
import { QrCode, Gift, TrendingUp, TrendingDown, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type PeriodType = "daily" | "weekly" | "monthly";

const statsData = {
  daily: {
    visits: { value: 45, previous: 40, label: "Ziyaret" },
    qrGiven: { value: 31, previous: 28, label: "QR Verildi" },
    rewardUsed: { value: 5, previous: 3, label: "Ödül Kullanıldı" },
  },
  weekly: {
    visits: { value: 312, previous: 285, label: "Ziyaret" },
    qrGiven: { value: 218, previous: 195, label: "QR Verildi" },
    rewardUsed: { value: 34, previous: 28, label: "Ödül Kullanıldı" },
  },
  monthly: {
    visits: { value: 1248, previous: 1120, label: "Ziyaret" },
    qrGiven: { value: 892, previous: 756, label: "QR Verildi" },
    rewardUsed: { value: 142, previous: 128, label: "Ödül Kullanıldı" },
  },
};

const StatCard = ({ 
  data, 
  icon: Icon, 
  iconColor, 
  gradientColor,
  iconTextColor
}: { 
  data: { value: number; previous: number; label: string };
  icon: React.ElementType;
  iconColor: string;
  gradientColor: string;
  iconTextColor: string;
}) => {
  const change = ((data.value - data.previous) / data.previous) * 100;
  const isPositive = change >= 0;

  return (
    <div className={cn(
      "rounded-xl p-4 border",
      gradientColor
    )}>
      <div className="flex items-center gap-2 mb-2">
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center",
          iconColor
        )}>
          <Icon className={cn("w-4 h-4", iconTextColor)} />
        </div>
        <span className="text-xs font-medium text-muted-foreground">{data.label}</span>
      </div>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-3xl font-bold text-foreground">{data.value}</span>
        <div className={cn(
          "flex items-center gap-1 text-xs font-medium",
          isPositive ? "text-success" : "text-destructive"
        )}>
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          <span>{Math.abs(change).toFixed(1)}%</span>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground">Önceki: {data.previous}</p>
    </div>
  );
};

export const QRRewardStatsCard = () => {
  const [period, setPeriod] = useState<PeriodType>("daily");

  return (
    <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-4 lg:p-5">
      <Tabs value={period} onValueChange={(value) => setPeriod(value as PeriodType)} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">QR ve Ödül İstatistikleri</h3>
          <div className="flex items-center bg-muted/40 rounded-full p-0.5">
            <button
              onClick={() => setPeriod("daily")}
              className={cn(
                "w-7 h-7 rounded-full text-xs font-semibold transition-all duration-200",
                period === "daily"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              G
            </button>
            <button
              onClick={() => setPeriod("weekly")}
              className={cn(
                "w-7 h-7 rounded-full text-xs font-semibold transition-all duration-200",
                period === "weekly"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              H
            </button>
            <button
              onClick={() => setPeriod("monthly")}
              className={cn(
                "w-7 h-7 rounded-full text-xs font-semibold transition-all duration-200",
                period === "monthly"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              A
            </button>
          </div>
        </div>

        <TabsContent value="daily" className="mt-4 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <StatCard
              data={statsData.daily.visits}
              icon={Users}
              iconColor="bg-sage/20"
              gradientColor="bg-gradient-to-br from-sage/10 via-sage/5 to-transparent border-sage/20"
              iconTextColor="text-sage"
            />
            <StatCard
              data={statsData.daily.qrGiven}
              icon={QrCode}
              iconColor="bg-primary/20"
              gradientColor="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20"
              iconTextColor="text-primary"
            />
            <StatCard
              data={statsData.daily.rewardUsed}
              icon={Gift}
              iconColor="bg-gold/20"
              gradientColor="bg-gradient-to-br from-gold/10 via-gold/5 to-transparent border-gold/20"
              iconTextColor="text-gold"
            />
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="mt-4 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <StatCard
              data={statsData.weekly.visits}
              icon={Users}
              iconColor="bg-sage/20"
              gradientColor="bg-gradient-to-br from-sage/10 via-sage/5 to-transparent border-sage/20"
              iconTextColor="text-sage"
            />
            <StatCard
              data={statsData.weekly.qrGiven}
              icon={QrCode}
              iconColor="bg-primary/20"
              gradientColor="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20"
              iconTextColor="text-primary"
            />
            <StatCard
              data={statsData.weekly.rewardUsed}
              icon={Gift}
              iconColor="bg-gold/20"
              gradientColor="bg-gradient-to-br from-gold/10 via-gold/5 to-transparent border-gold/20"
              iconTextColor="text-gold"
            />
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="mt-4 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <StatCard
              data={statsData.monthly.visits}
              icon={Users}
              iconColor="bg-sage/20"
              gradientColor="bg-gradient-to-br from-sage/10 via-sage/5 to-transparent border-sage/20"
              iconTextColor="text-sage"
            />
            <StatCard
              data={statsData.monthly.qrGiven}
              icon={QrCode}
              iconColor="bg-primary/20"
              gradientColor="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20"
              iconTextColor="text-primary"
            />
            <StatCard
              data={statsData.monthly.rewardUsed}
              icon={Gift}
              iconColor="bg-gold/20"
              gradientColor="bg-gradient-to-br from-gold/10 via-gold/5 to-transparent border-gold/20"
              iconTextColor="text-gold"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
