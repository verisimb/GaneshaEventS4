import { Head, Link, usePage } from '@inertiajs/react';
import { CalendarDays, MapPin, ArrowRight, Ticket, Users, Award, ImageOff } from 'lucide-react';
import { login, register } from '@/routes';
import { show as kegiatanShow } from '@/actions/App/Http/Controllers/UserKegiatanController';

type KegiatanPreview = {
    id: number;
    judul: string;
    tanggal: string | null;
    waktu: string | null;
    lokasi: string;
    penyelenggara: string;
    is_berbayar: boolean;
    harga: number | null;
    banner_url: string | null;
};

function formatRupiah(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
}

function EventCard({ kegiatan }: { kegiatan: KegiatanPreview }) {
    return (
        <a
    href={kegiatanShow.url(kegiatan.id)}
            className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:shadow-xl hover:shadow-black/20"
        >
            {/* Banner */}
            <div className="relative aspect-video overflow-hidden bg-white/5">
                {kegiatan.banner_url ? (
                    <img
                        src={kegiatan.banner_url}
                        alt={kegiatan.judul}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <ImageOff className="h-10 w-10 opacity-20 text-white" />
                    </div>
                )}
                {/* Badge */}
                <div className="absolute top-3 left-3">
                    {kegiatan.is_berbayar ? (
                        <span className="rounded-full bg-amber-500/90 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                            💳 {kegiatan.harga ? formatRupiah(kegiatan.harga) : 'Berbayar'}
                        </span>
                    ) : (
                        <span className="rounded-full bg-emerald-500/90 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                            🎟️ Gratis
                        </span>
                    )}
                </div>
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col p-4">
                <h3 className="line-clamp-2 text-sm font-semibold text-white leading-snug">
                    {kegiatan.judul}
                </h3>
                <p className="mt-1 text-xs text-white/50 line-clamp-1">{kegiatan.penyelenggara}</p>

                <div className="mt-3 space-y-1.5">
                    {kegiatan.tanggal && (
                        <div className="flex items-center gap-1.5 text-xs text-white/60">
                            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                            <span>{kegiatan.tanggal}{kegiatan.waktu && `, ${kegiatan.waktu} WITA`}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1.5 text-xs text-white/60">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="line-clamp-1">{kegiatan.lokasi}</span>
                    </div>
                </div>

                <div className="mt-4 flex items-center gap-1 text-xs font-medium text-indigo-400 transition-colors group-hover:text-indigo-300">
                    Daftar Sekarang
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
            </div>
        </a>
    );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="rounded-xl bg-indigo-500/20 p-3 text-indigo-400">{icon}</div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-white/60">{label}</p>
        </div>
    );
}

export default function Welcome({
    canRegister = true,
    upcomingEvents = [],
}: {
    canRegister?: boolean;
    upcomingEvents?: KegiatanPreview[];
}) {
    const { auth } = usePage().props as { auth: { user: { role: string } | null } };

    const dashboardHref = auth.user?.role === 'organizer'
        ? '/dashboard'
        : '/user/kegiatan';

    return (
        <>
            <Head title="Ganesha Event — Platform Event Kampus" />

            <div className="min-h-screen bg-[#0f0f1a] text-white selection:bg-indigo-500/30">
                {/* ===== NAVBAR ===== */}
                <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0f0f1a]/80 backdrop-blur-xl">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                                <Ticket className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-sm font-bold tracking-tight">Ganesha Event</span>
                        </div>

                        {/* Nav links */}
                        <nav className="flex items-center gap-2">
                            {auth.user ? (
                                <a
                                    href={dashboardHref}
                                    className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                                >
                                    {auth.user.role === 'organizer' ? 'Dashboard' : 'Kegiatan Saya'}
                                </a>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="rounded-lg px-4 py-1.5 text-sm font-medium text-white/70 transition-colors hover:text-white"
                                    >
                                        Masuk
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                                        >
                                            Daftar
                                        </Link>
                                    )}
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* ===== HERO ===== */}
                <section className="relative overflow-hidden px-4 py-24 text-center">
                    {/* Background blobs */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[120px]" />
                        <div className="absolute top-20 right-0 h-[300px] w-[300px] rounded-full bg-purple-600/10 blur-[100px]" />
                        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-cyan-600/8 blur-[100px]" />
                    </div>

                    <div className="relative mx-auto max-w-3xl">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-400">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400" />
                            Platform Event Kampus Ganesha
                        </div>

                        <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                            Satu Platform untuk{' '}
                            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                Semua Event
                            </span>{' '}
                            Kampus
                        </h1>

                        <p className="mx-auto mb-8 max-w-xl text-base text-white/60 sm:text-lg">
                            Temukan, daftarkan diri, dan kelola kegiatan kampus dengan mudah — mulai dari seminar,
                            workshop, hingga kompetisi, semua ada di sini.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-3">
                            {auth.user ? (
                                <a
                                    href="/user/kegiatan"
                                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/40"
                                >
                                    Jelajahi Kegiatan
                                    <ArrowRight className="h-4 w-4" />
                                </a>
                            ) : (
                                <>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/40"
                                        >
                                            Mulai Sekarang
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    )}
                                    <Link
                                        href={login()}
                                        className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white/80 transition-all hover:border-white/30 hover:text-white"
                                    >
                                        Sudah punya akun? Masuk
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* ===== STATS ===== */}
                <section className="px-4 pb-16">
                    <div className="mx-auto grid max-w-3xl grid-cols-3 gap-4">
                        <StatCard icon={<Ticket className="h-5 w-5" />} label="Event Tersedia" value={String(upcomingEvents.length || '—')} />
                        <StatCard icon={<Users className="h-5 w-5" />} label="Terbuka untuk Umum" value="✓" />
                        <StatCard icon={<Award className="h-5 w-5" />} label="Sertifikat Digital" value="✓" />
                    </div>
                </section>

                {/* ===== UPCOMING EVENTS ===== */}
                {upcomingEvents.length > 0 && (
                    <section className="px-4 pb-24">
                        <div className="mx-auto max-w-6xl">
                            <div className="mb-8 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">Kegiatan Mendatang</h2>
                                    <p className="mt-1 text-sm text-white/50">Event yang segera diselenggarakan</p>
                                </div>
                                <a
                                    href="/user/kegiatan"
                                    className="flex items-center gap-1 text-sm text-indigo-400 transition-colors hover:text-indigo-300"
                                >
                                    Lihat semua
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </a>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {upcomingEvents.map((k) => (
                                    <EventCard key={k.id} kegiatan={k} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* ===== CTA BANNER ===== */}
                {!auth.user && (
                    <section className="px-4 pb-24">
                        <div className="mx-auto max-w-4xl rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-600/20 to-purple-600/10 p-10 text-center backdrop-blur-sm">
                            <h2 className="mb-3 text-2xl font-bold">Siap bergabung?</h2>
                            <p className="mb-6 text-sm text-white/60">
                                Daftarkan diri sekarang dan mulai ikuti berbagai kegiatan seru di kampus.
                            </p>
                            <div className="flex flex-wrap justify-center gap-3">
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                                    >
                                        Daftar Gratis
                                    </Link>
                                )}
                                <Link
                                    href={login()}
                                    className="rounded-xl border border-white/15 px-6 py-2.5 text-sm font-semibold text-white/80 transition-colors hover:border-white/30 hover:text-white"
                                >
                                    Masuk
                                </Link>
                            </div>
                        </div>
                    </section>
                )}

                {/* ===== FOOTER ===== */}
                <footer className="border-t border-white/5 px-4 py-6 text-center text-xs text-white/30">
                    © {new Date().getFullYear()} Ganesha Event. Platform event kampus.
                </footer>
            </div>
        </>
    );
}
