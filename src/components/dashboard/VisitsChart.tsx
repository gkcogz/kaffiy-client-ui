import { useState } from "react";
import { TrendingUp, Maximize2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Area, XAxis, Bar, ComposedChart, ReferenceLine } from "recharts";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

type PeriodType = "daily" | "weekly" | "monthly";
type ChartType = "donut" | "distribution" | null;

// Data for different periods
const periodData = {
  daily: {
    label: "Bugünkü",
    compareLabel: "Dün",
    distributionLabel: "Günlük Dağılım",
    visits: 45,
    compareVisits: 40,
    returning: 70,
    new: 30,
    chartData: [
      { time: "8", visits: 3, current: 0 },
      { time: "10", visits: 6, current: 0 },
      { time: "12", visits: 8, current: 0 },
      { time: "14", visits: 11, current: 0, isPeak: true },
      { time: "16", visits: 9, current: 0 },
      { time: "18", visits: 5, current: 0 },
      { time: "Şu an", visits: 0, current: 3 },
    ]
  },
  weekly: {
    label: "Bu Haftaki",
    compareLabel: "Geçen Hafta",
    distributionLabel: "Haftalık Dağılım",
    visits: 312,
    compareVisits: 285,
    returning: 65,
    new: 35,
    chartData: [
      { time: "Pzt", visits: 42, current: 0 },
      { time: "Sal", visits: 38, current: 0 },
      { time: "Çar", visits: 45, current: 0 },
      { time: "Per", visits: 52, current: 0, isPeak: true },
      { time: "Cum", visits: 48, current: 0 },
      { time: "Cmt", visits: 55, current: 0 },
      { time: "Paz", visits: 32, current: 0 },
    ]
  },
  monthly: {
    label: "Bu Ayki",
    compareLabel: "Geçen Ay",
    distributionLabel: "Aylık Dağılım",
    visits: 1248,
    compareVisits: 1120,
    returning: 72,
    new: 28,
    chartData: [
      { time: "1.H", visits: 280, current: 0 },
      { time: "2.H", visits: 320, current: 0, isPeak: true },
      { time: "3.H", visits: 290, current: 0 },
      { time: "4.H", visits: 358, current: 0 },
    ]
  }
};

const COLORS = ["hsl(35, 30%, 45%)", "hsl(35, 35%, 75%)"];

