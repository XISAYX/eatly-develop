import { SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Lock, ShieldCheck, Trash2, User } from 'lucide-react';
import React, { useRef, useState } from 'react';

interface ProfileProps {
    readonly mustVerifyEmail?: boolean;
    readonly status?: string;
}

export default function Profile({
    mustVerifyEmail = false,
    status,
}: Readonly<ProfileProps>) {
    const { auth } = usePage<SharedData>().props;
    const isGoogleUser = Boolean(
        (auth?.user as Record<string, unknown>)?.google_id,
    );
    const userRole =
        ((auth?.user as Record<string, unknown>)?.role as string) || 'client';
    const userName = auth?.user?.name || 'Usuario';
    const initialGlyph = userName.charAt(0).toUpperCase();

    // Estado para el modal de borrar cuenta
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const getProfileTypeLabel = () => {
        if (
            userRole === 'merchant' ||
            userRole === 'vendor' ||
            userRole === 'restaurante'
        ) {
            return 'Cuenta de Cocina / Negocio';
        }
        if (userRole === 'driver') {
            return 'Cuenta de Repartidor';
        }
        return 'Cuenta de Alumno / Cliente';
    };

    const getBadgeColor = () => {
        if (
            userRole === 'merchant' ||
            userRole === 'vendor' ||
            userRole === 'restaurante'
        ) {
            return 'border-[#ff4600]/30 bg-[#ff4600]/10 text-[#ff4600]';
        }
        if (userRole === 'driver') {
            return 'border-[#f5ee04]/30 bg-[#f5ee04]/10 text-[#f5ee04]';
        }
        return 'border-purple-500/30 bg-purple-500/10 text-purple-400';
    };

    // Formulario de datos básicos
    const { data, setData, patch, processing, errors, recentlySuccessful } =
        useForm({
            name: auth?.user?.name || '',
            email: isGoogleUser ? '' : auth?.user?.email || '',
        });

    // Formulario para borrar cuenta
    const deleteForm = useForm({
        password: '',
    });

    const submitProfile = (e: React.FormEvent) => {
        e.preventDefault();
        patch('/settings/profile', {
            preserveScroll: true,
        });
    };

    const submitDeleteUser = (e: React.FormEvent) => {
        e.preventDefault();
        deleteForm.delete('/settings/profile', {
            preserveScroll: true,
            onSuccess: () => setIsDeleteModalOpen(false),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => deleteForm.reset(),
        });
    };

    return (
        <div className="relative flex min-h-screen flex-col justify-between overflow-x-hidden bg-[#070709] font-sans text-white antialiased selection:bg-[#ff4600] selection:text-white">
            <Head title="Mi Perfil | EATLY" />

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
                {/* Banner de bienvenida */}
                <div className="relative mb-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#ff4600] via-[#ea580c] to-[#9a3412] p-8 text-white shadow-2xl">
                    <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-[#f5ee04]/20 blur-3xl" />
                    <div className="relative z-10">
                        <span className="mb-2 inline-block rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-black tracking-widest text-[#f5ee04] uppercase backdrop-blur-md">
                            MI CUENTA
                        </span>
                        <h1 className="text-3xl font-black tracking-tight">
                            Datos de mi cuenta
                        </h1>
                        <p className="mt-1 text-xs text-orange-100">
                            Aquí puedes cambiar tu nombre y ver tu correo
                            registrado.
                        </p>
                    </div>
                </div>

                {/* Botones de navegación */}
                <nav className="mb-6 flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-2 shadow-inner backdrop-blur-xl">
                    <Link
                        href="/settings/profile"
                        className="flex items-center gap-2 rounded-xl bg-[#ff4600] px-4 py-2.5 text-xs font-black tracking-wider text-white uppercase shadow-md transition"
                    >
                        <User className="h-4 w-4" />
                        <span>MI PERFIL</span>
                    </Link>

                    <Link
                        href="/settings/password"
                        className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black tracking-wider text-zinc-400 uppercase transition hover:bg-white/5 hover:text-white"
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

                {/* Tarjeta con los datos */}
                <div className="space-y-6 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
                    {/* Tipo de cuenta */}
                    <div
                        className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-xs font-black tracking-wider uppercase shadow-sm backdrop-blur-xl ${getBadgeColor()}`}
                    >
                        <span className="h-2 w-2 animate-pulse rounded-full bg-current" />
                        {getProfileTypeLabel()}
                    </div>

                    <div>
                        <h3 className="text-base font-black tracking-tight text-white">
                            Mis Datos
                        </h3>
                        <p className="mt-1 text-xs text-zinc-400">
                            Edita tu nombre si lo necesitas.
                        </p>
                    </div>

                    <form onSubmit={submitProfile} className="space-y-5">
                        <div className="grid gap-2">
                            <label
                                htmlFor="name"
                                className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase"
                            >
                                Tu Nombre
                            </label>
                            <input
                                id="name"
                                type="text"
                                className="h-11 w-full rounded-xl border border-white/10 bg-black/60 px-4 text-xs font-bold text-white placeholder-zinc-600 transition outline-none focus:border-[#ff4600]"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                required
                                placeholder="Escribe tu nombre"
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs text-red-400">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <label
                                htmlFor="email"
                                className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase"
                            >
                                Tu Correo
                            </label>
                            <input
                                id="email"
                                type="email"
                                className={`h-11 w-full rounded-xl border border-white/10 bg-black/60 px-4 text-xs font-bold text-white placeholder-zinc-600 transition outline-none focus:border-[#ff4600] ${
                                    isGoogleUser
                                        ? 'cursor-not-allowed bg-black/30 opacity-50'
                                        : ''
                                }`}
                                value={
                                    isGoogleUser
                                        ? auth?.user?.email
                                        : data.email
                                }
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                required={!isGoogleUser}
                                disabled={isGoogleUser}
                                placeholder="tu_correo@ejemplo.com"
                            />
                            {isGoogleUser && (
                                <p className="text-[11px] font-medium text-[#f5ee04]/80">
                                    🔒 Iniciaste sesión con Google (tu correo no
                                    se puede cambiar aquí).
                                </p>
                            )}
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-400">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {mustVerifyEmail &&
                            auth?.user?.email_verified_at === null && (
                                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                                    <p className="text-xs text-zinc-300">
                                        Falta confirmar tu correo.{' '}
                                        <Link
                                            href="/email/verification-notification"
                                            method="post"
                                            as="button"
                                            className="font-bold text-[#f5ee04] underline hover:text-white"
                                        >
                                            Enviar correo de confirmación otra
                                            vez.
                                        </Link>
                                    </p>
                                    {status === 'verification-link-sent' && (
                                        <p className="mt-2 text-xs font-bold text-emerald-400">
                                            ✓ Listo, te enviamos un enlace nuevo
                                            a tu correo.
                                        </p>
                                    )}
                                </div>
                            )}

                        <div className="flex items-center gap-4 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="cursor-pointer rounded-xl bg-[#ff4600] px-6 py-2.5 text-xs font-black tracking-wider text-white uppercase shadow-lg transition hover:bg-white hover:text-black active:scale-95 disabled:opacity-50"
                            >
                                {processing
                                    ? 'Guardando...'
                                    : 'Guardar Cambios'}
                            </button>

                            {recentlySuccessful && (
                                <p className="text-xs font-bold text-emerald-400">
                                    ✓ Guardado correctamente
                                </p>
                            )}
                        </div>
                    </form>

                    {/* Borrar cuenta */}
                    <div className="border-t border-white/10 pt-6">
                        <h4 className="text-base font-black tracking-tight text-white">
                            Borrar mi cuenta
                        </h4>
                        <p className="mt-1 text-xs text-zinc-400">
                            Si borras tu cuenta, se eliminarán todos tus datos y
                            pedidos.
                        </p>

                        <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-5">
                            <p className="text-xs font-medium text-red-300">
                                Esta acción no se puede deshacer.
                            </p>

                            <button
                                type="button"
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-black tracking-wider text-white uppercase transition hover:bg-red-700 active:scale-95"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Borrar mi cuenta
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Ventana para confirmar borrado */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
                    <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-[#0f0f13] p-6 text-white shadow-2xl">
                        <h3 className="text-base font-black text-white">
                            ¿Seguro que quieres borrar tu cuenta?
                        </h3>
                        <p className="mt-1 text-xs text-zinc-400">
                            Escribe tu contraseña para confirmar.
                        </p>

                        <form
                            onSubmit={submitDeleteUser}
                            className="mt-4 space-y-4"
                        >
                            <div>
                                <label className="mb-1 block text-[11px] font-bold text-zinc-400 uppercase">
                                    Tu Contraseña
                                </label>
                                <input
                                    ref={passwordInput}
                                    type="password"
                                    required
                                    value={deleteForm.data.password}
                                    onChange={(e) =>
                                        deleteForm.setData(
                                            'password',
                                            e.target.value,
                                        )
                                    }
                                    className="h-11 w-full rounded-xl border border-white/10 bg-black/60 px-4 text-xs text-white placeholder-zinc-600 outline-none focus:border-red-500"
                                    placeholder="Escribe tu contraseña"
                                />
                                {deleteForm.errors.password && (
                                    <p className="mt-1 text-xs text-red-400">
                                        {deleteForm.errors.password}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-zinc-300 hover:bg-white/10"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={deleteForm.processing}
                                    className="cursor-pointer rounded-xl bg-red-600 px-5 py-2 text-xs font-black text-white uppercase hover:bg-red-700 disabled:opacity-50"
                                >
                                    {deleteForm.processing
                                        ? 'Borrando...'
                                        : 'Sí, borrar mi cuenta'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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
