import { Rocket, Sparkles, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ComingSoon() {
  return (
    <Card className="shadow-card border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 via-background to-primary/5">
      <CardContent className="flex flex-col items-center justify-center py-16 px-4">
        <div className="relative">
          <div className="absolute inset-0 animate-ping opacity-20">
            <Sparkles className="h-16 w-16 text-primary mx-auto" />
          </div>
          <Rocket className="h-16 w-16 text-primary mx-auto relative animate-bounce" />
        </div>

        <h2 className="text-3xl font-bold mt-8 mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Coming Soon!
        </h2>

        <p className="text-muted-foreground text-center max-w-md mb-6">
          We're working hard to bring you an amazing dashboard experience. Stay
          tuned for exciting features!
        </p>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Under Development</span>
        </div>

        <div className="mt-8 flex gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-75" />
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-150" />
        </div>
      </CardContent>
    </Card>
  );
}
