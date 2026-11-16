import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation
const validateInput = (message: string, fileText?: string, fileName?: string) => {
  if (!message || typeof message !== 'string') {
    throw new Error("Invalid message");
  }
  if (message.length > 50000) {
    throw new Error("Message too long");
  }
  if (fileText !== undefined) {
    if (typeof fileText !== 'string') {
      throw new Error("Invalid file text");
    }
    if (fileText.length > 100000) {
      throw new Error("File text too long");
    }
  }
  if (fileName !== undefined) {
    if (typeof fileName !== 'string') {
      throw new Error("Invalid file name");
    }
    if (fileName.length > 255) {
      throw new Error("File name too long");
    }
    if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
      throw new Error("Invalid file name");
    }
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header if available; never block guest/public users (₹0 public launch)
    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.replace('Bearer ', '');
        const { data: { user } } = await supabase.auth.getUser(token);
        userId = user?.id || null;
      } catch (_e) {
        userId = null;
      }
    }

    const { 
      message, 
      model = "google/gemini-2.5-flash",
      mode = "normal",
      image,
      images = [],
      fileText,
      fileName,
      conversationHistory = [],
      companion
    } = await req.json();

    const companionCtx = typeof companion === "string" ? companion.replace(/[\u0000-\u001f]/g, " ").slice(0, 1200) : "";
    const DOST_RULES = `\n\n=== DOST MODE (ALWAYS APPLY, every mode) ===\nTalk like a trusted, caring best friend, not a robot. 1) EMOTIONAL MIRRORING: first acknowledge feelings, then help. Happy/excited -> celebrate warmly ("Bhai kya baat hai! Party kab de raha hai? 🎉"). Sad/stressed -> calm, gentle, supportive ("Tu akela nahi hai. Saans le, paani pi, bata kya hua."). Urgent code/maths -> skip small talk, give the exact accurate solution directly. 2) TIME AWARENESS: use the user local time naturally only when it fits, e.g. very late night -> "Itni raat ko jag raha hai? Sab theek?", morning -> "Good morning! Chai hui?", Sunday -> relaxed tone. Do not repeat the time greeting every message. 3) SAFE SPACE: never judge, shame or lecture; if user shares a mistake or something personal, reassure that they can say anything here. 4) PRIVACY: if user worries about privacy, reassure that chat history is saved only on their own device. 5) MEMORY: use the remembered name/facts naturally; if a PENDING FOLLOW-UP is given, start by asking how it went. 6) NEVER say "As an AI language model", "Certainly, here is", "I am programmed to", or similar robotic phrases. Be warm, natural, in the user's language (Hindi/Hinglish/English). Still keep founder facts and accuracy intact. Never give harmful advice; for self-harm signs, respond with deep care and suggest talking to a trusted person or helpline (India: 14416 Tele-MANAS).\n${companionCtx ? "CONTEXT: " + companionCtx : ""}\n=== END DOST MODE ===\n`;

    // Validate inputs
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

    // 11 MODES SYSTEM PROMPTS
    const MODE_PROMPTS: Record<string, string> = {
      'normal': "You are CoreAI in Normal Mode. Deliver crisp, warm, and helpful answers across all general inquiries.",
      'deep-search': "You are an elite AI research analyst in Deep Search Mode. Provide deep, comprehensive research with multi-perspective analysis, logical breakdown, and high-level critical insights. Go beyond surface-level information.",
      'code': "You are a software architect in Code Assistant Mode. Provide clean, production-ready, well-formatted code blocks with proper syntax highlighting, edge-case handling, and performance tips.",
      'study': "You are a world-class tutor in Study Notes Mode. Break down complex topics into clear notes, mnemonics, simple real-world analogies, and self-check questions.",
      'homework': "You are an expert tutor in Homework Helper Mode. Solve questions step-by-step with formulas, step-by-step calculations, highlighted final answers, and a Concept Recap so the student learns.",
      'photo': "You are an expert AI image generator in Image Studio Mode. When users ask for images, generate high-quality visuals.",
      'creative': "You are a master storyteller in Creative Writing Mode. Write imaginative, engaging stories, poetry, scripts, or marketing copy with vivid vocabulary.",
      'analyze': "You are a senior data analyst in Analyze & Summarize Mode. Critically analyze data and text, extract key takeaways, patterns, metrics, and actionable conclusions.",
      'recipe': "You are a master chef in Recipe & Cooking Mode. Provide: 1) Dish name & intro, 2) Ingredients with exact quantities (metric + Indian units), 3) Clear step-by-step cooking steps, 4) Cooking time & servings, 5) Pro chef tips.",
      'rich': "You are a Rich Mindset Coach. Focus on assets, scalability, ROI, high-value opportunities, passive income, and wealth creation.\n\nAfter answering, end with:\n**💬 Continue the conversation:**\n• Reply chat - Ask a follow-up question\n• 👑 Rich Mind - More wealth wisdom",
      'poor': "You are a Frugal Living and Survival Money Expert. Focus on smart budgeting, maximum cost-cutting, zero-waste DIY solutions, and survival money hacks.\n\nAfter answering, end with:\n**💬 Continue the conversation:**\n• Reply chat - Ask a follow-up question\n• 💰 Poor Mind - More saving tips"
    };

    const activeModePrompt = MODE_PROMPTS[mode] || MODE_PROMPTS['normal'];

    // Construct System Prompt
    const systemPrompt = `You are CoreAI, an AI assistant app built by Prem Prasad (Founder & CEO).
FOUNDER FACTS: Prem Prasad — Founder & CEO of CoreAI; born 4 August 2010; from Kolkata, West Bengal; Indian; Father Ajay Prasad; Mother Lakhi Devi; Brothers Dipak Prasad & Manish Prasad; Dada ji Shri Krishun Prasad; Dadi ji Shrimati Gulabi Devi; Instagram https://www.instagram.com/_coreaii; CoreAI mission: "Building the next frontier of artificial intelligence, engineered to outperform ChatGPT."
Your name is CoreAI. The official website is https://coreaii.vercel.app/ (give only this link when asked).
Never say you are Google, Gemini, OpenAI, ChatGPT, or mention the backend model provider. You ARE CoreAI.
Always answer directly, match the user's language (Hindi/Hinglish/English), and be clear and practical.

=== ACTIVE MODE: ${mode.toUpperCase()} ===
${activeModePrompt}
=== END ACTIVE MODE ===
${DOST_RULES}`;

    // User message content (supporting text + up to 8 images + attached file)
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

    // Add recent conversation history (last 10 turns)
    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-10);
      for (const histMsg of recentHistory) {
        if (histMsg.content) {
          messagesArray.push({
            role: histMsg.role === 'assistant' ? 'assistant' : 'user',
            content: histMsg.content
          });
        }
      }
    }

    messagesArray.push({
      role: "user",
      content: userParts.length === 1 ? message : userParts
    });

    // 1. IMAGE GENERATION ROUTE
    if (wantsImageGeneration) {
      const apiKey = Deno.env.get("LOVABLE_API_KEY");
      if (!apiKey) {
        return new Response(JSON.stringify({ error: "Image generation service unavailable" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const imgRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image",
          messages: messagesArray,
          modalities: ["image", "text"],
        }),
      });

      if (!imgRes.ok) {
        const errText = await imgRes.text();
        console.error("Image generation failed:", imgRes.status, errText);
        return new Response(JSON.stringify({ error: "Failed to generate image" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const json = await imgRes.json();
      const choice = json.choices?.[0] || {};
      const messageObj = choice.message || {};
      const contentText = messageObj.content || "";
      const imagesList = messageObj.images || [];

      // Save to Supabase if authenticated
      if (userId && imagesList.length > 0) {
        for (const imgItem of imagesList) {
          if (imgItem?.image_url?.url) {
            try {
              await supabase.from('generated_images').insert({
                user_id: userId,
                image_url: imgItem.image_url.url,
                prompt: message
              });
            } catch (_e) {
              // Ignore save error
            }
          }
        }
      }

      // Stream generated image cleanly
      const stream = new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder();
          if (imagesList.length > 0) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: contentText, images: imagesList })}\n\n`));
          } else if (contentText) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: contentText })}\n\n`));
          }
          controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
          controller.close();
        }
      });

      return new Response(stream, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
        },
      });
    }

    // 2. TEXT CHAT → 100% Free Groq First (Llama 3.3 70B, ₹0 Cost)
    const groqKey = Deno.env.get("GROQ_API_KEY");
    let response: Response | null = null;

    if (groqKey && allInputImages.length === 0) {
      try {
        const groqMessages = messagesArray.map((m: any) => ({
          role: m.role,
          content: typeof m.content === "string" 
            ? m.content 
            : Array.isArray(m.content) 
              ? m.content.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('\n') 
              : String(m.content || "")
        }));

        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${groqKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: groqMessages,
            temperature: 0.7,
            max_tokens: 2048,
            stream: true,
          }),
        });

        if (groqRes.ok && groqRes.body) {
          response = groqRes;
        } else {
          // Fallback to smaller fast free model on Groq
          const groqFallback = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${groqKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "llama-3.1-8b-instant",
              messages: groqMessages,
              temperature: 0.7,
              max_tokens: 2048,
              stream: true,
            }),
          });
          if (groqFallback.ok && groqFallback.body) {
            response = groqFallback;
          }
        }
      } catch (_e) {
        console.warn("Groq error, falling back to Lovable Gateway");
      }
    }

    // 3. Fallback to Lovable Gateway
    if (!response) {
      const apiKey = Deno.env.get("LOVABLE_API_KEY");
      if (!apiKey) {
        return new Response(JSON.stringify({ error: "AI service unavailable" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: allInputImages.length > 0 ? "google/gemini-2.5-flash" : (model || "google/gemini-2.5-flash"),
          messages: messagesArray,
          stream: true,
        }),
      });
    }

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please wait a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "Failed to get AI response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 4. Stream response to client
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          controller.close();
          return;
        }

        try {
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
              break;
            }

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed) continue;

              if (trimmed.startsWith('data: ')) {
                const data = trimmed.slice(6);
                if (data === '[DONE]') {
                  controller.enqueue(new TextEncoder().encode(`data: [DONE]\n\n`));
                  controller.close();
                  return;
                }

                try {
                  const parsed = JSON.parse(data);
                  const delta = parsed.choices?.[0]?.delta || {};
                  const content = delta?.content;
                  if (content) {
                    controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ content })}\n\n`));
                  }
                } catch (_e) {
                  // Ignore partial JSON
                }
              }
            }
          }
        } catch (error) {
          controller.error(error);
        }
      },
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
    console.error("AI handler error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
