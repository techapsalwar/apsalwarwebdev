import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, X } from 'lucide-react';
import MagazineModal from './magazine-modal';

interface FeaturedMagazine {
    id: number;
    title: string;
    slug: string;
    cover_url: string | null;
    pdf_url: string;
    issue_date: string;
    issue_number: string | null;
}

interface MagazineFabProps {
    magazine: FeaturedMagazine;
}

function MagazineFab({ magazine }: MagazineFabProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    if (dismissed) return null;

    return (
        <>
            {/* Floating Cover Card — Left side */}
            <motion.div
                className="fixed left-4 bottom-6 z-40 group"
                initial={{ x: -120, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 1.5 }}
            >
                {/* Dismiss button */}
                <button
                    onClick={(e) => { e.stopPropagation(); setDismissed(true); }}
                    className="absolute -top-2 -right-2 z-10 bg-gray-800/80 hover:bg-gray-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md cursor-pointer"
                    aria-label="Dismiss"
                >
                    <X className="h-3 w-3" />
                </button>

                {/* Clickable card */}
                <motion.button
                    onClick={() => setIsOpen(true)}
                    className="relative cursor-pointer rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10"
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    aria-label={`Read ${magazine.title}`}
                >
                    {/* Cover image or fallback */}
                    <div className="w-[100px] md:w-[120px] aspect-[3/4] relative">
                        {magazine.cover_url ? (
                            <img
                                src={magazine.cover_url}
                                alt={magazine.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 flex flex-col items-center justify-center gap-1.5 p-2">
                                <BookOpen className="h-8 w-8 text-white/80" />
                                <span className="text-[10px] text-white/70 font-medium text-center leading-tight">E-Magazine</span>
                            </div>
                        )}

                        {/* Shimmer overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* "Read" label on hover */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="bg-white/90 dark:bg-gray-900/90 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                                Read ▸
                            </span>
                        </div>
                    </div>

                    {/* Bottom label strip */}
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-2 py-1.5 text-center">
                        <span className="text-[10px] md:text-xs font-semibold text-white tracking-wide">E-Magazine</span>
                    </div>

                    {/* Animated glow ring */}
                    <motion.div
                        className="absolute -inset-1 rounded-xl border-2 border-emerald-400/50 pointer-events-none"
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </motion.button>
            </motion.div>

            {/* Fullscreen Magazine Modal */}
            <MagazineModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                pdfUrl={magazine.pdf_url}
                title={magazine.title}
            />
        </>
    );
}

export default memo(MagazineFab);
