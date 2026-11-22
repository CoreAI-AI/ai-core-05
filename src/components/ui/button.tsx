import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all duration-150 ease-out focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] select-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // ChatGPT Signature Solid Black/White Pill
        default: "bg-foreground text-background hover:opacity-90 shadow-2xs font-medium",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-2xs",
        // ChatGPT Subtle Outline Pill
        outline: "border border-border/70 bg-background/80 hover:bg-muted/70 text-foreground shadow-2xs backdrop-blur-xs",
        // ChatGPT Muted Surface Pill
        secondary: "bg-muted/70 text-foreground hover:bg-muted/90 border border-border/40",
        // ChatGPT Ghost / Icon Button
        ghost: "text-muted-foreground hover:text-foreground hover:bg-muted/60",
        link: "text-foreground underline-offset-4 hover:underline",
        // ChatGPT Action Chip / Pill
        chip: "border border-border/60 bg-muted/30 hover:bg-muted/80 text-foreground text-xs font-medium shadow-2xs",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-5 text-sm",
        icon: "h-8 w-8 rounded-full p-0",
        "icon-sm": "h-7 w-7 rounded-full p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
