"use client";

interface TaskBoxProps {
  taskNumber: number;
  totalTasks: number;
  instruction: string;
  hintMessage: string;
  feedback: {
    type: "success" | "error" | null;
    message: string | null;
  };
  showHint: boolean;
  onRequestHint: () => void;
}

export function TaskBox({
  taskNumber,
  totalTasks,
  instruction,
  hintMessage,
  feedback,
  showHint,
  onRequestHint,
}: TaskBoxProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Task Header */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600">
            Task {taskNumber} of {totalTasks}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: totalTasks }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < taskNumber - 1
                    ? "bg-emerald-500"
                    : i === taskNumber - 1
                    ? "bg-emerald-400"
                    : "bg-slate-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Instruction */}
      <div className="p-4">
        <p className="text-slate-900 font-medium">{instruction}</p>
      </div>

      {/* Feedback */}
      {feedback.message && (
        <div
          className={`mx-4 mb-4 p-3 rounded-lg text-sm ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : feedback.type === "error"
              ? "bg-amber-50 text-amber-700 border border-amber-200"
              : "bg-slate-50 text-slate-700 border border-slate-200"
          }`}
        >
          {feedback.type === "success" && <span className="mr-2">✓</span>}
          {feedback.type === "error" && <span className="mr-2">✗</span>}
          {feedback.message}
        </div>
      )}

      {/* Hint Section */}
      <div className="px-4 pb-4">
        {showHint ? (
          <div className="p-3 rounded-lg bg-blue-50 text-blue-700 text-sm border border-blue-200">
            <span className="font-medium">💡 Hint:</span> {hintMessage}
          </div>
        ) : (
          <button
            onClick={onRequestHint}
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            Need a hint?
          </button>
        )}
      </div>
    </div>
  );
}

export default TaskBox;
