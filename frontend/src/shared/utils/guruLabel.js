/** Nama tampilan guru dari objek user API */
export function guruLabel(guru) {
  return guru?.guru?.nama_guru || guru?.profile?.nama_guru || guru?.username || '-';
}
