import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Zap, Loader2, Eye, EyeOff } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({});

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

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: `${window.location.origin}/` }
        });

        if (error) throw error;

        if (data.user) {
          await sb.from('profiles').insert({
            user_id: data.user.id,
            display_name: displayName.trim() || email.split('@')[0],
            email: email.trim(),
          });
          toast.success("Account created! Welcome to CoreAI 🎉");
          onAuthSuccess();
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          if (error.message.includes('Invalid login')) {
            throw new Error("Incorrect email or password. Please try again.");
          }
          throw error;
        }

        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email.trim());
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        toast.success("Welcome back! 👋");
        onAuthSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };


  const handleDemoLogin = async () => {
    setIsDemoLoading(true);
    
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

      toast.success("Demo account ready! Explore CoreAI 🚀");
      onAuthSuccess();
    } catch (error: any) {
      console.error('Demo login error:', error);
      toast.error(error.message || "Demo setup failed. Please try again.");
    } finally {
      setIsDemoLoading(false);
    }
  };

  const anyLoading = isLoading || isGoogleLoading || isDemoLoading;

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <motion.div 
        className="w-full max-w-md space-y-6"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div 
          className="text-center space-y-2"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <motion.img 
            src={coreaiLogo} 
            alt="CoreAI" 
            className="w-20 h-20 rounded-full shadow-lg mx-auto mb-4 ring-4 ring-primary/20"
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
          <h1 className="text-3xl font-bold gradient-text">CoreAI</h1>
          <p className="text-muted-foreground">Intelligent Assistant</p>
        </motion.div>

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
              <Button type="submit" className="w-full h-11 rounded-xl gradient-bg text-white font-medium shadow-md btn-press" disabled={anyLoading}>
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {isSignUp ? "Creating..." : "Signing in..."}</>
                ) : (
                  isSignUp ? "Create Account" : "Sign In"
                )}
              </Button>
            </form>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>
            
            <Button 
              type="button" 
              variant="outline" 
              className="w-full h-11 rounded-xl font-medium btn-press border-primary/30 hover:bg-primary/5"
              onClick={handleDemoLogin}
              disabled={anyLoading}
            >
              {isDemoLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Setting up demo...</>
              ) : (
                <><Zap className="w-4 h-4 mr-2 text-primary" /> Try Demo Account</>
              )}
            </Button>
            
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
