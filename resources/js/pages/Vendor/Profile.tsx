import ImageUploadPreview from '@/components/ImageUploadPreview';
import RestaurantMapPicker from '@/components/RestaurantMapPicker';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    CheckCircle2,
    Clock,
    Image,
    Info,
    LogOut,
    MapPin,
    Save,
    Settings,
    Utensils,
    XCircle,
} from 'lucide-react';
import React from 'react';

interface DaySchedule {
    open: string;
    close: string;
    closed: boolean;
}

interface Restaurant {
    id: number;
    name: string;
    description: string | null;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    image: string | null;
    schedule: Record<string, DaySchedule> | null;
}

interface Props {
    restaurant: Restaurant;
    auth?: {
        user?: {
            name: string;
            email: string;
        };
    };
}

const DAYS = [
    { key: '1', label: 'Lunes' },
    { key: '2', label: 'Martes' },
    { key: '3', label: 'Miércoles' },
    { key: '4', label: 'Jueves' },
    { key: '5', label: 'Viernes' },
    { key: '6', label: 'Sábado' },
    { key: '0', label: 'Domingo' },
];

const defaultSchedule: Record<string, DaySchedule> = {
    '1': { open: '08:00', close: '18:00', closed: false },
    '2': { open: '08:00', close: '18:00', closed: false },
    '3': { open: '08:00', close: '18:00', closed: false },
    '4': { open: '08:00', close: '18:00', closed: false },
    '5': { open: '08:00', close: '18:00', closed: false },
    '6': { open: '09:00', close: '15:00', closed: false },
    '0': { open: '00:00', close: '00:00', closed: true },
};

