import { Head, Link, router } from '@inertiajs/react';
import {
    Bike,
    LogOut,
    MapPin,
    Navigation,
    Package,
    Settings,
    Star,
    Store,
    User,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface OrderItem {
    id: number;
    quantity: number;
    item?: { name: string };
}

type GeoCoord = number | string | null;

interface Order {
    id: number;
    code: string;
    status: string;
    total: number;
    user?: { name: string; phone?: string };
    branch?: {
        name: string;
        restaurant?: {
            address?: string | null;
            latitude?: GeoCoord;
            longitude?: GeoCoord;
        };
        location?: {
            address_line?: string | null;
            lat?: GeoCoord;
            lng?: GeoCoord;
        };
    };
    items: OrderItem[];
    driver_id?: number;
    destino_edificio?: string | null;
    destino_aula?: string | null;
    delivery_lat?: GeoCoord;
    delivery_lng?: GeoCoord;
}

interface Rating {
    id: number;
    stars: number;
    comment: string | null;
    created_at: string;
    user?: { name: string };
    order?: { code: string };
}

interface Props {
    auth?: {
        user?: {
            name: string;
            email: string;
        };
    };
    availableOrders: Order[];
    myDeliveries: Order[];
    myRatings: Rating[];
}

function mapsUrl(
    latitude: number | string | null | undefined,
    longitude: number | string | null | undefined,
    reference: string,
) {
    const hasCoordinates =
        latitude !== null &&
        latitude !== undefined &&
        longitude !== null &&
        longitude !== undefined &&
        Number.isFinite(Number(latitude)) &&
        Number.isFinite(Number(longitude));
    const destination = hasCoordinates ? `${latitude},${longitude}` : reference;

    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

function restaurantMapsUrl(order: Order) {
    const restaurant = order.branch?.restaurant;
    const location = order.branch?.location;

    return mapsUrl(
        restaurant?.latitude ?? location?.lat,
        restaurant?.longitude ?? location?.lng,
        restaurant?.address ??
            location?.address_line ??
            `${order.branch?.name ?? 'Cafetería'} Universidad Politécnica de Pachuca`,
    );
}

function clientMapsUrl(order: Order) {
    return mapsUrl(
        order.delivery_lat,
        order.delivery_lng,
        [
            order.destino_edificio,
            order.destino_aula,
            'Universidad Politécnica de Pachuca',
        ]
            .filter(Boolean)
            .join(', '),
    );
}

export default function DeliveryDashboard({
    auth,
    availableOrders,
    myDeliveries,
    myRatings,
}: Readonly<Props>) {
    const [loadingOrderId, setLoadingOrderId] = useState<number | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['availableOrders', 'myDeliveries'] });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const takeOrder = (orderId: number) => {
        setLoadingOrderId(orderId);
        router.post(
            `/delivery/orders/${orderId}/take`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setLoadingOrderId(null),
            },
        );
    };

    const updateStatus = (orderId: number, status: string) => {
        setLoadingOrderId(orderId);
        router.patch(
            `/delivery/orders/${orderId}/status`,
            { status },
            {
                preserveScroll: true,
                onFinish: () => setLoadingOrderId(null),
            },
        );
    };

    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/logout');
    };

    const avgStars =
        myRatings.length > 0
            ? (
                  myRatings.reduce((acc, r) => acc + r.stars, 0) /
                  myRatings.length
              ).toFixed(1)
            : '5.0';

    return (
        <div className="relative flex min-h-screen flex-col justify-between overflow-x-hidden bg-[#070709] font-sans text-white antialiased selection:bg-[#ff4600] selection:text-white">
            <Head title="Repartidor | EATLY" />

            {/* Luces Ambientales */}
            <div className="pointer-events-none fixed -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#ff4600]/15 blur-[160px]" />
            <div className="pointer-events-none fixed -right-40 -bottom-40 h-[500px] w-[500px] rounded-full bg-[#f5ee04]/10 blur-[160px]" />

            {/* Barra de arriba */}
            <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070709]/85 px-5 py-3 backdrop-blur-2xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/delivery/dashboard"
                            className="group flex items-center gap-1"
                        >
                            <span className="text-2xl font-black tracking-tight text-white">
                                EATLY
                            </span>
                            <span className="h-2 w-2 rounded-full bg-[#ff4600] transition-transform group-hover:scale-125" />
                        </Link>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f5ee04]/30 bg-[#f5ee04]/10 px-3 py-0.5 text-[11px] font-black text-[#f5ee04] uppercase">
                            <Bike className="h-3.5 w-3.5" /> Modo Repartidor
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="hidden text-xs font-bold text-zinc-300 sm:inline">
                            Hola,{' '}
                            {auth?.user?.name?.split(' ')[0] || 'Repartidor'}
                        </span>
                        <Link
                            href="/settings/profile"
                            className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-zinc-300 transition hover:border-white/20 hover:text-white"
                        >
                            <Settings className="h-3.5 w-3.5 text-[#ff4600]" />{' '}
                            Ajustes
                        </Link>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex cursor-pointer items-center gap-1 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-400 transition hover:bg-red-500 hover:text-white"
                        >
                            <LogOut className="h-3.5 w-3.5" /> Salir
                        </button>
                    </div>
                </div>
            </header>

            {/* Contenido principal */}
            <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 space-y-7 px-4 py-6 pb-20 sm:px-6">
                {/* Banner con métricas rápidas */}
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#ff4600] via-[#ea580c] to-[#9a3412] p-6 text-white shadow-2xl sm:p-8">
                    <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-[#f5ee04]/20 blur-3xl" />

                    <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
                        <div>
                            <span className="mb-2 inline-block rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-black tracking-widest text-[#f5ee04] uppercase backdrop-blur-md">
                                REPARTIDOR UPP
                            </span>
                            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                                Tus entregas de hoy
                            </h1>
                            <p className="mt-1 text-xs text-orange-100">
                                Toma pedidos de las cocinas y llévalos a los
                                salones.
                            </p>
                        </div>

                        {/* Tarjetas resumen */}
                        <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
                            <div className="rounded-2xl border border-white/15 bg-black/30 p-3 text-center backdrop-blur-md">
                                <span className="block text-[10px] font-bold text-orange-200 uppercase">
                                    En curso
                                </span>
                                <span className="font-mono text-xl font-black text-white">
                                    {myDeliveries.length}
                                </span>
                            </div>
                            <div className="rounded-2xl border border-white/15 bg-black/30 p-3 text-center backdrop-blur-md">
                                <span className="block text-[10px] font-bold text-orange-200 uppercase">
                                    Listos
                                </span>
                                <span className="font-mono text-xl font-black text-[#f5ee04]">
                                    {availableOrders.length}
                                </span>
                            </div>
                            <div className="rounded-2xl border border-white/15 bg-black/30 p-3 text-center backdrop-blur-md">
                                <span className="block text-[10px] font-bold text-orange-200 uppercase">
                                    Estrellas
                                </span>
                                <span className="font-mono text-xl font-black text-emerald-400">
                                    ★ {avgStars}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 1. SECCIÓN: PEDIDOS EN CURSO */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="flex items-center gap-2 text-base font-black text-white sm:text-lg">
                            <Navigation className="h-5 w-5 text-[#ff4600]" />
                            Llevando ahora ({myDeliveries.length})
                        </h2>
                        {myDeliveries.length > 0 && (
                            <span className="animate-pulse text-xs font-bold text-[#f5ee04]">
                                ● Entrega en camino
                            </span>
                        )}
                    </div>

                    {myDeliveries.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center text-xs text-zinc-400 backdrop-blur-xl">
                            No tienes ningún pedido asignado ahorita. Mira la
                            lista de abajo para agarrar uno.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {myDeliveries.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex flex-col justify-between space-y-4 rounded-3xl border border-[#ff4600]/40 bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-transparent p-5 shadow-2xl backdrop-blur-xl"
                                >
                                    {/* Encabezado pedido */}
                                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                        <span className="rounded-lg bg-[#ff4600]/20 px-2.5 py-1 font-mono text-xs font-black text-[#ff4600]">
                                            Pedido #{order.code || order.id}
                                        </span>
                                        <span className="rounded-full border border-[#f5ee04]/30 bg-[#f5ee04]/10 px-2.5 py-0.5 text-[10px] font-black text-[#f5ee04] uppercase">
                                            {order.status === 'delivered'
                                                ? 'Esperando al cliente'
                                                : 'En camino'}
                                        </span>
                                    </div>

                                    {/* Ruta: De dónde a dónde */}
                                    <div className="space-y-2.5 text-xs">
                                        {/* Origen */}
                                        <div className="flex items-start gap-2.5 rounded-2xl border border-white/5 bg-black/40 p-3">
                                            <Store className="mt-0.5 h-4 w-4 shrink-0 text-[#f5ee04]" />
                                            <div className="min-w-0 flex-1">
                                                <span className="block text-[10px] font-bold text-zinc-400 uppercase">
                                                    Recoger en:
                                                </span>
                                                <p className="truncate font-black text-white">
                                                    {order.branch?.name ||
                                                        'Cocina del campus'}
                                                </p>
                                            </div>
                                            <a
                                                href={restaurantMapsUrl(order)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="shrink-0 rounded-xl border border-white/10 bg-white/5 p-2 text-zinc-300 hover:text-white"
                                                title="Ver en Google Maps"
                                            >
                                                <MapPin className="h-3.5 w-3.5 text-[#f5ee04]" />
                                            </a>
                                        </div>

                                        {/* Destino */}
                                        <div className="flex items-start gap-2.5 rounded-2xl border border-white/5 bg-black/40 p-3">
                                            <User className="mt-0.5 h-4 w-4 shrink-0 text-[#ff4600]" />
                                            <div className="min-w-0 flex-1">
                                                <span className="block text-[10px] font-bold text-zinc-400 uppercase">
                                                    Entregar a:
                                                </span>
                                                <p className="truncate font-black text-white">
                                                    {order.user?.name ||
                                                        'Cliente'}
                                                </p>
                                                <p className="mt-0.5 text-[11px] font-bold text-[#f5ee04]">
                                                    📍{' '}
                                                    {order.destino_edificio ||
                                                        'Edificio'}{' '}
                                                    •{' '}
                                                    {order.destino_aula ||
                                                        'Salón'}
                                                </p>
                                            </div>
                                            <a
                                                href={clientMapsUrl(order)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="shrink-0 rounded-xl border border-[#ff4600]/30 bg-[#ff4600]/10 p-2 text-[#ff4600] hover:bg-[#ff4600] hover:text-white"
                                                title="Ver destino en Google Maps"
                                            >
                                                <Navigation className="h-3.5 w-3.5" />
                                            </a>
                                        </div>

                                        {/* Comida */}
                                        <div className="pt-1">
                                            <span className="mb-1 block text-[10px] font-bold text-zinc-400 uppercase">
                                                Lo que lleva:
                                            </span>
                                            <ul className="space-y-1 text-xs text-zinc-300">
                                                {order.items?.map((i) => (
                                                    <li
                                                        key={`${order.id}-${i.id ?? i.item?.name}-${i.quantity}`}
                                                        className="flex items-center gap-1.5"
                                                    >
                                                        <span className="h-1.5 w-1.5 rounded-full bg-[#ff4600]" />
                                                        <span>
                                                            {i.quantity}x{' '}
                                                            {i.item?.name ||
                                                                'Platillo'}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Pie de tarjeta y botón de confirmación */}
                                    <div className="flex items-center justify-between border-t border-white/10 pt-3">
                                        <div>
                                            <span className="block text-[10px] font-bold text-zinc-500 uppercase">
                                                Cobro total
                                            </span>
                                            <p className="font-mono text-base font-black text-[#f5ee04]">
                                                $
                                                {Number(order.total).toFixed(2)}{' '}
                                                MXN
                                            </p>
                                        </div>

                                        {order.status === 'delivering' && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    updateStatus(
                                                        order.id,
                                                        'delivered',
                                                    )
                                                }
                                                disabled={
                                                    loadingOrderId === order.id
                                                }
                                                className="cursor-pointer rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-black text-white uppercase shadow-lg transition hover:bg-emerald-500 active:scale-95 disabled:opacity-50"
                                            >
                                                {loadingOrderId === order.id
                                                    ? 'Guardando...'
                                                    : '✓ Ya lo entregué'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 2. SECCIÓN: PEDIDOS LISTOS PARA TOMAR */}
                <div className="space-y-4 pt-2">
                    <h2 className="flex items-center gap-2 text-base font-black text-white sm:text-lg">
                        <Package className="h-5 w-5 text-[#f5ee04]" />
                        Pedidos listos para llevar ({availableOrders.length})
                    </h2>

                    {availableOrders.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center text-xs text-zinc-400 backdrop-blur-xl">
                            Por ahora no hay pedidos cocinados esperando
                            repartidor. Se actualizará solo en cuanto haya uno.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {availableOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex flex-col justify-between space-y-4 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent p-5 shadow-xl backdrop-blur-xl"
                                >
                                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                        <span className="font-mono text-xs font-black text-white">
                                            Pedido #{order.code || order.id}
                                        </span>
                                        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-black text-emerald-400 uppercase">
                                            Listo en cocina
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-xs">
                                        <div>
                                            <span className="block text-[10px] font-bold text-zinc-400 uppercase">
                                                Cocina:
                                            </span>
                                            <p className="font-bold text-[#f5ee04]">
                                                {order.branch?.name ||
                                                    'Local del campus'}
                                            </p>
                                        </div>

                                        <div>
                                            <span className="block text-[10px] font-bold text-zinc-400 uppercase">
                                                Llevar a:
                                            </span>
                                            <p className="font-bold text-white">
                                                {order.destino_edificio ||
                                                    'Edificio'}{' '}
                                                •{' '}
                                                {order.destino_aula || 'Salón'}
                                            </p>
                                        </div>

                                        <div>
                                            <span className="mb-1 block text-[10px] font-bold text-zinc-400 uppercase">
                                                Comida:
                                            </span>
                                            <ul className="space-y-1 text-xs text-zinc-300">
                                                {order.items?.map((i) => (
                                                    <li
                                                        key={`${order.id}-${i.id ?? i.item?.name}-${i.quantity}`}
                                                        className="flex items-center gap-1.5"
                                                    >
                                                        <span className="h-1.5 w-1.5 rounded-full bg-[#f5ee04]" />
                                                        <span>
                                                            {i.quantity}x{' '}
                                                            {i.item?.name ||
                                                                'Platillo'}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-white/10 pt-3">
                                        <div>
                                            <span className="block text-[10px] font-bold text-zinc-500 uppercase">
                                                Total
                                            </span>
                                            <p className="font-mono text-base font-black text-white">
                                                $
                                                {Number(order.total).toFixed(2)}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => takeOrder(order.id)}
                                            disabled={
                                                loadingOrderId === order.id
                                            }
                                            className="cursor-pointer rounded-xl bg-[#ff4600] px-4 py-2 text-xs font-black tracking-wider text-white uppercase shadow-lg transition hover:bg-white hover:text-black active:scale-95 disabled:opacity-50"
                                        >
                                            {loadingOrderId === order.id
                                                ? 'Aceptando...'
                                                : 'Tomar este pedido'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 3. SECCIÓN: MIS CALIFICACIONES */}
                <div className="space-y-4 pt-2">
                    <h2 className="flex items-center gap-2 text-base font-black text-white sm:text-lg">
                        <Star className="h-5 w-5 text-[#f5ee04]" />
                        Opiniones de comensales ({myRatings.length})
                    </h2>

                    {myRatings.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center text-xs text-zinc-400 backdrop-blur-xl">
                            Todavía no tienes calificaciones. Cuando entregues
                            pedidos a tiempo y con amabilidad aquí saldrán tus
                            estrellas.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {myRatings.map((rating) => (
                                <div
                                    key={rating.id}
                                    className="flex flex-col justify-between rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent p-5 shadow-xl backdrop-blur-xl"
                                >
                                    <div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="text-xs font-bold text-white">
                                                {rating.user?.name ||
                                                    'Comensal'}
                                            </span>
                                            <span className="font-mono text-xs font-black text-[#f5ee04]">
                                                ★ {rating.stars}/5
                                            </span>
                                        </div>
                                        <p className="rounded-xl border border-white/5 bg-black/40 p-3 text-xs text-zinc-300 italic">
                                            "
                                            {rating.comment ||
                                                'Todo bien, entrega rápida.'}
                                            "
                                        </p>
                                    </div>
                                    <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2 text-[10px] text-zinc-500">
                                        <span>
                                            Pedido #
                                            {rating.order?.code || 'N/A'}
                                        </span>
                                        <span>
                                            {new Date(
                                                rating.created_at,
                                            ).toLocaleDateString('es-MX', {
                                                day: '2-digit',
                                                month: 'short',
                                            })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Pie de página */}
            <footer className="border-t border-white/5 bg-[#050507] py-6 text-center text-xs text-zinc-600">
                <p>
                    &copy; {new Date().getFullYear()} EATLY • Universidad
                    Politécnica de Pachuca
                </p>
            </footer>
        </div>
    );
}
