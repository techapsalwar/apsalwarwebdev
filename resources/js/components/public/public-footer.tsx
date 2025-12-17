import { Link, usePage } from '@inertiajs/react';
import {
    Phone,
    Mail,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    ArrowRight,
    Sparkles,
} from 'lucide-react';

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

export default function PublicFooter() {
    const { quickLinks: sharedQuickLinks, socialLinks: sharedSocialLinks } = usePage().props as { quickLinks?: QuickLinkItem[]; socialLinks?: Record<string, string> };
    const quickLinks = sharedQuickLinks && sharedQuickLinks.length > 0 ? sharedQuickLinks : fallbackQuickLinks;
    const currentYear = new Date().getFullYear();

    // Build social links from shared props
    const socialLinks = sharedSocialLinks ? [
        { icon: Facebook, href: sharedSocialLinks.social_facebook, label: 'Facebook' },
        { icon: Twitter, href: sharedSocialLinks.social_twitter, label: 'Twitter' },
        { icon: Instagram, href: sharedSocialLinks.social_instagram, label: 'Instagram' },
        { icon: Youtube, href: sharedSocialLinks.social_youtube, label: 'YouTube' },
    ].filter(link => link.href) : [];

    return (
        <footer className="bg-gray-900 text-gray-300">
            {/* Main Footer */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* School Info */}
                    <div>
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center overflow-hidden">
                                <img
                                    src="/favicon/android-chrome-192x192.png"
                                    alt="Army Public School Alwar Logo"
                                    className="h-12 w-12 object-contain"
                                />
                            </div>
                            <div>
                                <h3 className="text-lg font-extrabold tracking-wide uppercase">
                                    <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 bg-clip-text text-transparent">
                                        Army Public School
                                    </span>
                                </h3>
                                <p className="text-base font-black tracking-[0.15em] uppercase bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                                    Alwar
                                </p>
                            </div>
                        </div>
                        <p className="mb-4 text-sm leading-relaxed">
                            Established in 1997, Army Public School Alwar is committed to providing quality education
                            that nurtures young minds and prepares them for a bright future.
                        </p>
                        <div className="space-y-2">
                            <a href="tel:+911442750001" className="flex items-center gap-2 text-sm hover:text-amber-500">
                                <Phone className="h-4 w-4" />
                                +91-144-275-0001
                            </a>
                            <a href="mailto:info@apsalwar.edu.in" className="flex items-center gap-2 text-sm hover:text-amber-500">
                                <Mail className="h-4 w-4" />
                                info@apsalwar.edu.in
                            </a>
                            <p className="flex items-start gap-2 text-sm">
                                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                Near Military Station, Alwar, Rajasthan - 301001
                            </p>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold text-white">Quick Links</h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => {
                                const isExternal = link.url.startsWith('http://') || link.url.startsWith('https://');
                                const linkContent = (
                                    <>
                                        <ArrowRight className="h-3 w-3 flex-shrink-0" />
                                        <span className="flex items-center gap-2">
                                            {link.title}
                                            {link.is_new === true && (
                                                <span className="relative inline-flex items-center gap-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-lg shadow-amber-500/50">
                                                    <Sparkles className="h-2.5 w-2.5 animate-spin" style={{ animationDuration: '3s' }} />
                                                    <span className="animate-pulse">New</span>
                                                    <span className="absolute -inset-0.5 rounded-full bg-amber-400 opacity-30 animate-ping" />
                                                </span>
                                            )}
                                        </span>
                                    </>
                                );

                                return (
                                    <li key={link.id ?? link.url}>
                                        {isExternal ? (
                                            <a
                                                href={link.url}
                                                target={link.target || '_blank'}
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-sm hover:text-amber-500"
                                            >
                                                {linkContent}
                                            </a>
                                        ) : (
                                            <Link
                                                href={link.url}
                                                className="flex items-center gap-2 text-sm hover:text-amber-500"
                                            >
                                                {linkContent}
                                            </Link>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Academics */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold text-white">Academics</h3>
                        <ul className="space-y-2">
                            {academicLinks.map((link) => (
                                <li key={link.title}>
                                    <Link
                                        href={link.href}
                                        className="flex items-center gap-1 text-sm hover:text-amber-500"
                                    >
                                        <ArrowRight className="h-3 w-3" />
                                        {link.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Student Life */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold text-white">Student Life</h3>
                        <ul className="space-y-2">
                            {studentLifeLinks.map((link) => (
                                <li key={link.title}>
                                    <Link
                                        href={link.href}
                                        className="flex items-center gap-1 text-sm hover:text-amber-500"
                                    >
                                        <ArrowRight className="h-3 w-3" />
                                        {link.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Newsletter & Social */}
            <div className="border-t border-gray-800">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        {/* CBSE Info */}
                        <div className="text-sm">
                            <span className="font-medium text-amber-500">CBSE Affiliation No:</span> 1720036 |
                            <span className="ml-2 font-medium text-amber-500">School Code:</span> 20712
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-4">
                            <span className="text-sm">Follow Us:</span>
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-full bg-gray-800 p-2 hover:bg-amber-600"
                                    aria-label={social.label}
                                >
                                    <social.icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-800 bg-gray-950">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col items-center justify-between gap-3 text-sm md:flex-row">
                        <p>© {currentYear} Army Public School, Alwar. All Rights Reserved.</p>

                        {/* Developed by EnvoKlear */}
                        <a
                            href="https://envoklear.info"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-2 transition-all hover:opacity-90"
                        >
                            <span className="text-xs text-gray-400">Developed by</span>
                            <span className="flex items-center gap-1">
                                <img
                                    src="https://envoklear.info/envologocolour1.svg"
                                    alt="EnvoKlear"
                                    className="h-5 w-5 object-contain"
                                />
                                <span className="text-sm font-bold">
                                    <span className="text-white">Envo</span>
                                    <span className="text-[#00D26A]">Klear</span>
                                </span>
                            </span>
                        </a>

                        <div className="flex gap-4">
                            <Link href="/privacy-policy" className="hover:text-amber-500">Privacy Policy</Link>
                            <Link href="/terms" className="hover:text-amber-500">Terms of Use</Link>
                            <Link href="/sitemap" className="hover:text-amber-500">Sitemap</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
