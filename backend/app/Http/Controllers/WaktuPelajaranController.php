<?php

namespace App\Http\Controllers;

use App\Models\WaktuPelajaran;
use App\Utils\ApiResponse;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class WaktuPelajaranController extends Controller
{
    public function index()
    {
        $waktu = WaktuPelajaran::orderBy('jam_mulai')->get();

        return ApiResponse::success($waktu, 'Berhasil mengambil waktu pelajaran');
    }

    public function generate(Request $request)
    {
        $request->validate([
            'jam_mulai' => 'required|date_format:H:i',
            'durasi_menit' => 'required|integer|min:15',
            'jumlah_les' => 'required|integer|min:1|max:15',
            'istirahat' => 'nullable|array',
            'istirahat.*.setelah_les' => 'required|integer',
            'istirahat.*.durasi_menit' => 'required|integer',
        ]);

        Schema::disableForeignKeyConstraints();
        WaktuPelajaran::truncate();
        Schema::enableForeignKeyConstraints();

        $currentTime = Carbon::createFromFormat('H:i', $request->jam_mulai);

        $istirahatSettings = collect($request->istirahat ?? [])->keyBy('setelah_les');

        for ($i = 1; $i <= $request->jumlah_les; $i++) {
            $jamSelesai = (clone $currentTime)->addMinutes($request->durasi_menit);

            WaktuPelajaran::create([
                'jam_ke' => $i,
                'jam_mulai' => $currentTime->format('H:i:s'),
                'jam_selesai' => $jamSelesai->format('H:i:s'),
                'tipe' => 'belajar',
            ]);

            $currentTime = clone $jamSelesai;

            if ($istirahatSettings->has($i)) {
                $durasiIstirahat = $istirahatSettings[$i]['durasi_menit'];
                $jamSelesaiIstirahat = (clone $currentTime)->addMinutes($durasiIstirahat);

                WaktuPelajaran::create([
                    'jam_ke' => null,
                    'jam_mulai' => $currentTime->format('H:i:s'),
                    'jam_selesai' => $jamSelesaiIstirahat->format('H:i:s'),
                    'tipe' => 'istirahat',
                ]);

                $currentTime = clone $jamSelesaiIstirahat;
            }
        }

        return ApiResponse::success(WaktuPelajaran::orderBy('jam_mulai')->get(), 'Berhasil men-generate waktu pelajaran');
    }
}
