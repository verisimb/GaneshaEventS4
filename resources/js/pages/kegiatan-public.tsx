import { Head, Link } from '@inertiajs/react';
import {
    CalendarDays,
    MapPin,
    ImageOff,
    CreditCard,
    LogIn,
    UserPlus,
    ArrowLeft,
} from 'lucide-react';
import { login, register } from '@/routes';
import { Button } from '@/components/ui/button';
import AppLogo from '@/components/app-logo';

type KegiatanData = {
    id: number;
    judul: string;
    deskripsi: string | null;
    tanggal: string | null;
    waktu: string | null;
    lokasi: string;
    penyelenggara: string;
    is_berbayar: boolean;
    harga: number | null;
    nama_bank: string | null;
    no_rekening: string | null;
    atas_nama: string | null;
    banner_url: string | null;
};

function formatRupiah(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
}

export default function KegiatanPublic({
    kegiatan,
    canRegister = true,
}: {
    kegiatan: KegiatanData;
    canRegister?: boolean;
}) {
    return (
        <>
            <Head title={kegiatan.judul} />

            <div className="bg-background text-foreground min-h-screen">
                {/* Navbar */}
                <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur-sm">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                        <Link href="/" className="flex items-center gap-2">
                            <AppLogo />
                        </Link>
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

                {/* Breadcrumb back */}
                <div className="mx-auto max-w-6xl px-4 pt-4">
                    <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Kembali ke Beranda
                    </Link>
                </div>

                {/* Content */}
                <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-6 lg:flex-row">
                    {/* Kolom Kiri */}
                    <div className="flex-1 space-y-6">
                        {/* Banner */}
                        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted">
                            {kegiatan.banner_url ? (
                                <img
                                    src={kegiatan.banner_url}
                                    alt={kegiatan.judul}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground/50">
                                    <ImageOff className="h-12 w-12" />
                                    <span className="text-sm">Gambar / Banner tidak tersedia</span>
                                </div>
                            )}
                            <div className="absolute top-4 left-4">
                                {kegiatan.is_berbayar ? (
                                    <span className="inline-flex items-center rounded-full bg-black/70 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-sm shadow-sm">
                                        💳 {kegiatan.harga ? formatRupiah(kegiatan.harga) : 'Berbayar'}
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center rounded-full bg-emerald-500/90 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-sm shadow-sm">
                                        🎟️ Gratis
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Judul & Penyelenggara */}
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">{kegiatan.judul}</h1>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Diselenggarakan oleh:{' '}
                                <span className="font-semibold text-foreground">{kegiatan.penyelenggara}</span>
                            </p>
                        </div>

                        {/* Meta */}
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                                <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                                <div>
                                    <p className="text-sm font-medium">Tanggal & Waktu</p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {kegiatan.tanggal}
                                        {kegiatan.waktu && <><br />{kegiatan.waktu} WITA</>}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                                <div>
                                    <p className="text-sm font-medium">Lokasi Kegiatan</p>
                                    <p className="mt-1 text-sm text-muted-foreground">{kegiatan.lokasi}</p>
                                </div>
                            </div>
                        </div>

                        {/* Deskripsi */}
                        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                            <h3 className="mb-3 text-base font-semibold">Deskripsi Kegiatan</h3>
                            {kegiatan.deskripsi ? (
                                <div
                                    className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground"
                                    dangerouslySetInnerHTML={{ __html: kegiatan.deskripsi }}
                                />
                            ) : (
                                <p className="text-muted-foreground leading-relaxed">
                                    Belum ada deskripsi yang ditambahkan untuk kegiatan ini.
                                </p>
                            )}
                        </div>

                        {/* Pembayaran */}
                        {kegiatan.is_berbayar && (
                            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 dark:border-amber-500/20 dark:bg-amber-500/5">
                                <div className="mb-3 flex items-center gap-2 font-semibold text-amber-700 dark:text-amber-400">
                                    <CreditCard className="h-5 w-5" />
                                    Informasi Pembayaran
                                </div>
                                <div className="space-y-1 text-sm text-amber-800 dark:text-amber-200">
                                    <p>Total Tagihan: <strong className="text-lg">{kegiatan.harga ? formatRupiah(kegiatan.harga) : '-'}</strong></p>
                                    <p>Bank Tujuan: <strong>{kegiatan.nama_bank || '-'}</strong></p>
                                    <p>Rekening: <strong>{kegiatan.no_rekening || '-'}</strong></p>
                                    <p>Atas Nama: <strong>{kegiatan.atas_nama || '-'}</strong></p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Kolom Kanan: CTA */}
                    <div className="w-full lg:w-96">
                        <div className="sticky top-20 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                            <div className="border-b border-border bg-muted/40 px-6 py-4">
                                <h2 className="text-lg font-semibold">Ingin Bergabung?</h2>
                                <p className="text-xs text-muted-foreground">
                                    Masuk atau daftar untuk mendaftarkan diri ke kegiatan ini.
                                </p>
                            </div>
                            <div className="space-y-3 p-6">
                                <Link href={login()} className="block">
                                    <Button className="w-full gap-2">
                                        <LogIn className="h-4 w-4" />
                                        Masuk ke Akun
                                    </Button>
                                </Link>
                                {canRegister && (
                                    <Link href={register()} className="block">
                                        <Button variant="outline" className="w-full gap-2">
                                            <UserPlus className="h-4 w-4" />
                                            Daftar Akun Baru
                                        </Button>
                                    </Link>
                                )}
                                <p className="text-center text-[10px] text-muted-foreground">
                                    Sudah memiliki akun? Masuk untuk mendaftar ke kegiatan ini.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-12 border-t border-border/40 px-4 py-6 text-center text-xs text-muted-foreground">
                    © {new Date().getFullYear()} Ganesha Event — Platform Event Kampus
                </footer>
            </div>
        </>
    );
}
