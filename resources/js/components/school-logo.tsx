import { cn } from '@/lib/utils';

interface SchoolLogoProps {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    className?: string;
    showBackground?: boolean;
    bgClassName?: string;
}

const sizeMap = {
    xs: { container: 'h-6 w-6', img: 'h-5 w-5' },
    sm: { container: 'h-8 w-8', img: 'h-7 w-7' },
    md: { container: 'h-12 w-12', img: 'h-10 w-10' },
    lg: { container: 'h-14 w-14', img: 'h-12 w-12' },
    xl: { container: 'h-16 w-16', img: 'h-14 w-14' },
    '2xl': { container: 'h-24 w-24', img: 'h-20 w-20' },
};

export default function SchoolLogo({ 
    size = 'md', 
    className,
    showBackground = true,
    bgClassName = 'bg-amber-600',
}: SchoolLogoProps) {
    const { container, img } = sizeMap[size];

    if (showBackground) {
        return (
            <div className={cn(
                'flex items-center justify-center rounded-full',
                container,
                bgClassName,
                className
            )}>
                <img 
                    src="/favicon/android-chrome-192x192.png" 
                    alt="Army Public School Alwar Logo"
                    className={cn(img, 'object-contain')}
                />
            </div>
        );
    }

    return (
        <img 
            src="/favicon/android-chrome-192x192.png" 
            alt="Army Public School Alwar Logo"
            className={cn(container, 'object-contain', className)}
        />
    );
}

// Export a simple image component for places that need just the image
export function SchoolLogoImage({ 
    className,
    size = 'md',
}: { 
    className?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}) {
    const { container } = sizeMap[size];
    
    return (
        <img 
            src="/favicon/android-chrome-192x192.png" 
            alt="Army Public School Alwar Logo"
            className={cn(container, 'object-contain', className)}
        />
    );
}
