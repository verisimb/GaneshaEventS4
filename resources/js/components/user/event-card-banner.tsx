import { ImageOff } from 'lucide-react';

type EventCardBannerProps = {
    bannerUrl: string | null;
    title: string;
    isBerbayar: boolean;
    harga?: number | null;
    badgeText?: string;
    badgeClassName?: string;
};

function formatRupiah(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
}

export default function EventCardBanner({
    bannerUrl,
    title,
    isBerbayar,
    harga,
    badgeText,
    badgeClassName,
}: EventCardBannerProps) {
    const defaultBadgeText = isBerbayar ? `💳 ${harga ? formatRupiah(harga) : 'Berbayar'}` : '🎟️ Gratis';
    const finalBadgeText = badgeText ?? defaultBadgeText;
    const defaultBadgeClass = isBerbayar
        ? 'bg-black/70 text-white'
        : 'bg-emerald-500/90 text-white';

    return (
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
            {bannerUrl ? (
                <img
                    src={bannerUrl}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            ) : (
                <div className="text-muted-foreground flex h-full w-full flex-col items-center justify-center gap-2">
                    <ImageOff className="h-8 w-8 opacity-40" />
                    <span className="text-xs opacity-40">Tidak ada banner</span>
                </div>
            )}

            <div className="absolute top-2.5 left-2.5">
                <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-sm ${badgeClassName ?? defaultBadgeClass}`}
                >
                    {finalBadgeText}
                </span>
            </div>
        </div>
    );
}
