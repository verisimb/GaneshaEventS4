import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { CheckCircle2, XCircle, Eye, Filter } from 'lucide-react';
import {
    confirm as pendaftaranConfirm,
    reject as pendaftaranReject,
    index as pendaftaranIndex,
} from '@/actions/App/Http/Controllers/PendaftaranController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { pendaftar as pendaftarRoute } from '@/routes';

type KegiatanItem = {
    id: number;
    judul: string;
};

type Pendaftaran = {
    id: number;
    nama_lengkap: string;
    email: string;
    no_hp: string;
    status: 'pending' | 'confirmed' | 'rejected';
    bukti_pembayaran_url: string | null;
    kegiatan: {
        id: number;
        judul: string;
        is_berbayar: boolean;
    };
};

function StatusBadge({ status }: { status: Pendaftaran['status'] }) {
    if (status === 'confirmed') {
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                <CheckCircle2 className="h-3 w-3" />
                Terkonfirmasi
            </span>
        );
    }

    if (status === 'rejected') {
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-500/20 dark:text-red-400">
                <XCircle className="h-3 w-3" />
                Ditolak
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Menunggu
        </span>
    );
}

function RejectDialog({
    target,
    open,
    onOpenChange,
}: {
    target: Pendaftaran | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [processing, setProcessing] = useState(false);

    function handleReject() {
        if (!target) {
            return;
        }
        setProcessing(true);
        router.patch(
            pendaftaranReject.url(target.id),
            {},
            {
                onFinish: () => {
                    setProcessing(false);
                    onOpenChange(false);
                },
            },
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tolak Pendaftar</DialogTitle>
                    <DialogDescription>
                        Apakah Anda yakin ingin menolak pendaftaran dari{' '}
                        <span className="text-foreground font-semibold">"{target?.nama_lengkap}"</span>? Tindakan ini tidak dapat
                        dibatalkan.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={processing}>
                        Batal
                    </Button>
                    <Button variant="destructive" onClick={handleReject} disabled={processing}>
                        {processing ? 'Memproses...' : 'Tolak'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function Pendaftar({
    pendaftarans,
    kegiatan_list,
    selected_kegiatan_id,
}: {
    pendaftarans: Pendaftaran[];
    kegiatan_list: KegiatanItem[];
    selected_kegiatan_id: number | null;
}) {
    const [rejectTarget, setRejectTarget] = useState<Pendaftaran | null>(null);
    const [rejectOpen, setRejectOpen] = useState(false);
    const [confirming, setConfirming] = useState<number | null>(null);

    function handleFilterChange(value: string) {
        router.get(
            pendaftaranIndex.url(),
            value && value !== 'all' ? { kegiatan_id: value } : {},
            { preserveState: true, replace: true },
        );
    }

    function handleConfirm(pendaftaran: Pendaftaran) {
        setConfirming(pendaftaran.id);
        router.patch(
            pendaftaranConfirm.url(pendaftaran.id),
            {},
            {
                onFinish: () => setConfirming(null),
            },
        );
    }

    function openReject(pendaftaran: Pendaftaran) {
        setRejectTarget(pendaftaran);
        setRejectOpen(true);
    }

    return (
        <>
            <Head title="Pendaftar" />

            <RejectDialog target={rejectTarget} open={rejectOpen} onOpenChange={setRejectOpen} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">Pendaftar</h1>
                        <p className="text-muted-foreground mt-0.5 text-xs">
                            {pendaftarans.length > 0
                                ? `${pendaftarans.length} pendaftar ditemukan`
                                : 'Kelola pendaftar kegiatan Anda di sini'}
                        </p>
                    </div>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2">
                    <Filter className="text-muted-foreground h-4 w-4 shrink-0" />
                    <Select
                        value={selected_kegiatan_id ? String(selected_kegiatan_id) : 'all'}
                        onValueChange={(value) => handleFilterChange(value)}
                    >
                        <SelectTrigger className="w-64">
                            <SelectValue placeholder="Semua Kegiatan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Kegiatan</SelectItem>
                            {kegiatan_list.map((k) => (
                                <SelectItem key={k.id} value={String(k.id)}>
                                    {k.judul}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                {pendaftarans.length === 0 ? (
                    <div className="border-sidebar-border/70 dark:border-sidebar-border flex min-h-[40vh] items-center justify-center rounded-xl border border-dashed">
                        <p className="text-muted-foreground text-sm">Belum ada pendaftar.</p>
                    </div>
                ) : (
                    <div className="border-sidebar-border/70 dark:border-sidebar-border overflow-hidden rounded-xl border">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-muted/50 border-b border-inherit">
                                        <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                                            No
                                        </th>
                                        <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                                            Nama
                                        </th>
                                        <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                                            Email
                                        </th>
                                        <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                                            No. HP
                                        </th>
                                        <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                                            Kegiatan
                                        </th>
                                        <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                                            Status
                                        </th>
                                        <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                                            Bukti Bayar
                                        </th>
                                        <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-inherit">
                                    {pendaftarans.map((p, idx) => (
                                        <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="text-muted-foreground px-4 py-3 text-xs">
                                                {idx + 1}
                                            </td>
                                            <td className="px-4 py-3 font-medium">{p.nama_lengkap}</td>
                                            <td className="text-muted-foreground px-4 py-3 text-xs">
                                                {p.email}
                                            </td>
                                            <td className="text-muted-foreground px-4 py-3 text-xs">
                                                {p.no_hp}
                                            </td>
                                            <td className="px-4 py-3 text-xs">
                                                <span className="line-clamp-1 max-w-[140px]">{p.kegiatan.judul}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <StatusBadge status={p.status} />
                                            </td>
                                            <td className="px-4 py-3">
                                                {p.bukti_pembayaran_url ? (
                                                    <a
                                                        href={p.bukti_pembayaran_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary hover:underline inline-flex items-center gap-1 text-xs"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />
                                                        Lihat
                                                    </a>
                                                ) : (
                                                    <span className="text-muted-foreground text-xs">—</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                {p.status === 'pending' ? (
                                                    <div className="flex items-center gap-1.5">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-7 gap-1 border-emerald-500/50 px-2 text-xs text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
                                                            onClick={() => handleConfirm(p)}
                                                            disabled={confirming === p.id}
                                                        >
                                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                                            {confirming === p.id ? '...' : 'Konfirmasi'}
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 gap-1 px-2 text-xs"
                                                            onClick={() => openReject(p)}
                                                        >
                                                            <XCircle className="h-3.5 w-3.5" />
                                                            Tolak
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground text-xs">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

Pendaftar.layout = {
    breadcrumbs: [
        {
            title: 'Pendaftar',
            href: pendaftarRoute(),
        },
    ],
};
