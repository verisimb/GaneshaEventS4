<?php

use App\Models\Kegiatan;
use App\Models\Pendaftaran;
use App\Models\User;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Http\UploadedFile;

uses(LazilyRefreshDatabase::class);

// --- store: auto-confirm ---

test('registering for a free event auto-confirms the pendaftaran', function () {
    $user = User::factory()->create();
    $kegiatan = Kegiatan::factory()->create(['is_berbayar' => false]);

    $this->actingAs($user)->post(route('user.pendaftaran.store', $kegiatan), [
        'nama_lengkap' => 'Budi Santoso',
        'email' => 'budi@example.com',
        'no_hp' => '081234567890',
    ]);

    $this->assertDatabaseHas('pendaftarans', [
        'user_id' => $user->id,
        'kegiatan_id' => $kegiatan->id,
        'status' => 'confirmed',
    ]);
});

test('registering for a paid event sets status to pending', function () {
    $user = User::factory()->create();
    $kegiatan = Kegiatan::factory()->berbayar()->create();

    $this->actingAs($user)->post(route('user.pendaftaran.store', $kegiatan), [
        'nama_lengkap' => 'Budi Santoso',
        'email' => 'budi@example.com',
        'no_hp' => '081234567890',
        'bukti_pembayaran' => UploadedFile::fake()->image('bukti.jpg'),
    ]);

    $this->assertDatabaseHas('pendaftarans', [
        'user_id' => $user->id,
        'kegiatan_id' => $kegiatan->id,
        'status' => 'pending',
    ]);
});

// --- pendaftar index: scoping ---

test('organizer sees only pendaftaran for their own kegiatan', function () {
    $organizer = User::factory()->organizer()->create();
    $otherOrganizer = User::factory()->organizer()->create();

    $ownKegiatan = Kegiatan::factory()->for($organizer)->create();
    $otherKegiatan = Kegiatan::factory()->for($otherOrganizer)->create();

    $ownPendaftaran = Pendaftaran::factory()->for($ownKegiatan, 'kegiatan')->create();
    $otherPendaftaran = Pendaftaran::factory()->for($otherKegiatan, 'kegiatan')->create();

    $response = $this->actingAs($organizer)->get(route('pendaftar'));

    $response->assertOk();
    $response->assertInertia(
        fn ($page) => $page
            ->component('pendaftar')
            ->where('pendaftarans.0.id', $ownPendaftaran->id)
            ->has('pendaftarans', 1),
    );
});

test('organizer can filter pendaftaran by kegiatan_id', function () {
    $organizer = User::factory()->organizer()->create();

    $kegiatan1 = Kegiatan::factory()->for($organizer)->create();
    $kegiatan2 = Kegiatan::factory()->for($organizer)->create();

    Pendaftaran::factory()->for($kegiatan1, 'kegiatan')->create();
    Pendaftaran::factory()->for($kegiatan2, 'kegiatan')->create();

    $response = $this->actingAs($organizer)
        ->get(route('pendaftar', ['kegiatan_id' => $kegiatan1->id]));

    $response->assertOk();
    $response->assertInertia(
        fn ($page) => $page->has('pendaftarans', 1),
    );
});

test('organizer can filter pendaftaran by status', function () {
    $organizer = User::factory()->organizer()->create();
    $kegiatan = Kegiatan::factory()->for($organizer)->create();

    Pendaftaran::factory()->for($kegiatan, 'kegiatan')->create(['status' => 'pending']);
    $confirmed = Pendaftaran::factory()->for($kegiatan, 'kegiatan')->confirmed()->create();

    $response = $this->actingAs($organizer)
        ->get(route('pendaftar', ['status' => 'confirmed']));

    $response->assertOk();
    $response->assertInertia(
        fn ($page) => $page
            ->has('pendaftarans', 1)
            ->where('pendaftarans.0.id', $confirmed->id),
    );
});

test('organizer can search pendaftaran by nama email and phone', function () {
    $organizer = User::factory()->organizer()->create();
    $kegiatan = Kegiatan::factory()->for($organizer)->create();

    Pendaftaran::factory()->for($kegiatan, 'kegiatan')->create([
        'nama_lengkap' => 'Siti Rahayu',
        'email' => 'siti@example.com',
        'no_hp' => '0811111111',
    ]);
    $target = Pendaftaran::factory()->for($kegiatan, 'kegiatan')->create([
        'nama_lengkap' => 'Andi Pratama',
        'email' => 'andi@example.com',
        'no_hp' => '0822222222',
    ]);

    $response = $this->actingAs($organizer)
        ->get(route('pendaftar', ['search' => 'andi@example.com']));

    $response->assertOk();
    $response->assertInertia(
        fn ($page) => $page
            ->has('pendaftarans', 1)
            ->where('pendaftarans.0.id', $target->id),
    );
});

