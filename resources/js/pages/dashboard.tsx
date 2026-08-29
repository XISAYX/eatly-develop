import Sidebar from '@/components/Sidebar';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import CheckoutForm from './Checkout/CheckoutForm';

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    category: 'Comida' | 'Snacks' | 'Bares' | string;
    restaurant_name: string;
    restaurant_description?: string;
    image: string;
    local_id?: number;
    [key: string]: unknown;
}

interface CartItem {
    product: Product;
    quantity: number;
}

interface RestaurantProp {
    id?: number;
    name: string;
    description?: string;
    address?: string;
    phone?: string;
    schedule?: string;
    image?: string;
    tagline?: string;
}

interface DashboardProps {
    auth: {
        user?: {
            name: string;
            email: string;
        };
    };
    databaseProducts?: Product[];
    restaurants?: RestaurantProp[];
    activeOrder?: {
        id: number;
        code: string;
        status: string;
    } | null;
}

const UPP_FALLBACK_PRODUCTS: Product[] = [
    {
        id: 101,
        name: 'Chilaquiles Especiales con Pollo o Huevo',
        price: 55.0,
        description:
            'Totopos bañados en salsa verde o roja, crema de rancho, queso fresco y frijoles refritos.',
        category: 'Comida',
        restaurant_name: 'Cafetería Octubre',
        restaurant_description: 'Plaza Gastronómica UPP • Local 01',
        image: 'https://images.unsplash.com/photo-1640719028984-5142fa661837?auto=format&fit=crop&w=700&q=80',
        local_id: 1,
    },
    {
        id: 302,
        name: 'Café Americano o de Olla Artesanal (16 oz)',
        price: 25.0,
        description:
            'Café de grano selecto endulzado con piloncillo y canela natural recién hecho.',
        category: 'Bares',
        restaurant_name: 'Cafetería Octubre',
        restaurant_description: 'Plaza Gastronómica UPP • Local 01',
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80',
        local_id: 1,
    },
    {
        id: 102,
        name: 'Torta Especial Cubana Artesanal',
        price: 60.0,
        description:
            'Milanesa, jamón, salchicha, quesillo derretido, aguacate y aderezo especial de la casa.',
        category: 'Comida',
        restaurant_name: 'Los Cuñaditos',
        restaurant_description: 'Plaza Gastronómica UPP • Local 02',
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=700&q=80',
        local_id: 2,
    },
    {
        id: 204,
        name: 'Gringas de Pastor con Quesillo (2 Pzas)',
        price: 48.0,
        description:
            'Carne al pastor marinada con piña en tortilla de harina con costra de queso manchego.',
        category: 'Snacks',
        restaurant_name: 'Los Cuñaditos',
        restaurant_description: 'Plaza Gastronómica UPP • Local 02',
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=700&q=80',
        local_id: 2,
    },
    {
        id: 201,
        name: 'Hamburguesa Monumental BBQ con Papas',
        price: 70.0,
        description:
            'Carne a la parrilla, queso cheddar fundido, tocino crujiente y papas sazonadas.',
        category: 'Snacks',
        restaurant_name: 'The Potro Grill',
        restaurant_description: 'Plaza Gastronómica UPP • Local 03',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80',
        local_id: 3,
    },
    {
        id: 202,
        name: 'Alitas Crujientes Mango Habanero (8 Pzas)',
        price: 75.0,
        description:
            'Alitas doradas en salsa mango habanero o red hot buffalo con aderezo ranch.',
        category: 'Snacks',
        restaurant_name: 'The Potro Grill',
        restaurant_description: 'Plaza Gastronómica UPP • Local 03',
        image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=700&q=80',
        local_id: 3,
    },
    {
        id: 301,
        name: 'Agua Artesanal de Frutos Rojos / Horchata (1 Litro)',
        price: 28.0,
        description:
            'Preparada diariamente con fruta e ingredientes 100% naturales bien fría.',
        category: 'Bares',
        restaurant_name: 'Paletería Señor Bigotes',
        restaurant_description: 'Plaza Gastronómica UPP • Local 04',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=700&q=80',
        local_id: 4,
    },
    {
        id: 303,
        name: 'Frappé Moka con Crema Batida & Galleta Oreo',
        price: 45.0,
        description:
            'Bebida helada cremosa a base de café espresso, chocolate, crema chantilly y chispas.',
        category: 'Bares',
        restaurant_name: 'Paletería Señor Bigotes',
        restaurant_description: 'Plaza Gastronómica UPP • Local 04',
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=700&q=80',
        local_id: 4,
    },
    {
        id: 104,
        name: 'Orden de 4 Tacos de Carnitas con Consomé',
        price: 65.0,
        description:
            'Maciza, costilla o surtida en tortilla de comal con cebolla, cilantro y consomé caliente.',
        category: 'Comida',
        restaurant_name: 'Carnitas El Negocio',
        restaurant_description: 'Plaza Gastronómica UPP • Local 05',
        image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=700&q=80',
        local_id: 5,
    },
];

