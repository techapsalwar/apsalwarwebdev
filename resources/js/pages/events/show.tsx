import PublicLayout from '@/layouts/public-layout';
import { Head, Link } from '@inertiajs/react';
import { 
    Calendar, 
    Clock, 
    MapPin, 
    ArrowLeft,
    Star,
    Users,
    ExternalLink,
    Share2,
    Mail,
    Phone,
    User,
    AlertCircle,
    CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
    is_featured: boolean;
    featured_image: string | null;
}

interface EventShowProps {
    event: EventItem;
    relatedEvents: EventItem[];
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

export default function EventShow({ event, relatedEvents }: EventShowProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatTime = (timeString: string | null) => {
        if (!timeString) return null;
        try {
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

    const formatShortDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
        });
    };

    const isRegistrationOpen = () => {
        if (!event.registration_required) return false;
        if (event.registration_deadline && new Date(event.registration_deadline) < new Date()) return false;
        if (event.max_participants && event.current_participants >= event.max_participants) return false;
        if (event.status !== 'upcoming' && event.status !== 'ongoing') return false;
        return true;
    };

    const getRegistrationStatus = () => {
        if (!event.registration_required) return null;
        if (event.status === 'completed' || event.status === 'cancelled') return 'closed';
        if (event.registration_deadline && new Date(event.registration_deadline) < new Date()) return 'deadline_passed';
        if (event.max_participants && event.current_participants >= event.max_participants) return 'full';
        return 'open';
    };

