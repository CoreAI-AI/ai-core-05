import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "./SiteFooter";
import { ReactNode, useEffect } from "react";
import { motion } from "framer-motion";

interface PageShellProps {
  title: string;
  description: string;
  children: ReactNode;
  managedHead?: boolean;
}

export const PageShell = ({ title, description, children, managedHead = false }: PageShellProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (managedHead) return;
    document.title = `${title} | CoreAI`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", description);
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    const url = `https://coreaii.vercel.app${window.location.pathname.replace(/\/$/, "")}`;
    canonical.href = url;
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", url);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", `${title} | CoreAI`);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
  }, [title, description, managedHead]);

  return (
    <div className="h-screen h-[100dvh] overflow-y-auto overflow-x-hidden flex flex-col bg-background scroll-smooth">
      {/* Sticky Header with Backdrop Blur */}
      <header className="border-b border-border/60 sticky top-0 bg-background/80 backdrop-blur-md z-20">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <motion.div whileHover={{ x: -2 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-2 rounded-xl cursor-pointer">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Home
            </Button>
          </motion.div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            {["features", "about", "faq", "contact"].map((path) => (
              <Link 
                key={path}
                to={`/${path}`} 
                className="hover:text-foreground capitalize transition-colors relative py-1 hover:after:w-full after:w-0 after:h-0.5 after:bg-primary after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-200"
              >
                {path}
              </Link>
            ))}
          </nav>
          <Link to="/" className="text-sm font-semibold tracking-tight hover:text-primary transition-colors">
            CoreAI
          </Link>
        </div>
      </header>

      {/* Main Content with Page-Entrance Spring Animation */}
      <motion.main 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 25 }}
        className="flex-1"
      >
        <div className="max-w-4xl mx-auto px-6 py-10">{children}</div>
      </motion.main>

      <SiteFooter />
    </div>
  );
};
