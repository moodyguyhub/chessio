"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { GraduationCap, Lock, Unlock } from "lucide-react";
import type { ChessioProfile } from "@/lib/dashboard/profile";
import { getPlacementResult } from "@/lib/placement/storage";

interface SchoolCardProps {
  profile: ChessioProfile;
}

export function SchoolCard({ profile }: SchoolCardProps) {
  const { schoolAccess, preSchoolStatus, placementStatus: serverPlacementStatus } = profile;
  
  // Client-side localStorage check for placement status
  const [clientPlacementStatus, setClientPlacementStatus] = useState<"not_taken" | "passed" | "failed">("not_taken");
  const [isLoadingPlacement, setIsLoadingPlacement] = useState(true);

  useEffect(() => {
    const result = getPlacementResult();
    if (result && result.status === "passed") {
      setClientPlacementStatus("passed");
    } else if (result && result.status === "failed") {
      setClientPlacementStatus("failed");
    }
    setIsLoadingPlacement(false);
  }, []);

  // Use client-side placement status for unlock logic (overrides server in v1)
  const effectivePlacementStatus = clientPlacementStatus !== "not_taken" ? clientPlacementStatus : serverPlacementStatus;
  const isUnlockedByPlacement = clientPlacementStatus === "passed";
  const isLocked = schoolAccess === "locked" && !isUnlockedByPlacement;

  return (
    <Card className={`flex flex-col ${
      isLocked 
        ? "border-dashed border-neutral-700 bg-neutral-900/60 opacity-90" 
        : "border-blue-400/40 bg-gradient-to-br from-blue-950/30 to-neutral-900/90 shadow-md shadow-blue-400/10"
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className={`rounded-full p-2 ${
            isLocked ? "bg-neutral-800/50" : "bg-blue-400/10"
          }`}>
            <GraduationCap className={`h-5 w-5 ${
              isLocked ? "text-neutral-500" : "text-blue-400"
            }`} />
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant={isLocked ? "secondary" : "default"} className="flex items-center gap-1">
              {isLocked ? (
                <>
                  <Lock className="h-3 w-3" />
                  Locked
                </>
              ) : (
                <>
                  <Unlock className="h-3 w-3" />
                  Unlocked
                </>
              )}
            </Badge>
            {isUnlockedByPlacement && !isLoadingPlacement && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 border-green-500/40 text-green-400">
                Placement passed
              </Badge>
            )}
          </div>
        </div>
        <CardTitle className="text-lg mt-2">Chess School</CardTitle>
        <CardDescription className="text-xs">
          Structured levels, exams & Russian-style coaching
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-3">
        {isLocked ? (
          <>
            <p className="text-xs text-neutral-400">
              Finish Pre-School or pass the Placement Test to unlock structured training with levels, exams, and your personal AI Coach.
            </p>
            
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-xs">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  preSchoolStatus === "completed" ? "bg-green-500" : "bg-neutral-600"
                }`} />
                <span className={preSchoolStatus === "completed" ? "text-green-400" : "text-neutral-500"}>
                  Complete Pre-School
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  effectivePlacementStatus === "passed" ? "bg-green-500" : "bg-neutral-600"
                }`} />
                <span className={effectivePlacementStatus === "passed" ? "text-green-400" : "text-neutral-500"}>
                  Pass Placement Test
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="text-xs text-neutral-400">
              You&apos;re ready for serious training! Tackle Levels 1–3 with checks, tactics, endgames, exams, and secret rule cards.
            </p>
            <ul className="space-y-1 text-xs text-neutral-400">
              <li className="flex items-center gap-2">
                <span className="text-blue-400">•</span>
                Built-in AI Coach for questions
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-400">•</span>
                XP rewards and level progression
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-400">•</span>
                Secret rule cards when you master levels
              </li>
            </ul>
          </>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        {isLocked ? (
          <>
            <Link href="/school/placement" className="w-full">
              <Button size="sm" variant="primary" className="w-full justify-center">
                Try Placement Test
              </Button>
            </Link>
            <p className="text-[10px] text-center text-neutral-500 italic">
              or complete Pre-School to unlock
            </p>
          </>
        ) : (
          <Link href="/school" className="w-full">
            <Button size="sm" className="w-full justify-center">
              Enter Chess School
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
