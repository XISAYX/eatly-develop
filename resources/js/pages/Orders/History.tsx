import RatingModal from '@/components/RatingModal';
import StarRating from '@/components/StarRating';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Bell,
    Calendar,
    CheckCircle2,
    Clock,
    LogOut,
    Settings,
    UtensilsCrossed,
    XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface RatingSummary {
    rateable_type: string;
    stars: number;
}

interface OrderRow {
    id: number;
    code: string;
    status: string;
    total: number;
    created_at: string;
    driver_id: number | null;
    branch: { id: number; name: string } | null;
    ratings: RatingSummary[];
}

interface HistoryProps {
    orders?: {
        data: OrderRow[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    auth?: {
        user?: {
            name: string;
            email: string;
        };
    };
    [key: string]: unknown;
}

const statusLabels: Record<string, string> = {
    pending: 'Pendiente',
    confirmed: 'Confirmado',
    preparing: 'En preparación',
    ready: 'Listo para entrega',
    ready_for_pickup: 'Listo para entrega',
    delivering: 'En camino',
    delivery: 'En camino',
    on_the_way: 'En camino',
    delivered: 'Esperando tu confirmación',
    completed: 'Entregado',
    cancelled: 'Cancelado',
};

export default function History() {
    const { orders, auth } = usePage<HistoryProps & SharedData>().props;
    const userRole =
        ((auth?.user as Record<string, unknown>)?.role as string) || 'client';

    const getHomeUrl = () => {
        if (userRole === 'merchant') return '/vendor/dashboard';
        if (userRole === 'driver') return '/delivery/dashboard';
        return '/dashboard';
    };

    const getHomeLabel = () => {
        if (userRole === 'merchant') return 'Panel de Cocina';
        if (userRole === 'driver') return 'Panel de Repartidor';
        return 'Ir al Menú';
    };

    const homeUrl = getHomeUrl();
    const homeLabel = getHomeLabel();
    const [ratingOrder, setRatingOrder] = useState<OrderRow | null>(null);
    const [processingOrderId, setProcessingOrderId] = useState<number | null>(
        null,
    );
    const [deliveryNoticeOrder, setDeliveryNoticeOrder] =
        useState<OrderRow | null>(null);

    const ordersData = orders?.data ?? [];

    useEffect(() => {
        const interval = window.setInterval(() => {
            router.reload({ only: ['orders'] });
        }, 15000);

        return () => window.clearInterval(interval);
    }, []);

    useEffect(() => {
        const deliveredOrder = ordersData.find((order) => {
            const noticeKey = `eatly-delivery-notice-${order.id}`;
            return (
                order.status === 'delivered' &&
                !window.sessionStorage.getItem(noticeKey)
            );
        });

        if (!deliveredOrder) return;

        window.sessionStorage.setItem(
            `eatly-delivery-notice-${deliveredOrder.id}`,
            'shown',
        );
        setTimeout(() => setDeliveryNoticeOrder(deliveredOrder), 0);

        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('¿Llegó tu pedido?', {
                body: `El repartidor marcó como entregado el pedido ${deliveredOrder.code}.`,
            });
        }
    }, [ordersData]);

    const hasBranchRating = (order: OrderRow) =>
        order.ratings?.some((r) => r.rateable_type.endsWith('Branch')) ?? false;

    const canCancel = (order: OrderRow) =>
        ['pending', 'preparing', 'ready'].includes(order.status) &&
        !order.driver_id;

    const confirmDelivery = (orderId: number) => {
        setProcessingOrderId(orderId);
        router.patch(
            `/pedidos/${orderId}/confirmar-entrega`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setProcessingOrderId(null),
            },
        );
    };

