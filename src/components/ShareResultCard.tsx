import { useEffect, useState } from "react";
import { Download, Share2, Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const SITE = "coreaii.vercel.app";
const W = 1080;
const H = 1350;

const cssColor = (name: string, alpha = 1) => {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v ? `hsl(${v.replace(/\s+/g, " ")} / ${alpha})` : `rgba(30,144,255,${alpha})`;
};

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
    if (!para.trim()) { lines.push(""); continue; }
    let line = "";
    for (const word of para.split(" ")) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = word; }
      else line = test;
    }
    lines.push(line);
  }
  return lines;
};

async function renderCard(answer: string, question?: string): Promise<Blob> {
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;
  const primary = cssColor("--primary");
  const font = "Inter, system-ui, sans-serif";

  // Background
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0b1220");
  bg.addColorStop(1, "#111c33");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W * 0.85, 120, 0, W * 0.85, 120, 600);
  glow.addColorStop(0, cssColor("--primary", 0.35)); glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);

  // Header
  ctx.fillStyle = primary;
  ctx.beginPath(); ctx.roundRect(72, 72, 72, 72, 18); ctx.fill();
  ctx.fillStyle = "#fff"; ctx.font = `800 40px ${font}`; ctx.textBaseline = "middle";
  ctx.fillText("C", 95, 110);
  ctx.font = `800 46px ${font}`; ctx.fillText("CoreAI", 168, 100);
  ctx.font = `500 26px ${font}`; ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.fillText("⚡ Answered by CoreAI", 168, 140);

  let y = 220;
  ctx.textBaseline = "top";
  const pad = 72, maxW = W - pad * 2 - 64;

  // Question box
  if (question?.trim()) {
    ctx.font = `700 36px ${font}`;
    const q = wrap(ctx, `Q: ${toPlainText(question)}`, maxW).slice(0, 3);
    const qh = q.length * 48 + 56;
    ctx.fillStyle = cssColor("--primary", 0.18);
    ctx.beginPath(); ctx.roundRect(pad, y, W - pad * 2, qh, 24); ctx.fill();
    ctx.fillStyle = "#fff";
    q.forEach((l, i) => ctx.fillText(l, pad + 32, y + 28 + i * 48));
    y += qh + 32;
  }

  // Answer card
  const cardBottom = H - 200;
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.beginPath(); ctx.roundRect(pad, y, W - pad * 2, cardBottom - y, 28); ctx.fill();
  ctx.font = `400 32px ${font}`; ctx.fillStyle = "rgba(255,255,255,0.92)";
  const lh = 46;
  const maxLines = Math.floor((cardBottom - y - 64) / lh);
  let lines = wrap(ctx, toPlainText(answer), maxW);
  if (lines.length > maxLines) { lines = lines.slice(0, maxLines); lines[maxLines - 1] = lines[maxLines - 1].slice(0, 60) + " …"; }
  lines.forEach((l, i) => ctx.fillText(l, pad + 32, y + 32 + i * lh));

  // Footer
  ctx.textBaseline = "middle";
  ctx.font = `600 30px ${font}`; ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.fillText("Try it free 👉", pad, H - 110);
  ctx.font = `800 38px ${font}`; ctx.fillStyle = primary;
  ctx.fillText(SITE, pad + ctx.measureText("Try it free 👉 ").width + 10, H - 110);
  ctx.font = `500 24px ${font}`; ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.textAlign = "right"; ctx.fillText("by Prem Prasad", W - pad, H - 110);

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
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Share result</DialogTitle></DialogHeader>
        <div className="aspect-[4/5] w-full overflow-hidden rounded-xl bg-muted flex items-center justify-center">
          {url ? <img src={url} alt="CoreAI result card" className="w-full h-full object-contain" />
               : <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Button onClick={handleShare} disabled={!blob} className="gap-1"><Share2 className="h-4 w-4" />Share</Button>
          <Button onClick={handleDownload} disabled={!blob} variant="outline" className="gap-1"><Download className="h-4 w-4" />Save</Button>
          <Button onClick={handleCopy} disabled={!blob} variant="outline" className="gap-1"><Copy className="h-4 w-4" />Copy</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
