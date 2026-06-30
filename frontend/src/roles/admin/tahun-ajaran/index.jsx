import { useCallback, useEffect, useState } from 'react';
import AdminPageShell from '@/shared/components/AdminPageShell';
import PageHeader from '@/shared/components/PageHeader';
import { ArrowLeft, Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import {
  createTahunAjaran,
  deleteTahunAjaran,
  fetchTahunAjaran,
  updateTahunAjaran,
} from '@/shared/services/tahunAjaran.service';
import CustomSelect from '@/shared/components/CustomSelect';

const EMPTY_FORM = {
  tahun_ajaran: '',
  semester: 'Ganjil',
  tanggal_mulai: '',
  tanggal_selesai: '',
  status: 'Tidak Aktif',
};

function withDefaultDates(form) {
  const firstYear = Number(String(form.tahun_ajaran).split('/')[0]) || new Date().getFullYear();
  return {
    ...form,
    semester: form.semester || 'Ganjil',
    status: form.status || 'Tidak Aktif',
    tanggal_mulai: form.tanggal_mulai || `${firstYear}-07-01`,
    tanggal_selesai: form.tanggal_selesai || `${firstYear + 1}-06-30`,
  };
}

function FormLabel({ children, required }) {
  return (
    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '0.4rem' }}>
      {children} {required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
    </label>
  );
}

function TahunAjaranForm({ form, onChange, onClose, onSubmit, saving, mode }) {
  const isAdd = mode === 'add';

  return (
    <AdminPageShell>
      <div className="admin-page-wrapper animate-fade-in" style={{ paddingTop: '1rem' }}>
        <PageHeader 
          title={isAdd ? 'Tambah Tahun Ajaran' : 'Ubah Status Tahun Ajaran'} 
          subtitle={isAdd ? 'Buat tahun ajaran baru untuk sistem' : 'Perbarui status tahun ajaran ini'}
          onBack={onClose}
        />

        <div className="form-panel">
          <form onSubmit={onSubmit}>
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', zIndex: 10 }}>
              {isAdd ? (
                <>
                  <div>
                    <FormLabel required>Tahun Ajaran</FormLabel>
                    <input name="tahun_ajaran" value={form.tahun_ajaran} onChange={onChange} className="form-control" placeholder="Contoh: 2025/2026" required />
                  </div>
                  <div>
                    <FormLabel required>Semester</FormLabel>
                    <CustomSelect
                      value={form.semester}
                      onChange={(val) => onChange({ target: { name: 'semester', value: val } })}
                      options={[
                        { value: 'Ganjil', label: 'Ganjil' },
                        { value: 'Genap', label: 'Genap' }
                      ]}
                    />
                  </div>
                  <div>
                    <FormLabel required>Status</FormLabel>
                    <CustomSelect
                      value={form.status}
                      onChange={(val) => onChange({ target: { name: 'status', value: val } })}
                      options={[
                        { value: 'Aktif', label: 'Aktif' },
                        { value: 'Tidak Aktif', label: 'Tidak Aktif' },
                        { value: 'Selesai', label: 'Selesai' }
                      ]}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <FormLabel>Tahun Ajaran</FormLabel>
                    <input value={`${form.tahun_ajaran} - ${form.semester}`} className="form-control" disabled readOnly />
                  </div>
                  <div>
                    <FormLabel required>Status</FormLabel>
                    <CustomSelect
                      value={form.status}
                      onChange={(val) => onChange({ target: { name: 'status', value: val } })}
                      options={[
                        ...(form.original_status === 'Selesai' ? [] : [{ value: 'Aktif', label: 'Aktif' }]),
                        { value: 'Tidak Aktif', label: 'Nonaktif' },
                        { value: 'Selesai', label: 'Selesai' }
                      ]}
                    />
                  </div>
                </>
              )}
            </div>

            <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', background: 'var(--color-background)', borderRadius: '0 0 16px 16px' }}>
              <button type="submit" disabled={saving} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', opacity: saving ? 0.7 : 1 }}>
                {isAdd ? <Plus size={16} /> : <Save size={16} />}
                {saving ? 'Menyimpan...' : isAdd ? 'Tambahkan' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminPageShell>
  );
}

export default function TahunAjaranPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState(null);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchTahunAjaran();
      setRows(Array.isArray(response) ? response : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setMode('add');
  };

  const openEdit = (row) => {
    setForm({
      tahun_ajaran: row.tahun_ajaran || '',
      semester: row.semester || 'Ganjil',
      tanggal_mulai: row.tanggal_mulai || '',
      tanggal_selesai: row.tanggal_selesai || '',
      status: row.status || 'Tidak Aktif',
      original_status: row.status,
    });
    setEditId(row.id);
    setMode('edit');
  };

  const closeForm = () => {
    setMode(null);
    setEditId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (mode === 'add' && (!form.tahun_ajaran?.trim() || !form.semester?.trim() || !form.status?.trim())) {
      import('@/shared/hooks/useConfirm').then(({ toastValidation }) => {
        toastValidation('Periksa Kembali', 'Semua kolom yang bertanda bintang merah wajib diisi.');
      });
      return;
    }
    setSaving(true);
    try {
      const payload = withDefaultDates(form);
      if (mode === 'add') {
        await createTahunAjaran(payload);
      } else {
        await updateTahunAjaran(editId, payload);
      }
      closeForm();
      await loadData();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteTahunAjaran(id);
    await loadData();
  };

  if (mode) {
    return (
      <TahunAjaranForm
        form={form}
        onChange={handleChange}
        onClose={closeForm}
        onSubmit={handleSubmit}
        saving={saving}
        mode={mode}
      />
    );
  }

  return (
    <AdminPageShell>
      <div className="admin-page-wrapper animate-fade-in" style={{ paddingTop: '1rem' }}>
        <PageHeader title="Tahun Ajaran" subtitle="Kelola tahun ajaran dan semester aktif">
          <button type="button" onClick={openAdd} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={16} />
            Tambah Tahun Ajaran
          </button>
        </PageHeader>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tahun Ajaran</th>
                <th>Semester</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                      <div className="animate-spin" style={{ width: '20px', height: '20px', border: '2px solid var(--color-primary-light)', borderTopColor: 'var(--color-primary)', borderRadius: '50%' }} />
                      Memuat data tahun ajaran...
                    </div>
                  </td>
                </tr>
              ) : rows.length > 0 ? (
                rows.map((row) => (
                  <tr key={row.id}>
                    <td style={{ fontWeight: 600, color: 'var(--color-primary-dark)' }}>{row.tahun_ajaran}</td>
                    <td>{row.semester}</td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '50px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: row.status === 'Aktif' ? 'var(--color-primary-soft)' : row.status === 'Selesai' ? '#f3f4f6' : '#fef2f2',
                        color: row.status === 'Aktif' ? 'var(--color-primary-dark)' : row.status === 'Selesai' ? '#4b5563' : '#991b1b',
                        border: `1px solid ${row.status === 'Aktif' ? 'var(--color-primary-light)' : row.status === 'Selesai' ? '#d1d5db' : '#fecaca'}`,
                      }}>
                        {row.status === 'Tidak Aktif' ? 'Nonaktif' : row.status}
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button type="button" onClick={() => openEdit(row)} className="btn-icon edit" title="Edit">
                          <Pencil size={15} />
                        </button>
                        {row.status !== 'Aktif' && (
                          <button type="button" onClick={() => handleDelete(row.id)} className="btn-icon delete" title="Hapus">
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ fontSize: '2rem' }}>📅</div>
                      <p style={{ fontWeight: 600 }}>Belum ada data tahun ajaran</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPageShell>
  );
}
