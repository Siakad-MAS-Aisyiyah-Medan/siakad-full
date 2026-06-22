import { useEffect, useState } from 'react';
import AdminPageShell from '@/shared/components/AdminPageShell';
import PageHeader from '@/shared/components/PageHeader';
import { Save, FileText, CheckCircle, Percent, Gift, MapPin, Building, UploadCloud, X, Plus } from 'lucide-react';
import { fetchAdminPpdbSettings, updateAdminPpdbSettings } from '@/shared/services/ppdb.service';
import { fetchTahunAjaran } from '@/shared/services/tahunAjaran.service';
import { getProfilSekolah } from '@/shared/services/profilSekolah.service';
import { toastError, toastSuccess } from '@/shared/hooks/useConfirm';
import { apiConfig } from '@/config/api.config';

function resolveStorageUrl(path) {
  if (!path) return null;
  
  // Jika path mengandung '/storage/', paksa ambil path dari '/storage/' ke belakang
  const storageIndex = path.indexOf('/storage/');
  let cleanPath = path;
  if (storageIndex !== -1) {
    cleanPath = path.substring(storageIndex);
  } else if (/^https?:\/\//i.test(path)) {
    return path;
  }
  
  const baseUrl = new URL(apiConfig.baseURL);
  const origin = `${baseUrl.protocol}//${baseUrl.host}`;
  return `${origin}${cleanPath.startsWith('/storage/') ? cleanPath : `/storage/${cleanPath}`}`;
}

