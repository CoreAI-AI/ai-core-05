import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation
const validateInput = (message: string, fileText?: string, fileName?: string) => {
  // Validate message
  if (!message || typeof message !== 'string') {
    throw new Error("Invalid message");
  }
  if (message.length > 50000) {
    throw new Error("Message too long");
  }
  
  // Validate fileText if present
  if (fileText !== undefined) {
    if (typeof fileText !== 'string') {
      throw new Error("Invalid file text");
    }
    if (fileText.length > 100000) {
      throw new Error("File text too long");
    }
  }
  
  // Validate fileName if present
  if (fileName !== undefined) {
    if (typeof fileName !== 'string') {
      throw new Error("Invalid file name");
    }
    if (fileName.length > 255) {
      throw new Error("File name too long");
    }
    // Check for path traversal
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
    const { 
      message, 
      model = "google/gemini-2.5-flash",
      mode = "normal",
      image,
      fileText,
      fileName,
      conversationHistory = []
    } = await req.json();

    // Validate inputs
    try {
      validateInput(message, fileText, fileName);
    } catch (validationError) {
      const errorMessage = validationError instanceof Error ? validationError.message : "Invalid input";
      console.error("Input validation error:", errorMessage);
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

    // Validate model parameter to prevent injection
    const allowedModels = [
      "google/gemini-2.5-flash",
      "google/gemini-2.5-flash-image-preview",
      "google/gemini-2.5-pro",
      "google/gemini-2.5-flash-lite",
      "openai/gpt-5",
      "openai/gpt-5-mini",
      "openai/gpt-5-nano"
    ];
    
    if (!allowedModels.includes(model)) {
      return new Response(JSON.stringify({ error: "Invalid model" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get the LOVABLE_API_KEY from environment (automatically provided)
    const apiKey = Deno.env.get("LOVABLE_API_KEY");

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Detect if this is an image GENERATION request (multi-language, not analysis)
    const lower = message.toLowerCase();

    // Common keywords across English + Hindi/Hinglish + Devanagari
    const genKeywords = [
      // English
      'generate image', 'create image', 'make an image', 'make image', 'draw', 'generate a photo', 'create a photo', 'generate picture', 'create picture',
      // Hinglish
      'photo banao', 'photo bana do', 'photo bana de', 'image banao', 'tasveer banao', 'tasvir banao', 'chitra banao', 'tasveer bana do',
      // Devanagari
      'फोटो', 'चित्र', 'तस्वीर', 'बनाओ', 'बनाइए', 'बनाना'
    ];

    const hasMediaWord = ['image','photo','picture','tasveer','tasvir','chitra','फोटो','चित्र','तस्वीर'].some(w => lower.includes(w));
    const hasMakeWord = ['generate','create','make','banao','bana do','bana de','banaye','bnana','bna','बनाओ','बनाइए','बनाना'].some(w => lower.includes(w));

    const wantsImageGeneration = mode === 'photo' || (!image && (genKeywords.some(k => lower.includes(k)) || (hasMediaWord && hasMakeWord)));
    
    const modelToUse = wantsImageGeneration ? "google/gemini-2.5-flash-image-preview" : (model || "google/gemini-2.5-flash");
    
    console.log(`mode=${mode}, wantsImageGeneration=${wantsImageGeneration}, hasInputImage=${Boolean(image)}, model=${modelToUse}`);
    
    // Build user message content - can be text + image for vision or include file text
    let userContent: any = message;

    const parts: any[] = [];
    parts.push({ type: "text", text: message });

    if (fileText) {
      parts.push({ type: "text", text: `Attached file (${fileName || 'file'}):\n${fileText}` });
    }

    if (image) {
      parts.push({
        type: "image_url",
        image_url: { url: image },
      });
    }

    if (parts.length > 1) {
      userContent = parts;
    }

    // Build messages array with conversation history
    const messagesArray: any[] = [
      {
        role: "system",
        content: mode === 'photo' || wantsImageGeneration 
          ? "You are an AI that MUST generate an image when requested. When the user asks you to generate, create, draw, or make an image, you must produce an actual image file, not just describe it. Always generate the image first, then provide a brief description of what you created."
          : mode === 'deep-search'
          ? "You are an advanced AI research assistant with deep search capabilities. Provide comprehensive, well-researched answers with detailed explanations. Break down complex topics into understandable parts. Use multiple perspectives and cite reasoning. Go beyond surface-level information. Think deeply and provide thorough analysis."
          : mode === 'study'
          ? "You are an expert AI tutor focused on helping students learn effectively. Explain concepts step-by-step with clear examples. Use analogies and real-world applications. Break complex ideas into simple, digestible parts. Encourage understanding over memorization. Ask follow-up questions to ensure comprehension. Be patient and thorough in your explanations."
          : "You are a helpful AI assistant that can engage in conversations on various topics. You can also analyze images and attached text when provided. Provide clear, informative, and engaging responses to user queries.",
      }
    ];

    // Limit conversation history to last 15 messages for performance
    if (conversationHistory && Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-15);
      
      for (const histMsg of recentHistory) {
        const msgContent: any[] = [];
        
        // Add text content
        if (histMsg.content) {
          msgContent.push({ type: "text", text: histMsg.content });
        }
        
        // Add images from history if present (limit to 2 most recent images)
        if (histMsg.images && Array.isArray(histMsg.images)) {
          const recentImages = histMsg.images.slice(-2);
          for (const img of recentImages) {
            if (img.url) {
              msgContent.push({
                type: "image_url",
                image_url: { url: img.url }
              });
            }
          }
        }
        
        messagesArray.push({
          role: histMsg.role,
          content: msgContent.length === 1 && msgContent[0].type === "text" 
            ? msgContent[0].text 
            : msgContent
        });
      }
    }

    // Add current user message
    messagesArray.push({
      role: "user",
      content: userContent,
    });

    const requestBody: any = {
      model: modelToUse,
      stream: !wantsImageGeneration,
      messages: messagesArray,
    };

    // Add modalities for image generation
    if (wantsImageGeneration) {
      requestBody.modalities = ["image", "text"];
      console.log("Added image modalities to request (generation)");
    }

    // Call the Lovable AI Gateway with streaming
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please check your credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: "Failed to get AI response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // For image requests, use non-streaming gateway call and emit a simple SSE with images
    if (wantsImageGeneration) {
      const json = await response.json();
      const choice = json.choices?.[0] || {};
      const messageObj = choice.message || {};
      const contentText = messageObj.content || "";
      const images = messageObj.images || [];

      console.log(`Image generation response - content length: ${contentText.length}, images: ${images?.length || 0}`);

      const stream = new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder();
          if (contentText) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: contentText })}\n\n`));
          }
          if (images && images.length > 0) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: "", images })}\n\n`));
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
          "Connection": "keep-alive",
        },
      });
    }

    // Create a readable stream to handle the streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          controller.close();
          return;
        }

        try {
          let fullResponse = "";
          let images: any[] = [];
          let buffer = ""; // Buffer for incomplete lines across chunks

          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              // Process any remaining buffered content
              if (buffer.trim()) {
                console.log(`Processing final buffer: ${buffer.substring(0, 100)}...`);
                if (buffer.startsWith('data: ')) {
                  const data = buffer.slice(6);
                  if (data !== '[DONE]') {
                    try {
                      const parsed = JSON.parse(data);
                      const choice = parsed.choices?.[0] || {};
                      const delta = choice?.delta || {};
                      const content = delta?.content;
                      if (content) {
                        fullResponse += content;
                        controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ content })}\n\n`));
                      }
                    } catch (e) {
                      console.log("Failed to parse final buffer content");
                    }
                  }
                }
              }
              // If we have images, send them as a final chunk
              if (images.length > 0) {
                controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ 
                  content: "", 
                  images: images 
                })}\n\n`));
              }
              controller.close();
              break;
            }

            const chunk = decoder.decode(value);
            buffer += chunk; // Add chunk to buffer
            const lines = buffer.split('\n');
            buffer = lines.pop() || ""; // Keep last partial line in buffer

            // Process complete lines only (not partial ones still in buffer)
            for (const line of lines) {
              if (!line.trim()) continue; // Skip empty lines
              
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                
                if (data === '[DONE]') {
                  // Before closing the stream, flush any collected images
                  if (images.length > 0) {
                    controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ 
                      content: "", 
                      images: images 
                    })}\n\n`));
                  }
                  controller.close();
                  return;
                }

                try {
                  const parsed = JSON.parse(data);
                  const choice = parsed.choices?.[0] || {};
                  const delta = choice?.delta || {};
                  const messageObj = choice?.message || {};
                  const content = delta?.content;
                  const responseImages = delta?.images || messageObj?.images;
                  
                  // Handle images from the response (emit immediately as well as on final flush)
                  if (responseImages && responseImages.length > 0) {
                    images = responseImages;
                    controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ 
                      content: "", 
                      images: images 
                    })}\n\n`));
                  }
                  
                  if (content) {
                    fullResponse += content;
                    controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ content })}\n\n`));
                  }
                } catch (e) {
                  console.log(`Failed to parse SSE data: ${data.substring(0, 50)}...`);
                  // Skip invalid JSON - might be partial, will be handled when complete
                  continue;
                }
              }
            }
          }
        } catch (error) {
          console.error("Streaming error:", error);
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
    console.error("Error in AI call:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
