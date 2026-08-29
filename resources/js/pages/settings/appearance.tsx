import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import EatlySettingsLayout from '@/layouts/settings/eatly-settings-layout';
import { Head } from '@inertiajs/react';

export default function Appearance() {
    return (
        <EatlySettingsLayout>
            <Head title="Tema Visual | Ajustes EATLY" />

            <div className="space-y-6">
                <HeadingSmall
                    title="Tema & Visualización"
                    description="Personaliza la interfaz visual y el esquema de contrastes de tu cuenta EATLY."
                />

                <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 shadow-inner backdrop-blur-xl">
                    <AppearanceTabs />
                </div>
            </div>
        </EatlySettingsLayout>
    );
}
