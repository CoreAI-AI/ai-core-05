import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  Code2,
  GraduationCap,
  Lock,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Seo } from "@/components/Seo";
import { WaitlistNavbar } from "@/components/waitlist/WaitlistNavbar";
import { WaitlistForm } from "@/components/waitlist/WaitlistForm";
import { WaitlistSuccessModal } from "@/components/waitlist/WaitlistSuccessModal";
import { AnimatedCounter } from "@/components/waitlist/AnimatedCounter";
import { useWaitlistCount } from "@/hooks/useWaitlistCount";

const FEATURES = [
  {
    icon: Zap,
    title: "Instant answers",
    body: "Sub-second responses with smart model routing, so you never wait on a spinner.",
  },
  {
    icon: Code2,
    title: "Built for builders",
    body: "Ship faster with code generation, refactoring and reviews tuned for real repos.",
  },
  {
    icon: GraduationCap,
    title: "Learn anything",
    body: "Step-by-step explanations in your language, adapted to how you actually study.",
  },
  {
    icon: Bot,
    title: "Voice-native",
    body: "Speak naturally and get natural voice back — hands-free on desktop and mobile.",
  },
  {
    icon: Lock,
    title: "Private by default",
    body: "Your conversations stay yours. Encrypted in transit, never sold, never trained on.",
  },
  {
    icon: Sparkles,
    title: "Premium craft",
    body: "An interface that feels considered in every pixel, on every screen size.",
  },
];

const FAQS = [
  {
    q: "When does early access open?",
    a: "We onboard in small batches every week, starting with the earliest waitlist positions.",
  },
  {
    q: "Does it cost anything to join?",
    a: "No. Joining the waitlist is completely free, and early members get launch pricing.",
  },
  {
    q: "Can I move up the list?",
    a: "Yes — share your invite link. Every friend who joins bumps you closer to the front.",
  },
];

const Waitlist = () => {
  const { count } = useWaitlistCount();
  const [successOpen, setSuccessOpen] = useState(false);
  const [position, setPosition] = useState(0);
  const [joinedName, setJoinedName] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="waitlist-scope min-h-screen bg-background font-sans text-foreground antialiased">
      <Seo
        title="CoreAI Waitlist — The Future of AI Starts Here"
        description="Join the CoreAI waitlist and get early access to the next-generation AI platform for coding, study, business and content creation."
        canonical="/waitlist"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "CoreAI",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
        }}
      />

      <WaitlistNavbar onJoin={scrollToForm} />

      {/* Hero */}
      <main id="top">
        <section className="relative overflow-hidden px-5 pb-20 pt-32 sm:px-8 sm:pt-40">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[860px] -translate-x-1/2 rounded-full bg-primary/10 blur-[130px]"
          />
          <div className="relative mx-auto max-w-3xl text-center">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-sm"
            >
              <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
              Early access opening soon
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="mt-6 text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl"
            >
              The Future of AI Starts Here.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16 }}
              className="mx-auto mt-6 max-w-xl text-pretty text-lg text-muted-foreground sm:text-xl"
            >
              Join the CoreAI waitlist and get early access to the next-generation AI
              platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Button
                size="lg"
                onClick={scrollToForm}
                className="h-12 rounded-full px-8 text-base font-semibold shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5"
              >
                Join Waitlist
              </Button>
              <a
                href="#features"
                className="text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                See what&apos;s coming
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-10 inline-flex items-center gap-3 rounded-full border border-border bg-card px-5 py-2.5 shadow-sm"
            >
              <Users className="h-4 w-4 text-primary" aria-hidden="true" />
              <p className="text-sm text-muted-foreground">
                <AnimatedCounter
                  value={count ?? 0}
                  className="font-semibold tabular-nums text-foreground"
                />{" "}
                people already on the waitlist
              </p>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you expected from AI. Finally in one place.
            </h2>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature, index) => (
                <motion.article
                  key={feature.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <feature.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.body}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Waitlist form */}
        <section id="waitlist" ref={formRef} className="scroll-mt-24 px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Reserve your spot
            </h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              Takes ten seconds. We&apos;ll send your invite the moment a seat opens.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-2xl">
            <WaitlistForm
              onSuccess={(pos, name) => {
                setPosition(pos);
                setJoinedName(name);
                setSuccessOpen(true);
              }}
            />
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="px-5 pb-24 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Frequently asked
            </h2>
            <dl className="mt-8 space-y-4">
              {FAQS.map((faq) => (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                >
                  <dt className="font-semibold">{faq.q}</dt>
                  <dd className="mt-2 text-sm text-muted-foreground">{faq.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-5 py-8 text-center text-sm text-muted-foreground sm:px-8">
        © {new Date().getFullYear()} CoreAI. All rights reserved.
      </footer>

      <WaitlistSuccessModal
        open={successOpen}
        onOpenChange={setSuccessOpen}
        position={position}
        name={joinedName}
      />
    </div>
  );
};

export default Waitlist;
