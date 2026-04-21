import AppLogoIcon from '@/components/app-logo-icon';

interface AppLogoProps {
    hideText?: boolean;
}

export default function AppLogo({ hideText = false }: AppLogoProps = {}) {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center">
                <img src="/images/logo-light.png" alt="Ganesha Event" className="block h-full w-full object-contain dark:hidden" />
                <img src="/images/logo-dark.png" alt="Ganesha Event" className="hidden h-full w-full object-contain dark:block" />
            </div>
            {!hideText && (
                <div className="ml-1 grid flex-1 text-left text-sm">
                    <span className="mb-0.5 truncate font-semibold leading-tight">
                        Ganesha Event
                    </span>
                </div>
            )}
        </>
    );
}
