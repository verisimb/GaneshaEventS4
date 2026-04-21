<?php

namespace App\Http\Controllers;

use App\Models\Kegiatan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserKegiatanController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $search = $request->input('search');

        $query = Kegiatan::where('is_selesai', false);

        if ($search) {
            $query->where('judul', 'like', '%' . $search . '%');
        }

        $kegiatans = $query->latest()
            ->get()
            ->map(function (Kegiatan $k) {
                return [
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
            });

        return Inertia::render('user/kegiatan', [
            'kegiatans' => $kegiatans,
            'filters' => [
                'search' => $search ?? '',
            ],
        ]);
    }

    public function show(Kegiatan $kegiatan, Request $request): Response
    {
        $kegiatanData = [
            'id' => $kegiatan->id,
            'judul' => $kegiatan->judul,
            'deskripsi' => $kegiatan->deskripsi,
            'tanggal' => $kegiatan->tanggal?->translatedFormat('l, d F Y'),
            'waktu' => $kegiatan->waktu ? substr($kegiatan->waktu, 0, 5) . ' WITA' : null,
            'lokasi' => $kegiatan->lokasi,
            'penyelenggara' => $kegiatan->penyelenggara,
            'banner_url' => $kegiatan->banner ? asset('storage/' . $kegiatan->banner) : null,
            'is_berbayar' => $kegiatan->is_berbayar,
            'harga' => $kegiatan->harga,
            'nama_bank' => $kegiatan->nama_bank,
            'no_rekening' => $kegiatan->no_rekening,
            'atas_nama' => $kegiatan->atas_nama,
        ];

        $hasRegistered = \App\Models\Pendaftaran::where('user_id', $request->user()->id)
            ->where('kegiatan_id', $kegiatan->id)
            ->exists();

        return Inertia::render('user/kegiatan-detail', [
            'kegiatan' => $kegiatanData,
            'has_registered' => $hasRegistered,
        ]);
    }
}
