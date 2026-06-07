import { Link } from "react-router-dom";
import { Shield, Sparkles, Gift, Mail } from "lucide-react";

export const SiteFooter = () => {
  return (
    <footer className="border-t border-border bg-muted/30 mt-12">
      <div className="max-w-6xl mx-auto px-6 py-10 grid gap-8 md:grid-cols-4">
        <div>
          <h3 className="font-semibold text-foreground mb-2">CoreAI</h3>
          <p className="text-sm text-muted-foreground">
            Free AI chatbot & study assistant for chat, homework, writing and code — in English & Hindi.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">Product</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/features" className="hover:text-foreground">Features</Link></li>
            <li><Link to="/free-ai-chatbot" className="hover:text-foreground">Free AI Chatbot</Link></li>
            <li><Link to="/ai-homework-helper" className="hover:text-foreground">Homework Helper</Link></li>
            <li><Link to="/hindi-ai-assistant" className="hover:text-foreground">Hindi AI</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
            <li><Link to="/faq" className="hover:text-foreground">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/privacy-policy" className="hover:text-foreground">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-foreground">Terms</Link></li>
            <li><Link to="/terms-and-conditions" className="hover:text-foreground">Terms &amp; Conditions</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap gap-4 items-center justify-between text-xs text-muted-foreground">
          <div className="flex flex-wrap gap-4">
            <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> Powered by AI</span>
            <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Secure & Private</span>
            <span className="flex items-center gap-1"><Gift className="w-3 h-3" /> Free to Use</span>
            <a href="mailto:hello@coreai.app" className="flex items-center gap-1 hover:text-foreground">
              <Mail className="w-3 h-3" /> hello@coreai.app
            </a>
          </div>
          <div>© {new Date().getFullYear()} CoreAI</div>
        </div>
      </div>
    </footer>
  );
};
