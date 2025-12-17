import PublicLayout from '@/layouts/public-layout';
import { Link } from '@inertiajs/react';
import { 
    ArrowLeft,
    GraduationCap, 
    Mail,
    Award,
    BookOpen,
    Quote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Props {
    principal: {
        name: string;
        qualification: string;
        message: string;
        photo: string;
    };
}

const resolveImageUrl = (image?: string, defaultFolder = 'settings') => {
    if (!image) return '';
    if (image.startsWith('http') || image.startsWith('/')) return image;
    // If the path already includes a folder (contains /), use as-is
    // Otherwise, prepend the default folder for plain filenames
    const hasFolder = image.includes('/');
    const path = hasFolder ? image : `${defaultFolder}/${image}`;
    return `/storage/${path}`;
};

export default function PrincipalMessage({ principal }: Props) {
    // Split message into paragraphs
    const messageParagraphs = principal.message.split('\n\n').filter(p => p.trim());
    const principalPhoto = principal.photo ? resolveImageUrl(principal.photo) : '';

    return (
        <PublicLayout title="Principal's Message - APS Alwar">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-gray-950 py-16">
                <div className="container mx-auto px-4">
                    <Button variant="ghost" size="sm" className="mb-6" asChild>
                        <Link href="/about">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to About
                        </Link>
                    </Button>
                    <div className="max-w-4xl mx-auto">
                        <Badge className="mb-4 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                            Leadership
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Principal's Message
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            A message from our esteemed Principal on education, values, and the APS Alwar vision.
                        </p>
                    </div>
                </div>
            </section>

            {/* Principal Profile & Message */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-3 gap-12">
                            {/* Profile Card */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-24">
                                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/20 rounded-2xl p-6 text-center">
                                        {/* Photo */}
                                        <div className="w-48 h-48 mx-auto mb-6 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center overflow-hidden">
                                            {principalPhoto ? (
                                                <img 
                                                    src={principalPhoto} 
                                                    alt={principal.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <GraduationCap className="h-24 w-24 text-amber-500" />
                                            )}
                                        </div>
                                        {/* Name & Designation */}
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                            {principal.name}
                                        </h2>
                                        <p className="text-amber-700 dark:text-amber-400 font-medium mb-4">
                                            Principal
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                            {principal.qualification}
                                        </p>
                                        
                                        {/* Quick Stats */}
                                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-amber-200 dark:border-amber-800">
                                            <div className="text-center">
                                                <Award className="h-6 w-6 mx-auto mb-2 text-amber-600" />
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    Yale Certified
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <BookOpen className="h-6 w-6 mx-auto mb-2 text-amber-600" />
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    M.A., M.Ed.
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contact */}
                                        <div className="mt-6 pt-6 border-t border-amber-200 dark:border-amber-800">
                                            <a 
                                                href="mailto:principal@apsalwar.edu.in"
                                                className="inline-flex items-center text-sm text-amber-700 dark:text-amber-400 hover:underline"
                                            >
                                                <Mail className="h-4 w-4 mr-2" />
                                                principal@apsalwar.edu.in
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Message Content */}
                            <div className="lg:col-span-2">
                                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border p-8 lg:p-12">
                                    {/* Quote Icon */}
                                    <Quote className="h-12 w-12 text-amber-200 dark:text-amber-800 mb-6" />
                                    
                                    {/* Message */}
                                    <div className="prose prose-lg dark:prose-invert max-w-none">
                                        {messageParagraphs.map((paragraph, index) => (
                                            <p 
                                                key={index} 
                                                className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6"
                                            >
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>

                                    {/* Signature */}
                                    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                                        <p className="text-gray-600 dark:text-gray-400 mb-2">With warm regards,</p>
                                        <p className="text-xl font-semibold text-gray-900 dark:text-white">
                                            {principal.name}
                                        </p>
                                        <p className="text-amber-600 dark:text-amber-400">
                                            Principal, Army Public School Alwar
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-amber-600 to-amber-700">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Join the APS Alwar Family
                    </h2>
                    <p className="text-amber-100 mb-8 max-w-2xl mx-auto">
                        Experience the difference of education with discipline, values, and excellence.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button size="lg" variant="secondary" asChild>
                            <a href="https://erp.awesindia.edu.in/webinterface/searchschool" target="_blank" rel="noopener noreferrer">
                                Admission Now
                            </a>
                        </Button>
                        <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                            <Link href="/contact">
                                Contact Us
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
