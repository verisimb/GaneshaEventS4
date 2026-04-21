<?php

use App\Http\Controllers\AbsensiController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\KegiatanController;
use App\Http\Controllers\PendaftaranController;
use App\Http\Controllers\SertifikatController;
use App\Http\Controllers\TiketController;
use App\Http\Controllers\UserKegiatanController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('user/kegiatan', [UserKegiatanController::class, '__invoke'])->name('user.kegiatan');
    Route::get('user/kegiatan/{kegiatan}', [UserKegiatanController::class, 'show'])->name('user.kegiatan.show');
    Route::post('user/kegiatan/{kegiatan}/daftar', [PendaftaranController::class, 'store'])->name('user.pendaftaran.store');
    Route::get('user/tiket', TiketController::class)->name('user.tiket');
    Route::get('user/sertifikat', [SertifikatController::class, 'index'])->name('user.sertifikat');
    Route::get('user/sertifikat/{pendaftaran}/download', [SertifikatController::class, 'download'])->name('user.sertifikat.download');
});

Route::middleware(['auth', 'verified', 'organizer'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::get('pendaftar', [PendaftaranController::class, 'index'])->name('pendaftar');
    Route::patch('pendaftar/{pendaftaran}/confirm', [PendaftaranController::class, 'confirm'])->name('pendaftar.confirm');
    Route::patch('pendaftar/{pendaftaran}/reject', [PendaftaranController::class, 'reject'])->name('pendaftar.reject');
    Route::get('absensi', [AbsensiController::class, 'index'])->name('absensi');
    Route::post('absensi/verify', [AbsensiController::class, 'verify'])->name('absensi.verify');
    Route::get('absensi/{kegiatan}/peserta', [AbsensiController::class, 'peserta'])->name('absensi.peserta');

    Route::get('kegiatan/create', [KegiatanController::class, 'create'])->name('kegiatan.create');
    Route::post('kegiatan', [KegiatanController::class, 'store'])->name('kegiatan.store');
    Route::get('kegiatan/{kegiatan}/edit', [KegiatanController::class, 'edit'])->name('kegiatan.edit');
    Route::put('kegiatan/{kegiatan}', [KegiatanController::class, 'update'])->name('kegiatan.update');
    Route::patch('kegiatan/{kegiatan}/complete', [KegiatanController::class, 'complete'])->name('kegiatan.complete');
    Route::delete('kegiatan/{kegiatan}', [KegiatanController::class, 'destroy'])->name('kegiatan.destroy');
});

require __DIR__.'/settings.php';
