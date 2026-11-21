import { useState, useEffect, useMemo, useRef } from "react";
import { ArrowLeft, Search, Sparkles, Wand2, X, Square, Smartphone, Monitor, Download, Share2, Trash2, RefreshCw, FolderHeart, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import StyleCard from "@/components/StyleCard";
import ImageUploadModal from "@/components/ImageUploadModal";
import { toast } from "sonner";
import { 
  CREATIVE_STUDIO_STYLES, 
  CREATIVE_STUDIO_CATEGORIES, 
  buildStylePrompt, 
  getMyCreations, 
  saveMyCreation, 
  deleteMyCreation, 
  type StyleItem, 
  type CreationItem 
} from "@/lib/creativeStudioStyles";
import { 
  getActiveFestival, 
  getTrendingStyles, 
  updateTrendScores, 
  type Festival, 
  type TrendingStyle 
} from "@/lib/festivalDetection";


// 200 Styles across 11 Categories powered by Creative Studio Engine
const allStylesList = CREATIVE_STUDIO_STYLES;
const CATEGORIES = CREATIVE_STUDIO_CATEGORIES;

const ImagesSection = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeTab, setActiveTab] = useState<"explore" | "creations">("explore");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<StyleItem | null>(null);
  const [activeFestival, setActiveFestival] = useState<Festival | null>(null);
  const [composerPrompt, setComposerPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "16:9" | "9:16">("1:1");
  const composerInputRef = useRef<HTMLInputElement>(null);
  const [trendingStyles, setTrendingStyles] = useState<TrendingStyle[]>([]);
  const [creations, setCreations] = useState<CreationItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setCreations(getMyCreations());
  }, []);

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

   const handleOpenStyle = (style: StyleItem) => {
    setSelectedStyle(style);
    if (!composerPrompt.trim()) {
      setComposerPrompt(style.prompt || "");
    }
    composerInputRef.current?.focus();
  };

  const handleDirectGenerate = async () => {
    const finalPrompt = buildStylePrompt(selectedStyle || undefined, composerPrompt, aspectRatio);
    setIsGenerating(true);
    toast.loading("Generating in " + (selectedStyle?.name || "Creative") + " style...", { id: "gen-toast" });

    try {
      const encoded = encodeURIComponent(finalPrompt);
      const seed = Math.floor(Math.random() * 999999);
      const generatedUrl = `https://image.pollinations.ai/prompt/${encoded}?model=flux-realism&seed=${seed}&nologo=true&enhance=true`;

      // Pre-load image to verify
      const img = new Image();
      img.src = generatedUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });

      // Save to My Creations
      const saved = saveMyCreation({
        prompt: composerPrompt.trim() || selectedStyle?.name || "Creative Artwork",
        styleName: selectedStyle?.name || "Photorealistic 8K",
        imageUrl: generatedUrl,
        aspectRatio: aspectRatio
      });

      setCreations(getMyCreations());
      setActiveTab("creations");
      toast.success("Created successfully! Saved to My Creations", { id: "gen-toast" });
    } catch (e) {
      toast.error("Generation error, please try again", { id: "gen-toast" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteCreation = (id: string) => {
    deleteMyCreation(id);
    setCreations(getMyCreations());
    toast.success("Creation removed");
  };

  const handleDownloadImage = (url: string, name: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `coreai-${name.toLowerCase().replace(/\\s+/g, "-")}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image downloading...");
  };

  const handleShareImage = async (url: string, title: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `CoreAI Creation: ${title}`, url });
      } catch {}
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Image link copied to clipboard!");
    }
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
                      <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-semibold tracking-tight text-foreground hidden sm:block">
                Image Styles
              </h1>
              <div className="flex items-center gap-1 bg-muted/50 p-0.5 rounded-full border border-border/50">
                <button
                  type="button"
                  onClick={() => setActiveTab("explore")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    activeTab === "explore" ? "bg-foreground text-background shadow-xs" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Explore (200)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("creations")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    activeTab === "creations" ? "bg-foreground text-background shadow-xs" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <FolderHeart className="w-3.5 h-3.5" />
                  <span>My Creations ({creations.length})</span>
                </button>
              </div>
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
                disabled={isGenerating}
                onClick={handleDirectGenerate}
                className="absolute right-1.5 sm:right-2 h-9 sm:h-10 px-3 sm:px-4 rounded-lg sm:rounded-xl bg-foreground text-background hover:opacity-90 font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-60"
              >
                {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                <span>{isGenerating ? "Creating..." : "Create"}</span>
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
        
        {/* Conditional View: My Creations vs 200 Styles Grid */}
        {activeTab === "creations" ? (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
                <FolderHeart className="w-4 h-4 text-primary" />
                My Creations ({creations.length})
              </h2>
            </div>

            {creations.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground text-sm border border-dashed border-border/60 rounded-2xl p-6">
                <FolderHeart className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
                <p className="font-medium text-foreground">No creations yet</p>
                <p className="text-xs text-muted-foreground mt-1">Pick any style from Explore tab and press Create!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {creations.map((c) => (
                  <div key={c.id} className="group relative aspect-square rounded-2xl overflow-hidden border border-border/50 bg-muted/30">
                    <img src={c.imageUrl} alt={c.prompt} className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-between">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCreation(c.id);
                          }}
                          className="p-1.5 rounded-full bg-black/60 text-white hover:text-destructive backdrop-blur-md transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white truncate">{c.styleName}</p>
                        <p className="text-[10px] text-white/70 line-clamp-1">{c.prompt}</p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadImage(c.imageUrl, c.styleName);
                            }}
                            className="flex-1 py-1 rounded-md bg-white text-black text-[11px] font-medium flex items-center justify-center gap-1 hover:bg-white/90 transition-colors"
                          >
                            <Download className="w-3 h-3" /> Download
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShareImage(c.imageUrl, c.styleName);
                            }}
                            className="p-1 rounded-md bg-white/20 text-white backdrop-blur-md hover:bg-white/30 transition-colors"
                            title="Share"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          /* Grid of 200 Styles */
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
        )}

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
