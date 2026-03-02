import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import coreaiLogo from '@/assets/coreai-logo.png';

interface AuthProps {
  onAuthSuccess: (username: string) => void;
}

const generateSuggestions = (input: string): string[] => {
  if (!input || input.length < 2) return [];
  const base = input.toLowerCase().replace(/[^a-z0-9_]/g, '');
  if (!base) return [];
  return [
    `${base}_ai`,
    `${base}123`,
    `real${base}`,
    `${base}_core`,
    `${base}.dev`,
  ];
};

export const Auth = ({ onAuthSuccess }: AuthProps) => {
  const [username, setUsername] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = useMemo(() => generateSuggestions(username), [username]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (trimmed.length < 2) return;
    onAuthSuccess(trimmed);
  };

  const selectSuggestion = (s: string) => {
    setUsername(s);
    setShowSuggestions(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <motion.div
        className="w-full max-w-sm space-y-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <motion.div
          className="text-center space-y-3"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.img
            src={coreaiLogo}
            alt="CoreAI"
            className="w-20 h-20 rounded-full shadow-lg mx-auto ring-4 ring-primary/20"
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
          <h1 className="text-3xl font-bold gradient-text">CoreAI</h1>
          <p className="text-muted-foreground text-sm">Enter a username to get started</p>
        </motion.div>

        {/* Username Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <Input
                type="text"
                placeholder="Choose a username..."
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setShowSuggestions(e.target.value.length >= 2);
                }}
                onFocus={() => username.length >= 2 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="h-12 rounded-xl text-base px-4 pr-12 bg-muted/50 border-border/50 focus:border-primary/50"
                autoFocus
                minLength={2}
                required
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Sparkles className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            {/* Smart Suggestions */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="flex flex-wrap gap-2"
                >
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => selectSuggestion(s)}
                      className="px-3 py-1.5 text-xs rounded-full bg-muted hover:bg-primary/10 hover:text-primary border border-border/50 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl text-base font-medium shadow-md"
              disabled={username.trim().length < 2}
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            No password needed. Your data is stored locally.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
