"use client";

interface ProgressHeaderProps {
  level: number;
  currentXp: number;
  nextLevelXp: number;
  className?: string;
}

/**
 * Compact progress header showing level and XP progress.
 * Used across lesson, puzzle, and completion screens.
 */
export function ProgressHeader({ 
  level, 
  currentXp, 
  nextLevelXp,
  className = "" 
}: ProgressHeaderProps) {
  const progressPercent = Math.min((currentXp / nextLevelXp) * 100, 100);
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Level Badge */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-300/20 dark:bg-amber-300/10 rounded-full">
        <span className="text-xs font-bold text-amber-600 dark:text-amber-300">
          Lv.{level}
        </span>
      </div>
      
      {/* XP Progress */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="flex-1 h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-amber-300 dark:bg-amber-300 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
          {currentXp}/{nextLevelXp} XP
        </span>
      </div>
    </div>
  );
}

export default ProgressHeader;
