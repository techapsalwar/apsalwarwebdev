import PublicLayout from '@/layouts/public-layout';
import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { useRef, useState, useEffect, memo, useCallback, useMemo } from 'react';
import {
    ChevronRight,
    ChevronLeft,
    Users,
    GraduationCap,
    Trophy,
    BookOpen,
    Calendar,
    ArrowRight,
    Play,
    Quote,
    MapPin,
    Clock,
    Bell,
    LucideIcon,
    Sparkles,
    Sun,
    AlertTriangle,
    Megaphone,
    Info,
    ExternalLink,
    Paperclip,
    Star,
    Handshake,
    Shield,
    Target,
    Heart,
    Award,
    FileText,
    X,
    Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────
// Animation Variants (Optimized - reduced complexity)
// ─────────────────────────────────────────────────────────────
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const fadeInLeft = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const fadeInRight = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
};

const staggerItem = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

const scaleIn = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

// ─────────────────────────────────────────────────────────────
// Icon Mappings
// ─────────────────────────────────────────────────────────────
const iconMap: Record<string, LucideIcon> = {
    Users,
    GraduationCap,
    Trophy,
    BookOpen,
    Calendar,
};

const tickerIconMap: Record<string, LucideIcon> = {
    AlertTriangle,
    Bell,
    Megaphone,
    Info,
};

const tickerPriorityColors: Record<string, { bg: string; text: string; border: string }> = {
    critical: { bg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-800 dark:text-red-200', border: 'border-red-300' },
    high: { bg: 'bg-amber-100 dark:bg-amber-900/50', text: 'text-amber-800 dark:text-amber-200', border: 'border-amber-300' },
    medium: { bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-800 dark:text-blue-200', border: 'border-blue-300' },
    low: { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-800 dark:text-green-200', border: 'border-green-300' },
};

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
interface Slider {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    image: string;
    cta: { text: string; href: string };
}

interface Statistic {
    label: string;
    value: string;
    icon: string;
    color: string;
}

interface Announcement {
    id: number;
    title: string;
    slug: string;
    date: string;
    type: string;
    priority: string;
    priority_color: string;
    type_color: string;
    priority_icon: string;
    has_link: boolean;
    has_attachment: boolean;
}

interface Event {
    id: number;
    title: string;
    slug: string;
    date: string;
    time: string;
    location: string;
    registration_required: boolean;
    google_form_url: string | null;
}

interface News {
    id: number;
    title: string;
    excerpt: string;
    image: string;
    date: string;
    slug?: string;
}

interface Achievement {
    title: string;
    position: string;
    level: string;
    slug: string | null;
    image: string | null;
}

interface Testimonial {
    id: number;
    content: string;
    author: string;
    role: string;
    image: string | null;
}

interface PrincipalMessage {
    name: string;
    qualification: string;
    message: string;
    photo: string;
}

interface TodaysThought {
    quote: string;
    author: string | null;
    date: string;
}

interface Partnership {
    id: number;
    name: string;
    slug: string;
    logo: string | null;
    website: string | null;
    type: string;
    type_label: string;
    type_color: string;
}

interface MandatoryDisclosure {
    id: number;
    title: string;
    category: string | null;
    file_url: string;
}

interface HomeProps {
    sliders: Slider[];
    statistics: Statistic[];
    announcements: Announcement[];
    events: Event[];
    news: News[];
    achievements: Achievement[];
    testimonials: Testimonial[];
    principalMessage: PrincipalMessage;
    todaysThought: TodaysThought | null;
    partnerships: Partnership[];
    mandatoryDisclosures: MandatoryDisclosure[];
}

// ─────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────
const resolveImageUrl = (image?: string, defaultFolder = 'settings') => {
    if (!image) return '';
    if (image.startsWith('http') || image.startsWith('/')) return image;
    // If the path already includes a folder (contains /), use as-is
    // Otherwise, prepend the default folder for plain filenames
    const hasFolder = image.includes('/');
    const path = hasFolder ? image : `${defaultFolder}/${image}`;
    return `/storage/${path}`;
};

// Animated counter hook
function useAnimatedCounter(target: number, duration: number = 2000, inView: boolean = false) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!inView) return;

        let startTime: number;
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }, [target, duration, inView]);

    return count;
}

// Parse number from string like "1,046" or "55+"
function parseStatValue(value: string): { number: number; suffix: string } {
    const cleaned = value.replace(/,/g, '');
    const match = cleaned.match(/^(\d+)(.*)$/);
    if (match) {
        return { number: parseInt(match[1], 10), suffix: match[2] || '' };
    }
    return { number: 0, suffix: value };
}

