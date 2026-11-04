import { useEffect, useState } from "react";
import { Download, Share2, Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/coreai-logo.jpeg.asset.json";

const SITE = "coreaii.vercel.app";
const W = 1080;
const FONT = "Inter, system-ui, sans-serif";

/** Strip markdown into plain readable lines. */
export const toPlainText = (md: string) =>
  md
    .replace(/```[\s\S]*?```/g, (b) => b.replace(/```\w*/g, "").trim())
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/\*\*|__|\*|`/g, "")
    .replace(/^\s*[-*+]\s+/gm, "• ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const wrap = (ctx: CanvasRenderingContext2D, text: string, maxW: number) => {
  const lines: string[] = [];
  for (const para of text.split("\n")) {
    if (!para.trim()) { if (lines.length && lines[lines.length - 1] !== "") lines.push(""); continue; }
    let line = "";
    for (const raw of para.split(" ")) {
      let word = raw;
      // break very long words (URLs, code)
      while (ctx.measureText(word).width > maxW) {
        let n = word.length;
        while (n > 1 && ctx.measureText(word.slice(0, n)).width > maxW) n--;
        if (line) { lines.push(line); line = ""; }
        lines.push(word.slice(0, n)); word = word.slice(n);
      }
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = word; }
      else line = test;
    }
    if (line) lines.push(line);
  }
  while (lines[lines.length - 1] === "") lines.pop();
  return lines;
};

/** Pick the largest font size that fits the box; clamp with ellipsis if even the smallest overflows. */
const fitText = (
  ctx: CanvasRenderingContext2D, text: string, maxW: number, maxH: number,
  sizes: number[], weight: number,
) => {
  for (const size of sizes) {
    ctx.font = `${weight} ${size}px ${FONT}`;
    const lh = Math.round(size * 1.32);
    const lines = wrap(ctx, text, maxW);
    if (lines.length * lh <= maxH) return { lines, size, lh };
  }
  const size = sizes[sizes.length - 1];
  ctx.font = `${weight} ${size}px ${FONT}`;
  const lh = Math.round(size * 1.32);
  const max = Math.max(1, Math.floor(maxH / lh));
  const lines = wrap(ctx, text, maxW).slice(0, max);
  let last = lines[max - 1] || "";
  while (last && ctx.measureText(last + " …").width > maxW) last = last.slice(0, -1);
  lines[max - 1] = last.trimEnd() + " …";
  return { lines, size, lh };
};

const rr = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
};

const pill = (ctx: CanvasRenderingContext2D, x: number, y: number, label: string, c1: string, c2: string) => {
  ctx.font = `700 38px ${FONT}`;
  const w = ctx.measureText(label).width + 64;
  const g = ctx.createLinearGradient(x, y, x + w, y);
  g.addColorStop(0, c1); g.addColorStop(1, c2);
  ctx.save(); ctx.shadowColor = "rgba(40,20,90,0.3)"; ctx.shadowBlur = 16; ctx.shadowOffsetY = 6;
  ctx.fillStyle = g; rr(ctx, x, y, w, 70, 35); ctx.fill(); ctx.restore();
  ctx.fillStyle = "#fff"; ctx.textBaseline = "middle"; ctx.fillText(label, x + 32, y + 37);
};

const glassBox = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, tint: [string, string]) => {
  ctx.save(); ctx.shadowColor = "rgba(80,60,160,0.22)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10;
  const g = ctx.createLinearGradient(x, y, x + w, y + h);
  g.addColorStop(0, tint[0]); g.addColorStop(1, tint[1]);
  ctx.fillStyle = g; rr(ctx, x, y, w, h, 40); ctx.fill(); ctx.restore();
  ctx.strokeStyle = "rgba(255,255,255,0.9)"; ctx.lineWidth = 3; rr(ctx, x, y, w, h, 40); ctx.stroke();
};

