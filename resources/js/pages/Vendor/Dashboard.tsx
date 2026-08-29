import ImageUploadPreview from '@/components/ImageUploadPreview';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Edit,
    LogOut,
    Package,
    Plus,
    Settings,
    Store,
    Trash2,
    Utensils,
} from 'lucide-react';
import { useState } from 'react';

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    category_id: number;
    category?: { name: string };
    price: number;
    description: string;
    is_available: boolean;
    sale_unit?: string;
    unit_label?: string | null;
    images?: { url: string }[];
}

interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    item?: { name: string };
}

interface Order {
    id: number;
    code: string;
    status: string;
    total: number;
    user?: { name: string; email: string };
    items: OrderItem[];
    driver?: { name: string };
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
    products: Product[];
    categories: Category[];
    orders: Order[];
    ratings: Rating[];
}

export default function VendorDashboard({
    products = [],
    categories = [],
    orders = [],
    ratings = [],
}: Props) {
    const [activeTab, setActiveTab] = useState<
        'products' | 'orders' | 'ratings'
    >('products');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [loadingOrderId, setLoadingOrderId] = useState<number | null>(null);

    const {
        data,
        setData,
        post,
        delete: destroy,
        processing,
        reset,
        errors,
    } = useForm({
        name: '',
        category_id: categories[0]?.id || 1,
        price: '',
        description: '',
        is_available: true,
        sale_unit: 'orden',
        unit_label: '',
        image: null as File | string | null,
    });

    const openCreateModal = () => {
        setEditingProduct(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setData({
            name: product.name,
            category_id: product.category_id,
            price: product.price.toString(),
            description: product.description || '',
            is_available: product.is_available,
            sale_unit: product.sale_unit || 'orden',
            unit_label: product.unit_label || '',
            image: product.images?.[0]?.url || null,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProduct) {
            router.post(
                `/vendor/products/${editingProduct.id}`,
                {
                    _method: 'PUT',
                    ...data,
                },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        reset();
                    },
                    onError: (errors) => {
                        console.error('Error updating product:', errors);
                    },
                },
            );
        } else {
            post('/vendor/products', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
                onError: (errors) => {
                    console.error('Error creating product:', errors);
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar este platillo?')) {
            destroy(`/vendor/products/${id}`);
        }
    };

    const updateOrderStatus = (orderId: number, status: string) => {
        setLoadingOrderId(orderId);
        router.put(
            `/vendor/orders/${orderId}/status`,
            { status },
            {
                preserveScroll: true,
                onFinish: () => setLoadingOrderId(null),
            },
        );
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <span className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-400">
                        Pendiente
                    </span>
                );
            case 'preparing':
                return (
                    <span className="rounded-xl border border-[#ff4600]/20 bg-[#ff4600]/10 px-2.5 py-1 text-xs font-bold text-[#ff4600]">
                        En preparación
                    </span>
                );
            case 'ready':
                return (
                    <span className="rounded-xl border border-[#f5ee04]/20 bg-[#f5ee04]/10 px-2.5 py-1 text-xs font-bold text-[#f5ee04]">
                        Listo para entrega
                    </span>
                );
            case 'completed':
            case 'delivered':
                return (
                    <span className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400">
                        Entregado
                    </span>
                );
            default:
                return (
                    <span className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-bold text-zinc-400">
                        {status}
                    </span>
                );
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#070709] font-sans text-white antialiased selection:bg-[#ff4600] selection:text-white">
            <Head title="Panel de Tienda - EATLY Plaza UPP" />

            {/* Luces Ambientales Liquid Glass */}
            <div className="pointer-events-none fixed -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#ff4600]/10 blur-[150px]" />
            <div className="pointer-events-none fixed -right-40 -bottom-40 h-[500px] w-[500px] rounded-full bg-[#f5ee04]/5 blur-[150px]" />

            {/* Header unificado horizontal */}
            <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-[#070709]/80 px-6 py-3.5 backdrop-blur-2xl">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/vendor/dashboard"
                        className="group flex items-center gap-1"
                    >
                        <span className="text-2xl font-black tracking-tight text-white">
                            EATLY
                        </span>
                        <span className="h-2 w-2 rounded-full bg-[#ff4600]" />
                    </Link>
                </div>

                <div className="flex items-center space-x-3">
                    <Link
                        href="/vendor/dashboard"
                        className="flex items-center gap-1.5 rounded-2xl px-3.5 py-2.5 text-xs font-extrabold text-zinc-300 transition duration-200 hover:bg-white/5 hover:text-white"
                    >
                        Panel de tienda
                    </Link>

                    <Link
                        href="/settings/profile"
                        className="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-bold text-zinc-300 transition duration-200 hover:border-[#ff4600]/40 hover:text-[#ff4600]"
                        title="Ajustes"
                    >
                        <Settings className="h-4 w-4 text-[#ff4600]" /> Ajustes
                    </Link>

                    <button
                        onClick={() => router.post('/logout')}
                        className="flex cursor-pointer items-center gap-1 rounded-2xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-400 transition duration-200 hover:bg-red-500 hover:text-white"
                    >
                        <LogOut className="h-3.5 w-3.5" /> Salir
                    </button>
                </div>
            </header>

            <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 py-8 pb-24">
                {/* Banner de Sección */}
                <div className="relative mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#ff4600] via-[#ea580c] to-[#9a3412] p-6 text-white shadow-2xl md:p-8">
                    <div className="relative z-10">
                        <span className="mb-2 inline-block rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-black tracking-widest text-[#f5ee04] uppercase backdrop-blur-md">
                            Concesionario UPP
                        </span>
                        <h1 className="text-2xl font-black tracking-tight lg:text-3xl">
                            Panel de gestión del local
                        </h1>
                        <p className="mt-1 text-xs text-orange-100">
                            Administra tu menú de platillos y supervisa los
                            pedidos de los comensales.
                        </p>
                    </div>
                </div>

                {/* Barra de pestañas */}
                <div className="mb-8 flex flex-wrap items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-xl">
                    <Link
                        href="/vendor/profile"
                        className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-bold text-zinc-300 transition hover:bg-white/10"
                    >
                        <Store className="h-4 w-4 text-[#ff4600]" /> Perfil y
                        Ubicación
                    </Link>
                    <Link
                        href="/settings/profile"
                        className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-bold text-zinc-300 transition hover:bg-white/10"
                    >
                        <Settings className="h-4 w-4 text-[#ff4600]" /> Ajustes
                    </Link>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`flex cursor-pointer items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition ${activeTab === 'products' ? 'bg-[#ff4600] text-white shadow-md' : 'border border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/10'}`}
                    >
                        <Utensils className="h-4 w-4" /> Mis Platillos (
                        {products.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`flex cursor-pointer items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition ${activeTab === 'orders' ? 'bg-[#ff4600] text-white shadow-md' : 'border border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/10'}`}
                    >
                        <Package className="h-4 w-4" /> Pedidos Recibidos (
                        {orders.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('ratings')}
                        className={`flex cursor-pointer items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition ${activeTab === 'ratings' ? 'bg-[#ff4600] text-white shadow-md' : 'border border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/10'}`}
                    >
                        Reseñas ({ratings.length})
                    </button>
                </div>

                {/* TAB: PLATILLOS */}
                {activeTab === 'products' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
                            <h2 className="text-base font-black text-white">
                                Catálogo de Alimentos y Bebidas
                            </h2>
                            <button
                                onClick={openCreateModal}
                                className="flex cursor-pointer items-center gap-2 rounded-2xl bg-[#ff4600] px-5 py-2.5 text-xs font-black tracking-wider text-white uppercase shadow-md transition hover:bg-white hover:text-black"
                            >
                                <Plus className="h-4 w-4" /> Nuevo Platillo
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl transition hover:border-[#ff4600]/40"
                                >
                                    <div>
                                        <div className="mb-3 flex items-start justify-between">
                                            <span className="rounded-xl border border-[#ff4600]/20 bg-[#ff4600]/10 px-3 py-1 text-xs font-bold text-[#ff4600]">
                                                {product.category?.name ||
                                                    'General'}
                                            </span>
                                            <span className="font-mono text-base font-black text-[#f5ee04]">
                                                $
                                                {Number(product.price).toFixed(
                                                    2,
                                                )}{' '}
                                                <span className="text-[10px] font-normal text-zinc-400">
                                                    {product.unit_label
                                                        ? `(${product.unit_label})`
                                                        : product.sale_unit ===
                                                            'pieza'
                                                          ? '(Por pza)'
                                                          : '(Por orden)'}
                                                </span>
                                            </span>
                                        </div>
                                        <h3 className="mb-1 text-base font-bold text-white">
                                            {product.name}
                                        </h3>
                                        <p className="mb-4 line-clamp-3 text-xs text-zinc-400">
                                            {product.description}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                                        <span
                                            className={`rounded-xl px-3 py-1 text-xs font-bold ${product.is_available ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border border-red-500/20 bg-red-500/10 text-red-400'}`}
                                        >
                                            {product.is_available
                                                ? 'Disponible'
                                                : 'Agotado'}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() =>
                                                    openEditModal(product)
                                                }
                                                className="cursor-pointer rounded-xl bg-white/5 p-2.5 text-zinc-300 transition hover:bg-white/10"
                                                title="Editar"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(product.id)
                                                }
                                                className="cursor-pointer rounded-xl bg-red-500/10 p-2.5 text-red-400 transition hover:bg-red-500 hover:text-white"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TAB: PEDIDOS */}
                {activeTab === 'orders' && (
                    <div className="space-y-6">
                        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
                            <h2 className="text-base font-black text-white">
                                Control de Pedidos en Tiempo Real
                            </h2>
                        </div>

                        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-left">
                                    <thead>
                                        <tr className="border-b border-white/10 bg-black/40 text-xs font-bold tracking-wider text-zinc-400 uppercase">
                                            <th className="p-4">
                                                Pedido / Cliente
                                            </th>
                                            <th className="p-4">Platillos</th>
                                            <th className="p-4">Total</th>
                                            <th className="p-4">Repartidor</th>
                                            <th className="p-4">
                                                Estado Actual
                                            </th>
                                            <th className="p-4 text-right">
                                                Acciones de Estado
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-sm">
                                        {orders.map((order) => (
                                            <tr
                                                key={order.id}
                                                className="transition hover:bg-white/[0.02]"
                                            >
                                                <td className="p-4 font-medium text-white">
                                                    <div className="font-mono font-bold text-[#ff4600]">
                                                        #
                                                        {order.code || order.id}
                                                    </div>
                                                    <div className="text-xs text-zinc-400">
                                                        {order.user?.name ||
                                                            'Cliente UPP'}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-xs text-zinc-300">
                                                    {order.items?.map(
                                                        (i, idx) => (
                                                            <div key={idx}>
                                                                • {i.quantity}x{' '}
                                                                {i.item?.name ||
                                                                    'Platillo'}
                                                            </div>
                                                        ),
                                                    )}
                                                </td>
                                                <td className="p-4 font-mono font-bold text-[#f5ee04]">
                                                    $
                                                    {Number(
                                                        order.total,
                                                    ).toFixed(2)}
                                                </td>
                                                <td className="p-4 text-xs text-zinc-400">
                                                    {order.driver?.name ? (
                                                        <span className="font-semibold text-white">
                                                            {order.driver.name}
                                                        </span>
                                                    ) : (
                                                        <span className="text-amber-400/80 italic">
                                                            Sin asignar
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    {getStatusBadge(
                                                        order.status,
                                                    )}
                                                </td>
                                                <td className="space-x-2 p-4 text-right">
                                                    {order.status ===
                                                        'pending' && (
                                                        <button
                                                            onClick={() =>
                                                                updateOrderStatus(
                                                                    order.id,
                                                                    'preparing',
                                                                )
                                                            }
                                                            disabled={
                                                                loadingOrderId ===
                                                                order.id
                                                            }
                                                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#ff4600] px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-white hover:text-black disabled:opacity-50"
                                                        >
                                                            {loadingOrderId ===
                                                            order.id ? (
                                                                <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                            ) : null}{' '}
                                                            Preparar
                                                        </button>
                                                    )}
                                                    {order.status ===
                                                        'preparing' && (
                                                        <button
                                                            onClick={() =>
                                                                updateOrderStatus(
                                                                    order.id,
                                                                    'ready',
                                                                )
                                                            }
                                                            disabled={
                                                                loadingOrderId ===
                                                                order.id
                                                            }
                                                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-bold text-black shadow-sm transition hover:bg-emerald-400 disabled:opacity-50"
                                                        >
                                                            {loadingOrderId ===
                                                            order.id ? (
                                                                <div className="h-3 w-3 animate-spin rounded-full border-2 border-black border-t-transparent" />
                                                            ) : null}{' '}
                                                            Listo
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: RESEÑAS */}
                {activeTab === 'ratings' && (
                    <div className="space-y-6">
                        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
                            <h2 className="text-base font-black text-white">
                                Calificaciones y Opiniones de Clientes
                            </h2>
                        </div>
                        {ratings.length === 0 ? (
                            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 text-center text-sm font-medium text-zinc-500">
                                Aún no hay reseñas registradas para tu local.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {ratings.map((rating) => (
                                    <div
                                        key={rating.id}
                                        className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl"
                                    >
                                        <div>
                                            <div className="mb-2 flex items-start justify-between">
                                                <span className="text-sm font-bold text-white">
                                                    {rating.user?.name ||
                                                        'Comensal UPP'}
                                                </span>
                                                <div className="flex items-center font-mono text-sm font-bold text-amber-400">
                                                    ({rating.stars}/5)
                                                </div>
                                            </div>
                                            <p className="mb-2 font-mono text-xs text-zinc-500">
                                                Pedido: #
                                                {rating.order?.code || 'N/A'}
                                            </p>
                                            <p className="rounded-2xl border border-white/5 bg-black/40 p-3 text-sm text-zinc-300 italic">
                                                "
                                                {rating.comment ||
                                                    'Sin comentario escrito.'}
                                                "
                                            </p>
                                        </div>
                                        <div className="mt-4 border-t border-white/10 pt-3 font-mono text-[10px] text-zinc-500">
                                            {new Date(
                                                rating.created_at,
                                            ).toLocaleDateString('es-MX', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Modal Crear / Editar Platillo */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
                        <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-y-auto rounded-3xl border border-white/15 bg-[#0f0f13] p-8 shadow-2xl">
                            <h3 className="mb-6 text-lg font-black text-white">
                                {editingProduct
                                    ? 'Editar Platillo'
                                    : 'Nuevo Platillo para el Menú'}
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-xs font-bold text-zinc-400 uppercase">
                                        Nombre del Platillo
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        required
                                        className="w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-[#ff4600]"
                                        placeholder="Ej. Hamburguesa Doble con Queso"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-xs text-red-400">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="mb-1 block text-xs font-bold text-zinc-400 uppercase">
                                            Categoría
                                        </label>
                                        <select
                                            value={data.category_id}
                                            onChange={(e) =>
                                                setData(
                                                    'category_id',
                                                    Number(e.target.value),
                                                )
                                            }
                                            className="w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-[#ff4600]"
                                        >
                                            {categories &&
                                            categories.length > 0 ? (
                                                categories.map((cat) => (
                                                    <option
                                                        key={cat.id}
                                                        value={cat.id}
                                                        className="bg-[#0e0e11]"
                                                    >
                                                        {cat.name}
                                                    </option>
                                                ))
                                            ) : (
                                                <option
                                                    value={1}
                                                    className="bg-[#0e0e11]"
                                                >
                                                    Comida General
                                                </option>
                                            )}
                                        </select>
                                        {errors.category_id && (
                                            <p className="mt-1 text-xs text-red-400">
                                                {errors.category_id}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-bold text-zinc-400 uppercase">
                                            Precio ($)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={data.price}
                                            onChange={(e) =>
                                                setData('price', e.target.value)
                                            }
                                            required
                                            className="w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-[#ff4600]"
                                            placeholder="55.00"
                                        />
                                        {errors.price && (
                                            <p className="mt-1 text-xs text-red-400">
                                                {errors.price}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="mb-1 block text-xs font-bold text-zinc-400 uppercase">
                                            Se vende por
                                        </label>
                                        <select
                                            value={data.sale_unit}
                                            onChange={(e) =>
                                                setData(
                                                    'sale_unit',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-[#ff4600]"
                                        >
                                            <option
                                                value="orden"
                                                className="bg-[#0e0e11]"
                                            >
                                                Orden completa
                                            </option>
                                            <option
                                                value="pieza"
                                                className="bg-[#0e0e11]"
                                            >
                                                Pieza individual
                                            </option>
                                            <option
                                                value="otro"
                                                className="bg-[#0e0e11]"
                                            >
                                                Otro (especificar)
                                            </option>
                                        </select>
                                        {errors.sale_unit && (
                                            <p className="mt-1 text-xs text-red-400">
                                                {errors.sale_unit}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-bold text-zinc-400 uppercase">
                                            Etiqueta de Unidad
                                        </label>
                                        <input
                                            type="text"
                                            value={data.unit_label}
                                            onChange={(e) =>
                                                setData(
                                                    'unit_label',
                                                    e.target.value,
                                                )
                                            }
                                            disabled={data.sale_unit !== 'otro'}
                                            className="w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-[#ff4600] disabled:opacity-30"
                                            placeholder={
                                                data.sale_unit === 'otro'
                                                    ? 'Ej. 1L, 5 pzas, porción'
                                                    : 'N/A'
                                            }
                                        />
                                        {errors.unit_label && (
                                            <p className="mt-1 text-xs text-red-400">
                                                {errors.unit_label}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-bold text-zinc-400 uppercase">
                                        Imagen de Referencia del Platillo
                                    </label>
                                    <div className="rounded-2xl border border-white/10 bg-black/60 p-3">
                                        <ImageUploadPreview
                                            value={data.image}
                                            onChange={(file) =>
                                                setData('image', file)
                                            }
                                            label="Sube una foto del platillo"
                                        />
                                    </div>
                                    {errors.image && (
                                        <p className="mt-1 text-xs text-red-400">
                                            {errors.image}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-bold text-zinc-400 uppercase">
                                        Descripción
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        rows={3}
                                        className="w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-[#ff4600]"
                                        placeholder="Ingredientes y detalles..."
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-xs text-red-400">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-end gap-3 border-t border-white/10 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="cursor-pointer rounded-2xl bg-white/5 px-5 py-3 text-xs font-bold text-zinc-300 uppercase transition hover:bg-white/10"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="cursor-pointer rounded-2xl bg-[#ff4600] px-6 py-3 text-xs font-black text-white uppercase shadow transition hover:bg-white hover:text-black"
                                    >
                                        {editingProduct
                                            ? 'Guardar Cambios'
                                            : 'Crear Platillo'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
