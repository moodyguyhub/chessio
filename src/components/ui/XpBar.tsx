"use client";

interface XpBarProps {
  level: number;
  currentXp: number;
  xpForNextLevel: number;
  progressPercent: number;
}

export function XpBar({ level, currentXp, xpForNextLevel, progressPercent }: XpBarProps) {
  return (
    <div className="flex items-center gap-4">
      {/* Level badge */}
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
        {level}
      </div>
      
      {/* Progress bar */}
      <div className="flex-1">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600 dark:text-gray-300">Level {level}</span>
          <span className="text-gray-500">{currentXp} / {xpForNextLevel} XP</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
