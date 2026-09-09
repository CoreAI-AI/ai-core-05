import { useState } from "react";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AnimatedRoutes } from "./components/AnimatedRoutes";
import { TTSProvider } from "@/hooks/useTTSPlayer";
import { AnimatePresence } from "framer-motion";
import { AccessCodeGate } from "@/components/AccessCodeGate";
import { SplashScreen } from "@/components/SplashScreen";
import { TestingFeedback } from "@/components/TestingFeedback";

const queryClient = new QueryClient();

const AppContent = () => {
  const isPublicRoute = window.location.pathname.startsWith("/waitlist");
  // Launch flow: splash animation -> access code -> testing & feedback -> CoreAI home
  const [stage, setStage] = useState<"splash" | "code" | "testing" | "app">(
    isPublicRoute ? "app" : "splash"
  );

  return (
    <>
      <AnimatePresence mode="wait">
        {stage === "splash" && (
          <SplashScreen key="splash" onComplete={() => setStage("code")} />
        )}
        {stage === "code" && (
          <AccessCodeGate key="gate" onUnlock={() => setStage("testing")} />
        )}
        {stage === "testing" && (
          <TestingFeedback key="testing" onContinue={() => setStage("app")} />
        )}
      </AnimatePresence>


      {stage === "app" && (
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      )}
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
