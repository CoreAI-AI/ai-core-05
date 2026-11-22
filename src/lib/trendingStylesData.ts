export interface ImageStyleItem {
  id: string;
  name: string;
  category: "Trending" | "Templates";
  image: string;
  prompt: string;
  template: string;
}

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
    prompt: "Nostalgic 90s cassette mixtape cover, handwritten song titles, soft retro color wash, vintage tape aesthetic",
    template: "{prompt}, 1990s retro Indian cassette album cover, warm nostalgic lighting, analog tape texture"
  },
  {
    id: "good-morning",
    name: "Good morning",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=600&auto=format&fit=crop&q=80",
    prompt: "Cozy morning sunlight streaming through a window, steaming coffee mug, serene misty hills outside",
    template: "{prompt}, peaceful morning aesthetic, golden sunbeams, gentle steam, warm cozy atmospheric lighting"
  },
  {
    id: "cricket-victory",
    name: "Join a cricket victory scene",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80",
    prompt: "Packed cricket stadium under bright floodlights, triumphant team celebration, flying confetti, roaring crowd",
    template: "{prompt}, exuberant stadium victory celebration, bright floodlights, confetti rain, electric crowd energy"
  },
  {
    id: "luxe-collage",
    name: "Luxe collage",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80",
    prompt: "High-end fashion editorial collage, layered botanical textures, rich golden jewellery accents, moody lighting",
    template: "{prompt}, high-fashion luxury editorial collage, layered floral elements, haute couture aesthetic"
  },
  {
    id: "aerial-view",
    name: "Aerial view",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80",
    prompt: "Crisp top-down aerial drone shot, lush vibrant green field, miniature subject, crisp clean shadows",
    template: "{prompt}, overhead 90-degree drone photography, minimalist top-down perspective, vivid crisp colors"
  },
  {
    id: "collectors-tin",
    name: "Collector's tin",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80",
    prompt: "Vintage metal pocket tin filled with tiny collectible trinkets, mini polaroids, stamps, and nostalgic souvenirs",
    template: "{prompt}, miniature vintage tin box flatlay, collectible nostalgic memorabilia, macro depth of field"
  },
  {
    id: "caricature",
    name: "Caricature",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=600&auto=format&fit=crop&q=80",
    prompt: "Delightful stylized caricature illustration, expressive facial features, whimsical painterly textures",
    template: "{prompt}, artistic caricature portrait, expressive stylized proportions, colorful digital painting"
  },
  {
    id: "sketch",
    name: "Sketch",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80",
    prompt: "Clean minimalist pen and ink line sketch, delicate cross-hatching, watercolor wash highlights, white paper",
    template: "{prompt}, clean architectural ink sketch on textured paper, subtle watercolor tint, elegant lines"
  },
  {
    id: "stickers",
    name: "Stickers",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=600&auto=format&fit=crop&q=80",
    prompt: "Die-cut glossy vinyl sticker pack collection, bold white sticker borders, playful vector design",
    template: "{prompt}, die-cut vinyl sticker design, bold white outline, clean vector graphic art style"
  },
  {
    id: "photo-booth",
    name: "Photo booth",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80",
    prompt: "Authentic retro photo booth strip, black and white film contrast, four candid expressive poses",
    template: "{prompt}, vintage photo booth strip, authentic grainy B&W film, direct flash, candid smiles"
  },
  {
    id: "y2k-digicam",
    name: "Y2K digicam",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80",
    prompt: "Early 2000s compact digital camera snapshot, overexposed direct flash, timestamp in the corner, casual Y2K vibe",
    template: "{prompt}, early 2000s Y2K digicam photo, harsh direct flash, digital noise, retro party look"
  },
  {
    id: "anime",
    name: "Anime",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    prompt: "Modern Shinkai-style anime background and character, dramatic clouds, lens flare, crisp cel-shaded lighting",
    template: "{prompt}, modern Japanese anime art style, Makoto Shinkai sky, vibrant lighting, intricate background"
  },
  {
    id: "70s-portrait",
    name: "70s portrait",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    prompt: "1970s Kodachrome film portrait, warm sunset tones, aviator glasses, feathered hair, authentic film color grade",
    template: "{prompt}, 1970s vintage Kodachrome film photography, warm amber tones, 70s fashion and hair"
  },
  {
    id: "impressionist-painting",
    name: "Impressionist painting",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80",
    prompt: "Claude Monet style impressionist oil painting, visible rhythmic brushstrokes, shimmering light on water",
    template: "{prompt}, impressionist master oil painting on canvas, visible textured brushwork, luminous natural light"
  },
  {
    id: "pin-collection",
    name: "Pin collection",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=600&auto=format&fit=crop&q=80",
    prompt: "Curated enamel pin collection pinned to a pastel denim jacket, shiny gold rims, colorful hard enamel glaze",
    template: "{prompt}, hard enamel pin badge collection, gold metallic edges, glossy finish, cute pin display"
  },
  {
    id: "underwater",
    name: "Underwater",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=600&auto=format&fit=crop&q=80",
    prompt: "Ethereal underwater portrait, dancing sun caustics, weightless floating fabric, crystal turquoise water",
    template: "{prompt}, cinematic underwater photography, dancing water caustics, sun rays cutting through blue water"
  },
  {
    id: "3d-avatar",
    name: "3D avatar",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=600&auto=format&fit=crop&q=80",
    prompt: "Pixar 3D animation character render, soft subsurface scattering, big expressive eyes, studio lighting",
    template: "{prompt}, 3D Pixar character avatar render, soft clay-style subsurface skin, studio rim lighting"
  },
  {
    id: "acrylic-painting",
    name: "Acrylic painting",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&auto=format&fit=crop&q=80",
    prompt: "Thick impasto acrylic painting, bold palette knife strokes, vibrant saturated colors on textured canvas",
    template: "{prompt}, heavy body acrylic palette knife painting, rich textured brushstrokes, bold color harmonies"
  },
  {
    id: "model-kit",
    name: "Model kit",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
    prompt: "Unassembled plastic model kit sprue runner, precision miniature parts, flat technical green backdrop",
    template: "{prompt}, plastic scale model runner sprue layout, miniature hobby kit pieces, flatlay overhead"
  },
  {
    id: "16-bit-arcade",
    name: "16-bit arcade",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80",
    prompt: "16-bit arcade video game sprite screen, vibrant pixel art, CRT scanlines, neon cyberpunk city backdrop",
    template: "{prompt}, 16-bit pixel art arcade video game graphics, crisp pixels, retro CRT screen scanlines"
  },
  {
    id: "handwritten-style",
    name: "Handwritten style",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80",
    prompt: "Joyful Polaroid photo with spontaneous colorful handwritten notes and doodles framing the picture",
    template: "{prompt}, candid photo framed with handwritten notes, colorful marker doodles, scrapbook collage look"
  },
  {
    id: "makeup-guide",
    name: "Makeup guide",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80",
    prompt: "High-end beauty editorial guide, clean studio lighting, skin texture swatch palette, macro portrait",
    template: "{prompt}, luxury beauty editorial photography, clean skin texture, makeup color swatches, ring light"
  },
  {
    id: "scribble",
    name: "Scribble",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=80",
    prompt: "Charming black ink marker scribbles and doodles over a playful stylized character sketch",
    template: "{prompt}, playful hand-drawn scribble art, loose pen doodles, minimalist expressive character illustration"
  },
  {
    id: "your-bobblehead",
    name: "Your bobblehead",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80",
    prompt: "Cute custom ceramic bobblehead figurine with oversized head, standing on a blurred city street background",
    template: "{prompt}, custom ceramic bobblehead toy, oversized head, glossy paint finish, macro photography"
  },
  {
    id: "mini-me",
    name: "Mini me",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80",
    prompt: "Tilt-shift miniature diorama where a person interacts with a tiny miniature 3D model replica of themselves",
    template: "{prompt}, tilt-shift photography, miniature toy figurine replica of the subject, realistic scale contrast"
  },
  {
    id: "cross-section",
    name: "Cross-section",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80",
    prompt: "Detailed mechanical cross-section cutaway illustration, visible internal gears, conduits, and precision engineering",
    template: "{prompt}, detailed technical cutaway cross-section, visible inner mechanical components, clean schematics"
  },
  {
    id: "enhance-photos",
    name: "Enhance photos",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&auto=format&fit=crop&q=80",
    prompt: "Hyper-detailed crystal-clear family celebration, warm glowing birthday candles, razor-sharp facial details",
    template: "{prompt}, ultra-enhanced high resolution photograph, 8k crisp details, warm natural family lighting"
  },
  {
    id: "wanderlust",
    name: "Wanderlust",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&auto=format&fit=crop&q=80",
    prompt: "Scenic travel flatlay with antique handwritten travel journal, vintage brass compass, and mountain landscape",
    template: "{prompt}, wanderlust travel photography, vintage journal and compass, scenic travel atmosphere"
  },
  {
    id: "nighttime-flash",
    name: "Nighttime flash",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80",
    prompt: "Harsh direct camera flash portrait at night, deep pitch-black background, raw candid disposable camera look",
    template: "{prompt}, night flash photography, point-and-shoot camera, high contrast direct flash, pitch black background"
  },
  {
    id: "blueprint-poster",
    name: "Blueprint poster",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&auto=format&fit=crop&q=80",
    prompt: "Cyanotype architectural blueprint poster, precise white drafting lines, technical measurements and annotations",
    template: "{prompt}, classic cyanotype blueprint poster, technical white lines on deep blue grid, schematic details"
  },
  {
    id: "color-analysis",
    name: "Color analysis",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80",
    prompt: "Seasonal personal color analysis layout, matching portrait next to curated seasonal color swatch palettes",
    template: "{prompt}, personal color analysis chart, studio portrait surrounded by curated seasonal color swatches"
  },
  {
    id: "comic",
    name: "Comic",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
    prompt: "Classic Sunday morning funny comic strip panel, bold expressive line art, vibrant flat coloring, speech bubble",
    template: "{prompt}, classic graphic comic panel illustration, bold ink outlines, dynamic comic book coloring"
  },
  {
    id: "anime-comic",
    name: "Anime comic",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
    prompt: "Authentic black and white manga page, screen-tone shading, intimate slice-of-life dialogue panels",
    template: "{prompt}, traditional black and white manga page, screentone shading, manga panel layout"
  },
  {
    id: "fantasy-newspaper",
    name: "Fantasy newspaper",
    category: "Trending",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=80",
    prompt: "Enchanted vintage wizard newspaper front page, aged yellowed parchment, moving living magical photograph",
    template: "{prompt}, magical vintage newspaper front page, Gothic typography, enchanted moving photograph look"
  }
];

