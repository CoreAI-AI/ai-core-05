import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "./SiteFooter";
import { ReactNode, useEffect } from "react";

interface PageShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

export const PageShell = ({ title, description, children }: PageShellProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = `${title} | CoreAI`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", description);
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.href;
  }, [title, description]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur z-10">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Home
          </Button>
          <nav className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="/features" className="hover:text-foreground">Features</Link>
            <Link to="/about" className="hover:text-foreground">About</Link>
            <Link to="/faq" className="hover:text-foreground">FAQ</Link>
            <Link to="/contact" className="hover:text-foreground">Contact</Link>
          </nav>
          <Link to="/" className="text-sm font-semibold">CoreAI</Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-10">{children}</div>
      </main>

      <SiteFooter />
    </div>
  );
};
