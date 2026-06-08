import { Link } from 'react-router-dom';
import MainLayout from '@app/shared/layouts/MainLayout';
import FormBiodata from '@app/shared/ppdb/components/FormBiodata';
import FormOrangTua from '@app/shared/ppdb/components/FormOrangTua';
import { usePendaftaran } from '@app/shared/ppdb/hooks/usePendaftaran';
import { getJsonItem } from '@app/shared/utils/storage';

export default function FormulirPendaftaran() {
  const p = usePendaftaran();
  const user = getJsonItem('user');

  return (
    <MainLayout role="calon_siswa" name={user?.username}>
      <div className="pendaftaran-container">
        <div className="panel-header glass">
          <h2>Formulir Biodata</h2>
          <Link to="/calon-murid/dashboard">← Kembali</Link>
        </div>
        {p.isReadOnly && (
          <div className="alert-warning glass mb-4">
            Data terkunci. Status: {p.statusLabel}. Hanya dapat diubah saat status Revisi.
          </div>
        )}
        <FormBiodata form={p.form} onChange={p.onChange} disabled={p.isReadOnly} />
        <FormOrangTua form={p.form} onChange={p.onChange} disabled={p.isReadOnly} />
        {p.canEdit && (
          <div className="form-actions mt-4">
            <button type="button" className="btn-primary" onClick={p.saveDraft} disabled={p.saving}>
              {p.saving ? 'Menyimpan...' : 'Simpan Draft'}
            </button>
            <Link to="/calon-murid/berkas" className="btn-secondary">
              Lanjut Unggah Berkas
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

