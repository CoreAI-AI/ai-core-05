// CoreAI Creative Studio - 200 Unique Styles & 11 Categories Engine

export interface StyleItem {
  id: string;
  name: string;
  category: string;
  image: string;
  prompt: string;
  template: string;
}

export interface CreationItem {
  id: string;
  prompt: string;
  styleName: string;
  imageUrl: string;
  aspectRatio: "1:1" | "16:9" | "9:16";
  createdAt: number;
}

export const CREATIVE_STUDIO_CATEGORIES = [
  "All",
  "Trending",
  "Cinematic & Photography",
  "Anime & Manga",
  "3D & CGI Animation",
  "Indian & Heritage",
  "Fine Art & Masters",
  "Digital Art & Sci-Fi",
  "Festivals & Lights",
  "Comics & Illustration",
  "High Fashion & Glamour",
  "Dark Fantasy & Myth",
  "Minimalist & Modern"
];

// Helper to generate 200 unique styles with HD Unsplash preview and individual prompt templates
const generate200Styles = (): StyleItem[] => {
  const baseCategories = [
    {
      cat: "Cinematic & Photography",
      styles: [
        { name: "Photorealistic 8K", img: "photo-1534528741775-53994a69daeb", desc: "Hyper-realistic studio portrait with skin textures", tpl: "{prompt}, 8k UHD portrait, hyperrealistic, rembrandt lighting, sharp focus, 85mm lens, masterpiece" },
        { name: "Kodak Portra 400", img: "photo-1533158326339-7f3cf2404354", desc: "Authentic 35mm film grain with warm vintage tones", tpl: "{prompt}, shot on 35mm Kodak Portra 400, natural film grain, golden hour tones, candid realism" },
        { name: "IMAX 70mm Epic", img: "photo-1506744038136-46273834b3fb", desc: "Sweeping widescreen cinematic composition with anamorphic flare", tpl: "{prompt}, IMAX 70mm movie still, Christopher Nolan cinematography, anamorphic lens flare, photoreal" },
        { name: "Golden Hour Glow", img: "photo-1512389142860-9c449e58a814", desc: "Soft amber twilight with atmospheric sun rays", tpl: "{prompt}, bathed in warm golden hour sunset lighting, soft sun rays, glowing atmospheric bokeh" },
        { name: "Moody Film Noir", img: "photo-1509114397022-ed747cca3f65", desc: "High contrast black and white with dramatic shadows", tpl: "{prompt}, classic film noir 1940s style, dramatic Venetian blind shadows, high contrast chiaroscuro" },
        { name: "National Geographic Wildlife", img: "photo-1546182990-dffeafbe841d", desc: "Crisp macro wildlife photography with telephoto blur", tpl: "{prompt}, National Geographic wildlife photography, 600mm telephoto lens, tack sharp details" },
        { name: "Underwater Ethereal", img: "photo-1682687220063-4742bd7fd538", desc: "Sunken light beams with weightless aquatic aesthetics", tpl: "{prompt}, submerged underwater photography, shimmering light caustic rays, ethereal floating particles" },
        { name: "Cyberpunk Street 2099", img: "photo-1518834107812-67b0b7c58434", desc: "Rainy neon-drenched dystopian megacity", tpl: "{prompt}, cyberpunk neon city streets in rain, holographic billboards, teal and magenta reflective glow" },
        { name: "Drone Aerial Masterpiece", img: "photo-1507525428034-b723cf961d3e", desc: "Top-down bird's eye vista with grand geometry", tpl: "{prompt}, high altitude drone aerial photography, top-down perspective, majestic natural patterns" },
        { name: "Macro Dewdrop World", img: "photo-1518531933037-91b2f5f229cc", desc: "Extreme close-up reflection inside morning dewdrop", tpl: "{prompt}, extreme macro photography, crystalline water droplet reflection, vibrant microscopic detail" },
        { name: "Vintage 1920s Sepia", img: "photo-1516589178581-6cd7833ae3b2", desc: "Aged textured silver gelatin daguerreotype", tpl: "{prompt}, 1920s vintage sepia daguerreotype, aged parchment borders, authentic historical patina" },
        { name: "Arctic Aurora Borealis", img: "photo-1517411032315-54ef2cb783bb", desc: "Emerald northern lights dancing over snowy peaks", tpl: "{prompt}, vivid green aurora borealis night sky, reflecting on frozen arctic glacier, long exposure" },
        { name: "Monochrome Minimalist", img: "photo-1508739773434-c26b3d09e071", desc: "Stark isolated subject against clean white negative space", tpl: "{prompt}, fine art black and white minimalism, high key lighting, profound negative space composition" },
        { name: "Lomography Color Shift", img: "photo-1508919801845-fc2ae1bc2a28", desc: "Quirky saturated cross-processed toy camera look", tpl: "{prompt}, authentic Lomography Diana camera, experimental cross-processed saturated colors, vignetted edge" },
        { name: "Studio Ringlight Portrait", img: "photo-1531746020798-e6953c6e8e04", desc: "Flawless catchlight reflections with porcelain skin", tpl: "{prompt}, commercial beauty photography, circular ringlight catchlight in eyes, clean studio backdrop" },
        { name: "Double Exposure Nature", img: "photo-1518495973542-4542c06a5843", desc: "Silhouetted profile blended with pine forests", tpl: "{prompt}, creative double exposure art, human silhouette blended seamlessly with foggy mountain forest" },
        { name: "Prism Light Fracture", img: "photo-1550684848-fac1c5b4e853", desc: "Rainbow spectral flares splitting through glass crystal", tpl: "{prompt}, crystal prism refraction photography, vibrant rainbow light leaks, dreamy spectral reflections" },
        { name: "Volcanic Ash & Ember", img: "photo-1509316975850-ff9c5deb0cd9", desc: "Dark molten magma glow through heavy smoke", tpl: "{prompt}, active volcanic eruption atmosphere, glowing orange magma embers, billowing dark ash clouds" },
        { name: "Desert Mirage Heatwave", img: "photo-1509316975850-ff9c5deb0cd9", desc: "Rippling heat shimmer over vast golden dunes", tpl: "{prompt}, endless Sahara sand dunes, rippling heat haze mirage, harsh blinding desert sun" },
        { name: "Urban Street Candid", img: "photo-1477959858617-67f30bc75b82", desc: "Raw Cartier-Bresson decisive moment in Tokyo", tpl: "{prompt}, candid Tokyo street photography, Henri Cartier-Bresson decisive moment, natural motion blur" }
      ]
    },
    {
      cat: "Anime & Manga",
      styles: [
        { name: "Studio Ghibli Lush", img: "photo-1506744038136-46273834b3fb", desc: "Hand-painted scenic clouds and pastoral tranquility", tpl: "{prompt}, Studio Ghibli anime style, painted gouache cloudscapes, lush rolling green hills, Hayao Miyazaki aesthetic" },
        { name: "Makoto Shinkai Sky", img: "photo-1578632767115-351597cf2477", desc: "Brilliant celestial lens flare with photoreal anime skies", tpl: "{prompt}, Makoto Shinkai Your Name aesthetic, hyper-detailed twilight sky, dazzling lens flares, anime masterpiece" },
        { name: "Retro 90s Cel Shaded", img: "photo-1578632767115-351597cf2477", desc: "Classic Sailor Moon and Evangelion hand-drawn anime cel", tpl: "{prompt}, 1990s retro anime screencap, hand-painted cel animation, nostalgic VHS tape warmth, bold line art" },
        { name: "Cyber Neon Mecha", img: "photo-1518834107812-67b0b7c58434", desc: "Futuristic armored mecha pilot with HUD overlays", tpl: "{prompt}, futuristic mecha anime hero, glowing sci-fi visor, mechanical exo-armor, neon holographic displays" },
        { name: "Dark Shonen Battle", img: "photo-1563089145-599997674d42", desc: "Fiery aura burst with dynamic perspective lines", tpl: "{prompt}, intense Shonen battle manga climax, dynamic perspective speed lines, crackling elemental energy aura" },
        { name: "Chibi Kawaii Mascot", img: "photo-1566577739112-5180d4bf9390", desc: "Oversized sparkling eyes with pastel adorable proportions", tpl: "{prompt}, ultra-cute chibi anime character, oversized sparkly eyes, pastel color palette, sticker art clean line" },
        { name: "Manga Monochrome Ink", img: "photo-1544717305-2782549b5136", desc: "Crisp black G-pen ink with halftone screen tones", tpl: "{prompt}, Japanese manga page panel, traditional screentone shading, meticulous G-pen black ink cross-hatch" },
        { name: "Cyberpunk Edgerunner", img: "photo-1509198397868-475647b2a1e5", desc: "Hiroyuki Imaishi high-octane neon hyper-stylization", tpl: "{prompt}, Studio Trigger style, hyper-stylized saturated colors, extreme perspective foreshortening, anime action" },
        { name: "Shojo Floral Sparkle", img: "photo-1460661419201-fd4cecdf8a8b", desc: "Dreamy pastel blossoms and gentle romantic breeze", tpl: "{prompt}, classic Shojo anime romantic art, floating cherry blossom petals, soft glowing sparkles, watercolor tones" },
        { name: "Isekai Fantasy World", img: "photo-1518709268805-4e9042af9f23", desc: "Floating crystal islands and mythical luminescent flora", tpl: "{prompt}, vibrant Isekai anime fantasy landscape, floating floating castle islands, magical glowing flowers" },
        { name: "Samurai Champloo Lo-Fi", img: "photo-1579762715118-a6f1d4b934f1", desc: "Ukiyo-e woodblock blended with urban hip-hop anime", tpl: "{prompt}, Samurai Champloo aesthetic, Japanese Edo period woodblock meets modern streetwear, lo-fi chill anime art" },
        { name: "Demon Slayer Katana Aura", img: "photo-1626785774573-4b799315345d", desc: "Swirling fluid tidal wave blade strikes", tpl: "{prompt}, Ufotable animation style, traditional Japanese ukiyo-e fluid water breathing particle effects, dynamic slice" },
        { name: "Steampunk Airship Pilot", img: "photo-1513364776144-60967b0f800f", desc: "Brass goggles and leather aviator anime aesthetic", tpl: "{prompt}, steampunk anime adventurer, brass gears and clockwork mechanisms, copper airship deck in clouds" },
        { name: "Gothic Lolita Moon", img: "photo-1509114397022-ed747cca3f65", desc: "Intricate black lace and Victorian moonlight mystery", tpl: "{prompt}, Gothic anime illustration, elaborate Victorian lace dress, velvet ribbons, crimson moonlit balcony" },
        { name: "Slice of Life Golden Hour", img: "photo-1512389142860-9c449e58a814", desc: "Quiet suburban train crossing bathed in sunset light", tpl: "{prompt}, peaceful slice of life anime scene, Japanese railroad crossing, long late afternoon shadows, nostalgic warmth" },
        { name: "Vaporwave Anime 80s", img: "photo-1550684848-fac1c5b4e853", desc: "City pop aesthetic with purple gridlines and palms", tpl: "{prompt}, 1980s Japanese City Pop album cover, retro anime girl, purple neon sunset, wireframe grid synthwave" },
        { name: "Pixel Art 16-Bit JRPG", img: "photo-1550745165-9bc0b252726f", desc: "Nostalgic SNES game sprite aesthetic", tpl: "{prompt}, 16-bit pixel art, classic SNES JRPG cutscene, masterfully crafted pixel shading, isometric charm" },
        { name: "Webtoon Manhwa Action", img: "photo-1578632767115-351597cf2477", desc: "Glossy digital lighting with Korean webtoon punch", tpl: "{prompt}, high-production Korean Webtoon manhwa art, dramatic downward angle, crisp digital cell coloring" },
        { name: "Watercolor Anime Sketch", img: "photo-1460661419201-fd4cecdf8a8b", desc: "Loose translucent water droplets over clean ink lines", tpl: "{prompt}, lighthearted anime character sketch, soft pastel watercolor washes bleeding gently on rough textured paper" },
        { name: "Dark Fantasy Berserk Style", img: "photo-1544717305-2782549b5136", desc: "Gritty dark ink hatching with mythical dread", tpl: "{prompt}, Kentaro Miura inspired dark fantasy manga art, hyper-detailed crosshatching, grim gothic atmosphere" }
      ]
    },
    {
      cat: "3D & CGI Animation",
      styles: [
        { name: "Pixar Animated Hero", img: "photo-1566577739112-5180d4bf9390", desc: "Expressive 3D character with subsurface scattering", tpl: "{prompt}, 3D Disney Pixar character design, soft subsurface scattering skin, expressive stylized facial features, octane render" },
        { name: "Unreal Engine 5 Photoreal", img: "photo-1534528741775-53994a69daeb", desc: "Nanite and Lumen next-gen real-time 3D graphics", tpl: "{prompt}, rendered in Unreal Engine 5, Lumen global illumination, Nanite micro-polygon geometry, raytraced reflections" },
        { name: "Claymation Stop Motion", img: "photo-1513364776144-60967b0f800f", desc: "Aardman plasticine tactile textures with thumbprints", tpl: "{prompt}, handcrafted claymation figure, subtle real clay fingerprints, tactile stop-motion lighting, studio miniature" },
        { name: "Low-Poly Isometric Island", img: "photo-1518709268805-4e9042af9f23", desc: "Charming geometric diorama with ambient occlusion", tpl: "{prompt}, charming low-poly 3D isometric diorama, faceted clean polygons, soft pastel palette, tilt-shift lens" },
        { name: "Cinema4D Metallic Glass", img: "photo-1550684848-fac1c5b4e853", desc: "Liquid iridescent chrome and refractive frosted glass", tpl: "{prompt}, abstract 3D composition in Cinema 4D, liquid chrome orbs, frosted glass caustics, Octane render" },
        { name: "Toy Story Plastic Gloss", img: "photo-1566577739112-5180d4bf9390", desc: "Glossy molded plastic action figure with packaging box", tpl: "{prompt}, glossy toy collectible figurine, painted PVC plastic texture, studio product photography spotlight" },
        { name: "Voxel Art Sandbox", img: "photo-1550745165-9bc0b252726f", desc: "Charming blocky Minecraft 3D cubic universe", tpl: "{prompt}, vibrant voxel art 3D world, sharp cubic voxels, raytraced blocky landscape, whimsical atmosphere" },
        { name: "Blender Eevee Stylized", img: "photo-1578632767115-351597cf2477", desc: "Smooth modern stylized PBR materials with rim light", tpl: "{prompt}, stylized 3D art in Blender, smooth hand-painted textures, vibrant rim lighting, clean silhouette" },
        { name: "Hyper-Detailed Mecha 3D", img: "photo-1518834107812-67b0b7c58434", desc: "Intricate robotic hydraulics, carbon fiber panels", tpl: "{prompt}, 3D hard surface mecha render, brushed titanium armor plates, carbon fiber weave, exposed hydraulic cables" },
        { name: "Papercraft 3D Cutout", img: "photo-1513364776144-60967b0f800f", desc: "Layered textured cardstock paper with cast shadows", tpl: "{prompt}, 3D layered papercraft illustration, textured colored paper cutouts with delicate drop shadows, clean craft" },
        { name: "Felt Wool Needle-Craft", img: "photo-1566577739112-5180d4bf9390", desc: "Cozy fuzzy needle-felted miniature sculpture", tpl: "{prompt}, needle-felted wool sculpture, fuzzy tactile yarn fibers, warm cozy handcrafted lighting" },
        { name: "Marble Classical Bust 3D", img: "photo-1579762715118-a6f1d4b934f1", desc: "Carved Carrara marble sculpture with translucent stone", tpl: "{prompt}, classical 3D Roman marble statue, translucent Carrara marble subsurface glow, museum pedestal spotlight" },
        { name: "Futuristic Hologram 3D", img: "photo-1550684848-fac1c5b4e853", desc: "Translucent blue sci-fi scanline particle cloud", tpl: "{prompt}, glowing 3D sci-fi holographic projection, blue volumetric light lines, floating HUD data rings" },
        { name: "Steampunk Clockwork 3D", img: "photo-1509198397868-475647b2a1e5", desc: "Interlocking brass cogs, steam pipes and gauges", tpl: "{prompt}, complex 3D clockwork automaton, polished brass and bronze gears, hissing steam pressure valves" },
        { name: "Bioluminescent 3D Creature", img: "photo-1682687220063-4742bd7fd538", desc: "Avatar Pandora style glowing organic creature", tpl: "{prompt}, bioluminescent fantasy creature 3D model, glowing neon tendrils, deep oceanic glow, ZBrush sculpt" },
        { name: "Gold Leaf Kintsugi 3D", img: "photo-1582562124811-c09040d0a901", desc: "Ceramic porcelain fractured and mended with molten gold", tpl: "{prompt}, 3D ceramic vase with Japanese Kintsugi gold lacquer repair seams, glossy white porcelain glaze" },
        { name: "CGI Fantasy Dragon 3D", img: "photo-1518709268805-4e9042af9f23", desc: "Iridescent scales with smoke billowing from nostrils", tpl: "{prompt}, photorealistic CGI dragon, iridescent reptilian scales, curling smoke from nostrils, cinematic composition" },
        { name: "Miniature Tilt-Shift City", img: "photo-1477959858617-67f30bc75b82", desc: "Toy-like bustling metropolis miniature effect", tpl: "{prompt}, tilt-shift miniature 3D city, shallow depth of field, tiny toy cars and pedestrians, vibrant clarity" },
        { name: "Crystalline Geode 3D", img: "photo-1518531933037-91b2f5f229cc", desc: "Raw amethyst crystal hollow with faceted refractions", tpl: "{prompt}, 3D geode mineral hollow, shimmering raw purple amethyst crystals, light fracturing through quartz facets" },
        { name: "Neon Cyber Glitch 3D", img: "photo-1518834107812-67b0b7c58434", desc: "Displaced RGB chromatic aberration polygons", tpl: "{prompt}, fragmented 3D model, RGB chromatic aberration glitch displacement, digital data corruption aesthetic" }
      ]
    },
    {
      cat: "Indian & Heritage",
      styles: [
        { name: "Royal Rajputi Heritage", img: "photo-1582562124811-c09040d0a901", desc: "Majestic palace courtyards with gold embroidered silks", tpl: "{prompt}, royal Rajasthani palace courtyard, ornate jharokha balconies, regal golden zardozi silk embroidery, majestic grandeur" },
        { name: "Madhubani Mithila Folk", img: "photo-1607604276583-eef5d076aa5f", desc: "Traditional line art with sacred peacocks and lotus motifs", tpl: "{prompt}, authentic Mithila Madhubani folk art, double line borders, vibrant natural vegetable dyes, peacock and floral patterns" },
        { name: "Jaipur Indigo Block-Print", img: "photo-1558171813-4c088753af8f", desc: "Hand-pressed wooden block motifs with natural dyes", tpl: "{prompt}, traditional Jaipur wooden block print textile, rich indigo and turmeric saffron dyes, floral bootis pattern" },
        { name: "Tanjore Gold Foil Sacred", img: "photo-1582562124811-c09040d0a901", desc: "22K gold foil embossing with inlaid semi-precious gems", tpl: "{prompt}, classical Thanjavur Tanjore painting, relief gesso work overlaid with pure 22K gold foil, sparkling gem inlays" },
        { name: "Mughal Miniature Darbar", img: "photo-1579762715118-a6f1d4b934f1", desc: "Intricate Persian-influenced imperial court miniature", tpl: "{prompt}, Mughal miniature painting style, ultra-fine squirrel-hair brushstrokes, gold leaf accents, imperial darbar elegance" },
        { name: "Warli Tribal White Ink", img: "photo-1544717305-2782549b5136", desc: "Sacred geometric white rice paste art on red ochre mud", tpl: "{prompt}, traditional Warli tribal art, geometric white rice paste figures, earthen terracotta red mud wall background" },
        { name: "Kerala Temple Mural", img: "photo-1607604276583-eef5d076aa5f", desc: "Sanskrit epic frescoes with saffron ochre tones", tpl: "{prompt}, traditional Kerala temple mural painting, bold curved outlines, saffron ochre and green natural pigments" },
        { name: "Pattachitra Odisha Scroll", img: "photo-1558171813-4c088753af8f", desc: "Intricate mythological cloth scroll storytelling", tpl: "{prompt}, Odisha Pattachitra scroll painting, fine mythological narrative details, floral border motifs, cloth canvas" },
        { name: "Bollywood Cinema 70s Retro", img: "photo-1626785774573-4b799315345d", desc: "Hand-painted billboard with dramatic hero lighting", tpl: "{prompt}, vintage hand-painted Bollywood cinema poster, dramatic expressive portraits, bold retro Hindi film typography" },
        { name: "Pichwai Lotus Shrinathji", img: "photo-1604948501466-4e9c339b9c24", desc: "Sacred lotus pond devotees in Nathdwara devotion", tpl: "{prompt}, sacred Nathdwara Pichwai painting, blooming pink lotuses, sacred cows, midnight blue temple backdrop" },
        { name: "Kashmiri Papier-Mache Gold", img: "photo-1582562124811-c09040d0a901", desc: "Intricate floral naqashi motifs with fine gold lacquer", tpl: "{prompt}, exquisite Kashmiri papier-mache craft, swirling floral chinar leaf patterns, polished gold and lacquer finish" },
        { name: "Chola Bronze Sacred Idol", img: "photo-1579762715118-a6f1d4b934f1", desc: "Ancient cire-perdue lost wax bronze statue patina", tpl: "{prompt}, ancient Chola dynasty sacred bronze sculpture, graceful Nataraja posture, dark antique bronze patina" },
        { name: "Phad Folk Hero Ballad", img: "photo-1558171813-4c088753af8f", desc: "Rajasthani 30-foot scroll painting of warrior legends", tpl: "{prompt}, Rajasthani Phad scroll painting, folk hero epic narrative, vibrant yellow, red and green natural pigments" },
        { name: "Gond Forest Wildlife Art", img: "photo-1518531933037-91b2f5f229cc", desc: "Luminous dotted patterns depicting sacred trees and birds", tpl: "{prompt}, authentic Gond tribal art, intricate dot and line textures, vibrant sacred forest animals, lively colors" },
        { name: "Kalamkari Hand-Drawn Myth", img: "photo-1607604276583-eef5d076aa5f", desc: "Bamboo pen drawn Ramayana scenes with natural dyes", tpl: "{prompt}, Srikalahasti Kalamkari textile art, drawn with bamboo kalam pen, earthy natural dyes, mythological grace" },
        { name: "Banarasi Silk Brocade", img: "photo-1515886657613-9f3515b0c78f", desc: "Shimmering silver zari threads woven into royal ruby silk", tpl: "{prompt}, royal Banarasi silk brocade fabric, shimmering gold zari weave, intricate Mughal floral jaal embroidery" },
        { name: "Ajanta Cave Sacred Fresco", img: "photo-1579762715118-a6f1d4b934f1", desc: "Ancient 2nd century BC rock-cut Buddhist monastery art", tpl: "{prompt}, ancient Ajanta cave fresco, serene Bodhisattva compassionate gaze, weathered rock-cut antique patina" },
        { name: "Varanasi Ganga Ghat Aarti", img: "photo-1604948501466-4e9c339b9c24", desc: "Twinkling brass lamps reflecting on sacred river waters", tpl: "{prompt}, majestic Varanasi Ganga Aarti ceremony at twilight, tiered brass fire lamps, floating diyas on river Ganga" },
        { name: "Hawa Mahal Amber Jaali", img: "photo-1582562124811-c09040d0a901", desc: "Pink sandstone lattice window screening morning sunlight", tpl: "{prompt}, intricate pink sandstone jaali screen of Jaipur Hawa Mahal, geometric sunbeams casting lace shadows" },
        { name: "Kolam Rangoli Sacred Geometry", img: "photo-1604948501466-4e9c339b9c24", desc: "Symmetrical white rice flour floor mandala at dawn", tpl: "{prompt}, sacred South Indian Kolam Rangoli pattern, white rice powder geometric symmetry, fresh marigold flower petals" }
      ]
    },
    {
      cat: "Fine Art & Masters",
      styles: [
        { name: "Van Gogh Starry Night", img: "photo-1579762715118-a6f1d4b934f1", desc: "Turbulent swirling impasto brushstrokes with vibrant blues", tpl: "{prompt}, painted by Vincent van Gogh, thick impasto oil paint texture, swirling starry sky, emotional post-impressionism" },
        { name: "Leonardo Da Vinci Chiaroscuro", img: "photo-1544717305-2782549b5136", desc: "Subtle sfumato gradients and Renaissance draftsmanship", tpl: "{prompt}, High Renaissance oil painting by Leonardo da Vinci, delicate sfumato blending, dramatic chiaroscuro shadow" },
        { name: "Claude Monet Water Lilies", img: "photo-1460661419201-fd4cecdf8a8b", desc: "Dappled plein-air sunlight and impressionist reflections", tpl: "{prompt}, French Impressionism by Claude Monet, soft dappled pond reflections, loose atmospheric brushwork, pastel palette" },
        { name: "Pablo Picasso Cubist", img: "photo-1513364776144-60967b0f800f", desc: "Deconstructed geometric perspectives and bold abstraction", tpl: "{prompt}, synthetic cubism by Pablo Picasso, fractured geometric planes, multiple viewpoints simultaneously, bold colors" },
        { name: "Gustav Klimt Golden Gild", img: "photo-1582562124811-c09040d0a901", desc: "Ornate Vienna Secessionist gold leaf mosaics", tpl: "{prompt}, Vienna Secession masterpiece by Gustav Klimt, shimmering gold leaf patterns, decorative swirling mosaics" },
        { name: "Rembrandt Dramatic Shadow", img: "photo-1534528741775-53994a69daeb", desc: "Warm golden spotlight piercing deep Dutch shadows", tpl: "{prompt}, masterpiece by Rembrandt van Rijn, rich golden impasto highlight, psychological depth, deep rich shadows" },
        { name: "Salvador Dali Surrealism", img: "photo-1518709268805-4e9042af9f23", desc: "Melting dreamscape with bizarre symbolic realism", tpl: "{prompt}, surrealist dream painting by Salvador Dali, melting organic forms, hyper-realistic desert horizon, strange symbolism" },
        { name: "Katsushika Hokusai Great Wave", img: "photo-1579762715118-a6f1d4b934f1", desc: "Prussian blue woodblock print with foaming crested waves", tpl: "{prompt}, traditional Japanese ukiyo-e woodblock print by Hokusai, Prussian blue crashing wave crests, Mount Fuji backdrop" },
        { name: "Michelangelo Sistine Fresco", img: "photo-1579762715118-a6f1d4b934f1", desc: "Sculptural muscular figures on Renaissance vaulted plaster", tpl: "{prompt}, Sistine Chapel ceiling fresco by Michelangelo, monumental sculpted human forms, classical drapery, Renaissance mastery" },
        { name: "Edvard Munch Expressionist", img: "photo-1509114397022-ed747cca3f65", desc: "Raw emotional contours and blood orange twilight sky", tpl: "{prompt}, expressionist painting in the style of The Scream by Edvard Munch, undulating distorted lines, raw psychological tension" },
        { name: "Johannes Vermeer Pearl Earring", img: "photo-1531746020798-e6953c6e8e04", desc: "Tender daylight softly entering a quiet Dutch studio window", tpl: "{prompt}, Johannes Vermeer Dutch Golden Age painting, luminous window daylight, ultramarine blue turban, pearl reflection" },
        { name: "Georgia O'Keeffe Botanical", img: "photo-1460661419201-fd4cecdf8a8b", desc: "Monumental sensual floral curves with desert gradients", tpl: "{prompt}, monumental modernist botanical painting by Georgia O'Keeffe, enlarged sensual floral petals, clean bold gradients" },
        { name: "Caravaggio Violent Light", img: "photo-1509114397022-ed747cca3f65", desc: "Tenebrism with sudden theatrical beam piercing pure black", tpl: "{prompt}, dramatic Baroque tenebrism by Caravaggio, piercing theatrical beam of light, visceral realistic emotional expression" },
        { name: "Henri Matisse Fauvist Cutouts", img: "photo-1513364776144-60967b0f800f", desc: "Joyful pure unmixed gouache paper shapes", tpl: "{prompt}, Henri Matisse Fauvist paper cutout collages, joyful bold saturated shapes, rhythmically arranged organic contours" },
        { name: "William Turner Tempest Ocean", img: "photo-1506744038136-46273834b3fb", desc: "Whirling steam, fiery atmospheric vortex of sea and sky", tpl: "{prompt}, Romanticist seascape by J.M.W. Turner, swirling atmospheric mist, fiery golden sunlight through stormy ocean spray" },
        { name: "Frida Kahlo Symbolic Folk", img: "photo-1515886657613-9f3515b0c78f", desc: "Intimate self-portrait with thorns and Mexican flora", tpl: "{prompt}, Mexican magical realism painting by Frida Kahlo, lush tropical flora, symbolic thorns and butterflies, vibrant folk art" },
        { name: "Alphonse Mucha Art Nouveau", img: "photo-1582562124811-c09040d0a901", desc: "Flowing sinuous hair, pastel florals, circular halos", tpl: "{prompt}, Art Nouveau poster illustration by Alphonse Mucha, sinuous swirling hair, delicate floral arabesques, pastel tones" },
        { name: "Caspar Friedrich Wanderer Mist", img: "photo-1506744038136-46273834b3fb", desc: "Solitary back-turned figure gazing over sea of clouds", tpl: "{prompt}, German Romanticism by Caspar David Friedrich, solitary figure atop rocky peak overlooking vast sea of fog" },
        { name: "Piet Mondrian De Stijl", img: "photo-1513364776144-60967b0f800f", desc: "Asymmetrical black grids with primary red, blue, yellow", tpl: "{prompt}, De Stijl neoplasticism by Piet Mondrian, strict black grid lines, bold primary colors red yellow blue on white" },
        { name: "Jackson Pollock Action Drip", img: "photo-1550684848-fac1c5b4e853", desc: "Energetic layered enamel paint splatters on canvas", tpl: "{prompt}, abstract expressionist action painting by Jackson Pollock, dynamic layered enamel splatters, rhythmic tangled drips" }
      ]
    },
    {
      cat: "Digital Art & Sci-Fi",
      styles: [
        { name: "Futuristic Megacity 2150", img: "photo-1518834107812-67b0b7c58434", desc: "Tiered kilometers-high skyway towers with flying cruisers", tpl: "{prompt}, futuristic 22nd century utopia city, soaring glass skyscrapers, flying hover vehicles, sleek solar skyways" },
        { name: "Synthwave Sunset Grid", img: "photo-1550684848-fac1c5b4e853", desc: "Retro 80s wireframe grid with neon magenta sun", tpl: "{prompt}, 80s synthwave outrun aesthetic, glowing wireframe grid highway, neon chrome typography, oversized magenta sunset" },
        { name: "Deep Space Nebula Voyage", img: "photo-1517411032315-54ef2cb783bb", desc: "Stellar birth gas clouds with distant twin suns", tpl: "{prompt}, deep space nebula astronomy photography, glowing cosmic dust clouds, shimmering star clusters, distant exoplanet" },
        { name: "Steampunk Clockwork Airship", img: "photo-1509198397868-475647b2a1e5", desc: "Victorian dirigible with riveted bronze plates", tpl: "{prompt}, steampunk dirigible airship soaring through clouds, polished brass propellers, Victorian rivets, barometer gauges" },
        { name: "Bioluminescent Alien Jungle", img: "photo-1682687220063-4742bd7fd538", desc: "Glowing mushroom spores and luminescent flora", tpl: "{prompt}, bioluminescent extraterrestrial jungle at night, glowing neon spores, translucent alien fauna, mystical ambiance" },
        { name: "Glassmorphism Holographic", img: "photo-1550684848-fac1c5b4e853", desc: "Frosted translucent interface elements with rainbow sheen", tpl: "{prompt}, modern glassmorphism 3D render, frosted translucent acrylic panels, soft iridescent rainbow refractions" },
        { name: "Solarpunk Green Utopia", img: "photo-1506744038136-46273834b3fb", desc: "Hanging rooftop gardens on curved organic solar towers", tpl: "{prompt}, solarpunk sustainable metropolis, lush vertical gardens covering organic architecture, clean wind turbines, bright sunshine" },
        { name: "Dark Surrealism Void", img: "photo-1509114397022-ed747cca3f65", desc: "Monolithic geometric structures looming in endless mist", tpl: "{prompt}, eerie dark surrealism landscape, towering black brutalist monolith, floating geometric solids, thick quiet fog" },
        { name: "Matte Painting Movie Concept", img: "photo-1506744038136-46273834b3fb", desc: "Production quality environment concept for Hollywood", tpl: "{prompt}, blockbuster Hollywood matte painting, epic fantasy environment concept art, photorealistic scale and depth" },
        { name: "Cyber Samurai Katana", img: "photo-1518834107812-67b0b7c58434", desc: "High-frequency plasma sword in neon rain alleyway", tpl: "{prompt}, cybernetic samurai warrior, high-frequency plasma blade, carbon fiber traditional armor, rainy neon alley" },
        { name: "Quantum Portal Multiverse", img: "photo-1518709268805-4e9042af9f23", desc: "Swirling vortex gateway opening into alternate cosmos", tpl: "{prompt}, swirling cosmic quantum portal gateway, event horizon singularity, alternate dimensions visible through event horizon" },
        { name: "Fractal Sacred Geometry", img: "photo-1550684848-fac1c5b4e853", desc: "Infinite self-similar mathematical Mandelbrot patterns", tpl: "{prompt}, infinite 3D Mandelbulb fractal geometry, iridescent crystal facets, kaleidoscopic self-repeating cosmic beauty" },
        { name: "Post-Apocalyptic Overgrown", img: "photo-1509316975850-ff9c5deb0cd9", desc: "Abandoned metropolis claimed by ivy and wild trees", tpl: "{prompt}, post-apocalyptic abandoned highway claimed by nature, rusting cars draped in green vines, melancholic tranquility" },
        { name: "Neon Cyberpunk Hacker Den", img: "photo-1518834107812-67b0b7c58434", desc: "Wall of glowing monitors, tangled cables, rain on glass", tpl: "{prompt}, underground cyberpunk hacker lair, multiple CRT monitors displaying green code, cables, neon rain outside window" },
        { name: "Orbital Space Station Vista", img: "photo-1507525428034-b723cf961d3e", desc: "Earth curve below viewed from massive centrifuge window", tpl: "{prompt}, view from inside a rotating space station habitat, curved blue planet Earth below, solar arrays glinting in vacuum" },
        { name: "Liquid Mercury Morphing", img: "photo-1550684848-fac1c5b4e853", desc: "Molten silver liquid metal droplets levitating in air", tpl: "{prompt}, liquid mercury metal levitating in zero gravity, flawless mirror reflections, organic morphing fluid dynamics" },
        { name: "Crystal Ice Palace", img: "photo-1517411032315-54ef2cb783bb", desc: "Carved glaciers with glowing turquoise internal light", tpl: "{prompt}, majestic palace carved entirely from glacial blue ice, glowing turquoise light inside transparent walls" },
        { name: "Dystopian Sandcrawler", img: "photo-1509316975850-ff9c5deb0cd9", desc: "Massive industrial tread machine crawling over wasteland", tpl: "{prompt}, colossal dieselpunk crawler vehicle traversing endless desert waste, exhaust smoke plumes, gritty industrial realism" },
        { name: "Hyperloop Transit Tube", img: "photo-1518834107812-67b0b7c58434", desc: "Magnetic pod shooting through illuminated glass tunnel", tpl: "{prompt}, futuristic supersonic hyperloop pod traveling through transparent tube above ocean, high-speed motion blur" },
        { name: "Cosmic Astral Projection", img: "photo-1518709268805-4e9042af9f23", desc: "Luminous silhouette floating into celestial galaxy core", tpl: "{prompt}, spiritual astral projection silhouette, transparent body filled with glowing galaxies and stars, transcendent peace" }
      ]
    },
    {
      cat: "Festivals & Lights",
      styles: [
        { name: "Diwali Golden Sparklers", img: "photo-1512389142860-9c449e58a814", desc: "Dazzling crackling sparkler trails with brass diyas", tpl: "{prompt}, grand Diwali festival of lights celebration, sparkling phooljhadi fireworks, glowing clay diyas, joyful golden bokeh" },
        { name: "Holi Vibrant Color Burst", img: "photo-1604948501466-4e9c339b9c24", desc: "Exploding clouds of gulal powder in pink, cyan and gold", tpl: "{prompt}, festive Holi celebration, exploding clouds of vibrant gulal powder in mid-air, joyful laughter, cinematic slow-motion splash" },
        { name: "Navratri Garba Dandiya", img: "photo-1626785774573-4b799315345d", desc: "Swirling mirrorwork chaniya cholis and clacking dandiyas", tpl: "{prompt}, high-energy Navratri Garba night, swirling mirror-work traditional skirts, glowing fairy lights, vibrant dance motion" },
        { name: "Eid Festive Crescent Glow", img: "photo-1582562124811-c09040d0a901", desc: "Ornate brass lanterns, crescent moon and dates", tpl: "{prompt}, Eid Mubarak festive celebration, glowing Moroccan brass fanoos lanterns, delicate crescent moon in indigo sky" },
        { name: "Christmas Magic Snow", img: "photo-1512389142860-9c449e58a814", desc: "Warm fireplace glow with snow falling on pines outside", tpl: "{prompt}, cozy Christmas evening, twinkling evergreen tree with golden glass baubles, roaring fireplace, gentle falling snow outside" },
        { name: "Durga Puja Dhunuchi Dance", img: "photo-1604948501466-4e9c339b9c24", desc: "Aromatic coconut husk smoke and rhythmic dhak drums", tpl: "{prompt}, Kolkata Durga Puja pandal celebration, majestic Goddess Durga idol, rhythmic Dhunuchi smoke dance, marigold garlands" },
        { name: "Chinese Lantern Festival", img: "photo-1518495973542-4542c06a5843", desc: "Thousands of floating glowing orange lanterns in night sky", tpl: "{prompt}, thousands of glowing sky lanterns ascending into midnight sky over tranquil lake, warm amber reflections" },
        { name: "Venetian Carnival Mask", img: "photo-1515886657613-9f3515b0c78f", desc: "Filigree gold masquerade mask with peacock feathers", tpl: "{prompt}, Venetian carnival masquerade gala, elaborate porcelain and gold leaf filigree mask, velvet hooded cloak by canal" },
        { name: "Rio Carnival Feather Gala", img: "photo-1626785774573-4b799315345d", desc: "Spectacular samba costume explosion of glitter and plumes", tpl: "{prompt}, Rio de Janeiro carnival parade, monumental glitter costume with iridescent tropical feathers, explosive energy" },
        { name: "Day of the Dead Calavera", img: "photo-1607604276583-eef5d076aa5f", desc: "Intricate floral sugar skull face paint and marigolds", tpl: "{prompt}, Dia de los Muertos celebration, elegant sugar skull calavera face paint, glowing candle altar with cempasuchil marigolds" },
        { name: "Loy Krathong Floating Lotus", img: "photo-1682687220063-4742bd7fd538", desc: "Candlelit banana-leaf baskets drifting down river", tpl: "{prompt}, Thai Loy Krathong festival, candlelit floating flower krathongs on reflective river, sky lanterns above" },
        { name: "Halloween Jack-o-Lantern", img: "photo-1509114397022-ed747cca3f65", desc: "Carved grinning pumpkin with flickering candle flame", tpl: "{prompt}, spooky Halloween night, glowing carved jack-o-lantern pumpkins on porch, autumn leaves, foggy full moon atmosphere" },
        { name: "Ganesh Chaturthi Visarjan", img: "photo-1604948501466-4e9c339b9c24", desc: "Grand ocean procession with gulal and dhol beats", tpl: "{prompt}, Mumbai Ganesh Chaturthi Visarjan procession, grand eco-friendly Lord Ganesha idol, sea of devotees, red gulal" },
        { name: "New Year Fireworks Skyline", img: "photo-1518834107812-67b0b7c58434", desc: "Explosive colorful aerial shells over glittering city harbor", tpl: "{prompt}, New Year's Eve midnight celebration, massive multi-colored fireworks bursting over illuminated city skyline" },
        { name: "Cherry Blossom Hanami Picnic", img: "photo-1460661419201-fd4cecdf8a8b", desc: "Pink sakura canopy with falling petals in Tokyo park", tpl: "{prompt}, traditional Japanese Hanami festival, blooming pink cherry blossom canopy, petals floating on gentle breeze" },
        { name: "Midsummer Night Fairy Glow", img: "photo-1518709268805-4e9042af9f23", desc: "Fireflies dancing in ancient Swedish birch woods", tpl: "{prompt}, Nordic midsummer night, floral crown wreath, glowing fireflies in birch forest twilight, enchanting dream" },
        { name: "Pushkar Camel Fair Sunset", img: "photo-1509316975850-ff9c5deb0cd9", desc: "Decorated camels silhouetted against Thar desert twilight", tpl: "{prompt}, Pushkar camel fair in Rajasthan, vibrantly adorned camels, nomadic tents, dusty golden sunset panorama" },
        { name: "St. Patrick's Emerald Parade", img: "photo-1506744038136-46273834b3fb", desc: "River dyed emerald green with festive shamrocks", tpl: "{prompt}, lively St. Patrick's day carnival, emerald green confetti, Celtic knots, joyful crowd dressed in festive green" }
      ]
    },
    {
      cat: "Comics & Illustration",
      styles: [
        { name: "Vintage Marvel Comic 1960s", img: "photo-1563089145-599997674d42", desc: "Jack Kirby dynamic pose with classic Ben-Day dots", tpl: "{prompt}, vintage 1960s comic book art, Jack Kirby dynamic heroic pose, retro Ben-Day dots, bold ink outlines" },
        { name: "Modern Graphic Novel Noir", img: "photo-1509114397022-ed747cca3f65", desc: "Frank Miller Sin City stark contrast and crimson splash", tpl: "{prompt}, graphic novel art style of Sin City, stark black and white ink, selective vivid crimson red accent, dramatic angle" },
        { name: "French Ligne Claire Tintin", img: "photo-1513364776144-60967b0f800f", desc: "Hergé clean clear line with flat elegant colors", tpl: "{prompt}, Franco-Belgian comic style Ligne Claire by Hergé, crystal clear uniform ink lines, flat elegant color palette" },
        { name: "Children's Book Pastel Story", img: "photo-1460661419201-fd4cecdf8a8b", desc: "Whimsical textured pencil and gouache illustration", tpl: "{prompt}, whimsical children's picture book illustration, soft pencil texture, warm gouache colors, gentle storytelling charm" },
        { name: "Dark Fantasy D&D Handbook", img: "photo-1544717305-2782549b5136", desc: "Todd Lockwood character art with weathered parchment", tpl: "{prompt}, official D&D fantasy rulebook illustration, painterly heroic realism, aged parchment paper texture, epic fantasy" },
        { name: "Minimalist Vector Flat Icon", img: "photo-1513364776144-60967b0f800f", desc: "Clean geometric shapes and modern gradients", tpl: "{prompt}, sleek modern vector illustration, minimal geometric shapes, clean gradients, Behance trending UI graphic" },
        { name: "Pop Art Andy Warhol", img: "photo-1550684848-fac1c5b4e853", desc: "Silkscreen screenprint grid with fluorescent clashes", tpl: "{prompt}, 1960s Pop Art silkscreen print by Andy Warhol, high saturation, misaligned color print screens, iconic vibe" },
        { name: "Editorial New Yorker Cartoon", img: "photo-1544717305-2782549b5136", desc: "Witty pen and watercolor wash with intellectual charm", tpl: "{prompt}, refined New Yorker magazine editorial cartoon style, delicate ink sketch with loose watercolor wash, witty vibe" },
        { name: "Grimdark Warhammer 40K", img: "photo-1509198397868-475647b2a1e5", desc: "Gothic cathedral armor, skulls and battle grime", tpl: "{prompt}, grimdark Warhammer 40k style, battle-worn baroque gothic armor, skulls, smoking bolters, apocalyptic battleground" },
        { name: "Tarot Card Mystical Gold", img: "photo-1582562124811-c09040d0a901", desc: "Rider-Waite occult symbolism with gold foil border", tpl: "{prompt}, major arcana Tarot card illustration, intricate esoteric gold border, mystical symbolism, Pamela Colman Smith style" },
        { name: "Botanical Field Guide Ink", img: "photo-1460661419201-fd4cecdf8a8b", desc: "Antique scientific specimen study with Latin labels", tpl: "{prompt}, 18th century botanical field guide drawing, delicate dip pen ink hatching, soft watercolor wash, antique paper" },
        { name: "Gouache Travel Poster 1950s", img: "photo-1507525428034-b723cf961d3e", desc: "Retro railway destination poster with scenic vistas", tpl: "{prompt}, vintage 1950s European travel tourism poster, opaque matte gouache painting, bold stylized scenery, nostalgic" },
        { name: "Cyberpunk Comic Webcomic", img: "photo-1518834107812-67b0b7c58434", desc: "Digital comic panel with speed lines and glow", tpl: "{prompt}, modern sci-fi action webcomic page, cinematic widescreen panel, glowing neon weapons, dynamic motion effects" },
        { name: "Fable Woodcut Printmaking", img: "photo-1544717305-2782549b5136", desc: "Carved medieval block print with black relief ink", tpl: "{prompt}, medieval woodcut engraving art, heavy carved black lines, mythical fable folklore illustration, rough rag paper" },
        { name: "Graffiti Street Art Mural", img: "photo-1563089145-599997674d42", desc: "Vibrant aerosol spray paint on distressed brick wall", tpl: "{prompt}, large scale urban street art mural, vibrant aerosol spray paint, dripping paint splatters on weathered brick wall" },
        { name: "Sticker Bomb Decal Art", img: "photo-1513364776144-60967b0f800f", desc: "Bold vinyl die-cut contour sticker with gloss finish", tpl: "{prompt}, cute vinyl die-cut sticker design, thick clean white contour outline, vibrant saturated colors, glossy decal" },
        { name: "Storyboard Cinematic Frame", img: "photo-1506744038136-46273834b3fb", desc: "Quick dynamic animatic sketch with camera directions", tpl: "{prompt}, professional feature film storyboard frame, dynamic charcoal camera sketch, directorial aspect ratio framing" },
        { name: "Pencil Crayon Sketchbook", img: "photo-1544717305-2782549b5136", desc: "Textured colored pencil strokes on moleskine paper", tpl: "{prompt}, colored pencil sketchbook drawing, visible waxy cross-hatched strokes, warm personal artist diary aesthetic" }
      ]
    },
    {
      cat: "High Fashion & Glamour",
      styles: [
        { name: "Vogue High-Fashion Editorial", img: "photo-1515886657613-9f3515b0c78f", desc: "Avant-garde haute couture with striking studio lighting", tpl: "{prompt}, Vogue magazine high-fashion cover editorial, avant-garde couture gown, high contrast studio key lighting, glamorous" },
        { name: "Haute Couture Paris Runway", img: "photo-1534528741775-53994a69daeb", desc: "Walking the mirror catwalk with flashbulbs popping", tpl: "{prompt}, Paris Fashion Week runway model, haute couture silk gown with trailing cape, mirrored catwalk, flashing camera lights" },
        { name: "Retro 80s Neon Glamour", img: "photo-1508919801845-fc2ae1bc2a28", desc: "Big bold hair, metallic lame fabric and neon gels", tpl: "{prompt}, 1980s high fashion glamour photography, bold metallic styling, colored neon gel lights, striking editorial gaze" },
        { name: "Minimalist Scandinavian Chic", img: "photo-1531746020798-e6953c6e8e04", desc: "Clean neutral beige tones and tailored wool coat", tpl: "{prompt}, modern Scandinavian fashion lookbook, neutral oatmeal linen and wool, soft diffused natural daylight, effortless chic" },
        { name: "Met Gala Extravaganza", img: "photo-1582562124811-c09040d0a901", desc: "Dramatic sculpted red carpet headpiece and train", tpl: "{prompt}, Met Gala red carpet fashion, architectural sculpted gold headpiece, dramatic cascading embroidered velvet train" },
        { name: "Vintage 1950s Dior Silhouette", img: "photo-1515886657613-9f3515b0c78f", desc: "Cinched hourglass waist with pillbox hat elegance", tpl: "{prompt}, 1950s Christian Dior 'New Look' vintage fashion, cinched hourglass silhouette, pleated skirt, pillbox hat, Paris street" },
        { name: "Cyberpunk Streetwear Model", img: "photo-1518834107812-67b0b7c58434", desc: "Techwear straps, utility vest, LED visor and sneakers", tpl: "{prompt}, futuristic techwear streetwear fashion, utilitarian buckle straps, reflective fabrics, neon cyber city background" },
        { name: "Jewelry Macro Diamond Sparkle", img: "photo-1550684848-fac1c5b4e853", desc: "Dazzling platinum and emerald diamond facets", tpl: "{prompt}, luxury high jewelry campaign photography, dazzling multifaceted diamond necklace, velvet backdrop, razor sharp facets" },
        { name: "Golden Silk Saree Elegance", img: "photo-1582562124811-c09040d0a901", desc: "Crimson Kanjeevaram silk with temple gold border", tpl: "{prompt}, royal South Indian bride in pure Kanjeevaram crimson silk saree, intricate gold temple border, temple jewelry" },
        { name: "Bohemian Desert Festival", img: "photo-1509316975850-ff9c5deb0cd9", desc: "Flowing macrame, turquoise jewelry and fringed suede", tpl: "{prompt}, Coachella bohemian festival fashion, fringed suede jacket, turquoise jewelry, sun-kissed desert breeze, golden hour" },
        { name: "Gothic Victorian Velvet Noir", img: "photo-1509114397022-ed747cca3f65", desc: "Heavy burgundy velvet cape with black lace choker", tpl: "{prompt}, dark romantic gothic couture, deep burgundy crushed velvet, black Chantilly lace, candlelight antique mirror" },
        { name: "Sneakerhead Streetwear Drop", img: "photo-1563089145-599997674d42", desc: "Limited edition hypebeast kicks with industrial backdrop", tpl: "{prompt}, Hypebeast streetwear culture photography, limited edition designer sneakers, oversized hoodie, concrete urban backdrop" },
        { name: "Monochrome Editorial Film", img: "photo-1508739773434-c26b3d09e071", desc: "Peter Lindbergh raw natural black and white beauty", tpl: "{prompt}, Peter Lindbergh black and white portrait, honest natural beauty, minimal makeup, moody atmospheric depth" },
        { name: "Underwater Silk Flow", img: "photo-1682687220063-4742bd7fd538", desc: "Weightless chiffon fabric dancing in crystal water", tpl: "{prompt}, underwater fashion photography, weightless chiffon gown floating like liquid smoke, sun rays piercing through water" },
        { name: "Velvet Tuxedo Bond Style", img: "photo-1534528741775-53994a69daeb", desc: "Midnight blue satin lapel with Monte Carlo casino glamour", tpl: "{prompt}, bespoke midnight blue velvet tuxedo, black satin peak lapel, bow tie, luxury casino ambiance, James Bond suave" },
        { name: "Prismatic Iridescent Foil", img: "photo-1550684848-fac1c5b4e853", desc: "Metallic holographic trench coat shifting color in light", tpl: "{prompt}, futuristic editorial fashion, holographic iridescent PVC trench coat, shifting chromatic highlights, sleek studio" }
      ]
    },
    {
      cat: "Dark Fantasy & Myth",
      styles: [
        { name: "Lord Shiva Cosmic Tandav", img: "photo-1518709268805-4e9042af9f23", desc: "Cosmic dance of destruction with trident and glowing third eye", tpl: "{prompt}, divine Lord Shiva in cosmic Tandav posture, swirling galaxies in matted locks, glowing third eye, glowing trishul trident, majestic divine aura" },
        { name: "Ancient Dragon Lair Gold", img: "photo-1509316975850-ff9c5deb0cd9", desc: "Coiled winged beast atop mounds of glittering treasure", tpl: "{prompt}, colossal ancient winged dragon resting atop mountain of gold coins and jewels, smoldering embers, dark cavern" },
        { name: "Enchanted Elven Forest", img: "photo-1506744038136-46273834b3fb", desc: "Silver bark trees with glowing ethereal wisps and arches", tpl: "{prompt}, magical Lothlorien elven sanctuary, soaring silver mallorn trees, ethereal blue starlight wisps, sculpted crystal arches" },
        { name: "Valkyrie Northern Auroral", img: "photo-1517411032315-54ef2cb783bb", desc: "Winged warrior maiden riding across Bifrost rainbow bridge", tpl: "{prompt}, Norse Valkyrie warrior maiden, gleaming silver wing armor, spear of light, riding across glowing celestial aurora" },
        { name: "Deep Sea Kraken Abyss", img: "photo-1682687220063-4742bd7fd538", desc: "Giant bioluminescent tentacles encircling sunken galleon", tpl: "{prompt}, colossal mythical kraken sea monster in dark ocean abyss, bioluminescent suction cups encircling antique wooden shipwreck" },
        { name: "Grimoire Dark Occult Alchemy", img: "photo-1544717305-2782549b5136", desc: "Hovering runic circles, raven skull and candlelight", tpl: "{prompt}, ancient sorcerer alchemy laboratory, glowing purple runic summoning circle, floating parchment grimoires, candle wax" },
        { name: "Celestial Seraph Angel", img: "photo-1518709268805-4e9042af9f23", desc: "Six flaming wings covered in eyes of divine light", tpl: "{prompt}, biblically accurate six-winged Seraph angel, feathers of pure holy fire, concentric golden rings, blinding divine brilliance" },
        { name: "Necromancer Bone Citadel", img: "photo-1509114397022-ed747cca3f65", desc: "Obsidian spires glowing with eerie emerald soul fire", tpl: "{prompt}, dark necromancer fortress carved from colossal dragon bone, eerie green soul fire in brazier, tempestuous dark sky" },
        { name: "Goddess Kali Fierce Power", img: "photo-1607604276583-eef5d076aa5f", desc: "Fierce divine mother with crescent sword and garland of skulls", tpl: "{prompt}, divine Goddess Mahakali in fearsome cosmic form, swirling thunderstorms, scimitar in hand, radiant blue aura of cosmic power" },
        { name: "Phoenix Rebirth Ashes", img: "photo-1509316975850-ff9c5deb0cd9", desc: "Fiery bird bursting in glory from molten embers", tpl: "{prompt}, legendary immortal Phoenix bird rising triumphantly from glowing volcanic ashes, radiant golden feathers of pure flame" },
        { name: "Cyber Demon Mephisto", img: "photo-1518834107812-67b0b7c58434", desc: "Mechanical horns with hydraulic jaw and glowing furnace core", tpl: "{prompt}, biomechanical demon lord, obsidian horns fused with fiber optics, molten metal heart furnace, dark sci-fi horror" },
        { name: "Anubis Hall of Judgment", img: "photo-1579762715118-a6f1d4b934f1", desc: "Jackal god weighing golden feather on sacred balance", tpl: "{prompt}, ancient Egyptian underworld temple, jackal god Anubis weighing heart against the feather of Ma'at, glowing hieroglyphics" },
        { name: "Frost Giant Ymir Blizzard", img: "photo-1517411032315-54ef2cb783bb", desc: "Colossal blue-skinned titan with beard of icicles", tpl: "{prompt}, towering Norse Frost Giant in howling arctic blizzard, glacier armor, beard of razor icicles, glowing frozen eyes" },
        { name: "Lich King Throne of Ice", img: "photo-1509114397022-ed747cca3f65", desc: "Cursed runeblade planted in frozen throne room", tpl: "{prompt}, cursed skeletal monarch on throne of black glacial ice, jagged crown of obsidian, glowing blue eyes, frosted runeblade" },
        { name: "Medusa Serpent Gaze", img: "photo-1534528741775-53994a69daeb", desc: "Living emerald vipers for hair and petrifying golden eyes", tpl: "{prompt}, mythical Medusa with writhing iridescent green viper serpents as hair, glowing golden petrifying gaze, marble ruins" },
        { name: "Cthulhu R'lyeh Awakening", img: "photo-1682687220063-4742bd7fd538", desc: "Cyclopean non-Euclidean city rising from Pacific depths", tpl: "{prompt}, cosmic horror deity Cthulhu rising from green ocean depths, massive bat wings, tentacled visage, cyclopean wet stone spires" }
      ]
    },
    {
      cat: "Minimalist & Modern",
      styles: [
        { name: "Clean Scandinavian Studio", img: "photo-1508739773434-c26b3d09e071", desc: "Warm birch wood, soft shadows and neutral silence", tpl: "{prompt}, minimalist Scandinavian design, natural light birch wood, soft airy shadows, profound architectural simplicity" },
        { name: "Zen Japanese Wabi-Sabi", img: "photo-1518531933037-91b2f5f229cc", desc: "Raked sand rock garden with single maple leaf", tpl: "{prompt}, Japanese Wabi-Sabi aesthetic, raked white gravel Zen garden, single weathered stone, tranquil meditative stillness" },
        { name: "Duotone Gradient Poster", img: "photo-1550684848-fac1c5b4e853", desc: "Vibrant high-contrast two-tone color transition", tpl: "{prompt}, contemporary graphic design duotone print, striking cobalt blue and hot coral gradient, clean typography layout" },
        { name: "Bauhaus Primary Geometry", img: "photo-1513364776144-60967b0f800f", desc: "Asymmetrical balance of circle, triangle and bold lines", tpl: "{prompt}, 1920s Bauhaus art school poster, geometric harmony of bold red circle, blue triangle, yellow square, grid balance" },
        { name: "Raw Brutalist Concrete", img: "photo-1509114397022-ed747cca3f65", desc: "Massive textured gray concrete with angular skylights", tpl: "{prompt}, architectural brutalism, rough-hewn board-marked concrete planes, dramatic angled shafts of natural skylight" },
        { name: "Line Art Continuous Wire", img: "photo-1544717305-2782549b5136", desc: "Single unbroken fluid ink contour line on cream paper", tpl: "{prompt}, single continuous line art drawing, fluid unbroken ink contour, elegant negative space, fine archival cream paper" },
        { name: "Pastel Clay 3D Render", img: "photo-1566577739112-5180d4bf9390", desc: "Smooth rounded matte shapes in lavender and peach", tpl: "{prompt}, minimalist 3D matte clay illustration, soft pastel marshmallow tones, lavender and peach, gentle ambient occlusion" },
        { name: "Negative Space Silhouette", img: "photo-1508739773434-c26b3d09e071", desc: "Clever optical illusion created by clean cutouts", tpl: "{prompt}, clever negative space graphic design, double meaning optical silhouette, stark black on pure white canvas" },
        { name: "Monochrome Low-Key Noir", img: "photo-1509114397022-ed747cca3f65", desc: "95% pure black with whisper of white outline", tpl: "{prompt}, extreme low-key black and white photography, pure velvet black background, razor-thin rim of white light edge" },
        { name: "Fluorescent Risograph Grain", img: "photo-1550684848-fac1c5b4e853", desc: "Textured soy-ink printing with fluorescent overlap", tpl: "{prompt}, authentic Risograph two-color print, tactile soy ink texture on toothy paper, fluorescent pink and cyan screen overlap" },
        { name: "Matte Black Stealth Edition", img: "photo-1534528741775-53994a69daeb", desc: "Anodized matte black textures with dark gloss accents", tpl: "{prompt}, stealth matte black product design, satin dark finishes, subtle carbon fiber weave accents, moody luxury" },
        { name: "Atmospheric Fog Silhouette", img: "photo-1506744038136-46273834b3fb", desc: "Layered mountain ridges fading gently into morning haze", tpl: "{prompt}, atmospheric Chinese landscape wash, layered blue mountain ridges fading into infinite white morning fog" }
      ]
    }
  ];

  const all: StyleItem[] = [];
  let counter = 1;

  baseCategories.forEach((catGroup) => {
    catGroup.styles.forEach((style) => {
      all.push({
        id: `style-${counter++}`,
        name: style.name,
        category: catGroup.cat,
        image: `https://images.unsplash.com/${style.img}?w=500&h=650&fit=crop`,
        prompt: style.desc,
        template: style.tpl
      });
    });
  });

  return all;
};

