import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard, Smartphone, Loader2, CheckCircle2, Shield, Gift } from "lucide-react";
import { toast } from "sonner";

const VALID_REDEEM_CODES = ["PREM-FCEO"];
import { Input } from "@/components/ui/input";

interface PaymentMethodSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentComplete: () => void;
}

type PaymentStep = 'select' | 'details' | 'redeem' | 'processing' | 'success';

export const PaymentMethodSelector = ({ 
  open, 
  onOpenChange, 
  onPaymentComplete 
}: PaymentMethodSelectorProps) => {
  const [step, setStep] = useState<PaymentStep>('select');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [redeemCode, setRedeemCode] = useState('');
  const [redeemError, setRedeemError] = useState('');

  const paymentMethods = [
    { name: "UPI Payment", icon: Smartphone, color: "bg-purple-600", type: "upi" },
    { name: "Card Payment", icon: CreditCard, color: "bg-green-600", type: "card" },
  ];

  const resetState = () => {
    setStep('select');
    setSelectedMethod('');
    setCardNumber('');
    setExpiry('');
    setCvv('');
    setUpiId('');
    setRedeemCode('');
    setRedeemError('');
  };

  const handleRedeem = () => {
    const code = redeemCode.trim().toUpperCase();
    if (VALID_REDEEM_CODES.includes(code)) {
      setRedeemError('');
      setStep('success');
      toast.success('Redeem code applied — Premium unlocked!');
      setTimeout(() => {
        onPaymentComplete();
        onOpenChange(false);
        resetState();
      }, 1500);
    } else {
      setRedeemError('Invalid redeem code. Please check and try again.');
    }
  };

  const handleSelectMethod = (method: string, type: string) => {
    setSelectedMethod(type);
    setStep('details');
  };

  const handlePay = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onPaymentComplete();
        onOpenChange(false);
        resetState();
      }, 1500);
    }, 2000);
  };

  const isFormValid = () => {
    if (selectedMethod === 'upi') return upiId.includes('@');
    if (selectedMethod === 'card') return cardNumber.length >= 16 && expiry.length >= 4 && cvv.length >= 3;
    return false;
  };

  const formatCardNumber = (val: string) => {
    const nums = val.replace(/\D/g, '').slice(0, 16);
    return nums.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val: string) => {
    const nums = val.replace(/\D/g, '').slice(0, 4);
    if (nums.length >= 3) return nums.slice(0, 2) + '/' + nums.slice(2);
    return nums;
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) resetState(); onOpenChange(o); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {step === 'success' ? 'Payment Successful!' : step === 'processing' ? 'Processing...' : 'Complete Payment'}
          </DialogTitle>
        </DialogHeader>

        {step === 'select' && (
          <div className="space-y-4">
            <div className="bg-primary/10 p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-primary">₹199/month</p>
              <p className="text-xs text-muted-foreground mt-1">CoreAI Premium – All features unlocked</p>
            </div>
            <div className="space-y-2">
              {paymentMethods.map((method, index) => (
                <motion.div
                  key={method.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    onClick={() => handleSelectMethod(method.name, method.type)}
                    className="w-full justify-start gap-3 h-14"
                    variant="outline"
                  >
                    <div className={`w-10 h-10 rounded-lg ${method.color} flex items-center justify-center`}>
                      <method.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-base font-medium">{method.name}</span>
                  </Button>
                </motion.div>
              ))}
            </div>

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center"><span className="bg-background px-2 text-[10px] uppercase tracking-wider text-muted-foreground">or</span></div>
            </div>

            <Button
              onClick={() => setStep('redeem')}
              variant="outline"
              className="w-full justify-start gap-3 h-14 border-primary/40 hover:bg-primary/5"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-pink-500 flex items-center justify-center">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-base font-medium">Have a Redeem Code?</p>
                <p className="text-[11px] text-muted-foreground">Unlock Premium instantly for free</p>
              </div>
            </Button>

            <p className="text-[10px] text-center text-muted-foreground flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" /> Secure & encrypted payment
            </p>
          </div>
        )}

        {step === 'redeem' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="bg-gradient-to-br from-amber-500/10 to-pink-500/10 p-4 rounded-xl text-center border border-primary/20">
              <Gift className="w-8 h-8 mx-auto text-primary mb-2" />
              <p className="text-sm font-semibold">Enter your Redeem Code</p>
              <p className="text-[11px] text-muted-foreground mt-1">Unlock CoreAI Premium instantly</p>
            </div>
            <div className="space-y-2">
              <Input
                placeholder="PREM-XXXX"
                value={redeemCode}
                onChange={(e) => { setRedeemCode(e.target.value.toUpperCase()); setRedeemError(''); }}
                onKeyDown={(e) => { if (e.key === 'Enter' && redeemCode.trim()) handleRedeem(); }}
                className="text-center tracking-widest font-mono uppercase"
                maxLength={20}
                autoFocus
              />
              {redeemError && <p className="text-xs text-destructive text-center">{redeemError}</p>}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => { setStep('select'); setRedeemError(''); }}>Back</Button>
              <Button className="flex-1" disabled={!redeemCode.trim()} onClick={handleRedeem}>
                Redeem
              </Button>
            </div>
          </motion.div>
        )}


        {step === 'details' && selectedMethod === 'upi' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="bg-primary/10 p-3 rounded-xl text-center">
              <p className="text-lg font-bold text-primary">₹199</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">UPI ID</label>
              <Input
                placeholder="yourname@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep('select')}>Back</Button>
              <Button className="flex-1" disabled={!isFormValid()} onClick={handlePay}>
                Pay ₹199
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'details' && selectedMethod === 'card' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="bg-primary/10 p-3 rounded-xl text-center">
              <p className="text-lg font-bold text-primary">₹199</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Card Number</label>
                <Input
                  placeholder="1234 5678 9012 3456"
                  value={formatCardNumber(cardNumber)}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                  maxLength={19}
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-sm font-medium">Expiry</label>
                  <Input
                    placeholder="MM/YY"
                    value={formatExpiry(expiry)}
                    onChange={(e) => setExpiry(e.target.value.replace(/\D/g, ''))}
                    maxLength={5}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium">CVV</label>
                  <Input
                    placeholder="123"
                    type="password"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                    maxLength={3}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep('select')}>Back</Button>
              <Button className="flex-1" disabled={!isFormValid()} onClick={handlePay}>
                Pay ₹199
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'processing' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Processing your payment securely...</p>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4 py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </motion.div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">Welcome to Premium!</p>
              <p className="text-sm text-muted-foreground mt-1">All features are now unlocked ✨</p>
            </div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
};
