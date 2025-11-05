import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { CoreAIModelSelector } from "@/components/CoreAIModelSelector";

const ModelManager = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Chat
        </Button>
        <h1 className="text-2xl font-semibold text-foreground">Model Manager</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <CoreAIModelSelector userId={user?.id} />
      </div>
    </div>
  );
};

export default ModelManager;
