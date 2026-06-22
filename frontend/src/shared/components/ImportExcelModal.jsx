import React, { useState, useEffect } from 'react';
import { UploadCloud, X, Download, AlertCircle } from 'lucide-react';

export default function ImportExcelModal({
  isOpen,
  onClose,
  title = "Import Data Excel",
  onDownloadTemplate,
  onSubmit,
  loading = false,
  requiresClass = false,
  error = null,
}) {
  const [file, setFile] = useState(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    if (requiresClass && isOpen) {
      import('@/shared/akademik/kelas/services/kelas.service').then(module => {
        module.fetchKelasList({ per_page: 100 })
          .then(items => {
            setClasses(items || []);
          })
          .catch(err => console.error("Failed to fetch classes", err));
      });
    }
  }, [requiresClass, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return;
    if (requiresClass && !selectedClass) {
      alert("Silakan pilih kelas terlebih dahulu");
      return;
    }
    onSubmit(file, selectedClass);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: 'white', borderRadius: '12px', width: '100%', maxWidth: '500px',
        padding: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
      }} className="animate-fade-in-up">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-dark)' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '1rem', borderRadius: '8px', color: '#991b1b', marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'start' }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '0.875rem' }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {requiresClass && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                Pilih Kelas <span style={{ color: 'red' }}>*</span>
              </label>
              <select 
                value={selectedClass} 
                onChange={(e) => setSelectedClass(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none' }}
                required
              >
                <option value="">-- Pilih Kelas --</option>
                {classes.map(c => (
                  <option key={c.id_kelas} value={c.id_kelas}>{c.nama_kelas}</option>
                ))}
              </select>
            </div>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
              File Data (.xlsx, .csv) <span style={{ color: 'red' }}>*</span>
            </label>
            <div style={{ border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '2rem', textAlign: 'center', backgroundColor: '#f8fafc' }}>
              <UploadCloud size={40} style={{ color: '#94a3b8', margin: '0 auto 1rem' }} />
              <input 
                type="file" 
                accept=".xlsx,.csv,.xls" 
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="file-upload"
              />
              <label htmlFor="file-upload" style={{ cursor: 'pointer', color: 'var(--color-primary)', fontWeight: 500, display: 'inline-block' }}>
                {file ? file.name : 'Klik untuk memilih file'}
              </label>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>Maksimal ukuran file: 2MB</p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button 
              type="button" 
              onClick={onDownloadTemplate}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 500 }}
            >
              <Download size={16} /> Download Template
            </button>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" onClick={onClose} className="btn-outline">
                Batal
              </button>
              <button type="submit" className="btn-primary" disabled={loading || !file} style={{ opacity: (loading || !file) ? 0.7 : 1 }}>
                {loading ? 'Mengimport...' : 'Import Data'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
