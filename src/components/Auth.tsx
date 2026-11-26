import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Zap, Loader2, Eye, EyeOff, Check } from "lucide-react";
import { motion } from "framer-motion";
import coreaiLogo from '@/assets/coreai-logo.png';

const sb = supabase as any;

interface AuthProps {
  onAuthSuccess: () => void;
}

export const Auth = ({ onAuthSuccess }: AuthProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [authStage, setAuthStage] = useState<'idle' | 'loading' | 'success'>('idle');
  const [demoStage, setDemoStage] = useState<'idle' | 'loading' | 'success'>('idle');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({});

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Google sign in failed");
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email format";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (isSignUp && !displayName.trim()) newErrors.name = "Name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setAuthStage('loading');

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: `${window.location.origin}/` }
        });

        if (error) throw error;

        if (data.user) {
          try {
            await sb.from('profiles').upsert({
              user_id: data.user.id,
              display_name: displayName.trim() || email.split('@')[0],
              email: email.trim(),
            });
          } catch {}

          localStorage.removeItem("coreai_intro_seen");
          localStorage.setItem("coreai_intro_source", "signup");

          if (data.session) {
            setAuthStage('success');
            toast.success("Account created! Welcome to CoreAI 🎉");
            setTimeout(() => onAuthSuccess(), 500);
          } else {
            toast.success("Account created! Please sign in with your password.");
            setIsSignUp(false);
          }
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          if (error.message.includes('Invalid login') || error.message.includes('Email not confirmed')) {
            throw new Error("Invalid credentials or email unconfirmed. Please verify or try Demo Account.");
          }
          throw error;
        }

        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email.trim());
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        localStorage.removeItem("coreai_intro_seen");
        localStorage.setItem("coreai_intro_source", "login");

        setAuthStage('success');
        toast.success("Welcome back! 👋");
        setTimeout(() => onAuthSuccess(), 500);
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
      setTimeout(() => setAuthStage('idle'), 1500);
    }
  };

  const handleDemoLogin = async () => {
    setIsDemoLoading(true);
    setDemoStage('loading');
    try {
      const { data, error } = await supabase.functions.invoke('create-demo-user');
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Failed to create demo account');

      const { email: demoEmail, password: demoPassword } = data.credentials;
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword,
      });

      if (signInError) throw signInError;

      setDemoStage('success');
      toast.success("Demo account ready! Explore CoreAI 🚀");
      setTimeout(() => onAuthSuccess(), 500);
    } catch (error: any) {
      toast.error(error.message || "Demo setup failed. Please try again.");
      setDemoStage('idle');
    } finally {
      setIsDemoLoading(false);
      setTimeout(() => setDemoStage('idle'), 1500);
    }
  };

  const anyLoading = isLoading || isDemoLoading;

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <motion.div 
        className="w-full max-w-md space-y-6"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="text-center space-y-2">
          <img 
            src={coreaiLogo} 
            alt="CoreAI" 
            className="w-20 h-20 rounded-full shadow-lg mx-auto mb-4 ring-4 ring-primary/20"
          />
          <h1 className="text-3xl font-bold gradient-text">CoreAI</h1>
          <p className="text-muted-foreground">Intelligent Assistant</p>
        </div>

        <Card className="border-border/50 shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">{isSignUp ? "Create Account" : "Welcome Back"}</CardTitle>
            <CardDescription>
              {isSignUp ? "Join CoreAI to start your journey" : "Sign in to continue"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleAuth} className="space-y-3">
              {isSignUp && (
                <div>
                  <Input
                    type="text"
                    placeholder="Display Name"
                    value={displayName}
                    onChange={(e) => { setDisplayName(e.target.value); setErrors(p => ({ ...p, name: undefined })); }}
                    className={`h-11 rounded-xl ${errors.name ? 'border-destructive' : ''}`}
                    disabled={anyLoading}
                  />
                  {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                </div>
              )}
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })); }}
                  className={`h-11 rounded-xl ${errors.email ? 'border-destructive' : ''}`}
                  disabled={anyLoading}
                />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); }}
                  className={`h-11 rounded-xl pr-10 ${errors.password ? 'border-destructive' : ''}`}
                  disabled={anyLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
              </div>
              {!isSignUp && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label
                    htmlFor="rememberMe"
                    className="text-sm text-muted-foreground cursor-pointer select-none"
                  >
                    Remember me
                  </Label>
                </div>
              )}

              {/* 3-Stage Animated Submit Button */}
              <button
                type="submit"
                disabled={anyLoading || authStage === 'loading'}
                className={`w-full h-11 rounded-xl font-medium shadow-md transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 ${
                  authStage === 'loading'
                    ? 'bg-amber-500 text-white cursor-wait scale-[0.98]'
                    : authStage === 'success'
                    ? 'bg-emerald-500 text-white cursor-default'
                    : 'gradient-bg text-white hover:opacity-95'
                }`}
              >
                {authStage === 'loading' && (
                  <><Loader2 className="w-4 h-4 animate-spin" /> {isSignUp ? "Creating Account..." : "Signing In..."}</>
                )}
                {authStage === 'success' && (
                  <><Check className="w-4 h-4 stroke-[2.5]" /> {isSignUp ? "Account Ready! ✓" : "Welcome Back! ✓"}</>
                )}
                {authStage === 'idle' && (
                  isSignUp ? "Create Account" : "Sign In"
                )}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>

            {/* 100% Free Google Sign-In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={anyLoading || googleLoading}
              className="w-full h-11 rounded-xl font-medium border border-border/80 bg-background hover:bg-muted/50 transition-all flex items-center justify-center gap-2.5 text-sm active:scale-95 text-foreground disabled:opacity-50"
            >
              {googleLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /> Connecting Google...</>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/>
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            {/* 3-Stage Animated Demo Button */}
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={anyLoading}
              className={`w-full h-11 rounded-xl font-medium border transition-all duration-200 flex items-center justify-center gap-2 text-sm active:scale-95 ${
                demoStage === 'loading'
                  ? 'bg-amber-500 text-white border-amber-500 cursor-wait scale-[0.98]'
                  : demoStage === 'success'
                  ? 'bg-emerald-500 text-white border-emerald-500 cursor-default'
                  : 'border-primary/30 hover:bg-primary/5 text-foreground'
              }`}
            >
              {demoStage === 'loading' && (
                <><Loader2 className="w-4 h-4 animate-spin" /> Setting up demo...</>
              )}
              {demoStage === 'success' && (
                <><Check className="w-4 h-4 stroke-[2.5]" /> Demo Ready! ✓</>
              )}
              {demoStage === 'idle' && (
                <><Zap className="w-4 h-4 text-primary" /> Try Demo Account (Instant)</>
              )}
            </button>

            <Button
              variant="link"
              onClick={() => { setIsSignUp(!isSignUp); setErrors({}); }}
              className="w-full text-sm text-muted-foreground hover:text-primary"
              disabled={anyLoading}
            >
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