export default function PengaturanPpdbPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('umum');
  const [previewImage, setPreviewImage] = useState(null);
  
  const [formData, setFormData] = useState({
    ppdb_judul: '',
    ppdb_tahun_ajaran: '',
    ppdb_deskripsi: '',
    ppdb_alamat: '',
    ppdb_brosur: '',
    ppdb_persyaratan: [],
    ppdb_alur: [],
    ppdb_gelombang: [],
    ppdb_promo: [],
    ppdb_fasilitas: [],
    ppdb_ekstrakurikuler: [],
    ppdb_kontak: [],
  });

  const [brosurFile, setBrosurFile] = useState(null);
  const [tahunAjaranOptions, setTahunAjaranOptions] = useState([]);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await fetchAdminPpdbSettings();
      const taList = await fetchTahunAjaran();
      
      let profilAlamat = '';
      try {
        const profilRes = await getProfilSekolah();
        profilAlamat = profilRes?.data?.alamat || '';
      } catch {
        profilAlamat = '';
      }

      setTahunAjaranOptions(taList || []);
      setFormData({
        ppdb_judul: data.ppdb_judul || '',
        ppdb_tahun_ajaran: data.ppdb_tahun_ajaran || '',
        ppdb_deskripsi: data.ppdb_deskripsi || '',
        ppdb_alamat: profilAlamat || data.ppdb_alamat || '',
        ppdb_brosur: data.ppdb_brosur || '',
        ppdb_persyaratan: data.ppdb_persyaratan || [],
        ppdb_alur: data.ppdb_alur || [],
        ppdb_gelombang: data.ppdb_gelombang || [],
        ppdb_promo: data.ppdb_promo || [],
        ppdb_fasilitas: data.ppdb_fasilitas || [],
        ppdb_ekstrakurikuler: data.ppdb_ekstrakurikuler || [],
        ppdb_kontak: data.ppdb_kontak || [],
      });
    } catch (err) {
      toastError('Gagal memuat pengaturan', err?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    const next = [...formData[field]];
    next[index] = value;
    setFormData(prev => ({ ...prev, [field]: next }));
  };

  const handleAddArrayItem = (field, emptyItem = '') => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], emptyItem] }));
  };

  const handleRemoveArrayItem = (field, index) => {
    const next = formData[field].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [field]: next }));
  };

  // For complex objects like gelombang, promo
  const handleObjectArrayChange = (field, index, subfield, value) => {
    const next = [...formData[field]];
    next[index] = { ...next[index], [subfield]: value };
    setFormData(prev => ({ ...prev, [field]: next }));
  };

  const handleObjectArrayPush = (field, index, subfield, value) => {
    const next = [...formData[field]];
    if (!next[index][subfield]) next[index][subfield] = [];
    next[index][subfield].push(value);
    setFormData(prev => ({ ...prev, [field]: next }));
  };

  const handleObjectArrayRemove = (field, index, subfield, subIndex) => {
    const next = [...formData[field]];
    next[index][subfield] = next[index][subfield].filter((_, i) => i !== subIndex);
    setFormData(prev => ({ ...prev, [field]: next }));
  };
  
  const handleObjectArraySubChange = (field, index, subfield, subIndex, value) => {
    const next = [...formData[field]];
    next[index][subfield][subIndex] = value;
    setFormData(prev => ({ ...prev, [field]: next }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'ppdb_brosur') return; // Don't send string URL back
        if (typeof formData[key] === 'object' && formData[key] !== null) {
          // Send JSON as string
          payload.append(key, JSON.stringify(formData[key]));
        } else {
          payload.append(key, formData[key] || '');
        }
      });

      if (brosurFile) {
        payload.append('ppdb_brosur_file', brosurFile);
      }

      await updateAdminPpdbSettings(payload);
      toastSuccess('Berhasil', 'Pengaturan PPDB disimpan');
      setBrosurFile(null);
      await loadSettings();
    } catch (err) {
      toastError('Gagal menyimpan pengaturan', err?.message);
    } finally {
      setSaving(false);
    }
  };

  const renderUmum = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <label className="form-label">Judul PPDB</label>
        <input name="ppdb_judul" value={formData.ppdb_judul} onChange={handleChange} className="form-control" />
      </div>
      <div>
        <label className="form-label">Tahun Ajaran</label>
        <select name="ppdb_tahun_ajaran" value={formData.ppdb_tahun_ajaran} onChange={handleChange} className="form-control">
          <option value="" disabled>Pilih Tahun Ajaran</option>
          {tahunAjaranOptions.map((ta) => (
            <option key={ta.id} value={ta.tahun_ajaran}>
              {ta.tahun_ajaran} - Semester {ta.semester}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="form-label">Deskripsi Singkat</label>
        <textarea name="ppdb_deskripsi" value={formData.ppdb_deskripsi} onChange={handleChange} className="form-control" rows={4} />
      </div>
      <div>
        <label className="form-label">Alamat Sekolah <span style={{fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 'normal'}}>(Diatur dari Profil Sekolah)</span></label>
        <textarea name="ppdb_alamat" value={formData.ppdb_alamat} className="form-control" rows={2} readOnly disabled style={{ backgroundColor: 'var(--color-bg-subtle)' }} />
      </div>
      <div>
        <label className="form-label">Brosur PPDB (PDF/Gambar)</label>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', marginTop: '0.5rem' }}>
          <div style={{ flex: 1 }}>
            <label 
              htmlFor="upload-brosur" 
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '2.5rem 2rem', border: '2px dashed var(--color-border)', borderRadius: '12px',
                backgroundColor: 'var(--color-bg-subtle)', cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.backgroundColor = 'var(--color-primary-soft)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.backgroundColor = 'var(--color-bg-subtle)'; }}
            >
              <UploadCloud size={36} color="var(--color-primary)" style={{ marginBottom: '0.75rem' }} />
              <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-dark)', textAlign: 'center' }}>
                {brosurFile ? brosurFile.name : 'Pilih File atau Tarik ke Sini'}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                Maksimal ukuran file: 5MB (PDF, JPG, PNG)
              </span>
            </label>
            <input 
              id="upload-brosur"
              type="file" 
              accept=".pdf,image/*" 
              onChange={e => setBrosurFile(e.target.files[0])} 
              style={{ display: 'none' }}
            />
          </div>
          
          {formData.ppdb_brosur && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '220px' }}>
              <div style={{ width: '100%', maxWidth: '300px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--color-border)', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem' }}>
                <img 
                  src={resolveStorageUrl(formData.ppdb_brosur)} 
                  alt="Preview Brosur" 
                  style={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'contain', borderRadius: '8px', cursor: 'zoom-in' }}
                  onClick={() => setPreviewImage(resolveStorageUrl(formData.ppdb_brosur))}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <button 
                type="button"
                onClick={() => setPreviewImage(resolveStorageUrl(formData.ppdb_brosur))}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  padding: '0.85rem 1.5rem', borderRadius: '12px', backgroundColor: '#f8fafc',
                  border: '1px solid var(--color-border)', color: 'var(--color-primary)',
                  fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s', width: '100%', cursor: 'pointer'
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-primary)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.color = 'var(--color-primary)'; }}
              >
                <FileText size={18} /> Buka Gambar Penuh
              </button>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                * Brosur sudah diunggah sebelumnya
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderList = (field, label, placeholder) => (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{label}</h3>
        <button type="button" onClick={() => handleAddArrayItem(field, '')} className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
          <Plus size={16} /> Tambah
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {formData[field].map((item, index) => (
          <div key={index} style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              value={item} 
              onChange={e => handleArrayChange(field, index, e.target.value)} 
              className="form-control" 
              placeholder={placeholder}
            />
            <button type="button" onClick={() => handleRemoveArrayItem(field, index)} className="btn-outline" style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger-soft)' }}>
              <X size={18} />
            </button>
          </div>
        ))}
        {formData[field].length === 0 && <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>Belum ada data</p>}
      </div>
    </div>
  );

  const renderGelombang = () => (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Gelombang Pendaftaran</h3>
        <button type="button" onClick={() => handleAddArrayItem('ppdb_gelombang', { id: `gelombang-${Date.now()}`, judul: '', periode: '', badge: '', keuntungan: [] })} className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
          <Plus size={16} /> Tambah Gelombang
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {formData.ppdb_gelombang.map((gel, idx) => (
          <div key={idx} style={{ padding: '1.5rem', border: '1px solid var(--color-border)', borderRadius: '12px', background: '#f8fafc' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <button type="button" onClick={() => handleRemoveArrayItem('ppdb_gelombang', idx)} style={{ color: 'var(--color-danger)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.85rem' }}>
                <X size={16} /> Hapus
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className="form-label">Nama Gelombang</label>
                <input value={gel.judul} onChange={e => handleObjectArrayChange('ppdb_gelombang', idx, 'judul', e.target.value)} className="form-control" placeholder="Contoh: Gelombang 1" />
              </div>
              <div>
                <label className="form-label">Periode</label>
                <input value={gel.periode} onChange={e => handleObjectArrayChange('ppdb_gelombang', idx, 'periode', e.target.value)} className="form-control" placeholder="Contoh: Januari - Maret 2026" />
              </div>
              <div>
                <label className="form-label">Status (Badge)</label>
                <input value={gel.badge} onChange={e => handleObjectArrayChange('ppdb_gelombang', idx, 'badge', e.target.value)} className="form-control" placeholder="Contoh: Dibuka / Segera" />
              </div>
            </div>
            <div>
              <label className="form-label">Keuntungan</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
                {(gel.keuntungan || []).map((ktg, kIdx) => (
                  <div key={kIdx} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input value={ktg} onChange={e => handleObjectArraySubChange('ppdb_gelombang', idx, 'keuntungan', kIdx, e.target.value)} className="form-control" style={{ fontSize: '0.85rem' }} />
                    <button type="button" onClick={() => handleObjectArrayRemove('ppdb_gelombang', idx, 'keuntungan', kIdx)} className="btn-outline" style={{ padding: '0.3rem', color: 'var(--color-danger)' }}><X size={14} /></button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => handleObjectArrayPush('ppdb_gelombang', idx, 'keuntungan', '')} className="btn-outline" style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}>+ Tambah Keuntungan</button>
            </div>
          </div>
        ))}
        {formData.ppdb_gelombang.length === 0 && <p style={{ color: 'var(--color-text-muted)' }}>Belum ada gelombang</p>}
      </div>
    </div>
  );

  const renderPromo = () => (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Promo Khusus</h3>
        <button type="button" onClick={() => handleAddArrayItem('ppdb_promo', { judul: '', deskripsi: '', ikon: 'gift' })} className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
          <Plus size={16} /> Tambah Promo
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {formData.ppdb_promo.map((promo, idx) => (
          <div key={idx} style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
              <button type="button" onClick={() => handleRemoveArrayItem('ppdb_promo', idx)} style={{ color: 'var(--color-danger)', background: 'none', border: 'none', cursor: 'pointer' }}><X size={16}/></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input value={promo.judul} onChange={e => handleObjectArrayChange('ppdb_promo', idx, 'judul', e.target.value)} className="form-control" placeholder="Judul Promo" />
              <textarea value={promo.deskripsi} onChange={e => handleObjectArrayChange('ppdb_promo', idx, 'deskripsi', e.target.value)} className="form-control" placeholder="Deskripsi" rows={2} />
              <input value={promo.ikon} onChange={e => handleObjectArrayChange('ppdb_promo', idx, 'ikon', e.target.value)} className="form-control" placeholder="Ikon (gift, heart, dll)" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFasilitasEkstra = () => (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Fasilitas</h3>
          <button type="button" onClick={() => handleAddArrayItem('ppdb_fasilitas', { nama: '', ikon: 'building' })} className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
            <Plus size={16} /> Tambah Fasilitas
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {formData.ppdb_fasilitas.map((f, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
              <input value={f.nama} onChange={e => handleObjectArrayChange('ppdb_fasilitas', idx, 'nama', e.target.value)} className="form-control" placeholder="Nama Fasilitas" />
              <button type="button" onClick={() => handleRemoveArrayItem('ppdb_fasilitas', idx)} className="btn-outline" style={{ color: 'var(--color-danger)' }}><X size={16}/></button>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Ekstrakurikuler</h3>
          <button type="button" onClick={() => handleAddArrayItem('ppdb_ekstrakurikuler', { nama: '', ikon: 'users' })} className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
            <Plus size={16} /> Tambah Ekstrakurikuler
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {formData.ppdb_ekstrakurikuler.map((f, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
              <input value={f.nama} onChange={e => handleObjectArrayChange('ppdb_ekstrakurikuler', idx, 'nama', e.target.value)} className="form-control" placeholder="Ekstrakurikuler" />
              <button type="button" onClick={() => handleRemoveArrayItem('ppdb_ekstrakurikuler', idx)} className="btn-outline" style={{ color: 'var(--color-danger)' }}><X size={16}/></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderKontak = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Kontak Panitia</h3>
        <button type="button" onClick={() => handleAddArrayItem('ppdb_kontak', { nama: '', telepon: [] })} className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
          <Plus size={16} /> Tambah Kontak
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {formData.ppdb_kontak.map((k, idx) => (
          <div key={idx} style={{ padding: '1.5rem', border: '1px solid var(--color-border)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <input value={k.nama} onChange={e => handleObjectArrayChange('ppdb_kontak', idx, 'nama', e.target.value)} className="form-control" placeholder="Nama Panitia" style={{ width: '300px' }} />
              <button type="button" onClick={() => handleRemoveArrayItem('ppdb_kontak', idx)} style={{ color: 'var(--color-danger)', background: 'none', border: 'none', cursor: 'pointer' }}><X size={16}/></button>
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Nomor Telepon/WA</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                {(k.telepon || []).map((tel, tIdx) => (
                  <div key={tIdx} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input value={tel} onChange={e => handleObjectArraySubChange('ppdb_kontak', idx, 'telepon', tIdx, e.target.value)} className="form-control" style={{ width: '250px' }} />
                    <button type="button" onClick={() => handleObjectArrayRemove('ppdb_kontak', idx, 'telepon', tIdx)} className="btn-outline" style={{ padding: '0.4rem', color: 'var(--color-danger)' }}><X size={14}/></button>
                  </div>
                ))}
                <button type="button" onClick={() => handleObjectArrayPush('ppdb_kontak', idx, 'telepon', '')} className="btn-outline" style={{ alignSelf: 'flex-start', padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>+ Nomor</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <AdminPageShell>
      <div className="admin-page-wrapper animate-fade-in" style={{ paddingTop: '1rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <PageHeader 
          title={
            <div style={{ display: 'flex', overflowX: 'auto', gap: '0.5rem', marginTop: '0.25rem' }}>
              {[
                { id: 'umum', label: 'Umum & Brosur', icon: FileText },
                { id: 'syarat', label: 'Syarat & Alur', icon: CheckCircle },
                { id: 'promo', label: 'Gelombang & Promo', icon: Percent },
                { id: 'fasilitas', label: 'Fasilitas', icon: Building },
                { id: 'kontak', label: 'Kontak', icon: MapPin },
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
                    borderBottom: activeTab === tab.id ? '2px solid var(--color-primary)' : '2px solid transparent',
                    color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    fontWeight: activeTab === tab.id ? 700 : 600,
                    background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', cursor: 'pointer',
                    fontSize: '0.95rem'
                  }}
                >
                  <tab.icon size={18} /> {tab.label}
                </button>
              ))}
            </div>
          }
        >
          <button type="button" onClick={handleSave} disabled={saving || loading} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Save size={18} /> {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </PageHeader>

        {loading ? (
          <div style={{ padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', flex: 1 }}>
            <div className="animate-spin" style={{ width: '40px', height: '40px', border: '3px solid var(--color-border)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', marginBottom: '1rem' }} />
            <p style={{ color: 'var(--color-text-muted)', fontWeight: 500, fontSize: '1.1rem' }}>Memuat data pengaturan...</p>
          </div>
        ) : (
        <div style={{ padding: '2rem', background: '#fff', borderRadius: '12px', border: '1px solid var(--color-border)', flex: 1 }}>
          {activeTab === 'umum' && renderUmum()}
          {activeTab === 'syarat' && (
            <>
              {renderList('ppdb_persyaratan', 'Persyaratan Pendaftaran', 'Contoh: Mengisi formulir online...')}
              <hr style={{ margin: '2rem 0', borderColor: 'var(--color-border)' }} />
              {renderList('ppdb_alur', 'Alur Pendaftaran', 'Contoh: 1. Buat Akun Calon Murid')}
            </>
          )}
          {activeTab === 'promo' && (
            <>
              {renderGelombang()}
              <hr style={{ margin: '2rem 0', borderColor: 'var(--color-border)' }} />
              {renderPromo()}
            </>
          )}
          {activeTab === 'fasilitas' && renderFasilitasEkstra()}
          {activeTab === 'kontak' && renderKontak()}
        </div>
        )}
      </div>

      {previewImage && (
        <div 
          style={{
            position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
          }}
          onClick={() => setPreviewImage(null)}
        >
          <button 
            type="button"
            onClick={() => setPreviewImage(null)}
            style={{
              position: 'absolute', top: '20px', right: '20px',
              background: 'white', color: 'black', border: 'none', borderRadius: '50%',
              width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', zIndex: 10000, boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            <X size={24} />
          </button>
          <img 
            src={previewImage} 
            alt="Brosur Penuh" 
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
            onClick={e => e.stopPropagation()} 
          />
        </div>
      )}
    </AdminPageShell>
  );
}
