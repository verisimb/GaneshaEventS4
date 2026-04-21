import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { CalendarDays, MapPin, ImageOff, CreditCard, User, Mail, Phone, UploadCloud, Info, AlertCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { SharedData } from '@/types';

type KegiatanDetailData = {
    id: number;
    judul: string;
    deskripsi: string | null;
    tanggal: string;
    waktu: string | null;
    lokasi: string;
    penyelenggara: string;
    banner_url: string | null;
    is_berbayar: boolean;
    harga: number | null;
    nama_bank: string | null;
    no_rekening: string | null;
    atas_nama: string | null;
};

function formatRupiah(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
}

export default function KegiatanDetail({
    kegiatan,
    has_registered,
}: {
    kegiatan: KegiatanDetailData;
    has_registered: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, post, processing, errors } = useForm({
        nama_lengkap: auth.user?.name || '',
        email: auth.user?.email || '',
        no_hp: '',
        bukti_pembayaran: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/user/kegiatan/${kegiatan.id}/daftar`, {
            preserveScroll: true,
            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                if (firstError) {
                    toast.error(firstError);
                }
            },
        });
    };

    return (
        <>
            <Head title={`Detail - ${kegiatan.judul}`} />
            
            <div className="mx-auto flex max-w-6xl flex-col gap-8 p-4 lg:flex-row">
                {/* Kolom Kiri: Info Kegiatan */}
                <div className="flex-1 space-y-6">
                    {/* Banner */}
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted border border-border">
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
                            Diselenggarakan oleh: <span className="font-semibold text-foreground">{kegiatan.penyelenggara}</span>
                        </p>
                    </div>

                    {/* Meta Informasi Waktu & Lokasi */}
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="flex items-start gap-3 rounded-xl border border-sidebar-border bg-card p-4 shadow-sm">
                            <CalendarDays className="mt-0.5 h-5 w-5 text-primary" />
                            <div>
                                <p className="text-sm font-medium">Tanggal & Waktu</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {kegiatan.tanggal}
                                    <br />
                                    {kegiatan.waktu}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 rounded-xl border border-sidebar-border bg-card p-4 shadow-sm">
                            <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                            <div>
                                <p className="text-sm font-medium">Lokasi Kegiatan</p>
                                <p className="mt-1 text-sm text-muted-foreground">{kegiatan.lokasi}</p>
                            </div>
                        </div>
                    </div>

                    {/* Deskripsi Acara */}
                    <div className="rounded-xl border border-sidebar-border bg-card p-5 shadow-sm">
                        <h3 className="mb-3 text-base font-semibold">Deskripsi Kegiatan</h3>
                        {kegiatan.deskripsi ? (
                            <div 
                                className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground"
                                dangerouslySetInnerHTML={{ __html: kegiatan.deskripsi }}
                            />
                        ) : (
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                Belum ada deskripsi yang ditambahkan untuk kegiatan ini.
                            </p>
                        )}
                    </div>

                    {/* Info Pembayaran (Cuma muncul jika berbayar) */}
                    {kegiatan.is_berbayar && (
                        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 dark:border-amber-500/20 dark:bg-amber-500/5">
                            <div className="mb-3 flex items-center gap-2 font-semibold text-amber-700 dark:text-amber-400">
                                <CreditCard className="h-5 w-5" />
                                Informasi Pembayaran
                            </div>
                            <div className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
                                <p>Total Tagihan: <strong className="text-lg">{kegiatan.harga ? formatRupiah(kegiatan.harga) : '-'}</strong></p>
                                <p>Bank Tujuan: <strong>{kegiatan.nama_bank || '-'}</strong></p>
                                <p>Rekenining: <strong>{kegiatan.no_rekening || '-'}</strong></p>
                                <p>Atas Nama: <strong>{kegiatan.atas_nama || '-'}</strong></p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Kolom Kanan: Form Pendaftaran */}
                <div className="w-full lg:w-96">
                    <div className="sticky top-6 overflow-hidden rounded-xl border border-sidebar-border bg-card shadow-lg">
                        <div className="border-b border-border bg-muted/40 px-6 py-4">
                            <h2 className="text-lg font-semibold">Pendaftaran</h2>
                            <p className="text-xs text-muted-foreground">Lengkapi form berikut untuk mendaftar</p>
                        </div>
                        
                        <div className="p-6">
                            {has_registered ? (
                                <div className="space-y-4 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-center">
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
                                        <Info className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <h3 className="font-medium text-emerald-800 dark:text-emerald-300">
                                        Anda Sudah Terdaftar!
                                    </h3>
                                    <p className="text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
                                        Anda telah resmi terdaftar di kegiatan ini. Silakan periksa halaman Tiket untuk memantau status partisipasi Anda.
                                    </p>
                                    <div className="pt-2">
                                        <Link href="/user/tiket">
                                            <Button variant="outline" className="w-full text-emerald-700 border-emerald-600/30 hover:bg-emerald-500/10 dark:text-emerald-400">
                                                Lihat Tiket Saya
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={submit} className="space-y-5">
                                    {/* Duplikat pendaftaran error banner */}
                                    {errors.email?.includes('sudah terdaftar') && (
                                        <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3">
                                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                                            <p className="text-xs text-destructive leading-relaxed">{errors.email}</p>
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <Label htmlFor="nama_lengkap" className="flex items-center gap-1.5">
                                            <User className="h-3.5 w-3.5" /> Nama Lengkap
                                        </Label>
                                        <Input
                                            id="nama_lengkap"
                                            value={data.nama_lengkap}
                                            onChange={(e) => setData('nama_lengkap', e.target.value)}
                                            placeholder="Masukkan nama lengkap Anda"
                                            required
                                        />
                                        {errors.nama_lengkap && <p className="text-xs text-destructive">{errors.nama_lengkap}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="flex items-center gap-1.5">
                                            <Mail className="h-3.5 w-3.5" /> Alamat Email
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="contoh@email.com"
                                            required
                                        />
                                        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="no_hp" className="flex items-center gap-1.5">
                                            <Phone className="h-3.5 w-3.5" /> Nomor WhatsApp / HP
                                        </Label>
                                        <Input
                                            id="no_hp"
                                            type="tel"
                                            value={data.no_hp}
                                            onChange={(e) => setData('no_hp', e.target.value)}
                                            placeholder="081234567890"
                                            required
                                        />
                                        {errors.no_hp && <p className="text-xs text-destructive">{errors.no_hp}</p>}
                                    </div>

                                    {kegiatan.is_berbayar && (
                                        <div className="space-y-3 rounded-lg border border-border bg-muted/40 p-4">
                                            <Label htmlFor="bukti_pembayaran" className="flex items-center gap-1.5">
                                                <UploadCloud className="h-3.5 w-3.5" /> Unggah Bukti Bayar
                                            </Label>
                                            <p className="text-[11px] text-muted-foreground leading-tight">
                                                *Wajib melampirkan foto bukti transfer agar pendaftaran bisa diverifikasi.
                                            </p>
                                            <Input
                                                id="bukti_pembayaran"
                                                type="file"
                                                accept="image/jpeg,image/png,image/jpg,image/webp"
                                                onChange={(e) => setData('bukti_pembayaran', e.target.files?.[0] || null)}
                                                className="cursor-pointer file:text-primary file:font-semibold"
                                                required
                                            />
                                            {errors.bukti_pembayaran && (
                                                <p className="text-xs text-destructive">{errors.bukti_pembayaran}</p>
                                            )}
                                        </div>
                                    )}

                                    <Button type="submit" className="w-full text-sm font-semibold" disabled={processing}>
                                        {processing ? 'Memproses...' : 'Daftar Sekarang'}
                                    </Button>
                                    <p className="text-center text-[10px] text-muted-foreground">
                                        Dengan mendaftar, Anda menyetujui seluruh ketentuan kegiatan.
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

KegiatanDetail.layout = {
    breadcrumbs: [
        {
            title: 'Kegiatan',
            href: '/user/kegiatan',
        },
        {
            title: 'Detail',
            href: '#',
        },
    ],
};
