import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function sanitizeText(input: unknown): string {
  if (typeof input !== "string") return "";
  return input.slice(0, 12000).trim();
}

function validateInput(message: string, fileText?: string, fileName?: string): void {
  if (message.length > 12000) {
    throw new Error("Message exceeds 12000 characters limit");
  }
  if (fileText && fileText.length > 12000) {
    throw new Error("Attached file content exceeds limit");
  }
  if (fileName && fileName.length > 255) {
    throw new Error("File name too long");
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rawBody = await req.json().catch(() => ({}));
    const message = sanitizeText(rawBody.message);
    const fileText = rawBody.fileText ? sanitizeText(rawBody.fileText) : undefined;
    const fileName = rawBody.fileName ? sanitizeText(rawBody.fileName) : undefined;
    const image = rawBody.image;
    const images = rawBody.images;
    const companionCtx = rawBody.companion ? sanitizeText(rawBody.companion) : "";
    const conversationHistory = rawBody.conversationHistory;

    const {
      model = "google/gemini-2.5-flash",
      mode = "normal",
    } = rawBody;

    try {
      validateInput(message, fileText, fileName);
    } catch (validationError) {
      const errorMessage = validationError instanceof Error ? validationError.message : "Invalid input";
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lower = message.toLowerCase().trim();
    const portraitUrl = 'https://coreaii.vercel.app/prem-prasad.jpg';
    const isOtherCoreAI = /\b(other|unrelated|another|different|compare|comparison)\b|\.ai\b/.test(lower);
    const isCoreAILaunch = /\bcore\s?ai\b/.test(lower) && /\b(launch|announc\w*)\b/.test(lower) && !isOtherCoreAI;

    // 1. Launch question intercept
    if (isCoreAILaunch) {
      const answer = '**Prem Prasad announced CoreAI — Official Launch 2028–30**\n\nThis is the announced future launch window, not a completed launch.\n\nhttps://coreaii.vercel.app/';
      return new Response(`data: ${JSON.stringify({ content: answer })}\n\ndata: [DONE]\n\n`, {
        headers: { ...corsHeaders, 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
      });
    }

    // 2. Founder / creator question intercept
    const founderKeywords = [
      'ceo', 'prem prasad', 'founder', 'who made', 'who created', 'who built', 'who developed', 'who is the owner', 'who owns', 'creator of core', 'made coreai', 'made core ai', 'built coreai', 'built core ai', 'developed coreai', 'developed core ai',
      'kisne banaya', 'kisne banayi', 'kisne banaye', 'kisne bnaya', 'kisne bnaaya', 'kis ne banaya', 'kaun banaya', 'kaun hai founder', 'kaun hai owner', 'kaun hai malik', 'malik kaun', 'malik kon', 'owner kaun', 'owner kon', 'founder kaun', 'founder kon', 'nirmata kaun', 'nirmata kon', 'banane wala kaun', 'banane wala kon', 'creator kaun', 'creator kon',
      'किसने बनाया', 'कौन बनाया', 'कौन है फाउंडर', 'फाउंडर कौन', 'निर्माता', 'मालिक कौन', 'बनाने वाला कौन'
    ];
    const mentionsCoreAI = lower.includes('core ai') || lower.includes('coreai') || lower.includes('core-ai') || lower.includes('app') || lower.includes('aap') || lower.includes('tum') || lower.includes('tumhe') || lower.includes('tumhare') || lower.includes('tumhara') || lower.includes('you') || lower.includes('your');
    const isFounderQuestion = founderKeywords.some(k => lower.includes(k)) && (mentionsCoreAI || lower.includes('prem prasad')) && !isOtherCoreAI;

    if (isFounderQuestion) {
      const answer = `![Prem Prasad, CoreAI founder & CEO](${portraitUrl})\n\n**Prem Prasad**\n\n- **Founder & CEO** of CoreAI\n- **Born:** 4 August 2010, Kolkata, India\n- **Family:**\n- Father: Ajay Prasad\n- Mother: Lakhi Devi\n- Brothers: Dipak Prasad & Manish Prasad\n- Grandparents: Shri Krishun Prasad (dada) & Shrimati Gulabi Devi (dadi)\n- **Social Media:** [Instagram](https://www.instagram.com/_coreaii)\n- **Mission:** “Building the next frontier of artificial intelligence, engineered to outperform ChatGPT.”\n- **Website:** https://coreaii.vercel.app/\n\nThat’s the key info about him.`;
      return new Response(`data: ${JSON.stringify({ content: answer })}\n\ndata: [DONE]\n\n`, {
        headers: { ...corsHeaders, 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
      });
    }

    // 3. Identity question intercept
    const identityKeywords = [
      'what is this app', 'whats this app', "what's this app", 'name of this app', 'app ka naam', 'app kaa naam', 'app ka name', 'app kaa name', 'is app ka naam', 'is app kaa naam', 'is app ka name', 'iss app ka naam', 'aap ka naam', 'aapka naam', 'tumhara naam', 'tera naam', 'tumhara name', 'your name', 'whats your name', "what's your name", 'who are you', 'tum kaun ho', 'tum kon ho', 'aap kaun ho', 'aap kon ho', 'kaun ho tum', 'kon ho tum', 'what app is this', 'which app is this',
      'कौन हो', 'तुम्हारा नाम', 'आपका नाम', 'ऐप का नाम', 'इस ऐप का नाम'
    ];
    if (identityKeywords.some(k => lower.includes(k))) {
      const answer = "Main **CoreAI** hoon — **Prem Prasad, CoreAI founder & CEO**, ka banaya hua AI assistant. Official website: https://coreaii.vercel.app/";
      return new Response(`data: ${JSON.stringify({ content: answer })}\n\ndata: [DONE]\n\n`, {
        headers: { ...corsHeaders, 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
      });
    }

    // 4. Website link question intercept
    const websiteKeywords = [
      'website link', 'website ka link', 'website kaa link', 'site link', 'site ka link', 'app ka link', 'app kaa link', 'link of this app', 'link of this website', 'link of website', 'url of this app', 'url of this website', 'website url', 'which website', 'what website', 'website kaun', 'website kon', 'kaun si website', 'kon si website', 'kaunsi website', 'konsi website', 'website name', 'website kaa naam', 'website ka naam', 'is website ka naam', 'iss website ka naam', 'website batao', 'link batao', 'link bhejo', 'send link', 'share link',
      'वेबसाइट', 'लिंक', 'कौन सी वेबसाइट', 'वेबसाइट का लिंक'
    ];
    if (websiteKeywords.some(k => lower.includes(k))) {
      const answer = "Aap abhi **CoreAI** website par chat kar rahe hain. 🌐\n\n🔗 Website link: **https://coreaii.vercel.app/**\n\nYahan aap AI ke saath chat, image generation, homework help, code aur bahut kuch kar sakte hain.";
      return new Response(`data: ${JSON.stringify({ content: answer })}\n\ndata: [DONE]\n\n`, {
        headers: { ...corsHeaders, 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
      });
    }

    // 5. Image Generation Detection
    const genKeywords = [
      'generate image', 'create image', 'make an image', 'make image', 'draw', 'generate a photo', 'create a photo', 'generate picture', 'create picture',
      'photo banao', 'photo bana do', 'photo bana de', 'image banao', 'tasveer banao', 'tasvir banao', 'chitra banao', 'tasveer bana do', 'tasvir bana do',
      'picture banao', 'painting banao', 'sketch banao', 'photo banaye', 'image banaye',
      'फोटो बनाओ', 'चित्र बनाओ', 'तस्वीर बनाओ', 'फोटो बनाइए', 'चित्र बनाइए'
    ];
    const hasMediaWord = ['image','photo','picture','tasveer','tasvir','chitra','फोटो','चित्र','तस्वीर'].some(w => lower.includes(w));
    const hasMakeWord = ['generate','create','make','banao','bana do','bana de','banaye','bnana','bna','draw','बनाओ','बनाइए','बनाना'].some(w => lower.includes(w));

    // Consolidate input images (up to 8 images for Vision analysis)
    const allInputImages: string[] = [];
    if (image && typeof image === 'string') allInputImages.push(image);
    if (Array.isArray(images)) {
      for (const img of images) {
        if (typeof img === 'string' && img && !allInputImages.includes(img)) {
          allInputImages.push(img);
        }
      }
    }

    const wantsImageGeneration = (mode === 'photo' || genKeywords.some(k => lower.includes(k)) || (hasMediaWord && hasMakeWord)) && allInputImages.length === 0;

    // 11 DEDICATED SPECIALIZED MODES SYSTEM PROMPTS (Strict Task Enforcement)
    const MODE_PROMPTS: Record<string, string> = {
      'normal': "You are CoreAI in Normal Mode. Deliver warm, smart, and helpful answers across all general inquiries.",
      'deep-search': "You are in STRICT Deep Search Mode. You ONLY conduct deep research, multi-perspective breakdown, structured logical sections, bullet points, and critical analytical insights. Go beyond surface-level answers.",
      'code': "You are in STRICT Code Assistant Mode. You ONLY provide clean, production-ready, well-formatted code blocks with syntax highlighting, edge-case handling, and performance tips. Do not write unrelated conversational filler.",
      'study': "You are in STRICT Study Notes Mode. You ONLY act as an academic tutor. Break down topics into structured revision notes, mnemonics, simple analogies, and self-check questions.",
      'homework': "You are in STRICT Homework Helper Mode. You ONLY solve academic homework problems step-by-step with formulas, calculations, highlighted final answers, and a Concept Recap so the student learns.",
      'photo': "You are in STRICT Image Studio Mode. You MUST focus entirely on image creation and visual generation prompts.",
      'creative': "You are in STRICT Creative Writing Mode. You ONLY write imaginative stories, poetry, scripts, essays, or marketing copy with vivid vocabulary and captivating narrative flow.",
      'analyze': "You are in STRICT Analyze & Summarize Mode. You ONLY critically analyze data and text, extract key metrics, patterns, SWOT/pros-cons, and actionable conclusions.",
      'recipe': "You are in STRICT Recipe & Cooking Mode. You ONLY provide: 1) Dish name & intro, 2) Ingredients with exact quantities (metric + Indian units), 3) Clear step-by-step cooking steps, 4) Cooking time & servings, 5) Pro chef tips.",
      'rich': "You are in STRICT Rich Mode (Wealth Mindset). You ONLY advise from the perspective of an elite investor and entrepreneur. Focus strictly on assets, scalability, ROI, high-value opportunities, passive income, and wealth creation.\n\nAfter answering, end with:\n**💬 Continue the conversation:**\n• Reply chat - Ask a follow-up question\n• 👑 Rich Mind - More wealth wisdom",
      'poor': "You are in STRICT Poor Mode (Savings & Frugality). You ONLY advise on maximum frugality, expense reduction, budget survival, zero-waste DIY, and survival money hacks.\n\nAfter answering, end with:\n**💬 Continue the conversation:**\n• Reply chat - Ask a follow-up question\n• 💰 Poor Mind - More saving tips"
    };

    const activeModePrompt = MODE_PROMPTS[mode] || MODE_PROMPTS['normal'];

    const DOST_RULES = `\n\n=== DOST MODE (ALWAYS APPLY, every mode) ===\nTalk like a trusted, caring best friend, not a robot. 1) EMOTIONAL MIRRORING: first acknowledge feelings, then help. 2) TIME AWARENESS: use user local time naturally when fitting. 3) SAFE SPACE: never judge or lecture. 4) PRIVACY: chat history is on their device. 5) NEVER say "As an AI language model", "Certainly, here is", or robotic phrases. Be natural in Hindi/Hinglish/English.\n${companionCtx ? "CONTEXT: " + companionCtx : ""}\n=== END DOST MODE ===\n`;

    const systemPrompt = `You are CoreAI, an AI assistant app built by Prem Prasad (Founder & CEO).
FOUNDER FACTS: Prem Prasad — Founder & CEO of CoreAI; born 4 August 2010; from Kolkata, West Bengal; Indian; Father Ajay Prasad; Mother Lakhi Devi; Brothers Dipak Prasad & Manish Prasad; Dada ji Shri Krishun Prasad; Dadi ji Shrimati Gulabi Devi; Instagram https://www.instagram.com/_coreaii; CoreAI mission: "Building the next frontier of artificial intelligence, engineered to outperform ChatGPT."
Your name is CoreAI. The official website is https://coreaii.vercel.app/ (give only this link when asked).
Never say you are Google, Gemini, OpenAI, ChatGPT, or mention the backend model provider. You ARE CoreAI.
Always answer directly, match the user's language (Hindi/Hinglish/English), and be clear and practical.

=== ACTIVE DEDICATED MODE: ${mode.toUpperCase()} ===
${activeModePrompt}
=== END ACTIVE MODE ===
${DOST_RULES}`;

    const userParts: any[] = [{ type: "text", text: message }];

    if (fileText) {
      userParts.push({ type: "text", text: `Attached file (${fileName || 'file'}):\n${fileText}` });
    }

    for (const imgUrl of allInputImages.slice(0, 8)) {
      userParts.push({
        type: "image_url",
        image_url: { url: imgUrl }
      });
    }

    const messagesArray: any[] = [{ role: "system", content: systemPrompt }];

    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-10);
      for (const histMsg of recentHistory) {
        if (histMsg && histMsg.content) {
          messagesArray.push({
            role: histMsg.role === 'assistant' ? 'assistant' : 'user',
            content: histMsg.content
          });
        }
      }
    }

    messagesArray.push({ role: "user", content: userParts });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");

    // IMAGE GENERATION
    if (wantsImageGeneration && LOVABLE_API_KEY) {
      try {
        const imageRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image",
            messages: [
              {
                role: "user",
                content: `Generate a high quality visual image prompt based on this: ${message}`
              }
            ],
            modalities: ["image", "text"]
          }),
        });

        if (imageRes.ok) {
          const imgData = await imageRes.json();
          const firstChoice = imgData.choices?.[0];
          const generatedImg = firstChoice?.message?.images?.[0]?.image_url?.url;
          const textReply = firstChoice?.message?.content || "";

          if (generatedImg) {
            const out = {
              content: textReply,
              images: [{ url: generatedImg, type: "image/png", name: "generated-image.png" }]
            };
            return new Response(`data: ${JSON.stringify(out)}\n\ndata: [DONE]\n\n`, {
              headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
            });
          }
        }
      } catch (err) {
        console.error("Image generation error:", err);
      }
    }

    // TEXT & VISION CHAT: Prefer Groq for pure text, fallback to Gemini Gateway
    let streamResponse: Response | null = null;

    if (GROQ_API_KEY && allInputImages.length === 0 && !fileText) {
      try {
        const groqMessages = messagesArray.map(m => ({
          role: m.role,
          content: typeof m.content === 'string' ? m.content : (Array.isArray(m.content) ? m.content[0]?.text || '' : '')
        }));

        streamResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: groqMessages,
            stream: true,
            temperature: 0.7,
            max_tokens: 3000
          }),
        });

        if (!streamResponse.ok) {
          streamResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${GROQ_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "llama-3.1-8b-instant",
              messages: groqMessages,
              stream: true,
              temperature: 0.7,
              max_tokens: 3000
            }),
          });
        }
      } catch (err) {
        console.warn("Groq fetch error, falling back to Lovable Gateway:", err);
        streamResponse = null;
      }
    }

    // Fallback or Vision routing (Gemini 2.5 Flash)
    if (!streamResponse || !streamResponse.ok) {
      if (!LOVABLE_API_KEY) {
        return new Response(JSON.stringify({ error: "No AI service key configured." }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      streamResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: allInputImages.length > 0 ? "google/gemini-2.5-flash" : (model || "google/gemini-2.5-flash"),
          messages: messagesArray,
          stream: true,
        }),
      });

      if (!streamResponse.ok) {
        const errText = await streamResponse.text();
        return new Response(JSON.stringify({ error: `AI Gateway error: ${errText}` }), {
          status: streamResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Pass through SSE stream
    const reader = streamResponse.body?.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        if (!reader) {
          controller.close();
          return;
        }

        let buffer = "";
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || !trimmed.startsWith("data: ")) continue;
              const data = trimmed.slice(6);
              if (data === "[DONE]") {
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                continue;
              }

              try {
                const parsed = JSON.parse(data);
                const deltaContent = parsed.choices?.[0]?.delta?.content || "";
                if (deltaContent) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ content: deltaContent })}\n\n`)
                  );
                }
              } catch {}
            }
          }
        } catch (e) {
          console.error("Stream forward error:", e);
        } finally {
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Internal Server Error";
    return new Response(JSON.stringify({ error: errorMsg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
