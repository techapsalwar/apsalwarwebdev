import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
    Menu,
    X,
    ChevronDown,
    ChevronRight,
    Phone,
    Mail,
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    ExternalLink,
    GraduationCap,
    Search,
    Building2,
    Users,
    BookOpen,
    Trophy,
    Camera,
    MessageSquare,
    FileText,
    Calendar,
    Award,
    Sparkles,
    Shield,
    Heart,
    Landmark,
    type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ThemeToggle from '@/components/theme-toggle';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
interface NavChild {
    title: string;
    href: string;
    description?: string;
    icon?: LucideIcon;
}

interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon;
    children?: NavChild[];
    featured?: {
        title: string;
        description: string;
        image: string;
        href: string;
    };
}

// ─────────────────────────────────────────────────────────────
// Animation Variants
// ─────────────────────────────────────────────────────────────
const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
};

const staggerItem = {
    hidden: { opacity: 0, y: 10 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring' as const, stiffness: 400, damping: 28 },
    },
};

const mobileOverlayVariants = {
    hidden: { opacity: 0, x: '100%' },
    visible: {
        opacity: 1,
        x: 0,
        transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
    },
    exit: {
        opacity: 0,
        x: '100%',
        transition: { duration: 0.25, ease: 'easeInOut' as const },
    },
};

const mobileItemVariants = {
    hidden: { opacity: 0, x: 40 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: { delay: i * 0.05, type: 'spring' as const, stiffness: 300, damping: 24 },
    }),
};

// ─────────────────────────────────────────────────────────────
// Navigation Data with Icons
// ─────────────────────────────────────────────────────────────
const navigationItems: NavItem[] = [
    {
        title: 'Home',
        href: '/',
    },
    {
        title: 'About',
        href: '/about',
        icon: Building2,
        featured: {
            title: 'Our Legacy',
            description: 'Nurturing excellence since 1981 with discipline, values, and academic brilliance.',
            image: '/images/hero/slide1.jpg',
            href: '/about',
        },
        children: [
            { title: 'School Overview', href: '/about', description: 'Learn about our legacy', icon: Landmark },
            { title: "Principal's Message", href: '/about/principal-message', description: 'Words of wisdom', icon: MessageSquare },
            { title: 'Vision & Mission', href: '/about/vision-mission', description: 'Our guiding principles', icon: Sparkles },
            { title: 'Management', href: '/about/management', description: 'Leadership team', icon: Shield },
            { title: 'Infrastructure', href: '/facilities', description: 'World-class facilities', icon: Building2 },
            { title: 'History', href: '/about/history', description: 'Our journey', icon: Award },
        ],
    },
    {
        title: 'Academics',
        href: '/academics',
        icon: BookOpen,
        featured: {
            title: '100% Board Results',
            description: 'Our students consistently achieve outstanding results in CBSE examinations.',
            image: '/images/hero/slide2.jpg',
            href: '/academics/results',
        },
        children: [
            { title: 'Curriculum', href: '/academics/curriculum', description: 'CBSE curriculum', icon: BookOpen },
            { title: 'Departments', href: '/academics/departments', description: 'Subject specializations', icon: Users },
            { title: 'Faculty', href: '/academics/faculty', description: 'Expert educators', icon: GraduationCap },
            { title: 'Board Results', href: '/academics/results', description: 'Stellar performance', icon: Trophy },
            { title: 'Academic Calendar', href: '/academics/calendar', description: 'Important dates', icon: Calendar },
        ],
    },
    {
        title: 'Admissions',
        href: '/admissions',
        icon: FileText,
        children: [
            { title: 'Admission Process', href: '/admissions', description: 'Step-by-step guide', icon: FileText },
            { title: 'Fee Structure', href: '/admissions/fee-structure', description: 'Transparent pricing', icon: FileText },
            { title: 'Apply Online', href: '/admissions/apply', description: 'Start your journey', icon: ExternalLink },
            { title: 'Transfer Certificate', href: '/admissions/transfer-certificate', description: 'Verify & Download TC', icon: FileText },
        ],
    },
    {
        title: 'Student Life',
        href: '/student-life',
        icon: Heart,
        children: [
            { title: 'Houses', href: '/beyond-academics/houses', description: 'House system', icon: Shield },
            { title: 'Clubs & Activities', href: '/student-life/clubs', description: 'Extra-curriculars', icon: Sparkles },
            { title: 'Sports', href: '/student-life/sports', description: 'Athletic excellence', icon: Trophy },
            { title: 'NCC', href: '/student-life/ncc', description: 'National Cadet Corps', icon: Shield },
            { title: 'Events', href: '/student-life/events', description: 'Memorable moments', icon: Calendar },
        ],
    },
    {
        title: 'Media',
        href: '/gallery',
        icon: Camera,
        children: [
            { title: 'Photo Albums', href: '/albums', description: 'School memories', icon: Camera },
            { title: 'Video Gallery', href: '/gallery/videos', description: 'Watch our story', icon: Camera },
            { title: 'News & Media', href: '/news', description: 'Latest updates', icon: FileText },
            { title: 'Downloads', href: '/downloads', description: 'Documents & Circulars', icon: FileText },
        ],
    },
    {
        title: 'Contact',
        href: '/contact',
    },
];

