const CONFLICT_MESSAGES = {
  guru_bentrok: 'Guru bentrok: sudah mengajar di jam yang sama.',
  kelas_bentrok: 'Kelas bentrok: sudah ada jadwal lain di jam yang sama.',
  ruangan_bentrok: 'Ruangan bentrok: ruangan sudah dipakai di jam yang sama.',
  jam_tidak_valid: 'Jam selesai harus lebih besar dari jam mulai.',
};

export function resolveJadwalConflictMessage(error) {
  const body = error?.response?.data;
  const type = body?.errors?.conflict_type;
  if (type && CONFLICT_MESSAGES[type]) {
    return CONFLICT_MESSAGES[type];
  }
  return body?.message || 'Terjadi kesalahan saat memproses jadwal.';
}
