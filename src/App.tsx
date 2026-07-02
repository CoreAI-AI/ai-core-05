import { useState, useEffect } from "react";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AnimatedRoutes } from "./components/AnimatedRoutes";
import { useAppLock } from "@/hooks/useAppLock";
import { AppLockScreen } from "@/components/AppLockScreen";
import { AppLockSetup } from "@/components/AppLockSetup";
import { IntroExperience } from "@/components/IntroExperience";
import { OnboardingQuestions } from "@/components/OnboardingQuestions";
import { TTSProvider } from "@/hooks/useTTSPlayer";
import { supabase } from "@/integrations/supabase/client";
import { AnimatePresence } from "framer-motion";

const queryClient = new QueryClient();

const AppContent = () => {
  const {
    isLocked,
    settings,
    isSetupMode,
    setIsSetupMode,
    enableLock,
    verifyPin,
    authenticateWithBiometric,
  } = useAppLock();

  const [showIntro, setShowIntro] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [introSource, setIntroSource] = useState<
    "first_visit" | "login" | "signup" | "manual"
  >("first_visit");

  const maybeShowOnboarding = () => {
    if (localStorage.getItem("coreai_onboarding_done")) return;
    setShowOnboarding(true);
  };

  const maybeShowIntro = (
    forceSource?: "first_visit" | "login" | "signup" | "manual"
  ) => {
    // Intro plays ONLY the very first time this browser opens CoreAI,
    // OR when someone (dev/user) explicitly forces it via `?intro=1`.
    const seen = localStorage.getItem("coreai_intro_seen");
    if (seen && !forceSource) return;

    setIntroSource(forceSource || "first_visit");
    setShowIntro(true);
    // Mark seen immediately so even a mid-intro reload never replays it.
    try { localStorage.setItem("coreai_intro_seen", "1"); } catch {}
  };




  useEffect(() => {
    // Allow ?intro=1 to force-replay for testing.
    const params = new URLSearchParams(window.location.search);
    const force = params.get("intro") === "1" ? "manual" : undefined;
    const t = setTimeout(() => maybeShowIntro(force as any), 600);
    return () => clearTimeout(t);
  }, []);


  const handleIntroComplete = () => {
    setShowIntro(false);
    localStorage.removeItem("coreai_intro_source");
    setTimeout(maybeShowOnboarding, 250);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem("coreai_onboarding_done", "true");
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isSetupMode && (
          <AppLockSetup
            key="setup"
            onComplete={enableLock}
            onCancel={() => setIsSetupMode(false)}
          />
        )}

        {isLocked && !isSetupMode && (
          <AppLockScreen
            key="lock"
            onUnlock={verifyPin}
            onBiometricAuth={authenticateWithBiometric}
            biometricEnabled={settings.biometricEnabled}
          />
        )}

        {showIntro && (
          <IntroExperience
            key="intro"
            source={introSource}
            onComplete={handleIntroComplete}
          />
        )}

        {showOnboarding && !showIntro && (
          <OnboardingQuestions
            key="onboarding"
            onComplete={handleOnboardingComplete}
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