// --- confirm ---

test('organizer can confirm a pendaftaran for their kegiatan', function () {
    $organizer = User::factory()->organizer()->create();
    $kegiatan = Kegiatan::factory()->for($organizer)->create();
    $pendaftaran = Pendaftaran::factory()->for($kegiatan, 'kegiatan')->create(['status' => 'pending']);

    $this->actingAs($organizer)
        ->patch(route('pendaftar.confirm', $pendaftaran))
        ->assertRedirect();

    expect($pendaftaran->fresh()->status)->toBe('confirmed');
});

test('organizer cannot confirm a pendaftaran belonging to another organizer', function () {
    $organizer = User::factory()->organizer()->create();
    $otherOrganizer = User::factory()->organizer()->create();

    $otherKegiatan = Kegiatan::factory()->for($otherOrganizer)->create();
    $pendaftaran = Pendaftaran::factory()->for($otherKegiatan, 'kegiatan')->create(['status' => 'pending']);

    $this->actingAs($organizer)
        ->patch(route('pendaftar.confirm', $pendaftaran))
        ->assertForbidden();

    expect($pendaftaran->fresh()->status)->toBe('pending');
});

// --- reject ---

test('organizer can reject a pendaftaran for their kegiatan', function () {
    $organizer = User::factory()->organizer()->create();
    $kegiatan = Kegiatan::factory()->for($organizer)->create();
    $pendaftaran = Pendaftaran::factory()->for($kegiatan, 'kegiatan')->create(['status' => 'pending']);

    $this->actingAs($organizer)
        ->patch(route('pendaftar.reject', $pendaftaran))
        ->assertRedirect();

    expect($pendaftaran->fresh()->status)->toBe('rejected');
});

test('organizer cannot reject a pendaftaran belonging to another organizer', function () {
    $organizer = User::factory()->organizer()->create();
    $otherOrganizer = User::factory()->organizer()->create();

    $otherKegiatan = Kegiatan::factory()->for($otherOrganizer)->create();
    $pendaftaran = Pendaftaran::factory()->for($otherKegiatan, 'kegiatan')->create(['status' => 'pending']);

    $this->actingAs($organizer)
        ->patch(route('pendaftar.reject', $pendaftaran))
        ->assertForbidden();
});

// --- destroy ---

test('organizer can delete a pendaftaran for their kegiatan', function () {
    $organizer = User::factory()->organizer()->create();
    $kegiatan = Kegiatan::factory()->for($organizer)->create();
    $pendaftaran = Pendaftaran::factory()->for($kegiatan, 'kegiatan')->create();

    $this->actingAs($organizer)
        ->delete(route('pendaftar.destroy', $pendaftaran))
        ->assertRedirect();

    $this->assertDatabaseMissing('pendaftarans', [
        'id' => $pendaftaran->id,
    ]);
});

test('organizer cannot delete a pendaftaran belonging to another organizer', function () {
    $organizer = User::factory()->organizer()->create();
    $otherOrganizer = User::factory()->organizer()->create();
    $otherKegiatan = Kegiatan::factory()->for($otherOrganizer)->create();
    $pendaftaran = Pendaftaran::factory()->for($otherKegiatan, 'kegiatan')->create();

    $this->actingAs($organizer)
        ->delete(route('pendaftar.destroy', $pendaftaran))
        ->assertForbidden();
});

// --- tiket page ---

test('tiket page only shows confirmed pendaftaran for the current user', function () {
    $user = User::factory()->create();
    $kegiatan = Kegiatan::factory()->create();

    $confirmed = Pendaftaran::factory()->for($user)->for($kegiatan, 'kegiatan')->confirmed()->create();
    $pending = Pendaftaran::factory()->for($user)->for($kegiatan, 'kegiatan')->create(['status' => 'pending']);

    $response = $this->actingAs($user)->get(route('user.tiket'));

    $response->assertOk();
    $response->assertInertia(
        fn ($page) => $page
            ->component('user/tiket')
            ->has('tikets', 1)
            ->where('tikets.0.id', $confirmed->id),
    );
});

test('tiket page does not show other users confirmed pendaftaran', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $kegiatan = Kegiatan::factory()->create();

    Pendaftaran::factory()->for($otherUser)->for($kegiatan, 'kegiatan')->confirmed()->create();

    $response = $this->actingAs($user)->get(route('user.tiket'));

    $response->assertOk();
    $response->assertInertia(
        fn ($page) => $page->has('tikets', 0),
    );
});
