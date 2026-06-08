import { Check } from 'lucide-react';

export default function WizardStepper({ steps, activeIndex }) {
  return (
    <div className="w-full overflow-x-auto pb-4 pt-2 hide-scrollbar">
      <div className="flex min-w-[640px] items-start justify-between">
        {steps.map((step, idx) => {
          const done = idx < activeIndex;
          const active = idx === activeIndex;

          return (
            <div
              key={step.key}
              className="relative flex flex-1 flex-col items-center"
              aria-current={active ? 'step' : undefined}
            >
              {/* Connecting Line */}
              {idx > 0 && (
                <div className="absolute left-[-50%] top-6 w-full -translate-y-1/2 px-7">
                  <div
                    className={`h-1 w-full rounded-full transition-colors duration-500 ${
                      done || active ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                </div>
              )}

              {/* Step Circle */}
              <div className="relative z-10 flex h-12 items-center justify-center">
                <span
                  className={`flex shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                    done
                      ? 'h-10 w-10 bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-100'
                      : active
                        ? 'h-11 w-11 border-[3px] border-emerald-600 bg-white text-emerald-700 ring-[5px] ring-emerald-50 shadow-lg shadow-emerald-500/20 scale-110'
                        : 'h-10 w-10 border-2 border-slate-200 bg-slate-50 text-slate-400 scale-100'
                  }`}
                >
                  {done ? <Check size={18} strokeWidth={3} /> : idx + 1}
                </span>
              </div>

              {/* Step Label */}
              <span
                className={`mt-3 max-w-[6rem] text-center text-xs font-bold leading-tight transition-colors duration-300 ${
                  active ? 'text-emerald-700' : done ? 'text-emerald-600' : 'text-slate-400'
                }`}
              >
                {step.shortLabel || step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
