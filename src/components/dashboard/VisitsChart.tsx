import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { TrendingUp, Maximize2, X, GripVertical } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Area, XAxis, Bar, ComposedChart, ReferenceLine, Tooltip as RechartsTooltip } from "recharts";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isModalReady, setIsModalReady] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Draggable point state for distribution chart
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);
  const [isDraggingPoint, setIsDraggingPoint] = useState(false);
  const [pointTooltip, setPointTooltip] = useState<{ x: number; y: number; time: string; visits: number } | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const expandedChartContainerRef = useRef<HTMLDivElement>(null);
  
  const data = periodData[period];
  const percentChange = Math.round(((data.visits - data.compareVisits) / data.compareVisits) * 100);
  const isPositive = percentChange >= 0;
  
  const donutData = [
    { name: "Mevcut", value: data.returning },
    { name: "Yeni", value: data.new },
  ];

  // Calculate centered position
  const calculateCenterPosition = () => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const modalWidth = 672; // max-w-2xl = 672px
    const modalHeight = 600;
    return {
      x: centerX - modalWidth / 2,
      y: centerY - modalHeight / 2,
    };
  };

  // Handle chart expansion
  const handleChartExpand = (chartType: ChartType) => {
    // First close any existing modal
    if (expandedChart !== null) {
      setExpandedChart(null);
      setPosition(null);
      setIsModalReady(false);
      // Wait a frame before opening new one
      requestAnimationFrame(() => {
        const centeredPos = calculateCenterPosition();
        setPosition(centeredPos);
        setExpandedChart(chartType);
        // Use another frame to ensure position is set before showing modal
        requestAnimationFrame(() => {
          setIsModalReady(true);
        });
      });
    } else {
      // Calculate position first
      const centeredPos = calculateCenterPosition();
      setPosition(centeredPos);
      setExpandedChart(chartType);
      // Wait for next frame to ensure position is set
      requestAnimationFrame(() => {
        setIsModalReady(true);
      });
    }
  };

  // Reset modal ready state when chart closes
  useEffect(() => {
    if (expandedChart === null) {
      setIsModalReady(false);
    }
  }, [expandedChart]);

  // Initialize selected point when period changes
  useEffect(() => {
    const peakIndex = data.chartData.findIndex(d => d.isPeak);
    setSelectedPointIndex(peakIndex >= 0 ? peakIndex : 0);
  }, [period, data.chartData]);

  // Center modal on resize (optional)
  useEffect(() => {
    if (expandedChart !== null && !isDragging && position) {
      const handleResize = () => {
        const centeredPos = calculateCenterPosition();
        setPosition(centeredPos);
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [expandedChart, isDragging]);

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!modalRef.current || !position) return;
    const rect = modalRef.current.getBoundingClientRect();
    // Calculate offset from mouse position to modal's top-left corner
    dragOffsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setIsDragging(true);
    e.preventDefault();
  };

  useEffect(() => {
    if (!isDragging) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Cancel previous animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Use requestAnimationFrame for smooth updates
      animationFrameRef.current = requestAnimationFrame(() => {
        if (!isDragging) return;
        
        // Calculate new position based on mouse position minus offset
        const newX = e.clientX - dragOffsetRef.current.x;
        const newY = e.clientY - dragOffsetRef.current.y;
        
        // Constrain to viewport
        const maxX = window.innerWidth - 100; // Leave some margin
        const maxY = window.innerHeight - 100;
        
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY)),
        });
      });
    };

    const handleMouseUp = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isDragging, position]);

  // Handle dragging point on distribution chart (small chart)
  useEffect(() => {
    if (!isDraggingPoint || !chartContainerRef.current || expandedChart === "distribution") return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!chartContainerRef.current) return;
      
      const rect = chartContainerRef.current.getBoundingClientRect();
      const chartWidth = rect.width;
      const marginLeft = 0;
      const marginRight = 0;
      const chartInnerWidth = chartWidth - marginLeft - marginRight;
      
      const relativeX = e.clientX - rect.left - marginLeft;
      const normalizedX = Math.max(0, Math.min(1, relativeX / chartInnerWidth));
      
      // Find closest point
      const closestIndex = Math.round(normalizedX * (data.chartData.length - 1));
      const newIndex = Math.max(0, Math.min(data.chartData.length - 1, closestIndex));
      
      if (newIndex !== selectedPointIndex) {
        setSelectedPointIndex(newIndex);
        const point = data.chartData[newIndex];
        const maxVisits = Math.max(...data.chartData.map(d => d.visits));
        const minVisits = Math.min(...data.chartData.map(d => d.visits));
        const visitsRange = maxVisits - minVisits || 1;
        const chartHeight = rect.height;
        const marginTop = 8;
        const marginBottom = 20;
        const normalizedVisits = (point.visits - minVisits) / visitsRange;
        const yPos = marginTop + (chartHeight - marginTop - marginBottom) - (normalizedVisits * (chartHeight - marginTop - marginBottom));
        
        setPointTooltip({
          x: marginLeft + (newIndex / (data.chartData.length - 1 || 1)) * chartInnerWidth,
          y: yPos,
          time: point.time,
          visits: point.visits,
        });
      }
    };
    
    const handleMouseUp = () => {
      setIsDraggingPoint(false);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingPoint, selectedPointIndex, data.chartData]);

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
        <div className="flex flex-col">
          <p className="text-xs lg:text-sm font-medium text-muted-foreground tracking-wide uppercase mb-3 h-5 flex items-center">
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
          onClick={() => handleChartExpand("donut")}
          className="cursor-pointer group relative flex flex-col"
        >
          <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <Maximize2 className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-xs lg:text-sm font-medium text-muted-foreground tracking-wide uppercase mb-3 h-5 flex items-center">
            Mevcut / Yeni
          </p>
          <div className="flex items-center justify-center gap-4">
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
            <div className="flex flex-col items-center justify-center">
              <p className="text-xl lg:text-2xl font-semibold text-foreground text-center">{data.returning}/{data.new}</p>
              <p className="text-xs lg:text-sm text-muted-foreground text-center">%</p>
            </div>
          </div>
          {/* Color Legend */}
          <div className="w-full flex items-center justify-center gap-5 mt-4 pt-3 border-t border-border/40">
            <div className="flex items-center gap-2">
              <div 
                className="w-3.5 h-3.5 rounded-full shadow-sm border border-border/20" 
                style={{ backgroundColor: COLORS[0] }} 
              />
              <span className="text-[11px] font-medium text-muted-foreground tracking-wide">Mevcut</span>
            </div>
            <div className="w-px h-4 bg-border/40" />
            <div className="flex items-center gap-2">
              <div 
                className="w-3.5 h-3.5 rounded-full shadow-sm border border-border/20" 
                style={{ backgroundColor: COLORS[1] }} 
              />
              <span className="text-[11px] font-medium text-muted-foreground tracking-wide">Yeni</span>
            </div>
          </div>
        </div>

        {/* Column 3: Distribution Chart */}
        <div 
          className="group relative flex flex-col"
        >
          <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button
              onClick={() => handleChartExpand("distribution")}
              className="p-1 rounded hover:bg-muted/50 transition-colors"
            >
              <Maximize2 className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <p className="text-xs lg:text-sm font-medium text-muted-foreground tracking-wide uppercase mb-3 h-5 flex items-center">
            {data.distributionLabel}
          </p>
          <div 
            ref={chartContainerRef}
            className="h-20 lg:h-24 relative"
            onMouseMove={(e) => {
              if (isDraggingPoint && chartContainerRef.current) {
                const rect = chartContainerRef.current.getBoundingClientRect();
                const chartWidth = rect.width;
                const marginLeft = 0;
                const marginRight = 0;
                const chartInnerWidth = chartWidth - marginLeft - marginRight;
                
                const relativeX = e.clientX - rect.left - marginLeft;
                const normalizedX = Math.max(0, Math.min(1, relativeX / chartInnerWidth));
                
                // Find closest point
                const closestIndex = Math.round(normalizedX * (data.chartData.length - 1));
                const newIndex = Math.max(0, Math.min(data.chartData.length - 1, closestIndex));
                
                if (newIndex !== selectedPointIndex) {
                  setSelectedPointIndex(newIndex);
                  const point = data.chartData[newIndex];
                  setPointTooltip({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                    time: point.time,
                    visits: point.visits,
                  });
                }
              }
            }}
            onMouseUp={() => {
              if (isDraggingPoint) {
                setIsDraggingPoint(false);
              }
            }}
            onClick={(e) => {
              // Prevent expanding chart when clicking on point
              if ((e.target as HTMLElement).closest('circle')) return;
              handleChartExpand("distribution");
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart 
                data={data.chartData} 
                margin={{ top: 8, right: 0, left: 0, bottom: 0 }}
                onMouseMove={(e: any) => {
                  if (!isDraggingPoint && e && e.activePayload && e.activePayload[0]) {
                    const payload = e.activePayload[0].payload;
                    const index = data.chartData.findIndex(d => d.time === payload.time);
                    if (index >= 0 && e.activeCoordinate) {
                      const point = data.chartData[index];
                      setPointTooltip({
                        x: e.activeCoordinate.x || 0,
                        y: e.activeCoordinate.y || 0,
                        time: point.time,
                        visits: point.visits,
                      });
                    }
                  }
                }}
                onMouseLeave={() => {
                  if (!isDraggingPoint) {
                    setPointTooltip(null);
                  }
                }}
              >
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
                  dot={(props: any) => {
                    const { cx, cy, payload, index } = props;
                    if (selectedPointIndex === index && cx && cy) {
                      return (
                        <g key={`dot-${index}`}>
                          <circle 
                            cx={cx} 
                            cy={cy} 
                            r={6} 
                            fill="hsl(35, 30%, 55%)" 
                            stroke="white" 
                            strokeWidth={2}
                            className="cursor-grab active:cursor-grabbing"
                            onMouseDown={(e: React.MouseEvent<SVGCircleElement>) => {
                              e.stopPropagation();
                              setIsDraggingPoint(true);
                              const rect = chartContainerRef.current?.getBoundingClientRect();
                              if (rect) {
                                setPointTooltip({
                                  x: e.clientX - rect.left,
                                  y: e.clientY - rect.top,
                                  time: payload.time,
                                  visits: payload.visits,
                                });
                              }
                            }}
                          />
                        </g>
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
            
            {/* Custom Tooltip for selected point */}
            {pointTooltip && selectedPointIndex !== null && data.chartData[selectedPointIndex] && (
              <div
                className="absolute pointer-events-none z-30 bg-popover border border-border rounded-lg px-2 py-1 shadow-lg"
                style={{
                  left: `${pointTooltip.x}px`,
                  top: `${pointTooltip.y - 35}px`,
                  transform: 'translate(-50%, 0)',
                }}
              >
                <p className="text-xs font-semibold text-foreground">{pointTooltip.time}</p>
                <p className="text-xs text-muted-foreground">{pointTooltip.visits} ziyaret</p>
              </div>
            )}
            
          </div>
          {/* Color Legend */}
          <div className="w-full flex items-center justify-center gap-5 mt-3 pt-3 border-t border-border/40">
            <div className="flex items-center gap-2">
              <div 
                className="w-3.5 h-3 rounded-sm shadow-sm" 
                style={{ backgroundColor: "hsl(72, 22%, 38%)" }} 
              />
              <span className="text-[11px] font-medium text-muted-foreground tracking-wide">Ziyaretler</span>
            </div>
            <div className="w-px h-4 bg-border/40" />
            <div className="flex items-center gap-2">
              <div 
                className="w-3.5 h-3 rounded-sm shadow-sm" 
                style={{ backgroundColor: "hsl(35, 30%, 55%)" }} 
              />
              <span className="text-[11px] font-medium text-muted-foreground tracking-wide">Şu an</span>
            </div>
          </div>
        </div>
      </div>

      {/* Draggable Chart Modal - Using Portal to ensure correct z-index */}
      {expandedChart !== null && position && isModalReady && typeof window !== 'undefined' ? (
        createPortal(
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-200"
              onClick={() => {
                setExpandedChart(null);
                setPosition(null);
                setIsModalReady(false);
              }}
            />
            
            {/* Draggable Modal */}
            <div
              ref={modalRef}
              className={cn(
                "fixed z-[100] w-full max-w-2xl bg-background border border-border rounded-xl shadow-2xl",
                "animate-in fade-in-0 zoom-in-95 duration-300",
                isDragging ? "cursor-grabbing select-none" : "cursor-default"
              )}
              style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
            {/* Draggable Header */}
            <div
              onMouseDown={handleMouseDown}
              className={cn(
                "flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30 rounded-t-xl",
                "cursor-grab active:cursor-grabbing select-none",
                isDragging && "bg-muted/50"
              )}
            >
              <div className="flex items-center gap-3 flex-1">
                <GripVertical className="w-5 h-5 text-muted-foreground" />
                <div>
                  {expandedChart === "donut" && (
                    <p className="text-sm font-semibold text-foreground">Mevcut vs Yeni Müşteriler - Detaylı Analiz</p>
                  )}
                  {expandedChart === "distribution" && (
                    <p className="text-sm font-semibold text-foreground">{data.distributionLabel} - Detaylı Analiz</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-0.5">{data.label} Ziyaretler</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setExpandedChart(null);
                  setPosition(null);
                  setIsModalReady(false);
                }}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 max-h-[80vh] overflow-y-auto">
              {/* Donut Chart Expanded */}
              {expandedChart === "donut" && (
                <div className="space-y-6 animate-fade-in">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-muted/30 border border-border">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Toplam Müşteri</p>
                      <p className="text-2xl font-bold text-foreground">{data.visits}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/30 border border-border">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Mevcut</p>
                      <p className="text-2xl font-bold text-foreground">{data.returning}%</p>
                      <p className="text-sm text-muted-foreground mt-1">{Math.round(data.visits * data.returning / 100)} müşteri</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/30 border border-border">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Yeni</p>
                      <p className="text-2xl font-bold text-foreground">{data.new}%</p>
                      <p className="text-sm text-muted-foreground mt-1">{Math.round(data.visits * data.new / 100)} müşteri</p>
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={donutData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
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

                  {/* Legend & Details */}
                  <div className="flex justify-center gap-8 pt-4 border-t border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[0] }} />
                      <div>
                        <span className="text-sm font-medium text-foreground">Mevcut Müşteriler</span>
                        <p className="text-xs text-muted-foreground">{data.returning}% • {Math.round(data.visits * data.returning / 100)} kişi</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[1] }} />
                      <div>
                        <span className="text-sm font-medium text-foreground">Yeni Müşteriler</span>
                        <p className="text-xs text-muted-foreground">{data.new}% • {Math.round(data.visits * data.new / 100)} kişi</p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <p className="text-xs font-medium text-primary mb-2">İçgörü</p>
                    <p className="text-sm text-muted-foreground">
                      {data.returning > data.new 
                        ? `Mevcut müşterileriniz toplam ziyaretlerin ${data.returning}%'ini oluşturuyor. Bu, güçlü bir müşteri sadakati göstergesidir.`
                        : `Yeni müşteri oranınız ${data.new}% ile oldukça yüksek. Büyüme potansiyeliniz yüksek görünüyor.`
                      }
                    </p>
                  </div>
                </div>
              )}

              {/* Distribution Chart Expanded */}
              {expandedChart === "distribution" && (
                <div className="space-y-6 animate-fade-in">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-muted/30 border border-border">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Toplam Ziyaret</p>
                      <p className="text-2xl font-bold text-foreground">{data.visits}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {data.compareLabel}: {data.compareVisits}
                        <span className={cn(
                          "ml-2 font-medium",
                          isPositive ? "text-success" : "text-destructive"
                        )}>
                          {isPositive ? "+" : ""}{percentChange}%
                        </span>
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/30 border border-border">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">En Yoğun Zaman</p>
                      <p className="text-lg font-bold text-foreground">
                        {data.chartData.find(d => d.isPeak)?.time || "N/A"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {data.chartData.find(d => d.isPeak)?.visits || 0} ziyaret
                      </p>
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={data.chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
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
                          tick={{ fontSize: 12, fill: 'hsl(25, 12%, 55%)' }}
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

                  {/* Time Breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {data.chartData.map((item, index) => (
                      <div
                        key={index}
                        className={cn(
                          "p-3 rounded-lg border",
                          item.isPeak 
                            ? "bg-primary/10 border-primary/30" 
                            : "bg-muted/20 border-border/30"
                        )}
                      >
                        <p className="text-xs text-muted-foreground mb-1">{item.time}</p>
                        <p className="text-lg font-bold text-foreground">{item.visits}</p>
                        {item.isPeak && (
                          <p className="text-[10px] text-primary font-medium mt-1">En yoğun</p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Additional Info */}
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <p className="text-xs font-medium text-primary mb-2">İçgörü</p>
                    <p className="text-sm text-muted-foreground">
                      {data.chartData.find(d => d.isPeak)?.time} saatleri arasında en yoğun trafik yaşanıyor. 
                      Bu zaman diliminde ekstra personel veya kampanya planlaması yapabilirsiniz.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>,
        document.body
        )
      ) : null}
    </div>
  );
};
