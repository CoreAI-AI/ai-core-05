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

// ✅ LIMIT SYSTEM
import LimitPopup from "./components/LimitPopup";
import {
  canUseChat,
  canUseMode,
  increaseChatCount,
  increaseModeCount,
} from "./utils/usageLimits";

const queryClient = new QueryClient();

/* =========================
   APP CONTENT
========================= */

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

  // ✅ LIMIT STATE
  const [showLimitPopup, setShowLimitPopup] = useState(false);

  const maybeShowOnboarding = () => {
    if (localStorage.getItem("coreai_onboarding_done")) return;
    setShowOnboarding(true);
  };

  const maybeShowIntro = (
    forceSource?: "first_visit" | "login" | "signup" | "manual"
  ) => {
    const src =
      forceSource ||
      (localStorage.getItem("coreai_intro_source") as any) ||
      "first_visit";

    const seen = localStorage.getItem("coreai_intro_seen");
    if (seen && !forceSource && !localStorage.getItem("coreai_intro_source"))
      return;

    setIntroSource(src);
    setShowIntro(true);
  };

  useEffect(() => {
    const t = setTimeout(maybeShowIntro, 600);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        setTimeout(maybeShowIntro, 300);
      }
    });

    return () => {
      clearTimeout(t);
      subscription.unsubscribe();
    };
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    localStorage.removeItem("coreai_intro_source");
    setTimeout(maybeShowOnboarding, 250);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  /* =========================
     CHAT HANDLER (LIMIT ACTIVE)
  ========================= */

  const handleSendMessage = async () => {
    const mode = "chat";

    // ❌ LIMIT CHECK
    if (!canUseChat()) {
      setShowLimitPopup(true);
      return;
    }

    if (!canUseMode(mode)) {
      setShowLimitPopup(true);
      return;
    }

    try {
      // 👉 YOUR AI LOGIC HERE

      increaseChatCount();
      increaseModeCount(mode);
    } catch (err) {
      console.error(err);
    }
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

      {/* MAIN APP ROUTES */}
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>

      {/* LIMIT POPUP */}
      <LimitPopup
        open={showLimitPopup}
        onClose={() => setShowLimitPopup(false)}
      />
    </>
  );
};

/* =========================
   ROOT APP
========================= */

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
