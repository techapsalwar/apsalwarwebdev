import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { 
    ArrowLeft, 
    Edit, 
    Calendar, 
    Clock, 
    MapPin, 
    Star, 
    ExternalLink,
    User,
    Mail,
    Phone,
    Users,
    FileSpreadsheet,
} from 'lucide-react';
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

interface EventItem {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    short_description: string | null;
    content: string | null;
    event_type: string | null;
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    start_date: string;
    end_date: string | null;
    start_time: string | null;
    end_time: string | null;
    venue: string | null;
    organizer: string | null;
    contact_email: string | null;
    contact_phone: string | null;
    registration_required: boolean;
    registration_link: string | null;
    registration_deadline: string | null;
    max_participants: number | null;
    current_participants: number;
    google_form_url: string | null;
    google_sheet_url: string | null;
    is_featured: boolean;
    featured_image: string | null;
    created_at: string;
    updated_at: string;
}

interface EventShowProps {
    item: EventItem;
}

const statusColors: Record<string, string> = {
    upcoming: 'bg-blue-100 text-blue-800',
    ongoing: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
};

const eventTypeLabels: Record<string, string> = {
    academic: 'Academic',
    cultural: 'Cultural',
    sports: 'Sports',
    annual: 'Annual',
    competition: 'Competition',
    workshop: 'Workshop',
    celebration: 'Celebration',
    meeting: 'Meeting',
    other: 'Other',
};

export default function EventShow({ item }: EventShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Events', href: '/admin/events' },
        { title: item.title, href: `/admin/events/${item.id}` },
    ];

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (timeString: string | null) => {
        if (!timeString) return null;
        try {
            // Handle HH:mm:ss or HH:mm format
            const [hours, minutes] = timeString.split(':');
            const date = new Date();
            date.setHours(parseInt(hours), parseInt(minutes));
            return date.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
        } catch {
            return timeString;
        }
    };

    const formatDateTime = (dateString: string | null) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const featuredImageUrl = item.featured_image
        ? item.featured_image.startsWith('http')
            ? item.featured_image
            : `/storage/${item.featured_image}`
        : null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${item.title} - APS Alwar Admin`} />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/admin/events">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold">{item.title}</h1>
                                {item.is_featured && (
                                    <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                                )}
                            </div>
                            <p className="text-muted-foreground">Event Details</p>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href={`/admin/events/${item.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Event
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Featured Image */}
                        {featuredImageUrl && (
                            <Card>
                                <CardContent className="p-0">
                                    <img
                                        src={featuredImageUrl}
                                        alt={item.title}
                                        className="w-full rounded-lg object-cover max-h-96"
                                    />
                                </CardContent>
                            </Card>
                        )}

                        {/* Event Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Description</CardTitle>
                                {item.short_description && (
                                    <CardDescription className="text-base">
                                        {item.short_description}
                                    </CardDescription>
                                )}
                            </CardHeader>
                            <CardContent>
                                {item.description ? (
                                    <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
                                        {item.description}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">No description provided.</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Registration Information */}
                        {item.registration_required && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Registration Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Registration Status</p>
                                            <Badge className="mt-1 bg-green-100 text-green-800">Required</Badge>
                                        </div>
                                        {item.max_participants && (
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Capacity</p>
                                                <p className="mt-1">
                                                    {item.current_participants || 0} / {item.max_participants} participants
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {item.registration_deadline && (
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Registration Deadline</p>
                                            <p className="mt-1">{formatDateTime(item.registration_deadline)}</p>
                                        </div>
                                    )}

                                    <Separator />

                                    <div className="space-y-2">
                                        {item.google_form_url && (
                                            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
                                                <div className="flex items-center gap-2">
                                                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                                    <span className="font-medium">Google Form (Student Registration)</span>
                                                </div>
                                                <Button variant="outline" size="sm" asChild>
                                                    <a href={item.google_form_url} target="_blank" rel="noopener noreferrer">
                                                        Open Form
                                                    </a>
                                                </Button>
                                            </div>
                                        )}

                                        {item.google_sheet_url && (
                                            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
                                                <div className="flex items-center gap-2">
                                                    <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                                                    <span className="font-medium">Google Sheet (Responses)</span>
                                                </div>
                                                <Button variant="outline" size="sm" asChild>
                                                    <a href={item.google_sheet_url} target="_blank" rel="noopener noreferrer">
                                                        View Responses
                                                    </a>
                                                </Button>
                                            </div>
                                        )}

                                        {item.registration_link && (
                                            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
                                                <div className="flex items-center gap-2">
                                                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                                    <span className="font-medium">External Registration</span>
                                                </div>
                                                <Button variant="outline" size="sm" asChild>
                                                    <a href={item.registration_link} target="_blank" rel="noopener noreferrer">
                                                        Open Link
                                                    </a>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Contact Information */}
                        {(item.organizer || item.contact_email || item.contact_phone) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Contact Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {item.organizer && (
                                        <div className="flex items-center gap-3">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Organizer</p>
                                                <p className="font-medium">{item.organizer}</p>
                                            </div>
                                        </div>
                                    )}
                                    {item.contact_email && (
                                        <div className="flex items-center gap-3">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Email</p>
                                                <a href={`mailto:${item.contact_email}`} className="font-medium text-blue-600 hover:underline">
                                                    {item.contact_email}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                    {item.contact_phone && (
                                        <div className="flex items-center gap-3">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Phone</p>
                                                <a href={`tel:${item.contact_phone}`} className="font-medium">
                                                    {item.contact_phone}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Event Status</span>
                                    <Badge className={statusColors[item.status]}>
                                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                    </Badge>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Event Type</span>
                                    <Badge variant="outline">
                                        {eventTypeLabels[item.event_type || 'other'] || item.event_type || 'Other'}
                                    </Badge>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Featured</span>
                                    {item.is_featured ? (
                                        <Badge className="bg-amber-100 text-amber-800">
                                            <Star className="mr-1 h-3 w-3" />
                                            Featured
                                        </Badge>
                                    ) : (
                                        <span className="text-sm">No</span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Date & Time Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Date & Time</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Start Date</p>
                                        <p className="font-medium">{formatDate(item.start_date)}</p>
                                    </div>
                                </div>

                                {item.end_date && item.end_date !== item.start_date && (
                                    <div className="flex items-start gap-3">
                                        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">End Date</p>
                                            <p className="font-medium">{formatDate(item.end_date)}</p>
                                        </div>
                                    </div>
                                )}

                                {(item.start_time || item.end_time) && (
                                    <div className="flex items-start gap-3">
                                        <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Time</p>
                                            <p className="font-medium">
                                                {formatTime(item.start_time)}
                                                {item.end_time && ` - ${formatTime(item.end_time)}`}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {item.venue && (
                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Venue</p>
                                            <p className="font-medium">{item.venue}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Details Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Slug</p>
                                    <p className="mt-1 font-mono text-sm">{item.slug}</p>
                                </div>
                                <Separator />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Created</p>
                                    <p className="mt-1">{formatDateTime(item.created_at)}</p>
                                </div>
                                <Separator />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                                    <p className="mt-1">{formatDateTime(item.updated_at)}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button className="w-full" asChild>
                                    <Link href={`/admin/events/${item.id}/edit`}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Event
                                    </Link>
                                </Button>
                                {item.status !== 'cancelled' && (
                                    <Button variant="outline" className="w-full" asChild>
                                        <a href={`/events/${item.slug}`} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="mr-2 h-4 w-4" />
                                            View on Website
                                        </a>
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
