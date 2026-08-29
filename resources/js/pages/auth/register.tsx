import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React, { useCallback, useMemo, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';

interface ServerFlashProps {
    flash?: {
        error?: string;
        success?: string;
    };
    [key: string]: unknown;
}

export default function EatlyRegistrationEngine() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        role: '',
        password: '',
        password_confirmation: '',
    });

    const { props } = usePage<ServerFlashProps>();
    const systemAlert = props.flash?.error;

    const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
    const [legalAgreement, setLegalAgreement] = useState({
        serviceTerms: false,
        privacyNotice: false,
        marketingUpdates: false,
    });

    const canExecuteDispatch = useMemo(() => {
        return legalAgreement.serviceTerms && legalAgreement.privacyNotice;
    }, [legalAgreement]);

    const onPreSubmitValidation = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setIsLegalModalOpen(true);
        },
        [],
    );

    const onConfirmAccountCreation = useCallback(() => {
        setIsLegalModalOpen(false);
        post('/register');
    }, [post]);

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#070709] px-4 py-10 font-sans text-white antialiased selection:bg-[#ff4600] selection:text-white">
            <Head title="Registro | EATLY" />

            {/* Luces Difusas Liquid Glass de Fondo */}
            <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#ff4600]/10 blur-[150px]" />
            <div className="pointer-events-none absolute -right-40 -bottom-40 h-[500px] w-[500px] rounded-full bg-[#f5ee04]/5 blur-[150px]" />

            {/* Ventana Flotante Liquid Glass */}
            <div className="relative z-10 w-full max-w-[460px] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.12)] backdrop-blur-2xl sm:p-10">
                {/* Glow Superior */}
                <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[#ff4600] to-transparent opacity-75" />

                {/* Badge Superior */}
                <div className="mb-4 flex items-center justify-center">
                    <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/50 px-3.5 py-1 text-[10px] font-extrabold tracking-widest text-[#f5ee04] uppercase backdrop-blur-md">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#f5ee04]" />
                        Red Plaza UPP
                    </span>
                </div>

                <AuthLayout
                    title="EATLY"
                    description="Plataforma de pedidos y gestión ágil"
                >
                    {systemAlert && (
                        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs font-semibold text-red-400">
                            {systemAlert}
                        </div>
                    )}

                    <form
                        onSubmit={onPreSubmitValidation}
                        className="mt-5 flex flex-col gap-4"
                        noValidate
                    >
                        {/* Nombre Completo */}
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="name"
                                className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase"
                            >
                                Nombre Completo
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                required
                                autoFocus
                                placeholder="Ingresa tu nombre"
                                className="h-11 rounded-xl border-white/10 bg-black/60 px-4 text-sm text-white placeholder-zinc-600 transition focus-visible:border-[#ff4600]/80 focus-visible:ring-1 focus-visible:ring-[#ff4600]/50"
                            />
                            <InputError message={errors.name} />
                        </div>

                        {/* Correo */}
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="email"
                                className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase"
                            >
                                Correo
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                required
                                placeholder="ejemplo@correo.com"
                                className="h-11 rounded-xl border-white/10 bg-black/60 px-4 text-sm text-white placeholder-zinc-600 transition focus-visible:border-[#ff4600]/80 focus-visible:ring-1 focus-visible:ring-[#ff4600]/50"
                            />
                            <InputError message={errors.email} />
                        </div>

                        {/* Tipo de Cuenta (Solo Cliente, Repartidor, Comercio) */}
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="role"
                                className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase"
                            >
                                Tipo de Cuenta
                            </Label>
                            <div className="relative">
                                <select
                                    id="role"
                                    name="role"
                                    value={data.role}
                                    onChange={(e) =>
                                        setData('role', e.target.value)
                                    }
                                    required
                                    className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-black/60 px-4 text-sm text-white transition outline-none focus:border-[#ff4600]/80 focus:ring-1 focus:ring-[#ff4600]/50"
                                >
                                    <option
                                        value=""
                                        disabled
                                        className="bg-[#0e0e11] text-zinc-500"
                                    >
                                        -- Selecciona una opción --
                                    </option>
                                    <option
                                        value="client"
                                        className="bg-[#0e0e11] text-white"
                                    >
                                        Cliente
                                    </option>
                                    <option
                                        value="driver"
                                        className="bg-[#0e0e11] text-white"
                                    >
                                        Repartidor
                                    </option>
                                    <option
                                        value="merchant"
                                        className="bg-[#0e0e11] text-white"
                                    >
                                        Comercio
                                    </option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-xs text-zinc-500">
                                    ▼
                                </div>
                            </div>
                            <InputError message={errors.role} />
                        </div>

                        {/* Contraseñas */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="password"
                                    className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase"
                                >
                                    Contraseña
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    required
                                    placeholder="••••••••"
                                    className="h-11 rounded-xl border-white/10 bg-black/60 px-4 text-sm text-white placeholder-zinc-600 transition focus-visible:border-[#ff4600]/80 focus-visible:ring-1 focus-visible:ring-[#ff4600]/50"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="password_confirmation"
                                    className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase"
                                >
                                    Confirmar contraseña
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            'password_confirmation',
                                            e.target.value,
                                        )
                                    }
                                    required
                                    placeholder="••••••••"
                                    className="h-11 rounded-xl border-white/10 bg-black/60 px-4 text-sm text-white placeholder-zinc-600 transition focus-visible:border-[#ff4600]/80 focus-visible:ring-1 focus-visible:ring-[#ff4600]/50"
                                />
                            </div>
                        </div>
                        <InputError message={errors.password} />
                        <InputError message={errors.password_confirmation} />

                        {/* Botón Registrarte */}
                        <Button
                            type="submit"
                            disabled={processing}
                            className="mt-2 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#ff4600] text-xs font-black tracking-wider text-white uppercase shadow-lg transition-all duration-200 hover:bg-white hover:text-black hover:shadow-[0_0_24px_rgba(255,255,255,0.4)] active:scale-[0.99] disabled:opacity-50"
                        >
                            {processing && (
                                <Spinner className="h-4 w-4 text-white" />
                            )}
                            {processing ? 'Registrando...' : 'Registrarte'}
                        </Button>

                        {/* Retorno al Login */}
                        <div className="border-t border-white/10 pt-4 text-center text-xs text-zinc-400">
                            ¿Ya tienes cuenta?{' '}
                            <Link
                                href="/login"
                                className="inline-block font-extrabold text-[#ff4600] underline underline-offset-4 transition hover:text-white"
                            >
                                Inicia sesión
                            </Link>
                        </div>
                    </form>
                </AuthLayout>
            </div>

            {/* Modal Liquid Glass de Términos y Condiciones */}
            {isLegalModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
                    <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-white/15 bg-[#0f0f13]/95 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl sm:p-8">
                        <button
                            type="button"
                            onClick={() => setIsLegalModalOpen(false)}
                            className="absolute top-5 right-5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-bold text-zinc-400 transition hover:bg-white/10 hover:text-white"
                        >
                            ✕
                        </button>

                        <div className="mb-5 pr-6">
                            <h3 className="text-lg font-black tracking-tight text-white uppercase">
                                Términos del Servicio EATLY
                            </h3>
                            <p className="mt-1 text-xs text-zinc-400">
                                Por favor revisa y acepta los términos para
                                completar tu registro en Plaza UPP.
                            </p>
                        </div>

                        <div className="mb-6 max-h-48 space-y-3 overflow-y-auto rounded-2xl border border-white/5 bg-black/50 p-4 text-xs leading-relaxed text-zinc-400">
                            <div>
                                <p className="font-bold text-zinc-200">
                                    1. Términos Generales
                                </p>
                                <p className="mt-0.5">
                                    El uso de la aplicación implica la
                                    aceptación y compromiso en la solicitud y
                                    entrega de órdenes en Plaza UPP.
                                </p>
                            </div>

                            <div>
                                <p className="font-bold text-zinc-200">
                                    2. Privacidad de la Cuenta
                                </p>
                                <p className="mt-0.5">
                                    Tus datos se emplean estrictamente para el
                                    procesamiento y recepción de tus consumos.
                                </p>
                            </div>

                            <div>
                                <p className="font-bold text-zinc-200">
                                    3. Solicitud y Recepción
                                </p>
                                <p className="mt-0.5">
                                    Cada pedido realizado se procesa al instante
                                    con los comercios registrados en el campus.
                                </p>
                            </div>
                        </div>

                        <div className="mb-6 space-y-3 text-xs">
                            <label className="flex cursor-pointer items-start gap-3 select-none">
                                <input
                                    type="checkbox"
                                    checked={legalAgreement.serviceTerms}
                                    onChange={(e) =>
                                        setLegalAgreement((prev) => ({
                                            ...prev,
                                            serviceTerms: e.target.checked,
                                        }))
                                    }
                                    className="mt-0.5 h-4 w-4 rounded border-white/20 bg-black/80 text-[#ff4600] accent-[#ff4600] focus:ring-0"
                                />
                                <span className="text-zinc-300">
                                    Acepto los Términos y condiciones{' '}
                                    <span className="font-bold text-[#ff4600]">
                                        *
                                    </span>
                                </span>
                            </label>

                            <label className="flex cursor-pointer items-start gap-3 select-none">
                                <input
                                    type="checkbox"
                                    checked={legalAgreement.privacyNotice}
                                    onChange={(e) =>
                                        setLegalAgreement((prev) => ({
                                            ...prev,
                                            privacyNotice: e.target.checked,
                                        }))
                                    }
                                    className="mt-0.5 h-4 w-4 rounded border-white/20 bg-black/80 text-[#ff4600] accent-[#ff4600] focus:ring-0"
                                />
                                <span className="text-zinc-300">
                                    Acepto la Política de privacidad{' '}
                                    <span className="font-bold text-[#ff4600]">
                                        *
                                    </span>
                                </span>
                            </label>

                            <label className="flex cursor-pointer items-start gap-3 select-none">
                                <input
                                    type="checkbox"
                                    checked={legalAgreement.marketingUpdates}
                                    onChange={(e) =>
                                        setLegalAgreement((prev) => ({
                                            ...prev,
                                            marketingUpdates: e.target.checked,
                                        }))
                                    }
                                    className="mt-0.5 h-4 w-4 rounded border-white/20 bg-black/80 text-[#ff4600] accent-[#ff4600] focus:ring-0"
                                />
                                <span className="text-zinc-500">
                                    Quiero recibir novedades y avisos de EATLY
                                    (Opcional)
                                </span>
                            </label>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setIsLegalModalOpen(false)}
                                className="flex-1 cursor-pointer rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-bold tracking-wider text-zinc-300 uppercase transition hover:bg-white/10"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                disabled={!canExecuteDispatch || processing}
                                onClick={onConfirmAccountCreation}
                                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-xs font-black tracking-wider uppercase transition ${
                                    canExecuteDispatch
                                        ? 'cursor-pointer bg-[#ff4600] text-white shadow-lg hover:bg-white hover:text-black active:scale-95'
                                        : 'cursor-not-allowed bg-zinc-800 text-zinc-500 opacity-50'
                                }`}
                            >
                                {processing && (
                                    <Spinner className="h-4 w-4 text-white" />
                                )}
                                Continuar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
