<?php

namespace App\Http\Controllers;

use App\Models\Pendaftaran;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class SertifikatController extends Controller
{
    /**
     * Daftar kegiatan yang eligible untuk sertifikat:
     * - Peserta sudah hadir (is_attended = true)
     * - Kegiatan sudah selesai (is_selesai = true)
     * - Template sertifikat tersedia
     */
    public function index(Request $request): \Inertia\Response
    {
        $sertifikats = Pendaftaran::query()
            ->where('user_id', $request->user()->id)
            ->where('status', 'confirmed')
            ->where('is_attended', true)
            ->with(['kegiatan' => fn ($q) => $q->where('is_selesai', true)])
            ->get()
            ->filter(fn (Pendaftaran $p) => $p->kegiatan !== null && $p->kegiatan->template_sertifikat !== null)
            ->values()
            ->map(fn (Pendaftaran $p) => [
                'id' => $p->id,
                'nama_lengkap' => $p->nama_lengkap,
                'kegiatan' => [
                    'id' => $p->kegiatan->id,
                    'judul' => $p->kegiatan->judul,
                    'penyelenggara' => $p->kegiatan->penyelenggara,
                    'tanggal' => $p->kegiatan->tanggal?->translatedFormat('d M Y'),
                    'banner_url' => $p->kegiatan->banner
                        ? asset('storage/'.$p->kegiatan->banner)
                        : null,
                ],
                'download_url' => route('user.sertifikat.download', $p),
            ]);

        return Inertia::render('user/sertifikat', [
            'sertifikats' => $sertifikats,
        ]);
    }

    /**
     * Generate & download sertifikat sebagai gambar JPEG.
     * Overlay nama peserta pada template sertifikat kegiatan.
     */
    public function download(Request $request, Pendaftaran $pendaftaran): Response
    {
        // Pastikan peserta yang download adalah pemilik tiket
        abort_if($pendaftaran->user_id !== $request->user()->id, 403);

        // Pastikan memenuhi syarat sertifikat
        $kegiatan = $pendaftaran->kegiatan;
        abort_if(
            ! $kegiatan->is_selesai || ! $pendaftaran->is_attended || ! $kegiatan->template_sertifikat,
            403,
            'Sertifikat belum tersedia.'
        );

        $templatePath = Storage::disk('public')->path($kegiatan->template_sertifikat);
        abort_if(! file_exists($templatePath), 404, 'File template sertifikat tidak ditemukan.');

        $manager = new ImageManager(new Driver);
        $image = $manager->read($templatePath);

        $width = $image->width();
        $height = $image->height();

        $fontPath = resource_path('fonts/Arial.ttf');
        abort_if(! file_exists($fontPath), 500, 'Font file tidak ditemukan.');

        // Tulis nama peserta di tengah secara vertikal & horizontal
        $image->text(
            $pendaftaran->nama_lengkap,
            (int) ($width / 2),
            (int) ($height / 2),
            function ($font) use ($fontPath, $width) {
                $font->file($fontPath);
                $font->size((int) ($width * 0.045)); // ~4.5% lebar gambar
                $font->color([30, 30, 30]);           // hampir hitam
                $font->align('center');
                $font->valign('middle');
            }
        );

        $filename = 'Sertifikat_'
            .str_replace(' ', '_', $pendaftaran->nama_lengkap)
            .'_'.str_replace(' ', '_', $kegiatan->judul)
            .'.jpg';

        return response(
            $image->toJpeg(quality: 92)->toString(),
            200,
            [
                'Content-Type' => 'image/jpeg',
                'Content-Disposition' => 'attachment; filename="'.$filename.'"',
            ]
        );
    }
}
