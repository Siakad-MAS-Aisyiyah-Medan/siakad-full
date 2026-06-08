import apiClient from '@app/shared/services/apiClient';
import { unwrapData } from '@app/shared/services/apiHelpers';

export async function fetchAbsensiForm(params) {
  const response = await apiClient.get('/guru/absensi/siswa/form', { params });
  return unwrapData(response);
}

export async function saveAbsensiBulk(payload) {
  const response = await apiClient.post('/guru/absensi/siswa/bulk', payload);
  return unwrapData(response);
}

export async function fetchRekapSiswa(params = {}) {
  const response = await apiClient.get('/guru/absensi/siswa/rekap', { params });
  return unwrapData(response);
}

export async function checkInGuru(keterangan) {
  const response = await apiClient.post('/guru/absensi/self/check-in', { keterangan });
  return unwrapData(response);
}

export async function checkOutGuru(keterangan) {
  const response = await apiClient.post('/guru/absensi/self/check-out', { keterangan });
  return unwrapData(response);
}

export async function fetchRiwayatGuru(params = {}) {
  const response = await apiClient.get('/guru/absensi/self/riwayat', { params });
  return unwrapData(response);
}
