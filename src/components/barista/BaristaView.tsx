import { useState } from "react";
import { QrCode, Gift, Check, User, Coffee, Star, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type ActiveTab = "qr" | "reward";

const mockBaristas = [
  { id: "1", name: "Ayşe K." },
  { id: "2", name: "Mehmet Y." },
  { id: "3", name: "Zeynep A." },
  { id: "4", name: "Can D." },
];

export const BaristaView = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("qr");
  const [customerName, setCustomerName] = useState<string | null>(null);
  const [currentStamps, setCurrentStamps] = useState(0);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [selectedBarista, setSelectedBarista] = useState<string | null>(null);
  const [isBaristaDialogOpen, setIsBaristaDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleQRScan = () => {
    setCustomerName("Ahmet Y.");
    setCurrentStamps(7);
    toast({
      title: "Müşteri bulundu",
      description: "Ahmet Y. - 7/10 kaşe",
    });
  };

  const handleGiveReward = () => {
    if (!customerName) {
      toast({
        title: "Önce QR okutun",
        description: "Ödül vermek için müşteri QR'ını okutun.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Ödül verildi!",
      description: `${customerName} ödülünü kullandı.`,
    });
    setCustomerName(null);
    setCurrentStamps(0);
  };

  const isCloseToReward = currentStamps >= 8;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-sage/5 flex flex-col">
      {/* Header */}
      <header className="px-5 pt-6 pb-4 safe-area-top">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 
              className="text-xl font-medium lowercase tracking-tighter"
              style={{ 
                fontFamily: "'DM Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
                color: '#2C3E50',
                letterSpacing: '-0.02em'
              }}
            >
              kaffiy
            </h1>
            <p 
              className="font-light lowercase text-[10px] mt-0.5"
              style={{ 
                fontFamily: "'DM Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
                color: '#64748B'
              }}
            >
              Müşteri Büyüme Platformu
            </p>
          </div>
          <p className="text-sm text-muted-foreground font-medium">Halic Kahve</p>
        </div>
        
        {/* Barista Selector */}
        <button
          onClick={() => setIsBaristaDialogOpen(true)}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all",
            selectedBarista
              ? "bg-primary/5 border-primary/30 hover:bg-primary/10"
              : "bg-muted/30 border-border/50 hover:bg-muted/50"
          )}
        >
          <div className="flex items-center gap-2.5">
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              selectedBarista ? "bg-primary/10" : "bg-muted"
            )}>
              <User className={cn(
                "w-4 h-4",
                selectedBarista ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <div className="text-left">
              <p className="text-xs font-medium text-foreground">
                {selectedBarista 
                  ? mockBaristas.find(b => b.id === selectedBarista)?.name || "Barista Seç"
                  : "Barista Seç"}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {selectedBarista ? "Aktif barista" : "Baristanızı seçin"}
              </p>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 flex flex-col">
        {/* Customer Card - Enhanced design */}
        {customerName ? (
          <div className={cn(
            "rounded-3xl p-5 mb-4 animate-fade-in relative overflow-hidden",
            isCloseToReward 
              ? "bg-gradient-to-br from-gold/15 via-gold/10 to-gold/5 border border-gold/30 shadow-[0_0_20px_rgba(212,175,55,0.15)]"
              : "bg-card border border-border/50 shadow-sm"
          )}>
            {/* Decorative elements for close to reward */}
            {isCloseToReward && (
              <>
                <div className="absolute top-3 right-3">
                  <Sparkles className="w-5 h-5 text-gold animate-pulse" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gold/10 rounded-full blur-2xl" />
              </>
            )}
            
            <div className="flex items-center gap-3.5 mb-5 relative">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center",
                isCloseToReward 
                  ? "bg-gradient-to-br from-gold/30 to-gold/10"
                  : "bg-sage/10"
              )}>
                <User className={cn("w-6 h-6", isCloseToReward ? "text-gold" : "text-sage")} />
              </div>
              <div className="flex-1">
                <h2 className="text-base font-semibold text-foreground">{customerName}</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Star className="w-3 h-3 text-gold fill-gold" />
                  <p className="text-xs text-muted-foreground">Sadık müşteri • 23 ziyaret</p>
                </div>
              </div>
            </div>
            
            {/* Stamp Progress - Coffee cup icons */}
            <div className="space-y-3 relative">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground font-medium">Kaşe Durumu</span>
                <span className={cn(
                  "text-sm font-bold px-2 py-0.5 rounded-full",
                  isCloseToReward 
                    ? "bg-gold/20 text-gold"
                    : "bg-sage/10 text-sage"
                )}>
                  {currentStamps}/10
                </span>
              </div>
              
              <div className="grid grid-cols-10 gap-1.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "aspect-square rounded-xl flex items-center justify-center transition-all duration-300",
                      i < currentStamps 
                        ? isCloseToReward
                          ? "bg-gradient-to-br from-gold to-gold/80 shadow-sm"
                          : "bg-sage shadow-sm"
                        : "bg-muted/40"
                    )}
                  >
                    <Coffee className={cn(
                      "w-3 h-3",
                      i < currentStamps ? "text-white" : "text-muted-foreground/30"
                    )} />
                  </div>
                ))}
              </div>
              
              {isCloseToReward && (
                <div className="flex items-center justify-center gap-2 pt-1">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                  <p className="text-xs text-gold font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {10 - currentStamps} kaşe kaldı!
                  </p>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-3xl p-8 border-2 border-dashed border-border/60 mb-4 flex flex-col items-center justify-center bg-gradient-to-b from-muted/20 to-muted/5">
            <div className="w-16 h-16 rounded-2xl bg-sage/10 flex items-center justify-center mb-4">
              <QrCode className="w-8 h-8 text-sage/60" />
            </div>
            <p className="text-muted-foreground text-sm font-medium text-center">
              Müşteri QR kodunu okutun
            </p>
            <p className="text-muted-foreground/60 text-xs text-center mt-1">
              İşlem yapmak için müşteriyi tanımlayın
            </p>
          </div>
        )}

        {/* Action Area - Hero Section for QR */}
        <div className="flex-1 flex flex-col justify-center pb-4">
          {activeTab === "qr" && (
            <div className="animate-fade-in space-y-4">
              {/* Camera Viewfinder - Hero Section */}
              <div className="flex justify-center">
                <button
                  onClick={() => setIsCameraOpen(!isCameraOpen)}
                  className={cn(
                    "relative w-[90vw] max-w-[400px] aspect-square rounded-3xl overflow-hidden",
                    "bg-gradient-to-br from-muted/40 to-muted/20 border-2 border-border/50",
                    "flex items-center justify-center transition-all duration-300",
                    "hover:border-border active:scale-[0.98]",
                    isCameraOpen && "border-primary/50 shadow-lg shadow-primary/10"
                  )}
                >
                  {isCameraOpen ? (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <QrCode className="w-16 h-16 text-primary/60 mx-auto" strokeWidth={1.5} />
                        <p className="text-sm text-muted-foreground font-medium">Kamera Aktif</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-muted-foreground/40 text-base font-medium animate-pulse">
                          Müşteri Kartını Göster
                        </p>
                      </div>
                    </>
                  )}
                </button>
              </div>

              {/* Primary Action Button */}
              <Button
                onClick={() => {
                  setIsCameraOpen(!isCameraOpen);
                  if (!isCameraOpen) {
                    handleQRScan();
                  }
                }}
                className={cn(
                  "w-full h-14 rounded-2xl text-base font-semibold shadow-lg transition-all duration-300",
                  "bg-gradient-to-br from-[#3E2723] to-[#2C3E50] hover:from-[#2C3E50] hover:to-[#3E2723]",
                  "text-white active:scale-[0.98]"
                )}
              >
                {isCameraOpen ? "Kamerayı Kapat" : "Kamerayı Aç / Tara"}
              </Button>

              {/* Secondary Action - Text Only */}
              <button
                onClick={() => {
                  // Kod girme işlevselliği buraya eklenecek
                  toast({
                    title: "Yakında",
                    description: "Kod ile giriş yakında eklenecek",
                  });
                }}
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                veya kodu gir
              </button>
            </div>
          )}

          {activeTab === "reward" && (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-gradient-to-br from-gold/15 via-gold/10 to-gold/5 rounded-3xl p-6 border border-gold/25 text-center relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-gold/20 rounded-full blur-2xl" />
                <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gold/15 rounded-full blur-xl" />
                
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold/30 to-gold/10 flex items-center justify-center mx-auto mb-3">
                    <Gift className="w-7 h-7 text-gold" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Ücretsiz Kahve</h3>
                  <p className="text-sm text-muted-foreground">10 kaşe karşılığı hediye</p>
                </div>
              </div>
              
              <Button
                onClick={handleGiveReward}
                disabled={!customerName}
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-gold to-gold/90 hover:from-gold/90 hover:to-gold text-white text-base font-semibold shadow-lg shadow-gold/20 transition-all disabled:opacity-40 disabled:shadow-none"
              >
                <Check className="w-5 h-5 mr-2" />
                Ödül Ver
              </Button>
              
              {!customerName && (
                <p className="text-center text-xs text-muted-foreground">
                  Önce QR okutarak müşteriyi tanımlayın
                </p>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation - Refined */}
      <nav className="bg-card/80 backdrop-blur-lg border-t border-border/50 safe-area-bottom">
        <div className="flex px-4 py-2">
          {[
            { id: "qr" as const, label: "QR Okut", icon: QrCode },
            { id: "reward" as const, label: "Ödül", icon: Gift },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 py-2 rounded-2xl transition-all duration-200",
                activeTab === tab.id
                  ? "text-[#C24D2C]"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
                activeTab === tab.id 
                  ? "bg-[#C24D2C]/10" 
                  : "bg-transparent"
              )}>
                <tab.icon 
                  className={cn(
                    "w-5 h-5 transition-transform",
                    activeTab === tab.id && "scale-110"
                  )}
                  strokeWidth={activeTab === tab.id ? 2.5 : 2}
                />
              </div>
              <span className={cn(
                "text-[10px] font-medium transition-colors",
                activeTab === tab.id ? "text-[#C24D2C] font-semibold" : "text-muted-foreground"
              )}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Barista Selection Dialog */}
      <Dialog open={isBaristaDialogOpen} onOpenChange={setIsBaristaDialogOpen}>
        <DialogContent className="max-w-[340px] rounded-2xl p-0 gap-0 bg-card border-border/50">
          <DialogHeader className="px-5 pt-5 pb-4 border-b border-border/30">
            <DialogTitle className="text-base font-semibold">Barista Seç</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Çalışan baristanızı seçin
            </DialogDescription>
          </DialogHeader>
          
          <div className="px-5 py-4 space-y-2">
            {mockBaristas.map((barista) => (
              <button
                key={barista.id}
                onClick={() => {
                  setSelectedBarista(barista.id);
                  setIsBaristaDialogOpen(false);
                  toast({
                    title: "Barista seçildi",
                    description: `${barista.name} olarak giriş yaptınız`,
                  });
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-xl border transition-all text-left",
                  selectedBarista === barista.id
                    ? "bg-primary/10 border-primary/30"
                    : "bg-muted/20 border-border/30 hover:bg-muted/40 hover:border-border/50"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  selectedBarista === barista.id ? "bg-primary/20" : "bg-muted"
                )}>
                  <User className={cn(
                    "w-5 h-5",
                    selectedBarista === barista.id ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                <div className="flex-1">
                  <p className={cn(
                    "text-sm font-medium",
                    selectedBarista === barista.id ? "text-primary" : "text-foreground"
                  )}>
                    {barista.name}
                  </p>
                  {selectedBarista === barista.id && (
                    <p className="text-[10px] text-primary/70 mt-0.5">Aktif</p>
                  )}
                </div>
                {selectedBarista === barista.id && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
