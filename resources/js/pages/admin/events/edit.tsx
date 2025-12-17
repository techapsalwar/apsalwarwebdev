import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import { type BreadcrumbItem } from '@/types';

interface EventItem {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    short_description: string | null;
    event_type: string | null;
    status: string;
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
    google_form_url: string | null;
    google_sheet_url: string | null;
    is_featured: boolean;
    featured_image: string | null;
}

interface EventEditProps {
    item: EventItem;
}

export default function EventsEdit({ item }: EventEditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Events', href: '/admin/events' },
        { title: item.title, href: `/admin/events/${item.id}/edit` },
    ];

    const formatDateForInput = (dateString: string | null) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
        } catch {
            return '';
        }
    };

    const formatTimeForInput = (timeString: string | null) => {
        if (!timeString) return '';
        // Handle HH:mm:ss format
        if (timeString.includes(':')) {
            return timeString.substring(0, 5);
        }
        return timeString;
    };

    const formatDateTimeForInput = (dateString: string | null) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toISOString().slice(0, 16);
        } catch {
            return '';
        }
    };

    const { data, setData, processing, errors } = useForm({
        title: item.title || '',
        description: item.description || '',
        short_description: item.short_description || '',
        event_type: item.event_type || 'academic',
        status: item.status || 'upcoming',
        start_date: formatDateForInput(item.start_date),
        end_date: formatDateForInput(item.end_date),
        start_time: formatTimeForInput(item.start_time),
        end_time: formatTimeForInput(item.end_time),
        venue: item.venue || '',
        organizer: item.organizer || '',
        contact_email: item.contact_email || '',
        contact_phone: item.contact_phone || '',
        registration_required: item.registration_required || false,
        registration_link: item.registration_link || '',
        registration_deadline: formatDateTimeForInput(item.registration_deadline),
        max_participants: item.max_participants?.toString() || '',
        google_form_url: item.google_form_url || '',
        google_sheet_url: item.google_sheet_url || '',
        is_featured: item.is_featured || false,
        featured_image: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/admin/events/${item.id}`, {
            ...data,
            _method: 'PUT',
        }, {
            forceFormData: true,
        });
    };

    const handleDelete = () => {
        router.delete(`/admin/events/${item.id}`);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('featured_image', e.target.files[0]);
        }
    };

    const featuredImageUrl = item.featured_image
        ? item.featured_image.startsWith('http')
            ? item.featured_image
            : `/storage/${item.featured_image}`
        : null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit: ${item.title} - APS Alwar Admin`} />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/admin/events">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Edit Event</h1>
                            <p className="text-muted-foreground">
                                Update event details and settings.
                            </p>
                        </div>
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
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
                                    onClick={handleDelete}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Event Details</CardTitle>
                                <CardDescription>
                                    Update the basic information about the event.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Event Title *</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Enter event title"
                                        className={errors.title ? 'border-destructive' : ''}
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-destructive">{errors.title}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Slug</Label>
                                    <Input
                                        value={item.slug}
                                        disabled
                                        className="bg-muted"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        URL: /events/{item.slug}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="event_type">Event Type *</Label>
                                        <Select
                                            value={data.event_type}
                                            onValueChange={(value) => setData('event_type', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="academic">Academic</SelectItem>
                                                <SelectItem value="cultural">Cultural</SelectItem>
                                                <SelectItem value="sports">Sports</SelectItem>
                                                <SelectItem value="annual">Annual</SelectItem>
                                                <SelectItem value="competition">Competition</SelectItem>
                                                <SelectItem value="workshop">Workshop</SelectItem>
                                                <SelectItem value="celebration">Celebration</SelectItem>
                                                <SelectItem value="meeting">Meeting</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="organizer">Organizer</Label>
                                        <Input
                                            id="organizer"
                                            value={data.organizer}
                                            onChange={(e) => setData('organizer', e.target.value)}
                                            placeholder="e.g., Sports Department"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="short_description">Short Description</Label>
                                    <Input
                                        id="short_description"
                                        value={data.short_description}
                                        onChange={(e) => setData('short_description', e.target.value)}
                                        placeholder="Brief description for previews"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Full Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Detailed description of the event..."
                                        rows={6}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="venue">Venue / Location</Label>
                                    <Input
                                        id="venue"
                                        value={data.venue}
                                        onChange={(e) => setData('venue', e.target.value)}
                                        placeholder="e.g., School Auditorium"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Date & Time</CardTitle>
                                <CardDescription>
                                    Update the event schedule.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="start_date">Start Date *</Label>
                                        <Input
                                            id="start_date"
                                            type="date"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            className={errors.start_date ? 'border-destructive' : ''}
                                        />
                                        {errors.start_date && (
                                            <p className="text-sm text-destructive">{errors.start_date}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="end_date">End Date</Label>
                                        <Input
                                            id="end_date"
                                            type="date"
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="start_time">Start Time</Label>
                                        <Input
                                            id="start_time"
                                            type="time"
                                            value={data.start_time}
                                            onChange={(e) => setData('start_time', e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="end_time">End Time</Label>
                                        <Input
                                            id="end_time"
                                            type="time"
                                            value={data.end_time}
                                            onChange={(e) => setData('end_time', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Registration Settings</CardTitle>
                                <CardDescription>
                                    Configure registration options if students need to participate.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="registration_required">Registration Required</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Enable if participants need to register for this event.
                                        </p>
                                    </div>
                                    <Switch
                                        id="registration_required"
                                        checked={data.registration_required}
                                        onCheckedChange={(checked) => setData('registration_required', checked)}
                                    />
                                </div>

                                {data.registration_required && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                            <div className="space-y-2">
                                                <Label htmlFor="registration_deadline">Registration Deadline</Label>
                                                <Input
                                                    id="registration_deadline"
                                                    type="datetime-local"
                                                    value={data.registration_deadline}
                                                    onChange={(e) => setData('registration_deadline', e.target.value)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="max_participants">Max Participants</Label>
                                                <Input
                                                    id="max_participants"
                                                    type="number"
                                                    min="0"
                                                    value={data.max_participants}
                                                    onChange={(e) => setData('max_participants', e.target.value)}
                                                    placeholder="Leave empty for unlimited"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="google_form_url">Google Form URL</Label>
                                            <Input
                                                id="google_form_url"
                                                type="url"
                                                value={data.google_form_url}
                                                onChange={(e) => setData('google_form_url', e.target.value)}
                                                placeholder="https://docs.google.com/forms/d/..."
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Link to the Google Form for student registration.
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="google_sheet_url">Google Sheet URL (For Teachers)</Label>
                                            <Input
                                                id="google_sheet_url"
                                                type="url"
                                                value={data.google_sheet_url}
                                                onChange={(e) => setData('google_sheet_url', e.target.value)}
                                                placeholder="https://docs.google.com/spreadsheets/d/..."
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Link to view responses (visible only to admin/teachers).
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="registration_link">External Registration Link</Label>
                                            <Input
                                                id="registration_link"
                                                type="url"
                                                value={data.registration_link}
                                                onChange={(e) => setData('registration_link', e.target.value)}
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="contact_email">Contact Email</Label>
                                        <Input
                                            id="contact_email"
                                            type="email"
                                            value={data.contact_email}
                                            onChange={(e) => setData('contact_email', e.target.value)}
                                            placeholder="coordinator@apsalwar.org"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="contact_phone">Contact Phone</Label>
                                        <Input
                                            id="contact_phone"
                                            type="tel"
                                            value={data.contact_phone}
                                            onChange={(e) => setData('contact_phone', e.target.value)}
                                            placeholder="+91 1234567890"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="status">Event Status</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) => setData('status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="upcoming">Upcoming</SelectItem>
                                            <SelectItem value="ongoing">Ongoing</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label htmlFor="is_featured">Featured Event</Label>
                                    <Switch
                                        id="is_featured"
                                        checked={data.is_featured}
                                        onCheckedChange={(checked) => setData('is_featured', checked)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Event Image</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {featuredImageUrl && (
                                    <div className="rounded-lg overflow-hidden border">
                                        <img 
                                            src={featuredImageUrl} 
                                            alt={item.title}
                                            className="w-full h-40 object-cover"
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="featured_image">
                                        {featuredImageUrl ? 'Replace Image' : 'Upload Image'}
                                    </Label>
                                    <Input
                                        id="featured_image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Recommended size: 1200x630 pixels (JPG, PNG)
                                    </p>
                                </div>

                                {data.featured_image && (
                                    <div className="rounded-lg border bg-muted/50 p-2">
                                        <p className="text-sm font-medium">New file selected:</p>
                                        <p className="text-sm text-muted-foreground truncate">
                                            {data.featured_image.name}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                            <Button 
                                type="submit" 
                                disabled={processing}
                                className="bg-amber-600 hover:bg-amber-700"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Update Event
                                    </>
                                )}
                            </Button>
                            <Button type="button" variant="outline" asChild>
                                <Link href="/admin/events">Cancel</Link>
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
