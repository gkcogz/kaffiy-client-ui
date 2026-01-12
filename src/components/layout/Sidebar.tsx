import { Home, Users, Megaphone, Gift, Settings, Coffee, ChevronRight, Sparkles, Crown, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { usePremium } from "@/contexts/PremiumContext";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: Home, path: "/" },
  { id: "customers", label: "Müşteriler", icon: Users, path: "/customers" },
  { id: "campaigns", label: "Kampanyalar", icon: Megaphone, path: "/campaigns" },
  { id: "rewards", label: "Ödüller", icon: Gift, path: "/rewards" },
  { id: "settings", label: "Ayarlar", icon: Settings, path: "/settings" },
];

export const Sidebar = () => {
  const { isPremium, togglePremium } = usePremium();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-56 h-full bg-sidebar flex flex-col border-r border-sidebar-border/40">
      {/* Logo - kaffiy */}
      <div className="h-16 lg:h-[72px] px-4 flex items-center border-b border-sidebar-border/30">
        <button 
          onClick={() => navigate("/")}
          className="flex items-center cursor-pointer hover:opacity-80 transition-opacity w-full text-left"
        >
          <div className="w-full">
            <h1 
              className="brand-logo text-left"
              style={{ 
                fontFamily: "'Inter', 'Outfit', ui-sans-serif, system-ui, sans-serif",
                textTransform: 'lowercase',
                fontWeight: 700,
                fontSize: '24px',
                letterSpacing: '-0.03em',
                color: '#1E293B',
                marginBottom: 0
              }}
            >
              kaff<span>i</span>y
            </h1>
            <p 
              className="text-left lowercase"
              style={{ 
                fontFamily: "'Inter', 'Outfit', ui-sans-serif, system-ui, sans-serif",
                fontWeight: 400,
                fontSize: '13px',
                color: '#64748B',
                marginTop: '4px'
              }}
            >
              Müşteri Büyüme Platformu
            </p>
          </div>
        </button>
      </div>

      {/* Premium Toggle - Compact */}
      <div className="px-3 pt-4">
        <button
          onClick={togglePremium}
          className={cn(
            "w-full rounded-xl px-3 py-2 transition-all duration-200 flex items-center justify-between",
            isPremium 
              ? "bg-gradient-to-r from-gold/15 to-gold/5 border border-gold/20" 
              : "bg-sidebar-accent/40 border border-transparent hover:border-sidebar-border/50"
          )}
        >
          <div className="flex items-center gap-2">
            <Crown className={cn(
              "w-3.5 h-3.5",
              isPremium ? "text-gold" : "text-sidebar-muted"
            )} />
            <span className={cn(
              "text-xs font-medium",
              isPremium ? "text-gold" : "text-sidebar-foreground/70"
            )}>
              Premium
            </span>
          </div>
          <div className={cn(
            "w-7 h-4 rounded-full transition-colors relative",
            isPremium ? "bg-gold" : "bg-sidebar-border"
          )}>
            <div className={cn(
              "absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform",
              isPremium ? "translate-x-3.5" : "translate-x-0.5"
            )} />
          </div>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pt-5 overflow-y-auto">
        <p className="text-[9px] uppercase tracking-widest text-sidebar-muted font-medium mb-2 px-2">Menü</p>
        <ul className="space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "group flex items-center gap-2.5 px-2.5 py-2 rounded-lg w-full transition-all duration-150 text-[13px]",
                    active 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                  )}
                >
                  <Icon className={cn(
                    "w-4 h-4 flex-shrink-0",
                    active ? "text-primary-foreground" : "text-sidebar-muted group-hover:text-sidebar-foreground"
                  )} />
                  <span className="flex-1 text-left font-medium">{item.label}</span>
                  {item.hasSubmenu && (
                    <ChevronRight className={cn(
                      "w-3.5 h-3.5 opacity-50",
                      active && "rotate-90"
                    )} />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Premium Badge */}
      {isPremium && (
        <div className="px-3 pb-3">
          <div className="rounded-lg px-3 py-2 bg-gradient-to-r from-gold/10 to-transparent border-l-2 border-gold/40">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-gold" />
              <span className="text-[10px] font-medium text-gold">Premium Aktif</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer - Powered by kaffiy */}
      <div className="px-3 pb-3 pt-2 border-t border-sidebar-border/30">
        <div className="px-2 py-1.5">
          <button 
            onClick={() => navigate("/")}
            className="w-full text-center cursor-pointer hover:opacity-80 transition-opacity"
          >
            <p 
              className="text-[9px] text-sidebar-muted/70 leading-tight"
              style={{ 
                fontFamily: "'DM Sans', 'Inter', ui-sans-serif, system-ui, sans-serif"
              }}
            >
              Powered by <span className="font-medium text-sidebar-muted">kaffiy</span>
              <br />
              <span className="text-[8px]">Müşteri Büyüme Platformu</span>
            </p>
          </button>
        </div>
      </div>
    </aside>
  );
};
