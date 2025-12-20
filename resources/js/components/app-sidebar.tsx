import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavGroup, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { 
    BookOpen, 
    Calendar, 
    FileText, 
    Folder,
    GraduationCap, 
    Home,
    Image, 
    LayoutGrid, 
    Megaphone, 
    MessageSquare, 
    School,
    Settings, 
    Shield,
    Trophy, 
    UserCheck,
    Users,
    Building2,
    Newspaper,
    Award,
    Dumbbell,
    Sparkles,
    Quote,
    Link as LinkIcon,
    IndianRupee,
    FileCheck,
    Handshake,
    UsersRound,
} from 'lucide-react';
import AppLogo from './app-logo';
import { useMemo } from 'react';

// Define nav items with their required permission
interface PermissionedNavItem extends NavItem {
    permission?: string;
}

const mainNavItems: PermissionedNavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
        permission: 'dashboard',
    },
];

// Content Management Navigation
const contentNavItems: PermissionedNavItem[] = [
    {
        title: 'Home Sliders',
        href: '/admin/sliders',
        icon: Image,
        permission: 'sliders',
    },
    {
        title: 'Quick Links',
        href: '/admin/quick-links',
        icon: LinkIcon,
        permission: 'quick_links',
    },
    {
        title: 'Affirmations',
        href: '/admin/affirmations',
        icon: Quote,
        permission: 'affirmations',
    },
];

// News & Events Navigation
const newsNavItems: PermissionedNavItem[] = [
    {
        title: 'News',
        href: '/admin/news',
        icon: Newspaper,
        permission: 'news',
    },
    {
        title: 'Events',
        href: '/admin/events',
        icon: Calendar,
        permission: 'events',
    },
    {
        title: 'Announcements',
        href: '/admin/announcements',
        icon: Megaphone,
        permission: 'announcements',
    },
];

// Academic Navigation
const academicNavItems: PermissionedNavItem[] = [
    {
        title: 'Departments',
        href: '/admin/departments',
        icon: Building2,
        permission: 'departments',
    },
    {
        title: 'Staff',
        href: '/admin/staff',
        icon: Users,
        permission: 'staff',
    },
    {
        title: 'Board Results',
        href: '/admin/board-results',
        icon: Trophy,
        permission: 'board_results',
    },
    {
        title: 'Achievements',
        href: '/admin/achievements',
        icon: Award,
        permission: 'achievements',
    },
];

// Student Life Navigation
const studentLifeNavItems: PermissionedNavItem[] = [
    {
        title: 'Houses',
        href: '/admin/houses',
        icon: Home,
        permission: 'houses',
    },
    {
        title: 'Clubs',
        href: '/admin/clubs',
        icon: Sparkles,
        permission: 'clubs',
    },
    {
        title: 'Alumni',
        href: '/admin/alumni',
        icon: GraduationCap,
        permission: 'alumni',
    },
];

// Admission Navigation
const admissionNavItems: PermissionedNavItem[] = [
    {
        title: 'Fee Structure',
        href: '/admin/fee-structures',
        icon: IndianRupee,
        permission: 'fee_structures',
    },
    {
        title: 'Transfer Certificates',
        href: '/admin/tc-records',
        icon: FileCheck,
        permission: 'tc_records',
    },
    {
        title: 'Mandatory Disclosures',
        href: '/admin/mandatory-disclosures',
        icon: FileText,
        permission: 'mandatory_disclosures',
    },
];

// Media Navigation
const mediaNavItems: PermissionedNavItem[] = [
    {
        title: 'Photo Albums',
        href: '/admin/albums',
        icon: Image,
        permission: 'albums',
    },
    {
        title: 'Documents',
        href: '/admin/documents',
        icon: Folder,
        permission: 'documents',
    },
];

// Interactions Navigation
const interactionNavItems: PermissionedNavItem[] = [
    {
        title: 'Contacts',
        href: '/admin/contacts',
        icon: MessageSquare,
        permission: 'contacts',
    },
    {
        title: 'Testimonials',
        href: '/admin/testimonials',
        icon: Quote,
        permission: 'testimonials',
    },
    {
        title: 'Partnerships',
        href: '/admin/partnerships',
        icon: Handshake,
        permission: 'partnerships',
    },
];

// Settings Navigation
const settingsNavItems: PermissionedNavItem[] = [
    {
        title: 'Site Settings',
        href: '/admin/settings',
        icon: Settings,
        permission: 'settings',
    },
    {
        title: 'Facilities',
        href: '/admin/facilities',
        icon: Building2,
        permission: 'facilities',
    },
    {
        title: 'Committees',
        href: '/admin/committees',
        icon: UsersRound,
        permission: 'committees',
    },
];

// Administration Navigation (Super Admin Only)
const adminNavItems: PermissionedNavItem[] = [
    {
        title: 'User Management',
        href: '/admin/users',
        icon: Shield,
        permission: 'users',
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'View Website',
        href: '/',
        icon: School,
    },
    {
        title: 'Documentation',
        href: '/docs',
        icon: BookOpen,
    },
];

// Navigation groups for organized sidebar
interface PermissionedNavGroup {
    title: string;
    items: PermissionedNavItem[];
}

const allNavGroups: PermissionedNavGroup[] = [
    { title: 'Main', items: mainNavItems },
    { title: 'Content', items: contentNavItems },
    { title: 'News & Events', items: newsNavItems },
    { title: 'Academics', items: academicNavItems },
    { title: 'Student Life', items: studentLifeNavItems },
    { title: 'Admission', items: admissionNavItems },
    { title: 'Media', items: mediaNavItems },
    { title: 'Interactions', items: interactionNavItems },
    { title: 'Settings', items: settingsNavItems },
    { title: 'Administration', items: adminNavItems },
];

// Helper function to check if user has permission
function hasPermission(permissions: string[], requiredPermission?: string): boolean {
    if (!requiredPermission) return true;
    if (permissions.includes('*')) return true; // Super admin wildcard
    return permissions.includes(requiredPermission);
}

// Hook to get filtered nav groups based on user permissions
function useFilteredNavGroups(): NavGroup[] {
    const { auth } = usePage<SharedData>().props;
    const permissions = auth?.permissions || [];

    return useMemo(() => {
        return allNavGroups
            .map((group) => ({
                title: group.title,
                items: group.items.filter((item) => 
                    hasPermission(permissions, item.permission)
                ),
            }))
            .filter((group) => group.items.length > 0);
    }, [permissions]);
}

// Export for external use (if needed)
export const sidebarNavGroups = allNavGroups;

export function AppSidebar() {
    const filteredNavGroups = useFilteredNavGroups();

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {filteredNavGroups.map((group) => (
                    <NavMain key={group.title} items={group.items} label={group.title} />
                ))}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
