import { Head, Link, router } from '@inertiajs/react';
import { Plus, CalendarDays, MapPin, ImageOff, Pencil, Trash2, CheckCircle2, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import {
    create as kegiatanCreate,
    edit as kegiatanEdit,
    destroy as kegiatanDestroy,
    complete as kegiatanComplete,
} from '@/actions/App/Http/Controllers/KegiatanController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { dashboard } from '@/routes';

type Kegiatan = {
    id: number;
    judul: string;
    tanggal: string;
    waktu: string;
    lokasi: string;
    banner_url: string | null;
    is_berbayar: boolean;
    harga: number | null;
    is_selesai: boolean;
};

function formatRupiah(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
}

function DeleteDialog({
    kegiatan,
    open,
    onOpenChange,
}: {
    kegiatan: Kegiatan | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [deleting, setDeleting] = useState(false);

    function handleDelete() {
        if (!kegiatan) {
            return;
        }
        setDeleting(true);
        router.delete(kegiatanDestroy.url(kegiatan.id), {
            onFinish: () => {
                setDeleting(false);
                onOpenChange(false);
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Hapus Kegiatan</DialogTitle>
                    <DialogDescription>
                        Apakah Anda yakin ingin menghapus{' '}
                        <span className="text-foreground font-semibold">"{kegiatan?.judul}"</span>? Tindakan ini tidak dapat
                        dibatalkan.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={deleting}>
                        Batal
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                        {deleting ? 'Menghapus...' : 'Hapus'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function KegiatanCard({
    kegiatan,
    onDelete,
}: {
    kegiatan: Kegiatan;
    onDelete: (k: Kegiatan) => void;
}) {
    const [completing, setCompleting] = useState(false);

    function handleComplete() {
        setCompleting(true);
        router.patch(
            kegiatanComplete.url(kegiatan.id),
            {},
            {
                onFinish: () => setCompleting(false),
            },
        );
    }

    return (
        <div className="group flex flex-col overflow-hidden rounded-xl border border-sidebar-border/70 bg-card transition-shadow hover:shadow-md dark:border-sidebar-border">
            {/* Banner */}
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
                {kegiatan.banner_url ? (
                    <img
                        src={kegiatan.banner_url}
                        alt={kegiatan.judul}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="text-muted-foreground flex h-full w-full flex-col items-center justify-center gap-2">
                        <ImageOff className="h-8 w-8 opacity-40" />
                        <span className="text-xs opacity-40">Tidak ada banner</span>
                    </div>
                )}

                {/* Badge harga / gratis */}
                <div className="absolute top-2.5 left-2.5">
                    {kegiatan.is_berbayar ? (
                        <span className="inline-flex items-center rounded-full bg-black/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                            💳 {kegiatan.harga ? formatRupiah(kegiatan.harga) : 'Berbayar'}
                        </span>
                    ) : (
                        <span className="inline-flex items-center rounded-full bg-emerald-500/90 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                            🎟️ Gratis
                        </span>
                    )}
                </div>

                {/* Overlay selesai */}
                {kegiatan.is_selesai && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                        <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Selesai
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{kegiatan.judul}</h3>

                <div className="space-y-1.5">
                    <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                        <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                        <span>
                            {kegiatan.tanggal}
                            {kegiatan.waktu && `, ${kegiatan.waktu.slice(0, 5)} WITA`}
                        </span>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="line-clamp-1">{kegiatan.lokasi}</span>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="border-border mt-3 flex items-center gap-1.5 border-t pt-3">
                    <Link href={kegiatanEdit.url(kegiatan.id)} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                        </Button>
                    </Link>

                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1.5 text-xs"
                        disabled={completing}
                        onClick={handleComplete}
                        title={kegiatan.is_selesai ? 'Aktifkan kembali' : 'Tandai selesai'}
                    >
                        {kegiatan.is_selesai ? (
                            <>
                                <RotateCcw className="h-3.5 w-3.5" />
                                Aktifkan
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Selesai
                            </>
                        )}
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 px-2"
                        onClick={() => onDelete(kegiatan)}
                        title="Hapus kegiatan"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

function SectionGrid({
    title,
    count,
    kegiatans,
    emptyMessage,
    onDelete,
}: {
    title: string;
    count: number;
    kegiatans: Kegiatan[];
    emptyMessage: string;
    onDelete: (k: Kegiatan) => void;
}) {
    return (
        <section className="space-y-3">
            <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold">{title}</h2>
                <span className="text-muted-foreground rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                    {count}
                </span>
            </div>

            {kegiatans.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {kegiatans.map((k) => (
                        <KegiatanCard key={k.id} kegiatan={k} onDelete={onDelete} />
                    ))}
                </div>
            ) : (
                <div className="border-sidebar-border/70 dark:border-sidebar-border flex items-center justify-center rounded-xl border border-dashed py-10">
                    <p className="text-muted-foreground text-sm">{emptyMessage}</p>
                </div>
            )}
        </section>
    );
}

export default function Dashboard({
    akan_datang,
    sudah_selesai,
}: {
    akan_datang: Kegiatan[];
    sudah_selesai: Kegiatan[];
}) {
    const [deleteTarget, setDeleteTarget] = useState<Kegiatan | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);

    function openDelete(k: Kegiatan) {
        setDeleteTarget(k);
        setDeleteOpen(true);
    }

    const total = akan_datang.length + sudah_selesai.length;

    return (
        <>
            <Head title="Dashboard" />

            <DeleteDialog kegiatan={deleteTarget} open={deleteOpen} onOpenChange={setDeleteOpen} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">Dashboard</h1>
                        <p className="text-muted-foreground mt-0.5 text-xs">
                            {total > 0 ? `${total} kegiatan terdaftar` : 'Kelola semua kegiatan Anda di sini'}
                        </p>
                    </div>
                    <Link href={kegiatanCreate.url()}>
                        <Button size="sm" className="gap-1.5">
                            <Plus className="h-4 w-4" />
                            Tambah Kegiatan
                        </Button>
                    </Link>
                </div>

                {/* Akan Datang */}
                <SectionGrid
                    title="Akan Datang"
                    count={akan_datang.length}
                    kegiatans={akan_datang}
                    emptyMessage="Tidak ada kegiatan yang akan datang."
                    onDelete={openDelete}
                />

                {/* Sudah Selesai */}
                <SectionGrid
                    title="Sudah Selesai"
                    count={sudah_selesai.length}
                    kegiatans={sudah_selesai}
                    emptyMessage="Belum ada kegiatan yang selesai."
                    onDelete={openDelete}
                />
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
