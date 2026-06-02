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
    authenticateWithBiometric 
  } = useAppLock();

  const [showIntro, setShowIntro] = useState(false);
  const [introSource, setIntroSource] = useState<"first_visit" | "login" | "signup" | "manual">("first_visit");

  const maybeShowIntro = () => {
    if (localStorage.getItem("coreai_intro_seen")) return;
    const src = (localStorage.getItem("coreai_intro_source") as any) || "first_visit";
    setIntroSource(src);
    setShowIntro(true);
  };

  useEffect(() => {
    const t = setTimeout(maybeShowIntro, 600);

    // Re-trigger intro on sign-in events (e.g. login flow cleared the flag)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
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
          <IntroExperience key="intro" onComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </>
  );
};

const App = () => (
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
        <AppContent />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