export const TEMPLATE_STYLES: ImageStyleItem[] = [
  {
    id: "tmpl-cinematic-portrait",
    name: "Cinematic 8K Portrait",
    category: "Templates",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    prompt: "Cinematic portrait shot on 85mm f/1.4 lens, natural skin texture, dramatic rim lighting",
    template: "Hyper-realistic cinematic portrait of {prompt}, shot on 85mm lens, shallow depth of field, dramatic studio rim light, 8k"
  },
  {
    id: "tmpl-cyberpunk-neon",
    name: "Cyberpunk Neon",
    category: "Templates",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80",
    prompt: "Futuristic neon-drenched metropolis, glowing holographic signs, wet asphalt reflections",
    template: "Cyberpunk city aesthetics with {prompt}, glowing neon lights, rain reflections, volumetric fog, octane render"
  },
  {
    id: "tmpl-oil-masterpiece",
    name: "Oil Canvas Masterpiece",
    category: "Templates",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80",
    prompt: "Baroque museum oil painting, dramatic chiaroscuro lighting, rich textured canvas",
    template: "Museum quality oil painting of {prompt}, Rembrandt chiaroscuro lighting, rich deep pigments, visible canvas texture"
  },
  {
    id: "tmpl-minimalist-vector",
    name: "Minimalist Vector Art",
    category: "Templates",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80",
    prompt: "Clean Scandinavian flat vector illustration, pastel color palette, geometric shapes",
    template: "Clean minimalist flat vector illustration of {prompt}, limited pastel color palette, modern graphic design"
  }
];
