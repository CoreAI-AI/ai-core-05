// ElevenLabs Speech-to-Text edge function
// Accepts multipart/form-data with an "audio" file and returns { text }

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("ELEVENLABS_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "ElevenLabs not connected" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const inFormData = await req.formData();
    const audio = inFormData.get("audio");
    if (!(audio instanceof File) && !(audio instanceof Blob)) {
      return new Response(
        JSON.stringify({ error: "Missing audio file" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const languageCode = (inFormData.get("language_code") as string | null) ?? undefined;

    const out = new FormData();
    out.append("file", audio, (audio as File).name ?? "recording.webm");
    out.append("model_id", "scribe_v1");
    if (languageCode) out.append("language_code", languageCode);

    const resp = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
      method: "POST",
      headers: { "xi-api-key": apiKey },
      body: out,
    });

    if (!resp.ok) {
      const err = await resp.text();
      console.error("ElevenLabs STT error", resp.status, err);
      return new Response(
        JSON.stringify({ error: err || `STT failed (${resp.status})` }),
        { status: resp.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await resp.json();
    return new Response(
      JSON.stringify({ text: data.text ?? "", raw: data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("STT exception", e);
    return new Response(
      JSON.stringify({ error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
