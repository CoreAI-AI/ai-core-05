import { useState } from "react";
import { motion } from "framer-motion";
import {
  Info, HelpCircle, FileText, Shield, Mail, ChevronRight, Sparkles, Copy, Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type ItemKey = "help" | "terms" | "privacy" | "about" | "contact";

interface ItemDef {
  key: ItemKey;
  label: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
}

const items: ItemDef[] = [
  { key: "help",    label: "Help Center",    sub: "Guides, FAQs & tips",              icon: HelpCircle },
  { key: "terms",   label: "Terms of Use",   sub: "Rules for using CoreAI",           icon: FileText },
  { key: "privacy", label: "Privacy Policy", sub: "How we handle your data",          icon: Shield },
  { key: "about",   label: "About",          sub: "CoreAI Assistant · v1.0",          icon: Info },
  { key: "contact", label: "Contact",        sub: "Reach our team",                   icon: Mail },
];

const SUPPORT_EMAIL = "likhaipadhai415@gmail.com";

export const AboutSection = () => {
  const [open, setOpen] = useState<ItemKey | null>(null);
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT_EMAIL);
      setCopied(true);
      toast.success("Email copied");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Could not copy");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.28 }}
    >
      <Card className="border-border/50 overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Info className="w-5 h-5" />
            About
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-3">
          <ul className="flex flex-col gap-1">
            {items.map((it, i) => {
              const Icon = it.icon;
              return (
                <motion.li
                  key={it.key}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <button
                    onClick={() => setOpen(it.key)}
                    className="group w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-muted/60 active:bg-muted transition-colors text-left"
                  >
                    <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Icon className="w-4.5 h-4.5" />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-medium text-foreground">{it.label}</span>
                      <span className="block text-xs text-muted-foreground truncate">{it.sub}</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </motion.li>
              );
            })}
          </ul>

          <div className="mt-3 px-3 py-2 text-[11px] text-muted-foreground text-center">
            CoreAI Assistant · v1.0 · Powered by AI
          </div>
        </CardContent>
      </Card>

      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          {open && (
            <>
              <DialogHeader className="px-5 pt-5 pb-3 border-b border-border/60">
                <DialogTitle className="flex items-center gap-2 text-base">
                  {(() => {
                    const Icon = items.find(i => i.key === open)!.icon;
                    return <Icon className="w-4 h-4 text-primary" />;
                  })()}
                  {items.find(i => i.key === open)!.label}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  {items.find(i => i.key === open)!.sub}
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[70vh]">
                <div className="px-5 py-4 text-sm leading-relaxed text-muted-foreground space-y-4">
                  {open === "help" && <HelpContent />}
                  {open === "terms" && <TermsContent />}
                  {open === "privacy" && <PrivacyContent />}
                  {open === "about" && <AboutContent />}
                  {open === "contact" && (
                    <ContactContent email={SUPPORT_EMAIL} copied={copied} onCopy={copyEmail} />
                  )}
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h3 className="text-foreground font-semibold text-sm mb-1">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);

const HelpContent = () => (
  <>
    <p>Welcome to the CoreAI Help Center. Find quick answers to common questions below.</p>
    <Section title="Getting started">
      <p>Open a new chat from the home screen and type your question. CoreAI replies in English, Hindi or Hinglish.</p>
    </Section>
    <Section title="Voice & Read aloud">
      <p>Tap the speaker icon on any AI reply. Control playback from the player at the top of the screen.</p>
    </Section>
    <Section title="Images">
      <p>Use trigger words like "make image of…" or "draw…" to generate images.</p>
    </Section>
    <Section title="Still need help?">
      <p>Email us at <span className="text-foreground font-medium">{SUPPORT_EMAIL}</span> — we usually reply within 24 hours.</p>
    </Section>
  </>
);

const TermsContent = () => (
  <>
    <p>Last updated: {new Date().toLocaleDateString()}</p>
    <Section title="1. Acceptance of Terms">
      <p>By accessing or using CoreAI you agree to these Terms. If you do not agree, please stop using the service.</p>
    </Section>
    <Section title="2. Acceptable Use">
      <p>You agree not to misuse CoreAI for illegal activity, harassment, generating harmful content, infringing intellectual property, or attempting to disrupt the service.</p>
    </Section>
    <Section title="3. AI-Generated Content">
      <p>Responses are produced by AI models and may be inaccurate or incomplete. Verify important information independently. You are responsible for how you use AI output.</p>
    </Section>
    <Section title="4. Accounts">
      <p>Keep your credentials secure. You are responsible for activity on your account. We may suspend accounts that violate these Terms.</p>
    </Section>
    <Section title="5. Intellectual Property">
      <p>CoreAI, its branding and software are owned by their respective owners. You retain rights to content you create using the service, subject to applicable law.</p>
    </Section>
    <Section title="6. Limitation of Liability">
      <p>The service is provided "as is" without warranties. To the maximum extent permitted by law, CoreAI is not liable for any indirect or consequential damages.</p>
    </Section>
    <Section title="7. Changes">
      <p>We may update these Terms; continued use means you accept the new version.</p>
    </Section>
  </>
);

const PrivacyContent = () => (
  <>
    <p>Last updated: {new Date().toLocaleDateString()}</p>
    <Section title="Information we collect">
      <p>Account email, prompts you send to the AI, optional uploads, and basic usage analytics to improve the product.</p>
    </Section>
    <Section title="How we use it">
      <p>To deliver AI responses, secure your account, prevent abuse, and improve features. Your prompts are sent to AI providers (e.g. Google Gemini, OpenAI) via a secure gateway solely to generate replies.</p>
    </Section>
    <Section title="Storage">
      <p>Chat history is stored locally on your device. Account data lives in secure cloud storage with row-level security and encryption in transit (HTTPS).</p>
    </Section>
    <Section title="Sharing">
      <p>We do not sell your data. We share only what is needed with AI providers and infrastructure vendors under their own privacy commitments.</p>
    </Section>
    <Section title="Your rights">
      <p>You can clear local chat history and delete your account anytime from Settings. Contact us for any privacy request.</p>
    </Section>
    <Section title="Contact">
      <p><span className="text-foreground font-medium">{SUPPORT_EMAIL}</span></p>
    </Section>
  </>
);

const AboutContent = () => (
  <>
    <div className="flex items-center gap-3 -mt-1">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground flex items-center justify-center">
        <Sparkles className="w-6 h-6" />
      </div>
      <div>
        <p className="text-foreground font-semibold">CoreAI Assistant</p>
        <p className="text-xs">Version 1.0 · Powered by AI</p>
      </div>
    </div>
    <p>
      CoreAI is a modern AI assistant platform that helps you learn, write, code,
      generate images and explore ideas in English, Hindi and Hinglish — all in one place.
    </p>
    <Section title="What you can do">
      <ul className="list-disc list-inside space-y-1">
        <li>Chat with an AI that understands Indian languages</li>
        <li>Generate and edit images with simple prompts</li>
        <li>Get coding help, study notes and summaries</li>
        <li>Listen to replies with built-in read aloud</li>
      </ul>
    </Section>
    <Section title="Built by">
      <p>Prem Prasad — together with Dipak Prasad &amp; Manish Prasad.</p>
    </Section>
  </>
);

const ContactContent = ({ email, copied, onCopy }: { email: string; copied: boolean; onCopy: () => void }) => (
  <>
    <p>For support, feedback or business inquiries, reach out using the email below. We usually reply within 24–48 hours.</p>
    <div className="rounded-2xl border border-border/60 bg-muted/40 p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
        <Mail className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
        <a href={`mailto:${email}`} className="block text-sm font-medium text-foreground truncate">
          {email}
        </a>
      </div>
      <Button size="sm" variant="outline" onClick={onCopy} className="gap-1.5">
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        {copied ? "Copied" : "Copy"}
      </Button>
    </div>
    <p className="text-xs">
      Prefer email? Tap the address to open your mail app directly.
    </p>
  </>
);
