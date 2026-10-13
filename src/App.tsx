import { useState } from "react";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, useLocation } from "react-router-dom";
import { isPublicPath } from "@/lib/publicRoutes";
import { ThemeProvider } from "next-themes";
import { AnimatedRoutes } from "./components/AnimatedRoutes";
import { TTSProvider } from "@/hooks/useTTSPlayer";
import { AnimatePresence } from "framer-motion";
import { AccessCodeGate } from "@/components/AccessCodeGate";
import { SplashScreen } from "@/components/SplashScreen";
import { HelmetProvider } from "react-helmet-async";

const queryClient = new QueryClient();

// Gate is re-checked on every navigation, so moving from a public page to the chat still requires the code.
const GatedRoutes = () => {
  const { pathname } = useLocation();
  const [stage, setStage] = useState<"splash" | "code" | "app">("splash");
  if (isPublicPath(pathname) || stage === "app") return <AnimatedRoutes />;
  return (
    <AnimatePresence mode="wait">
      {stage === "splash" && <SplashScreen key="splash" onComplete={() => setStage("code")} />}
      {stage === "code" && <AccessCodeGate key="gate" onUnlock={() => setStage("app")} />}
    </AnimatePresence>
  );
};

const AppContent = () => (
  <BrowserRouter>
    <GatedRoutes />
  </BrowserRouter>
);


const App = () => {
  return (
    <HelmetProvider><QueryClientProvider client={queryClient}>
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
    </QueryClientProvider></HelmetProvider>
  );
};

export default App;
