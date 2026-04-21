import { Head, Link } from '@inertiajs/react';
import { CalendarDays, MapPin, ArrowRight, Ticket, ImageOff, LogIn, UserPlus } from 'lucide-react';
import { login, register } from '@/routes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
        <Link
            href={`/kegiatan/${kegiatan.id}`}
            className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card text-left shadow-sm transition-shadow hover:shadow-md"
        >
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
                {kegiatan.banner_url ? (
                    <img
                        src={kegiatan.banner_url}
                        alt={kegiatan.judul}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground/40">
                        <ImageOff className="h-8 w-8" />
                        <span className="text-xs">Tidak ada banner</span>
                    </div>
                )}
                <div className="absolute top-2.5 left-2.5">
                    {kegiatan.is_berbayar ? (
                        <span className="rounded-full bg-black/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                            💳 {kegiatan.harga ? formatRupiah(kegiatan.harga) : 'Berbayar'}
                        </span>
                    ) : (
                        <span className="rounded-full bg-emerald-500/90 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                            🎟️ Gratis
                        </span>
                    )}
                </div>
            </div>

            <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{kegiatan.judul}</h3>
                <p className="line-clamp-1 text-xs text-muted-foreground">{kegiatan.penyelenggara}</p>

                <div className="mt-1 space-y-1">
                    {kegiatan.tanggal && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                            <span>{kegiatan.tanggal}{kegiatan.waktu && `, ${kegiatan.waktu} WITA`}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="line-clamp-1">{kegiatan.lokasi}</span>
                    </div>
                </div>

                <div className="mt-2 flex items-center gap-1 text-xs font-medium text-primary">
                    Lihat Detail
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
            </div>
        </Link>
    );
}

export default function Welcome({
    canRegister = true,
    upcomingEvents = [],
}: {
    canRegister?: boolean;
    upcomingEvents?: KegiatanPreview[];
}) {
    return (
        <>
            <Head title="Ganesha Event — Platform Event Kampus">
                <meta name="description" content="Platform event kampus Ganesha. Temukan dan daftarkan diri ke berbagai kegiatan seminar, workshop, dan kompetisi." />
            </Head>

            <div className="bg-background text-foreground min-h-screen">
                {/* Navbar */}
                <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur-sm">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                <Ticket className="h-4 w-4 text-primary-foreground" />
                            </div>
                            <span className="text-sm font-bold">Ganesha Event</span>
                        </div>
                        <nav className="flex items-center gap-2">
                            <Link href={login()}>
                                <Button variant="ghost" size="sm" className="gap-1.5">
                                    <LogIn className="h-3.5 w-3.5" />
                                    Masuk
                                </Button>
                            </Link>
                            {canRegister && (
                                <Link href={register()}>
                                    <Button size="sm" className="gap-1.5">
                                        <UserPlus className="h-3.5 w-3.5" />
                                        Daftar
                                    </Button>
                                </Link>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero */}
                <section className="border-b border-border/40 px-4 py-16 text-center">
                    <div className="mx-auto max-w-2xl">
                        <Badge variant="secondary" className="mb-4">
                            Platform Event Kampus Ganesha
                        </Badge>
                        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                            Temukan Event Kampus
                            <br />
                            <span className="text-primary">yang Tepat untuk Kamu</span>
                        </h1>
                        <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground sm:text-base">
                            Seminar, workshop, kompetisi, dan berbagai kegiatan kampus ada di satu tempat.
                            Daftar akun dan mulai ikut sekarang.
                        </p>
                        <div className="mt-6 flex flex-wrap justify-center gap-3">
                            {canRegister && (
                                <Link href={register()}>
                                    <Button className="gap-2">
                                        <UserPlus className="h-4 w-4" />
                                        Daftar Gratis
                                    </Button>
                                </Link>
                            )}
                            <Link href={login()}>
                                <Button variant="outline" className="gap-2">
                                    <LogIn className="h-4 w-4" />
                                    Sudah punya akun? Masuk
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Grid Kegiatan */}
                <section className="mx-auto max-w-6xl px-4 py-12">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold">Kegiatan Mendatang</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Klik kegiatan untuk melihat detail dan cara pendaftaran.
                        </p>
                    </div>

                    {upcomingEvents.length === 0 ? (
                        <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-border">
                            <p className="text-sm text-muted-foreground">Belum ada kegiatan yang tersedia.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {upcomingEvents.map((k) => (
                                <EventCard key={k.id} kegiatan={k} />
                            ))}
                        </div>
                    )}
                </section>

                {/* Footer */}
                <footer className="border-t border-border/40 px-4 py-6 text-center text-xs text-muted-foreground">
                    © {new Date().getFullYear()} Ganesha Event — Platform Event Kampus
                </footer>
            </div>
        </>
    );
}
