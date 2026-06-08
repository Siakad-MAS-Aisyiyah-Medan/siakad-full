/**
 * Ubah nilai dari API /ppdb/info menjadi teks aman untuk dirender di React.
 */
function formatContactEntry(entry) {
  if (!entry || typeof entry !== 'object') return '';
  const nama = entry.nama || entry.name || '';
  const phonesRaw = entry.telepon ?? entry.phones ?? entry.phone;
  const phones = Array.isArray(phonesRaw)
    ? phonesRaw.filter(Boolean).join(', ')
    : phonesRaw
      ? String(phonesRaw)
      : '';
  if (nama && phones) return `${nama} — ${phones}`;
  return nama || phones || '';
}

export function formatKontakText(kontak) {
  if (kontak == null) return undefined;
  if (typeof kontak === 'string') return kontak.trim() || undefined;
  if (Array.isArray(kontak)) {
    const lines = kontak.map(formatContactEntry).filter(Boolean);
    return lines.length ? lines.join('\n') : undefined;
  }
  if (typeof kontak === 'object') {
    const line = formatContactEntry(kontak);
    return line || undefined;
  }
  return undefined;
}

export function formatInfoText(value) {
  if (value == null) return undefined;
  if (typeof value === 'string') return value.trim() || undefined;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) {
    const parts = value.map((item) => formatInfoText(item)).filter(Boolean);
    return parts.length ? parts.join(', ') : undefined;
  }
  if (typeof value === 'object') {
    if ('nama' in value || 'telepon' in value || 'name' in value || 'phone' in value) {
      return formatKontakText(value);
    }
    return (
      value.deskripsi ||
      value.description ||
      value.judul ||
      value.label ||
      value.text ||
      undefined
    );
  }
  return undefined;
}

export function mapPpdbInfoToPanel(ppdbInfo) {
  if (!ppdbInfo || typeof ppdbInfo !== 'object') return null;

  return {
    jadwal: formatInfoText(
      ppdbInfo.jadwal ||
        ppdbInfo.periode ||
        ppdbInfo.tahun_ajaran ||
        ppdbInfo.academicYear,
    ),
    pengumuman: formatInfoText(
      ppdbInfo.pengumuman || ppdbInfo.deskripsi || ppdbInfo.description,
    ),
    kontak:
      formatKontakText(ppdbInfo.kontak) ||
      formatInfoText(ppdbInfo.nomor_wa) ||
      formatInfoText(ppdbInfo.alamat),
  };
}
