import { useEffect, useState } from "react";
import { Download, Share2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/coreai-logo-original.jpeg.asset.json";

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

// Draw the original logo exactly (no recolor/distortion), clipped to its own circle.
const drawLogo = (ctx: CanvasRenderingContext2D, logo: HTMLImageElement | null, cx: number, cy: number, r: number) => {
  if (!logo) return;
  const s = logo.width / 1024;
  const lc = 512 * s, lr = 374 * s;
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
  ctx.drawImage(logo, lc - lr, 500 * s - lr, lr * 2, lr * 2, cx - r, cy - r, r * 2, r * 2);
  ctx.restore();
};

const brand = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, coreCol: string, tagCol: string) => {
  ctx.textAlign = "left"; ctx.textBaseline = "alphabetic"; ctx.font = `800 ${size}px ${FONT}`;
  ctx.fillStyle = coreCol; ctx.fillText("Core", x, y);
  const cw = ctx.measureText("Core").width, aw = ctx.measureText("AI").width;
  const g = ctx.createLinearGradient(x + cw, 0, x + cw + aw, 0);
  g.addColorStop(0, "#2dd4a0"); g.addColorStop(1, "#7ed957");
  ctx.fillStyle = g; ctx.fillText("AI", x + cw, y);
  ctx.font = `600 ${Math.round(size * 0.36)}px ${FONT}`; ctx.fillStyle = tagCol;
  ctx.fillText("Think • Learn • Grow", x + 2, y + size * 0.55);
};

const tealPill = (ctx: CanvasRenderingContext2D, x: number, y: number, label: string, center = false) => {
  ctx.font = `700 40px ${FONT}`;
  const w = ctx.measureText(label).width + 80;
  const px = center ? x - w / 2 : x;
  const g = ctx.createLinearGradient(px, y, px, y + 76);
  g.addColorStop(0, "#14806f"); g.addColorStop(1, "#0b4d45");
  ctx.save(); ctx.shadowColor = "rgba(10,70,60,0.3)"; ctx.shadowBlur = 14; ctx.shadowOffsetY = 5;
  ctx.fillStyle = g; rr(ctx, px, y, w, 76, 38); ctx.fill(); ctx.restore();
  ctx.fillStyle = "#fff"; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(label, px + 40, y + 40);
};

const softBox = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, fill: string, stroke: string) => {
  ctx.save(); ctx.shadowColor = "rgba(20,90,80,0.12)"; ctx.shadowBlur = 24; ctx.shadowOffsetY = 6;
  ctx.fillStyle = fill; rr(ctx, x, y, w, h, 36); ctx.fill(); ctx.restore();
  ctx.strokeStyle = stroke; ctx.lineWidth = 3; rr(ctx, x, y, w, h, 36); ctx.stroke();
};

