import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    Users, 
    GraduationCap, 
    Trophy, 
    Calendar,
    FileText,
    Eye,
    TrendingUp,
    Clock,
    Bell,
    ArrowRight,
    Plus,
    School,
    Newspaper,
    LucideIcon,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
    Users,
    GraduationCap,
    Trophy,
    Calendar,
};

// Quick actions
const quickActions = [
    { title: 'Add News', href: '/admin/news/create', icon: Newspaper, color: 'text-blue-600' },
    { title: 'New Event', href: '/admin/events/create', icon: Calendar, color: 'text-green-600' },
    { title: 'Add Achievement', href: '/admin/achievements/create', icon: Trophy, color: 'text-amber-600' },
    { title: 'Upload Photos', href: '/admin/albums/create', icon: FileText, color: 'text-purple-600' },
];

interface Statistic {
    label: string;
    value: string;
    icon: string;
    color: string;
    trend: string | null;
}

interface PendingItem {
    label: string;
    count: number;
    href: string;
}

interface Activity {
    action: string;
    time: string;
    type: string;
}

interface ContentOverview {
    totalPages: number;
    publishedNews: number;
    photoAlbums: number;
    activeEvents: number;
}

interface SchoolInfo {
    academicSession: string;
    cbseAffiliation: string;
    classesOffered: string;
    boardResultPass: string;
}

interface DashboardProps {
    statistics: Statistic[];
    pendingItems: PendingItem[];
    recentActivities: Activity[];
    contentOverview: ContentOverview;
    schoolInfo: SchoolInfo;
}

export default function Dashboard() {
    const { statistics, pendingItems, recentActivities, contentOverview, schoolInfo } = usePage<{ 
        props: DashboardProps 
    }>().props as unknown as DashboardProps;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - APS Alwar Admin" />
            
            <div className="flex flex-col gap-6 p-6">
                {/* Welcome Section */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold tracking-tight">Welcome back, Admin!</h1>
                    <p className="text-muted-foreground">
                        Here's what's happening at APS Alwar today.
                    </p>
                </div>

                {/* Statistics Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {statistics?.map((stat) => {
                        const IconComponent = iconMap[stat.icon] || Users;
                        return (
                            <Card key={stat.label} className="relative overflow-hidden">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        {stat.label}
                                    </CardTitle>
                                    <div className={`rounded-full p-2 ${stat.color}`}>
                                        <IconComponent className="h-4 w-4 text-white" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-bold">{stat.value}</span>
                                        {stat.trend && (
                                            <Badge variant="secondary" className="text-green-600">
                                                <TrendingUp className="mr-1 h-3 w-3" />
                                                {stat.trend}
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Quick Actions */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Plus className="h-5 w-5" />
                                Quick Actions
                            </CardTitle>
                            <CardDescription>Common tasks you perform frequently</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-2">
                            {quickActions.map((action) => (
                                <Link
                                    key={action.title}
                                    href={action.href}
                                    className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent"
                                >
                                    <action.icon className={`h-5 w-5 ${action.color}`} />
                                    <span className="font-medium">{action.title}</span>
                                    <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
                                </Link>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Recent Activity
                            </CardTitle>
                            <CardDescription>Latest updates and changes</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivities?.map((activity, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{activity.action}</p>
                                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pending Items */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5" />
                                Requires Attention
                            </CardTitle>
                            <CardDescription>Items that need your review</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3">
                            {pendingItems?.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent"
                                >
                                    <span className="font-medium">{item.label}</span>
                                    <Badge variant={item.count > 0 ? "destructive" : "secondary"}>
                                        {item.count}
                                    </Badge>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Website Analytics Section */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Site Overview */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="h-5 w-5" />
                                Website Overview
                            </CardTitle>
                            <CardDescription>Public website status and content</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
                                    <p className="text-sm text-muted-foreground">Total Pages</p>
                                    <p className="text-2xl font-bold">{contentOverview?.totalPages ?? 0}</p>
                                </div>
                                <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950">
                                    <p className="text-sm text-muted-foreground">Published News</p>
                                    <p className="text-2xl font-bold">{contentOverview?.publishedNews ?? 0}</p>
                                </div>
                                <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-950">
                                    <p className="text-sm text-muted-foreground">Photo Albums</p>
                                    <p className="text-2xl font-bold">{contentOverview?.photoAlbums ?? 0}</p>
                                </div>
                                <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-950">
                                    <p className="text-sm text-muted-foreground">Active Events</p>
                                    <p className="text-2xl font-bold">{contentOverview?.activeEvents ?? 0}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* School Quick Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <School className="h-5 w-5" />
                                School at a Glance
                            </CardTitle>
                            <CardDescription>Key information displayed on website</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between rounded-lg border p-3">
                                    <span className="text-sm">Academic Session</span>
                                    <Badge>{schoolInfo?.academicSession ?? '2025-26'}</Badge>
                                </div>
                                <div className="flex items-center justify-between rounded-lg border p-3">
                                    <span className="text-sm">CBSE Affiliation</span>
                                    <Badge variant="secondary">{schoolInfo?.cbseAffiliation ?? '1780018'}</Badge>
                                </div>
                                <div className="flex items-center justify-between rounded-lg border p-3">
                                    <span className="text-sm">Classes Offered</span>
                                    <Badge variant="outline">{schoolInfo?.classesOffered ?? 'Nursery to XII'}</Badge>
                                </div>
                                <div className="flex items-center justify-between rounded-lg border p-3">
                                    <span className="text-sm">Board Results</span>
                                    <Badge className="bg-green-600">{schoolInfo?.boardResultPass ?? '100% Pass'}</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
