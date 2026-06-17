import { useNavigate } from 'react-router-dom';
import { ArrowRight, ClipboardList, FileEdit, Upload, Zap } from 'lucide-react';

const SECONDARY_ACTIONS = [
  {
    key: 'formulir',
    title: 'Formulir PPDB',
    description: 'Isi atau perbarui data formulir.',
    icon: FileEdit,
    path: '/ppdb/registrasi',
    requiresForm: true,
    tone: 'green',
  },
  {
    key: 'upload',
    title: 'Upload Berkas',
    description: 'Unggah dokumen pendukung.',
    icon: Upload,
    path: '/calon-murid/upload-berkas',
    requiresReg: true,
    tone: 'blue',
  },
  {
    key: 'status',
    title: 'Status Pendaftaran',
    description: 'Detail verifikasi & catatan admin.',
    icon: ClipboardList,
    path: '/calon-murid/status',
    requiresReg: true,
    tone: 'purple',
  },
];

export default function QuickActionsGrid({ dashboardState }) {
  const navigate = useNavigate();
  const { hasRegistration, canEditForm, canUpload, phase } = dashboardState;

  return (
    <div className="cm-panel cm-quick-actions-panel">
      <div className="cm-panel__header cm-panel__header--simple">
        <div className="cm-panel__header-icon cm-panel__header-icon--purple">
          <Zap size={18} />
        </div>
        <div className="cm-panel__header-text">
          <h2>Aksi Cepat</h2>
          <p>Menu pendukung aktivitas PPDB Anda.</p>
        </div>
      </div>

      <div className="cm-quick-grid">
        {SECONDARY_ACTIONS.map((action) => {
          const Icon = action.icon;
          let disabled = false;
          if (action.requiresReg && !hasRegistration) disabled = true;
          if (action.requiresForm && !canEditForm && phase !== 'revision' && phase !== 'draft') {
            if (phase === 'none') disabled = true;
            if (['submitted', 'verified', 'accepted', 'rejected'].includes(phase)) disabled = true;
          }
          if (action.key === 'upload' && !canUpload) disabled = true;

          return (
            <button
              key={action.key}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && navigate(action.path)}
              className={`cm-quick-card cm-quick-card--${action.tone}${disabled ? ' cm-quick-card--disabled' : ''}`}
            >
              <span className={`cm-quick-card__icon cm-quick-card__icon--${action.tone}`}>
                <Icon size={20} />
              </span>
              <span className="cm-quick-card__body">
                <strong>{action.title}</strong>
                <span>{action.description}</span>
              </span>
              <ArrowRight size={16} className="cm-quick-card__arrow" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
