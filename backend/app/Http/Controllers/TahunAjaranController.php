<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Pengaturan;
use App\Models\TahunAjaran;
use App\Utils\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TahunAjaranController extends Controller
{
    public function index()
    {
        $data = TahunAjaran::orderBy('tanggal_mulai', 'desc')->get();
        return ApiResponse::success($data, 'Data tahun ajaran berhasil diambil');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'tahun_ajaran' => 'required|string',
            'semester' => 'required|in:Ganjil,Genap',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'status' => 'required|in:Aktif,Tidak Aktif,Selesai',
        ]);

        if ($validator->fails()) {
            return ApiResponse::error('Validasi gagal', 422, $validator->errors());
        }

        if ($request->status === 'Aktif') {
            TahunAjaran::where('status', 'Aktif')->update(['status' => 'Selesai']);
            $this->updatePengaturanAktif($request->tahun_ajaran, $request->semester);
        }

        $tahunAjaran = TahunAjaran::create($validator->validated());

        return ApiResponse::success($tahunAjaran, 'Tahun ajaran berhasil ditambahkan', 201);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'tahun_ajaran' => 'required|string',
            'semester' => 'required|in:Ganjil,Genap',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'status' => 'required|in:Aktif,Tidak Aktif,Selesai',
        ]);

        if ($validator->fails()) {
            return ApiResponse::error('Validasi gagal', 422, $validator->errors());
        }

        $tahunAjaran = TahunAjaran::find($id);
        if (!$tahunAjaran) {
            return ApiResponse::error('Tahun ajaran tidak ditemukan', 404);
        }

        if ($request->status === 'Aktif' && $tahunAjaran->status !== 'Aktif') {
            TahunAjaran::where('status', 'Aktif')->update(['status' => 'Selesai']);
            $this->updatePengaturanAktif($request->tahun_ajaran, $request->semester);
        }

        $tahunAjaran->update($validator->validated());

        return ApiResponse::success($tahunAjaran, 'Tahun ajaran berhasil diperbarui');
    }

    public function destroy($id)
    {
        $tahunAjaran = TahunAjaran::find($id);
        if (!$tahunAjaran) {
            return ApiResponse::error('Tahun ajaran tidak ditemukan', 404);
        }
        
        if ($tahunAjaran->status === 'Aktif') {
            return ApiResponse::error('Tidak dapat menghapus tahun ajaran yang sedang aktif', 400);
        }

        $tahunAjaran->delete();
        return ApiResponse::success(null, 'Tahun ajaran berhasil dihapus');
    }

    public function activate($id)
    {
        $tahunAjaran = TahunAjaran::find($id);
        if (!$tahunAjaran) {
            return ApiResponse::error('Tahun ajaran tidak ditemukan', 404);
        }

        TahunAjaran::where('status', 'Aktif')->update(['status' => 'Selesai']);
        $tahunAjaran->update(['status' => 'Aktif']);

        $this->updatePengaturanAktif($tahunAjaran->tahun_ajaran, $tahunAjaran->semester);

        return ApiResponse::success($tahunAjaran, 'Tahun ajaran berhasil diaktifkan');
    }

    private function updatePengaturanAktif($tahun_ajaran, $semester)
    {
        Pengaturan::updateOrCreate(
            ['group' => 'akademik', 'key' => 'tahun_ajaran_aktif'],
            ['value' => $tahun_ajaran, 'type' => 'string']
        );
        Pengaturan::updateOrCreate(
            ['group' => 'akademik', 'key' => 'semester_aktif'],
            ['value' => $semester, 'type' => 'string']
        );
    }
}