// ─────────────────────────────────────────────────────────────
// Default Data
// ─────────────────────────────────────────────────────────────
const defaultSliders: Slider[] = [
    {
        id: 1,
        title: 'Welcome to Army Public School, Alwar',
        subtitle: 'A Happy Learner is a Motivated Learner',
        description: 'Nurturing excellence since 1981 with a perfect blend of academic excellence, discipline, and character building.',
        image: '/images/hero/slide1.jpg',
        cta: { text: 'Admission Now', href: 'https://erp.awesindia.edu.in/webinterface/searchschool' },
    },
    {
        id: 2,
        title: '100% Board Results',
        subtitle: 'API Score: 502.70 (Class XII)',
        description: 'Our students consistently achieve outstanding results in CBSE Board Examinations.',
        image: '/images/hero/slide2.jpg',
        cta: { text: 'View Results', href: '/academics/results' },
    },
    {
        id: 3,
        title: 'State-of-the-Art Facilities',
        subtitle: 'Modern Infrastructure',
        description: '38 Smart classrooms, 10 Labs, Science Park, Sports Complex, and more for holistic development.',
        image: '/images/hero/slide3.jpg',
        cta: { text: 'Take a Tour', href: '/facilities' },
    },
];

const defaultStatistics: Statistic[] = [
    { label: 'Students', value: '1,046', icon: 'Users', color: 'bg-blue-500' },
    { label: 'Expert Teachers', value: '55+', icon: 'GraduationCap', color: 'bg-green-500' },
    { label: 'Years of Excellence', value: '43+', icon: 'Trophy', color: 'bg-amber-500' },
    { label: 'Board Pass Rate', value: '100%', icon: 'BookOpen', color: 'bg-purple-500' },
];

// ─────────────────────────────────────────────────────────────
// Sub-Components
// ─────────────────────────────────────────────────────────────

// Animated Statistic Card
const StatCard = memo(function StatCard({ stat, index, inView }: { stat: Statistic; index: number; inView: boolean }) {
    const IconComponent = iconMap[stat.icon] || Users;
    const { number, suffix } = parseStatValue(stat.value);
    const animatedValue = useAnimatedCounter(number, 1500, inView);

    return (
        <motion.div
            variants={staggerItem}
            className="group flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 sm:gap-4 rounded-2xl bg-white/10 p-3 sm:p-4 backdrop-blur-sm transition-all hover:bg-white/20 text-center sm:text-left h-full"
        >
            <div className={cn('rounded-xl p-2 sm:p-3 shadow-lg shrink-0', stat.color)}>
                <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="min-w-0">
                <p className="text-xl sm:text-3xl font-bold text-white tabular-nums leading-tight truncate">
                    {inView ? animatedValue.toLocaleString() : 0}{suffix}
                </p>
                <p className="text-xs sm:text-base text-amber-100/90 leading-tight truncate px-1 sm:px-0">{stat.label}</p>
            </div>
        </motion.div>
    );
});

// Draggable Ticker Component
const DraggableTicker = ({ children, speed = 1 }: { children: React.ReactNode; speed?: number }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    const animationRef = useRef<number>(0);

    // Auto-scroll logic
    useEffect(() => {
        const container = containerRef.current;
        const content = contentRef.current;
        if (!container || !content) return;

        const scroll = () => {
            if (!isPaused && !isDragging) {
                if (container.scrollLeft >= content.scrollWidth / 2) {
                    container.scrollLeft = 0;
                } else {
                    container.scrollLeft += speed;
                }
            }
            animationRef.current = requestAnimationFrame(scroll);
        };

        animationRef.current = requestAnimationFrame(scroll);
        return () => cancelAnimationFrame(animationRef.current);
    }, [isPaused, isDragging, speed]);

    // Drag handlers
    const onMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        startX.current = e.pageX - (containerRef.current?.offsetLeft || 0);
        scrollLeft.current = containerRef.current?.scrollLeft || 0;
    };

    const onMouseLeave = () => {
        setIsDragging(false);
    };

    const onMouseUp = () => {
        setIsDragging(false);
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - (containerRef.current?.offsetLeft || 0);
        const walk = (x - startX.current) * 2; // Scroll-fast
        if (containerRef.current) {
            containerRef.current.scrollLeft = scrollLeft.current - walk;
        }
    };

    return (
        <div
            ref={containerRef}
            className="flex overflow-x-hidden cursor-grab active:cursor-grabbing select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => { setIsPaused(false); onMouseLeave(); }}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
        >
            <div ref={contentRef} className="flex gap-6 shrink-0 pr-6">
                {children}
            </div>
            <div className="flex gap-6 shrink-0 pr-6">
                {children}
            </div>
        </div>
    );
};

// Announcement Ticker Item
const TickerItem = memo(function TickerItem({ item }: { item: Announcement }) {
    const PriorityIcon = tickerIconMap[item.priority_icon] || Bell;
    const colors = tickerPriorityColors[item.priority] || tickerPriorityColors.medium;

    return (
        <Link
            href={`/announcements/${item.slug}`}
            className={cn(
                'inline-flex items-center gap-2 rounded-full border px-3 py-1.5',
                'transition-all duration-200 hover:scale-105 hover:shadow-md',
                colors.border, colors.bg, 'group'
            )}
        >
            <PriorityIcon className={cn('h-4 w-4 shrink-0', colors.text, item.priority === 'critical' && 'animate-pulse')} />
            <span className={cn('font-medium group-hover:underline', colors.text)}>{item.title}</span>
            <span className="flex items-center gap-1">
                {item.has_link && <ExternalLink className="h-3 w-3 text-blue-500" />}
                {item.has_attachment && <Paperclip className="h-3 w-3 text-green-500" />}
            </span>
            <span className="hidden sm:inline text-xs text-gray-500 dark:text-gray-400">({item.date})</span>
        </Link>
    );
});

