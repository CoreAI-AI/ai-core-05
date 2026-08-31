import { useState, useEffect } from "react";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AnimatedRoutes } from "./components/AnimatedRoutes";
import { IntroExperience } from "@/components/IntroExperience";
import { TTSProvider } from "@/hooks/useTTSPlayer";
import { supabase } from "@/integrations/supabase/client";
import { AnimatePresence } from "framer-motion";
import { AccessCodeGate, hasAccessGranted } from "@/components/AccessCodeGate";

const queryClient = new QueryClient();

const AppContent = () => {

  const isPublicRoute = window.location.pathname.startsWith("/waitlist");
  const [locked, setLocked] = useState(() => !isPublicRoute && !hasAccessGranted());

  const [showIntro, setShowIntro] = useState(false);
  const [introSource, setIntroSource] = useState<
    "first_visit" | "login" | "signup" | "manual"
  >("first_visit");

  const maybeShowIntro = (
    forceSource?: "first_visit" | "login" | "signup" | "manual"
  ) => {
    // Intro plays every time access is unlocked with the code.
    setIntroSource(forceSource || "first_visit");
    setShowIntro(true);
  };

  // Every successful code entry restarts the full first-run experience.
  const handleUnlock = () => {
    try {
      localStorage.removeItem("coreai_intro_seen");
      localStorage.removeItem("coreai_onboarding_done");
      sessionStorage.removeItem("splash_shown");
    } catch {}
    setLocked(false);
  };




  useEffect(() => {
    if (locked) return;
    // Public marketing/waitlist routes never show the app intro overlay.
    if (window.location.pathname.startsWith("/waitlist")) return;
    // Allow ?intro=1 to force-replay for testing.
    const params = new URLSearchParams(window.location.search);
    const force = params.get("intro") === "1" ? "manual" : undefined;
    const t = setTimeout(() => maybeShowIntro(force as any), 600);
    return () => clearTimeout(t);
  }, [locked]);


  const handleIntroComplete = () => {
    setShowIntro(false);
    localStorage.removeItem("coreai_intro_source");
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {locked && <AccessCodeGate key="gate" onUnlock={handleUnlock} />}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!locked && showIntro && (
          <IntroExperience
            key="intro"
            source={introSource}
            onComplete={handleIntroComplete}
          />
        )}
      </AnimatePresence>



      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <TTSProvider>
            <AppContent />
          </TTSProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
