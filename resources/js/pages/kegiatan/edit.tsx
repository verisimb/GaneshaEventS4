import { Head, useForm } from '@inertiajs/react';
import { edit as kegiatanEditRoute, update as kegiatanUpdate } from '@/actions/App/Http/Controllers/KegiatanController';
import { dashboard } from '@/routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/rich-text-editor';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Upload, ImageIcon, FileText, CreditCard, Building2, Hash, User, ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';

type KegiatanData = {
    id: number;
    judul: string;
    deskripsi: string;
    tanggal: string;
    waktu: string;
    lokasi: string;
    penyelenggara: string;
    banner_url: string | null;
    template_sertifikat_url: string | null;
    template_sertifikat_name: string | null;
    is_berbayar: boolean;
    harga: number | null;
    nama_bank: string | null;
    no_rekening: string | null;
    atas_nama: string | null;
};

type FormData = {
    _method: string;
    judul: string;
    deskripsi: string;
    tanggal: string;
    waktu: string;
    lokasi: string;
    penyelenggara: string;
    banner: File | null;
    template_sertifikat: File | null;
    is_berbayar: boolean;
    harga: string;
    nama_bank: string;
    no_rekening: string;
    atas_nama: string;
};

export default function KegiatanEdit({ kegiatan }: { kegiatan: KegiatanData }) {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        _method: 'PUT',
        judul: kegiatan.judul,
        deskripsi: kegiatan.deskripsi,
        tanggal: kegiatan.tanggal,
        waktu: kegiatan.waktu,
        lokasi: kegiatan.lokasi,
        penyelenggara: kegiatan.penyelenggara,
        banner: null,
        template_sertifikat: null,
        is_berbayar: kegiatan.is_berbayar,
        harga: kegiatan.harga ? String(kegiatan.harga) : '',
        nama_bank: kegiatan.nama_bank ?? '',
        no_rekening: kegiatan.no_rekening ?? '',
        atas_nama: kegiatan.atas_nama ?? '',
    });

    const [bannerPreview, setBannerPreview] = useState<string | null>(kegiatan.banner_url);
    const [sertifikatName, setSertifikatName] = useState<string | null>(kegiatan.template_sertifikat_name);

    function handleBannerChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;
        setData('banner', file);
        if (file) {
            setBannerPreview(URL.createObjectURL(file));
        }
    }

    function handleSertifikatChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;
        setData('template_sertifikat', file);
        setSertifikatName(file?.name ?? null);
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(kegiatanUpdate.url(kegiatan.id), {
            forceFormData: true,
        });
    }

    return (
        <>
            <Head title="Edit Kegiatan" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <Link
                        href={dashboard()}
                        className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali
                    </Link>
                </div>

                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Kegiatan</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Perbarui informasi kegiatan.</p>
                </div>

                <form onSubmit={submit} className="space-y-8">
                    {/* ── Informasi Dasar ── */}
                    <section className="space-y-5 rounded-xl border border-sidebar-border/70 p-5 dark:border-sidebar-border">
                        <h2 className="text-base font-semibold">Informasi Kegiatan</h2>

                        {/* Judul */}
                        <div className="space-y-1.5">
                            <Label htmlFor="judul">
                                Judul Kegiatan <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="judul"
                                value={data.judul}
                                onChange={(e) => setData('judul', e.target.value)}
                                placeholder="Contoh: Seminar Nasional Teknologi 2025"
                                className={cn(errors.judul && 'border-destructive')}
                            />
                            {errors.judul && <p className="text-destructive text-xs">{errors.judul}</p>}
                        </div>

                        {/* Deskripsi */}
                        <div className="space-y-1.5">
                            <Label>
                                Deskripsi <span className="text-destructive">*</span>
                            </Label>
                            <RichTextEditor
                                value={data.deskripsi}
                                onChange={(val) => setData('deskripsi', val)}
                                error={errors.deskripsi}
                            />
                            {errors.deskripsi && <p className="text-destructive text-xs">{errors.deskripsi}</p>}
                        </div>

                        {/* Tanggal & Waktu */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="tanggal">
                                    Tanggal <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="tanggal"
                                    type="date"
                                    value={data.tanggal}
                                    onChange={(e) => setData('tanggal', e.target.value)}
                                    className={cn(errors.tanggal && 'border-destructive')}
                                />
                                {errors.tanggal && <p className="text-destructive text-xs">{errors.tanggal}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="waktu">
                                    Waktu <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="waktu"
                                    type="time"
                                    value={data.waktu}
                                    onChange={(e) => setData('waktu', e.target.value)}
                                    className={cn(errors.waktu && 'border-destructive')}
                                />
                                {errors.waktu && <p className="text-destructive text-xs">{errors.waktu}</p>}
                            </div>
                        </div>

                        {/* Lokasi & Penyelenggara */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="lokasi">
                                    Lokasi <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="lokasi"
                                    value={data.lokasi}
                                    onChange={(e) => setData('lokasi', e.target.value)}
                                    placeholder="Contoh: Aula Kampus Undiksha"
                                    className={cn(errors.lokasi && 'border-destructive')}
                                />
                                {errors.lokasi && <p className="text-destructive text-xs">{errors.lokasi}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="penyelenggara">
                                    Penyelenggara <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="penyelenggara"
                                    value={data.penyelenggara}
                                    onChange={(e) => setData('penyelenggara', e.target.value)}
                                    placeholder="Contoh: BEM FTK Undiksha"
                                    className={cn(errors.penyelenggara && 'border-destructive')}
                                />
                                {errors.penyelenggara && <p className="text-destructive text-xs">{errors.penyelenggara}</p>}
                            </div>
                        </div>
                    </section>

                    {/* ── Upload File ── */}
                    <section className="space-y-5 rounded-xl border border-sidebar-border/70 p-5 dark:border-sidebar-border">
                        <h2 className="text-base font-semibold">Upload File</h2>
                        <p className="text-muted-foreground text-xs">Biarkan kosong jika tidak ingin mengganti file yang ada.</p>

                        {/* Banner Event */}
                        <div className="space-y-2">
                            <Label>Banner Event</Label>
                            <label
                                htmlFor="banner"
                                className={cn(
                                    'border-input hover:border-primary/50 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors',
                                    bannerPreview ? 'p-2' : 'p-8',
                                )}
                            >
                                {bannerPreview ? (
                                    <img
                                        src={bannerPreview}
                                        alt="Preview Banner"
                                        className="max-h-48 w-full rounded-md object-cover"
                                    />
                                ) : (
                                    <>
                                        <ImageIcon className="text-muted-foreground h-8 w-8" />
                                        <div className="text-center">
                                            <p className="text-sm font-medium">Klik untuk upload banner baru</p>
                                            <p className="text-muted-foreground text-xs">atau seret & lepas file di sini</p>
                                        </div>
                                    </>
                                )}
                                <input
                                    id="banner"
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg,image/webp"
                                    className="sr-only"
                                    onChange={handleBannerChange}
                                />
                            </label>
                            {errors.banner && <p className="text-destructive text-xs">{errors.banner}</p>}
                        </div>

                        {/* Template Sertifikat */}
                        <div className="space-y-2">
                            <Label>Template Sertifikat</Label>
                            <label
                                htmlFor="template_sertifikat"
                                className={cn(
                                    'border-input hover:border-primary/50 flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed p-4 transition-colors',
                                    sertifikatName && 'border-primary/30 bg-primary/5',
                                )}
                            >
                                <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                                    <FileText className="text-primary h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    {sertifikatName ? (
                                        <p className="text-sm font-medium">{sertifikatName}</p>
                                    ) : (
                                        <>
                                            <p className="text-sm font-medium">Upload template sertifikat baru</p>
                                            <p className="text-muted-foreground text-xs">Klik untuk memilih file</p>
                                        </>
                                    )}
                                </div>
                                <Upload className="text-muted-foreground h-4 w-4 shrink-0" />
                                <input
                                    id="template_sertifikat"
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.webp"
                                    className="sr-only"
                                    onChange={handleSertifikatChange}
                                />
                            </label>
                            {errors.template_sertifikat && (
                                <p className="text-destructive text-xs">{errors.template_sertifikat}</p>
                            )}
                        </div>
                    </section>

                    {/* ── Tipe Kegiatan ── */}
                    <section className="space-y-5 rounded-xl border border-sidebar-border/70 p-5 dark:border-sidebar-border">
                        <h2 className="text-base font-semibold">Tipe Kegiatan</h2>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setData('is_berbayar', false)}
                                className={cn(
                                    'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all',
                                    !data.is_berbayar
                                        ? 'border-primary bg-primary/5 text-primary'
                                        : 'border-input text-muted-foreground hover:border-primary/40',
                                )}
                            >
                                <span className="text-2xl">🎟️</span>
                                <div className="text-center">
                                    <p className="text-sm font-semibold">Gratis</p>
                                    <p className="text-xs opacity-70">Tidak ada biaya pendaftaran</p>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => setData('is_berbayar', true)}
                                className={cn(
                                    'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all',
                                    data.is_berbayar
                                        ? 'border-primary bg-primary/5 text-primary'
                                        : 'border-input text-muted-foreground hover:border-primary/40',
                                )}
                            >
                                <span className="text-2xl">💳</span>
                                <div className="text-center">
                                    <p className="text-sm font-semibold">Berbayar</p>
                                    <p className="text-xs opacity-70">Peserta membayar untuk ikut</p>
                                </div>
                            </button>
                        </div>

                        {data.is_berbayar && (
                            <div className="animate-in fade-in slide-in-from-top-2 space-y-4 rounded-lg bg-muted/40 p-4 duration-200">
                                <p className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider">
                                    <CreditCard className="h-3.5 w-3.5" />
                                    Informasi Pembayaran
                                </p>

                                <div className="space-y-1.5">
                                    <Label htmlFor="harga">
                                        Harga (Rp) <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 text-sm">
                                            Rp
                                        </span>
                                        <Input
                                            id="harga"
                                            type="number"
                                            min="0"
                                            value={data.harga}
                                            onChange={(e) => setData('harga', e.target.value)}
                                            placeholder="50000"
                                            className={cn('pl-10', errors.harga && 'border-destructive')}
                                        />
                                    </div>
                                    {errors.harga && <p className="text-destructive text-xs">{errors.harga}</p>}
                                </div>

                                <div className="grid gap-4 sm:grid-cols-3">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="nama_bank">
                                            <Building2 className="mb-0.5 mr-1 inline h-3.5 w-3.5" />
                                            Nama Bank <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="nama_bank"
                                            value={data.nama_bank}
                                            onChange={(e) => setData('nama_bank', e.target.value)}
                                            placeholder="BRI / BNI / Mandiri..."
                                            className={cn(errors.nama_bank && 'border-destructive')}
                                        />
                                        {errors.nama_bank && <p className="text-destructive text-xs">{errors.nama_bank}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="no_rekening">
                                            <Hash className="mb-0.5 mr-1 inline h-3.5 w-3.5" />
                                            No. Rekening <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="no_rekening"
                                            value={data.no_rekening}
                                            onChange={(e) => setData('no_rekening', e.target.value)}
                                            placeholder="1234567890"
                                            className={cn(errors.no_rekening && 'border-destructive')}
                                        />
                                        {errors.no_rekening && (
                                            <p className="text-destructive text-xs">{errors.no_rekening}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="atas_nama">
                                            <User className="mb-0.5 mr-1 inline h-3.5 w-3.5" />
                                            Atas Nama <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="atas_nama"
                                            value={data.atas_nama}
                                            onChange={(e) => setData('atas_nama', e.target.value)}
                                            placeholder="Nama pemilik rekening"
                                            className={cn(errors.atas_nama && 'border-destructive')}
                                        />
                                        {errors.atas_nama && (
                                            <p className="text-destructive text-xs">{errors.atas_nama}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pb-6">
                        <Link href={dashboard()}>
                            <Button type="button" variant="outline" disabled={processing}>
                                Batal
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

KegiatanEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Edit Kegiatan', href: '#' },
    ],
};
