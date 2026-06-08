import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileEdit } from 'lucide-react';
import Card from '../portal/Card';
import Button from '../portal/Button';
import { startOrResumePpdb } from '../../utils/startOrResumePpdb';

const MESSAGES = {
  draft: null,
  revision: null,
  revisi: null,
  submitted: 'Pendaftaran Anda sedang menunggu verifikasi admin.',
  diajukan: 'Pendaftaran Anda sedang menunggu verifikasi admin.',
  verified: 'Data Anda sudah diverifikasi.',
  terverifikasi: 'Data Anda sudah diverifikasi.',
  accepted: 'Selamat, Anda dinyatakan diterima.',
  diterima: 'Selamat, Anda dinyatakan diterima.',
  rejected: 'Mohon hubungi admin untuk informasi lebih lanjut.',
  ditolak: 'Mohon hubungi admin untuk informasi lebih lanjut.',
};

export default function StatusNextActions({ status, hasRegistration }) {
  const navigate = useNavigate();
  const [starting, setStarting] = useState(false);
  const message = MESSAGES[status];
  const showContinue = ['draft', 'revision', 'revisi'].includes(status);

  const onMulaiPendaftaran = async () => {
    setStarting(true);
    try {
      const result = await startOrResumePpdb();
      if (!result.ok) {
        alert(result.error);
        return;
      }
      navigate(result.path);
    } finally {
      setStarting(false);
    }
  };

  if (!hasRegistration) {
    return (
      <Card>
        <h2 className="text-lg font-bold text-slate-900">Aksi Selanjutnya</h2>
        <p className="mt-2 text-sm text-slate-600">Anda belum memulai pendaftaran PPDB.</p>
        <Button className="mt-4" disabled={starting} onClick={onMulaiPendaftaran}>
          <FileEdit size={18} />
          {starting ? 'Memulai...' : 'Mulai Pendaftaran'}
        </Button>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-lg font-bold text-slate-900">Aksi Selanjutnya</h2>

      {message && (
        <p className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900">
          {message}
        </p>
      )}

      {showContinue && (
        <Button className="mt-4" onClick={() => navigate('/ppdb/registrasi')}>
          <FileEdit size={18} />
          Lanjutkan Formulir
          <ArrowRight size={18} />
        </Button>
      )}

      {(status === 'accepted' || status === 'diterima') && (
        <Button className="mt-4" variant="secondary" onClick={() => navigate('/calon-murid/bukti')}>
          Cetak Bukti Pendaftaran
          <ArrowRight size={18} />
        </Button>
      )}
    </Card>
  );
}
