<?php

namespace App\Http\Controllers;

use App\Models\Kegiatan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $base = $request->user()
            ->kegiatans()
            ->select(['id', 'judul', 'tanggal', 'waktu', 'lokasi', 'banner', 'is_berbayar', 'harga', 'is_selesai'])
            ->latest();

        $mapKegiatan = fn(Kegiatan $k) => [
            'id' => $k->id,
            'judul' => $k->judul,
            'tanggal' => $k->tanggal?->translatedFormat('d M Y'),
            'waktu' => $k->waktu,
            'lokasi' => $k->lokasi,
            'banner_url' => $k->banner ? asset('storage/' . $k->banner) : null,
            'is_berbayar' => $k->is_berbayar,
            'harga' => $k->harga,
            'is_selesai' => $k->is_selesai,
        ];

        $akanDatang = (clone $base)->where('is_selesai', false)->get()->map($mapKegiatan);
        $sudahSelesai = (clone $base)->where('is_selesai', true)->get()->map($mapKegiatan);

        return Inertia::render('dashboard', [
            'akan_datang' => $akanDatang,
            'sudah_selesai' => $sudahSelesai,
        ]);
    }
}
