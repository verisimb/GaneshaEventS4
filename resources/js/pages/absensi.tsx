import { Head } from '@inertiajs/react';
import { absensi } from '@/routes';
import {
    Camera,
    CameraOff,
    CheckCircle2,
    Clock,
    Keyboard,
    Loader2,
    ScanLine,
    Users,
    XCircle,
    RefreshCw,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Kegiatan = {
    id: number;
    judul: string;
    tanggal: string;
    is_selesai: boolean;
};

type ScanResult = {
    success: boolean;
    message: string;
    nama_lengkap?: string;
    already_attended?: boolean;
};

type Peserta = {
    id: number;
    nama_lengkap: string;
    email: string;
    is_attended: boolean;
};

// ---------- QR Scanner Component ----------
function QRScanner({
    kegiatanId,
    onScan,
    active,
    onStop,
}: {
    kegiatanId: number;
    onScan: (code: string) => void;
    active: boolean;
    onStop: () => void;
}) {
    const divRef = useRef<HTMLDivElement>(null);
    const scannerRef = useRef<InstanceType<typeof import('html5-qrcode')['Html5Qrcode']> | null>(null);
    const scanningRef = useRef(false);

    useEffect(() => {
        if (!active || !divRef.current) return;

        let isMounted = true;

        async function startScanner() {
            const { Html5Qrcode } = await import('html5-qrcode');
            if (!isMounted || !divRef.current) return;

            try {
                const scanner = new Html5Qrcode('qr-reader');
                scannerRef.current = scanner;

                await scanner.start(
                    { facingMode: 'environment' },
                    { fps: 10, qrbox: { width: 250, height: 250 } },
                    (decodedText) => {
                        // Debounce: ignore jika sudah dalam proses verify
                        if (scanningRef.current) return;
                        scanningRef.current = true;
                        onScan(decodedText);
                        setTimeout(() => {
                            scanningRef.current = false;
                        }, 2000);
                    },
                    () => {}, // onError: suppress frame errors
                );
            } catch {
                onStop();
            }
        }

        startScanner();

        return () => {
            isMounted = false;
            if (scannerRef.current?.isScanning) {
                scannerRef.current.stop().catch(() => {});
            }
            scannerRef.current = null;
        };
    }, [active, kegiatanId]);

    return (
        <div
            id="qr-reader"
            ref={divRef}
            className="w-full overflow-hidden rounded-xl"
            style={{ display: active ? 'block' : 'none' }}
        />
    );
}

// ---------- Scan Result Toast ----------
function ScanToast({ result, onDismiss }: { result: ScanResult | null; onDismiss: () => void }) {
    useEffect(() => {
        if (!result) return;
        const t = setTimeout(onDismiss, 3500);
        return () => clearTimeout(t);
    }, [result]);

    if (!result) return null;

    const isSuccess = result.success;
    const isAlready = result.already_attended;

    return (
        <div
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg transition-all ${
                isSuccess
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300'
                    : isAlready
                      ? 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300'
                      : 'border-red-200 bg-red-50 text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300'
            }`}
        >
            {isSuccess ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            ) : isAlready ? (
                <Clock className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
                <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            <p className="flex-1">{result.message}</p>
            <button onClick={onDismiss} className="ml-2 shrink-0 opacity-60 hover:opacity-100">
                <XCircle className="h-3.5 w-3.5" />
            </button>
        </div>
    );
}

// ---------- Peserta List ----------
function PesertaList({ kegiatanId }: { kegiatanId: number | null }) {
    const [peserta, setPeserta] = useState<Peserta[]>([]);
    const [loading, setLoading] = useState(false);

    async function load() {
        if (!kegiatanId) return;
        setLoading(true);
        try {
            const res = await fetch(`/absensi/${kegiatanId}/peserta`, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
            });
            const data = await res.json();
            setPeserta(data.peserta ?? []);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setPeserta([]);
        load();
    }, [kegiatanId]);

    const attended = peserta.filter((p) => p.is_attended);

    if (!kegiatanId) return null;

    return (
        <div className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border">
            <div className="flex items-center justify-between border-b border-inherit px-4 py-3">
                <div className="flex items-center gap-2">
                    <Users className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm font-medium">
                        Peserta Hadir
                        {peserta.length > 0 && (
                            <span className="text-muted-foreground ml-1.5 text-xs">
                                ({attended.length}/{peserta.length})
                            </span>
                        )}
                    </span>
                </div>
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={load} disabled={loading}>
                    <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            <div className="divide-y divide-inherit">
                {loading && peserta.length === 0 ? (
                    <div className="flex justify-center py-6">
                        <RefreshCw className="text-muted-foreground h-5 w-5 animate-spin" />
                    </div>
                ) : peserta.length === 0 ? (
                    <p className="text-muted-foreground py-6 text-center text-xs">
                        Belum ada peserta terdaftar untuk kegiatan ini.
                    </p>
                ) : (
                    peserta.map((p) => (
                        <div key={p.id} className="flex items-center justify-between px-4 py-2.5">
                            <div>
                                <p className="text-sm font-medium">{p.nama_lengkap}</p>
                                <p className="text-muted-foreground text-xs">{p.email}</p>
                            </div>
                            {p.is_attended ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Hadir
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    Belum
                                </span>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

// ---------- Manual Input Component ----------
function ManualInput({
    onSubmit,
    loading,
}: {
    onSubmit: (code: string) => Promise<void>;
    loading: boolean;
}) {
    const [value, setValue] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const trimmed = value.trim();
        if (!trimmed) return;
        await onSubmit(trimmed);
        setValue('');
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="space-y-1.5">
                <label htmlFor="manual-code" className="text-xs font-medium">
                    Kode Tiket
                </label>
                <div className="flex gap-2">
                    <Input
                        id="manual-code"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Tempel atau ketik kode tiket (UUID)…"
                        className="font-mono text-xs"
                        disabled={loading}
                        autoComplete="off"
                        autoFocus
                    />
                    <Button type="submit" size="sm" disabled={loading || !value.trim()} className="shrink-0">
                        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Verifikasi'}
                    </Button>
                </div>
            </div>
            <p className="text-muted-foreground text-[11px]">
                Masukkan kode UUID yang tertera di bagian bawah QR Code pada tiket peserta.
            </p>
        </form>
    );
}

// ---------- Main Page ----------
export default function Absensi({ kegiatans }: { kegiatans: Kegiatan[] }) {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [scanning, setScanning] = useState(false);
    const [scanMode, setScanMode] = useState<'qr' | 'manual'>('qr');
    const [manualLoading, setManualLoading] = useState(false);
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);
    const [pesertaKey, setPesertaKey] = useState(0);

    const selectedKegiatan = kegiatans.find((k) => k.id === selectedId) ?? null;

    async function handleScan(ticketCode: string) {
        if (!selectedId) return;

        // CSRF token
        const csrfMeta = document.querySelector('meta[name="csrf-token"]');
        const csrfToken = csrfMeta?.getAttribute('content') ?? '';

        try {
            const res = await fetch('/absensi/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    ticket_code: ticketCode,
                    kegiatan_id: selectedId,
                }),
            });

            const data: ScanResult = await res.json();
            setScanResult(data);

            if (data.success) {
                // Refresh list peserta setelah berhasil absen
                setPesertaKey((k) => k + 1);
            }
        } catch {
            setScanResult({
                success: false,
                message: 'Gagal terhubung ke server. Silakan coba lagi.',
            });
        }
    }

    async function handleManual(code: string) {
        setManualLoading(true);
        setScanResult(null);
        await handleScan(code);
        setManualLoading(false);
    }

    function handleSelectKegiatan(val: string) {
        setSelectedId(Number(val));
        setScanning(false);
        setScanResult(null);
        setPesertaKey((k) => k + 1);
    }

    return (
        <>
            <Head title="Absensi" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div>
                    <h1 className="text-xl font-semibold">Absensi</h1>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                        Scan QR Code tiket peserta untuk mencatat kehadiran.
                    </p>
                </div>

                {/* Pilih Kegiatan */}
                <div className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                    <label className="mb-1.5 block text-xs font-medium">Pilih Kegiatan</label>
                    <Select onValueChange={handleSelectKegiatan} value={selectedId?.toString() ?? ''}>
                        <SelectTrigger className="w-full" id="pilih-kegiatan">
                            <SelectValue placeholder="— Pilih kegiatan untuk absensi —" />
                        </SelectTrigger>
                        <SelectContent>
                            {kegiatans.length === 0 ? (
                                <div className="text-muted-foreground px-2 py-3 text-center text-xs">
                                    Belum ada kegiatan.
                                </div>
                            ) : (
                                kegiatans.map((k) => (
                                    <SelectItem key={k.id} value={String(k.id)}>
                                        <span>{k.judul}</span>
                                        <span className="text-muted-foreground ml-2 text-xs">· {k.tanggal}</span>
                                    </SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>
                </div>

                {/* Scanner area */}
                {selectedId && (
                    <div className="border-sidebar-border/70 dark:border-sidebar-border flex flex-col gap-4 rounded-xl border p-4">
                        {/* Tab toggle: QR vs Manual */}
                        <div className="flex items-center justify-between">
                            <div className="inline-flex gap-1 rounded-lg bg-muted p-1">
                                <button
                                    onClick={() => {
                                        setScanMode('qr');
                                        setScanResult(null);
                                    }}
                                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                                        scanMode === 'qr'
                                            ? 'bg-background text-foreground shadow-sm'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    <ScanLine className="h-3.5 w-3.5" />
                                    Scan QR
                                </button>
                                <button
                                    onClick={() => {
                                        setScanMode('manual');
                                        setScanning(false);
                                        setScanResult(null);
                                    }}
                                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                                        scanMode === 'manual'
                                            ? 'bg-background text-foreground shadow-sm'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    <Keyboard className="h-3.5 w-3.5" />
                                    Input Manual
                                </button>
                            </div>

                            {/* Tombol kamera hanya muncul di mode QR */}
                            {scanMode === 'qr' && (
                                <Button
                                    variant={scanning ? 'destructive' : 'default'}
                                    size="sm"
                                    className="gap-1.5"
                                    onClick={() => {
                                        setScanning((s) => !s);
                                        setScanResult(null);
                                    }}
                                >
                                    {scanning ? (
                                        <>
                                            <CameraOff className="h-3.5 w-3.5" />
                                            Stop Kamera
                                        </>
                                    ) : (
                                        <>
                                            <Camera className="h-3.5 w-3.5" />
                                            Mulai Scan
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>

                        {/* Mode: QR Scanner */}
                        {scanMode === 'qr' && (
                            <div className="relative overflow-hidden rounded-xl bg-black/5 dark:bg-white/5">
                                {/* Idle state */}
                                {!scanning && (
                                    <div className="flex min-h-[220px] flex-col items-center justify-center gap-2">
                                        <ScanLine className="text-muted-foreground/40 h-12 w-12" />
                                        <p className="text-muted-foreground text-xs">
                                            Tekan "Mulai Scan" untuk membuka kamera.
                                        </p>
                                        <button
                                            onClick={() => {
                                                setScanMode('manual');
                                                setScanResult(null);
                                            }}
                                            className="text-primary mt-1 text-xs underline-offset-2 hover:underline"
                                        >
                                            Kamera bermasalah? Input manual →
                                        </button>
                                    </div>
                                )}

                                <QRScanner
                                    kegiatanId={selectedId}
                                    onScan={handleScan}
                                    active={scanning}
                                    onStop={() => setScanning(false)}
                                />

                                {/* Overlay hasil scan di dalam kamera */}
                                {scanning && scanResult && (
                                    <div
                                        className={`absolute inset-0 flex flex-col items-center justify-center gap-3 backdrop-blur-sm transition-opacity duration-300 ${
                                            scanResult.success
                                                ? 'bg-emerald-500/80'
                                                : scanResult.already_attended
                                                  ? 'bg-amber-500/80'
                                                  : 'bg-red-500/80'
                                        }`}
                                    >
                                        {scanResult.success ? (
                                            <CheckCircle2 className="h-16 w-16 text-white drop-shadow" />
                                        ) : scanResult.already_attended ? (
                                            <Clock className="h-16 w-16 text-white drop-shadow" />
                                        ) : (
                                            <XCircle className="h-16 w-16 text-white drop-shadow" />
                                        )}
                                        <div className="text-center">
                                            {scanResult.nama_lengkap && (
                                                <p className="text-lg font-bold text-white drop-shadow">
                                                    {scanResult.nama_lengkap}
                                                </p>
                                            )}
                                            <p className="mt-0.5 text-sm font-medium text-white/90 drop-shadow">
                                                {scanResult.message}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setScanResult(null)}
                                            className="mt-2 flex items-center gap-1.5 rounded-full border border-white/40 bg-white/20 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/30 active:scale-95"
                                        >
                                            <ScanLine className="h-4 w-4" />
                                            Scan Berikutnya
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Mode: Manual Input */}
                        {scanMode === 'manual' && (
                            <div className="rounded-xl bg-muted/40 p-4">
                                <ManualInput onSubmit={handleManual} loading={manualLoading} />
                            </div>
                        )}

                        {/* Toast teks: hanya di mode manual (mode QR pakai overlay di dalam kamera) */}
                        {scanMode === 'manual' && (
                            <ScanToast result={scanResult} onDismiss={() => setScanResult(null)} />
                        )}
                    </div>
                )}

                {/* Daftar peserta */}
                {selectedId && <PesertaList key={`${selectedId}-${pesertaKey}`} kegiatanId={selectedId} />}
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
