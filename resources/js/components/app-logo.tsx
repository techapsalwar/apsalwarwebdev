export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center overflow-hidden">
                <img 
                    src="/favicon/android-chrome-192x192.png" 
                    alt="APS Alwar Logo"
                    className="size-8 object-contain"
                />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    APS Alwar
                </span>
                <span className="truncate text-xs text-muted-foreground">
                    Admin Panel
                </span>
            </div>
        </>
    );
}
