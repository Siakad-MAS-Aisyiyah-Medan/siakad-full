import { Check } from 'lucide-react';

const STEPS = [
  { key: 'biodata', label: 'Biodata' },
  { key: 'berkas', label: 'Berkas' },
  { key: 'submit', label: 'Submit' },
  { key: 'status', label: 'Status' },
];

export default function PendaftaranStepper({ current = 0 }) {
  return (
    <div className="ppdb-stepper">
      {STEPS.map((step, idx) => {
        const done = idx < current;
        const active = idx === current;
        return (
          <div key={step.key} className={`ppdb-step ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
            <div className="ppdb-step-circle">{done ? <Check size={16} /> : idx + 1}</div>
            <span>{step.label}</span>
          </div>
        );
      })}
    </div>
  );
}
