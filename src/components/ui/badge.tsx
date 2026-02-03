import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs  transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        primary:
          "border-transparent bg-blue-700 text-white hover:bg-blue-700/80",
        secondary:
          "border-transparent bg-secondary border-primary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
        approved: "bg-blue-500/10 text-blue-600 border-blue-500/20",
        shipped: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
        delivered: "bg-green-500/10 text-green-600 border-green-500/20",
        cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
        returned: "bg-orange-500/10 text-orange-600 border-orange-500/20",
        outline: "text-foreground",
        cod: "border-transparent bg-purple-700 text-white hover:bg-purple-700/80",
        online:
          "border-transparent bg-green-700 text-white hover:bg-green-700/80",
        paid: "bg-green-500/10 text-green-600 border-green-500/20",
        failed: "bg-red-500/10 text-red-600 border-red-500/20",
        refunded: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
        cancelled_at_delivery: "bg-red-500/10 text-red-600 border-red-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
