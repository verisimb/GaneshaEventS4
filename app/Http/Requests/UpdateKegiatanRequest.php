<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateKegiatanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->route('kegiatan')?->user_id === $this->user()->id;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $isBerbayar = $this->boolean('is_berbayar');

        return [
            'judul' => ['required', 'string', 'max:255'],
            'deskripsi' => ['required', 'string'],
            'tanggal' => ['required', 'date'],
            'waktu' => ['required', 'date_format:H:i'],
            'lokasi' => ['required', 'string', 'max:255'],
            'penyelenggara' => ['required', 'string', 'max:255'],
            'banner' => ['sometimes', 'nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'template_sertifikat' => ['sometimes', 'nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:4096'],
            'is_berbayar' => ['required', 'boolean'],
            'harga' => [Rule::requiredIf($isBerbayar), 'nullable', 'integer', 'min:0'],
            'nama_bank' => [Rule::requiredIf($isBerbayar), 'nullable', 'string', 'max:100'],
            'no_rekening' => [Rule::requiredIf($isBerbayar), 'nullable', 'string', 'max:50'],
            'atas_nama' => [Rule::requiredIf($isBerbayar), 'nullable', 'string', 'max:100'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'judul' => 'Judul Kegiatan',
            'deskripsi' => 'Deskripsi',
            'tanggal' => 'Tanggal',
            'waktu' => 'Waktu',
            'lokasi' => 'Lokasi',
            'penyelenggara' => 'Penyelenggara',
            'banner' => 'Banner Event',
            'template_sertifikat' => 'Template Sertifikat',
            'is_berbayar' => 'Tipe Kegiatan',
            'harga' => 'Harga',
            'nama_bank' => 'Nama Bank',
            'no_rekening' => 'No. Rekening',
            'atas_nama' => 'Atas Nama',
        ];
    }
}
