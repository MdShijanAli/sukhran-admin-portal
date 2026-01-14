import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
      <Skeleton className="h-8 w-20 mb-2" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-lg border bg-card shadow-card">
      <div className="p-6 border-b">
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="p-6">
        <Skeleton className="h-[300px] w-full" />
      </div>
    </div>
  );
}

export function AlertCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-card">
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-5 w-32" />
      </div>
      <Skeleton className="h-8 w-16 mb-2" />
      <Skeleton className="h-4 w-full" />
    </div>
  );
}
