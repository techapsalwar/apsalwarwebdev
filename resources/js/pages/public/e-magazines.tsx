import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import { useState, lazy, Suspense } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Calendar, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const MagazineModal = lazy(() => import('@/components/public/magazine-modal'));

interface Magazine {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    cover_url: string | null;
    pdf_url: string;
    issue_date: string;
    issue_number: string | null;
    is_featured: boolean;
}

interface Props {
    magazines: Magazine[];
}

export default function EmagazinesArchive({ magazines }: Props) {
    const [selectedMagazine, setSelectedMagazine] = useState<Magazine | null>(null);

    return (
        <PublicLayout title="E-Magazines - APS Alwar" description="Browse school e-magazines and newsletters from Army Public School Alwar">
            <Head title="E-Magazines" />

            {/* Hero */}
            <section className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white py-16 md:py-20">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                            <BookOpen className="h-5 w-5" />
                            <span className="text-sm font-medium">School Publications</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold mb-4">E-Magazines</h1>
                        <p className="text-lg text-white/80 max-w-2xl mx-auto">
                            Browse our collection of school magazines and newsletters. Click on any issue to read in our interactive flipbook viewer.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Magazine Grid */}
            <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    {magazines.length === 0 ? (
                        <div className="text-center py-20">
                            <BookOpen className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-gray-500 dark:text-gray-400">No magazines yet</h2>
                            <p className="text-gray-400 dark:text-gray-500 mt-2">Check back soon for our latest publications.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {magazines.map((magazine, index) => (
                                <motion.div
                                    key={magazine.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.4 }}
                                >
                                    <button
                                        onClick={() => setSelectedMagazine(magazine)}
                                        className="group w-full text-left bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700"
                                    >
                                        {/* Cover */}
                                        <div className="aspect-[3/4] bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 relative overflow-hidden">
                                            {magazine.cover_url ? (
                                                <img
                                                    src={magazine.cover_url}
                                                    alt={magazine.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                                                    <BookOpen className="h-16 w-16 text-emerald-300 dark:text-emerald-700" />
                                                    <span className="text-sm text-emerald-400 dark:text-emerald-600 font-medium">E-Magazine</span>
                                                </div>
                                            )}
                                            {/* Featured badge */}
                                            {magazine.is_featured && (
                                                <div className="absolute top-3 right-3">
                                                    <Badge className="bg-amber-500 text-white shadow-lg">
                                                        <Star className="h-3 w-3 mr-1 fill-current" />
                                                        Featured
                                                    </Badge>
                                                </div>
                                            )}
                                            {/* Hover overlay */}
                                            <div className="absolute inset-0 bg-emerald-600/0 group-hover:bg-emerald-600/20 transition-colors duration-300 flex items-center justify-center">
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 dark:bg-gray-900/90 rounded-full px-5 py-2.5 shadow-lg">
                                                    <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Read Now</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                                                {magazine.title}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                <Calendar className="h-3.5 w-3.5" />
                                                <span>{magazine.issue_date}</span>
                                                {magazine.issue_number && (
                                                    <>
                                                        <span className="text-gray-300 dark:text-gray-600">•</span>
                                                        <span>{magazine.issue_number}</span>
                                                    </>
                                                )}
                                            </div>
                                            {magazine.description && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                                                    {magazine.description}
                                                </p>
                                            )}
                                        </div>
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Flipbook Modal */}
            {selectedMagazine && (
                <Suspense fallback={null}>
                    <MagazineModal
                        isOpen={!!selectedMagazine}
                        onClose={() => setSelectedMagazine(null)}
                        pdfUrl={selectedMagazine.pdf_url}
                        title={selectedMagazine.title}
                    />
                </Suspense>
            )}
        </PublicLayout>
    );
}