export async function renderCard(answer: string, question?: string): Promise<Blob> {
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d")!;
  try { await document.fonts?.ready; } catch { /* ignore */ }
  const logo = await loadImg(logoAsset.url);

  const cardX = 80, cardW = W - 160, inX = cardX + 40, inW = cardW - 80;
  const qText = toPlainText(question?.trim() || "Ask anything on CoreAI");
  const aText = `“${toPlainText(answer)}”`;
  const qf = layout(ctx, qText, inW - 260, qText.length < 120 ? 48 : qText.length < 300 ? 40 : 34, 500);
  const aSize = aText.length < 300 ? 50 : aText.length < 800 ? 40 : aText.length < 2000 ? 32 : 28;
  const af = layout(ctx, aText, inW - 330, aSize, 600);

  const headY = 200, headH = 260;
  const qY = headY + headH + 50;
  const qH = Math.max(230, qf.lines.length * qf.lh + 110);
  const aY = qY + qH + 60;
  const aH = Math.max(380, af.lines.length * af.lh + 150);
  const rY = aY + aH + 40, rH = 230;
  const cardBottom = rY + rH + 40;
  const H = Math.min(30000, cardBottom + 260);
  c.width = W; c.height = H;

  // Background: soft white with mint waves
  ctx.fillStyle = "#f4faf9"; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "rgba(94,234,212,0.35)";
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(260, 0); ctx.bezierCurveTo(160, 120, 80, 200, 0, 260); ctx.fill();
  const wave = ctx.createLinearGradient(0, H - 260, 0, H);
  wave.addColorStop(0, "#9ff0dc"); wave.addColorStop(1, "#0f6b5e");
  ctx.fillStyle = wave; ctx.beginPath(); ctx.moveTo(0, H - 220);
  ctx.bezierCurveTo(300, H - 120, 700, H - 300, W, H - 200); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();

  // Top title
  ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = "#0f1d3a"; ctx.font = `800 64px ${FONT}`;
  ctx.fillText("Share Your Result", W / 2, 80);
  ctx.font = `500 34px ${FONT}`; ctx.fillStyle = "#4b6070"; ctx.fillText("Share this with your friends", W / 2, 145);

  // Card
  ctx.save(); ctx.shadowColor = "rgba(10,60,55,0.18)"; ctx.shadowBlur = 40; ctx.shadowOffsetY = 12;
  ctx.fillStyle = "#ffffff"; rr(ctx, cardX, headY, cardW, cardBottom - headY, 50); ctx.fill(); ctx.restore();

  // Card header (dark teal)
  ctx.save(); rr(ctx, cardX, headY, cardW, headH, 50); ctx.clip();
  const hg = ctx.createLinearGradient(cardX, 0, cardX + cardW, 0);
  hg.addColorStop(0, "#0a3d3a"); hg.addColorStop(1, "#0f5a50");
  ctx.fillStyle = hg; ctx.fillRect(cardX, headY, cardW, headH);
  ctx.fillStyle = "rgba(255,255,255,0.05)";
  ctx.beginPath(); ctx.moveTo(cardX + cardW * 0.6, headY + headH); ctx.bezierCurveTo(cardX + cardW * 0.65, headY, cardX + cardW, headY + 20, cardX + cardW, headY); ctx.lineTo(cardX + cardW, headY + headH); ctx.fill();
  ctx.restore();
  ctx.fillStyle = "#f7fbfb"; rr(ctx, cardX, headY + headH - 40, cardW, 80, 40); ctx.fill();
  ctx.save(); ctx.shadowColor = "rgba(45,212,191,0.8)"; ctx.shadowBlur = 30;
  ctx.fillStyle = "#06302c"; ctx.beginPath(); ctx.arc(cardX + 130, headY + 105, 95, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  drawLogo(ctx, logo, cardX + 130, headY + 105, 92);
  ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(cardX + 250, headY + 50); ctx.lineTo(cardX + 250, headY + 165); ctx.stroke();
  brand(ctx, cardX + 280, headY + 120, 88, "#ffffff", "#e6fffa");
  ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillStyle = "#fff"; ctx.font = `italic 700 54px ${FONT}`;
  ctx.fillText("My Result", cardX + cardW - 50, headY + 110);

  // Question
  softBox(ctx, inX, qY + 30, inW - 170, qH - 30, "#f8fafc", "#e5eef0");
  tealPill(ctx, inX + 20, qY, "💬  Your Question");
  emoji(ctx, "❓", inX + inW - 75, qY + qH / 2 + 15, 150);
  ctx.fillStyle = "#13233d"; ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.font = `500 ${qf.size}px ${FONT}`;
  const qTop = qY + 30 + Math.max(60, (qH - 30 - qf.lines.length * qf.lh) / 2 + 10);
  qf.lines.forEach((l, i) => ctx.fillText(l, inX + 60, qTop + i * qf.lh));

  // Answer
  softBox(ctx, inX, aY + 30, inW, aH - 30, "#e6f8f2", "#bfeee0");
  tealPill(ctx, W / 2, aY, "✨  CoreAI Answer", true);
  emoji(ctx, "💡", inX + 140, aY + 30 + (aH - 30) / 2, 170);
  ctx.fillStyle = "#13233d"; ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.font = `600 ${af.size}px ${FONT}`;
  const aTop = aY + 30 + Math.max(80, (aH - 30 - af.lines.length * af.lh) / 2);
  af.lines.forEach((l, i) => ctx.fillText(l, inX + 290, aTop + i * af.lh));

  // Result
  softBox(ctx, inX, rY, inW, rH, "#e6f8f2", "#d3f3e8");
  emoji(ctx, "🏆", W / 2 - 200, rY + rH / 2, 150);
  ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillStyle = "#13233d"; ctx.font = `800 64px ${FONT}`;
  ctx.fillText("Great Job!", W / 2 - 90, rY + 90);
  ctx.font = `500 36px ${FONT}`; ctx.fillStyle = "#24364f";
  ctx.fillText("Thanks for using CoreAI 💚", W / 2 - 110, rY + 160);

  // Footer: Powered by CoreAI
  const fy = H - 100;
  ctx.font = `600 40px ${FONT}`;
  const pw = ctx.measureText("Powered by ").width, cw2 = ctx.measureText("CoreAI").width;
  const total = 90 + 20 + pw + cw2, fx = (W - total) / 2;
  ctx.strokeStyle = "rgba(255,255,255,0.7)"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(60, fy); ctx.lineTo(fx - 30, fy); ctx.moveTo(fx + total + 30, fy); ctx.lineTo(W - 60, fy); ctx.stroke();
  ctx.fillStyle = "#06302c"; ctx.beginPath(); ctx.arc(fx + 45, fy, 47, 0, Math.PI * 2); ctx.fill();
  drawLogo(ctx, logo, fx + 45, fy, 45);
  ctx.textAlign = "left"; ctx.fillStyle = "#ffffff"; ctx.fillText("Powered by ", fx + 110, fy);
  ctx.fillStyle = "#c6ff9e"; ctx.fillText("CoreAI", fx + 110 + pw, fy);
  ctx.font = `500 26px ${FONT}`; ctx.fillStyle = "rgba(255,255,255,0.85)"; ctx.textAlign = "center";
  ctx.fillText(SITE, W / 2, fy + 62);

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

  const handleFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://${SITE}`)}`, "_blank");
    handleDownload();
  };
  const handleInstagram = async () => {
    if (!blob) return;
    if (navigator.canShare?.({ files: [file()] })) { try { await navigator.share({ files: [file()], text: shareText }); } catch { /* cancelled */ } return; }
    handleDownload(); toast.success("Card saved — Instagram Story mein upload karein");
  };
  const handleWhatsApp = async () => {
    if (blob && navigator.canShare?.({ files: [file()] })) { try { await navigator.share({ files: [file()], text: shareText }); } catch { /* cancelled */ } return; }
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  const actions = [
    { label: "WhatsApp", onClick: handleWhatsApp, bg: "linear-gradient(135deg,#25d366,#128c4a)", glyph: "W" },
    { label: "Instagram", onClick: handleInstagram, bg: "linear-gradient(135deg,#feda75,#d62976,#4f5bd5)", glyph: "IG" },
    { label: "Facebook", onClick: handleFacebook, bg: "linear-gradient(135deg,#3b82f6,#1d4ed8)", glyph: "f" },
    { label: "Copy Image", onClick: handleCopy, bg: "linear-gradient(135deg,#14806f,#0b4d45)", glyph: "⧉" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm max-h-[95dvh] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2">
            <img src={logoAsset.url} alt="CoreAI logo" className="h-10 w-10 rounded-full object-contain" />
            <span className="flex flex-col items-start leading-tight">
              <span className="text-xl font-extrabold">Core<span className="text-primary">AI</span></span>
              <span className="text-[11px] font-medium text-muted-foreground">Think • Learn • Grow</span>
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[58dvh] min-h-[200px] overflow-y-auto rounded-xl bg-muted flex justify-center">
          {url ? <img src={url} alt="CoreAI result card" className="w-full h-auto" />
               : <Loader2 className="h-6 w-6 animate-spin text-muted-foreground self-center" />}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {actions.map((a) => (
            <button key={a.label} onClick={a.onClick} disabled={!blob} className="flex flex-col items-center gap-1 disabled:opacity-50">
              <span className="h-12 w-12 rounded-full flex items-center justify-center text-primary-foreground font-extrabold shadow-md" style={{ background: a.bg }}>{a.glyph}</span>
              <span className="text-[11px] font-medium">{a.label}</span>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={handleShare} disabled={!blob} className="gap-1"><Share2 className="h-4 w-4" />Share</Button>
          <Button onClick={handleDownload} disabled={!blob} variant="outline" className="gap-1"><Download className="h-4 w-4" />Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
