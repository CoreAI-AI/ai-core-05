import { motion } from "framer-motion";
import { useState } from "react";
import { 
  Sparkles, FileText, Image, Mic, Code, Lightbulb, 
  Wand2, Eye, Music, Bug, BookOpen, Zap, Bot, Brain, Rocket
} from "lucide-react";
import { AIToolCard } from "@/components/AIToolCard";
import { PremiumModelCard } from "@/components/PremiumModelCard";
import { SubscriptionPopup } from "@/components/SubscriptionPopup";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Tools = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>("");

  // Premium models - all locked by default
  const premiumModels = [
    {
      icon: Bot,
      title: "Chat-Bot",
      description: "Smart conversational AI assistant",
      features: ["Natural conversations", "Context awareness", "Quick responses"],
      isLocked: true
    },
    {
      icon: Brain,
      title: "Core-AI",
      description: "Advanced A to Z AI model",
      features: ["Full automation", "Advanced reasoning", "Multi-task capable"],
      isLocked: true
    },
    {
      icon: Rocket,
      title: "Chat-Pro",
      description: "Ultra advanced AI model",
      features: [
        "Image Prompt",
        "Video Prompt", 
        "Web Prompt",
        "App Prompt",
        "Image Generator Expert",
        "A to Z Automation",
        "Ultra Smart Chat"
      ],
      isLocked: true
    }
  ];

  const handlePremiumModelClick = (modelTitle: string) => {
    setSelectedModel(modelTitle);
    setShowSubscriptionPopup(true);
  };

  const handleUpgrade = () => {
    setShowSubscriptionPopup(false);
    toast({
      title: "Payment Integration Coming Soon",
      description: "Stripe payment will be integrated next.",
    });
  };

  const toolCategories = [
    {
      title: "Text Tools",
      tools: [
        { icon: FileText, title: "Smart Rewriter", description: "Rewrite content with AI precision", category: "Text" },
        { icon: Sparkles, title: "Auto Summarizer", description: "Extract key points instantly", category: "Text" },
        { icon: Lightbulb, title: "Idea Generator", description: "Brainstorm creative concepts", category: "Text" },
      ]
    },
    {
      title: "Image Tools",
      tools: [
        { icon: Image, title: "AI Image Maker", description: "Generate stunning visuals", category: "Image", onClick: () => navigate("/photos") },
        { icon: Wand2, title: "Logo Builder", description: "Design brand identity", category: "Image" },
        { icon: Eye, title: "Vision Mode", description: "Analyze images with AI", category: "Image" },
      ]
    },
    {
      title: "Audio Tools",
      tools: [
        { icon: Mic, title: "Voice to Text", description: "Transcribe speech accurately", category: "Audio" },
        { icon: Zap, title: "AI Voice", description: "Generate natural speech", category: "Audio" },
        { icon: Music, title: "Music Mood", description: "Create ambient soundscapes", category: "Audio" },
      ]
    },
    {
      title: "Code Tools",
      tools: [
        { icon: Code, title: "Code Assistant", description: "Write code faster with AI", category: "Code" },
        { icon: Bug, title: "Bug Finder", description: "Debug issues automatically", category: "Code" },
        { icon: BookOpen, title: "Code Explainer", description: "Understand complex code", category: "Code" },
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background border-b border-border"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(207_90%_54%_/_0.1),transparent_50%)]" />
        <div className="relative container mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-4"
          >
            <div className="w-20 h-20 rounded-2xl bg-primary/10 backdrop-blur-sm flex items-center justify-center mx-auto core-glow">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
          </motion.div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
            ThinkSpace
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unlock the power of AI with our comprehensive suite of intelligent tools
          </p>
        </div>
      </motion.div>

      {/* Premium Models Section */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-16"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3"
          >
            <div className="w-1 h-10 bg-primary rounded-full" />
            Premium AI Models
          </motion.h2>
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {premiumModels.map((model, index) => (
              <motion.div
                key={model.title}
                variants={itemVariants}
                custom={index}
              >
                <PremiumModelCard 
                  {...model}
                  onClick={() => handlePremiumModelClick(model.title)}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Tools Grid */}
        {toolCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.title}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-12"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3"
            >
              <div className="w-1 h-8 bg-primary rounded-full" />
              {category.title}
            </motion.h2>
            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {category.tools.map((tool, toolIndex) => (
                <motion.div
                  key={tool.title}
                  variants={itemVariants}
                  custom={toolIndex}
                >
                  <AIToolCard {...tool} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Subscription Popup */}
      <SubscriptionPopup
        open={showSubscriptionPopup}
        onOpenChange={setShowSubscriptionPopup}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
};

export default Tools;
