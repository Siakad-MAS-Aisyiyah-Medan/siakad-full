export const ABSENSI_STATUS = [
  { value: 'H', label: 'Hadir' },
  { value: 'S', label: 'Sakit' },
  { value: 'I', label: 'Izin' },
  { value: 'A', label: 'Alpa' },
  { value: 'T', label: 'Terlambat' },
];

export function absensiStatusLabel(code) {
  return ABSENSI_STATUS.find((s) => s.value === code)?.label || code || '-';
}