    const getImageUrl = (image: string | null) => {
        if (!image) return null;
        return image.startsWith('http') ? image : `/storage/${image}`;
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: event.title,
                    text: event.short_description || event.description || `Check out this event at APS Alwar`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const registrationStatus = getRegistrationStatus();

    return (
        <PublicLayout title={`${event.title} - Army Public School Alwar`}>
            <Head title={`${event.title} - APS Alwar`} />

            {/* Back Button */}
            <div className="bg-gray-50 dark:bg-gray-900 border-b">
                <div className="container mx-auto px-4 py-4">
                    <Link href="/events" className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Events
                    </Link>
                </div>
            </div>

            {/* Hero Section */}
            <section className="relative">
                {event.featured_image ? (
                    <div className="relative h-64 md:h-96 overflow-hidden">
                        <img 
                            src={getImageUrl(event.featured_image)} 
                            alt={event.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                            <div className="container mx-auto">
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <Badge className={statusColors[event.status]}>
                                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                    </Badge>
                                    {event.event_type && (
                                        <Badge variant="secondary">
                                            {eventTypeLabels[event.event_type] || event.event_type}
                                        </Badge>
                                    )}
                                    {event.is_featured && (
                                        <Badge className="bg-amber-500 text-white">
                                            <Star className="mr-1 h-3 w-3" />
                                            Featured
                                        </Badge>
                                    )}
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-white">{event.title}</h1>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 py-12 md:py-16">
                        <div className="container mx-auto px-4">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                <Badge className="bg-white/20 text-white border-white/30">
                                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                </Badge>
                                {event.event_type && (
                                    <Badge className="bg-white/20 text-white border-white/30">
                                        {eventTypeLabels[event.event_type] || event.event_type}
                                    </Badge>
                                )}
                                {event.is_featured && (
                                    <Badge className="bg-white text-amber-600">
                                        <Star className="mr-1 h-3 w-3" />
                                        Featured
                                    </Badge>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white">{event.title}</h1>
                        </div>
                    </div>
                )}
            </section>

            {/* Content */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Registration Alert */}
                            {event.registration_required && registrationStatus && (
                                <Alert className={
                                    registrationStatus === 'open' 
                                        ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950' 
                                        : 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950'
                                }>
                                    {registrationStatus === 'open' ? (
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <AlertCircle className="h-4 w-4 text-amber-600" />
                                    )}
                                    <AlertTitle>
                                        {registrationStatus === 'open' && 'Registration Open'}
                                        {registrationStatus === 'full' && 'Event Full'}
                                        {registrationStatus === 'deadline_passed' && 'Registration Closed'}
                                        {registrationStatus === 'closed' && 'Event Ended'}
                                    </AlertTitle>
                                    <AlertDescription>
                                        {registrationStatus === 'open' && (
                                            <>
                                                Register now to participate in this event!
                                                {event.registration_deadline && (
                                                    <span className="block mt-1 text-sm">
                                                        Deadline: {formatDate(event.registration_deadline)}
                                                    </span>
                                                )}
                                            </>
                                        )}
                                        {registrationStatus === 'full' && 'This event has reached maximum capacity.'}
                                        {registrationStatus === 'deadline_passed' && 'The registration deadline has passed.'}
                                        {registrationStatus === 'closed' && 'This event has ended.'}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Description */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>About This Event</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {event.short_description && (
                                        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 font-medium">
                                            {event.short_description}
                                        </p>
                                    )}
                                    {event.description ? (
                                        <div className="prose prose-gray dark:prose-invert max-w-none whitespace-pre-wrap">
                                            {event.description}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">No additional details available.</p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Registration Section */}
                            {event.registration_required && isRegistrationOpen() && (
                                <Card className="border-amber-200 dark:border-amber-800">
                                    <CardHeader className="bg-amber-50 dark:bg-amber-950/50">
                                        <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                                            <Users className="h-5 w-5" />
                                            Register for This Event
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <div className="space-y-4">
                                            {event.max_participants && (
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">Available Spots</span>
                                                    <span className="font-medium">
                                                        {event.max_participants - (event.current_participants || 0)} of {event.max_participants}
                                                    </span>
                                                </div>
                                            )}
                                            {event.registration_deadline && (
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">Registration Deadline</span>
                                                    <span className="font-medium">{formatDate(event.registration_deadline)}</span>
                                                </div>
                                            )}
                                            <Separator />
                                            {event.google_form_url ? (
                                                <a href={event.google_form_url} target="_blank" rel="noopener noreferrer">
                                                    <Button className="w-full bg-amber-600 hover:bg-amber-700" size="lg">
                                                        <ExternalLink className="mr-2 h-4 w-4" />
                                                        Register Now (Google Form)
                                                    </Button>
                                                </a>
                                            ) : event.registration_link ? (
                                                <a href={event.registration_link} target="_blank" rel="noopener noreferrer">
                                                    <Button className="w-full bg-amber-600 hover:bg-amber-700" size="lg">
                                                        <ExternalLink className="mr-2 h-4 w-4" />
                                                        Register Now
                                                    </Button>
                                                </a>
                                            ) : (
                                                <p className="text-center text-muted-foreground">
                                                    Registration link will be available soon.
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Event Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Event Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Calendar className="h-5 w-5 text-amber-600 mt-0.5" />
                                        <div>
                                            <p className="font-medium">{formatDate(event.start_date)}</p>
                                            {event.end_date && event.end_date !== event.start_date && (
                                                <p className="text-sm text-muted-foreground">
                                                    to {formatDate(event.end_date)}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {(event.start_time || event.end_time) && (
                                        <div className="flex items-start gap-3">
                                            <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
                                            <div>
                                                <p className="font-medium">
                                                    {formatTime(event.start_time)}
                                                    {event.end_time && ` - ${formatTime(event.end_time)}`}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {event.venue && (
                                        <div className="flex items-start gap-3">
                                            <MapPin className="h-5 w-5 text-amber-600 mt-0.5" />
                                            <div>
                                                <p className="font-medium">{event.venue}</p>
                                            </div>
                                        </div>
                                    )}

                                    {event.max_participants && (
                                        <div className="flex items-start gap-3">
                                            <Users className="h-5 w-5 text-amber-600 mt-0.5" />
                                            <div>
                                                <p className="font-medium">
                                                    {event.current_participants || 0} / {event.max_participants}
                                                </p>
                                                <p className="text-sm text-muted-foreground">Participants</p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Contact Information */}
                            {(event.organizer || event.contact_email || event.contact_phone) && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Contact</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {event.organizer && (
                                            <div className="flex items-center gap-3">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                                <span>{event.organizer}</span>
                                            </div>
                                        )}
                                        {event.contact_email && (
                                            <a 
                                                href={`mailto:${event.contact_email}`}
                                                className="flex items-center gap-3 text-amber-600 hover:text-amber-700"
                                            >
                                                <Mail className="h-4 w-4" />
                                                <span>{event.contact_email}</span>
                                            </a>
                                        )}
                                        {event.contact_phone && (
                                            <a 
                                                href={`tel:${event.contact_phone}`}
                                                className="flex items-center gap-3"
                                            >
                                                <Phone className="h-4 w-4 text-muted-foreground" />
                                                <span>{event.contact_phone}</span>
                                            </a>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Share */}
                            <Card>
                                <CardContent className="pt-6">
                                    <Button variant="outline" className="w-full" onClick={handleShare}>
                                        <Share2 className="mr-2 h-4 w-4" />
                                        Share This Event
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Events */}
            {relatedEvents && relatedEvents.length > 0 && (
                <section className="py-12 bg-gray-50 dark:bg-gray-900">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Related Events
                        </h2>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {relatedEvents.map((relatedEvent) => (
                                <Link key={relatedEvent.id} href={`/events/${relatedEvent.slug}`}>
                                    <Card className="overflow-hidden transition-all hover:shadow-lg h-full">
                                        <div className="aspect-video bg-gray-200 dark:bg-gray-800 overflow-hidden">
                                            {relatedEvent.featured_image ? (
                                                <img 
                                                    src={getImageUrl(relatedEvent.featured_image)} 
                                                    alt={relatedEvent.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                                                    <Calendar className="h-8 w-8 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        <CardContent className="p-4">
                                            <Badge className={`${statusColors[relatedEvent.status]} mb-2`}>
                                                {relatedEvent.status.charAt(0).toUpperCase() + relatedEvent.status.slice(1)}
                                            </Badge>
                                            <h3 className="font-semibold line-clamp-2 mb-2">{relatedEvent.title}</h3>
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <Calendar className="mr-1 h-4 w-4" />
                                                {formatShortDate(relatedEvent.start_date)}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
