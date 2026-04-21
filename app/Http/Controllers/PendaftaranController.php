<?php

namespace App\Http\Controllers;

use App\Models\Kegiatan;
use App\Models\Pendaftaran;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PendaftaranController extends Controller
{
    public function index(Request $request): Response
    {
        $organizerKegiatans = $request->user()
            ->kegiatans()
            ->select(['id', 'judul'])
            ->orderBy('judul')
            ->get();

        $query = Pendaftaran::query()
            ->whereHas('kegiatan', fn ($q) => $q->where('user_id', $request->user()->id))
            ->with(['kegiatan:id,judul,is_berbayar'])
            ->latest();

        if ($request->filled('kegiatan_id')) {
            $query->where('kegiatan_id', $request->integer('kegiatan_id'));
        }

        $pendaftarans = $query->get()->map(fn (Pendaftaran $p) => [
            'id' => $p->id,
            'nama_lengkap' => $p->nama_lengkap,
            'email' => $p->email,
            'no_hp' => $p->no_hp,
            'status' => $p->status,
            'bukti_pembayaran_url' => $p->bukti_pembayaran
                ? asset('storage/'.$p->bukti_pembayaran)
                : null,
            'kegiatan' => [
                'id' => $p->kegiatan->id,
                'judul' => $p->kegiatan->judul,
                'is_berbayar' => $p->kegiatan->is_berbayar,
            ],
        ]);

        return Inertia::render('pendaftar', [
            'pendaftarans' => $pendaftarans,
            'kegiatan_list' => $organizerKegiatans,
            'selected_kegiatan_id' => $request->filled('kegiatan_id')
                ? $request->integer('kegiatan_id')
                : null,
        ]);
    }

    public function confirm(Pendaftaran $pendaftaran): RedirectResponse
    {
        abort_if($pendaftaran->kegiatan->user_id !== auth()->id(), 403);

        $pendaftaran->update([
            'status'      => 'confirmed',
            'ticket_code' => (string) Str::uuid(),
        ]);

        return back()->with('success', 'Pendaftar berhasil dikonfirmasi.');
    }

    public function reject(Pendaftaran $pendaftaran): RedirectResponse
    {
        abort_if($pendaftaran->kegiatan->user_id !== auth()->id(), 403);

        $pendaftaran->update(['status' => 'rejected']);

        return back()->with('success', 'Pendaftar berhasil ditolak.');
    }

    public function store(Request $request, Kegiatan $kegiatan)
    {
        // Block duplicate registration before any other processing
        $alreadyRegistered = Pendaftaran::where('user_id', $request->user()->id)
            ->where('kegiatan_id', $kegiatan->id)
            ->exists();

        if ($alreadyRegistered) {
            return back()->withErrors([
                'email' => 'Anda sudah terdaftar untuk kegiatan ini.',
            ]);
        }

        $rules = [
            'nama_lengkap' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'no_hp' => 'required|string|max:20',
        ];

        if ($kegiatan->is_berbayar) {
            $rules['bukti_pembayaran'] = 'required|image|mimes:jpg,jpeg,png,webp|max:2048';
        }

        $validated = $request->validate($rules);

        if ($request->hasFile('bukti_pembayaran')) {
            $path = $request->file('bukti_pembayaran')->store('bukti_pembayaran', 'public');
            $validated['bukti_pembayaran'] = $path;
        }

        $kegiatan->pendaftarans()->create([
            'user_id'          => $request->user()->id,
            'nama_lengkap'     => $validated['nama_lengkap'],
            'email'            => $validated['email'],
            'no_hp'            => $validated['no_hp'],
            'bukti_pembayaran' => $validated['bukti_pembayaran'] ?? null,
            'status'           => $kegiatan->is_berbayar ? 'pending' : 'confirmed',
            'ticket_code'      => $kegiatan->is_berbayar ? null : (string) Str::uuid(),
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Pendaftaran berhasil! Silakan cek halaman Tiket untuk informasi lebih lanjut.',
        ]);

        return redirect()->route('user.tiket');
    }
}
