import { Head, Link } from '@inertiajs/react';
import { CalendarDays, MapPin, CheckCircle2, Clock, XCircle, Ticket } from 'lucide-react';

type TiketStatus = 'pending' | 'confirmed' | 'rejected';

type Tiket = {
    id: number;
    nama_lengkap: string;
    status: TiketStatus;
    kegiatan: {
        id: number;
        judul: string;
        tanggal: string;
        waktu: string | null;
        lokasi: string;
        banner_url: string | null;
        is_berbayar: boolean;
    };
};

function StatusBadge({ status }: { status: TiketStatus }) {
    if (status === 'confirmed') {
        return (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                <CheckCircle2 className="h-3 w-3" />
                Terkonfirmasi
            </span>
        );
    }

    if (status === 'rejected') {
        return (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-500/20 dark:text-red-400">
                <XCircle className="h-3 w-3" />
                Ditolak
            </span>
        );
    }

    return (
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
            <Clock className="h-3 w-3" />
            Menunggu Konfirmasi
        </span>
    );
}

function TiketCard({ tiket }: { tiket: Tiket }) {
    const isDimmed = tiket.status === 'rejected';

    return (
        <div
            className={`border-sidebar-border/70 dark:border-sidebar-border bg-card overflow-hidden rounded-xl border shadow-sm transition-shadow hover:shadow-md ${isDimmed ? 'opacity-60' : ''}`}
        >
            <div className="flex flex-col sm:flex-row">
                {/* Banner thumbnail */}
                <div className="relative h-32 w-full shrink-0 overflow-hidden bg-muted sm:h-auto sm:w-36">
                    {tiket.kegiatan.banner_url ? (
                        <img
                            src={tiket.kegiatan.banner_url}
                            alt={tiket.kegiatan.judul}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <Ticket className="text-muted-foreground/30 h-10 w-10" />
                        </div>
                    )}

                    <div className="absolute top-2 left-2">
                        {tiket.kegiatan.is_berbayar ? (
                            <span className="inline-flex items-center rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                                💳 Berbayar
                            </span>
                        ) : (
                            <span className="inline-flex items-center rounded-full bg-emerald-500/80 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                                🎟️ Gratis
                            </span>
                        )}
                    </div>
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col justify-between p-4">
                    <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                            <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
                                {tiket.kegiatan.judul}
                            </h3>
                            <StatusBadge status={tiket.status} />
                        </div>

                        <p className="text-muted-foreground text-xs">
                            Atas nama: <span className="text-foreground font-medium">{tiket.nama_lengkap}</span>
                        </p>

                        <div className="space-y-1">
                            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                                <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                                <span>
                                    {tiket.kegiatan.tanggal}
                                    {tiket.kegiatan.waktu && `, ${tiket.kegiatan.waktu} WITA`}
                                </span>
                            </div>
                            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                                <MapPin className="h-3.5 w-3.5 shrink-0" />
                                <span className="line-clamp-1">{tiket.kegiatan.lokasi}</span>
                            </div>
                        </div>

                        {tiket.status === 'pending' && (
                            <p className="text-muted-foreground border-amber-200 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/5 mt-2 rounded-lg border px-3 py-2 text-[11px] leading-relaxed">
                                Bukti pembayaran Anda sedang ditinjau oleh penyelenggara. Harap tunggu konfirmasi.
                            </p>
                        )}

                        {tiket.status === 'rejected' && (
                            <p className="text-muted-foreground border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/5 mt-2 rounded-lg border px-3 py-2 text-[11px] leading-relaxed">
                                Pendaftaran Anda tidak dapat dikonfirmasi. Silakan hubungi penyelenggara untuk informasi lebih lanjut.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Tiket({ tikets }: { tikets: Tiket[] }) {
    const confirmed = tikets.filter((t) => t.status === 'confirmed');
    const pending = tikets.filter((t) => t.status === 'pending');
    const rejected = tikets.filter((t) => t.status === 'rejected');

    return (
        <>
            <Head title="Tiket" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">Tiket Saya</h1>
                        <p className="text-muted-foreground mt-0.5 text-xs">
                            {tikets.length > 0
                                ? `${confirmed.length} terkonfirmasi · ${pending.length} menunggu · ${rejected.length} ditolak`
                                : 'Daftar semua tiket kegiatan yang Anda miliki.'}
                        </p>
                    </div>
                </div>

                {tikets.length === 0 ? (
                    <div className="border-sidebar-border/70 flex min-h-[40vh] flex-col items-center justify-center gap-3 rounded-xl border border-dashed">
                        <Ticket className="text-muted-foreground/40 h-10 w-10" />
                        <div className="text-center">
                            <p className="text-muted-foreground text-sm">Anda belum memiliki tiket.</p>
                            <p className="text-muted-foreground mt-0.5 text-xs">
                                Daftar ke kegiatan untuk mendapatkan tiket.
                            </p>
                        </div>
                        <Link
                            href="/user/kegiatan"
                            className="text-primary hover:underline mt-1 text-xs font-medium"
                        >
                            Jelajahi Kegiatan →
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {tikets.map((tiket) => (
                            <TiketCard key={tiket.id} tiket={tiket} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

Tiket.layout = {
    breadcrumbs: [
        {
            title: 'Tiket',
            href: '/user/tiket',
        },
    ],
};
