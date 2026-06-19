import { Check } from 'lucide-react';
import PageHeader from '@app/shared/components/PageHeader';

export default function PpdbProgressStepper({ steps, activeIndex, percent }) {
  return (
    <div className="data-panel view-list calon-murid-panel" style={{ paddingTop: '1rem' }}>
      <PageHeader title="Progres Pendaftaran" subtitle="Lacak kelengkapan setiap tahap formulir PPDB.">
        <span className="calon-murid-percent-pill">{percent}% selesai</span>
      </PageHeader>

      <div className="calon-murid-stepper-wrap">
        <ol className="calon-murid-stepper">
          {steps.map((step, idx) => {
            const done = idx < activeIndex;
            const active = idx === activeIndex;
            const state = done ? 'done' : active ? 'active' : 'pending';

            return (
              <li key={step.key} className={`calon-murid-step calon-murid-step--${state}`}>
                <span className="calon-murid-step__circle">
                  {done ? <Check size={14} strokeWidth={2.5} /> : idx + 1}
                </span>
                <span className="calon-murid-step__label">{step.label}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
