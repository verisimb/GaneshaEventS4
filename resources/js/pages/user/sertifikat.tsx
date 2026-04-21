import { Head } from '@inertiajs/react';

export default function Sertifikat() {
    return (
        <>
            <Head title="Sertifikat" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">Sertifikat Saya</h1>
                        <p className="text-muted-foreground mt-0.5 text-xs">Unduh sertifikat dari kegiatan yang telah Anda ikuti.</p>
                    </div>
                </div>
                
                <div className="border-sidebar-border/70 flex h-32 items-center justify-center rounded-xl border border-dashed">
                    <p className="text-muted-foreground text-sm">Anda belum memiliki sertifikat.</p>
                </div>
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
