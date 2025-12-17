import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Eye, Trash2, Mail, MailOpen, Archive, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';

interface Contact {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    subject: string;
    message: string;
    category: string;
    status: 'unread' | 'read' | 'replied' | 'archived';
    created_at: string;
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    contacts: PaginatedData<Contact>;
    filters: {
        search?: string;
        status?: string;
        category?: string;
    };
    statuses: Record<string, string>;
    categories: Record<string, string>;
    statusCounts: {
        total: number;
        unread: number;
        read: number;
        replied: number;
        archived: number;
    };
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'unread':
            return <Badge variant="destructive" className="gap-1"><Mail className="h-3 w-3" /> Unread</Badge>;
        case 'read':
            return <Badge variant="secondary" className="gap-1"><MailOpen className="h-3 w-3" /> Read</Badge>;
        case 'replied':
            return <Badge className="gap-1 bg-green-500"><CheckCircle className="h-3 w-3" /> Replied</Badge>;
        case 'archived':
            return <Badge variant="outline" className="gap-1"><Archive className="h-3 w-3" /> Archived</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours === 0) {
            const minutes = Math.floor(diff / (1000 * 60));
            return `${minutes}m ago`;
        }
        return `${hours}h ago`;
    } else if (days === 1) {
        return 'Yesterday';
    } else if (days < 7) {
        return `${days}d ago`;
    }
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function ContactsIndex({ contacts, filters, statuses, categories, statusCounts }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Contacts', href: '/admin/contacts' },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/contacts', { ...filters, search }, { preserveState: true });
    };

    const handleFilter = (key: string, value: string) => {
        router.get('/admin/contacts', { ...filters, [key]: value === 'all' ? undefined : value }, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        router.delete(`/admin/contacts/${id}`);
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(contacts.data.map(c => c.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedIds([...selectedIds, id]);
        } else {
            setSelectedIds(selectedIds.filter(i => i !== id));
        }
    };

    const handleBulkStatus = (status: string) => {
        router.post('/admin/contacts/bulk-status', { ids: selectedIds, status }, {
            onSuccess: () => setSelectedIds([]),
        });
    };

    const handleBulkDelete = () => {
        router.post('/admin/contacts/bulk-delete', { ids: selectedIds }, {
            onSuccess: () => setSelectedIds([]),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contact Messages" />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Contact Messages</h1>
                        <p className="text-gray-500">View and respond to contact form submissions</p>
                    </div>
                </div>

                {/* Status Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <Card className={!filters.status ? 'border-primary' : ''}>
                        <CardContent className="p-4 cursor-pointer" onClick={() => handleFilter('status', 'all')}>
                            <div className="text-2xl font-bold">{statusCounts.total}</div>
                            <div className="text-sm text-gray-500">Total</div>
                        </CardContent>
                    </Card>
                    <Card className={filters.status === 'unread' ? 'border-primary' : ''}>
                        <CardContent className="p-4 cursor-pointer" onClick={() => handleFilter('status', 'unread')}>
                            <div className="text-2xl font-bold text-red-500">{statusCounts.unread}</div>
                            <div className="text-sm text-gray-500">Unread</div>
                        </CardContent>
                    </Card>
                    <Card className={filters.status === 'read' ? 'border-primary' : ''}>
                        <CardContent className="p-4 cursor-pointer" onClick={() => handleFilter('status', 'read')}>
                            <div className="text-2xl font-bold text-yellow-500">{statusCounts.read}</div>
                            <div className="text-sm text-gray-500">Read</div>
                        </CardContent>
                    </Card>
                    <Card className={filters.status === 'replied' ? 'border-primary' : ''}>
                        <CardContent className="p-4 cursor-pointer" onClick={() => handleFilter('status', 'replied')}>
                            <div className="text-2xl font-bold text-green-500">{statusCounts.replied}</div>
                            <div className="text-sm text-gray-500">Replied</div>
                        </CardContent>
                    </Card>
                    <Card className={filters.status === 'archived' ? 'border-primary' : ''}>
                        <CardContent className="p-4 cursor-pointer" onClick={() => handleFilter('status', 'archived')}>
                            <div className="text-2xl font-bold text-gray-500">{statusCounts.archived}</div>
                            <div className="text-sm text-gray-500">Archived</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                                <Input
                                    placeholder="Search by name, email, subject..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="flex-1"
                                />
                                <Button type="submit" variant="secondary">
                                    <Search className="h-4 w-4" />
                                </Button>
                            </form>
                            <Select 
                                value={filters.category || 'all'} 
                                onValueChange={(value) => handleFilter('category', value)}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {Object.entries(categories).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Bulk Actions */}
                {selectedIds.length > 0 && (
                    <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-4 flex items-center justify-between">
                            <span className="text-blue-800">{selectedIds.length} message(s) selected</span>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleBulkStatus('read')}>
                                    Mark Read
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleBulkStatus('archived')}>
                                    Archive
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button size="sm" variant="destructive">Delete Selected</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Messages?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will permanently delete {selectedIds.length} message(s).
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleBulkDelete} className="bg-red-500 hover:bg-red-600">
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Messages Table */}
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">
                                        <Checkbox
                                            checked={selectedIds.length === contacts.data.length && contacts.data.length > 0}
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead>From</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {contacts.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8">
                                            <p className="text-gray-500">No messages found</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    contacts.data.map((contact) => (
                                        <TableRow key={contact.id} className={contact.status === 'unread' ? 'bg-blue-50/50' : ''}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedIds.includes(contact.id)}
                                                    onCheckedChange={(checked) => handleSelectOne(contact.id, checked as boolean)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className={`font-medium ${contact.status === 'unread' ? 'font-bold' : ''}`}>
                                                        {contact.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">{contact.email}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <p className={`line-clamp-1 max-w-xs ${contact.status === 'unread' ? 'font-semibold' : ''}`}>
                                                    {contact.subject}
                                                </p>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {categories[contact.category] || contact.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(contact.status)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                                    <Clock className="h-3 w-3" />
                                                    {formatDate(contact.created_at)}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={`/admin/contacts/${contact.id}`}>
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="text-red-500">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Delete Message?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This will permanently delete this message from {contact.name}.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDelete(contact.id)}
                                                                    className="bg-red-500 hover:bg-red-600"
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

                        {/* Pagination */}
                        {contacts.last_page > 1 && (
                            <div className="flex items-center justify-center gap-2 p-4 border-t">
                                {contacts.links.map((link, index) => (
                                    <Button
                                        key={index}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.visit(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
