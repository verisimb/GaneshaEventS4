import { Head } from '@inertiajs/react';
import { absensi } from '@/routes';

export default function Absensi() {
    return (
        <>
            <Head title="Absensi" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Absensi</h1>
                </div>
                <div className="relative min-h-[60vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">Halaman Absensi — konten akan segera hadir.</p>
                </div>
            </div>
        </>
    );
}

Absensi.layout = {
    breadcrumbs: [
        {
            title: 'Absensi',
            href: absensi(),
        },
    ],
};
