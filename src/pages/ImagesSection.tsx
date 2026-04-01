import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Sparkles, Flame, Star, PartyPopper, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import StyleCard from "@/components/StyleCard";
import DiscoverCard from "@/components/DiscoverCard";
import ImageUploadModal from "@/components/ImageUploadModal";
import { 
  getContextualStyles, 
  getActiveFestival, 
  getTrendingStyles,
  updateTrendScores,
  type Festival,
  type TrendingStyle
} from "@/lib/festivalDetection";

// Premium styles with prompts for "Try Now" auto-fill
const premiumStyles = [
  { name: "Ghibli Dreamscape", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=400&fit=crop", prompt: "Transform into a Studio Ghibli style anime scene with soft watercolor skies and lush greenery" },
  { name: "3D Pixar Character", image: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400&h=400&fit=crop", prompt: "Convert into a 3D Pixar-style animated character with expressive eyes and smooth rendering" },
  { name: "Cyberpunk Neon", image: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=400&h=400&fit=crop", prompt: "Transform into a cyberpunk neon city scene with glowing lights and futuristic aesthetic" },
  { name: "Oil Painting Classic", image: "https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?w=400&h=400&fit=crop", prompt: "Recreate as a classical oil painting with rich textures and dramatic Renaissance lighting" },
  { name: "Anime Portrait", image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=400&fit=crop", prompt: "Transform into a high-quality anime portrait with detailed eyes and vibrant hair colors" },
  { name: "Watercolor Art", image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=400&fit=crop", prompt: "Convert into a beautiful watercolor painting with soft washes and flowing colors" },
  { name: "Pop Art Bold", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop", prompt: "Transform into bold pop art style with halftone dots, thick outlines and vibrant flat colors" },
  { name: "Retro Vintage", image: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?w=400&h=400&fit=crop", prompt: "Apply retro vintage film look with warm tones, grain, and nostalgic 70s color palette" },
];

// Default styles with prompts
const defaultStyles = [
  { name: "Parisian Postcard", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=400&fit=crop", prompt: "Style as an elegant Parisian postcard with romantic vintage aesthetic" },
  { name: "Bollywood Poster", image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=400&fit=crop", prompt: "Create a dramatic Bollywood movie poster style with vibrant colors" },
  { name: "Mithila", image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=400&fit=crop", prompt: "Transform into Mithila/Madhubani art style with intricate patterns" },
  { name: "Jaipur Textile", image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=400&fit=crop", prompt: "Apply Jaipur block-print textile pattern style with rich colors" },
  { name: "Sari Landscape", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop", prompt: "Transform into a landscape woven like a traditional Indian sari" },
  { name: "Desi Outfit", image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=400&fit=crop", prompt: "Apply traditional Indian outfit styling with ethnic fashion elements" },
  { name: "Sketch", image: "https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?w=400&h=400&fit=crop", prompt: "Convert into a detailed pencil sketch with realistic shading" },
  { name: "Holiday Portrait", image: "https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=400&h=400&fit=crop", prompt: "Create a festive holiday portrait with warm lighting and cozy atmosphere" },
  { name: "Dramatic", image: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=400&h=400&fit=crop", prompt: "Apply dramatic cinematic lighting with high contrast and moody tones" },
  { name: "Cricket Style", image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=400&fit=crop", prompt: "Create a cricket-themed sports portrait with stadium atmosphere" },
  { name: "Football Style", image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=400&fit=crop", prompt: "Create a football-themed sports portrait with dynamic action feel" },
  { name: "Celebrity Style", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop", prompt: "Transform into celebrity red carpet style portrait" },
  { name: "Doodle", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop", prompt: "Convert into a playful hand-drawn doodle illustration" },
  { name: "Sugar Cookie", image: "https://images.unsplash.com/photo-1548848221-0c2e497ed557?w=400&h=400&fit=crop", prompt: "Transform into a decorated sugar cookie art style with icing details" },
  { name: "Inkwork", image: "https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?w=400&h=400&fit=crop", prompt: "Convert into detailed ink illustration with fine crosshatching" },
  { name: "Art School", image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=400&fit=crop", prompt: "Create an art school project style with mixed media and textures" },
  { name: "Fisheye", image: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?w=400&h=400&fit=crop", prompt: "Apply fisheye lens distortion with ultra-wide perspective" },
  { name: "Ornament", image: "https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=400&h=400&fit=crop", prompt: "Transform into decorative ornament style with intricate detailing" },
];

// Discover cards data
const discoverCardsLeft = [
  { text: "Turn my apartment into a storybook", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop" },
  { text: "Reimagine my pet as a human", image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop" },
  { text: "Make them Santa", image: "https://images.unsplash.com/photo-1576919228236-a097c32a5cd4?w=400&h=300&fit=crop" },
  { text: "What would I look like as a K-pop star?", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop" },
  { text: "Give us a matching outfit", image: "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=400&h=300&fit=crop" },
  { text: "Style me", image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=300&fit=crop" },
];

const discoverCardsRight = [
  { text: "Create a professional product photo", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop" },
  { text: "Create a holiday card", image: "https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=400&h=300&fit=crop" },
  { text: "Create a colouring page", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop" },
  { text: "Me as the Girl with a Pearl", image: "https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?w=400&h=300&fit=crop" },
  { text: "Create a professional job photo", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop" },
  { text: "Create a cartoon", image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=300&fit=crop" },
];

const ImagesSection = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<{ name: string; image: string } | null>(null);
  const [isCelebrityStyle, setIsCelebrityStyle] = useState(false);
  const [discoverText, setDiscoverText] = useState<string | undefined>(undefined);
  const [activeFestival, setActiveFestival] = useState<Festival | null>(null);
  const [trendingStyles, setTrendingStyles] = useState<TrendingStyle[]>([]);

  useEffect(() => {
    const festival = getActiveFestival();
    setActiveFestival(festival);
    const trending = getTrendingStyles(8);
    setTrendingStyles(trending);

    const trendInterval = setInterval(() => {
      updateTrendScores();
      setTrendingStyles(getTrendingStyles(8));
    }, 30000);

    return () => clearInterval(trendInterval);
  }, []);

  const displayStyles = useMemo(() => {
    const styles: { name: string; image: string; tag?: string; isFestival?: boolean; isTrending?: boolean }[] = [];

    if (activeFestival) {
      styles.push({
        name: activeFestival.styleName,
        image: "https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?w=400&h=400&fit=crop",
        tag: activeFestival.tag,
        isFestival: true
      });
    }

    trendingStyles.slice(0, 6).forEach(style => {
      styles.push({
        name: style.name,
        image: style.image,
        tag: style.tag,
        isTrending: true
      });
    });

    defaultStyles.forEach(style => {
      if (!styles.find(s => s.name === style.name)) {
        styles.push(style);
      }
    });

    return styles;
  }, [activeFestival, trendingStyles]);

  const handleStyleClick = (style: { name: string; image: string; prompt?: string }) => {
    setSelectedStyle({ name: style.name, image: style.image });
    setIsCelebrityStyle(style.name === "Celebrity Style");
    setDiscoverText(style.prompt || undefined);
    setModalOpen(true);
  };

  const handleDiscoverClick = (card: { text: string; image: string }) => {
    setSelectedStyle({ name: card.text, image: card.image });
    setIsCelebrityStyle(false);
    setDiscoverText(card.text);
    setModalOpen(true);
  };

  const handleFestivalClick = () => {
    if (activeFestival) {
      setSelectedStyle({ 
        name: activeFestival.styleName, 
        image: "https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?w=400&h=400&fit=crop" 
      });
      setIsCelebrityStyle(false);
      setDiscoverText(undefined);
      setModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">Image Styles</h1>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-73px)]">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-10">
          
          {/* Festival Special Banner */}
          {activeFestival && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <PartyPopper className="w-5 h-5 text-primary animate-pulse" />
                <h2 className="text-lg font-bold text-foreground">
                  {activeFestival.tag}
                </h2>
              </div>
              
              <button
                onClick={handleFestivalClick}
                className="w-full relative rounded-2xl overflow-hidden border border-border group"
              >
                <div 
                  className="absolute inset-0 bg-gradient-to-r opacity-80"
                  style={{
                    background: `linear-gradient(135deg, ${activeFestival.colors[0]}40, ${activeFestival.colors[1]}40, ${activeFestival.colors[2]}40)`
                  }}
                />
                <div className="relative p-6 flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-white/30">
                    <img 
                      src="https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?w=400&h=400&fit=crop"
                      alt={activeFestival.styleName}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <Badge className="mb-2 bg-primary/20 text-primary border-primary/30">
                      <Star className="w-3 h-3 mr-1" />
                      Limited Time
                    </Badge>
                    <h3 className="text-xl font-bold text-foreground">{activeFestival.styleName}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Celebrate {activeFestival.name} with this special style!
                    </p>
                  </div>
                  <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                </div>
              </button>
            </section>
          )}

          {/* ✨ Premium Styles Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Premium Styles</h2>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                AI-Powered
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground -mt-2">
              Tap "Try Now" to instantly generate your image
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {premiumStyles.map((style) => (
                <StyleCard
                  key={style.name}
                  name={style.name}
                  imageUrl={style.image}
                  prompt={style.prompt}
                  showTryNow={true}
                  onClick={() => handleStyleClick(style)}
                />
              ))}
            </div>
          </section>

          {/* Trending Now Section */}
          {trendingStyles.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <h2 className="text-2xl font-bold text-foreground">
                  Trending Now
                </h2>
                <Badge variant="secondary" className="bg-orange-500/10 text-orange-500 border-orange-500/30">
                  Live
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {trendingStyles.slice(0, 6).map((style) => (
                  <div key={style.name} className="relative">
                    {style.tag && (
                      <Badge 
                        className="absolute -top-2 -right-2 z-10 text-xs px-2 py-0.5 bg-background border shadow-sm"
                      >
                        {style.tag}
                      </Badge>
                    )}
                    <StyleCard
                      name={style.name}
                      imageUrl={style.image}
                      onClick={() => handleStyleClick({ 
                        name: style.name, 
                        image: style.image, 
                      })}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* All Styles Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              All Styles
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {defaultStyles.map((style) => (
                <StyleCard
                  key={style.name}
                  name={style.name}
                  imageUrl={style.image}
                  prompt={style.prompt}
                  onClick={() => handleStyleClick(style)}
                />
              ))}
            </div>
          </section>

          {/* Discover Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              Discover something new
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                {discoverCardsLeft.map((card) => (
                  <DiscoverCard
                    key={card.text}
                    text={card.text}
                    imageUrl={card.image}
                    onClick={() => handleDiscoverClick(card)}
                  />
                ))}
              </div>
              <div className="space-y-4">
                {discoverCardsRight.map((card) => (
                  <DiscoverCard
                    key={card.text}
                    text={card.text}
                    imageUrl={card.image}
                    onClick={() => handleDiscoverClick(card)}
                  />
                ))}
              </div>
            </div>
          </section>
        </div>
      </ScrollArea>

      <ImageUploadModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        styleName={selectedStyle?.name || ""}
        styleImage={selectedStyle?.image}
        isCelebrityStyle={isCelebrityStyle}
        discoverText={discoverText}
      />
    </div>
  );
};

export default ImagesSection;
