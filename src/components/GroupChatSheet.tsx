import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Users, UserPlus, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GroupChatSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail?: string | null;
}

export const GroupChatSheet = ({ open, onOpenChange, userEmail }: GroupChatSheetProps) => {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [step, setStep] = useState<'intro' | 'name'>('intro');

  const displayName = userEmail?.split('@')[0] || 'User';
  const initials = displayName.slice(0, 2).toUpperCase();

  const handleStartGroup = () => {
    setStep('name');
  };

  const handleCreateGroup = () => {
    const name = groupName.trim() || `${displayName}'s group`;
    onOpenChange(false);
    setStep('intro');
    setGroupName("");
    navigate(`/group-chats?create=${encodeURIComponent(name)}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => onOpenChange(false)}
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl shadow-2xl border-t border-border max-h-[70vh] overflow-hidden"
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Content */}
            <div className="px-6 pb-6 flex flex-col items-center">
              {step === 'intro' ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                    <UserPlus className="w-7 h-7 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    Use CoreAI together
                  </h2>
                  <p className="text-sm text-muted-foreground text-center max-w-[280px] mb-8 leading-relaxed">
                    Add people to your chats to plan, share ideas, and get creative.
                  </p>
                  <Button
                    onClick={handleStartGroup}
                    className="rounded-full h-12 px-8 text-base font-semibold shadow-md mb-8"
                    size="lg"
                  >
                    Start group chat
                  </Button>
                  <div className="w-full bg-muted/60 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
                      <p className="text-xs text-muted-foreground">Choose a username and photo</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground shrink-0">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 border-2 border-dashed border-primary/30">
                    <Users className="w-8 h-8 text-primary/50" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground mb-4">
                    Name your group
                  </h2>
                  <input
                    type="text"
                    placeholder={`${displayName}'s group`}
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateGroup()}
                    autoFocus
                    className="w-full h-11 rounded-xl bg-muted/60 border border-border px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 mb-6"
                  />
                  <div className="flex gap-3 w-full">
                    <Button variant="outline" className="flex-1 h-11 rounded-xl" onClick={() => setStep('intro')}>
                      Back
                    </Button>
                    <Button className="flex-1 h-11 rounded-xl" onClick={handleCreateGroup}>
                      Create
                    </Button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
