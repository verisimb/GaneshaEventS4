<?php

namespace App\Http\Controllers;

use App\Models\Pendaftaran;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TiketController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $tikets = Pendaftaran::query()
            ->where('user_id', $request->user()->id)
            ->with(['kegiatan:id,judul,tanggal,waktu,lokasi,banner,is_berbayar'])
            ->latest()
            ->get()
            ->map(fn (Pendaftaran $p) => [
                'id' => $p->id,
                'nama_lengkap' => $p->nama_lengkap,
                'status' => $p->status,
                'kegiatan' => [
                    'id' => $p->kegiatan->id,
                    'judul' => $p->kegiatan->judul,
                    'tanggal' => $p->kegiatan->tanggal?->translatedFormat('d M Y'),
                    'waktu' => $p->kegiatan->waktu ? substr($p->kegiatan->waktu, 0, 5) : null,
                    'lokasi' => $p->kegiatan->lokasi,
                    'banner_url' => $p->kegiatan->banner
                        ? asset('storage/'.$p->kegiatan->banner)
                        : null,
                    'is_berbayar' => $p->kegiatan->is_berbayar,
                ],
            ]);

        return Inertia::render('user/tiket', [
            'tikets' => $tikets,
        ]);
    }
}