const EventCard = memo(function EventCard({ event }: { event: Event }) {
    const [day, month] = event.date.split(' ');

    return (
        <motion.div variants={staggerItem} className="h-full">
            <Card className="h-full overflow-hidden border-l-4 border-l-amber-500 transition-shadow hover:shadow-lg group">
                <CardContent className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
                    {/* Date Badge */}
                    <div className="flex w-12 h-12 sm:w-16 sm:h-16 shrink-0 flex-col items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 text-amber-700 shadow-sm dark:from-amber-900/30 dark:to-orange-900/30 dark:text-amber-400">
                        <span className="text-lg sm:text-2xl font-bold leading-none">{day}</span>
                        <span className="text-[10px] sm:text-xs font-medium uppercase">{month}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <Link href={`/events/${event.slug}`} className="hover:text-amber-600 transition-colors block">
                            <h3 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white truncate pr-2">{event.title}</h3>
                        </Link>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-gray-500 mt-0.5">
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {event.time}
                            </span>
                            <span className="hidden sm:flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate">{event.location}</span>
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                        {event.registration_required && event.google_form_url && (
                            <>
                                <a href={event.google_form_url} target="_blank" rel="noopener noreferrer" className="sm:hidden">
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full">
                                        <ExternalLink className="h-4 w-4" />
                                    </Button>
                                </a>
                                <a href={event.google_form_url} target="_blank" rel="noopener noreferrer" className="hidden sm:block">
                                    <Button size="sm" className="bg-green-600 hover:bg-green-700 shadow-md shadow-green-600/20">
                                        Register
                                    </Button>
                                </a>
                            </>
                        )}
                        <Link href={`/events/${event.slug}`} className="hidden sm:block">
                            <Button variant="outline" size="sm">Details</Button>
                        </Link>
                        <Link href={`/events/${event.slug}`} className="sm:hidden text-gray-400 hover:text-amber-600 p-1">
                            <ChevronRight className="h-5 w-5" />
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
});

// News Card
const NewsCard = memo(function NewsCard({ news }: { news: News }) {
    return (
        <motion.div
            variants={staggerItem}
            className="flex-shrink-0 w-[300px] sm:w-[320px] md:w-[350px] snap-start"
        >
            <Card className="h-full overflow-hidden transition-all hover:shadow-xl group">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 overflow-hidden">
                    {news.image && (
                        <img
                            src={news.image}
                            alt={news.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    )}
                </div>
                <CardContent className="p-5">
                    <p className="mb-2 text-sm text-gray-500">{news.date}</p>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-amber-600 transition-colors">
                        {news.title}
                    </h3>
                    <p className="mb-4 text-gray-600 dark:text-gray-300 line-clamp-2">{news.excerpt}</p>
                    <Link
                        href={news.slug ? `/news/${news.slug}` : `/news/${news.id}`}
                        className="inline-flex items-center font-medium text-amber-600 hover:text-amber-700 group/link"
                    >
                        Read More
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                </CardContent>
            </Card>
        </motion.div>
    );
});

// Achievement Card
const AchievementCard = memo(function AchievementCard({ achievement }: { achievement: Achievement }) {
    const levelColors: Record<string, string> = {
        National: 'from-amber-400 to-yellow-500',
        International: 'from-purple-400 to-indigo-500',
        State: 'from-blue-400 to-indigo-500',
        Regional: 'from-green-400 to-emerald-500',
        District: 'from-purple-400 to-violet-500',
        School: 'from-green-400 to-teal-500',
    };

    const gradientClass = levelColors[achievement.level] || levelColors.School;

    const CardWrapper = achievement.slug ? Link : 'div';
    const cardProps = achievement.slug ? { href: `/achievements/${achievement.slug}` } : {};

    return (
        <motion.div variants={staggerItem}>
            <CardWrapper {...cardProps}>
                <Card className="group overflow-hidden text-center transition-all hover:shadow-xl cursor-pointer">
                    {achievement.image ? (
                        <div className="relative h-32 w-full overflow-hidden">
                            <img
                                src={`/storage/${achievement.image}`}
                                alt={achievement.title}
                                loading="lazy"
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        </div>
                    ) : null}
                    <CardContent className={achievement.image ? "pt-4" : "pt-6"}>
                        {!achievement.image && (
                            <div className={cn(
                                'mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg',
                                gradientClass
                            )}>
                                <Trophy className="h-8 w-8 text-white drop-shadow" />
                            </div>
                        )}
                        <Badge variant="outline" className="mb-2">{achievement.level}</Badge>
                        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-amber-600 transition-colors">{achievement.title}</h3>
                        <p className="text-amber-600 font-medium mt-1">{achievement.position}</p>
                    </CardContent>
                </Card>
            </CardWrapper>
        </motion.div>
    );
});

// Testimonial Card
const TestimonialCard = memo(function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
    return (
        <motion.div variants={staggerItem} className="h-full">
            <Card className="h-full bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all">
                <CardContent className="p-6 text-white">
                    <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                    </div>
                    <Quote className="h-8 w-8 mb-4 text-amber-200/50 scale-x-[-1]" />
                    <p className="mb-6 text-lg leading-relaxed text-white/90">"{testimonial.content}"</p>
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-200 to-orange-300 overflow-hidden ring-2 ring-white/20">
                            {testimonial.image ? (
                                <img src={testimonial.image} alt={testimonial.author} loading="lazy" className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-amber-700 font-bold">
                                    {testimonial.author.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="font-semibold">{testimonial.author}</p>
                            <p className="text-sm text-amber-200/80">{testimonial.role}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
});


// ─────────────────────────────────────────────────────────────
// Mandatory Disclosures Floating Panel
// ─────────────────────────────────────────────────────────────
const MandatoryDisclosuresPanel = memo(function MandatoryDisclosuresPanel({ 
    disclosures 
}: { 
    disclosures: MandatoryDisclosure[] 
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <>
            {/* Floating Button - Subtle on PC (partially hidden), Icon only on mobile */}
            <motion.button
                className="fixed right-0 top-2/5 -translate-y-1/2 z-40  bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-l-lg shadow-lg hover:shadow-xl px-2 py-6 md:px-2 md:py-2 flex items-center gap-2 cursor-pointer"
                style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                onClick={() => setIsOpen(true)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                animate={{ 
                    x: isHovered ? (typeof window !== 'undefined' && window.innerWidth >= 768 ? 'calc(100% - 40px)' : 0) : 0
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Open Mandatory Disclosures"
            >
                {/* Mobile: Icon only */}
                <FileText className="h-5 w-5 md:hidden" />
                {/* Desktop: Icon + Text */}
                <span className="hidden md:flex items-center gap-2 text-sm font-medium tracking-wide">
                    <FileText className="h-4 w-3 rotate-90" />
                    Mandatory Disclosures
                </span>
            </motion.button>

            {/* Slide-out Panel */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Panel */}
                        <motion.div
                            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-hidden"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        >
                            {/* Header */}
                            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-6 w-6" />
                                        <div>
                                            <h3 className="font-bold text-lg">Mandatory Disclosures</h3>
                                            <p className="text-sm text-blue-100">CBSE Compliance Documents</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                        aria-label="Close panel"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="overflow-y-auto h-[calc(100%-80px)] p-4">
                                <div className="space-y-3">
                                    {disclosures.map((disclosure, index) => (
                                        <motion.a
                                            key={disclosure.id}
                                            href={disclosure.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors group border border-gray-200 dark:border-gray-700"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                                <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    {disclosure.title}
                                                </p>
                                                {disclosure.category && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize mt-0.5">
                                                        {disclosure.category.replace(/_/g, ' ')}
                                                    </p>
                                                )}
                                            </div>
                                            <Download className="h-4 w-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-shrink-0" />
                                        </motion.a>
                                    ))}
                                </div>

                                {/* Footer Info */}
                                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <p className="text-sm text-blue-800 dark:text-blue-200">
                                        <strong>Note:</strong> These documents are made available as per CBSE guidelines for mandatory public disclosure.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
});


// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────
export default function Home() {
    const pageProps = usePage().props as unknown as HomeProps;

    // Data with fallbacks
    const sliders = pageProps.sliders?.length ? pageProps.sliders : defaultSliders;
    const statistics = pageProps.statistics?.length ? pageProps.statistics : defaultStatistics;
    const announcements = pageProps.announcements || [];
    const upcomingEvents = pageProps.events || [];
    const latestNews = pageProps.news || [];
    const achievements = pageProps.achievements || [];
    const testimonials = pageProps.testimonials || [];
    const partnerships = pageProps.partnerships || [];
    const mandatoryDisclosures = pageProps.mandatoryDisclosures || [];
    const principalMessage = pageProps.principalMessage || {
        name: 'Dr. Neera Pandey',
        qualification: 'M.A., M.Ed., PG (Yale)',
        message: 'At Army Public School Alwar, we believe in nurturing not just academically excellent students, but well-rounded individuals who are prepared to face the challenges of tomorrow.',
        photo: '/images/principal.jpg',
    };
    const principalPhoto = principalMessage.photo ? resolveImageUrl(principalMessage.photo) : '';
    const todaysThought = pageProps.todaysThought || null;

    // Slider state
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slideProgress, setSlideProgress] = useState(0);

    // Section refs for scroll animations
    const statsRef = useRef<HTMLDivElement>(null);
    const statsInView = useInView(statsRef, { once: true, margin: '-100px' });

    // Auto-advance slides with progress
    useEffect(() => {
        const duration = 5000;
        const interval = 50;
        let progress = 0;

        const timer = setInterval(() => {
            progress += (interval / duration) * 100;
            if (progress >= 100) {
                setCurrentSlide((prev) => (prev + 1) % sliders.length);
                progress = 0;
            }
            setSlideProgress(progress);
        }, interval);

        return () => clearInterval(timer);
    }, [sliders.length, currentSlide]);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        setSlideProgress(0);
    };

    const nextSlide = () => goToSlide((currentSlide + 1) % sliders.length);
    const prevSlide = () => goToSlide((currentSlide - 1 + sliders.length) % sliders.length);

    return (
        <PublicLayout title="Home - Army Public School Alwar">
            {/* ═══════════════════════════════════════════════════════════
                HERO SECTION - Optimized for instant loading & smooth transitions
            ═══════════════════════════════════════════════════════════ */}
            <section className="relative h-[85vh] min-h-[500px] max-h-[900px] overflow-hidden bg-gray-900">
                {/* Preload all images in hidden layer for instant switching */}
                <div className="hidden">
                    {sliders.map((slide, index) => (
                        <img 
                            key={`preload-${slide.id}`}
                            src={resolveImageUrl(slide.image)} 
                            alt="" 
                            loading={index === 0 ? "eager" : "lazy"}
                        />
                    ))}
                </div>

                {/* All slides rendered simultaneously - only opacity changes */}
                {sliders.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={cn(
                            "absolute inset-0 transition-opacity duration-700 ease-in-out",
                            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                        )}
                    >
                        {/* Background Image - CSS only, no motion for performance */}
                        <div 
                            className={cn(
                                "absolute inset-0 bg-cover bg-center transition-transform duration-[5000ms] ease-linear",
                                index === currentSlide ? "scale-105" : "scale-100"
                            )}
                            style={{ backgroundImage: `url(${resolveImageUrl(slide.image)})` }}
                        />
                        
                        {/* Overlays */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />

                        {/* Content - Only animate when active */}
                        <div className="container relative mx-auto flex h-full items-center px-4 sm:px-6">
                            <div 
                                className={cn(
                                    "max-w-2xl transition-all duration-500 ease-out",
                                    index === currentSlide 
                                        ? "opacity-100 translate-y-0" 
                                        : "opacity-0 translate-y-8"
                                )}
                                style={{ transitionDelay: index === currentSlide ? '200ms' : '0ms' }}
                            >
                                <Badge className="mb-4 bg-amber-500/90 text-white shadow-[0_4px_14px_rgba(245,158,11,0.4)] hover:bg-amber-600 border-0">
                                    {slide.subtitle}
                                </Badge>
                                <h1
                                    className="mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white"
                                    style={{
                                        textShadow: '0 2px 4px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.2), 0 8px 24px rgba(0,0,0,0.15)'
                                    }}
                                >
                                    {slide.title}
                                </h1>
                                <p
                                    className="mb-8 text-base sm:text-lg text-white/95 max-w-xl font-medium"
                                    style={{
                                        textShadow: '0 1px 3px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)'
                                    }}
                                >
                                    {slide.description}
                                </p>
                                <div className="flex flex-wrap gap-3 sm:gap-4">
                                    <Button
                                        size="lg"
                                        className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-[0_4px_20px_rgba(245,158,11,0.4),0_8px_32px_rgba(249,115,22,0.3)] hover:shadow-[0_6px_24px_rgba(245,158,11,0.5),0_12px_40px_rgba(249,115,22,0.4)] transition-shadow border-0"
                                        asChild
                                    >
                                        <Link href={slide.cta.href}>
                                            {slide.cta.text}
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Link>
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
                                    >
                                        <Play className="mr-2 h-5 w-5" />
                                        Watch Video
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Slider Controls */}
                <button
                    onClick={prevSlide}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/10 p-2 sm:p-3 text-white backdrop-blur-md hover:bg-white/20 hover:scale-110 active:scale-95 transition-all border border-white/10"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/10 p-2 sm:p-3 text-white backdrop-blur-md hover:bg-white/20 hover:scale-110 active:scale-95 transition-all border border-white/10"
                    aria-label="Next slide"
                >
                    <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>

                {/* Progress Indicators */}
                <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2 z-20">
                    {sliders.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={cn(
                                "relative h-1.5 overflow-hidden rounded-full transition-all duration-300",
                                index === currentSlide ? "w-12" : "w-3"
                            )}
                            aria-label={`Go to slide ${index + 1}`}
                        >
                            <div className="absolute inset-0 bg-white/30" />
                            {index === currentSlide && (
                                <div 
                                    className="absolute inset-y-0 left-0 bg-amber-500 transition-none"
                                    style={{ width: `${slideProgress}%` }}
                                />
                            )}
                        </button>
                    ))}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                STATISTICS SECTION - Floating over hero
            ═══════════════════════════════════════════════════════════ */}
            <section ref={statsRef} className="relative z-10 -mt-20 overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 p-6 sm:p-8 shadow-2xl">
                        <motion.div
                            className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
                            variants={staggerContainer}
                            initial="hidden"
                            animate={statsInView ? 'show' : 'hidden'}
                        >
                            {statistics.map((stat, index) => (
                                <StatCard key={stat.label} stat={stat} index={index} inView={statsInView} />
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                ANNOUNCEMENTS TICKER
            ═══════════════════════════════════════════════════════════ */}
            {announcements.length > 0 && (
                <section className="relative overflow-hidden border-y border-gray-200 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 py-4 dark:border-gray-700 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center gap-2 sm:gap-4">
                            <motion.div
                                className="flex shrink-0 items-center justify-center"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <Badge variant="destructive" className="flex items-center justify-center p-0 h-8 w-8 sm:h-auto sm:w-auto sm:px-3 sm:py-1.5 sm:gap-1.5 shadow-md rounded-full">
                                    <Bell className="h-4 w-4 animate-pulse" />
                                    <span className="hidden sm:inline text-sm font-semibold">Notices</span>
                                </Badge>
                            </motion.div>

                            <div className="relative flex-1 overflow-hidden mask-linear-gradient">
                                <div className="absolute bottom-0 left-0 top-0 z-10 w-4 sm:w-8 bg-gradient-to-r from-gray-100 to-transparent dark:from-gray-800 pointer-events-none" />
                                <div className="absolute bottom-0 right-0 top-0 z-10 w-4 sm:w-8 bg-gradient-to-l from-gray-100 to-transparent dark:from-gray-800 pointer-events-none" />

                                <DraggableTicker speed={window.innerWidth < 640 ? 1.5 : 0.8}>
                                    {announcements.map((item) => <TickerItem key={item.id} item={item} />)}
                                </DraggableTicker>
                            </div>

                            <Link
                                href="/announcements"
                                className="shrink-0 flex items-center justify-center h-8 w-8 sm:h-auto sm:w-auto sm:gap-1 text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400 p-0 sm:p-1 rounded-full hover:bg-amber-100/50 dark:hover:bg-amber-900/30 transition-colors"
                                aria-label="View all announcements"
                            >
                                <span className="hidden md:inline">View All</span>
                                <ChevronRight className="h-5 w-5 md:h-4 md:w-4" />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* ═══════════════════════════════════════════════════════════
                TODAY'S THOUGHT
            ═══════════════════════════════════════════════════════════ */}
            {todaysThought && (
                <motion.section
                    className="relative overflow-hidden bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 py-6 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-yellow-950/30"
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, margin: '-50px' }}
                    variants={fadeInUp}
                >
                    <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-amber-400 via-orange-400 to-amber-400" />
                    <motion.div
                        className="absolute -left-4 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-amber-200/30 blur-2xl"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    />
                    <motion.div
                        className="absolute -right-4 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-orange-200/30 blur-2xl"
                        animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    />

                    <div className="container mx-auto px-4">
                        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-8">
                            <div className="flex shrink-0 items-center gap-3">
                                <div className="relative">
                                    <motion.div
                                        className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-300/50"
                                        animate={{ rotate: [0, 5, 0, -5, 0] }}
                                        transition={{ duration: 6, repeat: Infinity }}
                                    >
                                        <Sun className="h-6 w-6 text-white" />
                                    </motion.div>
                                    <Sparkles className="absolute -right-1 -top-1 h-4 w-4 animate-bounce text-amber-500" />
                                </div>
                                <div className="text-left">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                                        Today's Thought
                                    </p>
                                    <p className="text-xs text-amber-500/70 dark:text-amber-500/50">{todaysThought.date}</p>
                                </div>
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <blockquote className="relative">
                                    <Quote className="absolute -left-2 -top-2 h-6 w-6 text-amber-300/50 dark:text-amber-700/50 scale-x-[-1]" />
                                    <p className="pl-6 text-lg font-medium italic text-gray-800 dark:text-gray-200 md:pl-4">
                                        {todaysThought.quote}
                                    </p>
                                </blockquote>
                                {todaysThought.author && (
                                    <p className="mt-2 pl-6 text-sm font-medium text-amber-700 dark:text-amber-400 md:pl-4">
                                        — {todaysThought.author}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.section>
            )}



            {/* ═══════════════════════════════════════════════════════════
                PRINCIPAL'S MESSAGE & EVENTS
            ═══════════════════════════════════════════════════════════ */}
            <section className="py-16 lg:py-24 overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                        {/* Principal's Message */}
                        <motion.div
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true, margin: '-100px' }}
                            variants={fadeInLeft}
                        >
                            <Badge className="mb-4 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                Welcome
                            </Badge>
                            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                                Principal's Message
                            </h2>
                            <div className="relative mb-6">
                                <Quote className="absolute -left-2 -top-2 h-10 w-10 text-amber-200 dark:text-amber-800 scale-x-[-1]" />
                                <p className="pl-8 text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg">
                                    {principalMessage.message}
                                </p>
                            </div>
                            <p className="mb-6 text-gray-600 dark:text-gray-300">
                                With state-of-the-art facilities, dedicated faculty, and a curriculum that balances
                                academics with co-curricular activities, we strive to bring out the best in every child.
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 overflow-hidden rounded-full bg-gradient-to-br from-gray-200 to-gray-300 ring-4 ring-amber-100 dark:from-gray-700 dark:to-gray-600 dark:ring-amber-900/30">
                                    {principalPhoto && (
                                        <img src={principalPhoto} alt={principalMessage.name} className="h-full w-full object-cover" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">{principalMessage.name}</p>
                                    <p className="text-sm text-gray-500">Principal, APS Alwar</p>
                                    <p className="text-xs text-gray-400">{principalMessage.qualification}</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Upcoming Events */}
                        <motion.div
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true, margin: '-100px' }}
                            variants={fadeInRight}
                        >
                            <Badge className="mb-4 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                Upcoming
                            </Badge>
                            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                                Events & Activities
                            </h2>
                            <div className="space-y-4">
                                {upcomingEvents.length > 0 ? (
                                    upcomingEvents.slice(0, 3).map((event) => <EventCard key={event.id} event={event} />)
                                ) : (
                                    <Card className="border-dashed">
                                        <CardContent className="py-8 text-center text-gray-500">
                                            <Calendar className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                                            No upcoming events at the moment.
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                            <Button variant="link" className="mt-4 px-0 text-amber-600 hover:text-amber-700" asChild>
                                <Link href="/events">
                                    View All Events
                                    <ArrowRight className="ml-1 h-4 w-4" />
                                </Link>
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                LATEST NEWS
            ═══════════════════════════════════════════════════════════ */}
            <section className="bg-gray-50 py-16 lg:py-24 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <div>
                            <Badge className="mb-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                Stay Updated
                            </Badge>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">Latest News</h2>
                        </div>
                        <Button variant="outline" className="h-12 px-6" asChild>
                            <Link href="/news">
                                View All News
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </motion.div>

                    <div className="relative">
                        <motion.div
                            className="scrollbar-thin flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:gap-6"
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                        >
                            {latestNews.length > 0 ? (
                                latestNews.map((news) => <NewsCard key={news.id} news={news} />)
                            ) : (
                                <p className="w-full py-8 text-center text-gray-500">No news articles available.</p>
                            )}
                        </motion.div>
                        {latestNews.length > 3 && (
                            <div className="pointer-events-none absolute bottom-4 right-0 top-0 hidden w-16 bg-gradient-to-l from-gray-50 to-transparent dark:from-gray-900 md:block" />
                        )}
                    </div>
                    {latestNews.length > 2 && (
                        <p className="mt-2 text-center text-sm text-gray-500 md:hidden">← Swipe to see more →</p>
                    )}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                ACHIEVEMENTS
            ═══════════════════════════════════════════════════════════ */}
            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="mb-8 text-center sm:mb-12"
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <Badge className="mb-2 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                            Our Pride
                        </Badge>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">Recent Achievements</h2>
                    </motion.div>

                    <motion.div
                        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: '-50px' }}
                    >
                        {achievements.length > 0 ? (
                            achievements.map((achievement, index) => (
                                <AchievementCard key={index} achievement={achievement} />
                            ))
                        ) : (
                            <p className="col-span-full py-8 text-center text-gray-500">No achievements to display.</p>
                        )}
                    </motion.div>

                    <motion.div
                        className="mt-8 text-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <Button className="h-12 px-6 bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-600/20" asChild>
                            <Link href="/achievements">
                                View All Achievements
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                TESTIMONIALS
            ═══════════════════════════════════════════════════════════ */}
            {testimonials.length > 0 && (
                <section className="relative overflow-hidden bg-gradient-to-br from-amber-600 via-amber-500 to-orange-500 py-16 lg:py-24 text-white">
                    {/* Decorative */}
                    <div className="absolute -left-20 top-20 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute -right-20 bottom-20 h-40 w-40 rounded-full bg-orange-400/20 blur-3xl" />

                    <div className="container relative mx-auto px-4">
                        <motion.div
                            className="mb-8 text-center sm:mb-12"
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                        >
                            <h2 className="text-2xl font-bold sm:text-3xl">What People Say</h2>
                            <p className="mt-2 text-amber-100/80">Testimonials from our community</p>
                        </motion.div>

                        <motion.div
                            className="grid gap-6 md:grid-cols-2"
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                        >
                            {testimonials.slice(0, 4).map((testimonial) => (
                                <motion.div key={testimonial.id} variants={staggerItem}>
                                    <TestimonialCard testimonial={testimonial} />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* ═══════════════════════════════════════════════════════════
                OUR PARTNERS
            ═══════════════════════════════════════════════════════════ */}
            {partnerships.length > 0 && (
                <section className="relative overflow-hidden bg-gray-50 py-16 lg:py-24 dark:bg-gray-900">
                    {/* Decorative Elements */}
                    <div className="absolute -left-20 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-amber-200/30 blur-3xl dark:bg-amber-900/20" />
                    <div className="absolute -right-20 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-orange-200/30 blur-3xl dark:bg-orange-900/20" />

                    <div className="container relative mx-auto px-4">
                        {/* Section Header */}
                        <motion.div
                            className="mb-10 text-center sm:mb-12"
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                        >
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                                <Handshake className="h-4 w-4" />
                                <span className="text-sm font-medium">Trusted Collaborations</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                                Our Partners
                            </h2>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Collaborating with industry leaders for excellence in education
                            </p>
                        </motion.div>

                        {/* Infinite Scroll Marquee */}
                        <div className="relative">
                            {/* Gradient Masks */}
                            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-900" />
                            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-gray-50 to-transparent dark:from-gray-900" />

                            {/* Scrolling Container */}
                            <div className="overflow-hidden">
                                <motion.div
                                    className="flex gap-8 py-4"
                                    animate={{
                                        x: [0, -50 * partnerships.length * 4],
                                    }}
                                    transition={{
                                        x: {
                                            repeat: Infinity,
                                            repeatType: 'loop',
                                            duration: partnerships.length * 5,
                                            ease: 'linear',
                                        },
                                    }}
                                >
                                    {/* Duplicate logos for seamless loop */}
                                    {[...partnerships, ...partnerships, ...partnerships, ...partnerships].map((partner, index) => (
                                        <motion.div
                                            key={`${partner.id}-${index}`}
                                            className="flex-shrink-0"
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            {partner.website ? (
                                                <a
                                                    href={partner.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group block"
                                                    title={partner.name}
                                                >
                                                    <div className="flex h-20 w-40 items-center justify-center rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:border-amber-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-amber-600">
                                                        {partner.logo ? (
                                                            <img
                                                                src={partner.logo}
                                                                alt={partner.name}
                                                                className="h-full max-h-12 w-auto max-w-full object-contain grayscale transition-all duration-300 group-hover:grayscale-0"
                                                            />
                                                        ) : (
                                                            <span className="text-center text-sm font-semibold text-gray-600 transition-colors group-hover:text-amber-600 dark:text-gray-400 dark:group-hover:text-amber-400">
                                                                {partner.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                </a>
                                            ) : (
                                                <div
                                                    className="flex h-20 w-40 items-center justify-center rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                                                    title={partner.name}
                                                >
                                                    {partner.logo ? (
                                                        <img
                                                            src={partner.logo}
                                                            alt={partner.name}
                                                            className="h-full max-h-12 w-auto max-w-full object-contain"
                                                        />
                                                    ) : (
                                                        <span className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400">
                                                            {partner.name}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        </div>

                        {/* Partner Types Legend */}
                        <motion.div
                            className="mt-8 flex flex-wrap justify-center gap-3"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                        >
                            {Array.from(new Set(partnerships.map(p => p.type_label))).map((label) => (
                                <Badge
                                    key={label}
                                    variant="secondary"
                                    className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                                >
                                    {label}
                                </Badge>
                            ))}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* ═══════════════════════════════════════════════════════════
                CTA SECTION
            ═══════════════════════════════════════════════════════════ */}
            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 text-center text-white sm:p-12 lg:rounded-3xl"
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={scaleIn}
                    >
                        {/* Animated gradient overlay */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.15),transparent_50%)]" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(249,115,22,0.1),transparent_50%)]" />

                        {/* Floating shapes */}
                        <motion.div
                            className="absolute left-10 top-10 h-20 w-20 rounded-full bg-amber-500/10 blur-xl"
                            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
                            transition={{ duration: 6, repeat: Infinity }}
                        />
                        <motion.div
                            className="absolute bottom-10 right-10 h-32 w-32 rounded-full bg-orange-500/10 blur-xl"
                            animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
                            transition={{ duration: 8, repeat: Infinity }}
                        />

                        <div className="relative">
                            <motion.h2
                                className="mb-4 text-2xl font-bold sm:text-3xl lg:text-4xl"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                            >
                                Ready to Join APS Alwar?
                            </motion.h2>
                            <motion.p
                                className="mx-auto mb-8 max-w-2xl text-base text-gray-300 sm:text-lg"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                            >
                                Admissions are now open for the academic year 2025-26. Give your child the gift of quality education.
                            </motion.p>
                            <motion.div
                                className="flex flex-wrap justify-center gap-4"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                            >
                                <Button
                                    size="lg"
                                    className="h-14 px-8 text-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg"
                                    asChild
                                >
                                    <Link href="/admissions">
                                        Apply Online
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-14 px-8 text-lg border-white/30 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10"
                                    asChild
                                >
                                    <Link href="/contact">Contact Us</Link>
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Floating Mandatory Disclosures Panel */}
            {mandatoryDisclosures.length > 0 && (
                <MandatoryDisclosuresPanel disclosures={mandatoryDisclosures} />
            )}
        </PublicLayout>
    );
}
