import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Users, Lock } from "lucide-react";
import type { ChessioProfile } from "@/lib/dashboard/profile";

interface ClubCardProps {
  profile: ChessioProfile;
}

export function ClubCard({ profile }: ClubCardProps) {
  return (
    <Card className="flex flex-col border-dashed border-neutral-800 bg-neutral-900/60 opacity-80">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="rounded-full bg-neutral-700/10 p-2">
            <Users className="h-5 w-5 text-neutral-500" />
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            Coming soon
          </Badge>
        </div>
        <CardTitle className="text-lg mt-2">Chessio Club</CardTitle>
        <CardDescription className="text-xs">
          Your training dojo
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-3">
        <p className="text-xs text-neutral-400">
          A community-driven space for serious learners. Study groups, tournaments, and sparring partners.
        </p>
        
        <ul className="space-y-1.5 text-xs text-neutral-500">
          <li className="flex items-center gap-2">
            <span>•</span>
            Study groups & live events
          </li>
          <li className="flex items-center gap-2">
            <span>•</span>
            Sparring games & reviews
          </li>
          <li className="flex items-center gap-2">
            <span>•</span>
            Seasonal challenges & rankings
          </li>
        </ul>

        <p className="text-[11px] text-neutral-600 pt-2">
          Want early access? Mention &apos;Club&apos; in any feedback box – we&apos;ll prioritize you.
        </p>
      </CardContent>

      <CardFooter>
        <Button
          size="sm"
          variant="outline"
          disabled
          className="w-full justify-center cursor-not-allowed opacity-60"
          data-testid="dashboard-club-cta"
        >
          <Lock className="mr-2 h-4 w-4" />
          Join the waitlist
        </Button>
      </CardFooter>
    </Card>
  );
}
