import { Head, router, Link } from '@inertiajs/react';
import { CalendarDays, MapPin, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import EventCardBanner from '@/components/user/event-card-banner';

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

function KegiatanCard({ kegiatan }: { kegiatan: Kegiatan }) {
    return (
        <div className="group flex flex-col overflow-hidden rounded-xl border border-sidebar-border/70 bg-card transition-shadow hover:shadow-md dark:border-sidebar-border">
            {/* Banner */}
            <EventCardBanner
                bannerUrl={kegiatan.banner_url}
                title={kegiatan.judul}
                isBerbayar={kegiatan.is_berbayar}
                harga={kegiatan.harga}
            />

            {/* Content */}
            <div className="flex flex-1 flex-col gap-3 p-4">
                <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{kegiatan.judul}</h3>

                <div className="space-y-1.5 flex-1">
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

                <div className="mt-auto pt-2">
                    <Link href={`/user/kegiatan/${kegiatan.id}`} className="block w-full">
                        <Button variant="default" size="sm" className="w-full text-xs transition-colors group-hover:bg-primary/90">
                            Lihat Detail
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function Kegiatan({ kegiatans = [], filters }: { kegiatans: Kegiatan[], filters: { search: string } }) {
    const [search, setSearch] = useState(filters?.search || '');

    // Debounce the search input to prevent firing requests on every keystroke
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== (filters?.search || '')) {
                router.get('/user/kegiatan', { search }, {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                });
            }
        }, 400);

        return () => clearTimeout(timeoutId);
    }, [search, filters?.search]);

    return (
        <>
            <Head title="Kegiatan" />
            <div className="flex flex-1 flex-col gap-6 p-4">
                {/* Header that includes the Title and Search Box */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">Tawaran Kegiatan</h1>
                        <p className="text-muted-foreground mt-0.5 text-xs">
                            Jelajahi dan temukan event menarik yang dapat Anda ikuti.
                        </p>
                    </div>

                    <div className="relative w-full sm:w-72">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="text-muted-foreground h-4 w-4" />
                        </div>
                        <Input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-background pl-9 h-9"
                            placeholder="Cari berdasarkan judul..."
                        />
                    </div>
                </div>

                {/* Grid Layout for the Cards */}
                {kegiatans.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {kegiatans.map((k) => (
                            <KegiatanCard key={k.id} kegiatan={k} />
                        ))}
                    </div>
                ) : (
                    <div className="border-sidebar-border/70 flex h-64 flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center">
                        <Search className="mb-4 h-10 w-10 text-muted-foreground/30" />
                        <h3 className="text-sm font-medium">Tidak ada hasil</h3>
                        <p className="text-muted-foreground mt-1 text-sm">
                            {search 
                                ? `Kami tidak menemukan kegiatan dengan judul "${search}".`
                                : 'Belum ada kegiatan terbuka yang tersedia saat ini.'}
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}

Kegiatan.layout = {
    breadcrumbs: [
        {
            title: 'Kegiatan',
            href: '/user/kegiatan',
        },
    ],
};
