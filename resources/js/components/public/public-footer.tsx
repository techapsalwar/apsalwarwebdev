import { Link, usePage } from '@inertiajs/react';
import { motion } from 'motion/react';
import {
    Phone,
    Mail,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Sparkles,
    ChevronUp,
    ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickLinkItem {
    id: number;
    title: string;
    url: string;
    target: '_self' | '_blank';
    is_new?: boolean;
}

const fallbackQuickLinks: QuickLinkItem[] = [
    { id: 1, title: 'About Us', url: '/about', target: '_self' },
    { id: 2, title: 'Admissions', url: '/admissions', target: '_self' },
    { id: 3, title: 'Academics', url: '/academics', target: '_self' },
    { id: 4, title: 'Results', url: '/academics/results', target: '_self' },
    { id: 5, title: 'Downloads', url: '/downloads', target: '_self' },
    { id: 6, title: 'Contact', url: '/contact', target: '_self' },
];

const academicLinks = [
    { title: 'Curriculum', href: '/academics/curriculum' },
    { title: 'Faculty', href: '/academics/faculty' },
    { title: 'Departments', href: '/academics/departments' },
    { title: 'Academic Calendar', href: '/academics/calendar' },
    { title: 'Fee Structure', href: '/admissions/fee-structure' },
    { title: 'Transfer Certificate', href: '/admissions/transfer-certificate' },
];

const studentLifeLinks = [
    { title: 'Houses', href: '/student-life/houses' },
    { title: 'Clubs & Activities', href: '/student-life/clubs' },
    { title: 'Sports', href: '/student-life/sports' },
    { title: 'NCC', href: '/student-life/ncc' },
    { title: 'Events', href: '/student-life/events' },
    { title: 'Achievements', href: '/academics/achievements' },
];

// Animated link component with hover effects
function FooterLink({ 
    href, 
    children, 
    external = false,
    isNew = false,
}: { 
    href: string; 
    children: React.ReactNode; 
    external?: boolean;
    isNew?: boolean;
}) {
    const content = (
        <span className="group/link relative flex items-center gap-2 py-1.5 text-sm text-gray-400 transition-colors hover:text-white">
            <span className="flex h-1.5 w-1.5 rounded-full bg-gray-600 transition-all duration-300 group-hover/link:bg-amber-500 group-hover/link:shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
            <span className="transition-transform duration-200 group-hover/link:translate-x-0.5">
                {children}
            </span>
            {isNew && (
                <span className="relative inline-flex items-center gap-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-lg shadow-amber-500/30">
                    <Sparkles className="h-2 w-2" />
                    New
                </span>
            )}
            {external && (
                <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover/link:opacity-100" />
            )}
        </span>
    );

    if (external) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer">
                {content}
            </a>
        );
    }

    return <Link href={href}>{content}</Link>;
}

// Social icon with brand-colored hover effect
function SocialIcon({ 
    href, 
    icon: Icon, 
    label,
    color,
}: { 
    href: string; 
    icon: typeof Facebook; 
    label: string;
    color: string;
}) {
    return (
        <motion.a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "group relative flex h-10 w-10 items-center justify-center rounded-xl",
                "bg-white/5 backdrop-blur-sm border border-white/10",
                "transition-all duration-300 hover:border-transparent hover:shadow-lg"
            )}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            aria-label={label}
        >
            <div 
                className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: `linear-gradient(135deg, ${color}40, ${color}20)` }}
            />
            <Icon className="relative h-4 w-4 text-gray-400 transition-colors duration-300 group-hover:text-white" />
        </motion.a>
    );
}