export default function VendorProfile({ restaurant, auth }: Readonly<Props>) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: restaurant.name || '',
        description: restaurant.description || '',
        address: restaurant.address || '',
        latitude: restaurant.latitude || 19.8145,
        longitude: restaurant.longitude || -98.7389,
        image: restaurant.image || (null as File | string | null),
        schedule: restaurant.schedule || defaultSchedule,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/vendor/profile', {
            preserveScroll: true,
        });
    };

    const handleDayChange = (
        dayKey: string,
        field: keyof DaySchedule,
        value: string | boolean,
    ) => {
        const currentSchedule = { ...data.schedule };
        currentSchedule[dayKey] = {
            ...currentSchedule[dayKey],
            [field]: value,
        };
        setData('schedule', currentSchedule);
    };

    const copyToAllDays = (sourceDayKey: string) => {
        const source = data.schedule[sourceDayKey];
        const newSchedule: Record<string, DaySchedule> = {};
        DAYS.forEach((d) => {
            newSchedule[d.key] = { ...source };
        });
        setData('schedule', newSchedule);
    };

    // Calcular estado en tiempo real (Abierto / Cerrado)
    const now = new Date();
    const currentDay = now.getDay().toString();
    const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const todaySchedule = data.schedule?.[currentDay];
    let isOpenNow = false;
    if (todaySchedule && !todaySchedule.closed) {
        isOpenNow =
            currentTimeStr >= todaySchedule.open &&
            currentTimeStr <= todaySchedule.close;
    }

    return (
        <div className="relative flex min-h-screen flex-col justify-between overflow-x-hidden bg-[#070709] font-sans text-white antialiased selection:bg-[#ff4600] selection:text-white">
            <Head title="Mi Local y Ubicación | EATLY" />

            {/* Luces Ambientales Liquid Glass */}
            <div className="pointer-events-none fixed -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-[#ff4600]/15 blur-[160px]" />
            <div className="pointer-events-none fixed -right-40 -bottom-40 h-[520px] w-[520px] rounded-full bg-[#f5ee04]/10 blur-[160px]" />

            {/* Barra superior */}
            <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070709]/80 px-6 py-3.5 backdrop-blur-2xl">
                <div className="mx-auto flex max-w-5xl items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/vendor/dashboard"
                            className="group flex items-center gap-1"
                        >
                            <span className="text-2xl font-black tracking-tight text-white">
                                EATLY
                            </span>
                            <span className="h-2 w-2 rounded-full bg-[#ff4600] transition-transform group-hover:scale-125" />
                        </Link>
                        <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#ff4600]/30 bg-[#ff4600]/10 px-3 py-1 text-xs font-black text-[#ff4600] uppercase">
                            Panel de Cocina
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/vendor/dashboard"
                            className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-bold text-zinc-300 transition hover:border-[#ff4600]/40 hover:text-[#ff4600]"
                        >
                            <Utensils className="h-3.5 w-3.5" /> Ver Menú
                        </Link>
                        <Link
                            href="/settings/profile"
                            className="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-bold text-zinc-300 transition hover:border-white/20 hover:text-white"
                        >
                            <Settings className="h-3.5 w-3.5 text-[#ff4600]" />{' '}
                            Ajustes
                        </Link>
                        <button
                            type="button"
                            onClick={() => router.post('/logout')}
                            className="flex cursor-pointer items-center gap-1 rounded-2xl border border-red-500/20 bg-red-500/10 px-3.5 py-2 text-xs font-bold text-red-400 transition hover:bg-red-500 hover:text-white"
                        >
                            <LogOut className="h-3.5 w-3.5" /> Salir
                        </button>
                    </div>
                </div>
            </header>

            {/* Contenido Principal */}
            <main className="relative z-10 mx-auto w-full max-w-4xl flex-1 space-y-8 px-4 py-8 pb-24">
                {/* Banner Hero */}
                <div className="relative flex flex-col items-start justify-between gap-4 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#ff4600] via-[#ea580c] to-[#9a3412] p-8 text-white shadow-2xl md:flex-row md:items-center">
                    <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-[#f5ee04]/20 blur-3xl" />
                    <div className="relative z-10">
                        <span className="mb-2 inline-block rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-black tracking-widest text-[#f5ee04] uppercase backdrop-blur-md">
                            CONFIGURACIÓN DE TU PUESTO
                        </span>
                        <h1 className="text-3xl font-black tracking-tight">
                            Mi Negocio y Ubicación
                        </h1>
                        <p className="mt-1 text-xs text-orange-100">
                            Actualiza la imagen de tu puesto, tus horarios y el
                            lugar exacto en el campus.
                        </p>
                    </div>

                    <div className="relative z-10 flex items-center gap-2">
                        <span
                            className={`flex items-center gap-1.5 rounded-2xl border px-4 py-2 text-xs font-black tracking-wider uppercase backdrop-blur-xl ${
                                isOpenNow
                                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                                    : 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                            }`}
                        >
                            {isOpenNow ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            ) : (
                                <XCircle className="h-4 w-4 text-rose-400" />
                            )}
                            {isOpenNow ? 'Abierto' : 'Cerrado'}
                        </span>
                    </div>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 1. Foto del local */}
                    <div className="relative space-y-4 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
                        <div className="absolute top-0 left-0 h-full w-1.5 bg-[#ff4600]" />
                        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                            <Image className="h-5 w-5 text-[#ff4600]" />
                            <h2 className="text-sm font-black tracking-wider text-white uppercase">
                                Foto de presentación
                            </h2>
                        </div>
                        <ImageUploadPreview
                            value={data.image}
                            onChange={(file) => setData('image', file)}
                            label="Sube la foto de tu puesto o logotipo"
                        />
                        {errors.image && (
                            <p className="text-xs text-red-400">
                                {errors.image}
                            </p>
                        )}
                    </div>

                    {/* 2. Información General */}
                    <div className="relative space-y-5 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
                        <div className="absolute top-0 left-0 h-full w-1.5 bg-[#f5ee04]" />
                        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                            <Info className="h-5 w-5 text-[#f5ee04]" />
                            <h2 className="text-sm font-black tracking-wider text-white uppercase">
                                ¿Cómo te llamas y qué vendes?
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                                    Nombre de tu puesto
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    required
                                    className="h-12 w-full rounded-xl border border-white/10 bg-black/60 px-4 text-xs font-bold text-white placeholder-zinc-600 transition outline-none focus:border-[#ff4600]"
                                    placeholder="Ej. Tacos Don Beto"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-xs text-red-400">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                                    Breve descripción o especialidad
                                </label>
                                <input
                                    type="text"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    className="h-12 w-full rounded-xl border border-white/10 bg-black/60 px-4 text-xs font-bold text-white placeholder-zinc-600 transition outline-none focus:border-[#ff4600]"
                                    placeholder="Ej. Tortas, burritos y aguas frescas"
                                />
                                {errors.description && (
                                    <p className="mt-1 text-xs text-red-400">
                                        {errors.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 3. Horarios */}
                    <div className="relative space-y-5 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
                        <div className="absolute top-0 left-0 h-full w-1.5 bg-emerald-500" />

                        <div className="flex flex-col items-start justify-between gap-2 border-b border-white/10 pb-3 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-emerald-400" />
                                <h2 className="text-sm font-black tracking-wider text-white uppercase">
                                    ¿Qué días y a qué hora abres?
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => copyToAllDays('1')}
                                className="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-[#f5ee04] transition hover:underline"
                            >
                                Copiar horario del lunes a todos los días
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {DAYS.map((day) => {
                                const sch = data.schedule[day.key] || {
                                    open: '08:00',
                                    close: '17:00',
                                    closed: false,
                                };
                                return (
                                    <div
                                        key={day.key}
                                        className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/40 p-3.5"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <input
                                                type="checkbox"
                                                id={`closed-${day.key}`}
                                                checked={!sch.closed}
                                                onChange={(e) =>
                                                    handleDayChange(
                                                        day.key,
                                                        'closed',
                                                        !e.target.checked,
                                                    )
                                                }
                                                className="h-4 w-4 cursor-pointer rounded text-[#ff4600] accent-[#ff4600]"
                                            />
                                            <label
                                                htmlFor={`closed-${day.key}`}
                                                className="w-20 cursor-pointer text-xs font-bold text-white"
                                            >
                                                {day.label}
                                            </label>
                                        </div>

                                        {sch.closed ? (
                                            <span className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-[11px] font-bold text-rose-400">
                                                Cerrado
                                            </span>
                                        ) : (
                                            <div className="flex items-center gap-1.5">
                                                <input
                                                    type="time"
                                                    value={sch.open}
                                                    onChange={(e) =>
                                                        handleDayChange(
                                                            day.key,
                                                            'open',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="rounded-lg border border-white/10 bg-black/60 px-2 py-1 text-[11px] font-bold text-white outline-none"
                                                />
                                                <span className="text-xs text-zinc-500">
                                                    -
                                                </span>
                                                <input
                                                    type="time"
                                                    value={sch.close}
                                                    onChange={(e) =>
                                                        handleDayChange(
                                                            day.key,
                                                            'close',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="rounded-lg border border-white/10 bg-black/60 px-2 py-1 text-[11px] font-bold text-white outline-none"
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* 4. Mapa y ubicación */}
                    <div className="relative space-y-5 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
                        <div className="absolute top-0 left-0 h-full w-1.5 bg-sky-400" />

                        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                            <MapPin className="h-5 w-5 text-sky-400" />
                            <h2 className="text-sm font-black tracking-wider text-white uppercase">
                                ¿En qué parte de la UPP te encuentras?
                            </h2>
                        </div>

                        <RestaurantMapPicker
                            latitude={Number(data.latitude)}
                            longitude={Number(data.longitude)}
                            onChange={(lat, lng, addr) => {
                                setData((data) => ({
                                    ...data,
                                    latitude: lat,
                                    longitude: lng,
                                    address: addr,
                                }));
                            }}
                        />

                        <div>
                            <label className="mb-1.5 block text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                                Referencia o punto exacto
                            </label>
                            <input
                                type="text"
                                value={data.address}
                                onChange={(e) =>
                                    setData('address', e.target.value)
                                }
                                className="h-12 w-full rounded-xl border border-white/10 bg-black/60 px-4 text-xs font-bold text-white placeholder-zinc-600 transition outline-none focus:border-[#ff4600]"
                                placeholder="Ej. Edificio de Docencia 1, planta baja"
                            />
                            {errors.address && (
                                <p className="mt-1 text-xs text-red-400">
                                    {errors.address}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Botón Guardar */}
                    <div className="sticky bottom-4 z-40 flex justify-end rounded-3xl border border-white/10 bg-[#070709]/90 p-4 shadow-2xl backdrop-blur-xl">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#ff4600] px-8 py-3.5 text-xs font-black tracking-wider text-white uppercase shadow-xl transition hover:bg-white hover:text-black active:scale-95 disabled:opacity-50 md:w-auto"
                        >
                            <Save className="h-4 w-4" /> Guardar Cambios de mi
                            Local
                        </button>
                    </div>
                </form>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 bg-[#050507] py-6 text-center text-xs text-zinc-600">
                <p>
                    &copy; {new Date().getFullYear()} EATLY • Universidad
                    Politécnica de Pachuca
                </p>
            </footer>
        </div>
    );
}
