import { Head, Link, router, usePage } from '@inertiajs/react';
import axios, { AxiosError } from 'axios';
import React, { useCallback, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { storeTabToken } from '@/lib/tab-auth';

interface AuthPayloadResponse {
    token: string;
    redirect: string;
}

interface ServerFlashProps {
    flash?: {
        error?: string;
        success?: string;
    };
    [key: string]: unknown;
}

export default function EatlyAuthPortal() {
    const [sessionForm, setSessionForm] = useState({
        userMail: '',
        passcode: '',
        persistSession: true,
    });

    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [isProcessingSync, setIsProcessingSync] = useState(false);

    const pageContext = usePage<ServerFlashProps>();
    const systemAlert = pageContext.props.flash?.error;

    const handleFieldChange = useCallback(
        (fieldKey: string, valueValue: string | boolean) => {
            setSessionForm((prev) => ({ ...prev, [fieldKey]: valueValue }));
            if (fieldErrors[fieldKey]) {
                setFieldErrors((prevErrors) => ({
                    ...prevErrors,
                    [fieldKey]: '',
                }));
            }
        },
        [fieldErrors],
    );

    const executeSessionHandshake = async (
        e: React.FormEvent<HTMLFormElement>,
    ) => {
        e.preventDefault();
        setFieldErrors({});
        setIsProcessingSync(true);

        try {
            const responseStream = await axios.post<AuthPayloadResponse>(
                '/login',
                {
                    email: sessionForm.userMail,
                    password: sessionForm.passcode,
                    remember: sessionForm.persistSession,
                },
                {
                    headers: { Accept: 'application/json' },
                },
            );

            const { token, redirect } = responseStream.data;
            storeTabToken(token);
            router.visit(redirect || '/dashboard');
        } catch (err: unknown) {
            const errorObject = err as AxiosError<{
                errors?: Record<string, string[]>;
            }>;

            if (errorObject.response?.status === 422) {
                const validationMap = errorObject.response.data.errors;
                if (validationMap) {
                    const mappedErrors: Record<string, string> = {};
                    Object.keys(validationMap).forEach((key) => {
                        if (validationMap[key]?.[0]) {
                            mappedErrors[
                                key === 'email' ? 'userMail' : 'passcode'
                            ] = validationMap[key][0];
                        }
                    });
                    setFieldErrors(mappedErrors);
                }
            } else {
                setFieldErrors({
                    userMail:
                        'Credenciales no reconocidas o servicio inactivo temporalmente.',
                });
            }
        } finally {
            setIsProcessingSync(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#070709] px-4 py-10 font-sans text-white antialiased selection:bg-[#ff4600] selection:text-white">
            <Head title="Acceso | EATLY" />

            {/* Luces Difusas Liquid Glass Idénticas a la App */}
            <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#ff4600]/10 blur-[150px]" />
            <div className="pointer-events-none absolute -right-40 -bottom-40 h-[500px] w-[500px] rounded-full bg-[#f5ee04]/5 blur-[150px]" />

            {/* Panel Flotante Liquid Glass */}
            <div className="relative z-10 w-full max-w-[440px] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.12)] backdrop-blur-2xl sm:p-10">
                {/* Micro Glow Superior Naranja */}
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
                        onSubmit={executeSessionHandshake}
                        className="mt-5 flex flex-col gap-5"
                        noValidate
                    >
                        <div className="space-y-4">
                            {/* Campo Correo */}
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="userMail"
                                    className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase"
                                >
                                    Correo
                                </Label>
                                <Input
                                    id="userMail"
                                    type="email"
                                    value={sessionForm.userMail}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            'userMail',
                                            e.target.value,
                                        )
                                    }
                                    className="h-11 rounded-xl border-white/10 bg-black/60 px-4 text-sm text-white placeholder-zinc-600 transition focus-visible:border-[#ff4600]/80 focus-visible:ring-1 focus-visible:ring-[#ff4600]/50"
                                    placeholder="ejemplo@correo.com"
                                    required
                                />
                                <InputError message={fieldErrors.userMail} />
                            </div>

                            {/* Campo Contraseña */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="passcode"
                                        className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase"
                                    >
                                        Contraseña
                                    </Label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-[11px] text-zinc-400 transition hover:text-[#ff4600]"
                                    >
                                        Restablecer contraseña
                                    </Link>
                                </div>
                                <Input
                                    id="passcode"
                                    type="password"
                                    value={sessionForm.passcode}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            'passcode',
                                            e.target.value,
                                        )
                                    }
                                    className="h-11 rounded-xl border-white/10 bg-black/60 px-4 text-sm text-white placeholder-zinc-600 transition focus-visible:border-[#ff4600]/80 focus-visible:ring-1 focus-visible:ring-[#ff4600]/50"
                                    placeholder="••••••••••••"
                                    required
                                />
                                <InputError message={fieldErrors.passcode} />
                            </div>

                            {/* Checkbox de Sesión */}
                            <div className="flex items-center pt-1">
                                <input
                                    id="persistSession"
                                    type="checkbox"
                                    checked={sessionForm.persistSession}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            'persistSession',
                                            e.target.checked,
                                        )
                                    }
                                    className="h-4 w-4 cursor-pointer rounded border-white/20 bg-black/80 text-[#ff4600] accent-[#ff4600] focus:ring-0"
                                />
                                <label
                                    htmlFor="persistSession"
                                    className="ml-2.5 cursor-pointer text-xs font-medium text-zinc-300 select-none"
                                >
                                    Inicio de sesión activado
                                </label>
                            </div>

                            {/* Botón Ingresar Naranja Neón */}
                            <Button
                                type="submit"
                                disabled={isProcessingSync}
                                className="mt-2 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#ff4600] text-xs font-black tracking-wider text-white uppercase shadow-lg transition-all duration-200 hover:bg-white hover:text-black hover:shadow-[0_0_24px_rgba(255,255,255,0.4)] active:scale-[0.99] disabled:opacity-50"
                            >
                                {isProcessingSync && (
                                    <Spinner className="h-4 w-4 text-white" />
                                )}
                                {isProcessingSync
                                    ? 'Ingresando...'
                                    : 'Ingresar'}
                            </Button>
                        </div>

                        {/* Enlace Registro */}
                        <div className="border-t border-white/10 pt-4 text-center text-xs text-zinc-400">
                            ¿No tienes cuenta?{' '}
                            <Link
                                href="/register"
                                className="inline-block font-extrabold text-[#ff4600] underline underline-offset-4 transition hover:text-white"
                            >
                                Registrarte
                            </Link>
                        </div>
                    </form>
                </AuthLayout>
            </div>
        </div>
    );
}
