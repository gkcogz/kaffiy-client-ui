import { AreaChart, Area, XAxis, ResponsiveContainer, Bar, ComposedChart } from "recharts";

const data = [
  { time: "8 AM", visits: 3, current: 0 },
  { time: "10 AM", visits: 6, current: 0 },
  { time: "12 PM", visits: 8, current: 0 },
  { time: "2 PM", visits: 11, current: 0 },
  { time: "4 PM", visits: 9, current: 0 },
  { time: "6 PM", visits: 5, current: 0 },
  { time: "Şu an", visits: 0, current: 3 },
];

export const DailyVisitsChart = () => {
  return (
    <div className="stat-card">
      <p className="text-[11px] font-medium text-muted-foreground tracking-wide uppercase mb-1">
        Tekil Ziyaretler
      </p>
      <p className="text-lg font-semibold text-foreground mb-3">
        Günlük Dağılım
      </p>
      
      <div className="h-24">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="dailyVisitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(72, 22%, 38%)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(72, 22%, 38%)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 8, fill: 'hsl(25, 12%, 55%)' }}
              interval={1}
              dy={3}
            />
            <Area 
              type="monotone"
              dataKey="visits"
              stroke="hsl(72, 22%, 38%)"
              strokeWidth={2}
              fill="url(#dailyVisitGradient)"
              dot={false}
            />
            <Bar 
              dataKey="current"
              fill="hsl(35, 30%, 55%)"
              radius={[3, 3, 0, 0]}
              barSize={16}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
