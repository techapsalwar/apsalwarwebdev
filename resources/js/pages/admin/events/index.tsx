import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Plus, 
    Search, 
    Edit, 
    Trash2, 
    Eye,
    Filter,
    Calendar,
    MapPin,
    Star,
    ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Events', href: '/admin/events' },
];

interface EventItem {
    id: number;
    title: string;
    slug: string;
    event_type: string | null;
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    start_date: string;
    end_date: string | null;
    venue: string | null;
    is_featured: boolean;
    registration_required: boolean;
    google_form_url: string | null;
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
    items: {
        data: EventItem[];
    } & Pagination;
    filters: {
        search?: string;
        status?: string;
    };
}

const statusColors: Record<string, string> = {
    upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    ongoing: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    completed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
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

export default function EventsIndex({ items, filters }: EventsIndexProps) {
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || 'all');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/events', { search, status: status !== 'all' ? status : undefined }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        router.get('/admin/events', { search, status: value !== 'all' ? value : undefined }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (id: number) => {
        router.delete(`/admin/events/${id}`, {
            preserveScroll: true,
        });
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatDateRange = (start: string, end: string | null) => {
        const startDate = formatDate(start);
        if (!end || start === end) return startDate;
        return `${startDate} - ${formatDate(end)}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Events Management - APS Alwar Admin" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Events Management</h1>
                        <p className="text-muted-foreground">
                            Manage school events, programs, and calendar entries.
                        </p>
                    </div>
                    <Button asChild className="bg-amber-600 hover:bg-amber-700">
                        <Link href="/admin/events/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Event
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search events..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Button type="submit" variant="secondary">
                            Search
                        </Button>
                    </form>
                    <Select value={status} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-[150px]">
                            <Filter className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="upcoming">Upcoming</SelectItem>
                            <SelectItem value="ongoing">Ongoing</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[35%]">Event</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Registration</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items?.data?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No events found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                items?.data?.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium">{item.title}</p>
                                                    {item.is_featured && (
                                                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                                    )}
                                                </div>
                                                {item.venue && (
                                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" />
                                                        {item.venue}
                                                    </p>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {eventTypeLabels[item.event_type || 'other'] || item.event_type || 'Other'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-sm">
                                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                                {formatDateRange(item.start_date, item.end_date)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={statusColors[item.status]}>
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {item.registration_required ? (
                                                <div className="flex items-center gap-1">
                                                    <Badge variant="secondary" className="text-xs">Required</Badge>
                                                    {item.google_form_url && (
                                                        <a 
                                                            href={item.google_form_url} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            <ExternalLink className="h-3 w-3" />
                                                        </a>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">No</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={`/admin/events/${item.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={`/admin/events/${item.id}/edit`}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Event</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to delete "{item.title}"? This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction 
                                                                onClick={() => handleDelete(item.id)}
                                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {items?.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {((items.current_page - 1) * items.per_page) + 1} to{' '}
                            {Math.min(items.current_page * items.per_page, items.total)} of {items.total} results
                        </p>
                        <div className="flex gap-2">
                            {items.links.map((link, index) => (
                                <Button
                                    key={index}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
