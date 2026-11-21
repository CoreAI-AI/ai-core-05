import { useState, useEffect, useMemo, useRef } from "react";
import { ArrowLeft, Search, Sparkles, Wand2, X, Square, Smartphone, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import StyleCard from "@/components/StyleCard";
import ImageUploadModal from "@/components/ImageUploadModal";
import { 
  getActiveFestival, 
  getTrendingStyles, 
  updateTrendScores,
  type Festival,
  type TrendingStyle
} from "@/lib/festivalDetection";

// High-Definition Curated Aesthetic Styles for CoreAI
const allStylesList = [
  { name: "Photorealistic 8K", category: "Cinematic", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=650&fit=crop", prompt: "Hyper-realistic 8K studio portrait, Rembrandt lighting, ultra-detailed skin textures" },
  { name: "Ghibli Dreamscape", category: "Anime & 3D", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&h=650&fit=crop", prompt: "Studio Ghibli style anime scene with watercolor cloudscapes, vibrant lush hills" },
  { name: "3D Pixar Character", category: "Anime & 3D", image: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=500&h=650&fit=crop", prompt: "3D Pixar animated hero character, cinematic sub-surface scattering lighting" },
  { name: "Cyberpunk 2099", category: "Cinematic", image: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=500&h=650&fit=crop", prompt: "Cyberpunk neon city street in rain, holographic signs, moody teal and magenta glow" },
  { name: "Royal Rajputi Heritage", category: "Indian & Heritage", image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=500&h=650&fit=crop", prompt: "Majestic Indian royal palace courtyard, regal golden embroidery, historic grandeur" },
  { name: "Classical Oil Painting", category: "Artistic", image: "https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?w=500&h=650&fit=crop", prompt: "Renaissance oil painting masterwork with deep chiaroscuro and rich textures" },
  { name: "Bollywood Blockbuster", category: "Cinematic", image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500&h=650&fit=crop", prompt: "Grand Bollywood movie cinematic poster with dramatic backlighting and smoke" },
  { name: "Anime Neon Portrait", category: "Anime & 3D", image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&h=650&fit=crop", prompt: "Crisp modern Makoto Shinkai aesthetic anime portrait with dynamic lens flare" },
  { name: "Jaipur Block-Print", category: "Indian & Heritage", image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=500&h=650&fit=crop", prompt: "Intricate Rajasthani floral block-print pattern with natural indigo and saffron dyes" },
  { name: "Vintage 70s Polaroid", category: "Cinematic", image: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?w=500&h=650&fit=crop", prompt: "Nostalgic 1970s Polaroid film grain, warm nostalgic tones, authentic light leak" },
  { name: "Soft Watercolor Wash", category: "Artistic", image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=500&h=650&fit=crop", prompt: "Dreamy botanical watercolor painting with soft pastel splashes on cold-press paper" },
  { name: "Vogue Fashion Editorial", category: "Cinematic", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=650&fit=crop", prompt: "High fashion editorial magazine cover portrait, bold high-contrast avant-garde style" },
  { name: "Madhubani Folk Art", category: "Indian & Heritage", image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&h=650&fit=crop", prompt: "Traditional Mithila Madhubani line art with sacred peacock and lotus motifs" },
  { name: "Fine Graphite Sketch", category: "Artistic", image: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=500&h=650&fit=crop", prompt: "Detailed charcoal and graphite pencil sketch with realistic cross-hatching" },
  { name: "Cozy Golden Hour Glow", category: "Festive", image: "https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=500&h=650&fit=crop", prompt: "Warm magical festival lights bokeh, cozy golden atmosphere and sparkling reflections" },
  { name: "Minimalist Vector Flat", category: "Artistic", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=650&fit=crop", prompt: "Modern sleek vector illustration with bold shapes, smooth gradients, and clean lines" }
];

const CATEGORIES = ["All", "Trending", "Indian & Heritage", "Cinematic", "Anime & 3D", "Artistic", "Festive"];

const ImagesSection = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
   const [modalOpen, setModalOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<{ name: string; image: string; prompt?: string } | null>(null);
  const [activeFestival, setActiveFestival] = useState<Festival | null>(null);
  const [composerPrompt, setComposerPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "16:9" | "9:16">("1:1");
  const composerInputRef = useRef<HTMLInputElement>(null);
  const [trendingStyles, setTrendingStyles] = useState<TrendingStyle[]>([]);

  useEffect(() => {
    setActiveFestival(getActiveFestival());
    setTrendingStyles(getTrendingStyles(6));

    const interval = setInterval(() => {
      updateTrendScores();
      setTrendingStyles(getTrendingStyles(6));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Filtered styles based on category & search
  const filteredStyles = useMemo(() => {
    let list = allStylesList;

    if (selectedCategory === "Trending") {
      const trendingNames = new Set(trendingStyles.map(t => t.name.toLowerCase()));
      list = list.filter(s => trendingNames.has(s.name.toLowerCase()) || s.name.includes("Photorealistic") || s.name.includes("Ghibli") || s.name.includes("Cyberpunk"));
    } else if (selectedCategory !== "All") {
      list = list.filter(s => s.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(s => s.name.toLowerCase().includes(q) || s.prompt.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
    }

    return list;
  }, [selectedCategory, searchQuery, trendingStyles]);

  const handleOpenStyle = (style: { name: string; image: string; prompt?: string }) => {
    setSelectedStyle(style);
    if (!composerPrompt.trim()) {
      setComposerPrompt(style.prompt || "");
    }
    setModalOpen(true);
  };

  const handleSelectStyleToComposer = (style: { name: string; image: string; prompt?: string }) => {
    setSelectedStyle(style);
    setComposerPrompt(style.prompt || "");
    composerInputRef.current?.focus();
  };

  const handleCreateFromComposer = () => {
    if (!composerPrompt.trim() && !selectedStyle) return;
    setModalOpen(true);
  };

  return (
    <div className="h-[100dvh] overflow-y-auto bg-background text-foreground flex flex-col">
      {/* Sleek Minimalist Sticky Header */}
      <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-xl border-b border-border/40 shrink-0">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="h-9 w-9 rounded-full hover:bg-muted/60"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
                Image Styles
              </h1>
            </div>
          </div>

          {/* Quick Search Input */}
          <div className="relative w-40 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search styles..."
              className="h-8 pl-8 pr-3 text-xs rounded-full bg-muted/40 border-border/50 focus-visible:ring-1"
            />
          </div>
        </div>

        {/* Minimal Category Pills */}
        <div className="max-w-5xl mx-auto px-4 pb-2.5 pt-1 overflow-x-auto no-scrollbar flex items-center gap-1.5">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3.5 py-1 rounded-full whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? "bg-foreground text-background font-medium shadow-2xs"
                    : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/70"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </header>

           {/* Main Content with Full Smooth Scroll */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 space-y-6 pb-24">
        
        {/* ChatGPT Style Floating Prompt & Style Bar */}
        <section className="relative rounded-2xl sm:rounded-3xl border border-border/50 bg-gradient-to-b from-muted/30 to-card/60 p-4 sm:p-6 backdrop-blur-xl shadow-sm">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                  <Sparkles className="w-3 h-3" /> CoreAI Images
                </span>
                {selectedStyle && (
                  <span className="flex items-center gap-1 text-[11px] font-medium bg-muted text-foreground px-2.5 py-0.5 rounded-full border border-border/60">
                    {selectedStyle.name}
                    <button onClick={() => setSelectedStyle(null)} className="hover:text-destructive">
                      <X className="w-3 h-3 ml-1" />
                    </button>
                  </span>
                )}
              </div>

              {/* Aspect Ratio Selector Pills (ChatGPT Style) */}
              <div className="flex items-center gap-1 bg-background/80 border border-border/60 p-0.5 rounded-full">
                <button
                  type="button"
                  onClick={() => setAspectRatio("1:1")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                    aspectRatio === "1:1" ? "bg-foreground text-background shadow-xs" : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="Square 1:1"
                >
                  <Square className="w-3 h-3" /> 1:1
                </button>
                <button
                  type="button"
                  onClick={() => setAspectRatio("16:9")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                    aspectRatio === "16:9" ? "bg-foreground text-background shadow-xs" : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="Landscape 16:9"
                >
                  <Monitor className="w-3 h-3" /> 16:9
                </button>
                <button
                  type="button"
                  onClick={() => setAspectRatio("9:16")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                    aspectRatio === "9:16" ? "bg-foreground text-background shadow-xs" : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="Portrait 9:16"
                >
                  <Smartphone className="w-3 h-3" /> 9:16
                </button>
              </div>
            </div>

            {/* Prompt Composer Input */}
            <div className="relative flex items-center">
              <input
                ref={composerInputRef}
                value={composerPrompt}
                onChange={(e) => setComposerPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCreateFromComposer();
                  }
                }}
                placeholder={
                  selectedStyle 
                    ? `Describe in ${selectedStyle.name} style... (or press Create)` 
                    : "Describe any image to create, or pick a style below..."
                }
                className="w-full h-12 sm:h-14 pl-4 pr-24 sm:pr-28 text-sm sm:text-base rounded-xl sm:rounded-2xl bg-background/90 border border-border/70 text-foreground placeholder:text-muted-foreground/70 focus:outline-hidden focus:ring-2 focus:ring-primary/40 transition-all shadow-inner"
              />
              <Button
                type="button"
                onClick={handleCreateFromComposer}
                className="absolute right-1.5 sm:right-2 h-9 sm:h-10 px-3 sm:px-4 rounded-lg sm:rounded-xl bg-foreground text-background hover:opacity-90 font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Create</span>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Subtle Festival Banner if active */}
        {activeFestival && selectedCategory === "All" && !searchQuery && (
          <div 
            onClick={() => handleOpenStyle({
              name: activeFestival.styleName,
              image: "https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?w=500&h=500&fit=crop",
              prompt: `Celebrate ${activeFestival.name} in majestic visual style`
            })}
            className="relative rounded-2xl overflow-hidden border border-border/40 bg-card/40 p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:border-foreground/20 transition-all duration-200 group"
          >
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl overflow-hidden shrink-0 border border-border/50">
                <img
                  src="https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?w=500&h=500&fit=crop"
                  alt={activeFestival.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {activeFestival.tag}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-foreground truncate mt-1">
                  {activeFestival.styleName}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  Special festive look for your portraits
                </p>
              </div>
            </div>

            <Button size="sm" variant="outline" className="rounded-full text-xs shrink-0 border-border/60 hover:bg-muted">
              Apply
            </Button>
          </div>
        )}

        {/* Grid of Styles */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {selectedCategory} ({filteredStyles.length})
            </p>
          </div>

          {filteredStyles.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground text-sm">
              No styles found matching "{searchQuery}"
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {filteredStyles.map((style) => (
                <StyleCard
                  key={style.name}
                  name={style.name}
                  imageUrl={style.image}
                  prompt={style.prompt}
                  tag={style.category}
                  onClick={() => handleOpenStyle(style)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

            {/* Style Application Modal */}
      <ImageUploadModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        styleName={selectedStyle?.name || "Photorealistic 8K"}
        styleImage={selectedStyle?.image}
        isCelebrityStyle={selectedStyle?.name === "Celebrity Style"}
        discoverText={composerPrompt.trim() || selectedStyle?.prompt}
      />
    </div>
  );
};

export default ImagesSection;
