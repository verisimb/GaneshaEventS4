<?php

namespace App\Http\Controllers;

use App\Models\Kegiatan;
use App\Models\Pendaftaran;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AbsensiController extends Controller
{
    /**
     * Halaman absensi: tampilkan daftar kegiatan milik organizer.
     */
    public function index(Request $request): Response
    {
        $kegiatans = Kegiatan::query()
            ->where('user_id', $request->user()->id)
            ->orderByDesc('tanggal')
            ->get(['id', 'judul', 'tanggal', 'is_selesai'])
            ->map(fn (Kegiatan $k) => [
                'id' => $k->id,
                'judul' => $k->judul,
                'tanggal' => $k->tanggal?->translatedFormat('d M Y'),
                'is_selesai' => $k->is_selesai,
            ]);

        return Inertia::render('absensi', [
            'kegiatans' => $kegiatans,
        ]);
    }

    /**
     * Verifikasi ticket_code dan tandai peserta sebagai hadir.
     */
    public function verify(Request $request): JsonResponse
    {
        $request->validate([
            'ticket_code' => ['required', 'string'],
            'kegiatan_id' => ['required', 'integer'],
        ]);

        $pendaftaran = Pendaftaran::query()
            ->where('ticket_code', $request->ticket_code)
            ->where('status', 'confirmed')
            ->with('kegiatan:id,user_id,judul')
            ->first();

        if (! $pendaftaran) {
            return response()->json([
                'success' => false,
                'message' => 'Tiket tidak ditemukan atau belum dikonfirmasi.',
            ], 404);
        }

        // Pastikan tiket ini milik kegiatan yang dipilih oleh organizer
        if ($pendaftaran->kegiatan_id !== (int) $request->kegiatan_id) {
            return response()->json([
                'success' => false,
                'message' => 'Tiket tidak valid untuk kegiatan ini.',
            ], 422);
        }

        // Pastikan kegiatan milik organizer yang sedang login
        if ($pendaftaran->kegiatan->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak berwenang melakukan absensi untuk kegiatan ini.',
            ], 403);
        }

        // Cek apakah sudah pernah hadir
        if ($pendaftaran->is_attended) {
            return response()->json([
                'success' => false,
                'message' => "Peserta {$pendaftaran->nama_lengkap} sudah tercatat hadir sebelumnya.",
                'already_attended' => true,
                'nama_lengkap' => $pendaftaran->nama_lengkap,
            ], 409);
        }

        $pendaftaran->update(['is_attended' => true]);

        return response()->json([
            'success' => true,
            'message' => "Berhasil! {$pendaftaran->nama_lengkap} dicatat sebagai hadir.",
            'nama_lengkap' => $pendaftaran->nama_lengkap,
        ]);
    }

    /**
     * Ambil daftar peserta yang sudah hadir untuk kegiatan tertentu.
     */
    public function peserta(Request $request, Kegiatan $kegiatan): JsonResponse
    {
        abort_if($kegiatan->user_id !== $request->user()->id, 403);

        $peserta = $kegiatan->pendaftarans()
            ->where('status', 'confirmed')
            ->orderByDesc('updated_at')
            ->get(['id', 'nama_lengkap', 'email', 'is_attended'])
            ->map(fn (Pendaftaran $p) => [
                'id' => $p->id,
                'nama_lengkap' => $p->nama_lengkap,
                'email' => $p->email,
                'is_attended' => $p->is_attended,
            ]);

        return response()->json(['peserta' => $peserta]);
    }
}
