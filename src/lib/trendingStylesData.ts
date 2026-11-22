export interface ImageStyleItem {
  id: string;
  name: string;
  category: "Trending" | "Templates";
  image: string;
  prompt: string;
  template: string;
}

// स्क्रीनशॉट के ठीक 40 स्टाइल्स
export const TRENDING_PHOTO_STYLES: ImageStyleItem[] = [
  {
    id: "anime-reaction-gif",
    name: "Anime reaction GIF",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
    prompt: "Vibrant expressive anime character, glowing starry eyes, blush marks, glossy cel-shaded animation style",
    template: "{prompt}, expressive anime reaction style, vibrant glossy colors, high frame-rate anime keyframe look"
  },
  {
    id: "80s-flashback",
    name: "'80s flashback",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80",
    prompt: "1980s retro portrait, neon backlight, synthwave aesthetic, warm Kodak 35mm grain, vintage leather jacket",
    template: "{prompt}, authentic 1980s vintage photograph, synthwave neon lighting, analog 35mm film grain"
  },
  {
    id: "childhood-portrait",
    name: "Childhood Portrait",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=600&auto=format&fit=crop&q=80",
    prompt: "Nostalgic golden hour childhood portrait, warm natural sunlight, candid innocent smile, soft bokeh background",
    template: "{prompt}, nostalgic childhood portrait, golden hour lighting, soft film lens blur, warm organic tones"
  },
  {
    id: "movie-poster",
    name: "Movie Poster",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80",
    prompt: "Epic theatrical movie poster, high-contrast cinematic lighting, heroic composition, atmospheric color grading",
    template: "{prompt}, blockbuster cinematic movie poster, dramatic dual-tone rim light, 8k cinematic composition"
  },
  {
    id: "rickshaw-selfie",
    name: "Rickshaw Selfie",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&auto=format&fit=crop&q=80",
    prompt: "Candid smiling friends taking a selfie inside a colorful Indian auto-rickshaw, bustling street scene, natural daylight",
    template: "{prompt}, candid selfie inside a vibrant auto-rickshaw, authentic Indian street photography, natural reflections"
  },
  {
    id: "comic-hero",
    name: "Comic Hero",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
    prompt: "Vintage comic book cover art, halftone Ben-Day dots, dynamic heroic stance, bold ink outlines",
    template: "{prompt}, vintage retro superhero comic book cover, bold ink lineart, halftone dot texture, classic comic style"
  },
  {
    id: "indian-mixtape",
    name: "Indian Mixtape",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
    prompt: "Cassette tape aesthetic, Bollywood 90s retro album cover, warm saturated hues, film scratches and typography",
    template: "{prompt}, 90s retro Indian cassette mixtape cover art, analog tape grain, vintage Bollywood graphic design"
  },
  {
    id: "good-morning",
    name: "Good morning",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80",
    prompt: "Peaceful morning sunrise, steaming tea cup, fresh golden rays piercing through fog, serene floral backdrop",
    template: "{prompt}, peaceful fresh morning glow, warm sunlight streaks, dew drops, positive morning greeting aesthetic"
  },
  {
    id: "cricket-victory",
    name: "Join a cricket victory scene",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&auto=format&fit=crop&q=80",
    prompt: "Joyous cricket team celebration at Wankhede stadium, flying tricolor flag, confetti falling, stadium floodlights",
    template: "{prompt}, triumphant cricket championship victory celebration, stadium lights, falling confetti, emotional team hug"
  },
  {
    id: "luxe-collage",
    name: "Luxe collage",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80",
    prompt: "High-fashion editorial moodboard collage, glossy magazine clippings, elegant gold leaf foil textures, chic typography",
    template: "{prompt}, high-fashion luxury editorial collage, ripped magazine cutouts, gold foil accents, Vogue aesthetic"
  },
  {
    id: "aerial-view",
    name: "Aerial view",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
    prompt: "Top-down 90-degree drone photography, crystal clear turquoise ocean meeting golden sandy beach, miniature scale",
    template: "{prompt}, top-down bird's-eye drone aerial photograph, crisp geometric coastline, turquoise ocean waves"
  },
  {
    id: "collectors-tin",
    name: "Collector's tin",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80",
    prompt: "Embossed vintage tin box packaging, ornate metallic filigree borders, Victorian typography, weathered patina",
    template: "{prompt}, vintage embossed collector's tin container, detailed metallic stamping, retro keepsake packaging"
  },
  {
    id: "caricature",
    name: "Caricature",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80",
    prompt: "Expressive humorous caricature drawing, exaggerated expressive features, lively watercolor sketch wash",
    template: "{prompt}, playful artistic caricature portrait, witty exaggeration, dynamic watercolor and pen lineart"
  },
  {
    id: "sketch",
    name: "Sketch",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
    prompt: "Charcoal pencil sketch on textured off-white parchment paper, delicate cross-hatching, realistic graphite shading",
    template: "{prompt}, hand-drawn graphite and charcoal sketch, cross-hatching shade, textured sketchbook paper"
  },
  {
    id: "stickers",
    name: "Stickers",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=600&auto=format&fit=crop&q=80",
    prompt: "Die-cut glossy vinyl sticker pack, thick white contour border, cute kawaii proportions, vibrant pop colors",
    template: "{prompt}, die-cut vinyl sticker design, bold white outline, glossy waterproof finish, cute pop aesthetic"
  },
  {
    id: "photo-booth",
    name: "Photo booth",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&auto=format&fit=crop&q=80",
    prompt: "Classic 4-frame vertical photo booth strip, funny candid expressions, harsh front flash, black and white grainy film",
    template: "{prompt}, vintage mall photo booth strip, 4 consecutive candid poses, harsh direct flash, nostalgic print"
  },
  {
    id: "y2k-digicam",
    name: "Y2K digicam",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&auto=format&fit=crop&q=80",
    prompt: "Early 2000s cyber digicam photograph, slight digital sensor bloom, cool CCD sensor tone, candid party snapshot",
    template: "{prompt}, authentic 2000s Y2K digicam snapshot, washed-out flash, early digital camera aesthetic"
  },
  {
    id: "anime",
    name: "Anime",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
    prompt: "Makoto Shinkai anime cinematography, gorgeous volumetric sky, cumulus clouds, lens flare, pristine vibrant colors",
    template: "{prompt}, breathtaking modern Japanese anime scenery, Makoto Shinkai style, vibrant sky and clouds, 4k"
  },
  {
    id: "70s-portrait",
    name: "70s portrait",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=600&auto=format&fit=crop&q=80",
    prompt: "1970s warm Polaroid print, rounded corners, mustard and avocado tones, soft focus, retro bell-bottom era look",
    template: "{prompt}, authentic 1970s vintage film portrait, muted warm earth tones, soft vignette, nostalgic film scan"
  },
  {
    id: "impressionist-painting",
    name: "Impressionist painting",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80",
    prompt: "Claude Monet style impressionist oil painting, visible rhythmic brushstrokes, dappled afternoon light, oil on canvas",
    template: "{prompt}, French impressionist oil painting, loose textured brushstrokes, Monet aesthetic, painterly impasto"
  },
  {
    id: "pin-collection",
    name: "Pin collection",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    prompt: "Enamel lapel pin badge set, polished gold and black nickel borders, smooth hard enamel fill, denim jacket background",
    template: "{prompt}, hard enamel lapel pin, polished gold metal outlines, glossy enamel fill, collector display"
  },
  {
    id: "underwater",
    name: "Underwater",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80",
    prompt: "Breathtaking underwater photography, shimmering caustic light patterns dancing through deep blue ocean, air bubbles",
    template: "{prompt}, submerged underwater photography, sunlight caustic rays filtering through water, crystal turquoise depth"
  },
  {
    id: "3d-avatar",
    name: "3D avatar",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    prompt: "Stylized Pixar 3D animated character avatar, subsurface scattering skin, big expressive eyes, studio rim lighting",
    template: "{prompt}, Disney Pixar 3D animated character, smooth clay rendered look, warm studio portrait lighting"
  },
  {
    id: "acrylic-painting",
    name: "Acrylic painting",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&auto=format&fit=crop&q=80",
    prompt: "Heavy body acrylic painting on canvas, palette knife textures, vibrant blended hues, visible impasto ridges",
    template: "{prompt}, textured acrylic painting on canvas, expressive palette knife strokes, vibrant saturated acrylic pigments"
  },
  {
    id: "model-kit",
    name: "Model kit",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
    prompt: "Plastic scale model runner kit sprue tree, unpainted plastic parts connected to runners, hobbyist tabletop",
    template: "{prompt}, plastic scale model kit on sprue trees, miniature unpainted hobby parts, detailed instruction layout"
  },
  {
    id: "16-bit-arcade",
    name: "16-bit arcade",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80",
    prompt: "16-bit pixel art sprite, SNES arcade video game screen, vibrant CRT scanlines, isometric retro gaming",
    template: "{prompt}, authentic 16-bit pixel art, retro arcade video game graphics, CRT monitor scanline effect, detailed pixels"
  },
  {
    id: "handwritten-style",
    name: "Handwritten style",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80",
    prompt: "Calligraphic handwritten notes, fountain pen ink flourishes on creamy paper, organic ink bleeds, intimate diary page",
    template: "{prompt}, elegant handwritten fountain pen script, flowing cursive ink strokes on textured paper, artistic lettering"
  },
  {
    id: "makeup-guide",
    name: "Makeup guide",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80",
    prompt: "Glamour beauty tutorial flatlay, crisp makeup swatches on radiant skin, eyeshadow palettes, soft beauty ring light",
    template: "{prompt}, high-end beauty magazine makeup guide, radiant dewy skin texture, professional cosmetic swatch aesthetics"
  },
  {
    id: "scribble",
    name: "Scribble",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=80",
    prompt: "Spontaneous neon scribble doodle art over portrait, energetic marker squiggles, modern street art graffiti look",
    template: "{prompt}, energetic marker scribble art, playful abstract doodles, modern dynamic street art overlay"
  },
  {
    id: "your-bobblehead",
    name: "Your bobblehead",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&auto=format&fit=crop&q=80",
    prompt: "Custom collectible desk bobblehead figurine, oversized smiling head, tiny body on round stand, glossy resin finish",
    template: "{prompt}, cute custom bobblehead toy figurine, oversized caricatured head, glossy hand-painted resin finish"
  },
  {
    id: "mini-me",
    name: "Mini me",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
    prompt: "Tilt-shift miniature diorama photography, shallow depth of field, tiny clay figure living in everyday real-world object",
    template: "{prompt}, tilt-shift miniature figurine effect, tiny person scale in a macro real-world environment, selective focus"
  },
  {
    id: "cross-section",
    name: "Cross-section",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
    prompt: "Detailed anatomical mechanical cross-section diagram, intricate cutaway view revealing gears, isometric schematic",
    template: "{prompt}, intricate technical cross-section cutaway illustration, exposed internal layers and mechanisms, architectural blueprint"
  },
  {
    id: "enhance-photos",
    name: "Enhance photos",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    prompt: "Crystal clear ultra-HD remastered photo, razor-sharp eyelashes and skin pores, studio color grade, 8k resolution",
    template: "{prompt}, ultra-enhanced crisp HD photo, maximum clarity, professional skin retouching, immaculate sharpness"
  },
  {
    id: "wanderlust",
    name: "Wanderlust",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&auto=format&fit=crop&q=80",
    prompt: "Solo traveler standing on alpine mountain cliff peak overlooking misty valley, epic cinematic wanderlust travel photo",
    template: "{prompt}, epic National Geographic travel photography, vast mountain panoramic background, wanderlust vibe"
  },
  {
    id: "nighttime-flash",
    name: "Nighttime flash",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80",
    prompt: "Candid nightlife snapshot with direct harsh on-camera flash, pitch dark background, gritty stylish party film grain",
    template: "{prompt}, raw direct camera flash snapshot at night, dark contrasty background, authentic nightlife party aesthetic"
  },
  {
    id: "blueprint-poster",
    name: "Blueprint poster",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&auto=format&fit=crop&q=80",
    prompt: "Cyanotype architectural blueprint, stark white technical drafting lines on dark Prussian blue grid paper, measurements",
    template: "{prompt}, architectural engineering blueprint, precise white schematic lineart, deep blue drafting grid paper"
  },
  {
    id: "color-analysis",
    name: "Color analysis",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=600&auto=format&fit=crop&q=80",
    prompt: "Seasonal color analysis swatch palette draped around face, soft studio lighting, harmonized Pantone color chips",
    template: "{prompt}, seasonal personal color analysis, flattering Pantone swatch comparison, clean minimalist studio portrait"
  },
  {
    id: "comic",
    name: "Comic",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
    prompt: "Graphic novel panel, dramatic noir ink shadows, bold brush lines, action speed lines, expressive comic scene",
    template: "{prompt}, graphic novel comic panel, dramatic ink cross-hatching, dynamic composition, action speedlines"
  },
  {
    id: "anime-comic",
    name: "Anime comic",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
    prompt: "Japanese Manga page panel, screen tones, bold speed lines, dramatic reaction face, black and white manga art",
    template: "{prompt}, authentic Japanese shonen manga page, screen tone shading, bold black ink lineart, speech bubble zone"
  },
  {
    id: "fantasy-newspaper",
    name: "Fantasy newspaper",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop&q=80",
    prompt: "Magical fantasy newspaper front page, aged yellow parchment, moving animated photo placeholder, gothic headline typography",
    template: "{prompt}, magical wizarding newspaper front page, aged yellowed parchment texture, gothic ornate headlines"
  }
];

// Templates tab abhi bilkul khali
export const TEMPLATE_STYLES: ImageStyleItem[] = [];
