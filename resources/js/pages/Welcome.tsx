import Sidebar from '@/components/Sidebar';
import { Head, Link, router } from '@inertiajs/react';
import React, { useCallback, useMemo, useState } from 'react';

export interface CulinarySpotRecord {
    id: number;
    name: string;
    location?: string;
    phone?: string;
    schedule?: string;
    opening_hours?: string;
    image?: string | null;
    tagline?: string;
    [key: string]: unknown;
}

const UPP_OFFICIAL_SPOTS: CulinarySpotRecord[] = [
    {
        id: 1,
        name: 'Cafetería Octubre',
        tagline: 'Café de Grano, Desayunos & Chilaquiles',
        location: 'Plaza Gastronómica UPP • Local 01',
        phone: '771 934 8210',
        schedule: 'Lunes a Viernes - 7:00 AM a 6:00 PM',
        image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 2,
        name: 'Los Cuñaditos',
        tagline: 'Tortas Especiales, Tacos & Comida Casera',
        location: 'Plaza Gastronómica UPP • Local 02',
        phone: '771 412 9054',
        schedule: 'Lunes a Viernes - 7:00 AM a 6:00 PM',
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 3,
        name: 'Los Brothers',
        tagline: 'Tortas, Tacos al Pastor, Hot Dogs & Grill',
        location: 'Plaza Gastronómica UPP • Local 03',
        phone: '771 685 3321',
        schedule: 'Lunes a Viernes - 7:00 AM a 6:00 PM',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 4,
        name: 'Paletería Señor Bigotes',
        tagline: 'Aguas Naturales, Helados & Pizzas al Horno',
        location: 'Plaza Gastronómica UPP • Local 04',
        phone: '771 890 1267',
        schedule: 'Lunes a Viernes - 7:00 AM a 6:00 PM',
        image: 'https://images.unsplash.com/photo-1560008581-09826d1de69e?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 5,
        name: 'Carnitas El Negocio',
        tagline: 'Tacos de Carnitas, Gorditas & Consomé Caliente',
        location: 'Plaza Gastronómica UPP • Local 05',
        phone: '771 305 7789',
        schedule: 'Lunes a Viernes - 7:00 AM a 6:00 PM',
        image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=80',
    },
];

interface WelcomeProps {
    auth?: {
        user?: {
            name: string;
            email: string;
        };
    };
    branches?: CulinarySpotRecord[];
}

