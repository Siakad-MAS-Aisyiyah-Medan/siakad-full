import { Info, Clock, Phone } from 'lucide-react';
import { formatInfoText } from '../../utils/formatPpdbInfo';

const DEFAULT_INFO = {
  batasUpload: 'Unggah seluruh berkas sebelum batas waktu yang ditetapkan sekolah.',
  kontak: 'Hubungi panitia PPDB melalui kontak resmi sekolah.',
};

export default function ImportantInfoPanel({ info }) {
  const data = { ...DEFAULT_INFO, ...info };

  const items = [
    { icon: Clock, title: 'Batas Upload Berkas', text: data.batasUpload, tone: 'amber' },
    { icon: Phone, title: 'Kontak Admin', text: formatInfoText(data.kontak) || data.kontak, tone: 'emerald', highlight: true },
  ];

  return (
    <div className="cm-panel cm-info-panel">
      <div className="cm-panel__header cm-panel__header--simple">
        <div className="cm-panel__header-icon cm-panel__header-icon--info">
          <Info size={18} />
        </div>
        <div className="cm-panel__header-text">
          <h2>Informasi Penting</h2>
        </div>
      </div>
      <ul className="cm-info-list">
        {items.map(({ icon: Icon, title, text, tone, highlight }) => (
          <li
            key={title}
            className={`cm-info-item${highlight ? ' cm-info-item--highlight' : ''}`}
          >
            <span className={`cm-info-item__icon cm-info-item__icon--${tone}`}>
              <Icon size={16} />
            </span>
            <div className="cm-info-item__content">
              <strong>{title}</strong>
              <p>{typeof text === 'string' ? text : '—'}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
