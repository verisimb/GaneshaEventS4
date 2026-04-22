import { Head } from '@inertiajs/react';
import { Award, CalendarDays, Download, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EventCardBanner from '@/components/user/event-card-banner';

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
        <div className="border-sidebar-border/70 dark:border-sidebar-border bg-card group flex flex-col overflow-hidden rounded-xl border shadow-sm transition-shadow hover:shadow-md">
            <EventCardBanner
                bannerUrl={sertifikat.kegiatan.banner_url}
                title={sertifikat.kegiatan.judul}
                isBerbayar={false}
                badgeText="🏆 Sertifikat"
                badgeClassName="bg-amber-500/90 text-white"
            />

            <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="space-y-2 flex-1">
                    <div>
                        <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
                            {sertifikat.kegiatan.judul}
                        </h3>
                        <p className="text-muted-foreground mt-0.5 text-xs">
                            Atas nama:{' '}
                            <span className="text-foreground font-medium">{sertifikat.nama_lengkap}</span>
                        </p>
                    </div>

                    <div className="space-y-1.5">
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

                <div className="mt-auto border-t border-border pt-3">
                    <Button
                        size="sm"
                        className="w-full gap-1.5 bg-amber-500 text-white hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700"
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
                        <Award className="text-muted-foreground/40 h-10 w-10" />
                        <div className="text-center">
                            <p className="text-muted-foreground text-sm">Belum ada sertifikat tersedia.</p>
                            <p className="text-muted-foreground mt-0.5 text-xs">
                                Sertifikat akan muncul setelah kegiatan selesai dan Anda tercatat hadir.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
