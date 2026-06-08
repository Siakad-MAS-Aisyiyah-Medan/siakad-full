import { Check, ListOrdered } from 'lucide-react';
import { PPDB_TIMELINE_STEPS } from '../../utils/dashboardState';

export default function PpdbTimeline({ activeIndex = 0 }) {
  return (
    <div className="cm-panel">
      <div className="cm-panel__header cm-panel__header--simple">
        <div className="cm-panel__header-icon cm-panel__header-icon--info">
          <ListOrdered size={18} />
        </div>
        <div className="cm-panel__header-text">
          <h2>Timeline PPDB</h2>
          <p>Alur pendaftaran dari pembuatan akun hingga pengumuman hasil.</p>
        </div>
      </div>

      <ol className="cm-timeline-list">
        {PPDB_TIMELINE_STEPS.map((step, idx) => {
          const done = idx < activeIndex;
          const active = idx === activeIndex;
          const state = done ? 'done' : active ? 'active' : 'pending';

          return (
            <li key={step.key} className={`cm-timeline-item cm-timeline-item--${state}`}>
              <div className="cm-timeline-item__connector" />
              <span className="cm-timeline-item__dot">
                {done ? <Check size={13} strokeWidth={2.5} /> : idx + 1}
              </span>
              <div className="cm-timeline-item__content">
                <strong>{step.label}</strong>
                <span>{step.description}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
