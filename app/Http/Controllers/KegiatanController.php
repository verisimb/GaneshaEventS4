<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreKegiatanRequest;
use App\Http\Requests\UpdateKegiatanRequest;
use App\Models\Kegiatan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class KegiatanController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('kegiatan/create');
    }

    public function store(StoreKegiatanRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('banner')) {
            $validated['banner'] = $request->file('banner')->store('kegiatan/banner', 'public');
        }

        if ($request->hasFile('template_sertifikat')) {
            $validated['template_sertifikat'] = $request->file('template_sertifikat')->store('kegiatan/sertifikat', 'public');
        }

        $request->user()->kegiatans()->create($validated);

        return to_route('dashboard')->with('success', 'Kegiatan berhasil ditambahkan!');
    }

    public function edit(Kegiatan $kegiatan): Response
    {
        abort_if($kegiatan->user_id !== auth()->id(), 403);

        return Inertia::render('kegiatan/edit', [
            'kegiatan' => [
                'id' => $kegiatan->id,
                'judul' => $kegiatan->judul,
                'deskripsi' => $kegiatan->deskripsi,
                'tanggal' => $kegiatan->tanggal?->format('Y-m-d'),
                'waktu' => substr($kegiatan->waktu, 0, 5),
                'lokasi' => $kegiatan->lokasi,
                'penyelenggara' => $kegiatan->penyelenggara,
                'banner_url' => $kegiatan->banner ? asset('storage/' . $kegiatan->banner) : null,
                'template_sertifikat_url' => $kegiatan->template_sertifikat
                    ? asset('storage/' . $kegiatan->template_sertifikat)
                    : null,
                'template_sertifikat_name' => $kegiatan->template_sertifikat
                    ? basename($kegiatan->template_sertifikat)
                    : null,
                'is_berbayar' => $kegiatan->is_berbayar,
                'harga' => $kegiatan->harga,
                'nama_bank' => $kegiatan->nama_bank,
                'no_rekening' => $kegiatan->no_rekening,
                'atas_nama' => $kegiatan->atas_nama,
            ],
        ]);
    }

    public function update(UpdateKegiatanRequest $request, Kegiatan $kegiatan): RedirectResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('banner')) {
            if ($kegiatan->banner) {
                Storage::disk('public')->delete($kegiatan->banner);
            }
            $validated['banner'] = $request->file('banner')->store('kegiatan/banner', 'public');
        } else {
            unset($validated['banner']);
        }

        if ($request->hasFile('template_sertifikat')) {
            if ($kegiatan->template_sertifikat) {
                Storage::disk('public')->delete($kegiatan->template_sertifikat);
            }
            $validated['template_sertifikat'] = $request->file('template_sertifikat')->store('kegiatan/sertifikat', 'public');
        } else {
            unset($validated['template_sertifikat']);
        }

        $kegiatan->update($validated);

        return to_route('dashboard')->with('success', 'Kegiatan berhasil diperbarui!');
    }

    public function complete(Kegiatan $kegiatan): RedirectResponse
    {
        abort_if($kegiatan->user_id !== auth()->id(), 403);

        $kegiatan->update(['is_selesai' => ! $kegiatan->is_selesai]);

        $message = $kegiatan->is_selesai
            ? 'Kegiatan ditandai sebagai selesai.'
            : 'Kegiatan diaktifkan kembali.';

        return back()->with('success', $message);
    }

    public function destroy(Kegiatan $kegiatan): RedirectResponse
    {
        abort_if($kegiatan->user_id !== auth()->id(), 403);

        if ($kegiatan->banner) {
            Storage::disk('public')->delete($kegiatan->banner);
        }

        if ($kegiatan->template_sertifikat) {
            Storage::disk('public')->delete($kegiatan->template_sertifikat);
        }

        $kegiatan->delete();

        return back()->with('success', 'Kegiatan berhasil dihapus.');
    }
}
