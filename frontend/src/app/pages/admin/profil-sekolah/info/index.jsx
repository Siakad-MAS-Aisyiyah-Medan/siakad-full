import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Camera,
  Image as ImageIcon,
  MapPin,
  Phone,
  Save,
  X,
  Building,
  UserCircle2,
  BookOpen,
  Target,
  Edit,
  Share2,
  Mail
} from 'lucide-react';
import { getProfilSekolah, updateProfilSekolah } from '@app/shared/services/profilSekolah.service';
import { toastError, toastSuccess, toastValidation } from '@app/shared/hooks/useConfirm';
import { apiConfig } from '@/config/api.config';

function ViewField({ label, value, multiline = false, icon: Icon }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
      {Icon && (
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--color-primary-soft)', color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.2rem' }}>
          <Icon size={20} />
        </div>
      )}
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
        <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--color-text-dark)', whiteSpace: multiline ? 'pre-line' : 'normal', fontWeight: 500 }}>
          {value || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Belum ada data</span>}
        </p>
      </div>
    </div>
  );
}

function FormLabel({ children, required = false }) {
  return (
    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '0.4rem' }}>
      {children} {required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
    </label>
  );
}

function resolveStorageUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  const baseUrl = new URL(apiConfig.baseURL);
  const origin = `${baseUrl.protocol}//${baseUrl.host}`;
  return `${origin}${path.startsWith('/storage/') ? path : `/storage/${path}`}`;
}

import PageHeader from '@app/shared/components/PageHeader';