export default function Welcome({
    auth,
    branches = [],
}: Readonly<WelcomeProps>) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const activeSpotList = useMemo(() => {
        if (branches && branches.length > 0) {
            return branches.map((branch, index) => {
                const fallback =
                    UPP_OFFICIAL_SPOTS[index % UPP_OFFICIAL_SPOTS.length];
                return {
                    ...fallback,
                    ...branch,
                    image: branch.image || fallback.image,
                    tagline: branch.tagline || fallback.tagline,
                    schedule:
                        branch.schedule ||
                        branch.opening_hours ||
                        fallback.schedule,
                };
            });
        }
        return UPP_OFFICIAL_SPOTS;
    }, [branches]);

    const filteredSpots = useMemo(() => {
        if (!searchQuery.trim()) return activeSpotList;
        const q = searchQuery.toLowerCase();
        return activeSpotList.filter(
            (item) =>
                item.name?.toLowerCase().includes(q) ||
                item.location?.toLowerCase().includes(q) ||
                item.tagline?.toLowerCase().includes(q),
        );
    }, [activeSpotList, searchQuery]);

    const handleLogout = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        router.post('/logout');
    }, []);

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-[#070709] font-sans text-white antialiased selection:bg-[#ff4600] selection:text-white">
            <Head title="EATLY - Plaza UPP" />

            {/* Luces Ambientales Liquid Glass */}
            <div className="pointer-events-none fixed -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-[#ff4600]/15 blur-[160px]" />
            <div className="pointer-events-none fixed -right-40 -bottom-40 h-[520px] w-[520px] rounded-full bg-[#f5ee04]/10 blur-[160px]" />

            {/* Top Navbar */}
            <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070709]/80 backdrop-blur-2xl">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                    <div className="flex items-center gap-5">
                        <button
                            type="button"
                            onClick={() => setIsSidebarOpen(true)}
                            className="cursor-pointer rounded-2xl border border-white/10 bg-white/[0.04] p-2.5 text-zinc-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] transition hover:border-white/25 hover:bg-white/[0.08] hover:text-white active:scale-95"
                            aria-label="Desplegar navegación"
                        >
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>

                        <Link
                            href="/"
                            className="group flex items-center gap-1.5"
                        >
                            <span className="text-2xl font-black tracking-tight text-white">
                                EATLY
                            </span>
                            <span className="h-2 w-2 rounded-full bg-[#ff4600] transition-transform group-hover:scale-125" />
                        </Link>

                        <div className="hidden items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.02] px-4 py-1.5 text-xs text-zinc-400 backdrop-blur-md lg:flex">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#f5ee04]" />
                            <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                                Complejo:
                            </span>
                            <span className="font-semibold text-zinc-200">
                                Plaza UPP • Pachuca
                            </span>
                        </div>
                    </div>

                    <nav className="flex items-center gap-3">
                        {auth?.user ? (
                            <>
                                <Link
                                    href="/historial"
                                    className="hidden rounded-xl px-3.5 py-2 text-xs font-bold text-zinc-400 transition hover:text-white sm:inline-flex"
                                >
                                    Bitácora de órdenes
                                </Link>
                                <Link
                                    href="/profile"
                                    className="hidden rounded-xl px-3.5 py-2 text-xs font-bold text-zinc-400 transition hover:text-white sm:inline-flex"
                                >
                                    Mi Espacio
                                </Link>
                                <Link
                                    href="/dashboard"
                                    className="rounded-xl bg-[#ff4600] px-4 py-2 text-xs font-black tracking-wider text-white uppercase shadow-[0_0_20px_rgba(255,70,0,0.3)] transition hover:bg-white hover:text-black active:scale-95"
                                >
                                    Ver Cartas
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="cursor-pointer rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-400 transition hover:bg-red-500 hover:text-white"
                                >
                                    Finalizar sesión
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-xs font-bold tracking-wider text-zinc-400 uppercase transition hover:text-white"
                                >
                                    Ingresar
                                </Link>
                                <Link
                                    href="/register"
                                    className="rounded-xl bg-[#ff4600] px-5 py-2.5 text-xs font-black tracking-wider text-white uppercase shadow-[0_0_20px_rgba(255,70,0,0.3)] transition-all hover:bg-white hover:text-black active:scale-95"
                                >
                                    Registrarte
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            {/* Drawer Lateral */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                auth={auth ?? {}}
            />

            <main className="relative z-10 mx-auto max-w-7xl px-6 py-8">
                {/* Banner Hero */}
                <section className="relative mb-12 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#ff4600] via-[#ea580c] to-[#9a3412] p-8 shadow-[0_24px_50px_rgba(255,70,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.2)] md:p-12">
                    <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-[#f5ee04]/25 blur-3xl" />

                    <div className="relative z-10 max-w-2xl">
                        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-extrabold tracking-widest text-[#f5ee04] uppercase backdrop-blur-md">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#f5ee04]" />
                            Red Gastronómica Oficial Plaza UPP
                        </span>
                        <h1 className="text-3xl leading-tight font-black tracking-tight text-white md:text-5xl">
                            Si estás en EATLY, lo tienes todo.
                        </h1>
                        <p className="mt-3 text-xs leading-relaxed font-medium text-orange-100/90 md:text-sm">
                            Anticipa tu consumo sin esperas en Cafetería
                            Octubre, Los Cuñaditos, Los Brothers, Paletería
                            Señor Bigotes y Carnitas El Negocio.
                        </p>

                        {/* Input Buscador */}
                        <div className="mt-8 flex items-center rounded-2xl border border-white/20 bg-black/75 p-2 shadow-[0_15px_35px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-2xl">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="¿Qué especialidad buscas hoy? (tacos, tortas, café de olla, aguas, carnitas...)"
                                className="w-full bg-transparent px-3.5 text-xs font-medium text-white placeholder-zinc-500 outline-none md:text-sm"
                            />
                            <Link
                                href={auth?.user ? '/dashboard' : '/login'}
                                className="shrink-0 rounded-xl bg-[#ff4600] px-6 py-3 text-center text-xs font-black tracking-wider text-white uppercase shadow-md transition hover:bg-[#f5ee04] hover:text-black active:scale-95"
                            >
                                Explorar
                            </Link>
                        </div>

                        <div className="mt-4 flex items-center gap-2 font-mono text-[11px] text-orange-200">
                            <span>
                                📍 Plaza Gastronómica — Universidad Politécnica
                                de Pachuca
                            </span>
                        </div>
                    </div>
                </section>

                {/* Sección de Locales */}
                <section id="cafes" className="mb-16">
                    <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-white">
                                Puntos Gastronómicos en Plaza UPP
                            </h2>
                            <p className="mt-0.5 text-xs text-zinc-500">
                                Cocinas y comercios registrados para despacho y
                                retiro express ({filteredSpots.length}{' '}
                                establecimientos)
                            </p>
                        </div>
                        <span className="font-mono text-xs text-zinc-400">
                            Módulos activos en campus
                        </span>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {filteredSpots.map((spot: CulinarySpotRecord) => (
                            <article
                                key={spot.id}
                                className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent p-1 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[#ff4600]/40 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(255,70,0,0.18)] sm:flex-row"
                            >
                                <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-2xl bg-zinc-900 sm:h-auto sm:w-1/2">
                                    <img
                                        src={
                                            spot.image ||
                                            'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
                                        }
                                        alt={spot.name}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    <span className="absolute top-3 left-3 rounded-lg border border-white/10 bg-black/75 px-2.5 py-1 text-[10px] font-black tracking-wider text-[#f5ee04] uppercase shadow-md backdrop-blur-md">
                                        VERIFICADO UPP
                                    </span>
                                </div>

                                <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                                    <div>
                                        <span className="text-[10px] font-extrabold tracking-widest text-[#ff4600] uppercase">
                                            {spot.tagline ||
                                                'Especialidad de Plaza'}
                                        </span>
                                        <h3 className="mt-1 text-base font-bold text-white transition group-hover:text-[#f5ee04]">
                                            {spot.name}
                                        </h3>

                                        <div className="mt-3 space-y-1 text-xs text-zinc-400">
                                            <p>
                                                {spot.location ||
                                                    'Plaza Gastronómica UPP'}
                                            </p>
                                            <p className="font-mono text-[11px] text-zinc-500">
                                                {spot.phone || '771 900 0000'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3">
                                        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
                                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                                            {spot.schedule ||
                                                spot.opening_hours ||
                                                'Lunes a Viernes - 7:00 AM a 6:00 PM'}
                                        </span>

                                        <Link
                                            href={
                                                auth?.user
                                                    ? '/dashboard'
                                                    : '/login'
                                            }
                                            className="inline-flex items-center gap-1 text-xs font-black text-[#ff4600] transition group-hover:translate-x-1 group-hover:text-white"
                                        >
                                            Ver Carta <span>&rarr;</span>
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/5 bg-[#050507] py-8 text-center text-xs text-zinc-600">
                <p>
                    &copy; {new Date().getFullYear()} EATLY • Universidad
                    Politécnica de Pachuca. Todos los derechos reservados.
                </p>
            </footer>
        </div>
    );
}
