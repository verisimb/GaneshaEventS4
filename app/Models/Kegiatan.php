<?php

namespace App\Models;

use Database\Factories\KegiatanFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kegiatan extends Model
{
    /** @use HasFactory<KegiatanFactory> */
    use HasFactory;
    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'judul',
        'deskripsi',
        'tanggal',
        'waktu',
        'lokasi',
        'penyelenggara',
        'banner',
        'template_sertifikat',
        'is_berbayar',
        'harga',
        'nama_bank',
        'no_rekening',
        'atas_nama',
        'is_selesai',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tanggal' => 'date',
            'is_berbayar' => 'boolean',
            'is_selesai' => 'boolean',
            'harga' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function pendaftarans(): HasMany
    {
        return $this->hasMany(Pendaftaran::class);
    }
}
