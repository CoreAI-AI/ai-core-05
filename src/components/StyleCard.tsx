import { ArrowUpRight } from "lucide-react";

interface StyleCardProps {
  name: string;
  imageUrl: string;
  prompt?: string;
  tag?: string;
  onClick: () => void;
  showTryNow?: boolean;
}

const StyleCard = ({ name, imageUrl, prompt, tag, onClick }: StyleCardProps) => {
  return (
    <div 
      className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer border border-border/40 bg-muted/20 hover:border-foreground/20 transition-all duration-300 active:scale-[0.98]"
      onClick={onClick}
    >
      {/* Background Image with smooth hover scale */}
      <img 
        src={imageUrl} 
        alt={name}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />

      {/* Subtle vignette gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Optional Tag badge */}
      {tag && (
        <div className="absolute top-2.5 left-2.5">
          <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-black/60 text-white/90 backdrop-blur-md border border-white/10">
            {tag}
          </span>
        </div>
      )}

      {/* Action arrow button (floating top right) */}
      <div className="absolute top-2.5 right-2.5 h-7 w-7 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:bg-white group-hover:text-black">
        <ArrowUpRight className="w-3.5 h-3.5" />
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-3.5 flex flex-col justify-end text-left">
        <p className="text-sm font-semibold text-white tracking-tight truncate leading-tight drop-shadow-sm">
          {name}
        </p>
        {prompt && (
          <p className="text-[11px] text-white/70 line-clamp-1 mt-0.5 leading-snug drop-shadow-sm">
            {prompt}
          </p>
        )}
      </div>
    </div>
  );
};

export default StyleCard;
