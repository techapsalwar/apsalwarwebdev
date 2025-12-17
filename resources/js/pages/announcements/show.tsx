import PublicLayout from '@/layouts/public-layout';
import { Link } from '@inertiajs/react';
import { 
    Calendar, 
    ArrowLeft, 
    Share2, 
    ChevronRight, 
    ExternalLink, 
    Download, 
    Paperclip,
    LinkIcon,
    Clock,
    Users,
    AlertTriangle,
    Bell,
    Megaphone,
    Info,
    AlertCircle,
    BookOpen,
    UserPlus,
    ClipboardList,
    Trophy,
    PartyPopper,
    LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, LucideIcon> = {
    AlertTriangle,
    Bell,
    Megaphone,
    Info,
    AlertCircle,
    BookOpen,
    UserPlus,
    ClipboardList,
    Trophy,
    PartyPopper,
    Calendar,
};

interface Announcement {
    id: number;
    title: string;
    slug: string;
    content: string;
    type: string;
    priority: string;
    priority_color: string;
    type_color: string;
    priority_icon: string;
    type_icon: string;
    start_date: string | null;
    end_date: string | null;
    target_audience: string | null;
    link: string | null;
    attachment: string | null;
    created_at: string;
    updated_at: string;
}

interface RelatedAnnouncement {
    id: number;
    title: string;
    slug: string;
    type: string;
    priority: string;
    priority_color: string;
    created_at: string;
}

interface AnnouncementShowProps {
    announcement: Announcement;
    relatedAnnouncements: RelatedAnnouncement[];
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
    academic: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
    other: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
};

// Priority card backgrounds
const priorityCardStyles: Record<string, string> = {
    low: 'border-l-4 border-l-green-500',
    medium: 'border-l-4 border-l-blue-500',
    high: 'border-l-4 border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20',
    critical: 'border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-950/20',
};

export default function AnnouncementShow({ announcement, relatedAnnouncements }: AnnouncementShowProps) {
    // Handle case where announcement might not be loaded yet
    if (!announcement) {
        return (
            <PublicLayout title="Loading... - Army Public School Alwar">
                <div className="container mx-auto px-4 py-16 text-center">
                    <p className="text-gray-500">Loading...</p>
                </div>
            </PublicLayout>
        );
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: announcement.title,
                text: `${announcement.title} - Army Public School Alwar`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    // Get the correct icon component
    const PriorityIcon = iconMap[announcement.priority_icon] || Bell;
    const TypeIcon = iconMap[announcement.type_icon] || Bell;

    return (
        <PublicLayout title={`${announcement.title} - Army Public School Alwar`}>
            {/* Breadcrumb */}
            <section className="bg-gray-50 dark:bg-gray-900 py-4 border-b">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center text-sm text-gray-500">
                        <Link href="/" className="hover:text-amber-600">Home</Link>
                        <ChevronRight className="h-4 w-4 mx-2" />
                        <Link href="/announcements" className="hover:text-amber-600">Announcements</Link>
                        <ChevronRight className="h-4 w-4 mx-2" />
                        <span className="text-gray-900 dark:text-white truncate max-w-xs">
                            {announcement.title}
                        </span>
                    </nav>
                </div>
            </section>

            {/* Announcement Content */}
            <article className="py-12">
                <div className="container mx-auto px-4">
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            {/* Back button */}
                            <Button variant="ghost" size="sm" asChild className="mb-6">
                                <Link href="/announcements">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    All Announcements
                                </Link>
                            </Button>

                            {/* Main Card */}
                            <Card className={`${priorityCardStyles[announcement.priority]} overflow-hidden`}>
                                {/* Priority Banner for Critical */}
                                {announcement.priority === 'critical' && (
                                    <div className="bg-red-600 text-white px-4 py-2 flex items-center gap-2">
                                        <AlertTriangle className="h-5 w-5 animate-pulse" />
                                        <span className="font-semibold">Critical Announcement</span>
                                    </div>
                                )}
                                
                                <CardHeader className="pb-4">
                                    {/* Badges */}
                                    <div className="flex flex-wrap items-center gap-2 mb-4">
                                        <Badge className={typeColors[announcement.type] || typeColors.other}>
                                            <TypeIcon className="h-3 w-3 mr-1" />
                                            {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
                                        </Badge>
                                        <Badge className={priorityColors[announcement.priority] || priorityColors.medium}>
                                            <PriorityIcon className="h-3 w-3 mr-1" />
                                            {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)} Priority
                                        </Badge>
                                    </div>
                                    
                                    {/* Title */}
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                        {announcement.title}
                                    </h1>

                                    {/* Meta info */}
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-4">
                                        <div className="flex items-center">
                                            <Calendar className="mr-1 h-4 w-4" />
                                            {formatDate(announcement.created_at)}
                                        </div>
                                        {announcement.target_audience && announcement.target_audience !== 'all' && (
                                            <div className="flex items-center">
                                                <Users className="mr-1 h-4 w-4" />
                                                For: {announcement.target_audience.charAt(0).toUpperCase() + announcement.target_audience.slice(1)}
                                            </div>
                                        )}
                                        <Button 
                                            variant="ghost" 
                                            size="sm"
                                            onClick={handleShare}
                                            className="ml-auto"
                                        >
                                            <Share2 className="mr-2 h-4 w-4" />
                                            Share
                                        </Button>
                                    </div>
                                </CardHeader>

                                <CardContent>
                                    {/* Schedule Info */}
                                    {(announcement.start_date || announcement.end_date) && (
                                        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
                                            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-medium mb-2">
                                                <Clock className="h-4 w-4" />
                                                Schedule
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                {announcement.start_date && (
                                                    <div>
                                                        <span className="text-gray-500">From: </span>
                                                        <span className="font-medium">{formatDate(announcement.start_date)}</span>
                                                    </div>
                                                )}
                                                {announcement.end_date && (
                                                    <div>
                                                        <span className="text-gray-500">Until: </span>
                                                        <span className="font-medium">{formatDate(announcement.end_date)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-amber-600">
                                        <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                                            {announcement.content}
                                        </div>
                                    </div>

                                    {/* Attachments Section */}
                                    {(announcement.link || announcement.attachment) && (
                                        <>
                                            <Separator className="my-8" />
                                            <div className="space-y-4">
                                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                                    <Paperclip className="h-5 w-5" />
                                                    Attachments & Links
                                                </h3>

                                                {announcement.link && (
                                                    <a 
                                                        href={announcement.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-between rounded-lg border p-4 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                                                                <LinkIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium">External Link</p>
                                                                <p className="text-xs text-gray-500 truncate max-w-md">
                                                                    {announcement.link}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <ExternalLink className="h-5 w-5 text-blue-600" />
                                                    </a>
                                                )}

                                                {announcement.attachment && (
                                                    <div className="flex items-center justify-between rounded-lg border p-4 bg-green-50 dark:bg-green-950/30">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                                                                <Paperclip className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium">File Attachment</p>
                                                                <p className="text-xs text-gray-500">
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
                                                            <Button variant="default" size="sm" asChild className="bg-green-600 hover:bg-green-700">
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
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Info Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Quick Info</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Type</span>
                                        <Badge className={typeColors[announcement.type] || typeColors.other}>
                                            {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Priority</span>
                                        <Badge className={priorityColors[announcement.priority]}>
                                            {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Posted</span>
                                        <span className="text-sm font-medium">{formatDate(announcement.created_at)}</span>
                                    </div>
                                    {announcement.target_audience && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Audience</span>
                                            <span className="text-sm font-medium capitalize">{announcement.target_audience}</span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Related Announcements */}
                            {relatedAnnouncements && relatedAnnouncements.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Related Announcements</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {relatedAnnouncements.map((item) => (
                                            <Link 
                                                key={item.id}
                                                href={`/announcements/${item.slug}`}
                                                className="block p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                            >
                                                <div className="flex items-start gap-2">
                                                    <div className={`w-2 h-2 rounded-full mt-2 ${
                                                        item.priority_color === 'red' ? 'bg-red-500' :
                                                        item.priority_color === 'orange' ? 'bg-orange-500' :
                                                        item.priority_color === 'yellow' ? 'bg-yellow-500' :
                                                        'bg-green-500'
                                                    }`} />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium truncate">{item.title}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {formatDate(item.created_at)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}

                            {/* CTA */}
                            <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200">
                                <CardContent className="pt-6">
                                    <h3 className="font-semibold mb-2">Stay Updated</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        Check our announcements regularly for important updates and notices.
                                    </p>
                                    <Button asChild className="w-full bg-amber-600 hover:bg-amber-700">
                                        <Link href="/announcements">
                                            View All Announcements
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </article>
        </PublicLayout>
    );
}
