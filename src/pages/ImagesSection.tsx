import { useState } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import StyleCard from "@/components/StyleCard";
import DiscoverCard from "@/components/DiscoverCard";
import ImageUploadModal from "@/components/ImageUploadModal";

// Style data with placeholder images
const styles = [
  { name: "New Year Eve", image: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=400&h=400&fit=crop" },
  { name: "Gingerbread", image: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&h=400&fit=crop" },
  { name: "Parisian Postcard", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=400&fit=crop" },
  { name: "Santa's Helper", image: "https://images.unsplash.com/photo-1576919228236-a097c32a5cd4?w=400&h=400&fit=crop" },
  { name: "Iridescent Metal Portrait", image: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&h=400&fit=crop" },
  { name: "Bollywood Poster", image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=400&fit=crop" },
  { name: "Candy Land", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop" },
  { name: "Festival", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=400&fit=crop" },
  { name: "Mithila", image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=400&fit=crop" },
  { name: "Jaipur Textile", image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=400&fit=crop" },
  { name: "Sari Landscape", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop" },
  { name: "Desi Outfit", image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=400&fit=crop" },
  { name: "Sketch", image: "https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?w=400&h=400&fit=crop" },
  { name: "Holiday Portrait", image: "https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=400&h=400&fit=crop" },
  { name: "Dramatic", image: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=400&h=400&fit=crop" },
  { name: "Plushie", image: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=400&h=400&fit=crop" },
  { name: "Retro Anime", image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=400&fit=crop" },
  { name: "Baseball Bobblehead", image: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400&h=400&fit=crop" },
  { name: "Cricket Style", image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=400&fit=crop" },
  { name: "Football Style", image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=400&fit=crop" },
  { name: "Celebrity Style", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" },
  { name: "Doodle", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop" },
  { name: "Sugar Cookie", image: "https://images.unsplash.com/photo-1548848221-0c2e497ed557?w=400&h=400&fit=crop" },
  { name: "3D Glam Doll", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop" },
  { name: "Inkwork", image: "https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?w=400&h=400&fit=crop" },
  { name: "Art School", image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=400&fit=crop" },
  { name: "Fisheye", image: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?w=400&h=400&fit=crop" },
  { name: "Ornament", image: "https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=400&h=400&fit=crop" },
];

// Discover cards data
const discoverCardsLeft = [
  { text: "Turn my apartment into a storybook", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop" },
  { text: "Reimagine my pet as a human", image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop" },
  { text: "Make them Santa", image: "https://images.unsplash.com/photo-1576919228236-a097c32a5cd4?w=400&h=300&fit=crop" },
  { text: "What would I look like as a K-pop star?", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop" },
  { text: "Give us a matching outfit", image: "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=400&h=300&fit=crop" },
  { text: "Style me", image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=300&fit=crop" },
  { text: "Create a professional product photo", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop" },
  { text: "Create a holiday card", image: "https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=400&h=300&fit=crop" },
  { text: "Create a colouring page", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop" },
  { text: "Redecorate my room", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&h=300&fit=crop" },
  { text: "Turn into a keychain", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop" },
  { text: "Create a cartoon", image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=300&fit=crop" },
];

const discoverCardsRight = [
  { text: "Give them a bowl", image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop" },
  { text: "Me as the Girl with a Pearl", image: "https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?w=400&h=300&fit=crop" },
  { text: "Create a professional job photo", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop" },
  { text: "Remove people in the background", image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=300&fit=crop" },
];

const ImagesSection = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<{ name: string; image: string } | null>(null);
  const [isCelebrityStyle, setIsCelebrityStyle] = useState(false);
  const [discoverText, setDiscoverText] = useState<string | undefined>(undefined);

  const handleStyleClick = (style: { name: string; image: string }) => {
    setSelectedStyle(style);
    setIsCelebrityStyle(style.name === "Celebrity Style");
    setDiscoverText(undefined);
    setModalOpen(true);
  };

  const handleDiscoverClick = (card: { text: string; image: string }) => {
    setSelectedStyle({ name: card.text, image: card.image });
    setIsCelebrityStyle(false);
    setDiscoverText(card.text);
    setModalOpen(true);
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
          {/* Try a style section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              Try a style on an image
            </h2>
            
            {/* Styles Grid - 3 columns */}
            <div className="grid grid-cols-3 gap-3">
              {styles.map((style) => (
                <StyleCard
                  key={style.name}
                  name={style.name}
                  imageUrl={style.image}
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
            
            {/* 2-column layout */}
            <div className="grid grid-cols-2 gap-4">
              {/* Left Column */}
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
              
              {/* Right Column */}
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

      {/* Image Upload Modal */}
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
