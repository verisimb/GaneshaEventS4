import { Head, Link } from '@inertiajs/react';
import { CalendarDays, MapPin, CheckCircle2, Clock, XCircle, Ticket, QrCode, UserCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import EventCardBanner from '@/components/user/event-card-banner';

type TiketStatus = 'pending' | 'confirmed' | 'rejected';

type Tiket = {
    id: number;
    nama_lengkap: string;
    status: TiketStatus;
    ticket_code: string | null;
    is_attended: boolean;
    kegiatan: {
        id: number;
        judul: string;
        tanggal: string;
        waktu: string | null;
        lokasi: string;
        banner_url: string | null;
        is_berbayar: boolean;
        is_selesai: boolean;
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

function QRModal({ tiket, open, onClose }: { tiket: Tiket; open: boolean; onClose: () => void }) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-center text-base">Tiket QR Code</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center gap-4 py-2">
                    {/* QR Code */}
                    <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
                        {tiket.ticket_code ? (
                            <QRCodeSVG
                                value={tiket.ticket_code}
                                size={200}
                                level="M"
                                includeMargin={false}
                            />
                        ) : (
                            <div className="flex h-[200px] w-[200px] items-center justify-center text-muted-foreground text-sm">
                                QR tidak tersedia
                            </div>
                        )}
                    </div>

                    {/* Nama & Acara */}
                    <div className="w-full space-y-1 text-center">
                        <p className="text-sm font-semibold">{tiket.nama_lengkap}</p>
                        <p className="line-clamp-2 text-xs text-muted-foreground">{tiket.kegiatan.judul}</p>
                    </div>

                    {/* Ticket code */}
                    <div className="w-full rounded-lg border border-dashed border-border bg-muted/50 px-3 py-2 text-center">
                        <p className="text-[10px] text-muted-foreground">Kode Tiket</p>
                        <p className="font-mono text-xs font-medium tracking-wider break-all">
                            {tiket.ticket_code}
                        </p>
                    </div>

                    {/* Absensi badge */}
                    {tiket.is_attended && (
                        <div className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                            <UserCheck className="h-3.5 w-3.5" />
                            Sudah Hadir
                        </div>
                    )}

                    <p className="text-center text-[10px] text-muted-foreground">
                        Tunjukkan QR Code ini kepada panitia saat hari pelaksanaan kegiatan.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function TiketCard({ tiket }: { tiket: Tiket }) {
    const [showQR, setShowQR] = useState(false);
    const isDimmed = tiket.status === 'rejected';

    return (
        <>
            <div
                className={`group border-sidebar-border/70 dark:border-sidebar-border bg-card overflow-hidden rounded-xl border shadow-sm transition-shadow hover:shadow-md ${isDimmed ? 'opacity-60' : ''}`}
            >
                <div className="flex h-full flex-col">
                    {/* Banner thumbnail */}
                    <EventCardBanner
                        bannerUrl={tiket.kegiatan.banner_url}
                        title={tiket.kegiatan.judul}
                        isBerbayar={tiket.kegiatan.is_berbayar}
                    />

                    {/* Info */}
                    <div className="flex flex-1 flex-col gap-3 p-4">
                        <div className="space-y-2 flex-1">
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

                        {/* Footer: absensi badge + QR button */}
                        {tiket.status === 'confirmed' && (
                            <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3">
                                <div className="flex items-center gap-1.5">
                                    {tiket.is_attended ? (
                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                            <UserCheck className="h-3.5 w-3.5" />
                                            Sudah Hadir
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                            <Clock className="h-3.5 w-3.5" />
                                            Belum Hadir
                                        </span>
                                    )}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 gap-1.5 text-xs"
                                    onClick={() => setShowQR(true)}
                                >
                                    <QrCode className="h-3.5 w-3.5" />
                                    Lihat QR
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {tiket.status === 'confirmed' && (
                <QRModal tiket={tiket} open={showQR} onClose={() => setShowQR(false)} />
            )}
        </>
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
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
