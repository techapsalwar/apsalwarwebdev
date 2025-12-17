import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
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
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Events', href: '/admin/events' },
    { title: 'Create', href: '/admin/events/create' },
];

export default function EventsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        short_description: '',
        event_type: 'academic',
        status: 'upcoming',
        start_date: '',
        end_date: '',
        start_time: '',
        end_time: '',
        venue: '',
        organizer: '',
        contact_email: '',
        contact_phone: '',
        registration_required: false,
        registration_link: '',
        registration_deadline: '',
        max_participants: '',
        google_form_url: '',
        google_sheet_url: '',
        is_featured: false,
        featured_image: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/events', {
            forceFormData: true,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('featured_image', e.target.files[0]);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Event - APS Alwar Admin" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/events">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Create Event</h1>
                        <p className="text-muted-foreground">
                            Add a new event to the school calendar.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Event Details</CardTitle>
                                <CardDescription>
                                    Enter the basic information about the event.
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
                                        {errors.event_type && (
                                            <p className="text-sm text-destructive">{errors.event_type}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="organizer">Organizer</Label>
                                        <Input
                                            id="organizer"
                                            value={data.organizer}
                                            onChange={(e) => setData('organizer', e.target.value)}
                                            placeholder="e.g., Sports Department"
                                            className={errors.organizer ? 'border-destructive' : ''}
                                        />
                                        {errors.organizer && (
                                            <p className="text-sm text-destructive">{errors.organizer}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="short_description">Short Description</Label>
                                    <Input
                                        id="short_description"
                                        value={data.short_description}
                                        onChange={(e) => setData('short_description', e.target.value)}
                                        placeholder="Brief description for previews"
                                        className={errors.short_description ? 'border-destructive' : ''}
                                    />
                                    {errors.short_description && (
                                        <p className="text-sm text-destructive">{errors.short_description}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Full Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Detailed description of the event..."
                                        rows={6}
                                        className={errors.description ? 'border-destructive' : ''}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-destructive">{errors.description}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="venue">Venue / Location</Label>
                                    <Input
                                        id="venue"
                                        value={data.venue}
                                        onChange={(e) => setData('venue', e.target.value)}
                                        placeholder="e.g., School Auditorium"
                                        className={errors.venue ? 'border-destructive' : ''}
                                    />
                                    {errors.venue && (
                                        <p className="text-sm text-destructive">{errors.venue}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Date & Time</CardTitle>
                                <CardDescription>
                                    Set the event schedule.
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
                                            className={errors.end_date ? 'border-destructive' : ''}
                                        />
                                        {errors.end_date && (
                                            <p className="text-sm text-destructive">{errors.end_date}</p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            Leave empty for single-day events.
                                        </p>
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
                                            className={errors.start_time ? 'border-destructive' : ''}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="end_time">End Time</Label>
                                        <Input
                                            id="end_time"
                                            type="time"
                                            value={data.end_time}
                                            onChange={(e) => setData('end_time', e.target.value)}
                                            className={errors.end_time ? 'border-destructive' : ''}
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
                                                    className={errors.registration_deadline ? 'border-destructive' : ''}
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
                                                className={errors.google_form_url ? 'border-destructive' : ''}
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Link to the Google Form for student registration.
                                            </p>
                                            {errors.google_form_url && (
                                                <p className="text-sm text-destructive">{errors.google_form_url}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="google_sheet_url">Google Sheet URL (For Teachers)</Label>
                                            <Input
                                                id="google_sheet_url"
                                                type="url"
                                                value={data.google_sheet_url}
                                                onChange={(e) => setData('google_sheet_url', e.target.value)}
                                                placeholder="https://docs.google.com/spreadsheets/d/..."
                                                className={errors.google_sheet_url ? 'border-destructive' : ''}
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
                                                className={errors.registration_link ? 'border-destructive' : ''}
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Alternative external registration link if not using Google Forms.
                                            </p>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                                <CardDescription>
                                    Contact details for event inquiries.
                                </CardDescription>
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
                                            className={errors.contact_email ? 'border-destructive' : ''}
                                        />
                                        {errors.contact_email && (
                                            <p className="text-sm text-destructive">{errors.contact_email}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="contact_phone">Contact Phone</Label>
                                        <Input
                                            id="contact_phone"
                                            type="tel"
                                            value={data.contact_phone}
                                            onChange={(e) => setData('contact_phone', e.target.value)}
                                            placeholder="+91 1234567890"
                                            className={errors.contact_phone ? 'border-destructive' : ''}
                                        />
                                        {errors.contact_phone && (
                                            <p className="text-sm text-destructive">{errors.contact_phone}</p>
                                        )}
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
                                    {errors.status && (
                                        <p className="text-sm text-destructive">{errors.status}</p>
                                    )}
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
                                <div className="space-y-2">
                                    <Input
                                        id="featured_image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className={errors.featured_image ? 'border-destructive' : ''}
                                    />
                                    {errors.featured_image && (
                                        <p className="text-sm text-destructive">{errors.featured_image}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Recommended size: 1200x630 pixels (JPG, PNG)
                                    </p>
                                </div>

                                {data.featured_image && (
                                    <div className="rounded-lg border bg-muted/50 p-2">
                                        <p className="text-sm font-medium">Selected:</p>
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
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Create Event
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
