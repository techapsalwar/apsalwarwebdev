import PublicLayout from '@/layouts/public-layout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Search, 
    Calendar, 
    ArrowRight, 
    MapPin, 
    Clock, 
    Users,
    Filter,
    Star,
    ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

interface EventItem {
    id: number;
    title: string;
    slug: string;
    short_description: string | null;
    description: string | null;
    event_type: string | null;
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    start_date: string;
    end_date: string | null;
    start_time: string | null;
    end_time: string | null;
    venue: string | null;
    registration_required: boolean;
    registration_deadline: string | null;
    max_participants: number | null;
    current_participants: number;
    google_form_url: string | null;
    is_featured: boolean;
    featured_image: string | null;
}

interface Pagination {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface EventsIndexProps {
    events: {
        data: EventItem[];
    } & Pagination;
    featuredEvents: EventItem[];
    eventTypes: string[];
    filters: {
        type?: string;
        status?: string;
        search?: string;
        show_past?: string;
    };
}

const statusColors: Record<string, string> = {
    upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    ongoing: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    completed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
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

export default function EventsIndex({ events, featuredEvents, eventTypes, filters }: EventsIndexProps) {
    const [search, setSearch] = useState(filters?.search || '');
    const [selectedType, setSelectedType] = useState(filters?.type || 'all');
    const [showPast, setShowPast] = useState(filters?.show_past === 'true');

    const eventsData = events?.data || [];
    const totalPages = events?.last_page || 1;
    const currentPage = events?.current_page || 1;
    const perPage = events?.per_page || 12;
    const total = events?.total || 0;
    const links = events?.links || [];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/events', { 
            search: search || undefined,
            type: selectedType !== 'all' ? selectedType : undefined,
            show_past: showPast ? 'true' : undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleTypeChange = (value: string) => {
        setSelectedType(value);
        router.get('/events', { 
            search: search || undefined,
            type: value !== 'all' ? value : undefined,
            show_past: showPast ? 'true' : undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleShowPastToggle = () => {
        const newShowPast = !showPast;
        setShowPast(newShowPast);
        router.get('/events', { 
            search: search || undefined,
            type: selectedType !== 'all' ? selectedType : undefined,
            show_past: newShowPast ? 'true' : undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
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

    const isRegistrationOpen = (event: EventItem) => {
        if (!event.registration_required) return false;
        if (event.registration_deadline && new Date(event.registration_deadline) < new Date()) return false;
        if (event.max_participants && event.current_participants >= event.max_participants) return false;
        return true;
    };

    const getImageUrl = (image: string | null) => {
        if (!image) return null;
        return image.startsWith('http') ? image : `/storage/${image}`;
    };

    return (
        <PublicLayout title="Events - Army Public School Alwar">
            <Head title="Events - APS Alwar" />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-gray-950 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <Badge className="mb-4 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                            School Events
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Events & Activities
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Discover and participate in various events, competitions, and activities at Army Public School, Alwar.
                        </p>
                    </div>
                </div>
            </section>

            {/* Featured Events */}
            {featuredEvents && featuredEvents.length > 0 && (
                <section className="py-12 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-900">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
                            Featured Events
                        </h2>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {featuredEvents.map((event) => (
                                <Card key={event.id} className="overflow-hidden border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-gray-800/80">
                                    <div className="aspect-video bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                        {event.featured_image ? (
                                            <img 
                                                src={getImageUrl(event.featured_image)} 
                                                alt={event.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900 dark:to-orange-900">
                                                <Calendar className="h-12 w-12 text-amber-500" />
                                            </div>
                                        )}
                                    </div>
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge className={statusColors[event.status]}>
                                                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                            </Badge>
                                            {event.event_type && (
                                                <Badge variant="outline">
                                                    {eventTypeLabels[event.event_type] || event.event_type}
                                                </Badge>
                                            )}
                                        </div>
                                        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{event.title}</h3>
                                        <div className="flex items-center text-sm text-muted-foreground mb-3">
                                            <Calendar className="mr-1 h-4 w-4" />
                                            {formatDate(event.start_date)}
                                        </div>
                                        <Link href={`/events/${event.slug}`}>
                                            <Button className="w-full bg-amber-600 hover:bg-amber-700">
                                                View Details
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Search and Filters */}
            <section className="py-8 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto md:max-w-md">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search events..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <Button type="submit">Search</Button>
                        </form>

                        <div className="flex gap-4 items-center">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                                <Select value={selectedType} onValueChange={handleTypeChange}>
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue placeholder="All Types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        {eventTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {eventTypeLabels[type] || type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button 
                                variant={showPast ? "default" : "outline"} 
                                onClick={handleShowPastToggle}
                                size="sm"
                            >
                                {showPast ? 'Showing All' : 'Show Past'}
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Events Grid */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    {eventsData.length > 0 ? (
                        <>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {eventsData.map((event) => (
                                    <Card key={event.id} className="overflow-hidden transition-all hover:shadow-lg group">
                                        <div className="aspect-video bg-gray-200 dark:bg-gray-800 overflow-hidden relative">
                                            {event.featured_image ? (
                                                <img 
                                                    src={getImageUrl(event.featured_image)} 
                                                    alt={event.title}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                                                    <Calendar className="h-12 w-12 text-gray-400" />
                                                </div>
                                            )}
                                            {event.is_featured && (
                                                <div className="absolute top-2 right-2">
                                                    <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                                                </div>
                                            )}
                                        </div>
                                        <CardContent className="p-5">
                                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                                <Badge className={statusColors[event.status]}>
                                                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                                </Badge>
                                                {event.event_type && (
                                                    <Badge variant="outline" className="text-xs">
                                                        {eventTypeLabels[event.event_type] || event.event_type}
                                                    </Badge>
                                                )}
                                                {event.registration_required && (
                                                    <Badge className={isRegistrationOpen(event) ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                                        {isRegistrationOpen(event) ? 'Open' : 'Closed'}
                                                    </Badge>
                                                )}
                                            </div>

                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                                {event.title}
                                            </h3>

                                            {event.short_description && (
                                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                                                    {event.short_description}
                                                </p>
                                            )}

                                            <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{formatDate(event.start_date)}</span>
                                                    {event.end_date && event.end_date !== event.start_date && (
                                                        <span> - {formatDate(event.end_date)}</span>
                                                    )}
                                                </div>
                                                {event.start_time && (
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4" />
                                                        <span>
                                                            {formatTime(event.start_time)}
                                                            {event.end_time && ` - ${formatTime(event.end_time)}`}
                                                        </span>
                                                    </div>
                                                )}
                                                {event.venue && (
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4" />
                                                        <span className="line-clamp-1">{event.venue}</span>
                                                    </div>
                                                )}
                                                {event.max_participants && (
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-4 w-4" />
                                                        <span>
                                                            {event.current_participants || 0}/{event.max_participants} participants
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex gap-2">
                                                <Link href={`/events/${event.slug}`} className="flex-1">
                                                    <Button variant="outline" className="w-full">
                                                        View Details
                                                        <ArrowRight className="ml-1 h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                {event.registration_required && isRegistrationOpen(event) && event.google_form_url && (
                                                    <a href={event.google_form_url} target="_blank" rel="noopener noreferrer">
                                                        <Button className="bg-amber-600 hover:bg-amber-700">
                                                            <ExternalLink className="h-4 w-4" />
                                                        </Button>
                                                    </a>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-12 flex flex-col items-center gap-4">
                                    <p className="text-sm text-gray-500">
                                        Showing {((currentPage - 1) * perPage) + 1} to{' '}
                                        {Math.min(currentPage * perPage, total)} of {total} events
                                    </p>
                                    <div className="flex gap-2">
                                        {links.map((link, index) => (
                                            <Button
                                                key={index}
                                                variant={link.active ? 'default' : 'outline'}
                                                size="sm"
                                                disabled={!link.url}
                                                onClick={() => link.url && router.get(link.url)}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className={link.active ? 'bg-amber-600 hover:bg-amber-700' : ''}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-16">
                            <div className="text-gray-400 mb-4">
                                <Calendar className="h-16 w-16 mx-auto" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                No Events Found
                            </h3>
                            <p className="text-gray-500">
                                {filters?.search 
                                    ? `No results found for "${filters.search}". Try a different search term.`
                                    : showPast 
                                        ? 'There are no events in our records.'
                                        : 'There are no upcoming events at the moment.'
                                }
                            </p>
                            {(filters?.search || selectedType !== 'all') && (
                                <Button 
                                    variant="outline" 
                                    className="mt-4"
                                    onClick={() => router.get('/events')}
                                >
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
