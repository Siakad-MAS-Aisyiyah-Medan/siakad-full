const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export function normalizeText(value) {
  return String(value || '').trim().toLowerCase();
}

export function formatMonthLabel(monthValue) {
  if (!monthValue || !/^\d{4}-\d{2}$/.test(monthValue)) return monthValue || '-';
  const [year, month] = monthValue.split('-').map(Number);
  return `${MONTH_NAMES[month - 1]} ${year}`;
}

export function buildSemesterMonthOptions(tahunAjaran, semester) {
  const [firstYear, secondYear] = String(tahunAjaran || '')
    .split('/')
    .map((value) => Number(value));

  if (!firstYear || !secondYear) {
    return [];
  }

  const startMonth = semester === 'Genap' ? 1 : 7;
  const endMonth = semester === 'Genap' ? 6 : 12;
  const targetYear = semester === 'Genap' ? secondYear : firstYear;
  const options = [];

  for (let month = startMonth; month <= endMonth; month += 1) {
    const monthValue = `${targetYear}-${String(month).padStart(2, '0')}`;
    options.push({
      value: monthValue,
      label: formatMonthLabel(monthValue),
    });
  }

  return options;
}

export function buildMeetingDates(monthValue, count = 7) {
  if (!monthValue || !/^\d{4}-\d{2}$/.test(monthValue)) return [];

  const [year, month] = monthValue.split('-').map(Number);
  const dates = [];
  let day = 1;

  while (dates.length < count) {
    const date = new Date(year, month - 1, day);
    if (date.getMonth() !== month - 1) break;

    const weekday = date.getDay();
    if (weekday !== 0) {
      dates.push(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
    }

    day += 1;
  }

  return dates;
}

export function dedupeKelasDiajar(jadwalList) {
  const map = new Map();

  (jadwalList || []).forEach((item) => {
    if (!item?.kelas?.id_kelas) return;

    const key = `${item.id_kelas}-${item.tahun_ajaran}-${item.semester}`;
    if (!map.has(key)) {
      map.set(key, {
        id_kelas: item.id_kelas,
        nama_kelas: item.kelas?.nama_kelas || '-',
        tingkatan: item.kelas?.nama_kelas?.split(' ')[0] || '-',
        jurusan: item.kelas?.nama_kelas?.split(' ').slice(1).join(' ') || '-',
        wali_kelas: item.guru?.nama_guru || '-',
        tahun_ajaran: item.tahun_ajaran || '-',
        semester: item.semester || '-',
        id_mapel: item.id_mapel,
      });
    }
  });

  return Array.from(map.values()).sort((a, b) => {
    const byYear = String(b.tahun_ajaran).localeCompare(String(a.tahun_ajaran));
    if (byYear !== 0) return byYear;
    return String(a.nama_kelas).localeCompare(String(b.nama_kelas));
  });
}

export function dedupeMapelDiampu(jadwalList) {
  const map = new Map();

  (jadwalList || []).forEach((item) => {
    const namaKelas = item.kelas?.nama_kelas || '';
    const tingkatan = namaKelas.split(' ')[0] || '-';
    const key = `${item.id_mapel}-${tingkatan}-${item.tahun_ajaran}`;

    if (!map.has(key)) {
      map.set(key, {
        id_mapel: item.id_mapel,
        nama_mapel: item.mapel?.nama_mapel || '-',
        tingkatan,
        tahun_ajaran: item.tahun_ajaran || '-',
      });
    }
  });

  return Array.from(map.values()).sort((a, b) => {
    const byMapel = String(a.nama_mapel).localeCompare(String(b.nama_mapel));
    if (byMapel !== 0) return byMapel;
    return String(a.tingkatan).localeCompare(String(b.tingkatan));
  });
}

export function buildDefaultNilaiContexts(jadwalList) {
  const map = new Map();

  (jadwalList || []).forEach((item) => {
    const key = `${item.tahun_ajaran}|${item.semester}|${item.id_kelas}|${item.id_mapel}`;

    if (!map.has(key)) {
      map.set(key, {
        id: key,
        tahun_ajaran: item.tahun_ajaran,
        semester: item.semester,
        id_kelas: item.id_kelas,
        id_mapel: item.id_mapel,
        nama_kelas: item.kelas?.nama_kelas || '-',
        nama_mapel: item.mapel?.nama_mapel || '-',
      });
    }
  });

  return Array.from(map.values());
}

export function buildDefaultAbsensiContexts(jadwalList, monthValue) {
  const map = new Map();

  (jadwalList || []).forEach((item) => {
    const key = `${item.tahun_ajaran}|${item.semester}|${monthValue}|${item.id_kelas}|${item.id_mapel}`;

    if (!map.has(key)) {
      map.set(key, {
        id: key,
        tahun_ajaran: item.tahun_ajaran,
        semester: item.semester,
        bulan: monthValue,
        id_kelas: item.id_kelas,
        id_mapel: item.id_mapel,
        nama_kelas: item.kelas?.nama_kelas || '-',
        nama_mapel: item.mapel?.nama_mapel || '-',
      });
    }
  });

  return Array.from(map.values());
}