export default function InfoProfilPage({ readOnly = false }) {
  const [formData, setFormData] = useState({
    nama_sekolah: '',
    hero_subtitle: '',
    tentang_kami: '',
    alamat: '',
    kata_sambutan: '',
    nama_kepsek: '',
    foto_kepsek: null,
    no_hp: '',
    email: '',
    visi: '',
    misi: '',
    instagram: '',
    facebook: '',
    youtube: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [schoolImagePreview, setSchoolImagePreview] = useState(null);
  const [principalImagePreview, setPrincipalImagePreview] = useState(null);

  useEffect(() => {
    const fetchProfil = async () => {
      setLoading(true);
      try {
        const response = await getProfilSekolah();
        if (response?.data) {
          setFormData((prev) => ({ ...prev, ...response.data }));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfil();
  }, []);

  const principalImageUrl = useMemo(() => {
    if (principalImagePreview) return principalImagePreview;
    if (typeof formData.foto_kepsek === 'string' && formData.foto_kepsek) {
      return resolveStorageUrl(formData.foto_kepsek);
    }
    return null;
  }, [formData.foto_kepsek, principalImagePreview]);

  const schoolImageUrl = useMemo(() => {
    if (schoolImagePreview) return schoolImagePreview;
    if (typeof formData.hero_image === 'string' && formData.hero_image) {
      return resolveStorageUrl(formData.hero_image);
    }
    return null; 
  }, [formData.hero_image, schoolImagePreview]);

  const misiList = useMemo(() => {
    if (Array.isArray(formData.misi)) return formData.misi;
    return String(formData.misi || '')
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
  }, [formData.misi]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrincipalPhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, foto_kepsek: file }));
    setPrincipalImagePreview(URL.createObjectURL(file));
  };

  const handleSchoolPhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, hero_image: file }));
    setSchoolImagePreview(URL.createObjectURL(file));
  };

  const handleMisiChange = (index, value) => {
    const next = [...misiList];
    next[index] = value;
    setFormData((prev) => ({ ...prev, misi: next.join('\n') }));
  };

  const handleAddMisi = () => {
    setFormData((prev) => ({
      ...prev,
      misi: [...misiList, ''].join('\n'),
    }));
  };

  const handleRemoveMisi = (index) => {
    const next = misiList.filter((_, itemIndex) => itemIndex !== index);
    setFormData((prev) => ({ ...prev, misi: next.join('\n') }));
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setPrincipalImagePreview(null);
    setSchoolImagePreview(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.nama_sekolah?.trim() || !formData.nama_kepsek?.trim()) {
      toastValidation('Periksa Kembali', 'Nama sekolah dan nama kepala sekolah wajib diisi.');
      return;
    }

    setSaving(true);
    try {
      await updateProfilSekolah({
        ...formData,
        misi: misiList.filter(Boolean).join('\n'),
      });
      toastSuccess('Berhasil', 'Profil sekolah berhasil diperbarui.');
      setIsEditing(false);
      setPrincipalImagePreview(null);
      setSchoolImagePreview(null);
    } catch (error) {
      toastError('Gagal', error?.response?.data?.message || 'Profil sekolah gagal diperbarui.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page-wrapper animate-fade-in" style={{ paddingTop: '1rem' }}>
      <PageHeader 
        title={isEditing ? 'Edit Profil Sekolah' : 'Kelola Profil Sekolah'}
        subtitle={isEditing ? 'Ubah informasi, foto, dan deskripsi sekolah.' : 'Kelola informasi profil sekolah, kontak, dan sambutan.'}
      >
        {!loading && (
          isEditing ? (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="btn-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#fff' }}
            >
              <ArrowLeft size={16} /> Kembali
            </button>
          ) : (
            !readOnly && (
              <button 
                type="button" 
                onClick={() => setIsEditing(true)} 
                className="btn-primary" 
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Edit size={16} /> Edit Data
              </button>
            )
          )
        )}
      </PageHeader>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: 'var(--color-text-muted)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div className="animate-spin" style={{ width: '40px', height: '40px', border: '3px solid var(--color-primary-light)', borderTopColor: 'var(--color-primary)', borderRadius: '50%' }} />
            <p>Memuat profil sekolah...</p>
          </div>
        </div>
      ) : isEditing ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Edit Box 1: School Name & Description */}
            <div className="form-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'row', gap: '2.5rem', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flexShrink: 0 }}>
                <div style={{ width: '220px', height: '220px', background: '#f8fafc', borderRadius: '16px', border: '2px dashed #cbd5e1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', position: 'relative', overflow: 'hidden' }}>
                  {schoolImageUrl ? (
                    <img src={schoolImageUrl} alt="Profil Sekolah" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <>
                      <ImageIcon size={48} style={{ color: '#94a3b8', marginBottom: '0.5rem' }} />
                      <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 500 }}>Belum ada foto</p>
                    </>
                  )}
                  <div style={{ position: 'absolute', bottom: '1rem' }}>
                    <label style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '50px', background: '#fff', color: 'var(--color-primary-dark)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                      <Camera size={16} /> Ubah Foto
                      <input type="file" accept="image/*" onChange={handleSchoolPhotoChange} style={{ display: 'none' }} />
                    </label>
                  </div>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingTop: '0.5rem' }}>
                <div>
                  <FormLabel required>Nama Sekolah</FormLabel>
                  <input name="nama_sekolah" value={formData.nama_sekolah || ''} onChange={handleChange} className="form-control" placeholder="Masukkan nama sekolah" required />
                </div>
                <div>
                  <FormLabel required>Deskripsi Singkat / Tentang Kami</FormLabel>
                  <textarea 
                    name="tentang_kami" 
                    value={formData.tentang_kami || formData.hero_subtitle || ''} 
                    onChange={(event) => setFormData((prev) => ({ ...prev, tentang_kami: event.target.value, hero_subtitle: event.target.value.slice(0, 255) }))} 
                    className="form-control" 
                    rows={5} 
                    placeholder="Masukkan deskripsi singkat tentang sekolah..." 
                    required 
                  />
                  <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>
                    {(formData.tentang_kami || formData.hero_subtitle || '').length} karakter
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Box 2: Sambutan & Kepala Sekolah */}
            <div className="form-panel" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem' }}>
              <div>
                <FormLabel required>Kata Sambutan Kepala Sekolah</FormLabel>
                <textarea 
                  name="kata_sambutan" 
                  value={formData.kata_sambutan || ''} 
                  onChange={handleChange} 
                  className="form-control" 
                  rows={6} 
                  placeholder="Tuliskan kata sambutan kepala sekolah..." 
                  required 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <FormLabel required>Nama Kepala Sekolah</FormLabel>
                  <input name="nama_kepsek" value={formData.nama_kepsek || ''} onChange={handleChange} className="form-control" placeholder="Masukkan nama kepala sekolah beserta gelar" required />
                </div>
                <div>
                  <FormLabel>Foto Kepala Sekolah</FormLabel>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f1f5f9', border: '2px dashed #cbd5e1', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {principalImageUrl ? (
                        <img src={principalImageUrl} alt="Kepala Sekolah" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <UserCircle2 size={32} color="#94a3b8" />
                      )}
                    </div>
                    <div>
                      <label className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '0.5rem' }}>
                        <Camera size={16} /> Upload Foto
                        <input type="file" accept="image/*" onChange={handlePrincipalPhotoChange} style={{ display: 'none' }} />
                      </label>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>Format: JPG/PNG. Maks 2MB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Box 3 & 4: Visi & Misi */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-panel" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Target size={18} /> Visi Sekolah
                </h3>
                <textarea name="visi" value={formData.visi || ''} onChange={handleChange} className="form-control" rows={6} placeholder="Tuliskan visi sekolah..." />
              </div>
              <div className="form-panel" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={18} /> Misi Sekolah
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {misiList.map((misi, index) => (
                    <div key={index} style={{ display: 'flex', gap: '0.5rem' }}>
                      <textarea value={misi} onChange={(e) => handleMisiChange(index, e.target.value)} className="form-control" rows={2} style={{ flex: 1, resize: 'vertical' }} placeholder={`Misi ${index + 1}`} />
                      <button type="button" onClick={() => handleRemoveMisi(index)} style={{ padding: '0.5rem', color: 'var(--color-danger)', background: 'transparent', border: '1px solid var(--color-danger-soft)', borderRadius: '8px', cursor: 'pointer', alignSelf: 'flex-start' }} title="Hapus Misi">
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={handleAddMisi} className="btn-outline" style={{ width: '100%', padding: '0.75rem', borderStyle: 'dashed' }}>
                    + Tambah Misi
                  </button>
                </div>
              </div>
            </div>

            {/* Edit Box 5: Kontak */}
            <div className="form-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={18} /> Informasi Kontak Sekolah
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem' }}>
                <div>
                  <FormLabel required>Alamat Lengkap</FormLabel>
                  <textarea name="alamat" value={formData.alamat || ''} onChange={handleChange} className="form-control" rows={3} placeholder="Masukkan alamat lengkap sekolah..." required />
                </div>
                <div>
                  <FormLabel required>Nomor Telepon / HP</FormLabel>
                  <input name="no_hp" value={formData.no_hp || ''} onChange={handleChange} className="form-control" placeholder="Contoh: 081234567890" required />
                </div>
                <div>
                  <FormLabel required>Email Sekolah</FormLabel>
                  <input name="email" type="email" value={formData.email || ''} onChange={handleChange} className="form-control" placeholder="Contoh: info@sekolah.sch.id" required />
                </div>
              </div>
            </div>

            {/* Edit Box 6: Social Media */}
            <div className="form-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Share2 size={18} /> Media Sosial
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem' }}>
                <div>
                  <FormLabel>Instagram</FormLabel>
                  <input name="instagram" value={formData.instagram || ''} onChange={handleChange} className="form-control" placeholder="https://instagram.com/..." />
                </div>
                <div>
                  <FormLabel>Facebook</FormLabel>
                  <input name="facebook" value={formData.facebook || ''} onChange={handleChange} className="form-control" placeholder="https://facebook.com/..." />
                </div>
                <div>
                  <FormLabel>YouTube</FormLabel>
                  <input name="youtube" value={formData.youtube || ''} onChange={handleChange} className="form-control" placeholder="https://youtube.com/..." />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <button type="button" onClick={handleCancelEdit} className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem' }}>
                <X size={18} /> Batal
              </button>
              <button type="submit" disabled={saving} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem', opacity: saving ? 0.7 : 1 }}>
                <Save size={18} /> {saving ? 'Menyimpan...' : 'Simpan Profil'}
              </button>
            </div>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Box 1: School Name & Description */}
            <div className="form-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'row', gap: '2.5rem', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flexShrink: 0 }}>
                <div style={{ width: '220px', height: '220px', background: '#f8fafc', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', position: 'relative', overflow: 'hidden', border: '1px solid #f1f5f9', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                  {schoolImageUrl ? (
                    <img src={schoolImageUrl} alt="Profil Sekolah" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <>
                      <div style={{ position: 'absolute', width: '100%', height: '100%', border: '1px dashed #cbd5e1', transform: 'rotate(45deg) scale(1.5)' }} />
                      <div style={{ position: 'absolute', width: '100%', height: '100%', border: '1px dashed #cbd5e1', transform: 'rotate(-45deg) scale(1.5)' }} />
                    </>
                  )}
                </div>
                {!isEditing && !readOnly && (
                  <button type="button" onClick={() => setIsEditing(true)} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.6rem', borderRadius: '8px', background: '#f1f5f9', color: '#475569', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', border: 'none', margin: '0 auto', width: '100%', transition: 'background 0.2s' }}>
                    <Camera size={16} /> Ubah Foto
                  </button>
                )}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem', paddingTop: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Nama Sekolah</h3>
                  <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-dark)', margin: 0, letterSpacing: '-0.02em' }}>{formData.nama_sekolah || 'Belum Diatur'}</p>
                </div>
                <div>
                  <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Deskripsi Sekolah</h3>
                  <p style={{ fontSize: '1.05rem', color: '#334155', lineHeight: 1.8, whiteSpace: 'pre-line', margin: 0 }}>{formData.tentang_kami || formData.hero_subtitle || 'Belum ada deskripsi sekolah.'}</p>
                </div>
              </div>
            </div>

            {/* Box 2: Sambutan & Kepala Sekolah */}
            <div className="form-panel" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem' }}>
              <div>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Kata Sambutan Kepala Sekolah</h3>
                <p style={{ fontSize: '1.05rem', color: '#334155', lineHeight: 1.8, whiteSpace: 'pre-line', fontStyle: 'italic', margin: 0 }}>
                  "{formData.kata_sambutan || 'Belum ada kata sambutan.'}"
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Kepala Sekolah</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#f1f5f9', border: '2px solid #fff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {principalImageUrl ? (
                      <img src={principalImageUrl} alt="Kepala Sekolah" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <UserCircle2 size={32} color="#94a3b8" />
                    )}
                  </div>
                  <div>
                    <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-dark)', margin: 0 }}>{formData.nama_kepsek || 'Belum diatur'}</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: 600, margin: 0 }}>Kepala Sekolah</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Box 3 & 4: Visi & Misi */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-panel" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Visi Sekolah</h3>
                <p style={{ fontSize: '1.05rem', color: '#334155', lineHeight: 1.8, whiteSpace: 'pre-line', margin: 0 }}>{formData.visi || 'Belum ada visi.'}</p>
              </div>
              <div className="form-panel" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Misi Sekolah</h3>
                {misiList.length > 0 ? (
                  <ul style={{ paddingLeft: '1.2rem', margin: 0, color: '#334155', fontSize: '1.05rem', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {misiList.map((misi, index) => (
                      <li key={index} style={{ listStyleType: 'disc' }}>{misi}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: '#94a3b8', margin: 0 }}>Belum ada misi.</p>
                )}
              </div>
            </div>

            {/* Box 5: Kontak */}
            <div className="form-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>Informasi Kontak Sekolah</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--color-primary-soft)', color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Alamat Sekolah</h4>
                    <p style={{ fontSize: '1.05rem', fontWeight: 500, color: 'var(--color-text-dark)', lineHeight: 1.6, margin: 0 }}>{formData.alamat || 'Belum diatur'}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--color-primary-soft)', color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>No HP Sekolah</h4>
                    <p style={{ fontSize: '1.05rem', fontWeight: 500, color: 'var(--color-text-dark)', margin: 0 }}>{formData.no_hp || 'Belum diatur'}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--color-primary-soft)', color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Email Sekolah</h4>
                    <p style={{ fontSize: '1.05rem', fontWeight: 500, color: 'var(--color-text-dark)', margin: 0 }}>{formData.email || 'Belum diatur'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Box 6: Social Media */}
            <div className="form-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>Media Sosial</h3>
              <div style={{ display: 'flex', gap: '3rem' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--color-primary-soft)', color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Share2 size={20} />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Instagram</h4>
                      {formData.instagram ? (
                        <a href={formData.instagram} target="_blank" rel="noreferrer" style={{ fontSize: '1.05rem', fontWeight: 500, color: 'var(--color-primary)', textDecoration: 'none' }}>{formData.instagram}</a>
                      ) : (
                        <p style={{ fontSize: '1.05rem', fontWeight: 500, color: 'var(--color-text-dark)', margin: 0 }}>Belum diatur</p>
                      )}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Facebook</h4>
                      {formData.facebook ? (
                        <a href={formData.facebook} target="_blank" rel="noreferrer" style={{ fontSize: '1.05rem', fontWeight: 500, color: 'var(--color-primary)', textDecoration: 'none' }}>{formData.facebook}</a>
                      ) : (
                        <p style={{ fontSize: '1.05rem', fontWeight: 500, color: 'var(--color-text-dark)', margin: 0 }}>Belum diatur</p>
                      )}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>YouTube</h4>
                      {formData.youtube ? (
                        <a href={formData.youtube} target="_blank" rel="noreferrer" style={{ fontSize: '1.05rem', fontWeight: 500, color: 'var(--color-primary)', textDecoration: 'none' }}>{formData.youtube}</a>
                      ) : (
                        <p style={{ fontSize: '1.05rem', fontWeight: 500, color: 'var(--color-text-dark)', margin: 0 }}>Belum diatur</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}