function useDeliveryLocation() {
    const [building, setBuilding] = useState('Docencia 1');
    const [classroom, setClassroom] = useState('Aula 104');
    const [coords, setCoords] = useState<{
        latitude: number | null;
        longitude: number | null;
    }>({ latitude: null, longitude: null });
    const [loadingGeo, setLoadingGeo] = useState(false);

    const locationText = [building, classroom]
        .filter((value) => value.trim().length > 0)
        .join(' - ');
    const isConfirmed = Boolean(locationText) || coords.latitude !== null;

    const requestGeolocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocalización no disponible en tu dispositivo');
            return;
        }
        setLoadingGeo(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCoords({ latitude, longitude });
                setBuilding('Ubicación GPS actual');
                setClassroom(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                setLoadingGeo(false);
            },
            () => {
                alert(
                    'No se pudo obtener la señal GPS. Selecciona tu punto de entrega.',
                );
                setLoadingGeo(false);
            },
            { enableHighAccuracy: true, timeout: 10000 },
        );
    };

    return {
        building,
        classroom,
        setBuilding,
        setClassroom,
        locationText,
        coords,
        isConfirmed,
        loadingGeo,
        requestGeolocation,
    };
}

export default function Dashboard({
    auth,
    databaseProducts,
    restaurants = [],
    activeOrder = null,
}: Readonly<DashboardProps>) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [failedImageIds, setFailedImageIds] = useState<number[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [deliveryAlertVisible, setDeliveryAlertVisible] = useState(false);

    const deliveryLocation = useDeliveryLocation();

    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            if (Notification.permission === 'default') {
                Notification.requestPermission().catch(() => {});
            }
        }
    }, []);

    useEffect(() => {
        const interval = window.setInterval(() => {
            router.reload({ only: ['activeOrder'] });
        }, 15000);

        return () => window.clearInterval(interval);
    }, []);

    useEffect(() => {
        if (activeOrder?.status !== 'delivered') return;

        const noticeKey = `eatly-delivery-notice-${activeOrder.id}`;
        if (window.sessionStorage.getItem(noticeKey)) return;

        window.sessionStorage.setItem(noticeKey, 'shown');
        setTimeout(() => setDeliveryAlertVisible(true), 0);

        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('¿Recibiste tu pedido?', {
                body: `El repartidor reportó como entregado el pedido ${activeOrder.code}.`,
            });
        }
    }, [activeOrder]);

    const getDynamicGreeting = (name?: string) => {
        const hour = new Date().getHours();
        const userName = name || 'Comensal';
        if (hour >= 6 && hour < 12) return `Buenos días, ${userName}`;
        if (hour >= 12 && hour < 20) return `Buenas tardes, ${userName}`;
        return `Buenas noches, ${userName}`;
    };

    const products: Product[] = useMemo(() => {
        if (databaseProducts && databaseProducts.length > 0) {
            return databaseProducts;
        }
        return UPP_FALLBACK_PRODUCTS;
    }, [databaseProducts]);

    const filteredProducts = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();
        return products.filter((p) => {
            const matchesCategory =
                selectedCategory === 'Todos' ||
                p.category.toLowerCase() === selectedCategory.toLowerCase();

            const matchesSearch =
                q === '' ||
                p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.restaurant_name.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q);

            return matchesCategory && matchesSearch;
        });
    }, [products, selectedCategory, searchQuery]);

    const uniqueRestaurants = useMemo(() => {
        return Array.from(
            new Set(filteredProducts.map((p) => p.restaurant_name)),
        );
    }, [filteredProducts]);

    const addToCart = (product: Product) => {
        setCart((prev) => {
            const itemExists = prev.some(
                (item) => item.product.id === product.id,
            );
            if (itemExists) {
                return prev.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item,
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId: number, amount: number) => {
        setCart(
            (prev) =>
                prev
                    .map((item) => {
                        if (item.product.id === productId) {
                            const newQty = item.quantity + amount;
                            return newQty > 0
                                ? { ...item, quantity: newQty }
                                : null;
                        }
                        return item;
                    })
                    .filter(Boolean) as CartItem[],
        );
    };

    const cartTotal = cart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
    );
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const activeLocalId = cart.length > 0 ? cart[0].product.local_id || 1 : 1;

    return (
        <>
            <Head title="EATLY - Menú Principal" />
            <div className="flex min-h-screen flex-col overflow-x-hidden bg-[#070709] font-sans text-white antialiased selection:bg-[#ff4600] selection:text-white">
                {/* Luces Ambientales Liquid Glass Avanzadas */}
                <div className="pointer-events-none fixed -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-[#ff4600]/12 blur-[180px]" />
                <div className="pointer-events-none fixed top-1/2 -right-40 h-[600px] w-[600px] rounded-full bg-[#f5ee04]/8 blur-[180px]" />

                {/* NAVBAR SUPERIOR */}
                <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-[#070709]/85 px-6 py-4 backdrop-blur-2xl">
                    <div className="flex items-center space-x-4">
                        <button
                            type="button"
                            onClick={() => setIsSidebarOpen(true)}
                            className="cursor-pointer rounded-2xl border border-white/10 bg-white/[0.04] p-2.5 text-zinc-300 transition hover:bg-white/10 hover:text-white"
                            aria-label="Abrir menú"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.5}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>

                        <Link
                            href="/dashboard"
                            className="group flex items-center gap-1.5"
                        >
                            <span className="text-2xl font-black tracking-tight text-white">
                                EATLY
                            </span>
                            <span className="h-2 w-2 rounded-full bg-[#ff4600] transition-transform group-hover:scale-125" />
                        </Link>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Link
                            href="/historial"
                            className="flex items-center gap-1.5 rounded-2xl px-4 py-2 text-xs font-extrabold text-zinc-300 transition hover:bg-white/5 hover:text-white"
                        >
                            Mis pedidos
                        </Link>

                        <Link
                            href="/settings/profile"
                            className="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-bold text-zinc-300 transition hover:border-[#ff4600]/40 hover:text-[#ff4600]"
                        >
                            Ajustes
                        </Link>

                        <button
                            type="button"
                            onClick={() => {
                                document
                                    .getElementById('cart-sidebar')
                                    ?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="relative flex cursor-pointer items-center gap-2 rounded-2xl border border-[#ff4600]/40 bg-[#ff4600]/15 px-4 py-2 text-xs font-black text-[#ff4600] transition hover:bg-[#ff4600] hover:text-white"
                        >
                            <span>Tu orden</span>
                            {totalItems > 0 && (
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ff4600] text-[10px] font-black text-white shadow-md">
                                    {totalItems}
                                </span>
                            )}
                        </button>
                    </div>
                </header>

                {deliveryAlertVisible && activeOrder && (
                    <div className="fixed right-4 bottom-4 z-50 w-[calc(100%-2rem)] max-w-sm rounded-3xl border border-white/15 bg-[#0f0f13]/95 p-5 text-white shadow-2xl backdrop-blur-2xl sm:right-6 sm:bottom-6">
                        <p className="text-sm font-black text-white">
                            ¿Recibiste tu pedido?
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                            El repartidor reportó la entrega del pedido{' '}
                            {activeOrder.code}. Confírmalo para calificar al
                            local.
                        </p>
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setDeliveryAlertVisible(false)}
                                className="cursor-pointer rounded-xl px-3 py-2 text-xs font-black text-zinc-400 hover:bg-white/10"
                            >
                                Después
                            </button>
                            <Link
                                href="/historial"
                                className="rounded-xl bg-[#ff4600] px-3 py-2 text-xs font-black text-white transition hover:bg-white hover:text-black"
                            >
                                Confirmar
                            </Link>
                        </div>
                    </div>
                )}

                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    auth={auth}
                    onSelectCategory={(cat) => {
                        setSelectedCategory(cat);
                        document
                            .getElementById('catalog-section')
                            ?.scrollIntoView({ behavior: 'smooth' });
                    }}
                />

                <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col lg:flex-row">
                    <main className="flex-1 space-y-8 overflow-y-auto p-6 lg:p-10">
                        {/* BENTO GRID HEADER / HERO */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            {/* Bloque Saludo y Buscador */}
                            <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent p-7 shadow-2xl backdrop-blur-2xl lg:col-span-2">
                                <div className="pointer-events-none absolute top-0 right-0 -mt-8 -mr-8 h-44 w-44 rounded-full bg-[#ff4600]/20 blur-3xl" />

                                <div className="mb-6">
                                    <span className="mb-2 inline-block rounded-full border border-[#f5ee04]/30 bg-[#f5ee04]/10 px-3 py-1 text-[10px] font-black tracking-widest text-[#f5ee04] uppercase">
                                        Campus UPP • Abierto
                                    </span>
                                    <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                                        {getDynamicGreeting(auth?.user?.name)}
                                    </h1>
                                    <p className="mt-1 text-xs text-zinc-400">
                                        Pide directo a tu salón o área de
                                        estudio sin hacer filas.
                                    </p>
                                </div>

                                <div className="flex items-center rounded-2xl border border-white/15 bg-black/60 p-2 shadow-inner">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        placeholder="Busca por platillo, ingrediente o local..."
                                        className="w-full border-0 bg-transparent px-3 py-2 text-xs font-bold text-white placeholder-zinc-500 outline-none"
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={() => setSearchQuery('')}
                                            className="mr-2 cursor-pointer font-mono text-xs text-zinc-400 hover:text-white"
                                        >
                                            Borrar
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Bloque Ubicación Rápida */}
                            <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#ff4600]/10 via-white/[0.02] to-transparent p-6 shadow-2xl backdrop-blur-2xl">
                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-[10px] font-black tracking-widest text-[#f5ee04] uppercase">
                                            Destino actual
                                        </span>
                                        {deliveryLocation.isConfirmed && (
                                            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                                        )}
                                    </div>
                                    <p className="line-clamp-1 text-sm font-black text-white">
                                        {deliveryLocation.locationText}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        deliveryLocation.requestGeolocation
                                    }
                                    disabled={deliveryLocation.loadingGeo}
                                    className="mt-4 w-full cursor-pointer rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold text-zinc-200 transition hover:bg-white/10 hover:text-white"
                                >
                                    {deliveryLocation.loadingGeo
                                        ? 'Localizando...'
                                        : '📍 Usar GPS'}
                                </button>
                            </div>
                        </div>

                        {/* SELECTORES DE EDIFICIO Y AULA */}
                        <div className="grid grid-cols-1 gap-4 rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="building-select"
                                    className="mb-1 block text-[10px] font-black tracking-wider text-zinc-400 uppercase"
                                >
                                    Edificio / Zona
                                </label>
                                <select
                                    id="building-select"
                                    value={deliveryLocation.building}
                                    onChange={(e) =>
                                        deliveryLocation.setBuilding(
                                            e.target.value,
                                        )
                                    }
                                    className="w-full cursor-pointer rounded-xl border border-white/10 bg-black/70 px-4 py-3 text-xs font-bold text-white outline-none focus:border-[#ff4600]"
                                >
                                    <option
                                        value="Docencia 1"
                                        className="bg-[#0e0e11]"
                                    >
                                        Docencia 1
                                    </option>
                                    <option
                                        value="Docencia 2"
                                        className="bg-[#0e0e11]"
                                    >
                                        Docencia 2
                                    </option>
                                    <option
                                        value="Ajedrez"
                                        className="bg-[#0e0e11]"
                                    >
                                        Ajedrez
                                    </option>
                                    <option
                                        value="El Refri"
                                        className="bg-[#0e0e11]"
                                    >
                                        El Refri
                                    </option>
                                    <option
                                        value="Biblioteca"
                                        className="bg-[#0e0e11]"
                                    >
                                        Biblioteca
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="classroom-input-main"
                                    className="mb-1 block text-[10px] font-black tracking-wider text-zinc-400 uppercase"
                                >
                                    Aula o Referencia específica
                                </label>
                                <input
                                    id="classroom-input-main"
                                    type="text"
                                    value={deliveryLocation.classroom}
                                    onChange={(e) =>
                                        deliveryLocation.setClassroom(
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Ej. Aula 104, Planta Baja..."
                                    className="w-full rounded-xl border border-white/10 bg-black/70 px-4 py-3 text-xs font-bold text-white placeholder-zinc-600 outline-none focus:border-[#ff4600]"
                                />
                            </div>
                        </div>

                        {/* CATEGORÍAS TIPO PILLS MODERNAS */}
                        <div>
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-base font-black text-white">
                                    Categorías
                                </h2>
                                <span className="text-[11px] font-semibold text-zinc-400">
                                    Filtra por tipo de antojo
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2.5">
                                {[
                                    { id: 'Todos', label: 'Todo el menú' },
                                    { id: 'Comida', label: 'Comida caliente' },
                                    {
                                        id: 'Snacks',
                                        label: 'Snacks y antojitos',
                                    },
                                    { id: 'Bares', label: 'Bebidas y café' },
                                ].map((cat) => (
                                    <button
                                        type="button"
                                        key={cat.id}
                                        onClick={() =>
                                            setSelectedCategory(cat.id)
                                        }
                                        className={`cursor-pointer rounded-2xl px-5 py-2.5 text-xs font-black transition-all duration-300 ${
                                            selectedCategory === cat.id
                                                ? 'scale-105 bg-[#ff4600] text-white shadow-lg shadow-[#ff4600]/30'
                                                : 'border border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* CATÁLOGO DE PLATILLOS */}
                        <div id="catalog-section" className="space-y-10">
                            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                <h2 className="text-lg font-black text-white">
                                    Platillos Disponibles
                                </h2>
                                <span className="font-mono text-xs text-zinc-400">
                                    {filteredProducts.length} opciones
                                </span>
                            </div>

                            {uniqueRestaurants.length === 0 ? (
                                <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
                                    <p className="text-sm font-bold text-zinc-300">
                                        No hay platillos con ese criterio.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedCategory('Todos');
                                            setSearchQuery('');
                                        }}
                                        className="mt-3 rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20"
                                    >
                                        Limpiar filtros
                                    </button>
                                </div>
                            ) : (
                                uniqueRestaurants.map((restaurantName) => {
                                    const matchedRestaurant = restaurants.find(
                                        (r) => r.name === restaurantName,
                                    );
                                    const actualName =
                                        matchedRestaurant?.name ||
                                        restaurantName;

                                    return (
                                        <div
                                            key={restaurantName}
                                            className="space-y-4"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-[#f5ee04]" />
                                                <h3 className="text-sm font-black tracking-wider text-zinc-300 uppercase">
                                                    {actualName}
                                                </h3>
                                            </div>

                                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                                {filteredProducts
                                                    .filter(
                                                        (p) =>
                                                            p.restaurant_name ===
                                                            restaurantName,
                                                    )
                                                    .map((product) => (
                                                        <button
                                                            type="button"
                                                            key={product.id}
                                                            onClick={() =>
                                                                addToCart(
                                                                    product,
                                                                )
                                                            }
                                                            className="group relative flex w-full cursor-pointer items-center justify-between gap-4 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent p-5 text-left shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-[#ff4600]/50 hover:bg-white/[0.06] active:scale-[0.98]"
                                                        >
                                                            <div className="flex flex-1 flex-col justify-between space-y-3 pr-2">
                                                                <div>
                                                                    <h4 className="text-sm font-black text-white transition group-hover:text-[#f5ee04]">
                                                                        {
                                                                            product.name
                                                                        }
                                                                    </h4>
                                                                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-400">
                                                                        {
                                                                            product.description
                                                                        }
                                                                    </p>
                                                                </div>

                                                                <div className="flex items-center justify-between border-t border-white/5 pt-2">
                                                                    <span className="font-mono text-base font-black text-[#f5ee04]">
                                                                        $
                                                                        {product.price.toFixed(
                                                                            2,
                                                                        )}{' '}
                                                                        <span className="text-[10px] text-zinc-500">
                                                                            MXN
                                                                        </span>
                                                                    </span>
                                                                    <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold text-zinc-300 transition group-hover:border-[#ff4600] group-hover:bg-[#ff4600] group-hover:text-white">
                                                                        +
                                                                        Agregar
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="relative">
                                                                {product.image &&
                                                                !failedImageIds.includes(
                                                                    product.id,
                                                                ) ? (
                                                                    <img
                                                                        src={
                                                                            product.image
                                                                        }
                                                                        alt={
                                                                            product.name
                                                                        }
                                                                        onError={() =>
                                                                            setFailedImageIds(
                                                                                (
                                                                                    c,
                                                                                ) => [
                                                                                    ...c,
                                                                                    product.id,
                                                                                ],
                                                                            )
                                                                        }
                                                                        className="h-28 w-28 flex-shrink-0 rounded-2xl bg-zinc-900 object-cover shadow-lg transition duration-300 group-hover:scale-105"
                                                                    />
                                                                ) : (
                                                                    <div className="flex h-28 w-28 flex-shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[10px] font-black text-zinc-500 uppercase">
                                                                        Sin foto
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </button>
                                                    ))}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </main>

                    {/* SIDEBAR DEL CARRITO */}
                    <aside
                        id="cart-sidebar"
                        className="sticky flex h-[calc(100vh-73px)] w-full flex-col justify-between border-t border-white/10 bg-[#0a0a0e]/95 p-6 shadow-2xl backdrop-blur-2xl lg:top-[73px] lg:w-96 lg:border-t-0 lg:border-l"
                    >
                        <div className="flex-1 overflow-y-auto pr-1">
                            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
                                <h2 className="flex items-center gap-2 text-sm font-black tracking-wider text-white uppercase">
                                    Tu orden actual
                                </h2>
                                <span className="rounded-xl border border-[#ff4600]/30 bg-[#ff4600]/10 px-2.5 py-1 text-xs font-black text-[#ff4600]">
                                    {totalItems} ítems
                                </span>
                            </div>

                            {cart.length === 0 ? (
                                <div className="px-4 py-24 text-center">
                                    <p className="text-xs font-bold text-zinc-300">
                                        Tu carrito está vacío
                                    </p>
                                    <p className="mt-1 text-[11px] text-zinc-500">
                                        Selecciona platillos para comenzar.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {cart.map((item) => (
                                        <div
                                            key={item.product.id}
                                            className="flex items-center justify-between border-b border-white/5 pb-4 text-xs"
                                        >
                                            <div className="flex-1 pr-2">
                                                <p className="font-extrabold text-white">
                                                    {item.product.name}
                                                </p>
                                                <p className="mt-0.5 font-mono font-black text-[#f5ee04]">
                                                    $
                                                    {(
                                                        item.product.price *
                                                        item.quantity
                                                    ).toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-3 rounded-2xl border border-white/10 bg-black/40 px-3 py-1.5 shadow-inner">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateQuantity(
                                                            item.product.id,
                                                            -1,
                                                        );
                                                    }}
                                                    className="cursor-pointer text-sm font-bold text-zinc-400 hover:text-white"
                                                >
                                                    -
                                                </button>
                                                <span className="text-xs font-black text-white">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateQuantity(
                                                            item.product.id,
                                                            1,
                                                        );
                                                    }}
                                                    className="cursor-pointer text-sm font-bold text-zinc-400 hover:text-white"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="border-t border-white/10 bg-transparent pt-5">
                                <div className="mb-4 flex justify-between text-base font-black text-white">
                                    <span>Total a liquidar:</span>
                                    <span className="font-mono text-[#f5ee04]">
                                        ${cartTotal.toFixed(2)} MXN
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsCheckoutOpen(true)}
                                    className="flex w-full transform cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#ff4600] py-4 text-xs font-black tracking-wider text-white uppercase shadow-lg shadow-[#ff4600]/25 transition-all duration-200 hover:bg-white hover:text-black active:scale-95"
                                >
                                    <span>Proceder al Pago Seguro</span>
                                </button>
                            </div>
                        )}
                    </aside>
                </div>

                {/* MODAL CHECKOUT */}
                {isCheckoutOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
                        <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-white/15 bg-[#0f0f13]/95 p-6 text-white shadow-2xl backdrop-blur-2xl">
                            <button
                                type="button"
                                onClick={() => setIsCheckoutOpen(false)}
                                className="absolute top-4 right-4 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 font-bold text-zinc-400 transition hover:bg-white/10 hover:text-white"
                            >
                                ✕
                            </button>

                            <CheckoutForm
                                subtotalComida={cartTotal}
                                localId={activeLocalId}
                                itemsCarrito={cart}
                                initialDeliveryLocation={
                                    deliveryLocation.locationText
                                }
                                initialBuilding={deliveryLocation.building}
                                initialClassroom={deliveryLocation.classroom}
                                deliveryCoordinates={deliveryLocation.coords}
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
