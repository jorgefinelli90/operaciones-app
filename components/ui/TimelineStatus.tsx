"use client";

interface Step {
  id: string;
  label: string;
}

interface TimelineStatusProps {
  value: string;
  steps: Step[];
  onChange: (value: string) => void;
}

export function TimelineStatus({
  value,
  steps,
  onChange,
}: TimelineStatusProps) {
  const currentIndex = steps.findIndex(
    (step) => step.id === value,
  );

  return (
    <div className="w-full">
      <div className="flex items-start justify-between">

        {steps.map((step, index) => {
          const completed = index < currentIndex;
          const active = index === currentIndex;

          return (
            <div
              key={step.id}
              className="relative flex flex-1 flex-col items-center"
            >
              {index !== steps.length - 1 && (
                <div
                  className={`absolute top-3 left-1/2 h-0.5 w-full ${
                    index < currentIndex
                      ? "bg-blue-600"
                      : "bg-border"
                  }`}
                />
              )}

              <button
                onClick={() => onChange(step.id)}
                className={`z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${
                  active
                    ? "border-blue-600 bg-blue-600"
                    : completed
                    ? "border-blue-600 bg-blue-600"
                    : "border-border bg-background hover:border-blue-600"
                }`}
              >
                {(completed || active) && (
                  <div className="h-2.5 w-2.5 rounded-full bg-white" />
                )}
              </button>

              <span
                className={`mt-2 text-center text-xs ${
                  active
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}