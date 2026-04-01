import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Zap, Mail, Chrome } from "lucide-react";
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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/` }
        });

        if (error) throw error;

        if (data.user) {
          const { error: profileError } = await sb
            .from('profiles')
            .insert({
              user_id: data.user.id,
              display_name: displayName || email.split('@')[0],
              email: email,
            });

          if (profileError) {
            console.error('Profile creation error:', profileError);
          }

          toast.success("Account created successfully!");
          onAuthSuccess();
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        toast.success("Signed in successfully!");
        onAuthSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      toast.error(error.message || "Google sign-in failed");
      setIsGoogleLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    
    try {
      toast.info("Setting up demo account...");
      
      const { data, error } = await supabase.functions.invoke('create-demo-user');
      
      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Failed to create demo user');

      const { email, password } = data.credentials;
      
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      toast.success("Demo account ready!");
      onAuthSuccess();
    } catch (error: any) {
      console.error('Demo login error:', error);
      toast.error(error.message || "Demo setup failed");
    } finally {
      setIsLoading(false);
    }
  };

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
            {/* Google Sign In */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 rounded-xl font-medium gap-2 border-border hover:bg-accent"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isGoogleLoading ? "Connecting..." : "Continue with Google"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {isSignUp && (
                <Input
                  type="text"
                  placeholder="Display Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="h-11 rounded-xl"
                />
              )}
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 rounded-xl"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="h-11 rounded-xl"
              />
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
              <Button type="submit" className="w-full h-11 rounded-xl gradient-bg text-white font-medium shadow-md btn-press" disabled={isLoading}>
                {isLoading ? "Loading..." : (isSignUp ? "Create Account" : "Sign In")}
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
              disabled={isLoading}
            >
              <Zap className="w-4 h-4 mr-2 text-primary" />
              Try Demo Account
            </Button>
            
            <Button
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full text-sm text-muted-foreground hover:text-primary"
            >
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
