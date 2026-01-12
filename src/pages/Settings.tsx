import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Store, 
  Bell, 
  Shield, 
  Palette, 
  CreditCard, 
  HelpCircle,
  Save,
  Upload,
  Moon,
  Sun,
  Smartphone,
  Mail,
  MessageSquare,
  Globe,
  Clock,
  Layout,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useDashboardCards, DASHBOARD_CARDS } from "@/contexts/DashboardCardsContext";

type ThemeColor = "terracotta" | "sage" | "coffee" | "gold";

interface ThemeConfig {
  name: string;
  value: ThemeColor;
  primaryColor: string;
  primaryHsl: string;
  description: string;
}

const themeConfigs: ThemeConfig[] = [
  { 
    name: "Kiremit", 
    value: "terracotta",
    primaryColor: "#C24D2C",
    primaryHsl: "18 40% 62%",
    description: "Sıcak ve davetkar"
  },
  { 
    name: "Adaçayı", 
    value: "sage",
    primaryColor: "#8A9A5B",
    primaryHsl: "75 26% 48%",
    description: "Doğal ve sakin"
  },
  { 
    name: "Kahve", 
    value: "coffee",
    primaryColor: "#4B3621",
    primaryHsl: "30 39% 21%",
    description: "Klasik ve zarif"
  },
  { 
    name: "Altın", 
    value: "gold",
    primaryColor: "#D4AF37",
    primaryHsl: "42 55% 55%",
    description: "Lüks ve parlak"
  },
];

