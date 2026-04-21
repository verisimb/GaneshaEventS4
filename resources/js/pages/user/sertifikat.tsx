import { Head } from '@inertiajs/react';
import { Award, CalendarDays, Download, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Sertifikat = {
    id: number;
    nama_lengkap: string;
    download_url: string;
    kegiatan: {
        id: number;
        judul: string;
        penyelenggara: string;
        tanggal: string;
        banner_url: string | null;
    };
};

function SertifikatCard({ sertifikat }: { sertifikat: Sertifikat }) {
    return (
        <div className="border-sidebar-border/70 dark:border-sidebar-border bg-card group overflow-hidden rounded-xl border shadow-sm transition-shadow hover:shadow-md">
            <div className="flex flex-col sm:flex-row">
                {/* Thumbnail / preview template */}
                <div className="relative h-36 w-full shrink-0 overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-950/30 dark:to-yellow-900/20 sm:h-auto sm:w-40">
                    {sertifikat.kegiatan.banner_url ? (
                        <img
                            src={sertifikat.kegiatan.banner_url}
                            alt={sertifikat.kegiatan.judul}
                            className="h-full w-full object-cover opacity-60"
                        />
                    ) : null}
                    {/* Sertifikat icon overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="rounded-full bg-amber-500/20 p-3 backdrop-blur-sm">
                            <Award className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col justify-between p-4">
                    <div className="space-y-2">
                        <div>
                            <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
                                {sertifikat.kegiatan.judul}
                            </h3>
                            <p className="text-muted-foreground mt-0.5 text-xs">
                                Atas nama:{' '}
                                <span className="text-foreground font-medium">{sertifikat.nama_lengkap}</span>
                            </p>
                        </div>

                        <div className="space-y-1">
                            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                                <Building2 className="h-3.5 w-3.5 shrink-0" />
                                <span className="line-clamp-1">{sertifikat.kegiatan.penyelenggara}</span>
                            </div>
                            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                                <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                                <span>{sertifikat.kegiatan.tanggal}</span>
                            </div>
                        </div>
                    </div>

                    {/* Download button */}
                    <div className="mt-3 border-t border-border pt-3">
                        <Button
                            size="sm"
                            className="gap-1.5 bg-amber-500 text-white hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700"
                            onClick={() => {
                                window.location.href = sertifikat.download_url;
                            }}
                        >
                            <Download className="h-3.5 w-3.5" />
                            Unduh Sertifikat
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Sertifikat({ sertifikats }: { sertifikats: Sertifikat[] }) {
    return (
        <>
            <Head title="Sertifikat" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-xl font-semibold">Sertifikat Saya</h1>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                        Unduh sertifikat dari kegiatan yang telah Anda ikuti dan selesai.
                    </p>
                </div>

                {sertifikats.length === 0 ? (
                    <div className="border-sidebar-border/70 flex min-h-[40vh] flex-col items-center justify-center gap-3 rounded-xl border border-dashed">
                        <div className="rounded-full bg-amber-100 p-4 dark:bg-amber-500/10">
                            <Award className="h-8 w-8 text-amber-500" />
                        </div>
                        <div className="text-center">
                            <p className="text-muted-foreground text-sm">Belum ada sertifikat tersedia.</p>
                            <p className="text-muted-foreground mt-0.5 text-xs">
                                Sertifikat akan muncul setelah kegiatan selesai dan Anda tercatat hadir.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {sertifikats.map((s) => (
                            <SertifikatCard key={s.id} sertifikat={s} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

Sertifikat.layout = {
    breadcrumbs: [
        {
            title: 'Sertifikat',
            href: '/user/sertifikat',
        },
    ],
};