    const cancelOrder = (order: OrderRow) => {
        if (
            !window.confirm(
                '¿Deseas cancelar este pedido? Esta acción no se puede deshacer.',
            )
        ) {
            return;
        }

        setProcessingOrderId(order.id);
        router.patch(
            `/pedidos/${order.id}/cancelar`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setProcessingOrderId(null),
            },
        );
    };

    const getStatusClasses = (status: string) => {
        if (status === 'completed') {
            return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400';
        }
        if (status === 'delivered') {
            return 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400';
        }
        if (status === 'cancelled') {
            return 'border-red-500/30 bg-red-500/10 text-red-400';
        }
        return 'border-[#f5ee04]/30 bg-[#f5ee04]/10 text-[#f5ee04]';
    };

    const formatFecha = (fechaStr: string) => {
        try {
            const fecha = new Date(fechaStr);
            return fecha.toLocaleDateString('es-MX', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            });
        } catch {
            return fechaStr;
        }
    };

    const formatHora = (fechaStr: string) => {
        try {
            const fecha = new Date(fechaStr);
            return fecha.toLocaleTimeString('es-MX', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
        } catch {
            return '';
        }
    };

    return (
        <>
            <Head title="Mis Pedidos | EATLY" />
            <div className="flex min-h-screen flex-col overflow-x-hidden bg-[#070709] font-sans text-white antialiased selection:bg-[#ff4600] selection:text-white">
                {/* Luces Ambientales Liquid Glass */}
                <div className="pointer-events-none fixed -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-[#ff4600]/15 blur-[160px]" />
                <div className="pointer-events-none fixed -right-40 -bottom-40 h-[520px] w-[520px] rounded-full bg-[#f5ee04]/10 blur-[160px]" />

                {/* Navbar Superior */}
                <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070709]/80 px-6 py-3.5 backdrop-blur-2xl">
                    <div className="mx-auto flex max-w-5xl items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href={homeUrl}
                                className="group flex items-center gap-1"
                            >
                                <span className="text-2xl font-black tracking-tight text-white">
                                    EATLY
                                </span>
                                <span className="h-2 w-2 rounded-full bg-[#ff4600] transition-transform group-hover:scale-125" />
                            </Link>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Link
                                href={homeUrl}
                                className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-bold text-zinc-300 transition duration-200 hover:border-[#ff4600]/40 hover:text-[#ff4600]"
                            >
                                <UtensilsCrossed className="h-3.5 w-3.5" />
                                {homeLabel}
                            </Link>

                            <Link
                                href="/settings/profile"
                                className="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-bold text-zinc-300 transition duration-200 hover:border-white/20 hover:text-white"
                                title="Ajustes"
                            >
                                <Settings className="h-3.5 w-3.5 text-[#ff4600]" />
                                Ajustes
                            </Link>

                            <button
                                type="button"
                                onClick={() => router.post('/logout')}
                                className="flex cursor-pointer items-center gap-1 rounded-2xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-400 transition duration-200 hover:bg-red-500 hover:text-white"
                            >
                                <LogOut className="h-3.5 w-3.5" /> Salir
                            </button>
                        </div>
                    </div>
                </header>

                <main className="relative z-10 mx-auto w-full max-w-4xl flex-1 px-4 py-8 pb-24">
                    {/* Banner Hero */}
                    <div className="relative mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#ff4600] via-[#ea580c] to-[#9a3412] p-8 text-white shadow-2xl">
                        <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-[#f5ee04]/20 blur-3xl" />
                        <div className="relative z-10">
                            <span className="mb-2 inline-block rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-black tracking-widest text-[#f5ee04] uppercase backdrop-blur-md">
                                COMPRAS RECIENTES
                            </span>
                            <h1 className="text-3xl font-black tracking-tight">
                                Mis Pedidos
                            </h1>
                            <p className="mt-1 text-xs text-orange-100">
                                Revisa el estado de tus compras y califica la
                                comida de los locales.
                            </p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-black tracking-wider text-zinc-300 uppercase backdrop-blur-md transition hover:border-[#ff4600]/40 hover:text-[#ff4600]"
                        >
                            <ArrowLeft className="h-4 w-4 text-[#ff4600]" />
                            Volver al Menú
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {ordersData.map((order) => (
                            <div
                                key={order.id}
                                className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent p-6 shadow-2xl backdrop-blur-xl transition duration-300 hover:border-white/20"
                            >
                                <div className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-base font-black text-white">
                                            {order.branch?.name ??
                                                'Cocina del Campus'}
                                        </p>
                                        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-zinc-400">
                                            <span className="rounded-lg border border-[#ff4600]/30 bg-[#ff4600]/10 px-2 py-0.5 font-bold text-[#ff4600]">
                                                {order.code}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                                                {formatFecha(order.created_at)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3.5 w-3.5 text-zinc-500" />
                                                {formatHora(order.created_at)}
                                            </span>
                                        </div>
                                    </div>

                                    <span
                                        className={`inline-flex items-center gap-1.5 self-start rounded-full border px-3 py-1 text-[10px] font-black tracking-wider uppercase sm:self-auto ${getStatusClasses(order.status)}`}
                                    >
                                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                        {statusLabels[order.status] ??
                                            order.status}
                                    </span>
                                </div>

                                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <span className="block text-[10px] font-bold text-zinc-500 uppercase">
                                            Total pagado
                                        </span>
                                        <p className="font-mono text-xl font-black text-[#f5ee04]">
                                            ${Number(order.total).toFixed(2)}{' '}
                                            <span className="text-xs font-normal text-zinc-500">
                                                MXN
                                            </span>
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        {order.status === 'delivered' && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    confirmDelivery(order.id)
                                                }
                                                disabled={
                                                    processingOrderId ===
                                                    order.id
                                                }
                                                className="cursor-pointer rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-black tracking-wider text-white uppercase shadow-lg transition hover:bg-emerald-500 disabled:opacity-50"
                                            >
                                                {processingOrderId === order.id
                                                    ? 'Confirmando...'
                                                    : 'Confirmar que lo recibí'}
                                            </button>
                                        )}

                                        {canCancel(order) && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    cancelOrder(order)
                                                }
                                                disabled={
                                                    processingOrderId ===
                                                    order.id
                                                }
                                                className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2.5 text-xs font-black tracking-wider text-red-400 uppercase transition hover:bg-red-500 hover:text-white disabled:opacity-50"
                                            >
                                                <XCircle className="h-4 w-4" />{' '}
                                                Cancelar
                                            </button>
                                        )}

                                        {order.status === 'completed' &&
                                            !hasBranchRating(order) && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setRatingOrder(order)
                                                    }
                                                    className="cursor-pointer rounded-xl bg-[#ff4600] px-4 py-2.5 text-xs font-black tracking-wider text-white uppercase shadow-lg transition hover:bg-white hover:text-black"
                                                >
                                                    Calificar Comida
                                                </button>
                                            )}

                                        {hasBranchRating(order) && (
                                            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-emerald-400">
                                                <CheckCircle2 className="h-4 w-4" />
                                                <span className="text-xs font-bold">
                                                    Calificado
                                                </span>
                                                <StarRating
                                                    value={
                                                        order.ratings?.find(
                                                            (r) =>
                                                                r.rateable_type.endsWith(
                                                                    'Branch',
                                                                ),
                                                        )?.stars ?? 0
                                                    }
                                                    readOnly
                                                    size={14}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {ordersData.length === 0 && (
                            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-16 text-center backdrop-blur-xl">
                                <p className="text-base font-black text-white">
                                    Aún no tienes pedidos registrados
                                </p>
                                <p className="mt-1 text-xs text-zinc-400">
                                    Haz tu primera orden desde el menú del
                                    campus.
                                </p>
                                <Link
                                    href={homeUrl}
                                    className="mt-5 inline-block rounded-xl bg-[#ff4600] px-5 py-2.5 text-xs font-black tracking-wider text-white uppercase shadow-lg transition hover:bg-white hover:text-black"
                                >
                                    Ver Menú
                                </Link>
                            </div>
                        )}
                    </div>

                    {ratingOrder && (
                        <RatingModal
                            orderId={ratingOrder.id}
                            branchName={
                                ratingOrder.branch?.name ?? 'este local'
                            }
                            hasDriver={!!ratingOrder.driver_id}
                            onClose={() => setRatingOrder(null)}
                        />
                    )}

                    {/* Modal aviso de entrega */}
                    {deliveryNoticeOrder && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
                            <div className="w-full max-w-sm rounded-3xl border border-white/15 bg-[#0f0f13] p-6 text-white shadow-2xl">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#ff4600]/30 bg-[#ff4600]/10 text-[#ff4600]">
                                    <Bell className="h-6 w-6" />
                                </div>
                                <h2 className="text-lg font-black text-white">
                                    ¿Ya tienes tu pedido?
                                </h2>
                                <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                                    El repartidor marcó como entregado el pedido{' '}
                                    <span className="font-bold text-[#f5ee04]">
                                        {deliveryNoticeOrder.code}
                                    </span>
                                    . Confírmalo si ya lo recibiste.
                                </p>
                                <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setDeliveryNoticeOrder(null)
                                        }
                                        className="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-zinc-300 hover:bg-white/10"
                                    >
                                        Revisar después
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            confirmDelivery(
                                                deliveryNoticeOrder.id,
                                            );
                                            setDeliveryNoticeOrder(null);
                                        }}
                                        disabled={
                                            processingOrderId ===
                                            deliveryNoticeOrder.id
                                        }
                                        className="cursor-pointer rounded-xl bg-[#ff4600] px-4 py-2.5 text-xs font-black text-white uppercase hover:bg-white hover:text-black disabled:opacity-50"
                                    >
                                        Sí, ya lo recibí
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                {/* Footer */}
                <footer className="border-t border-white/5 bg-[#050507] py-6 text-center text-xs text-zinc-600">
                    <p>
                        &copy; {new Date().getFullYear()} EATLY • Universidad
                        Politécnica de Pachuca
                    </p>
                </footer>
            </div>
        </>
    );
}
