import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Search } from "lucide-react";
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

// Curated aesthetic styles
const allStylesList = [
  { name: "Ghibli Dreamscape", category: "Anime & 3D", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=500&fit=crop", prompt: "Studio Ghibli style anime scene with watercolor skies" },
  { name: "3D Pixar Character", category: "Anime & 3D", image: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400&h=500&fit=crop", prompt: "3D Pixar-style animated character with smooth rendering" },
  { name: "Cyberpunk Neon", category: "Cinematic", image: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=400&h=500&fit=crop", prompt: "Cyberpunk neon city with glowing futuristic aesthetic" },
  { name: "Classical Oil", category: "Artistic", image: "https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?w=400&h=500&fit=crop", prompt: "Classical oil painting with Renaissance lighting and textures" },
  { name: "Anime Portrait", category: "Anime & 3D", image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=500&fit=crop", prompt: "Detailed anime portrait with vibrant colors" },
  { name: "Watercolor Art", category: "Artistic", image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=500&fit=crop", prompt: "Soft watercolor painting with flowing washes" },
  { name: "Retro 70s Film", category: "Cinematic", image: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?w=400&h=500&fit=crop", prompt: "Vintage 35mm film grain with warm nostalgic palette" },
  { name: "Pop Art Bold", category: "Artistic", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=500&fit=crop", prompt: "Bold halftone dot pop art with thick outlines" },
  { name: "Parisian Postcard", category: "Artistic", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=500&fit=crop", prompt: "Vintage Parisian postcard with romantic soft tone" },
  { name: "Bollywood Poster", category: "Cinematic", image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=500&fit=crop", prompt: "Dramatic Bollywood movie poster aesthetic" },
  { name: "Madhubani Art", category: "Artistic", image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=500&fit=crop", prompt: "Intricate traditional Mithila art patterns" },
  { name: "Jaipur Textile", category: "Artistic", image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=500&fit=crop", prompt: "Block-print textile styling with rich royal dyes" },
  { name: "Pencil Sketch", category: "Artistic", image: "https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?w=400&h=500&fit=crop", prompt: "Fine graphite pencil sketch with soft shading" },
  { name: "Moody Cinematic", category: "Cinematic", image: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=400&h=500&fit=crop", prompt: "High contrast cinematic lighting with moody atmosphere" },
  { name: "Fisheye Street", category: "Cinematic", image: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?w=400&h=500&fit=crop", prompt: "Ultra-wide fisheye perspective with street lens flare" },
  { name: "Holiday Glow", category: "Festive", image: "https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=400&h=500&fit=crop", prompt: "Cozy warm bokeh lighting with festive aesthetic" }
];

const CATEGORIES = ["All", "Trending", "Cinematic", "Artistic", "Anime & 3D", "Festive"];

const ImagesSection = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<{ name: string; image: string; prompt?: string } | null>(null);
  const [activeFestival, setActiveFestival] = useState<Festival | null>(null);
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
      list = list.filter(s => trendingNames.has(s.name.toLowerCase()) || s.name.includes("Ghibli") || s.name.includes("Cyberpunk"));
    } else if (selectedCategory !== "All") {
      list = list.filter(s => s.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(s => s.name.toLowerCase().includes(q) || s.prompt.toLowerCase().includes(q));
    }

    return list;
  }, [selectedCategory, searchQuery, trendingStyles]);

  const handleOpenStyle = (style: { name: string; image: string; prompt?: string }) => {
    setSelectedStyle(style);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Sleek Minimalist Sticky Header */}
      <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-xl border-b border-border/40">
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
            <h1 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
              Image Styles
            </h1>
          </div>

          {/* Quick Search Input */}
          <div className="relative w-36 sm:w-64">
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

      {/* Main Content with Native Smooth Scrolling */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 space-y-8 pb-20">
        
        {/* Subtle Festival Banner if active */}
        {activeFestival && selectedCategory === "All" && !searchQuery && (
          <div 
            onClick={() => handleOpenStyle({
              name: activeFestival.styleName,
              image: "https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?w=400&h=400&fit=crop",
              prompt: `Celebrate ${activeFestival.name} in majestic visual style`
            })}
            className="relative rounded-2xl overflow-hidden border border-border/40 bg-card/40 p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:border-foreground/20 transition-all duration-200 group"
          >
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl overflow-hidden shrink-0 border border-border/50">
                <img
                  src="https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?w=400&h=400&fit=crop"
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
        styleName={selectedStyle?.name || ""}
        styleImage={selectedStyle?.image}
        isCelebrityStyle={selectedStyle?.name === "Celebrity Style"}
        discoverText={selectedStyle?.prompt}
      />
    </div>
  );
};

export default ImagesSection;