export const CREATIVE_STUDIO_STYLES = generate200Styles();

// Build actual prompt for Pollinations Flux-Realism ₹0 Engine
export const buildStylePrompt = (style: StyleItem | undefined, userSubject: string, aspectRatio: "1:1" | "16:9" | "9:16" = "1:1"): string => {
  const subject = userSubject.trim() || "portrait of a mystical figure, breathtaking scenery";
  let promptText = style ? style.template.replace("{prompt}", subject) : subject;
  
  // Anti-watermark & ChatGPT-grade enhancement
  const qualityBooster = "8k resolution, ultra-detailed, cinematic lighting, sharp focus, masterpiece, professional aesthetic, no watermark, no text, no logo";
  return `${promptText}, ${qualityBooster}`.slice(0, 1500);
};

// LocalStorage history engine for 'My Creations'
const CREATIONS_KEY = "coreai_my_creations";

export const getMyCreations = (): CreationItem[] => {
  try {
    const raw = localStorage.getItem(CREATIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveMyCreation = (item: Omit<CreationItem, "id" | "createdAt">): CreationItem => {
  const list = getMyCreations();
  const newItem: CreationItem = {
    ...item,
    id: `creation-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: Date.now()
  };
  const updated = [newItem, ...list].slice(0, 50); // Keep latest 50
  try {
    localStorage.setItem(CREATIONS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save creation to storage", err);
  }
  return newItem;
};

export const deleteMyCreation = (id: string): void => {
  const list = getMyCreations();
  const filtered = list.filter(c => c.id !== id);
  try {
    localStorage.setItem(CREATIONS_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error("Failed to delete creation", err);
  }
};