export default function PublicFooter() {
    const { quickLinks: sharedQuickLinks, socialLinks: sharedSocialLinks } = usePage().props as { 
        quickLinks?: QuickLinkItem[]; 
        socialLinks?: Record<string, string>; 
    };
    const quickLinks = sharedQuickLinks && sharedQuickLinks.length > 0 ? sharedQuickLinks : fallbackQuickLinks;
    const currentYear = new Date().getFullYear();

    // Social links with brand colors
    const socialLinks = sharedSocialLinks ? [
        { icon: Facebook, href: sharedSocialLinks.social_facebook, label: 'Facebook', color: '#1877F2' },
        { icon: Twitter, href: sharedSocialLinks.social_twitter, label: 'Twitter', color: '#1DA1F2' },
        { icon: Instagram, href: sharedSocialLinks.social_instagram, label: 'Instagram', color: '#E4405F' },
        { icon: Youtube, href: sharedSocialLinks.social_youtube, label: 'YouTube', color: '#FF0000' },
    ].filter(link => link.href) : [];

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="relative overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950">
            {/* Decorative top border */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
            
            {/* Subtle dot pattern */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.02]">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                }} />
            </div>

            {/* Floating gradient orbs for depth */}
            <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-blue-500/10 blur-[100px]" />
            <div className="pointer-events-none absolute -right-40 bottom-40 h-80 w-80 rounded-full bg-amber-500/10 blur-[100px]" />

            {/* Main Footer Content */}
            <div className="relative">
                <div className="container mx-auto px-4 py-16">
                    <div className="grid gap-12 lg:grid-cols-12">
                        
                        {/* Brand Column */}
                        <div className="lg:col-span-4">
                            {/* Logo & Name */}
                            <div className="mb-6 flex items-center gap-4">
                                <div className="relative">
                                    <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-amber-500/20 to-blue-500/20 blur-lg" />
                                    <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-white/5 p-2 backdrop-blur-sm ring-1 ring-white/10">
                                        <img
                                            src="/favicon/android-chrome-192x192.png"
                                            alt="Army Public School Alwar"
                                            className="h-full w-full object-contain"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold tracking-wide">
                                        <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                                            Army Public School
                                        </span>
                                    </h3>
                                    <p className="text-sm font-bold tracking-[0.2em] uppercase bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">
                                        Alwar
                                    </p>
                                </div>
                            </div>

                            <p className="mb-6 text-sm leading-relaxed text-gray-400">
                                Established in 1997, Army Public School Alwar is committed to providing quality education
                                that nurtures young minds and prepares them for a bright future.
                            </p>

                            {/* Contact Cards */}
                            <div className="space-y-3">
                                <a 
                                    href="tel:+911442750001" 
                                    className="group flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10 transition-all hover:bg-white/10 hover:ring-amber-500/30"
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 transition-colors group-hover:bg-amber-500 group-hover:text-white">
                                        <Phone className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Call Us</p>
                                        <p className="text-sm font-medium text-white">0144-2980050</p>
                                    </div>
                                </a>
                                
                                <a 
                                    href="mailto:info@apsalwar.edu.in" 
                                    className="group flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10 transition-all hover:bg-white/10 hover:ring-amber-500/30"
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 transition-colors group-hover:bg-blue-500 group-hover:text-white">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Email Us</p>
                                        <p className="text-sm font-medium text-white">inquiry@apsalwar.edu.in</p>
                                    </div>
                                </a>

                                <div className="flex items-start gap-3 rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
                                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Visit Us</p>
                                        <p className="text-sm text-gray-300">Near Military Station, Alwar, Rajasthan - 301001</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Links Columns */}
                        <div className="grid gap-8 sm:grid-cols-3 lg:col-span-8">
                            {/* Quick Links */}
                            <div>
                                <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white">
                                    <span className="h-px w-4 bg-amber-500" />
                                    Quick Links
                                </h4>
                                <ul className="space-y-0.5">
                                    {quickLinks.map((link) => {
                                        const isExternal = link.url.startsWith('http://') || link.url.startsWith('https://');
                                        return (
                                            <li key={link.id ?? link.url}>
                                                <FooterLink 
                                                    href={link.url} 
                                                    external={isExternal}
                                                    isNew={link.is_new}
                                                >
                                                    {link.title}
                                                </FooterLink>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>

                            {/* Academics */}
                            <div>
                                <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white">
                                    <span className="h-px w-4 bg-blue-500" />
                                    Academics
                                </h4>
                                <ul className="space-y-0.5">
                                    {academicLinks.map((link) => (
                                        <li key={link.title}>
                                            <FooterLink href={link.href}>{link.title}</FooterLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Student Life */}
                            <div>
                                <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white">
                                    <span className="h-px w-4 bg-emerald-500" />
                                    Student Life
                                </h4>
                                <ul className="space-y-0.5">
                                    {studentLifeLinks.map((link) => (
                                        <li key={link.title}>
                                            <FooterLink href={link.href}>{link.title}</FooterLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Middle Bar - CBSE & Social */}
                <div className="border-t border-white/5">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                            {/* CBSE Credentials */}
                            <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
                                <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-1.5 ring-1 ring-amber-500/20">
                                    <span className="text-xs text-amber-400">CBSE Affiliation</span>
                                    <span className="text-sm font-bold text-white">1720036</span>
                                </div>
                                <div className="flex items-center gap-2 rounded-lg bg-blue-500/10 px-3 py-1.5 ring-1 ring-blue-500/20">
                                    <span className="text-xs text-blue-400">School Code</span>
                                    <span className="text-sm font-bold text-white">20712</span>
                                </div>
                            </div>

                            {/* Social Links */}
                            {socialLinks.length > 0 && (
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-500 uppercase tracking-wider">Follow Us</span>
                                    <div className="flex gap-2">
                                        {socialLinks.map((social) => (
                                            <SocialIcon
                                                key={social.label}
                                                href={social.href!}
                                                icon={social.icon}
                                                label={social.label}
                                                color={social.color}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar - Copyright */}
                <div className="border-t border-white/5 bg-black/20">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                            <p className="text-xs text-gray-500">
                                © {currentYear} Army Public School, Alwar. All Rights Reserved.
                            </p>

                            <a
                                href="https://envoklear.info"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 ring-1 ring-white/10 transition-all hover:bg-white/10 hover:ring-emerald-500/30"
                            >
                                <span className="text-[10px] uppercase tracking-wider text-gray-500">Developed by</span>
                                <span className="flex items-center gap-1.5">
                                    <img
                                        src="https://envoklear.info/envologocolour1.svg"
                                        alt="EnvoKlear"
                                        className="h-4 w-4 object-contain"
                                    />
                                    <span className="text-xs font-bold">
                                        <span className="text-white">Envo</span>
                                        <span className="text-[#00D26A]">Klear</span>
                                    </span>
                                </span>
                            </a>

                            <div className="flex items-center gap-1 text-xs">
                                <Link href="/privacy-policy" className="px-2 py-1 text-gray-500 transition-colors hover:text-white">Privacy</Link>
                                <span className="text-gray-700">•</span>
                                <Link href="/terms" className="px-2 py-1 text-gray-500 transition-colors hover:text-white">Terms</Link>
                                <span className="text-gray-700">•</span>
                                <Link href="/sitemap" className="px-2 py-1 text-gray-500 transition-colors hover:text-white">Sitemap</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back to Top Button */}
            <motion.button
                onClick={scrollToTop}
                className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30 ring-2 ring-white/20 transition-shadow hover:shadow-xl hover:shadow-amber-500/40"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                aria-label="Back to top"
            >
                <ChevronUp className="h-5 w-5" />
            </motion.button>
        </footer>
    );
}
