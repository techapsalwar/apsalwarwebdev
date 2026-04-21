import { memo, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

const MagazineFlipbook = lazy(() => import('./magazine-flipbook'));

interface MagazineModalProps {
    isOpen: boolean;
    onClose: () => void;
    pdfUrl: string;
    title: string;
}

function MagazineModal({ isOpen, onClose, pdfUrl, title }: MagazineModalProps) {
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Fullscreen backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/95 z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Fullscreen content — fills entire viewport */}
                    <motion.div
                        className="fixed inset-0 z-50 flex flex-col"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Close button — top-right, always visible */}
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors cursor-pointer"
                            aria-label="Close magazine viewer"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {/* Flipbook fills the rest */}
                        <div className="flex-1 flex items-center justify-center overflow-hidden px-2 pt-2 pb-1">
                            <Suspense
                                fallback={
                                    <div className="flex flex-col items-center justify-center gap-4">
                                        <div className="h-12 w-12 rounded-full border-4 border-white/10 border-t-emerald-400 animate-spin" />
                                        <p className="text-white/50 text-sm">Loading viewer…</p>
                                    </div>
                                }
                            >
                                <MagazineFlipbook
                                    pdfUrl={pdfUrl}
                                    title={title}
                                    onClose={onClose}
                                />
                            </Suspense>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default memo(MagazineModal);
