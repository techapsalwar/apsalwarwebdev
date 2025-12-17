import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { ArrowLeft, Send, Mail, Phone, Calendar, User, Archive, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { type BreadcrumbItem } from '@/types';

interface Contact {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    subject: string;
    message: string;
    category: string;
    status: 'unread' | 'read' | 'replied' | 'archived';
    admin_reply: string | null;
    replied_at: string | null;
    created_at: string;
    replied_by?: {
        name: string;
    };
}

interface Props {
    contact: Contact;
    statuses: Record<string, string>;
    categories: Record<string, string>;
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'unread':
            return <Badge variant="destructive">Unread</Badge>;
        case 'read':
            return <Badge variant="secondary">Read</Badge>;
        case 'replied':
            return <Badge className="bg-green-500">Replied</Badge>;
        case 'archived':
            return <Badge variant="outline">Archived</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
};

export default function ContactsShow({ contact, statuses, categories }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Contacts', href: '/admin/contacts' },
        { title: 'View', href: `/admin/contacts/${contact.id}` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        admin_reply: contact.admin_reply || '',
    });

    const handleReply = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/contacts/${contact.id}/reply`);
    };

    const handleStatusChange = (status: string) => {
        router.post(`/admin/contacts/${contact.id}/status`, { status });
    };

    const handleDelete = () => {
        router.delete(`/admin/contacts/${contact.id}`);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Contact - ${contact.name}`} />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/admin/contacts">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Contact Message</h1>
                            <p className="text-gray-500">From {contact.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {getStatusBadge(contact.status)}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Message?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently delete this message.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Message */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{contact.subject}</CardTitle>
                                <CardDescription>
                                    Received on {formatDate(contact.created_at)}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="prose prose-sm max-w-none">
                                    <p className="whitespace-pre-wrap">{contact.message}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Previous Reply */}
                        {contact.admin_reply && (
                            <Card className="border-green-200 bg-green-50">
                                <CardHeader>
                                    <CardTitle className="text-green-800">Your Reply</CardTitle>
                                    <CardDescription>
                                        Sent on {contact.replied_at ? formatDate(contact.replied_at) : '-'}
                                        {contact.replied_by && ` by ${contact.replied_by.name}`}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="whitespace-pre-wrap text-green-900">{contact.admin_reply}</p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Reply Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{contact.admin_reply ? 'Update Reply' : 'Send Reply'}</CardTitle>
                                <CardDescription>
                                    Your reply will be sent to {contact.email}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleReply} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="admin_reply">Reply Message</Label>
                                        <Textarea
                                            id="admin_reply"
                                            value={data.admin_reply}
                                            onChange={(e) => setData('admin_reply', e.target.value)}
                                            placeholder="Type your reply here..."
                                            rows={6}
                                            required
                                        />
                                        {errors.admin_reply && <p className="text-sm text-red-500">{errors.admin_reply}</p>}
                                    </div>
                                    <Button type="submit" disabled={processing}>
                                        <Send className="h-4 w-4 mr-2" />
                                        {processing ? 'Sending...' : 'Send Reply'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Contact Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <User className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Name</p>
                                        <p className="font-medium">{contact.name}</p>
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <a href={`mailto:${contact.email}`} className="font-medium text-blue-600 hover:underline">
                                            {contact.email}
                                        </a>
                                    </div>
                                </div>
                                {contact.phone && (
                                    <>
                                        <Separator />
                                        <div className="flex items-center gap-3">
                                            <Phone className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Phone</p>
                                                <a href={`tel:${contact.phone}`} className="font-medium text-blue-600 hover:underline">
                                                    {contact.phone}
                                                </a>
                                            </div>
                                        </div>
                                    </>
                                )}
                                <Separator />
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Received</p>
                                        <p className="font-medium">{formatDate(contact.created_at)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Category & Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <p className="font-medium">{categories[contact.category] || contact.category}</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select value={contact.status} onValueChange={handleStatusChange}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(statuses).map(([key, label]) => (
                                                <SelectItem key={key} value={key}>{label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button 
                                    variant="outline" 
                                    className="w-full justify-start"
                                    onClick={() => handleStatusChange('archived')}
                                >
                                    <Archive className="h-4 w-4 mr-2" />
                                    Archive Message
                                </Button>
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <a href={`mailto:${contact.email}?subject=Re: ${contact.subject}`}>
                                        <Mail className="h-4 w-4 mr-2" />
                                        Open in Email Client
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
