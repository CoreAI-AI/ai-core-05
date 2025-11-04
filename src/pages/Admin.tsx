import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Users, MessageSquare, Image as ImageIcon, TrendingUp, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAdminCheck } from "@/hooks/useAdminCheck";

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminCheck(user?.id);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalChats: 0,
    totalMessages: 0,
    totalImages: 0,
    totalUsage: 0,
  });

  useEffect(() => {
    if (!adminLoading && !isAdmin && user) {
      toast.error('Access denied: Admin only');
      navigate('/');
    }
  }, [isAdmin, adminLoading, user, navigate]);

  useEffect(() => {
    if (isAdmin) {
      loadStats();
    }
  }, [isAdmin]);

  const loadStats = async () => {
    try {
      const [usersRes, chatsRes, messagesRes, imagesRes, usageRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('chats').select('id', { count: 'exact', head: true }),
        supabase.from('messages').select('id', { count: 'exact', head: true }),
        supabase.from('generated_images').select('id', { count: 'exact', head: true }),
        supabase.from('usage_logs').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        totalUsers: usersRes.count || 0,
        totalChats: chatsRes.count || 0,
        totalMessages: messagesRes.count || 0,
        totalImages: imagesRes.count || 0,
        totalUsage: usageRes.count || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      toast.error('Failed to load statistics');
    }
  };

  if (adminLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const statCards = [
    { icon: Users, label: "Total Users", value: stats.totalUsers, color: "text-blue-500" },
    { icon: MessageSquare, label: "Total Chats", value: stats.totalChats, color: "text-green-500" },
    { icon: MessageSquare, label: "Messages", value: stats.totalMessages, color: "text-purple-500" },
    { icon: ImageIcon, label: "Images Generated", value: stats.totalImages, color: "text-pink-500" },
    { icon: Activity, label: "API Usage", value: stats.totalUsage, color: "text-orange-500" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10"
      >
        <div className="p-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Chat
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center core-glow">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                CoreAdmin
              </h1>
              <p className="text-xs text-muted-foreground">System Control Center</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Platform Analytics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {statCards.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02, y: -4 }}
                >
                  <Card className="p-6 bg-card hover:bg-card/80 border-border hover:border-primary/50 transition-all duration-300 hover:core-glow">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg bg-primary/10 ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold text-foreground">{stat.value.toLocaleString()}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* System Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-card border-border">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                System Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm font-medium">Database</span>
                    <span className="text-sm text-primary">Lovable Cloud PostgreSQL</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm font-medium">Storage</span>
                    <span className="text-sm text-primary">Lovable Cloud Storage</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm font-medium">Authentication</span>
                    <span className="text-sm text-primary">Lovable Cloud Auth</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm font-medium">AI Gateway</span>
                    <span className="text-sm text-primary">Lovable AI</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Admin;