import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Loader2, LinkIcon, Paperclip, X, ExternalLink, Download } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
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
}

interface AnnouncementsEditProps {
    announcement: Announcement;
    types: Record<string, string>;
    priorities: Record<string, string>;
}

// Priority preview colors
const priorityPreviewColors: Record<string, string> = {
    critical: 'bg-red-100 border-l-4 border-l-red-500',
    high: 'bg-orange-100 border-l-4 border-l-orange-500',
    medium: 'bg-yellow-100 border-l-4 border-l-yellow-500',
    low: 'bg-green-100 border-l-4 border-l-green-500',
};

export default function AnnouncementsEdit({ announcement, types, priorities }: AnnouncementsEditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Announcements', href: '/admin/announcements' },
        { title: 'Edit', href: `/admin/announcements/${announcement.id}/edit` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: announcement.title || '',
        content: announcement.content || '',
        type: announcement.type || 'general',
        priority: announcement.priority || 'medium',
        is_active: announcement.is_active ?? true,
        show_in_ticker: announcement.show_in_ticker ?? false,
        start_date: announcement.start_date ? announcement.start_date.slice(0, 10) : new Date().toISOString().slice(0, 10),
        end_date: announcement.end_date ? announcement.end_date.slice(0, 10) : '',
        target_audience: announcement.target_audience || 'all',
        link: announcement.link || '',
        attachment: null as File | null,
        remove_attachment: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/announcements/${announcement.id}`, {
            forceFormData: true,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('attachment', e.target.files[0]);
            setData('remove_attachment', false);
        }
    };

    const removeNewAttachment = () => {
        setData('attachment', null);
    };

    const removeExistingAttachment = () => {
        setData('remove_attachment', true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit: ${announcement.title} - APS Alwar Admin`} />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/announcements">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Announcement</h1>
                        <p className="text-muted-foreground">
                            Update announcement details.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Announcement Details</CardTitle>
                                <CardDescription>
                                    Update the announcement information.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Enter announcement title"
                                        className={errors.title ? 'border-destructive' : ''}
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-destructive">{errors.title}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Type *</Label>
                                        <Select
                                            value={data.type}
                                            onValueChange={(value) => setData('type', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(types).map(([value, label]) => (
                                                    <SelectItem key={value} value={value}>{label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.type && (
                                            <p className="text-sm text-destructive">{errors.type}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="target_audience">Target Audience</Label>
                                        <Select
                                            value={data.target_audience}
                                            onValueChange={(value) => setData('target_audience', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select audience" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All</SelectItem>
                                                <SelectItem value="students">Students</SelectItem>
                                                <SelectItem value="parents">Parents</SelectItem>
                                                <SelectItem value="teachers">Teachers</SelectItem>
                                                <SelectItem value="staff">Staff</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.target_audience && (
                                            <p className="text-sm text-destructive">{errors.target_audience}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="content">Content *</Label>
                                    <Textarea
                                        id="content"
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        placeholder="Enter announcement content..."
                                        rows={8}
                                        className={errors.content ? 'border-destructive' : ''}
                                    />
                                    {errors.content && (
                                        <p className="text-sm text-destructive">{errors.content}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Schedule</CardTitle>
                                <CardDescription>
                                    Set when the announcement should be visible.
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
                                            Leave empty for no expiry.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Attachments</CardTitle>
                                <CardDescription>
                                    Manage file attachment or external link for this announcement.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Link Attachment */}
                                <div className="space-y-2">
                                    <Label htmlFor="link" className="flex items-center gap-2">
                                        <LinkIcon className="h-4 w-4" />
                                        External Link
                                    </Label>
                                    <Input
                                        id="link"
                                        type="url"
                                        value={data.link}
                                        onChange={(e) => setData('link', e.target.value)}
                                        placeholder="https://example.com/document"
                                        className={errors.link ? 'border-destructive' : ''}
                                    />
                                    {errors.link && (
                                        <p className="text-sm text-destructive">{errors.link}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Add a link to Google Drive, Dropbox, or any external resource.
                                    </p>
                                </div>

                                {/* Existing Attachment */}
                                {announcement.attachment && !data.remove_attachment && !data.attachment && (
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2">
                                            <Paperclip className="h-4 w-4" />
                                            Current File Attachment
                                        </Label>
                                        <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3">
                                            <div className="flex items-center gap-2">
                                                <Paperclip className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm font-medium truncate max-w-xs">
                                                    {announcement.attachment.split('/').pop()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <a 
                                                        href={`/storage/${announcement.attachment}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <ExternalLink className="h-4 w-4 mr-1" />
                                                        View
                                                    </a>
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <a 
                                                        href={`/storage/${announcement.attachment}`}
                                                        download
                                                    >
                                                        <Download className="h-4 w-4 mr-1" />
                                                        Download
                                                    </a>
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={removeExistingAttachment}
                                                    className="text-destructive hover:text-destructive"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {data.remove_attachment && (
                                    <div className="rounded-lg border border-destructive bg-destructive/10 p-3">
                                        <p className="text-sm text-destructive">
                                            Current attachment will be removed when you save.
                                        </p>
                                        <Button
                                            type="button"
                                            variant="link"
                                            size="sm"
                                            onClick={() => setData('remove_attachment', false)}
                                            className="text-destructive p-0 h-auto"
                                        >
                                            Undo removal
                                        </Button>
                                    </div>
                                )}

                                {/* New File Upload */}
                                <div className="space-y-2">
                                    <Label htmlFor="attachment" className="flex items-center gap-2">
                                        <Paperclip className="h-4 w-4" />
                                        {announcement.attachment ? 'Replace File Attachment' : 'File Attachment'}
                                    </Label>
                                    <Input
                                        id="attachment"
                                        type="file"
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                                        onChange={handleFileChange}
                                        className={errors.attachment ? 'border-destructive' : ''}
                                    />
                                    {errors.attachment && (
                                        <p className="text-sm text-destructive">{errors.attachment}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Allowed: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (max 10MB)
                                    </p>
                                </div>

                                {data.attachment && (
                                    <div className="flex items-center justify-between rounded-lg border bg-green-50 p-3">
                                        <div className="flex items-center gap-2">
                                            <Paperclip className="h-4 w-4 text-green-600" />
                                            <span className="text-sm font-medium truncate max-w-xs">
                                                {data.attachment.name}
                                            </span>
                                            <Badge variant="outline" className="text-xs bg-green-100">
                                                New - {(data.attachment.size / 1024 / 1024).toFixed(2)} MB
                                            </Badge>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={removeNewAttachment}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Priority & Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="priority">Priority Level *</Label>
                                    <Select
                                        value={data.priority}
                                        onValueChange={(value) => setData('priority', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(priorities).map(([value, label]) => (
                                                <SelectItem key={value} value={value}>{label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.priority && (
                                        <p className="text-sm text-destructive">{errors.priority}</p>
                                    )}
                                </div>

                                {/* Priority Preview */}
                                <div className={`p-3 rounded-lg ${priorityPreviewColors[data.priority]}`}>
                                    <p className="text-sm font-medium">Preview:</p>
                                    <p className="text-sm text-muted-foreground">
                                        This is how the announcement will appear with {data.priority} priority.
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <div>
                                        <Label htmlFor="is_active">Active</Label>
                                        <p className="text-xs text-muted-foreground">
                                            Show this announcement
                                        </p>
                                    </div>
                                    <Switch
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t">
                                    <div>
                                        <Label htmlFor="show_in_ticker">Show in Ticker</Label>
                                        <p className="text-xs text-muted-foreground">
                                            Display in scrolling ticker
                                        </p>
                                    </div>
                                    <Switch
                                        id="show_in_ticker"
                                        checked={data.show_in_ticker}
                                        onCheckedChange={(checked) => setData('show_in_ticker', checked)}
                                    />
                                </div>
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
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                            <Button type="button" variant="outline" asChild>
                                <Link href="/admin/announcements">Cancel</Link>
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
