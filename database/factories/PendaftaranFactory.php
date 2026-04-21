<?php

namespace Database\Factories;

use App\Models\Kegiatan;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<\App\Models\Pendaftaran>
 */
class PendaftaranFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id'          => User::factory(),
            'kegiatan_id'      => Kegiatan::factory(),
            'nama_lengkap'     => fake()->name(),
            'email'            => fake()->safeEmail(),
            'no_hp'            => fake()->numerify('08##########'),
            'bukti_pembayaran' => null,
            'status'           => 'pending',
            'ticket_code'      => null,
            'is_attended'      => false,
        ];
    }

    public function confirmed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status'      => 'confirmed',
            'ticket_code' => (string) Str::uuid(),
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
        ]);
    }
}
