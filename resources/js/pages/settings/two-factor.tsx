import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import { disable, enable } from '@/routes/two-factor';
import { SharedData } from '@/types';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Lock, ShieldBan, ShieldCheck, User } from 'lucide-react';
import { useState } from 'react';

interface TwoFactorProps {
    readonly requiresConfirmation?: boolean;
    readonly twoFactorEnabled?: boolean;
}

export default function TwoFactor({
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: Readonly<TwoFactorProps>) {
    const { auth } = usePage<SharedData>().props;
    const userName = auth?.user?.name || 'Comensal';
    const initialGlyph = userName.charAt(0).toUpperCase();

    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();

    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);

    return (
        <div className="relative flex min-h-screen flex-col justify-between overflow-x-hidden bg-[#070709] font-sans text-white antialiased selection:bg-[#ff4600] selection:text-white">
            <Head title="Verificación 2FA | EATLY" />

            {/* Luces Ambientales Liquid Glass */}
            <div className="pointer-events-none fixed -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-[#ff4600]/15 blur-[160px]" />
            <div className="pointer-events-none fixed -right-40 -bottom-40 h-[520px] w-[520px] rounded-full bg-[#f5ee04]/10 blur-[160px]" />

            {/* Navbar Superior */}
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
                            <ArrowLeft className="h-3.5 w-3.5" /> Volver al
                            Inicio
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

            {/* Contenido Principal */}
            <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-4 py-8 pb-20">
                {/* Banner Hero Liquid Glass */}
                <div className="relative mb-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#ff4600] via-[#ea580c] to-[#9a3412] p-8 text-white shadow-2xl">
                    <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-[#f5ee04]/20 blur-3xl" />
                    <div className="relative z-10">
                        <span className="mb-2 inline-block rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-black tracking-widest text-[#f5ee04] uppercase backdrop-blur-md">
                            SEGURIDAD AVANZADA
                        </span>
                        <h1 className="text-3xl font-black tracking-tight">
                            Verificación en Dos Pasos (2FA)
                        </h1>
                        <p className="mt-1 text-xs text-orange-100">
                            Añade un nivel extra de protección a tu terminal de
                            pedidos y transacciones.
                        </p>
                    </div>
                </div>

                {/* Barra de Pestañas de Navegación */}
                <nav className="mb-6 flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-2 shadow-inner backdrop-blur-xl">
                    <Link
                        href="/settings/profile"
                        className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black tracking-wider text-zinc-400 uppercase transition hover:bg-white/5 hover:text-white"
                    >
                        <User className="h-4 w-4" />
                        <span>PERFIL</span>
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
                        className="flex items-center gap-2 rounded-xl bg-[#ff4600] px-4 py-2.5 text-xs font-black tracking-wider text-white uppercase shadow-md transition"
                    >
                        <ShieldCheck className="h-4 w-4" />
                        <span>VERIFICACIÓN EN DOS PASOS</span>
                    </Link>
                </nav>

                {/* Contenedor 2FA */}
                <div className="space-y-6 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
                    <div>
                        <h3 className="text-base font-black tracking-tight text-white">
                            Autenticación Multifactor
                        </h3>
                        <p className="mt-1 text-xs text-zinc-400">
                            Protege tu cuenta solicitando un código dinámico
                            TOTP al iniciar sesión.
                        </p>
                    </div>

                    {twoFactorEnabled ? (
                        <div className="flex flex-col items-start justify-start space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-xs font-medium shadow-inner backdrop-blur-xl">
                            <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-black tracking-wider text-emerald-400 uppercase">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                                Protección 2FA Activa
                            </span>

                            <p className="leading-relaxed text-zinc-300">
                                Al ingresar se te solicitará un PIN seguro y
                                aleatorio generado desde tu app de autenticación
                                móvil (Google Authenticator, Microsoft
                                Authenticator o Authy).
                            </p>

                            <div className="w-full border-t border-white/10 pt-4">
                                <TwoFactorRecoveryCodes
                                    recoveryCodesList={recoveryCodesList}
                                    fetchRecoveryCodes={fetchRecoveryCodes}
                                    errors={errors}
                                />
                            </div>

                            <div className="relative inline pt-2">
                                <Form
                                    action={disable.url()}
                                    method={disable.definition.methods[0]}
                                >
                                    {({ processing }) => (
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex cursor-pointer items-center rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-2.5 text-xs font-black tracking-wider text-red-400 uppercase transition hover:bg-red-500 hover:text-white active:scale-95 disabled:opacity-50"
                                        >
                                            <ShieldBan className="mr-2 h-4 w-4" />{' '}
                                            Desactivar 2FA
                                        </button>
                                    )}
                                </Form>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-start justify-start space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-xs font-medium shadow-inner backdrop-blur-xl">
                            <span className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-500/30 bg-white/5 px-3 py-1 text-xs font-black tracking-wider text-zinc-400 uppercase">
                                <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
                                Sin Protección Adicional
                            </span>

                            <p className="leading-relaxed text-zinc-400">
                                Al activar la verificación en dos pasos, se te
                                pedirá un PIN de un solo uso al iniciar sesión
                                para evitar accesos no autorizados a tu perfil
                                institucional.
                            </p>

                            <div className="pt-2">
                                {hasSetupData ? (
                                    <button
                                        type="button"
                                        onClick={() => setShowSetupModal(true)}
                                        className="inline-flex cursor-pointer items-center rounded-xl bg-[#ff4600] px-5 py-2.5 text-xs font-black tracking-wider text-white uppercase shadow-lg transition hover:bg-white hover:text-black active:scale-95"
                                    >
                                        <ShieldCheck className="mr-2 h-4 w-4" />
                                        Continuar Configuración
                                    </button>
                                ) : (
                                    <Form
                                        action={enable.url()}
                                        method={enable.definition.methods[0]}
                                        onSuccess={() =>
                                            setShowSetupModal(true)
                                        }
                                    >
                                        {({ processing }) => (
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="inline-flex cursor-pointer items-center rounded-xl bg-[#ff4600] px-5 py-2.5 text-xs font-black tracking-wider text-white uppercase shadow-lg transition hover:bg-white hover:text-black active:scale-95 disabled:opacity-50"
                                            >
                                                <ShieldCheck className="mr-2 h-4 w-4" />
                                                Activar Verificación 2FA
                                            </button>
                                        )}
                                    </Form>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Modal de Configuración 2FA */}
            <TwoFactorSetupModal
                isOpen={showSetupModal}
                onClose={() => setShowSetupModal(false)}
                requiresConfirmation={requiresConfirmation}
                twoFactorEnabled={twoFactorEnabled}
                qrCodeSvg={qrCodeSvg}
                manualSetupKey={manualSetupKey}
                clearSetupData={clearSetupData}
                fetchSetupData={fetchSetupData}
                errors={errors}
            />

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
