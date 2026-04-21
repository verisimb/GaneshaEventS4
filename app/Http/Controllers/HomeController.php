<?php

namespace App\Http\Controllers;

use App\Models\Kegiatan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

class HomeController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $upcomingEvents = Kegiatan::query()
            ->where('is_selesai', false)
            ->orderBy('tanggal')
            ->limit(6)
            ->get()
            ->map(fn (Kegiatan $k) => [
                'id' => $k->id,
                'judul' => $k->judul,
                'deskripsi' => $k->deskripsi,
                'tanggal' => $k->tanggal?->translatedFormat('d M Y'),
                'waktu' => $k->waktu ? substr($k->waktu, 0, 5) : null,
                'lokasi' => $k->lokasi,
                'penyelenggara' => $k->penyelenggara,
                'is_berbayar' => $k->is_berbayar,
                'harga' => $k->harga,
                'nama_bank' => $k->nama_bank,
                'no_rekening' => $k->no_rekening,
                'atas_nama' => $k->atas_nama,
                'banner_url' => $k->banner ? asset('storage/'.$k->banner) : null,
            ]);

        return Inertia::render('welcome', [
            'canRegister' => Features::enabled(Features::registration()),
            'upcomingEvents' => $upcomingEvents,
        ]);
    }
}