export const VisitsChart = () => {
  const [period, setPeriod] = useState<PeriodType>("daily");
  const [expandedChart, setExpandedChart] = useState<ChartType>(null);
  
  const data = periodData[period];
  const percentChange = Math.round(((data.visits - data.compareVisits) / data.compareVisits) * 100);
  const isPositive = percentChange >= 0;
  
  const donutData = [
    { name: "Geri Dönen", value: data.returning },
    { name: "Yeni", value: data.new },
  ];

  const periodLabels: Record<PeriodType, string> = {
    daily: "G",
    weekly: "H",
    monthly: "A"
  };

  return (
    <div className="stat-card">
      {/* Period Toggle - Top Right */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center bg-muted/40 rounded-full p-0.5">
          {(Object.keys(periodLabels) as PeriodType[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "w-7 h-7 rounded-full text-xs font-semibold transition-all duration-200",
                period === p
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 lg:gap-10">
        {/* Column 1: Visits */}
        <div className="flex flex-col justify-center">
          <p className="text-xs lg:text-sm font-medium text-muted-foreground tracking-wide uppercase mb-3">
            {data.label} Ziyaretler
          </p>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl lg:text-5xl font-semibold text-foreground">{data.visits}</span>
            <div className={`flex items-center gap-0.5 px-2 py-1 rounded-full text-xs lg:text-sm font-medium ${
              isPositive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
            }`}>
              <TrendingUp className={`w-3.5 h-3.5 ${!isPositive && "rotate-180"}`} />
              <span>{isPositive ? "+" : ""}{percentChange}%</span>
            </div>
          </div>
          <p className="text-xs lg:text-sm text-muted-foreground mt-2">
            {data.compareLabel}: <span className="font-medium text-foreground">{data.compareVisits}</span>
          </p>
        </div>

        {/* Column 2: Donut Chart */}
        <div 
          onClick={() => setExpandedChart("donut")}
          className="cursor-pointer group relative flex flex-col justify-center"
        >
          <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <Maximize2 className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-xs lg:text-sm font-medium text-muted-foreground tracking-wide uppercase mb-3">
            Dönen / Yeni
          </p>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 lg:w-20 lg:h-20 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={18}
                    outerRadius={32}
                    paddingAngle={2}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {donutData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <p className="text-xl lg:text-2xl font-semibold text-foreground">{data.returning}/{data.new}</p>
              <p className="text-xs lg:text-sm text-muted-foreground">%</p>
            </div>
          </div>
        </div>

        {/* Column 3: Distribution Chart */}
        <div 
          onClick={() => setExpandedChart("distribution")}
          className="cursor-pointer group relative"
        >
          <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <Maximize2 className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-xs lg:text-sm font-medium text-muted-foreground tracking-wide uppercase mb-3">
            {data.distributionLabel}
          </p>
          <div className="h-20 lg:h-24">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data.chartData} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="miniVisitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(72, 22%, 38%)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(72, 22%, 38%)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="time" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'hsl(25, 12%, 55%)' }}
                  interval={period === "monthly" ? 0 : 1}
                  dy={4}
                />
                <Area 
                  type="monotone"
                  dataKey="visits"
                  stroke="hsl(72, 22%, 38%)"
                  strokeWidth={2}
                  fill="url(#miniVisitGradient)"
                  dot={(props) => {
                    const { cx, cy, payload } = props;
                    if (payload.isPeak) {
                      return (
                        <circle cx={cx} cy={cy} r={5} fill="hsl(35, 30%, 55%)" stroke="white" strokeWidth={2} />
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="current"
                  fill="hsl(35, 30%, 55%)"
                  radius={[3, 3, 0, 0]}
                  barSize={12}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Expanded Chart Drawer */}
      <Drawer open={expandedChart !== null} onOpenChange={(open) => !open && setExpandedChart(null)}>
        <DrawerContent className="bg-background border-t border-border max-h-[70vh]">
          <div className="mx-auto w-full max-w-lg">
            <div className="flex justify-center pt-4 pb-2">
              <div className="w-12 h-1.5 rounded-full bg-muted-foreground/20" />
            </div>

            <div className="px-6 pb-8">
              {/* Donut Chart Expanded */}
              {expandedChart === "donut" && (
                <div className="animate-fade-in">
                  <p className="text-[11px] font-medium text-muted-foreground tracking-wide uppercase mb-2">
                    Geri Dönen vs Yeni Müşteriler
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-3xl font-bold text-foreground">
                      {data.returning}% <span className="text-muted-foreground font-normal text-xl">/</span> <span className="text-xl text-muted-foreground">{data.new}%</span>
                    </p>
                  </div>

                  <div className="h-48 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={donutData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          {donutData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex justify-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[0] }} />
                      <span className="text-sm text-muted-foreground">Geri Dönen</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[1] }} />
                      <span className="text-sm text-muted-foreground">Yeni</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Distribution Chart Expanded */}
              {expandedChart === "distribution" && (
                <div className="animate-fade-in">
                  <p className="text-[11px] font-medium text-muted-foreground tracking-wide uppercase mb-1">
                    Tekil Ziyaretler
                  </p>
                  <p className="text-xl font-semibold text-foreground mb-4">
                    {data.distributionLabel}
                  </p>
                  
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={data.chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="expandedVisitGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(72, 22%, 38%)" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="hsl(72, 22%, 38%)" stopOpacity={0.05} />
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="time" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11, fill: 'hsl(25, 12%, 55%)' }}
                          interval={0}
                          dy={5}
                        />
                        <Area 
                          type="monotone"
                          dataKey="visits"
                          stroke="hsl(72, 22%, 38%)"
                          strokeWidth={2}
                          fill="url(#expandedVisitGradient)"
                          dot={(props) => {
                            const { cx, cy, payload } = props;
                            if (payload.isPeak) {
                              return (
                                <circle cx={cx} cy={cy} r={6} fill="hsl(35, 30%, 55%)" stroke="white" strokeWidth={2} />
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar 
                          dataKey="current"
                          fill="hsl(35, 30%, 55%)"
                          radius={[4, 4, 0, 0]}
                          barSize={20}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
