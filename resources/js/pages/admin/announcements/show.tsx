import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit, Calendar, Clock, Users, LinkIcon, Paperclip, ExternalLink, Download, Megaphone, AlertTriangle, Bell, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { type BreadcrumbItem } from '@/types';

interface Announcement {
    id: number;
    title: string;
    content: string;
    type: string;
    priority: string;
    is_active: boolean;
    show_in_ticker: boolean;
    start_date: string;
    end_date: string | null;
    target_audience: string | null;
    link: string | null;
    attachment: string | null;
    created_at: string;
    updated_at: string;
}

interface AnnouncementsShowProps {
    announcement: Announcement;
}

// Priority color classes for badges
const priorityColors: Record<string, string> = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200',
    medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200',
    high: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 border-amber-200',
    critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200',
};

// Type color classes for badges
const typeColors: Record<string, string> = {
    general: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
    important: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    event: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    holiday: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    admission: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
    exam: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    result: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    other: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
};

// Priority card backgrounds
const priorityCardStyles: Record<string, string> = {
    low: 'border-l-4 border-l-green-500',
    medium: 'border-l-4 border-l-blue-500',
    high: 'border-l-4 border-l-amber-500',
    critical: 'border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-950/20',
};

// Priority icons
const getPriorityIcon = (priority: string) => {
    switch (priority) {
        case 'critical':
            return <AlertTriangle className="h-5 w-5 text-red-500" />;
        case 'high':
            return <Bell className="h-5 w-5 text-amber-500" />;
        case 'medium':
            return <Megaphone className="h-5 w-5 text-blue-500" />;
        default:
            return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
};

export default function AnnouncementsShow({ announcement }: AnnouncementsShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Announcements', href: '/admin/announcements' },
        { title: announcement.title, href: `/admin/announcements/${announcement.id}` },
    ];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const isExpired = announcement.end_date && new Date(announcement.end_date) < new Date();
    const isScheduled = new Date(announcement.start_date) > new Date();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${announcement.title} - APS Alwar Admin`} />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/admin/announcements">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div className="flex items-center gap-3">
                            {getPriorityIcon(announcement.priority)}
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">{announcement.title}</h1>
                                <p className="text-muted-foreground">
                                    View announcement details
                                </p>
                            </div>
                        </div>
                    </div>
                    <Button asChild className="bg-amber-600 hover:bg-amber-700">
                        <Link href={`/admin/announcements/${announcement.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Announcement
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className={priorityCardStyles[announcement.priority]}>
                            <CardHeader>
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <Badge className={typeColors[announcement.type] || typeColors.other}>
                                        {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
                                    </Badge>
                                    <Badge className={priorityColors[announcement.priority] || priorityColors.medium}>
                                        {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)} Priority
                                    </Badge>
                                    {!announcement.is_active && (
                                        <Badge variant="secondary">Inactive</Badge>
                                    )}
                                    {announcement.show_in_ticker && (
                                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                            Ticker
                                        </Badge>
                                    )}
                                    {isExpired && (
                                        <Badge variant="destructive">Expired</Badge>
                                    )}
                                    {isScheduled && (
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                            Scheduled
                                        </Badge>
                                    )}
                                </div>
                                <CardTitle className="text-xl">{announcement.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    <div className="whitespace-pre-wrap text-foreground">
                                        {announcement.content}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Attachments */}
                        {(announcement.link || announcement.attachment) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Attachments</CardTitle>
                                    <CardDescription>
                                        Links and files attached to this announcement.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {announcement.link && (
                                        <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/30">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                                                    <LinkIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">External Link</p>
                                                    <p className="text-xs text-muted-foreground truncate max-w-md">
                                                        {announcement.link}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm" asChild>
                                                <a 
                                                    href={announcement.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <ExternalLink className="h-4 w-4 mr-1" />
                                                    Open Link
                                                </a>
                                            </Button>
                                        </div>
                                    )}

                                    {announcement.attachment && (
                                        <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/30">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                                                    <Paperclip className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">File Attachment</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {announcement.attachment.split('/').pop()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <a 
                                                        href={`/storage/${announcement.attachment}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <ExternalLink className="h-4 w-4 mr-1" />
                                                        View
                                                    </a>
                                                </Button>
                                                <Button variant="outline" size="sm" asChild>
                                                    <a 
                                                        href={`/storage/${announcement.attachment}`}
                                                        download
                                                    >
                                                        <Download className="h-4 w-4 mr-1" />
                                                        Download
                                                    </a>
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Start Date</p>
                                        <p className="text-sm font-medium">{formatDate(announcement.start_date)}</p>
                                    </div>
                                </div>

                                {announcement.end_date && (
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">End Date</p>
                                            <p className="text-sm font-medium">{formatDate(announcement.end_date)}</p>
                                        </div>
                                    </div>
                                )}

                                <Separator />

                                <div className="flex items-center gap-3">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Target Audience</p>
                                        <p className="text-sm font-medium capitalize">
                                            {announcement.target_audience || 'All'}
                                        </p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex items-center gap-3">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Created</p>
                                        <p className="text-sm font-medium">{formatDateTime(announcement.created_at)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Last Updated</p>
                                        <p className="text-sm font-medium">{formatDateTime(announcement.updated_at)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Active</span>
                                    <Badge variant={announcement.is_active ? 'default' : 'secondary'}>
                                        {announcement.is_active ? 'Yes' : 'No'}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Show in Ticker</span>
                                    <Badge variant={announcement.show_in_ticker ? 'default' : 'secondary'}>
                                        {announcement.show_in_ticker ? 'Yes' : 'No'}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Priority</span>
                                    <Badge className={priorityColors[announcement.priority]}>
                                        {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <div className="flex flex-col gap-2">
                            <Button asChild className="bg-amber-600 hover:bg-amber-700">
                                <Link href={`/admin/announcements/${announcement.id}/edit`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Announcement
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/admin/announcements">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to List
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