const emoji = (ctx: CanvasRenderingContext2D, e: string, x: number, y: number, size: number) => {
  ctx.font = `${size}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
  ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(e, x, y); ctx.textAlign = "left";
};

const loadImg = (src: string) => new Promise<HTMLImageElement | null>((res) => {
  const i = new Image(); i.crossOrigin = "anonymous";
  i.onload = () => res(i); i.onerror = () => res(null); i.src = src;
});

const layout = (ctx: CanvasRenderingContext2D, text: string, maxW: number, size: number, weight: number) => {
  ctx.font = `${weight} ${size}px ${FONT}`;
  const lh = Math.round(size * 1.38);
  return { lines: wrap(ctx, text, maxW), size, lh };
};

export async function renderCard(answer: string, question?: string): Promise<Blob> {
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d")!;
  try { await document.fonts?.ready; } catch { /* ignore */ }
  const logo = await loadImg(logoAsset.url);

  // Full text, no cut-off: card grows with the answer.
  const pad0 = 50, bx0 = pad0 + 30, bw0 = W - (pad0 + 30) * 2;
  const qText = toPlainText(question?.trim() || "Ask anything on CoreAI");
  const aText = toPlainText(answer);
  const qf = layout(ctx, qText, bw0 - 220, qText.length < 120 ? 46 : qText.length < 300 ? 38 : 32, 600);
  const aSize = aText.length < 350 ? 40 : aText.length < 900 ? 34 : aText.length < 2000 ? 30 : 27;
  const af = layout(ctx, aText, bw0 - 290, aSize, 500);
  const qH = Math.max(300, qf.lines.length * qf.lh + 150);
  const aH = Math.max(560, af.lines.length * af.lh + 160);
  const qY = 640, aY = qY + qH + 40, rY = aY + aH + 40, sY = rY + 240;
  const H = Math.min(30000, sY + 420);
  c.width = W; c.height = H;

  // Lavender background
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#d9d2ff"); bg.addColorStop(0.5, "#e4defc"); bg.addColorStop(1, "#cfc6fb");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  // Floating cubes / sparkles
  const deco: [number, number, number, string][] = [
    [80, 130, 50, "#2dd4bf"], [470, 90, 44, "#8b5cf6"], [980, 260, 56, "#7c3aed"], [900, 360, 44, "#14b8a6"], [60, 330, 34, "#a78bfa"],
  ];
  deco.forEach(([x, y, s, col]) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(0.5); ctx.fillStyle = col; ctx.globalAlpha = 0.85;
    rr(ctx, -s / 2, -s / 2, s, s, 10); ctx.fill(); ctx.restore();
  });
  ctx.fillStyle = "#fff"; ["✦"].forEach(() => {
    ctx.font = `40px ${FONT}`; ctx.fillText("✦", 520, 220); ctx.fillText("✦", 1010, 170); ctx.fillText("✦", 90, 390);
  });

  // Robot mascot (left) + orbit logo (right)
  emoji(ctx, "🤖", 280, 230, 250);
  emoji(ctx, "👍", 440, 300, 110);
  const cx = 770, cy = 190;
  ctx.save(); ctx.shadowColor = "rgba(45,212,191,0.6)"; ctx.shadowBlur = 50;
  ctx.fillStyle = "#0f3b3d"; ctx.beginPath(); ctx.arc(cx, cy, 150, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  if (logo) {
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, 150, 0, Math.PI * 2); ctx.clip();
    const sw = logo.width * 0.72, so = logo.width * 0.14;
    ctx.drawImage(logo, so, so, sw, sw, cx - 150, cy - 150, 300, 300); ctx.restore();
  }
  ctx.strokeStyle = "rgba(103,232,249,0.8)"; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.ellipse(cx, cy + 20, 230, 60, -0.25, 0, Math.PI * 2); ctx.stroke();

  // Main frosted card
  const pad = 50;
  ctx.save(); ctx.shadowColor = "rgba(60,40,140,0.25)"; ctx.shadowBlur = 40;
  ctx.fillStyle = "rgba(240,236,255,0.85)"; rr(ctx, pad, 420, W - pad * 2, H - 460, 60); ctx.fill(); ctx.restore();

  // Dark header banner
  const hb = ctx.createLinearGradient(0, 400, 0, 580);
  hb.addColorStop(0, "#134e4a"); hb.addColorStop(1, "#0b2f33");
  ctx.fillStyle = hb; rr(ctx, pad + 20, 400, W - (pad + 20) * 2, 180, 60); ctx.fill();
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.font = `800 110px ${FONT}`;
  const coreW = ctx.measureText("Core").width, aiW = ctx.measureText("AI").width;
  const sx = W / 2 - (coreW + aiW) / 2;
  ctx.textAlign = "left"; ctx.fillStyle = "#fff"; ctx.fillText("Core", sx, 465);
  const aiG = ctx.createLinearGradient(sx + coreW, 0, sx + coreW + aiW, 0);
  aiG.addColorStop(0, "#5eead4"); aiG.addColorStop(1, "#a3e635");
  ctx.fillStyle = aiG; ctx.fillText("AI", sx + coreW, 465);
  ctx.textAlign = "center"; ctx.font = `600 40px ${FONT}`; ctx.fillStyle = "#ccfbf1";
  ctx.fillText("Think • Learn • Grow", W / 2, 545);
  ctx.textAlign = "left";

  const bx = pad + 30, bw = W - (pad + 30) * 2;

  // QUESTION
  glassBox(ctx, bx, qY + 35, bw - 140, qH - 35, ["#f5f3ff", "#ede9fe"]);
  pill(ctx, bx + 10, qY, "💬  Your Question", "#7c3aed", "#6d28d9");
  emoji(ctx, "❓", W - pad - 90, qY + 160, 150);
  ctx.fillStyle = "#1e1b4b"; ctx.textBaseline = "top"; ctx.font = `600 ${qf.size}px ${FONT}`;
  const qTop = qY + 115 + Math.max(0, (qH - 130 - qf.lines.length * qf.lh) / 2);
  qf.lines.forEach((l, i) => ctx.fillText(l, bx + 40, qTop + i * qf.lh));

  // ANSWER
  glassBox(ctx, bx, aY + 35, bw, aH - 35, ["#ecfeff", "#ccfbf1"]);
  pill(ctx, bx + 230, aY, "✨  CoreAI Answer", "#0f766e", "#115e59");
  emoji(ctx, "💡", bx + 115, aY + 270, 150);
  ctx.fillStyle = "#0f172a"; ctx.textBaseline = "top"; ctx.font = `500 ${af.size}px ${FONT}`;
  af.lines.forEach((l, i) => ctx.fillText(l, bx + 245, aY + 110 + i * af.lh));

  // RESULT
  const rH = 200;
  glassBox(ctx, bx, rY, bw, rH, ["#f5f3ff", "#e9e3ff"]);
  emoji(ctx, "🏆", bx + 140, rY + 100, 140);
  pill(ctx, bx + 330, rY + 15, "✔  Result", "#6d28d9", "#7c3aed");
  ctx.fillStyle = "#111827"; ctx.textBaseline = "middle"; ctx.font = `800 52px ${FONT}`;
  ctx.fillText("Great Job!", bx + 340, rY + 125);
  ctx.font = `500 32px ${FONT}`; ctx.fillStyle = "#374151";
  ctx.fillText("Thanks for using CoreAI 💚", bx + 340, rY + 172);

  // Share Your Result row
  const sbw = 620, sbx = (W - sbw) / 2;
  const sg = ctx.createLinearGradient(0, sY, 0, sY + 100);
  sg.addColorStop(0, "#134e4a"); sg.addColorStop(1, "#0b2f33");
  ctx.save(); ctx.shadowColor = "rgba(15,60,60,0.35)"; ctx.shadowBlur = 20; ctx.shadowOffsetY = 8;
  ctx.fillStyle = sg; rr(ctx, sbx, sY, sbw, 100, 50); ctx.fill(); ctx.restore();
  ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.font = `700 44px ${FONT}`;
  ctx.fillText("🔗  Share Your Result", W / 2, sY + 52);
  const icons: [string, string, string, string][] = [
    ["WhatsApp", "#22c55e", "#15803d", "W"], ["Instagram", "#f97316", "#db2777", "IG"],
    ["Facebook", "#3b82f6", "#1d4ed8", "f"], ["Copy Image", "#8b5cf6", "#6d28d9", "⧉"],
  ];
  icons.forEach(([label, c1, c2, glyph], i) => {
    const ix = 175 + i * 243, iy = sY + 200;
    const g = ctx.createLinearGradient(ix - 55, iy - 55, ix + 55, iy + 55);
    g.addColorStop(0, c1); g.addColorStop(1, c2);
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,0.2)"; ctx.shadowBlur = 14; ctx.shadowOffsetY = 6;
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(ix, iy, 55, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    ctx.fillStyle = "#fff"; ctx.font = `800 ${glyph.length > 1 ? 40 : 54}px ${FONT}`; ctx.fillText(glyph, ix, iy + 2);
    ctx.fillStyle = "#1f2937"; ctx.font = `600 30px ${FONT}`; ctx.fillText(label, ix, iy + 90);
  });

  // Footer
  ctx.fillStyle = "rgba(255,255,255,0.85)"; rr(ctx, W / 2 - 280, H - 110, 560, 70, 35); ctx.fill();
  ctx.font = `600 32px ${FONT}`; ctx.fillStyle = "#134e4a";
  ctx.fillText(`💚 Powered by CoreAI • ${SITE}`, W / 2, H - 74);
  ctx.textAlign = "left";

  return new Promise((res) => c.toBlob((b) => res(b!), "image/png"));
}

interface Props { open: boolean; onOpenChange: (o: boolean) => void; answer: string; question?: string; }

export const ShareResultCard = ({ open, onOpenChange, answer, question }: Props) => {
  const [blob, setBlob] = useState<Blob | null>(null);
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    if (!open) return;
    let u = "";
    renderCard(answer, question).then((b) => { setBlob(b); u = URL.createObjectURL(b); setUrl(u); });
    return () => { if (u) URL.revokeObjectURL(u); setBlob(null); setUrl(""); };
  }, [open, answer, question]);

  const file = () => new File([blob!], "coreai-result.png", { type: "image/png" });
  const shareText = `Yeh answer maine CoreAI se nikala! Tum bhi free try karo 👉 https://${SITE}`;

  const handleShare = async () => {
    if (!blob) return;
    try {
      if (navigator.canShare?.({ files: [file()] })) {
        await navigator.share({ files: [file()], text: shareText });
        return;
      }
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
      handleDownload();
    } catch { /* cancelled */ }
  };

  const handleDownload = () => {
    if (!url) return;
    const a = document.createElement("a");
    a.href = url; a.download = "coreai-result.png"; a.click();
    toast.success("Card saved");
  };

  const handleCopy = async () => {
    if (!blob) return;
    try {
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      toast.success("Card copied");
    } catch { toast.error("Copy not supported here — use Download"); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm max-h-[95dvh] overflow-y-auto">
        <DialogHeader><DialogTitle>Share result</DialogTitle></DialogHeader>
        <div className="max-h-[62dvh] min-h-[200px] overflow-y-auto rounded-xl bg-muted flex justify-center">
          {url ? <img src={url} alt="CoreAI result card" className="w-full h-auto" />
               : <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}
        </div>
        <Button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`CoreAI ne mera sawaal solve kiya ⚡ Try free: https://${SITE}`)}`, "_blank")} variant="secondary" className="w-full">WhatsApp</Button>
        <div className="grid grid-cols-3 gap-2">
          <Button onClick={handleShare} disabled={!blob} className="gap-1"><Share2 className="h-4 w-4" />Share</Button>
          <Button onClick={handleDownload} disabled={!blob} variant="outline" className="gap-1"><Download className="h-4 w-4" />Save</Button>
          <Button onClick={handleCopy} disabled={!blob} variant="outline" className="gap-1"><Copy className="h-4 w-4" />Copy</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
