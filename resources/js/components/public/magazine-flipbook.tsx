import { forwardRef, useRef, useState, useEffect, useCallback, memo, useMemo } from 'react';
import HTMLFlipBook from 'react-pageflip';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString();

interface MagazineFlipbookProps {
    pdfUrl: string;
    title: string;
    onClose: () => void;
}

// Individual page component (must use forwardRef for react-pageflip)
const Page = forwardRef<HTMLDivElement, { pageImage: string; pageNumber: number }>(
    ({ pageImage, pageNumber }, ref) => (
        <div ref={ref} className="page-content bg-white">
            <img
                src={pageImage}
                alt={`Page ${pageNumber}`}
                className="w-full h-full object-contain"
                draggable={false}
            />
        </div>
    )
);
Page.displayName = 'Page';

function MagazineFlipbook({ pdfUrl, title, onClose }: MagazineFlipbookProps) {
    const [pages, setPages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadProgress, setLoadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const bookRef = useRef<any>(null);

    // Detect portrait (mobile/small) vs landscape (desktop/tablet)
    const [isPortrait, setIsPortrait] = useState(false);
    const [dimensions, setDimensions] = useState({ width: 500, height: 707 });

    useEffect(() => {
        const update = () => {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const portrait = vw < 768;
            setIsPortrait(portrait);

            if (portrait) {
                // Mobile: single-page, fill width, leave room for controls
                const w = Math.min(vw - 32, 440);
                const h = Math.min(Math.round(w * 1.414), vh - 120);
                setDimensions({ width: w, height: h });
            } else {
                // Desktop/tablet: 2-page spread — each page is half the book width
                // Maximize height first, then derive page width from A4 ratio
                const availH = vh - 100; // room for thin controls bar
                const availW = vw - 64;  // side margins
                const pageH = Math.min(availH, 900);
                const pageW = Math.round(pageH / 1.414);
                // If two pages side-by-side exceed available width, scale down
                const twoPageW = pageW * 2;
                if (twoPageW > availW) {
                    const scale = availW / twoPageW;
                    setDimensions({
                        width: Math.round(pageW * scale),
                        height: Math.round(pageH * scale),
                    });
                } else {
                    setDimensions({ width: pageW, height: pageH });
                }
            }
        };

        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    // Load PDF and render pages to images
    useEffect(() => {
        let cancelled = false;

        async function loadPdf() {
            try {
                setLoading(true);
                setError(null);
                setLoadProgress(0);

                const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
                const numPages = pdf.numPages;
                setTotalPages(numPages);

                const pageImages: string[] = [];
                // High-quality render: scale so the rendered image is ~1600px wide
                const scale = 2.5;

                for (let i = 1; i <= numPages; i++) {
                    if (cancelled) return;

                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale });

                    const canvas = document.createElement('canvas');
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;

                    const ctx = canvas.getContext('2d');
                    if (!ctx) continue;

                    await page.render({ canvasContext: ctx, canvas, viewport }).promise;

                    pageImages.push(canvas.toDataURL('image/jpeg', 0.88));
                    canvas.remove();

                    if (!cancelled) {
                        setLoadProgress(Math.round((i / numPages) * 100));
                    }
                }

                if (!cancelled) {
                    setPages(pageImages);
                    setLoading(false);
                }
            } catch (err) {
                if (!cancelled) {
                    console.error('Failed to load PDF:', err);
                    setError('Failed to load magazine. Please try again.');
                    setLoading(false);
                }
            }
        }

        loadPdf();
        return () => { cancelled = true; };
    }, [pdfUrl]);

    const handleFlip = useCallback((e: any) => {
        setCurrentPage(e.data);
    }, []);

    const flipPrev = useCallback(() => {
        bookRef.current?.pageFlip()?.flipPrev();
    }, []);

    const flipNext = useCallback(() => {
        bookRef.current?.pageFlip()?.flipNext();
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') flipPrev();
            else if (e.key === 'ArrowRight') flipNext();
            else if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [flipPrev, flipNext, onClose]);

    // Page display text (accounts for 2-page spread)
    const pageDisplay = useMemo(() => {
        if (totalPages === 0) return '';
        if (isPortrait) {
            return `${currentPage + 1} / ${totalPages}`;
        }
        // In 2-page spread: page 0 = cover (single), then pairs
        const left = currentPage + 1;
        const right = Math.min(currentPage + 2, totalPages);
        if (left === right || currentPage === 0) {
            return `${left} / ${totalPages}`;
        }
        return `${left}-${right} / ${totalPages}`;
    }, [currentPage, totalPages, isPortrait]);

    // ── Loading state ──
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center gap-5 h-full min-h-[300px]">
                <div className="relative h-14 w-14">
                    <div className="absolute inset-0 rounded-full border-4 border-white/10" />
                    <div
                        className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-400 animate-spin"
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-white/70 text-xs font-medium">
                        {loadProgress}%
                    </span>
                </div>
                <p className="text-white/60 text-sm">Preparing pages…</p>
            </div>
        );
    }

    // ── Error state ──
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 h-full min-h-[300px]">
                <p className="text-red-400">{error}</p>
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors"
                >
                    Close
                </button>
            </div>
        );
    }

    if (pages.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 h-full min-h-[300px]">
                <p className="text-white/50">No pages found.</p>
            </div>
        );
    }

    // ── Flipbook viewer ──
    return (
        <div className="flex flex-col items-center justify-center h-full w-full select-none">
            {/* Flipbook area — takes up maximum space */}
            <div className="flex-1 flex items-center justify-center w-full">
                <HTMLFlipBook
                    ref={bookRef}
                    width={dimensions.width}
                    height={dimensions.height}
                    size="stretch"
                    minWidth={260}
                    maxWidth={dimensions.width}
                    minHeight={370}
                    maxHeight={dimensions.height}
                    showCover={true}
                    drawShadow={true}
                    maxShadowOpacity={isPortrait ? 0.3 : 0.5}
                    flippingTime={700}
                    usePortrait={isPortrait}
                    mobileScrollSupport={false}
                    onFlip={handleFlip}
                    className="magazine-flipbook"
                    style={{}}
                    startPage={0}
                    autoSize={true}
                    clickEventForward={true}
                    useMouseEvents={true}
                    swipeDistance={20}
                    showPageCorners={true}
                    disableFlipByClick={false}
                    startZIndex={0}
                    renderOnlyPageLengthChange={false}
                >
                    {pages.map((pageImage, index) => (
                        <Page key={index} pageImage={pageImage} pageNumber={index + 1} />
                    ))}
                </HTMLFlipBook>
            </div>

            {/* Compact bottom controls bar */}
            <div className="flex items-center justify-center gap-3 py-2 w-full max-w-md mx-auto">
                {/* Prev */}
                <button
                    onClick={flipPrev}
                    disabled={currentPage <= 0}
                    className="p-2 rounded-full bg-white/8 hover:bg-white/15 text-white/70 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                    aria-label="Previous page"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Page indicator */}
                <span className="text-white/50 text-xs font-medium tabular-nums min-w-[70px] text-center">
                    {pageDisplay}
                </span>

                {/* Next */}
                <button
                    onClick={flipNext}
                    disabled={currentPage >= totalPages - 1}
                    className="p-2 rounded-full bg-white/8 hover:bg-white/15 text-white/70 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                    aria-label="Next page"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                {/* Divider */}
                <div className="w-px h-4 bg-white/10" />

                {/* Title — subtle, truncated */}
                <span className="text-white/30 text-xs truncate max-w-[140px] md:max-w-[200px]" title={title}>
                    {title}
                </span>
            </div>

            {/* Keyboard hint — desktop only, fades out */}
            <p className="hidden md:block text-white/20 text-[10px] pb-1 animate-pulse">
                ← → to flip &nbsp;·&nbsp; ESC to close
            </p>
        </div>
    );
}

export default memo(MagazineFlipbook);
