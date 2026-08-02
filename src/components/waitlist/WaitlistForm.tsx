import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DuplicateEmailError,
  joinWaitlist,
  USE_CASES,
  waitlistSchema,
  type UseCase,
} from "@/lib/waitlist";

interface WaitlistFormProps {
  onSuccess: (position: number, name: string) => void;
}

type Errors = Partial<Record<"name" | "email" | "country" | "use_case" | "form", string>>;

export const WaitlistForm = ({ onSuccess }: WaitlistFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [useCase, setUseCase] = useState<UseCase | "">("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});

    const parsed = waitlistSchema.safeParse({
      name: name || undefined,
      email,
      country: country || undefined,
      use_case: useCase || undefined,
    });

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        country: fieldErrors.country?.[0],
        use_case: fieldErrors.use_case?.[0],
      });
      return;
    }

    setLoading(true);
    try {
      const position = await joinWaitlist(parsed.data);
      onSuccess(position, name);
      setName("");
      setEmail("");
      setCountry("");
      setUseCase("");
    } catch (error) {
      setErrors({
        form:
          error instanceof DuplicateEmailError
            ? "Good news — this email is already on the waitlist. Sit tight, we'll be in touch!"
            : error instanceof Error
              ? error.message
              : "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      noValidate
      className="w-full rounded-3xl border border-border bg-card p-6 shadow-[0_20px_60px_-30px_hsl(0_0%_0%/0.35)] sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="wl-name">Full Name</Label>
          <Input
            id="wl-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ada Lovelace"
            autoComplete="name"
            className="h-12 rounded-xl"
            aria-invalid={!!errors.name}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="wl-email">
            Email Address <span className="text-primary">*</span>
          </Label>
          <Input
            id="wl-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            autoComplete="email"
            className="h-12 rounded-xl"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "wl-email-error" : undefined}
          />
          {errors.email && (
            <p id="wl-email-error" className="text-sm text-destructive">
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="wl-country">Country</Label>
          <Input
            id="wl-country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="India"
            autoComplete="country-name"
            className="h-12 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="wl-usecase">Primary Use Case</Label>
          <Select value={useCase} onValueChange={(v) => setUseCase(v as UseCase)}>
            <SelectTrigger id="wl-usecase" className="h-12 rounded-xl">
              <SelectValue placeholder="Select one" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {USE_CASES.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {errors.form && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          role="alert"
          className="mt-5 rounded-xl border border-border bg-muted/60 px-4 py-3 text-sm text-muted-foreground"
        >
          {errors.form}
        </motion.p>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="group mt-6 h-12 w-full rounded-xl text-base font-semibold transition-transform hover:-translate-y-0.5"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            Reserving your spot…
          </>
        ) : (
          <>
            Join Waitlist
            <ArrowRight
              className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </>
        )}
      </Button>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        No spam. Unsubscribe anytime. We only email about early access.
      </p>
    </motion.form>
  );
};