const Settings = () => {
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<ThemeColor>("terracotta");
  const { cardVisibility, toggleCard, resetToDefault } = useDashboardCards();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab") || "store";
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  useEffect(() => {
    const tab = searchParams.get("tab") || "store";
    setActiveTab(tab);
  }, [searchParams]);

  const handleSave = () => {
    toast({
      title: "Ayarlar kaydedildi",
      description: "Değişiklikleriniz başarıyla kaydedildi.",
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  const handleThemeChange = (theme: ThemeColor) => {
    setSelectedTheme(theme);
    const themeConfig = themeConfigs.find(t => t.value === theme);
    if (themeConfig) {
      // Update CSS custom property for primary color
      document.documentElement.style.setProperty("--primary", themeConfig.primaryHsl);
      
      toast({
        title: "Tema değiştirildi",
        description: `${themeConfig.name} teması uygulandı.`,
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-3 lg:grid-cols-7 gap-2 bg-transparent h-auto p-0 mb-6">
            {[
              { value: "store", label: "Mağaza", icon: Store },
              { value: "notifications", label: "Bildirimler", icon: Bell },
              { value: "appearance", label: "Görünüm", icon: Palette },
              { value: "dashboard", label: "Dashboard", icon: Layout },
              { value: "security", label: "Güvenlik", icon: Shield },
              { value: "billing", label: "Faturalandırma", icon: CreditCard },
              { value: "help", label: "Yardım", icon: HelpCircle },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border/50 bg-card/60 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary"
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Store Settings */}
          <TabsContent value="store" className="space-y-6">
            <div className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Mağaza Bilgileri</h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Store className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <Button variant="outline" size="sm" className="rounded-xl gap-2">
                      <Upload className="w-4 h-4" />
                      Logo Yükle
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">PNG, JPG - Max 2MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Mağaza Adı</Label>
                    <Input defaultValue="Halic Kahve" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefon</Label>
                    <Input defaultValue="+90 216 123 4567" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>E-posta</Label>
                    <Input defaultValue="info@caferosetta.com" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Web Sitesi</Label>
                    <Input defaultValue="www.caferosetta.com" className="rounded-xl" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Adres</Label>
                  <Textarea 
                    defaultValue="Caferağa Mah. Moda Cad. No:45, Kadıköy / İstanbul" 
                    className="rounded-xl resize-none"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Açılış Saati</Label>
                    <Input type="time" defaultValue="08:00" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Kapanış Saati</Label>
                    <Input type="time" defaultValue="22:00" className="rounded-xl" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="rounded-xl gap-2 bg-primary" onClick={handleSave}>
                <Save className="w-4 h-4" />
                Kaydet
              </Button>
            </div>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Bildirim Tercihleri</h3>
              
              <div className="space-y-4">
                {[
                  { icon: Mail, title: "E-posta Bildirimleri", desc: "Günlük özet ve önemli güncellemeler", defaultChecked: true },
                  { icon: Smartphone, title: "Push Bildirimleri", desc: "Anlık müşteri aktiviteleri", defaultChecked: true },
                  { icon: MessageSquare, title: "SMS Bildirimleri", desc: "Kritik uyarılar için SMS", defaultChecked: false },
                  { icon: Bell, title: "Kayıp Müşteri Uyarıları", desc: "14+ gün gelmeyen müşteriler", defaultChecked: true },
                  { icon: Globe, title: "Pazarlama E-postaları", desc: "Yenilikler ve ipuçları", defaultChecked: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                    <Switch defaultChecked={item.defaultChecked} />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Dashboard Kartları</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl gap-2"
                  onClick={resetToDefault}
                >
                  <Save className="w-4 h-4" />
                  Varsayılana Sıfırla
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {DASHBOARD_CARDS.map((card) => (
                  <div 
                    key={card.id} 
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm">{card.name}</p>
                      {card.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{card.description}</p>
                      )}
                    </div>
                    <Switch 
                      checked={cardVisibility[card.id]} 
                      onCheckedChange={() => toggleCard(card.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Appearance */}
          <TabsContent value="appearance" className="space-y-6">
            <div className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Görünüm Ayarları</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      {isDarkMode ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Karanlık Mod</p>
                      <p className="text-xs text-muted-foreground">Göz yorgunluğunu azaltın</p>
                    </div>
                  </div>
                  <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
                </div>

                <div>
                  <Label className="mb-3 block text-foreground">Tema Rengi</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {themeConfigs.map((theme) => (
                      <button
                        key={theme.value}
                        onClick={() => handleThemeChange(theme.value)}
                        className={cn(
                          "relative p-4 rounded-xl border-2 transition-all hover:scale-[1.02] group text-left",
                          selectedTheme === theme.value
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border/50 bg-muted/20 hover:border-border hover:bg-muted/30"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className={cn(
                              "w-10 h-10 rounded-lg transition-all",
                              selectedTheme === theme.value && "ring-2 ring-offset-1 ring-primary"
                            )}
                            style={{ backgroundColor: theme.primaryColor }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-foreground">{theme.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{theme.description}</p>
                          </div>
                          {selectedTheme === theme.value && (
                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                              <Check className="w-3 h-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="space-y-6">
            <div className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Güvenlik Ayarları</h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Mevcut Şifre</Label>
                  <Input type="password" placeholder="••••••••" className="rounded-xl" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Yeni Şifre</Label>
                    <Input type="password" placeholder="••••••••" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Şifre Tekrar</Label>
                    <Input type="password" placeholder="••••••••" className="rounded-xl" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">İki Faktörlü Doğrulama</p>
                      <p className="text-xs text-muted-foreground">Ekstra güvenlik katmanı</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button className="rounded-xl gap-2 bg-primary" onClick={handleSave}>
                  <Save className="w-4 h-4" />
                  Şifreyi Güncelle
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Billing */}
          <TabsContent value="billing" className="space-y-6">
            <div className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Abonelik Bilgileri</h3>
              
              <div className="bg-gradient-to-br from-gold/10 to-gold/5 rounded-xl p-5 border border-gold/20 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold text-gold">Premium Plan</p>
                    <p className="text-xs text-muted-foreground">Aylık faturalandırma</p>
                  </div>
                  <p className="text-2xl font-bold text-foreground">₺299<span className="text-sm font-normal text-muted-foreground">/ay</span></p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-lg">Planı Değiştir</Button>
                  <Button variant="ghost" size="sm" className="rounded-lg text-destructive">İptal Et</Button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Ödeme Yöntemi</h4>
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 rounded bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">VISA</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">•••• •••• •••• 4242</p>
                      <p className="text-xs text-muted-foreground">Son kullanma: 12/25</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-lg">Değiştir</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Help */}
          <TabsContent value="help" className="space-y-6">
            <div className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Yardım & Destek</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "SSS", desc: "Sık sorulan sorular", icon: HelpCircle },
                  { title: "Canlı Destek", desc: "7/24 destek hattı", icon: MessageSquare },
                  { title: "Dokümantasyon", desc: "Kullanım kılavuzları", icon: Globe },
                  { title: "Video Eğitimler", desc: "Adım adım videolar", icon: Clock },
                ].map((item) => (
                  <button
                    key={item.title}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
