import { type ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import PublicHeader from '@/components/public/public-header';
import PublicFooter from '@/components/public/public-footer';

interface PublicLayoutProps {
    children: ReactNode;
    title?: string;
    description?: string;
}

export default function PublicLayout({ 
    children, 
    title = 'APS Alwar', 
    description = 'Army Public School Alwar - Excellence in Education Since 1997'
}: PublicLayoutProps) {
    return (
        <>
            <Head title={title}>
                <meta name="description" content={description} />
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=inter:400,500,600,700,800"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
                <PublicHeader />
                <main className="flex-1">
                    {children}
                </main>
                <PublicFooter />
            </div>
        </>
    );
}
