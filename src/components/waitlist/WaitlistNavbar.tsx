import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WaitlistNavbarProps {
  onJoin: () => void;
}

export const WaitlistNavbar = ({ onJoin }: WaitlistNavbarProps) => (
  <motion.header
    initial={{ y: -24, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="waitlist-glass fixed inset-x-0 top-0 z-40 border-b border-border/70"
  >
    <nav
      aria-label="Primary"
      className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8"
    >
      <a href="#top" className="flex items-center gap-2 font-semibold tracking-tight">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="text-base">CoreAI</span>
      </a>

      <div className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
        <a className="transition-colors hover:text-foreground" href="#features">
          Features
        </a>
        <a className="transition-colors hover:text-foreground" href="#waitlist">
          Waitlist
        </a>
        <a className="transition-colors hover:text-foreground" href="#faq">
          FAQ
        </a>
      </div>

      <Button
        onClick={onJoin}
        className="rounded-full px-5 shadow-sm transition-transform hover:-translate-y-0.5"
      >
        Join Waitlist
      </Button>
    </nav>
  </motion.header>
);
