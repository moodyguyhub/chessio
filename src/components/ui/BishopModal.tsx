"use client";

import { useRouter } from "next/navigation";
import { Button } from "./Button";
import { bishopArcComplete } from "@/lib/copyPatterns";

interface BishopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * BishopModal - Full-screen celebration for completing Bishop arc (375+ XP)
 * Premium overlay with auto-redirect to dashboard
 */
export function BishopModal({ isOpen, onClose }: BishopModalProps) {
  const router = useRouter();

  const handleClose = () => {
    onClose();
    router.push("/app");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 bg-slate-900/50 border border-white/10 rounded-2xl p-8 text-center space-y-6 animate-slide-up">
        {/* Bishop Icon */}
        <div className="text-7xl mb-4">♝</div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-white tracking-tight">
          {bishopArcComplete.title}
        </h2>

        {/* Subtitle */}
        <p className="text-slate-400 text-lg">
          {bishopArcComplete.subtitle}
        </p>

        {/* Body */}
        <p className="text-slate-300 text-sm leading-relaxed">
          {bishopArcComplete.body}
        </p>

        {/* CTA */}
        <Button 
          variant="primary" 
          size="lg" 
          onClick={handleClose}
          className="w-full"
        >
          {bishopArcComplete.cta}
        </Button>
      </div>
    </div>
  );
}
