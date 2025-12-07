import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, CheckCircle2, PlayCircle } from "lucide-react";
import type { ChessioProfile } from "@/lib/dashboard/profile";

interface PreSchoolCardProps {
  profile: ChessioProfile;
}

export function PreSchoolCard({ profile }: PreSchoolCardProps) {
  const { preSchoolStatus, preSchoolProgress } = profile;

  // Status badge config
  const statusConfig = {
    not_started: { label: "Not started", variant: "secondary" as const, icon: PlayCircle },
    in_progress: { label: "In progress", variant: "default" as const, icon: PlayCircle },
    completed: { label: "Completed", variant: "success" as const, icon: CheckCircle2 },
  };

  const config = statusConfig[preSchoolStatus];
  const StatusIcon = config.icon;

  return (
    <Card className="flex flex-col border-amber-400/30 bg-gradient-to-br from-amber-950/20 to-neutral-900/90">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="rounded-full bg-amber-400/10 p-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
          </div>
          <Badge variant={config.variant} className="flex items-center gap-1">
            <StatusIcon className="h-3 w-3" />
            {config.label}
          </Badge>
        </div>
        <CardTitle className="text-lg mt-2">Pre-School</CardTitle>
        <CardDescription className="text-xs">
          Board basics and simple mates
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-3">
        <p className="text-xs text-neutral-400">
          Perfect if you&apos;re new or rusty. No timers, just exploration and learning piece movements.
        </p>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-500">Progress</span>
            <span className="font-medium text-neutral-300">
              {preSchoolProgress.completed}/{preSchoolProgress.total}
            </span>
          </div>
          <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-500 transition-all duration-500"
              style={{ width: `${preSchoolProgress.percent}%` }}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Link href="/app" className="w-full">
          <Button size="sm" variant="outline" className="w-full justify-center">
            {preSchoolStatus === "not_started" ? "Start Pre-School" : 
             preSchoolStatus === "in_progress" ? "Continue" : 
             "View Progress"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