// ─────────────────────────────────────────────────────────────
// Magnetic Link Component
// ─────────────────────────────────────────────────────────────
function MagneticLink({
    children,
    href,
    className,
    isActive,
}: {
    children: React.ReactNode;
    href: string;
    className?: string;
    isActive?: boolean;
}) {
    const ref = useRef<HTMLAnchorElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 300, damping: 20 });
    const springY = useSpring(y, { stiffness: 300, damping: 20 });

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set((e.clientX - centerX) * 0.15);
        y.set((e.clientY - centerY) * 0.15);
    }, [x, y]);

    const handleMouseLeave = useCallback(() => {
        x.set(0);
        y.set(0);
    }, [x, y]);

    return (
        <motion.div style={{ x: springX, y: springY }}>
            <Link
                ref={ref}
                href={href}
                className={cn(
                    'relative inline-flex items-center px-3 py-2 text-sm font-medium transition-colors',
                    'text-slate-700 dark:text-slate-200',
                    'hover:text-amber-600 dark:hover:text-amber-400',
                    isActive && 'text-amber-600 dark:text-amber-400',
                    className
                )}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {children}
                {/* Active indicator */}
                {isActive && (
                    <motion.span
                        layoutId="activeIndicator"
                        className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                )}
            </Link>
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────
// Mega Menu Component
// ─────────────────────────────────────────────────────────────
function MegaMenu({ item, isOpen, onClose }: { item: NavItem; isOpen: boolean; onClose: () => void }) {
    if (!item.children) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed left-1/2 z-50 w-screen max-w-6xl -translate-x-1/2 px-4 top-[76px]"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    onMouseLeave={onClose}
                >
                    <motion.div
                        className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/95"
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className={cn(
                            "grid gap-0",
                            item.featured ? "grid-cols-3" : "grid-cols-1"
                        )}>
                            {/* Links Column */}
                            <motion.div
                                className="col-span-2 p-6"
                                variants={staggerContainer}
                                initial="hidden"
                                animate="show"
                            >
                                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    {item.title}
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    {item.children.map((child) => {
                                        const Icon = child.icon;
                                        return (
                                            <motion.div key={child.href} variants={staggerItem}>
                                                <Link
                                                    href={child.href}
                                                    className="group flex items-start gap-3 rounded-xl p-3 transition-all hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-amber-950/40 dark:hover:to-orange-950/40"
                                                    onClick={onClose}
                                                >
                                                    {Icon && (
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-all group-hover:bg-amber-100 group-hover:text-amber-600 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-amber-900/50 dark:group-hover:text-amber-400">
                                                            <Icon className="h-5 w-5" />
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-slate-900 transition-colors group-hover:text-amber-600 dark:text-slate-100 dark:group-hover:text-amber-400">
                                                            {child.title}
                                                        </p>
                                                        {child.description && (
                                                            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                                                                {child.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-slate-300 opacity-0 transition-all group-hover:translate-x-1 group-hover:text-amber-500 group-hover:opacity-100" />
                                                </Link>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>

                            {/* Featured Column */}
                            {item.featured && (
                                <motion.div
                                    className="relative overflow-hidden border-l border-slate-100 bg-gradient-to-br from-slate-50 to-slate-100 p-6 dark:border-slate-800 dark:from-slate-800/50 dark:to-slate-900/50"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <Link
                                        href={item.featured.href}
                                        className="group block"
                                        onClick={onClose}
                                    >
                                        <div className="mb-4 overflow-hidden rounded-xl">
                                            <motion.img
                                                src={item.featured.image}
                                                alt={item.featured.title}
                                                className="aspect-video w-full object-cover"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                                            Featured
                                        </p>
                                        <h3 className="mt-1 font-semibold text-slate-900 transition-colors group-hover:text-amber-600 dark:text-white dark:group-hover:text-amber-400">
                                            {item.featured.title}
                                        </h3>
                                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                            {item.featured.description}
                                        </p>
                                    </Link>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────
export default function PublicHeader() {
    const { url, props } = usePage();
    const sharedSocialLinks = (props as any)?.socialLinks;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null);
    const [topBarVisible, setTopBarVisible] = useState(true);
    const [isMdScreen, setIsMdScreen] = useState(false);
    const lastScrollY = useRef(0);

    const socialLinks = sharedSocialLinks ? [
        { icon: Facebook, href: sharedSocialLinks.social_facebook, label: 'Facebook' },
        { icon: Twitter, href: sharedSocialLinks.social_twitter, label: 'Twitter' },
        { icon: Instagram, href: sharedSocialLinks.social_instagram, label: 'Instagram' },
        { icon: Youtube, href: sharedSocialLinks.social_youtube, label: 'YouTube' },
    ].filter(link => link.href) : [];

    // Track screen size for responsive navigation shift
    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 768px)');
        setIsMdScreen(mediaQuery.matches);

        const handleResize = (e: MediaQueryListEvent) => setIsMdScreen(e.matches);
        mediaQuery.addEventListener('change', handleResize);
        return () => mediaQuery.removeEventListener('change', handleResize);
    }, []);

    // Track scroll for top bar hide on scroll down
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Hide top bar when scrolling down
            if (currentScrollY > lastScrollY.current && currentScrollY > 60) {
                setTopBarVisible(false);
            } else if (currentScrollY < lastScrollY.current) {
                setTopBarVisible(true);
            }
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock body scroll when mobile menu open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    const isActive = (href: string) => {
        if (!url) return false;
        if (href === '/') return url === '/';
        return url.startsWith(href);
    };

    return (
        <>
            <motion.header
                className="sticky top-0 z-50 w-full"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            >
                {/* Top Bar - Minimal Utility Strip */}
                <motion.div
                    className="relative hidden overflow-hidden border-b border-orange-500/20 bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 text-white shadow-md md:block dark:border-orange-900/50"
                    initial={{ y: 0 }}
                    animate={{ y: topBarVisible ? 0 : -40, opacity: topBarVisible ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="container mx-auto flex items-center justify-between px-4 py-1.5 text-xs font-medium">
                        <div className="flex items-center gap-4">
                            <a
                                href="tel:+911442750001"
                                className="flex items-center gap-1.5 transition-colors hover:text-orange-100 hover:scale-105 active:scale-95"
                            >
                                <Phone className="h-3 w-3" />
                                <span>0144-2980050</span>
                            </a>
                            <span className="hidden h-3 w-px bg-white/30 sm:block" />
                            <a
                                href="mailto:info@apsalwar.edu.in"
                                className="hidden items-center gap-1.5 transition-colors hover:text-orange-100 hover:scale-105 active:scale-95 sm:flex"
                            >
                                <Mail className="h-3 w-3" />
                                <span>inquiry@apsalwar.edu.in</span>
                            </a>
                        </div>

                        <div className="flex items-center gap-3">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="rounded-full p-1 text-white/90 transition-colors hover:bg-white/20 hover:text-white"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <social.icon className="h-3.5 w-3.5" />
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Main Navigation - Always Floating Pill */}
                <motion.div
                    className="mx-4 mt-2 rounded-2xl border border-white/40 bg-white/80 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/60 dark:border-slate-700/50 dark:bg-slate-950/80 dark:shadow-slate-950/50 dark:supports-[backdrop-filter]:bg-slate-950/60"
                    style={{ boxShadow: '0 20px 50px -12px rgba(0, 0, 0, 0.15)' }}
                    animate={{ y: isMdScreen && !topBarVisible ? -40 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="container mx-auto px-2">
                        <div className="flex h-16 items-center justify-between">
                            {/* Logo */}
                            <Link href="/" className="group flex items-center gap-2 sm:gap-4">
                                {/* Logo without background - larger and prominent */}
                                <motion.div
                                    className="relative flex shrink-0 items-center justify-center"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                                >
                                    <img
                                        src="/favicon/android-chrome-192x192.png"
                                        alt="Army Public School Alwar"
                                        className="h-10 w-10 object-contain drop-shadow-md sm:h-12 sm:w-12"
                                    />
                                </motion.div>

                                {/* Mobile School Name - Compact */}
                                <div className="flex flex-col sm:hidden">
                                    <span className="text-sm font-black uppercase tracking-tight text-slate-800 dark:text-white">
                                        Army Public School
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <motion.span
                                            className="h-px w-4 bg-gradient-to-r from-transparent via-amber-400 to-amber-500 origin-left"
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ duration: 0.5, delay: 0.2 }}
                                        />
                                        <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-xs font-extrabold uppercase tracking-[0.15em] text-transparent">
                                            Alwar
                                        </span>
                                        <motion.span
                                            className="h-px w-4 bg-gradient-to-l from-transparent via-amber-400 to-amber-500 origin-right"
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ duration: 0.5, delay: 0.2 }}
                                        />
                                        <span className="rounded border border-slate-300 px-1 py-0.5 text-[7px] font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-600 dark:text-slate-400">
                                            1981
                                        </span>
                                    </div>
                                </div>

                                {/* Desktop School Name - Bold Military Aesthetic with Gradient */}
                                <div className="group/logo hidden flex-col sm:flex">
                                    {/* ARMY PUBLIC SCHOOL - Animated Gradient Text */}
                                    <div className="flex items-center gap-2">
                                        <span className="relative text-xl font-black uppercase tracking-[0.08em]">
                                            <span className="bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800 bg-[length:200%_100%] bg-clip-text text-transparent transition-all duration-500 group-hover/logo:animate-shimmer dark:from-white dark:via-slate-300 dark:to-white">
                                                Army Public School
                                            </span>
                                        </span>
                                    </div>

                                    {/* ALWAR - Enhanced Gold Gradient with Animated Lines */}
                                    <div className="flex items-center gap-2">
                                        <motion.span
                                            className="h-px flex-1 max-w-8 bg-gradient-to-r from-transparent via-amber-400 to-amber-500 origin-left"
                                            whileHover={{ scaleX: 1.2 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                        <span className="relative overflow-hidden">
                                            <span className="bg-gradient-to-r from-amber-500 via-orange-400 to-amber-600 bg-[length:200%_100%] bg-clip-text text-lg font-extrabold uppercase tracking-[0.25em] text-transparent transition-all duration-500 group-hover/logo:bg-[position:100%_0]">
                                                Alwar
                                            </span>
                                            {/* Subtle shimmer overlay on hover */}
                                            <motion.span
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                                                whileHover={{ translateX: '100%' }}
                                                transition={{ duration: 0.6 }}
                                            />
                                        </span>
                                        <motion.span
                                            className="h-px flex-1 max-w-8 bg-gradient-to-l from-transparent via-amber-400 to-amber-500 origin-right"
                                            whileHover={{ scaleX: 1.2 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                        <span className="ml-1 rounded border border-slate-300/80 bg-gradient-to-br from-slate-50 to-slate-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-slate-600 shadow-sm transition-all group-hover/logo:border-amber-300/50 group-hover/logo:shadow-amber-100 dark:border-slate-600 dark:from-slate-800 dark:to-slate-900 dark:text-slate-400 dark:group-hover/logo:border-amber-700/50">
                                            Est. 1981
                                        </span>
                                    </div>
                                </div>
                            </Link>

                            {/* Desktop Navigation */}
                            <nav className="hidden items-center gap-1 lg:flex">
                                {navigationItems.map((item) =>
                                    item.children ? (
                                        <div
                                            key={item.title}
                                            className="relative"
                                            onMouseEnter={() => setActiveMenu(item.title)}
                                            onMouseLeave={() => setActiveMenu(null)}
                                        >
                                            <motion.button
                                                className={cn(
                                                    'flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                                    'text-slate-700 hover:bg-slate-100 hover:text-amber-600 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-amber-400',
                                                    activeMenu === item.title && 'bg-slate-100 text-amber-600 dark:bg-slate-800 dark:text-amber-400'
                                                )}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                {item.title}
                                                <motion.div
                                                    animate={{ rotate: activeMenu === item.title ? 180 : 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <ChevronDown className="h-4 w-4 opacity-60" />
                                                </motion.div>
                                            </motion.button>
                                            <MegaMenu
                                                item={item}
                                                isOpen={activeMenu === item.title}
                                                onClose={() => setActiveMenu(null)}
                                            />
                                        </div>
                                    ) : (
                                        <MagneticLink
                                            key={item.title}
                                            href={item.href}
                                            isActive={isActive(item.href)}
                                        >
                                            {item.title}
                                        </MagneticLink>
                                    )
                                )}
                            </nav>

                            {/* CTA Buttons */}
                            <div className="hidden items-center gap-2 lg:flex">
                                {/* Theme Toggle */}
                                <ThemeToggle />

                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        asChild
                                        className="gap-1.5 text-slate-600 hover:text-amber-600 dark:text-slate-400"
                                    >
                                        <Link href="/alumni">
                                            <GraduationCap className="h-4 w-4" />
                                            Alumni Portal
                                        </Link>
                                    </Button>
                                </motion.div>

                                {/* Apply Now with Pulse */}
                                <motion.div
                                    className="relative"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {/* Pulse ring - Subtle */}
                                    <motion.span
                                        className="absolute inset-0 rounded-xl bg-amber-400"
                                        initial={{ opacity: 0, scale: 1 }}
                                        animate={{ opacity: [0.3, 0], scale: [1, 1.15] }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "easeOut" }}
                                    />
                                    <Button
                                        size="sm"
                                        className="relative gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 font-semibold shadow-lg shadow-amber-500/25 transition-all hover:from-amber-600 hover:to-orange-600 hover:shadow-xl hover:shadow-amber-500/30"
                                        asChild
                                    >
                                        <a
                                            href="https://erp.awesindia.edu.in/webinterface/searchschool"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Apply Now
                                            <ExternalLink className="h-3.5 w-3.5" />
                                        </a>
                                    </Button>
                                </motion.div>
                            </div>

                            {/* Mobile Menu Button */}
                            <motion.button
                                type="button"
                                className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition-colors hover:bg-slate-100 lg:hidden dark:text-slate-200 dark:hover:bg-slate-800"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                aria-expanded={mobileMenuOpen}
                                aria-label="Toggle menu"
                            >
                                <AnimatePresence mode="wait">
                                    {mobileMenuOpen ? (
                                        <motion.div
                                            key="close"
                                            initial={{ rotate: -90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: 90, opacity: 0 }}
                                            transition={{ duration: 0.15 }}
                                        >
                                            <X className="h-5 w-5" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="menu"
                                            initial={{ rotate: 90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: -90, opacity: 0 }}
                                            transition={{ duration: 0.15 }}
                                        >
                                            <Menu className="h-5 w-5" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </motion.header>

            {/* Full-Screen Mobile Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        className="fixed inset-0 z-[60] overflow-y-auto bg-white lg:hidden dark:bg-slate-950"
                        variants={mobileOverlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Mobile Header */}
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/95">
                            <Link href="/" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                                <img
                                    src="/favicon/android-chrome-192x192.png"
                                    alt="Army Public School Alwar"
                                    className="h-12 w-12 object-contain drop-shadow-md"
                                />
                                <div className="flex flex-col">
                                    <span className="font-black uppercase tracking-wide text-slate-800 dark:text-white">
                                        Army Public School
                                    </span>
                                    <span className="text-sm font-extrabold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
                                        Alwar
                                    </span>
                                </div>
                            </Link>
                            <motion.button
                                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                                onClick={() => setMobileMenuOpen(false)}
                                whileTap={{ scale: 0.9 }}
                            >
                                <X className="h-5 w-5" />
                            </motion.button>
                        </div>

                        {/* Search Bar */}
                        <div className="border-b border-slate-200 p-4 dark:border-slate-800">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="search"
                                    placeholder="Search..."
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm placeholder:text-slate-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Navigation Items */}
                        <nav className="p-4">
                            {navigationItems.map((item, index) => (
                                <motion.div
                                    key={item.title}
                                    custom={index}
                                    variants={mobileItemVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {item.children ? (
                                        <div className="border-b border-slate-100 py-2 dark:border-slate-800">
                                            <button
                                                onClick={() =>
                                                    setExpandedMobileItem(
                                                        expandedMobileItem === item.title ? null : item.title
                                                    )
                                                }
                                                className="flex w-full items-center justify-between py-3 text-left font-medium text-slate-900 dark:text-white"
                                            >
                                                <span className="flex items-center gap-3">
                                                    {item.icon && <item.icon className="h-5 w-5 text-slate-400" />}
                                                    {item.title}
                                                </span>
                                                <motion.div
                                                    animate={{ rotate: expandedMobileItem === item.title ? 180 : 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <ChevronDown className="h-5 w-5 text-slate-400" />
                                                </motion.div>
                                            </button>
                                            <AnimatePresence>
                                                {expandedMobileItem === item.title && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="space-y-1 pb-3 pl-8">
                                                            {item.children.map((child) => (
                                                                <Link
                                                                    key={child.href}
                                                                    href={child.href}
                                                                    className="flex items-center gap-2 rounded-lg py-2 text-sm text-slate-600 transition-colors hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400"
                                                                    onClick={() => setMobileMenuOpen(false)}
                                                                >
                                                                    {child.icon && <child.icon className="h-4 w-4" />}
                                                                    {child.title}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                'flex items-center gap-3 border-b border-slate-100 py-5 font-medium dark:border-slate-800',
                                                isActive(item.href)
                                                    ? 'text-amber-600 dark:text-amber-400'
                                                    : 'text-slate-900 dark:text-white'
                                            )}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {item.title}
                                        </Link>
                                    )}
                                </motion.div>
                            ))}
                        </nav>

                        {/* Mobile CTA */}
                        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
                            {/* Theme Toggle for Mobile */}
                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Theme</span>
                                <ThemeToggle />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button variant="outline" className="w-full justify-center gap-2" asChild>
                                    <Link href="/alumni" onClick={() => setMobileMenuOpen(false)}>
                                        <GraduationCap className="h-4 w-4" />
                                        Alumni Portal
                                    </Link>
                                </Button>
                                <Button
                                    className="w-full justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500"
                                    asChild
                                >
                                    <a
                                        href="https://erp.awesindia.edu.in/webinterface/searchschool"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Apply Now
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                </Button>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex justify-center gap-4 py-6">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-amber-100 hover:text-amber-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-amber-900/50 dark:hover:text-amber-400"
                                >
                                    <social.icon className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
