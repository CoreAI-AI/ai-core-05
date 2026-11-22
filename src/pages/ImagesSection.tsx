import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Search, Sparkles, Wand2, X, Square, Smartphone, Monitor, Download, Share2, Trash2, RefreshCw, FolderHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { TRENDING_PHOTO_STYLES, TEMPLATE_STYLES, type ImageStyleItem } from "@/lib/trendingStylesData";
import { getMyCreations, saveMyCreation, deleteMyCreation, type CreationItem } from "@/lib/creativeStudioStyles";

const ImagesSection = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"Trending" | "Templates">("Trending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<ImageStyleItem | null>(null);
  const [composerPrompt, setComposerPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "16:9" | "9:16">("1:1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [creations, setCreations] = useState<CreationItem[]>([]);
  const [showCreations, setShowCreations] = useState(false);
  const composerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCreations(getMyCreations());
  }, []);

  const activeStyles = activeTab === "Trending" ? TRENDING_PHOTO_STYLES : TEMPLATE_STYLES;

  const filteredStyles = activeStyles.filter((style) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return style.name.toLowerCase().includes(q) || style.prompt.toLowerCase().includes(q);
  });

  const handleSelectStyle = (style: ImageStyleItem) => {
    setSelectedStyle(style);
    setComposerPrompt(style.prompt);
    setShowCreations(false);
    composerInputRef.current?.focus();
    toast.success(`Selected style: ${style.name}`);
  };

  const handleDirectGenerate = async () => {
    const rawPrompt = composerPrompt.trim() || selectedStyle?.prompt || "Cinematic masterpiece portrait";
    const stylePrefix = selectedStyle ? `${selectedStyle.name} style: ` : "";
    const finalPrompt = selectedStyle 
      ? selectedStyle.template.replace("{prompt}", rawPrompt)
      : `${stylePrefix}${rawPrompt}, ultra-detailed, photorealistic, 8k resolution, masterpiece`;

    setIsGenerating(true);

    const dims = aspectRatio === "16:9" 
      ? { w: 1280, h: 720 } 
      : aspectRatio === "9:16" 
      ? { w: 720, h: 1280 } 
      : { w: 1024, h: 1024 };

    const encodedPrompt = encodeURIComponent(finalPrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${dims.w}&height=${dims.h}&model=flux-realism&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;

    try {
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = imageUrl;
        setTimeout(() => resolve(), 3500);
      });

      saveMyCreation({
        prompt: rawPrompt,
        styleName: selectedStyle?.name || "Custom Style",
        imageUrl,
        aspectRatio
      });

      setCreations(getMyCreations());
      setShowCreations(true);
      toast.success("Image generated successfully!");
    } catch {
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadImage = async (url: string, styleName: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `CoreAI-${styleName.replace(/\s+/g, "_")}-${Date.now()}.jpg`;
      a.click();
      toast.success("Downloaded!");
    } catch {
      window.open(url, "_blank");
    }
  };

  const handleDeleteCreation = (id: string) => {
    deleteMyCreation(id);
    setCreations(getMyCreations());
    toast.info("Creation deleted");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Back to chat"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              Images
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative w-40 sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search styles..."
                className="w-full h-8 pl-8 pr-3 text-xs rounded-full bg-muted/60 border border-border/40 text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Creations Toggle */}
            <button
              onClick={() => setShowCreations(!showCreations)}
              className={`p-2 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors ${
                showCreations ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
              title="My Creations"
            >
              <FolderHeart className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">{creations.length}</span>
            </button>
          </div>
        </div>

        {/* 2 TABS: Trending & Templates */}
        <div className="max-w-6xl mx-auto px-4 pb-3 pt-1 flex items-center gap-2">
          {(["Trending", "Templates"] as const).map((tab) => {
            const isActive = activeTab === tab && !showCreations;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setShowCreations(false);
                }}
                className={`text-xs px-4 py-1.5 rounded-full font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-foreground text-background shadow-xs"
                    : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-5 space-y-6 pb-28">
        {/* Floating Prompt Composer */}
        <section className="relative rounded-2xl border border-border/50 bg-gradient-to-b from-muted/30 to-card/60 p-3.5 sm:p-5 backdrop-blur-xl shadow-xs">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[11px] font-semibold tracking-wider text-primary px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
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

              {/* Aspect Ratio Selector */}
              <div className="flex items-center gap-1 bg-background/80 border border-border/60 p-0.5 rounded-full">
                {(["1:1", "16:9", "9:16"] as const).map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setAspectRatio(ratio)}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-medium transition-all ${
                      aspectRatio === ratio ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {ratio === "1:1" && <Square className="w-3 h-3" />}
                    {ratio === "16:9" && <Monitor className="w-3 h-3" />}
                    {ratio === "9:16" && <Smartphone className="w-3 h-3" />}
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            {/* Input & Create Button */}
            <div className="relative flex items-center">
              <input
                ref={composerInputRef}
                value={composerPrompt}
                onChange={(e) => setComposerPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleDirectGenerate();
                  }
                }}
                placeholder={
                  selectedStyle 
                    ? `Describe in ${selectedStyle.name} style...` 
                    : "Describe any image to create, or tap a style below..."
                }
                className="w-full h-11 sm:h-12 pl-3.5 pr-24 sm:pr-28 text-xs sm:text-sm rounded-xl bg-background border border-border/70 text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary shadow-inner"
              />
              <Button
                type="button"
                disabled={isGenerating}
                onClick={handleDirectGenerate}
                className="absolute right-1.5 h-8 sm:h-9 px-3 sm:px-4 rounded-lg bg-foreground text-background hover:opacity-90 font-medium text-xs flex items-center gap-1.5 transition-all disabled:opacity-60"
              >
                {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                <span>{isGenerating ? "Creating..." : "Create"}</span>
              </Button>
            </div>
          </div>
        </section>

        {/* My Creations View */}
        {showCreations ? (
          <section className="space-y-4">
            <h2 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
              <FolderHeart className="w-4 h-4 text-primary" />
              My Creations ({creations.length})
            </h2>

            {creations.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground text-sm border border-dashed border-border/60 rounded-2xl p-6">
                <FolderHeart className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
                <p className="font-medium text-foreground">No creations yet</p>
                <p className="text-xs text-muted-foreground mt-1">Select any style and press Create!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {creations.map((c) => (
                  <div key={c.id} className="group relative aspect-square rounded-xl overflow-hidden border border-border/50 bg-muted/30">
                    <img src={c.imageUrl} alt={c.prompt} className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-between">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleDeleteCreation(c.id)}
                          className="p-1.5 rounded-full bg-black/60 text-white hover:text-destructive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white truncate">{c.styleName}</p>
                        <p className="text-[10px] text-white/70 line-clamp-1">{c.prompt}</p>
                        <button
                          type="button"
                          onClick={() => handleDownloadImage(c.imageUrl, c.styleName)}
                          className="mt-2 w-full py-1 rounded-md bg-white text-black text-[11px] font-medium flex items-center justify-center gap-1"
                        >
                          <Download className="w-3 h-3" /> Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          /* RESPONSIVE GRID: 2 cols mobile, 3 cols tablet, 4-5 cols desktop */
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {activeTab} ({filteredStyles.length})
              </p>
            </div>

            {filteredStyles.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground text-sm">
                No styles found matching "{searchQuery}"
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4">
                {filteredStyles.map((style) => {
                  const isSelected = selectedStyle?.id === style.id;
                  return (
                    <div
                      key={style.id}
                      onClick={() => handleSelectStyle(style)}
                      className={`group relative flex flex-col rounded-xl overflow-hidden cursor-pointer border transition-all duration-200 ${
                        isSelected 
                          ? "ring-2 ring-primary border-primary shadow-md scale-[1.02]" 
                          : "border-border/60 hover:border-foreground/30 hover:shadow-xs"
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <div className="relative aspect-4/5 w-full overflow-hidden bg-muted">
                        <img
                          src={style.image}
                          alt={style.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        
                        {/* Title Badge matching screenshot */}
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-xs sm:text-sm font-semibold text-white drop-shadow-sm leading-tight line-clamp-1">
                            {style.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default ImagesSection;
