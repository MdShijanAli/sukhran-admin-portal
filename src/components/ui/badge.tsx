import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        primary:
          "border-transparent bg-blue-700 text-primary-foreground hover:bg-blue/80",
        secondary:
          "border-transparent bg-secondary border-primary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        pending: "bg-warning/10 text-warning border-warning/20",
        approved: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        shipped: "bg-primary/10 text-primary border-primary/20",
        delivered: "bg-success/10 text-success border-success/20",
        cancelled: "bg-destructive/10 text-destructive border-destructive/20",
        returned: "bg-destructive/10 text-destructive border-destructive/20",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
