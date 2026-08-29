import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

export default function VendorRegister() {
    const { data, setData, post, processing, errors } = useForm({
        restaurant_name: '',
        food_type: 'Comida Caliente',
        location: 'Plaza UPP - Zona Norte',
        phone: '',
        email: '',
        password: '',
        terms: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/vendor/register');
    };

    return (
        <>
            <Head title="Registra tu Cafetería - EATLY Partners" />

            <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#070709] font-sans text-white antialiased selection:bg-[#ff4600] selection:text-white lg:flex-row">
                {/* Luces Ambientales Liquid Glass */}
                <div className="pointer-events-none fixed -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#ff4600]/15 blur-[150px]" />
                <div className="pointer-events-none fixed -right-40 -bottom-40 h-[500px] w-[500px] rounded-full bg-[#f5ee04]/10 blur-[150px]" />

                {/* LADO IZQUIERDO: HERO BANNER LIQUID GLASS */}
                <div className="relative flex flex-col justify-between overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#ff4600]/30 via-[#ea580c]/15 to-transparent p-8 text-white backdrop-blur-2xl sm:p-12 lg:w-1/2 lg:border-r lg:border-b-0 lg:p-16">
                    <div className="relative z-10 flex items-center justify-between">
                        <Link
                            href="/"
                            className="group flex items-center gap-1"
                        >
                            <span className="text-2xl font-black tracking-tight text-white">
                                EATLY
                            </span>
                            <span className="h-2 w-2 rounded-full bg-[#ff4600] transition-transform group-hover:scale-125" />
                            <span className="ml-1 font-mono text-[10px] tracking-widest text-[#f5ee04] uppercase">
                                PARTNERS
                            </span>
                        </Link>
                        <Link
                            href="/login"
                            className="rounded-2xl border border-white/10 bg-black/40 px-4 py-2 text-xs font-bold transition hover:bg-white hover:text-black"
                        >
                            Iniciar Sesión
                        </Link>
                    </div>

                    <div className="relative z-10 my-12 max-w-lg">
                        <span className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-[#f5ee04]/30 bg-[#f5ee04]/10 px-3.5 py-1.5 text-[10px] font-black tracking-widest text-[#f5ee04] uppercase shadow-sm">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#f5ee04]" />
                            0% comisiones por los primeros 30 días
                        </span>
                        <h1 className="mb-4 text-3xl leading-tight font-black tracking-tight sm:text-4xl lg:text-5xl">
                            Registrar tu cafetería en EATLY.
                        </h1>
                        <p className="text-xs leading-relaxed font-medium text-zinc-300 sm:text-sm">
                            Llega a todos los estudiantes y maestros del campus
                            de la UPP sin filas e incrementa tus ventas diarias
                            de forma exponencial.
                        </p>
                    </div>

                    <div className="relative z-10 flex items-center gap-2 border-t border-white/10 pt-4 font-mono text-[11px] text-zinc-500">
                        <span>
                            📍 Red Comercial Plaza UPP — Pachuca Hidalgo
                        </span>
                    </div>
                </div>

                {/* LADO DERECHO: FORMULARIO DE REGISTRO OSCURO */}
                <div className="flex flex-col justify-center overflow-y-auto bg-black/50 p-8 backdrop-blur-2xl sm:p-12 lg:w-1/2 lg:p-16">
                    <div className="mx-auto w-full max-w-md">
                        <div className="mb-8">
                            <h2 className="text-2xl font-black tracking-tight text-white">
                                Registra tu restaurante
                            </h2>
                            <p className="mt-1 text-xs text-zinc-400">
                                ¿Ya comenzaste tu registro?{' '}
                                <Link
                                    href="/login"
                                    className="font-black text-[#ff4600] transition hover:text-white hover:underline"
                                >
                                    continúa aquí
                                </Link>
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            {/* Campo 1: Nombre del restaurante / concesionario */}
                            <div>
                                <label className="mb-1 block text-xs font-bold tracking-wider text-zinc-400 uppercase">
                                    Nombre del Restaurante / Concesionario
                                </label>
                                <input
                                    type="text"
                                    value={data.restaurant_name}
                                    onChange={(e) =>
                                        setData(
                                            'restaurant_name',
                                            e.target.value,
                                        )
                                    }
                                    required
                                    placeholder="Ej. Cafetería Octubre o Los Cuñaditos"
                                    className="w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-xs font-bold text-white placeholder-zinc-600 transition outline-none focus:border-[#ff4600]"
                                />
                                <InputError message={errors.restaurant_name} />
                            </div>

                            {/* Campo 2: Tipo de comida */}
                            <div>
                                <label className="mb-1 block text-xs font-bold tracking-wider text-zinc-400 uppercase">
                                    Tipo de Comida / Especialidad
                                </label>
                                <select
                                    value={data.food_type}
                                    onChange={(e) =>
                                        setData('food_type', e.target.value)
                                    }
                                    required
                                    className="w-full cursor-pointer rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-xs font-bold text-white transition outline-none focus:border-[#ff4600]"
                                >
                                    <option
                                        value="Comida Caliente"
                                        className="bg-[#0e0e11]"
                                    >
                                        Comida caliente y platos fuertes
                                    </option>
                                    <option
                                        value="Snacks & Antojos"
                                        className="bg-[#0e0e11]"
                                    >
                                        Snacks y antojitos
                                    </option>
                                    <option
                                        value="Bebidas & Postres"
                                        className="bg-[#0e0e11]"
                                    >
                                        Bebidas y postres
                                    </option>
                                </select>
                                <InputError message={errors.food_type} />
                            </div>

                            {/* Campo 3: Ubicación en Plaza UPP (4 Zonas) */}
                            <div>
                                <label className="mb-1 block text-xs font-bold tracking-wider text-zinc-400 uppercase">
                                    Ubicación en Plaza UPP
                                </label>
                                <select
                                    value={data.location}
                                    onChange={(e) =>
                                        setData('location', e.target.value)
                                    }
                                    required
                                    className="w-full cursor-pointer rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-xs font-bold text-white transition outline-none focus:border-[#ff4600]"
                                >
                                    <option
                                        value="Plaza UPP - Zona Norte"
                                        className="bg-[#0e0e11]"
                                    >
                                        Plaza UPP — Zona Norte
                                    </option>
                                    <option
                                        value="Plaza UPP - Zona Sur"
                                        className="bg-[#0e0e11]"
                                    >
                                        Plaza UPP — Zona Sur
                                    </option>
                                    <option
                                        value="Plaza UPP - Zona Este"
                                        className="bg-[#0e0e11]"
                                    >
                                        Plaza UPP — Zona Este
                                    </option>
                                    <option
                                        value="Plaza UPP - Zona Oeste"
                                        className="bg-[#0e0e11]"
                                    >
                                        Plaza UPP — Zona Oeste
                                    </option>
                                </select>
                                <InputError message={errors.location} />
                            </div>

                            {/* Campo 4: Teléfono Móvil / WhatsApp */}
                            <div>
                                <label className="mb-1 block text-xs font-bold tracking-wider text-zinc-400 uppercase">
                                    Teléfono Móvil / WhatsApp
                                </label>
                                <div className="relative">
                                    <span className="absolute top-3 left-4 text-xs font-bold text-zinc-500">
                                        +52
                                    </span>
                                    <input
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData('phone', e.target.value)
                                        }
                                        required
                                        placeholder="771 123 4567"
                                        className="w-full rounded-2xl border border-white/10 bg-black/60 py-3 pr-4 pl-12 text-xs font-bold text-white placeholder-zinc-600 transition outline-none focus:border-[#ff4600]"
                                    />
                                </div>
                                <InputError message={errors.phone} />
                            </div>

                            {/* Campo 5: E-mail del responsable */}
                            <div>
                                <label className="mb-1 block text-xs font-bold tracking-wider text-zinc-400 uppercase">
                                    E-mail del Responsable
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    required
                                    placeholder="restaurante@upp.edu.mx"
                                    className="w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-xs font-bold text-white placeholder-zinc-600 transition outline-none focus:border-[#ff4600]"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Campo 6: Crea una contraseña */}
                            <div>
                                <label className="mb-1 block text-xs font-bold tracking-wider text-zinc-400 uppercase">
                                    Crea una Contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        required
                                        placeholder="Mínimo 8 caracteres"
                                        className="w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 pr-16 text-xs font-bold text-white placeholder-zinc-600 transition outline-none focus:border-[#ff4600]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute top-3 right-4 cursor-pointer font-mono text-xs text-zinc-500 hover:text-white"
                                    >
                                        {showPassword ? 'Ocultar' : 'Ver'}
                                    </button>
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            {/* Checkbox */}
                            <div className="pt-2">
                                <label className="flex cursor-pointer items-start gap-3 select-none">
                                    <input
                                        type="checkbox"
                                        checked={data.terms}
                                        onChange={(e) =>
                                            setData('terms', e.target.checked)
                                        }
                                        required
                                        className="mt-0.5 h-4 w-4 rounded border-white/20 bg-black/80 text-[#ff4600] accent-[#ff4600]"
                                    />
                                    <span className="text-[11px] leading-relaxed font-medium text-zinc-400">
                                        Autorizo el uso de mis datos personales
                                        y el envío de notificaciones operativas
                                        vía WhatsApp para la gestión de pedidos
                                        en EATLY Plaza UPP.
                                    </span>
                                </label>
                                <InputError message={errors.terms} />
                            </div>

                            {/* Botón principal */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#ff4600] py-3.5 text-xs font-black tracking-wider text-white uppercase shadow-lg shadow-[#ff4600]/25 transition hover:bg-white hover:text-black disabled:opacity-50"
                            >
                                {processing ? (
                                    <Spinner className="h-4 w-4 text-white" />
                                ) : null}
                                Registrar Restaurante
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
