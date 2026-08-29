import { SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, Lock, ShieldCheck, User } from 'lucide-react';
import React, { useRef } from 'react';

export default function Password() {
    const { auth } = usePage<SharedData>().props;
    const isGoogleUser = Boolean(
        (auth?.user as Record<string, unknown>)?.google_id,
    );
    const userName = auth?.user?.name || 'Usuario';
    const initialGlyph = userName.charAt(0).toUpperCase();

    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        put,
        processing,
        errors,
        recentlySuccessful,
        reset,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e: React.FormEvent) => {
        e.preventDefault();

        put('/settings/password', {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (err) => {
                if (err.password) {
                    passwordInput.current?.focus();
                }

                if (err.current_password) {
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <div className="relative flex min-h-screen flex-col justify-between overflow-x-hidden bg-[#070709] font-sans text-white antialiased selection:bg-[#ff4600] selection:text-white">
            <Head title="Cambiar Contraseña | EATLY" />

            {/* Luces Ambientales Liquid Glass */}
            <div className="pointer-events-none fixed -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-[#ff4600]/15 blur-[160px]" />
            <div className="pointer-events-none fixed -right-40 -bottom-40 h-[520px] w-[520px] rounded-full bg-[#f5ee04]/10 blur-[160px]" />

            {/* Barra superior */}
            <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070709]/80 px-6 py-3.5 backdrop-blur-2xl">
                <div className="mx-auto flex max-w-5xl items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard"
                            className="group flex items-center gap-1"
                        >
                            <span className="text-2xl font-black tracking-tight text-white">
                                EATLY
                            </span>
                            <span className="h-2 w-2 rounded-full bg-[#ff4600] transition-transform group-hover:scale-125" />
                        </Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-bold text-zinc-300 transition hover:border-[#ff4600]/40 hover:text-[#ff4600]"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" /> Ir al menú
                        </Link>
                        <Link
                            href="/historial"
                            className="flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-xs font-bold text-zinc-300 transition hover:bg-white/5 hover:text-white"
                        >
                            Mis pedidos
                        </Link>
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff4600] to-[#ea580c] text-xs font-black text-white shadow-md">
                            {initialGlyph}
                        </div>
                    </div>
                </div>
            </header>

            {/* Contenido principal */}
            <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-4 py-8 pb-20">
                {/* Banner */}
                <div className="relative mb-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#ff4600] via-[#ea580c] to-[#9a3412] p-8 text-white shadow-2xl">
                    <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-[#f5ee04]/20 blur-3xl" />
                    <div className="relative z-10">
                        <span className="mb-2 inline-block rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-black tracking-widest text-[#f5ee04] uppercase backdrop-blur-md">
                            SEGURIDAD
                        </span>
                        <h1 className="text-3xl font-black tracking-tight">
                            Cambiar mi contraseña
                        </h1>
                        <p className="mt-1 text-xs text-orange-100">
                            Elige una contraseña segura que puedas recordar para
                            entrar a tu cuenta.
                        </p>
                    </div>
                </div>

                {/* Botones de navegación */}
                <nav className="mb-6 flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-2 shadow-inner backdrop-blur-xl">
                    <Link
                        href="/settings/profile"
                        className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black tracking-wider text-zinc-400 uppercase transition hover:bg-white/5 hover:text-white"
                    >
                        <User className="h-4 w-4" />
                        <span>MI PERFIL</span>
                    </Link>

                    <Link
                        href="/settings/password"
                        className="flex items-center gap-2 rounded-xl bg-[#ff4600] px-4 py-2.5 text-xs font-black tracking-wider text-white uppercase shadow-md transition"
                    >
                        <Lock className="h-4 w-4" />
                        <span>CONTRASEÑA</span>
                    </Link>

                    <Link
                        href="/settings/two-factor"
                        className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black tracking-wider text-zinc-400 uppercase transition hover:bg-white/5 hover:text-white"
                    >
                        <ShieldCheck className="h-4 w-4" />
                        <span>SEGURIDAD (2 PASOS)</span>
                    </Link>
                </nav>

                {/* Formulario */}
                <div className="space-y-6 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
                    <div>
                        <h3 className="text-base font-black tracking-tight text-white">
                            Nueva Contraseña
                        </h3>
                        <p className="mt-1 text-xs text-zinc-400">
                            Escribe tu contraseña actual y luego la nueva.
                        </p>
                    </div>

                    {isGoogleUser ? (
                        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-xs font-medium text-zinc-300 backdrop-blur-xl">
                            <span className="font-bold text-[#f5ee04]">
                                Iniciaste con Google:
                            </span>{' '}
                            Tu cuenta está conectada a Google, así que no
                            necesitas una contraseña aquí. Tu cuenta ya está
                            protegida.
                        </div>
                    ) : (
                        <form onSubmit={updatePassword} className="space-y-5">
                            <div className="grid gap-2">
                                <label
                                    htmlFor="current_password"
                                    className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase"
                                >
                                    Tu contraseña actual
                                </label>

                                <input
                                    id="current_password"
                                    ref={currentPasswordInput}
                                    value={data.current_password}
                                    onChange={(e) =>
                                        setData(
                                            'current_password',
                                            e.target.value,
                                        )
                                    }
                                    type="password"
                                    className="h-11 w-full rounded-xl border border-white/10 bg-black/60 px-4 text-xs font-bold text-white placeholder-zinc-600 transition outline-none focus:border-[#ff4600]"
                                    autoComplete="current-password"
                                    placeholder="Escribe tu contraseña actual"
                                />

                                {errors.current_password && (
                                    <p className="mt-1 text-xs text-red-400">
                                        {errors.current_password}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <label
                                    htmlFor="password"
                                    className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase"
                                >
                                    Nueva contraseña
                                </label>

                                <input
                                    id="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    type="password"
                                    className="h-11 w-full rounded-xl border border-white/10 bg-black/60 px-4 text-xs font-bold text-white placeholder-zinc-600 transition outline-none focus:border-[#ff4600]"
                                    autoComplete="new-password"
                                    placeholder="Al menos 8 letras o números"
                                />

                                {errors.password && (
                                    <p className="mt-1 text-xs text-red-400">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <label
                                    htmlFor="password_confirmation"
                                    className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase"
                                >
                                    Escribe la nueva contraseña otra vez
                                </label>

                                <input
                                    id="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            'password_confirmation',
                                            e.target.value,
                                        )
                                    }
                                    type="password"
                                    className="h-11 w-full rounded-xl border border-white/10 bg-black/60 px-4 text-xs font-bold text-white placeholder-zinc-600 transition outline-none focus:border-[#ff4600]"
                                    autoComplete="new-password"
                                    placeholder="Repite la nueva contraseña"
                                />

                                {errors.password_confirmation && (
                                    <p className="mt-1 text-xs text-red-400">
                                        {errors.password_confirmation}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-4 pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="cursor-pointer rounded-xl bg-[#ff4600] px-6 py-2.5 text-xs font-black tracking-wider text-white uppercase shadow-lg transition hover:bg-white hover:text-black active:scale-95 disabled:opacity-50"
                                >
                                    {processing
                                        ? 'Guardando...'
                                        : 'Cambiar Contraseña'}
                                </button>

                                {recentlySuccessful && (
                                    <p className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                                        <CheckCircle2 className="h-4 w-4" />{' '}
                                        Contraseña cambiada con éxito
                                    </p>
                                )}
                            </div>
                        </form>
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
