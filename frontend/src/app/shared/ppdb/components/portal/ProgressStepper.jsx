import { Check } from 'lucide-react';

export default function ProgressStepper({
  steps,
  activeIndex,
  completedSteps = [],
  maxReachableStep = steps.length - 1,
  onStepClick,
}) {
  const completedSet = new Set(completedSteps);

  const getStepState = (idx) => {
    if (idx === activeIndex) return 'active';
    if (completedSet.has(idx) || idx < activeIndex) return 'done';
    if (idx <= maxReachableStep) return 'reachable';
    return 'pending';
  };

  const handleClick = (idx) => {
    if (onStepClick && idx <= maxReachableStep) {
      onStepClick(idx);
    }
  };

  return (
    <div className="w-full">
      <div className="hidden sm:block">
        <div className="-mx-1 overflow-x-auto pb-4 pt-2 hide-scrollbar">
          <div className="flex min-w-[640px] items-start justify-between px-1">
            {steps.map((step, idx) => {
              const state = getStepState(idx);
              const clickable = onStepClick && idx <= maxReachableStep;
              const isLineGreen = idx <= activeIndex || state === 'done';

              return (
                <button
                  key={step.key}
                  type="button"
                  disabled={!clickable}
                  onClick={() => handleClick(idx)}
                  className={`relative flex min-w-0 flex-1 flex-col items-center border-0 bg-transparent p-0 focus:outline-none ${
                    clickable ? 'cursor-pointer' : 'cursor-default'
                  }`}
                  aria-current={state === 'active' ? 'step' : undefined}
                >
                  {/* Connecting Line */}
                  {idx > 0 && (
                    <div className="absolute left-[-50%] top-6 w-full -translate-y-1/2 px-7">
                      <div
                        className={`h-[2px] w-full rounded-full transition-colors duration-500 ${
                          isLineGreen ? 'bg-emerald-400' : 'bg-slate-200'
                        }`}
                      />
                    </div>
                  )}

                  {/* Step Circle */}
                  <div className="relative z-10 flex h-12 w-full items-center justify-center">
                    <span
                      className={`flex shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                        state === 'done'
                          ? 'h-8 w-8 bg-emerald-100 text-emerald-700 scale-100'
                          : state === 'active'
                            ? 'h-9 w-9 bg-emerald-500 text-white shadow-md shadow-emerald-500/30 scale-110 ring-[4px] ring-emerald-50'
                            : state === 'reachable'
                              ? 'h-8 w-8 bg-slate-100 text-slate-600 scale-100 hover:bg-slate-200'
                              : 'h-8 w-8 bg-slate-50 text-slate-400 scale-100'
                      }`}
                    >
                      {state === 'done' ? <Check size={18} strokeWidth={3} /> : idx + 1}
                    </span>
                  </div>

                  {/* Step Label */}
                  <span
                    className={`mt-3 max-w-[6rem] text-center text-[11px] font-semibold leading-tight tracking-wide transition-colors duration-300 ${
                      state === 'pending'
                        ? 'text-slate-400'
                        : state === 'active'
                          ? 'text-emerald-700'
                          : state === 'reachable'
                            ? 'text-slate-600'
                            : 'text-emerald-600'
                    }`}
                  >
                    {step.shortLabel || step.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <ol className="space-y-4 sm:hidden">
        {steps.map((step, idx) => {
          const state = getStepState(idx);
          const clickable = onStepClick && idx <= maxReachableStep;
          return (
            <li key={step.key}>
              <button
                type="button"
                disabled={!clickable}
                onClick={() => handleClick(idx)}
                className={`flex w-full items-center gap-4 border-0 bg-transparent p-0 text-left focus:outline-none ${
                  clickable ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                    state === 'done'
                      ? 'bg-emerald-100 text-emerald-700'
                      : state === 'active'
                        ? 'bg-emerald-500 text-white ring-4 ring-emerald-50 shadow-sm'
                        : state === 'reachable'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-slate-50 text-slate-400'
                  }`}
                >
                  {state === 'done' ? <Check size={16} strokeWidth={3} /> : idx + 1}
                </span>
                <span
                  className={`text-[13px] font-semibold transition-colors duration-300 ${
                    state === 'active' ? 'text-emerald-700' : state === 'done' ? 'text-emerald-600' : 'text-slate-600'
                  }`}
                >
                  {step.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

