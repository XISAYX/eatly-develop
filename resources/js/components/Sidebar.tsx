import { router } from '@inertiajs/react';
import { Settings } from 'lucide-react';
import React, { useCallback, useId, useState } from 'react';

interface TerminalAccountProfile {
    name?: string;
    email?: string;
    avatar?: string;
    role?: string;
}

interface DrawerFlyoutProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
    readonly auth: {
        readonly user?: TerminalAccountProfile;
    };
    readonly onSelectCategory?: (catalogTag: string) => void;
}

export default function EatlyFlyoutDrawer({
    isOpen,
    onClose,
    auth,
    onSelectCategory,
}: Readonly<DrawerFlyoutProps>) {
    const [isBillingModalActive, setIsBillingModalActive] = useState(false);
    const flyoutComponentKey = useId();

    const authenticatedSubject = auth?.user;
    const isMemberActive = Boolean(authenticatedSubject);
    const accountHolderName =
        authenticatedSubject?.name || 'Comensal Universitario';
    const initialGlyph = accountHolderName.charAt(0).toUpperCase();

    const profilePathTarget = isMemberActive ? '/profile' : '/login';
    const terminalPrefsTarget = isMemberActive ? '/settings/profile' : '/login';

    const terminateActiveHandshake = useCallback(
        (evt: React.FormEvent) => {
            evt.preventDefault();
            onClose();
            router.post('/logout');
        },
        [onClose],
    );

    const dispatchSectionFilter = useCallback(
        (selectedTag: string) => {
            if (onSelectCategory) {
                onSelectCategory(selectedTag);
            } else {
                window.location.href = '/dashboard';
            }
            onClose();
        },
        [onSelectCategory, onClose],
    );

    if (!isOpen) return null;

    return (
        <div
            key={flyoutComponentKey}
            className="fixed inset-0 z-50 overflow-hidden font-sans antialiased selection:bg-[#ff4600] selection:text-white"
        >
            {/* Cortina Traslúcida con Desenfoque de Fondo */}
            <button
                type="button"
                aria-label="Ocultar panel de navegación"
                className="absolute inset-0 cursor-pointer bg-black/80 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Contenedor Lateral Flotante Liquid Glass */}
            <aside className="absolute inset-y-0 left-0 z-10 flex w-80 transform flex-col border-r border-white/10 bg-[#0a0a0e]/95 text-white shadow-[0_25px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl transition-transform duration-300 ease-in-out">
                {/* Cabecera Principal */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0a0a0e]/95 p-5 backdrop-blur-xl">
                    <a
                        href={isMemberActive ? '/dashboard' : '/'}
                        className="group flex cursor-pointer items-center gap-1"
                    >
                        <span className="text-xl font-black tracking-tight text-white">
                            EATLY
                        </span>
                        <span className="h-2 w-2 rounded-full bg-[#ff4600] transition-transform group-hover:scale-125" />
                    </a>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-bold text-zinc-400 transition hover:bg-white/10 hover:text-white"
                        aria-label="Cerrar barra"
                    >
                        ✕
                    </button>
                </div>

                {/* Cuerpo con Desplazamiento */}
                <div className="flex-1 space-y-6 overflow-y-auto p-5">
                    {/* Ficha de Identidad del Usuario */}
                    <div className="flex items-center gap-2">
                        <a
                            href={profilePathTarget}
                            className="group flex flex-1 cursor-pointer items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-left backdrop-blur-xl transition hover:border-[#ff4600]/40 hover:bg-white/[0.06]"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff4600] to-[#ea580c] text-base font-black text-white shadow-lg transition-transform group-hover:scale-105">
                                {initialGlyph}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-[10px] font-extrabold tracking-widest text-[#f5ee04] uppercase">
                                    Mi Espacio
                                </p>
                                <h4 className="truncate text-sm font-bold text-white">
                                    Hola, {accountHolderName}
                                </h4>
                            </div>
                        </a>

                        <a
                            href={terminalPrefsTarget}
                            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-zinc-300 shadow-sm transition hover:border-[#ff4600]/40 hover:bg-white/[0.08] hover:text-[#ff4600]"
                            title="Ajustes de terminal"
                        >
                            <Settings className="h-5 w-5" />
                        </a>
                    </div>

                    {/* Banner Promocional Plaza UPP */}
                    <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#ff4600]/30 bg-gradient-to-br from-[#ff4600]/20 via-[#ea580c]/10 to-transparent p-4 text-white shadow-lg backdrop-blur-xl">
                        <div className="relative z-10 mb-3">
                            <span className="mb-2 inline-block rounded-full bg-[#ff4600] px-2.5 py-0.5 text-[9px] font-black tracking-widest text-white uppercase">
                                Plaza UPP
                            </span>
                            <h4 className="text-xs leading-snug font-black">
                                Especialidades & Oportunidades del Día
                            </h4>
                        </div>
                        <button
                            type="button"
                            onClick={() => dispatchSectionFilter('Todos')}
                            className="relative z-10 w-full cursor-pointer rounded-xl bg-white py-2 text-center text-[11px] font-black tracking-wider text-black uppercase transition hover:bg-[#f5ee04]"
                        >
                            Explorar Especialidades
                        </button>
                    </div>

                    {/* Categorías de la Carta */}
                    <div className="space-y-1">
                        <p className="mb-2 text-[10px] font-extrabold tracking-widest text-zinc-500 uppercase">
                            Cartas en Plaza UPP
                        </p>

                        <button
                            type="button"
                            onClick={() => dispatchSectionFilter('Comida')}
                            className="group flex w-full cursor-pointer items-center justify-between rounded-2xl p-3 text-left text-xs font-bold text-zinc-300 transition hover:bg-white/5 hover:text-white"
                        >
                            <span>Cocinas y Comida Casera</span>
                            <span className="text-zinc-600 transition-transform group-hover:translate-x-0.5 group-hover:text-[#ff4600]">
                                &gt;
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => dispatchSectionFilter('Snacks')}
                            className="group flex w-full cursor-pointer items-center justify-between rounded-2xl p-3 text-left text-xs font-bold text-zinc-300 transition hover:bg-white/5 hover:text-white"
                        >
                            <span>Antojos, Tacos & Burgers</span>
                            <span className="text-zinc-600 transition-transform group-hover:translate-x-0.5 group-hover:text-[#ff4600]">
                                &gt;
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => dispatchSectionFilter('Bares')}
                            className="group flex w-full cursor-pointer items-center justify-between rounded-2xl p-3 text-left text-xs font-bold text-zinc-300 transition hover:bg-white/5 hover:text-white"
                        >
                            <span>Barra de Bebidas & Aguas</span>
                            <span className="text-zinc-600 transition-transform group-hover:translate-x-0.5 group-hover:text-[#ff4600]">
                                &gt;
                            </span>
                        </button>
                    </div>

                    {/* Saldo y Monedero Digital */}
                    <div className="space-y-1">
                        <p className="mb-2 text-[10px] font-extrabold tracking-widest text-zinc-500 uppercase">
                            Billetera Universitaria
                        </p>
                        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 p-3 text-xs">
                            <span className="font-semibold text-zinc-400">
                                Balance Eatly
                            </span>
                            <span className="font-mono font-bold text-[#f5ee04]">
                                $ 0.00 MXN
                            </span>
                        </div>
                    </div>

                    {/* Gestión del Usuario */}
                    <div className="space-y-1">
                        <p className="mb-2 text-[10px] font-extrabold tracking-widest text-zinc-500 uppercase">
                            Gestión Personal
                        </p>

                        <a
                            href={profilePathTarget}
                            className="group flex w-full cursor-pointer items-center justify-between rounded-2xl p-3 text-left text-xs font-bold text-zinc-300 transition hover:bg-white/5 hover:text-white"
                        >
                            <span>Detalles del usuario</span>
                            <span className="text-zinc-600 transition-transform group-hover:translate-x-0.5 group-hover:text-[#ff4600]">
                                &gt;
                            </span>
                        </a>

                        <button
                            type="button"
                            onClick={() => setIsBillingModalActive(true)}
                            className="group flex w-full cursor-pointer items-center justify-between rounded-2xl p-3 text-left text-xs font-bold text-zinc-300 transition hover:bg-white/5 hover:text-white"
                        >
                            <span>Vías de liquidación</span>
                            <span className="text-zinc-600 transition-transform group-hover:translate-x-0.5 group-hover:text-[#ff4600]">
                                &gt;
                            </span>
                        </button>

                        <a
                            href={isMemberActive ? '/historial' : '/login'}
                            className="group flex w-full cursor-pointer items-center justify-between rounded-2xl p-3 text-left text-xs font-bold text-zinc-300 transition hover:bg-white/5 hover:text-white"
                        >
                            <span>Bitácora de consumos</span>
                            <span className="text-zinc-600 transition-transform group-hover:translate-x-0.5 group-hover:text-[#ff4600]">
                                &gt;
                            </span>
                        </a>
                    </div>

                    {/* Registro Comercial & Aliados */}
                    <div className="space-y-1 border-t border-white/10 pt-4">
                        <p className="mb-2 text-[10px] font-extrabold tracking-widest text-zinc-500 uppercase">
                            Aliados Comerciales
                        </p>

                        {/* Enlace directo nativo a /vendor/register */}
                        <a
                            href="/vendor/register"
                            className="group flex w-full cursor-pointer items-center justify-between rounded-2xl p-3 text-left text-xs font-bold text-zinc-300 transition hover:bg-white/5 hover:text-white"
                        >
                            <span>Afiliar cocina o comercio</span>
                            <span className="text-zinc-600 group-hover:text-[#ff4600]">
                                &gt;
                            </span>
                        </a>

                        <a
                            href="/register"
                            className="group flex w-full cursor-pointer items-center justify-between rounded-2xl p-3 text-left text-xs font-bold text-zinc-300 transition hover:bg-white/5 hover:text-white"
                        >
                            <span>Ser courier express</span>
                            <span className="text-zinc-600 group-hover:text-[#ff4600]">
                                &gt;
                            </span>
                        </a>

                        {isMemberActive && (
                            <form
                                onSubmit={terminateActiveHandshake}
                                className="pt-2"
                            >
                                <button
                                    type="submit"
                                    className="group flex w-full cursor-pointer items-center justify-between rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-left text-xs font-bold text-red-400 transition hover:bg-red-500 hover:text-white"
                                >
                                    <span>Finalizar sesión</span>
                                    <span>&rarr;</span>
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </aside>

            {/* Modal Liquid Glass: Vías de Liquidación */}
            {isBillingModalActive && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
                    <div className="relative w-full max-w-sm rounded-3xl border border-white/15 bg-[#0f0f13]/95 p-6 text-white shadow-[0_25px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
                        <button
                            type="button"
                            onClick={() => setIsBillingModalActive(false)}
                            className="absolute top-4 right-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-bold text-zinc-400 hover:bg-white/10 hover:text-white"
                        >
                            ✕
                        </button>

                        <div className="space-y-4 pt-2 text-center">
                            <h3 className="text-base font-black text-white">
                                Vías de Liquidación Habilitadas
                            </h3>
                            <p className="text-xs text-zinc-400">
                                Dispones de pago presencial contra recepción en
                                Plaza UPP y pasarela digital directa.
                            </p>

                            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/50 p-3 text-left text-xs font-bold">
                                <span className="text-zinc-200">
                                    Efectivo en Plaza UPP
                                </span>
                                <span className="text-[10px] font-bold text-[#f5ee04] uppercase">
                                    Por Defecto
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsBillingModalActive(false)}
                                className="w-full cursor-pointer rounded-xl bg-[#ff4600] py-3 text-xs font-black tracking-wider text-white uppercase shadow-lg transition hover:bg-white hover:text-black"
                            >
                                De acuerdo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
