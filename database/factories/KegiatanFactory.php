<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Kegiatan>
 */
class KegiatanFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'judul' => fake()->sentence(4),
            'deskripsi' => fake()->paragraph(),
            'tanggal' => fake()->dateTimeBetween('+1 week', '+3 months'),
            'waktu' => '09:00',
            'lokasi' => fake()->city(),
            'penyelenggara' => fake()->company(),
            'banner' => null,
            'template_sertifikat' => null,
            'is_berbayar' => false,
            'harga' => null,
            'nama_bank' => null,
            'no_rekening' => null,
            'atas_nama' => null,
            'is_selesai' => false,
        ];
    }

    public function berbayar(int $harga = 100000): static
    {
        return $this->state(fn (array $attributes) => [
            'is_berbayar' => true,
            'harga' => $harga,
            'nama_bank' => 'BCA',
            'no_rekening' => '1234567890',
            'atas_nama' => fake()->name(),
        ]);
    }

    public function selesai(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_selesai' => true,
        ]);
    }
}
