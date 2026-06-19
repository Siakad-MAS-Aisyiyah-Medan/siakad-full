import { useEffect, useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import MainLayout from '@app/shared/layouts/MainLayout';
import { getStoredUser, getStoredProfile } from '@app/shared/services/auth.service';
import { getDisplayName } from '@app/shared/utils/profile';
import { fetchNilaiSiswa } from '@app/shared/nilai/siswa/services/nilai.service';

const fallbackRows = [
  ['Matematika', 85, 88, 90, 88],
  ['Bahasa Indonesia', 82, 84, 86, 84],
  ['Bahasa Inggris', 90, 89, 92, 90],
  ['Biologi', 87, 85, 88, 87],
  ['Fisika', 80, 82, 85, 82],
  ['Kimia', 84, 86, 88, 86],
];

function InfoLine({ label, value }) {
  return (
    <div className="grid grid-cols-[180px_20px_1fr] text-xl text-slate-950">
      <span>{label}</span>
      <span>:</span>
      <span>{value || '-'}</span>
    </div>
  );
}

export default function SiswaNilaiPage() {
  const user = getStoredUser();
  const profile = getStoredProfile();
  const name = getDisplayName(profile, user?.role, user?.username);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNilaiSiswa({ semester: 'Ganjil', tahun_ajaran: '2025/2026' })
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const rows = useMemo(() => {
    if (!loading && items.length > 0) {
      return items.map((row) => [
        row.mapel?.nama_mapel || '-',
        row.nilai_tugas ?? '-',
        row.nilai_uts ?? '-',
        row.nilai_uas ?? '-',
        row.nilai_akhir ?? '-',
      ]);
    }
    return fallbackRows;
  }, [items, loading]);

  const average = useMemo(() => {
    const values = rows.map((row) => Number(row[4])).filter((value) => !Number.isNaN(value));
    if (!values.length) return '-';
    return (values.reduce((total, value) => total + value, 0) / values.length).toFixed(2);
  }, [rows]);

  return (
    <MainLayout role="siswa" name={name}>
      <div className="mx-auto max-w-[1160px] px-2 py-2">
        <h1 className="text-5xl font-semibold tracking-tight text-slate-950">Transkrip Akademik Murid</h1>

        <section className="mt-10 rounded-md border border-slate-300 bg-white px-8 py-9">
          <h2 className="text-3xl font-semibold text-slate-950">Informasi Murid</h2>
          <div className="mt-8 space-y-5">
            <InfoLine label="Nama Murid" value={profile?.nama_siswa || name || 'Andi Saputra'} />
            <InfoLine label="NISN" value={profile?.nisn || '0051234567'} />
            <InfoLine label="Kelas" value={profile?.kelas?.nama_kelas || 'X IPA 1'} />
            <InfoLine label="Tahun Ajaran" value="2025/2026" />
            <InfoLine label="Semester" value="Ganjil" />
          </div>
        </section>

        <section className="mt-8 rounded-md border border-slate-300 bg-white px-8 py-8">
          <h2 className="text-3xl font-semibold text-slate-950">Daftar Nilai Akademik</h2>
          <div className="mt-6 overflow-hidden rounded-md border border-slate-300">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  {['Mata Pelajaran', 'Tugas', 'UTS', 'UAS', 'Nilai Akhir'].map((head) => (
                    <th key={head} className="border border-slate-300 px-5 py-5 text-xl font-semibold text-slate-950">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row[0]}>
                    <td className="border border-slate-300 px-5 py-5 text-xl text-slate-900">{row[0]}</td>
                    {row.slice(1).map((value, index) => (
                      <td key={`${row[0]}-${index}`} className="border border-slate-300 px-5 py-5 text-center text-xl text-slate-900">{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 rounded-md border border-slate-300 bg-white px-8 py-8">
          <h2 className="text-3xl font-semibold text-slate-950">Ringkasan Akademik</h2>
          <div className="mt-5 overflow-hidden rounded-md border border-slate-300">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="border border-slate-300 px-5 py-4 text-xl font-semibold text-slate-950">Keterangan</th>
                  <th className="border border-slate-300 px-5 py-4 text-xl font-semibold text-slate-950">Nilai</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 px-5 py-4 text-xl">Rata-rata Nilai</td>
                  <td className="border border-slate-300 px-5 py-4 text-xl">{average}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-5 py-4 text-xl">Predikat</td>
                  <td className="border border-slate-300 px-5 py-4 text-xl">Baik</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div className="mt-8 flex justify-end">
          <button type="button" className="inline-flex h-16 items-center gap-4 rounded-md border border-slate-300 bg-white px-12 text-2xl text-slate-950">
            <Download className="h-7 w-7" />
            Unduh Transkrip Akademik
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
