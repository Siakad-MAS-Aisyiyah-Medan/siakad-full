import { useState } from 'react';
import AdminPageShell from '@app/shared/components/AdminPageShell';
import InfoProfilPage from './info';
import PrestasiPage from './prestasi';
import EkskulPage from './ekskul';

export default function ProfilSekolahPage() {
  const [activeTab, setActiveTab] = useState('info');

  const renderContent = () => {
    switch (activeTab) {
      case 'info':
        return <InfoProfilPage />;
      case 'prestasi':
        return <PrestasiPage />;
      case 'ekskul':
        return <EkskulPage />;
      default:
        return null;
    }
  };

  return (
    <AdminPageShell>
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #e2e8f0', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('info')}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'info' ? '3px solid var(--color-primary)' : '3px solid transparent',
            color: activeTab === 'info' ? 'var(--color-primary)' : '#64748b',
            fontWeight: activeTab === 'info' ? 'bold' : 'normal',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Profil
        </button>
        <button
          onClick={() => setActiveTab('prestasi')}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'prestasi' ? '3px solid var(--color-primary)' : '3px solid transparent',
            color: activeTab === 'prestasi' ? 'var(--color-primary)' : '#64748b',
            fontWeight: activeTab === 'prestasi' ? 'bold' : 'normal',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Berita & Prestasi
        </button>
        <button
          onClick={() => setActiveTab('ekskul')}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'ekskul' ? '3px solid var(--color-primary)' : '3px solid transparent',
            color: activeTab === 'ekskul' ? 'var(--color-primary)' : '#64748b',
            fontWeight: activeTab === 'ekskul' ? 'bold' : 'normal',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Ekskul
        </button>
      </div>

      <div className="tab-content">
        {renderContent()}
      </div>
    </AdminPageShell>
  );
}
