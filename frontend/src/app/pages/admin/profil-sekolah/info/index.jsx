import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getProfilSekolah, updateProfilSekolah } from '@app/shared/services/profilSekolah.service';

export default function InfoProfilPage({ readOnly = false }) {
  const [formData, setFormData] = useState({
    nama_sekolah: '',
    npsn: '',
    akreditasi: '',
    hero_subtitle: '',
    tentang_kami: '',
    alamat: '',
    kata_sambutan: '',
    nama_kepsek: '',
    foto_kepsek: null,
    no_hp: '',
    visi: '',
    misi: ''
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfil();
  }, []);

  const fetchProfil = async () => {
    try {
      setLoading(true);
      const response = await getProfilSekolah();
      if (response?.data) {
        setFormData(response.data);
      }
    } catch (error) {
      console.error('Gagal mengambil profil:', error);
      Swal.fire('Error', 'Gagal memuat data profil sekolah', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, foto_kepsek: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateProfilSekolah(formData);
      Swal.fire('Berhasil', 'Data berhasil disimpan', 'success');
      setIsEditing(false);
    } catch (error) {
      console.error('Gagal memperbarui profil:', error);
      Swal.fire('Error', 'Gagal menyimpan perubahan', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original data
    fetchProfil();
    setPreviewImage(null);
    setIsEditing(false);
  };

  if (loading) {
    return <div style={{ padding: '4rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>Memuat data profil...</div>;
  }

  // --- VIEW MODE ---
  if (!isEditing) {
    return (
      <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Informasi Profil Sekolah</h2>
          {!readOnly && (
            <button
              onClick={() => setIsEditing(true)}
              style={{
                padding: '0.5rem 1.5rem',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Edit Profil
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {formData.foto_kepsek && typeof formData.foto_kepsek === 'string' && (
            <div style={{ marginBottom: '0.5rem' }}>
              <p style={{ fontWeight: 'bold', color: '#64748b', marginBottom: '0.5rem' }}>Foto Kepala Sekolah</p>
              <img 
                src={`http://localhost:8000/storage/${formData.foto_kepsek}`} 
                alt="Foto Kepala Sekolah" 
                style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #e2e8f0' }} 
              />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <p style={{ fontWeight: 'bold', color: '#64748b', marginBottom: '0.25rem' }}>Nama Sekolah</p>
              <p style={{ fontSize: '1.1rem' }}>{formData.nama_sekolah || '-'}</p>
            </div>
            <div>
              <p style={{ fontWeight: 'bold', color: '#64748b', marginBottom: '0.25rem' }}>Slogan / Subtitle Singkat</p>
              <p style={{ fontSize: '1.1rem' }}>{formData.hero_subtitle || '-'}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <p style={{ fontWeight: 'bold', color: '#64748b', marginBottom: '0.25rem' }}>NPSN</p>
              <p style={{ fontSize: '1.1rem' }}>{formData.npsn || '-'}</p>
            </div>
            <div>
              <p style={{ fontWeight: 'bold', color: '#64748b', marginBottom: '0.25rem' }}>Akreditasi</p>
              <p style={{ fontSize: '1.1rem' }}>{formData.akreditasi || '-'}</p>
            </div>
          </div>

          <div>
            <p style={{ fontWeight: 'bold', color: '#64748b', marginBottom: '0.25rem' }}>Tentang Kami</p>
            <p style={{ fontSize: '1rem', whiteSpace: 'pre-line' }}>{formData.tentang_kami || '-'}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <p style={{ fontWeight: 'bold', color: '#64748b', marginBottom: '0.25rem' }}>Visi</p>
              <p style={{ fontSize: '1rem', whiteSpace: 'pre-line' }}>{formData.visi || '-'}</p>
            </div>
            <div>
              <p style={{ fontWeight: 'bold', color: '#64748b', marginBottom: '0.25rem' }}>Misi</p>
              <p style={{ fontSize: '1rem', whiteSpace: 'pre-line' }}>{formData.misi || '-'}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <p style={{ fontWeight: 'bold', color: '#64748b', marginBottom: '0.25rem' }}>Nama Kepala Sekolah</p>
              <p style={{ fontSize: '1rem' }}>{formData.nama_kepsek || '-'}</p>
            </div>
            <div>
              <p style={{ fontWeight: 'bold', color: '#64748b', marginBottom: '0.25rem' }}>No HP / Telepon</p>
              <p style={{ fontSize: '1rem' }}>{formData.no_hp || '-'}</p>
            </div>
          </div>

          <div>
            <p style={{ fontWeight: 'bold', color: '#64748b', marginBottom: '0.25rem' }}>Alamat Lengkap</p>
            <p style={{ fontSize: '1rem', whiteSpace: 'pre-line' }}>{formData.alamat || '-'}</p>
          </div>

          <div>
            <p style={{ fontWeight: 'bold', color: '#64748b', marginBottom: '0.25rem' }}>Kata Sambutan Kepala Sekolah</p>
            <p style={{ fontSize: '1rem', whiteSpace: 'pre-line' }}>{formData.kata_sambutan || '-'}</p>
          </div>
        </div>
      </div>
    );
  }

  // --- EDIT MODE ---
  return (
    <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Edit Profil Sekolah</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Nama Sekolah</label>
            <input
              type="text"
              name="nama_sekolah"
              value={formData.nama_sekolah || ''}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              placeholder="Contoh: MAS Aisyiyah Medan"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Slogan / Subtitle Singkat</label>
            <input
              type="text"
              name="hero_subtitle"
              value={formData.hero_subtitle || ''}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              placeholder="Contoh: Sekolah Berbasis Islam Modern"
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>NPSN</label>
            <input
              type="text"
              name="npsn"
              value={formData.npsn || ''}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              placeholder="Contoh: 12345678"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Akreditasi</label>
            <select
              name="akreditasi"
              value={formData.akreditasi || ''}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff' }}
            >
              <option value="">Pilih Akreditasi</option>
              <option value="A">A (Unggul)</option>
              <option value="B">B (Baik Sekali)</option>
              <option value="C">C (Baik)</option>
              <option value="TT">Tidak Terakreditasi</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Tentang Kami</label>
          <textarea
            name="tentang_kami"
            value={formData.tentang_kami || ''}
            onChange={handleChange}
            rows="3"
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            placeholder="Deskripsi singkat tentang sekolah"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Visi</label>
            <textarea
              name="visi"
              value={formData.visi || ''}
              onChange={handleChange}
              rows="4"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Misi</label>
            <textarea
              name="misi"
              value={formData.misi || ''}
              onChange={handleChange}
              rows="4"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Nama Kepala Sekolah</label>
            <input
              type="text"
              name="nama_kepsek"
              value={formData.nama_kepsek || ''}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Nomor HP</label>
            <input
              type="text"
              name="no_hp"
              value={formData.no_hp || ''}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              placeholder="Contoh: 08123456789"
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Foto Kepala Sekolah (Opsional)</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc' }} 
          />
          {(previewImage || (formData.foto_kepsek && typeof formData.foto_kepsek === 'string')) && (
            <div style={{ marginTop: '1rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Preview:</p>
              <img 
                src={previewImage || `http://localhost:8000/storage/${formData.foto_kepsek}`} 
                alt="Preview Foto" 
                style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #e2e8f0' }} 
              />
            </div>
          )}
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Alamat Lengkap</label>
          <textarea
            name="alamat"
            value={formData.alamat || ''}
            onChange={handleChange}
            rows="2"
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Kata Sambutan Kepala Sekolah</label>
          <textarea
            name="kata_sambutan"
            value={formData.kata_sambutan || ''}
            onChange={handleChange}
            rows="4"
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#e2e8f0',
              color: '#475569',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: saving ? 'not-allowed' : 'pointer',
            }}
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1
            }}
          >
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>

      </form>
    </div>
  );
}
