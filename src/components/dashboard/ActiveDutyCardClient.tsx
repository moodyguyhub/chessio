/**
 * ActiveDutyCardClient - Client-side wrapper for navigation
 * 
 * Handles client-side routing and localStorage placement check
 * Adds cinematic entrance animations (Phase 2.2)
 */

"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ActiveDutyCard, type ActiveDutyCardProps } from "./ActiveDutyCard";
import { getPlacementResult } from "@/lib/placement/storage";
import { fadeInUpGentle } from "@/lib/motion";

type ClientProps = Omit<ActiveDutyCardProps, 'actions'> & {
  actions: {
    onPrimaryHref: string;
    onSecondaryHref?: string;
    primaryLabel: string;
    secondaryLabel?: string;
  };
};

export function ActiveDutyCardClient({
  status: serverStatus,
  userProfile,
  currentMission,
  actions: serverActions,
  className,
}: ClientProps) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [clientStatus, setClientStatus] = useState(serverStatus);
  const [clientActions, setClientActions] = useState(serverActions);

  // Check localStorage for placement result on mount
  useEffect(() => {
    const placementResult = getPlacementResult();
    
    if (placementResult) {
      // Override server state with client placement result
      if (placementResult.status === 'passed' && serverStatus === 'new_user') {
        setClientStatus('placement_passed');
        setClientActions({
          onPrimaryHref: '/school',
          onSecondaryHref: '/app',
          primaryLabel: 'Begin Level 1',
          secondaryLabel: 'Visit Pre-School (Optional)',
        });
      } else if (placementResult.status === 'failed' && serverStatus === 'new_user') {
        setClientStatus('placement_failed');
        setClientActions({
          onPrimaryHref: '/app',
          onSecondaryHref: '/school/placement',
          primaryLabel: 'Enter Pre-School',
          secondaryLabel: 'Retake Evaluation',
        });
      }
    }
  }, [serverStatus]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={shouldReduceMotion ? undefined : fadeInUpGentle}
    >
      <ActiveDutyCard
        status={clientStatus}
        userProfile={userProfile}
        currentMission={currentMission}
        actions={{
          onPrimary: () => router.push(clientActions.onPrimaryHref),
          onSecondary: clientActions.onSecondaryHref 
            ? () => router.push(clientActions.onSecondaryHref!)
            : undefined,
          primaryLabel: clientActions.primaryLabel,
          secondaryLabel: clientActions.secondaryLabel,
        }}
        className={className}
      />
    </motion.div>
  );
}
