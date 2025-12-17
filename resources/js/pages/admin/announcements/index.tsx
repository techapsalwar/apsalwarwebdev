import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Plus, 
    Search, 
    Edit, 
    Trash2, 
    Eye,
    MoreHorizontal,
    Filter,
    Bell,
    BellOff,
    ExternalLink,
    Paperclip,
    AlertTriangle,
    AlertCircle,
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
    { title: 'Announcements', href: '/admin/announcements' },
];

interface AnnouncementItem {
    id: number;
    title: string;
    content: string;
    type: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    priority_color: string;
    type_color: string;
    is_active: boolean;
    show_in_ticker: boolean;
    start_date: string | null;
    end_date: string | null;
    attachment: string | null;
    link: string | null;
    target_audience: string | null;
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

interface AnnouncementsIndexProps {
    items: {
        data: AnnouncementItem[];
    } & Pagination;
    filters: {
        search?: string;
        priority?: string;
        type?: string;
    };
    types: Record<string, string>;
    priorities: Record<string, string>;
}

// Priority badge colors with visual impact
const priorityStyles: Record<string, { bg: string; border: string; icon: boolean }> = {
    critical: { 
        bg: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 border-red-300', 
        border: 'border-l-4 border-l-red-500',
        icon: true 
    },
    high: { 
        bg: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100 border-orange-300', 
        border: 'border-l-4 border-l-orange-500',
        icon: true 
    },
    medium: { 
        bg: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 border-yellow-300', 
        border: 'border-l-4 border-l-yellow-500',
        icon: false 
    },
    low: { 
        bg: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border-green-300', 
        border: 'border-l-4 border-l-green-500',
        icon: false 
    },
};

const typeStyles: Record<string, string> = {
    urgent: 'bg-red-100 text-red-800 border-red-200',
    important: 'bg-orange-100 text-orange-800 border-orange-200',
    event: 'bg-blue-100 text-blue-800 border-blue-200',
    holiday: 'bg-green-100 text-green-800 border-green-200',
    admission: 'bg-purple-100 text-purple-800 border-purple-200',
    exam: 'bg-amber-100 text-amber-800 border-amber-200',
    result: 'bg-teal-100 text-teal-800 border-teal-200',
    academic: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    general: 'bg-gray-100 text-gray-800 border-gray-200',
    other: 'bg-gray-100 text-gray-800 border-gray-200',
};

export default function AnnouncementsIndex({ items, filters, types, priorities }: AnnouncementsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [priority, setPriority] = useState(filters.priority || 'all');
    const [type, setType] = useState(filters.type || 'all');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({ search });
    };

    const applyFilters = (newFilters: Record<string, string | undefined>) => {
        router.get('/admin/announcements', { 
            search: search || undefined,
            priority: priority !== 'all' ? priority : undefined,
            type: type !== 'all' ? type : undefined,
            ...newFilters,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePriorityChange = (value: string) => {
        setPriority(value);
        router.get('/admin/announcements', { 
            search: search || undefined,
            priority: value !== 'all' ? value : undefined,
            type: type !== 'all' ? type : undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleTypeChange = (value: string) => {
        setType(value);
        router.get('/admin/announcements', { 
            search: search || undefined,
            priority: priority !== 'all' ? priority : undefined,
            type: value !== 'all' ? value : undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (id: number) => {
        router.delete(`/admin/announcements/${id}`, {
            preserveScroll: true,
        });
    };

    const handleToggleActive = (id: number) => {
        router.post(`/admin/announcements/${id}/toggle-active`, {}, {
            preserveScroll: true,
        });
    };

    const formatDate = (date: string | null) => {
        if (!date) return 'Not set';
        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Announcements Management - APS Alwar Admin" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Announcements Management</h1>
                        <p className="text-muted-foreground">
                            Manage school announcements and notices.
                        </p>
                    </div>
                    <Button asChild className="bg-amber-600 hover:bg-amber-700">
                        <Link href="/admin/announcements/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Announcement
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search announcements..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Button type="submit" variant="secondary">
                            Search
                        </Button>
                    </form>
                    <div className="flex gap-2">
                        <Select value={type} onValueChange={handleTypeChange}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                {Object.entries(types).map(([value, label]) => (
                                    <SelectItem key={value} value={value}>{label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={priority} onValueChange={handlePriorityChange}>
                            <SelectTrigger className="w-[140px]">
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Priority</SelectItem>
                                {Object.entries(priorities).map(([value, label]) => (
                                    <SelectItem key={value} value={value}>{label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[35%]">Announcement</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Attachments</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No announcements found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                items.data.map((item) => (
                                    <TableRow 
                                        key={item.id} 
                                        className={priorityStyles[item.priority]?.border}
                                    >
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    {(item.priority === 'critical' || item.priority === 'high') && (
                                                        <AlertTriangle className={`h-4 w-4 ${item.priority === 'critical' ? 'text-red-500' : 'text-orange-500'}`} />
                                                    )}
                                                    <p className="font-medium">{item.title}</p>
                                                </div>
                                                <p className="text-sm text-muted-foreground line-clamp-1">
                                                    {item.content}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDate(item.start_date)}
                                                    {item.end_date && ` - ${formatDate(item.end_date)}`}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={typeStyles[item.type] || typeStyles.general}>
                                                {types[item.type] || item.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={priorityStyles[item.priority]?.bg}>
                                                {item.priority === 'critical' && <AlertCircle className="mr-1 h-3 w-3" />}
                                                {priorities[item.priority] || item.priority}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleToggleActive(item.id)}
                                                    className={item.is_active ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'}
                                                >
                                                    {item.is_active ? (
                                                        <>
                                                            <Bell className="mr-1 h-4 w-4" />
                                                            Active
                                                        </>
                                                    ) : (
                                                        <>
                                                            <BellOff className="mr-1 h-4 w-4" />
                                                            Inactive
                                                        </>
                                                    )}
                                                </Button>
                                                {item.show_in_ticker && (
                                                    <Badge variant="outline" className="text-xs text-amber-600 border-amber-600">
                                                        Ticker
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                {item.attachment && (
                                                    <a 
                                                        href={`/storage/${item.attachment}`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800"
                                                        title="File attachment"
                                                    >
                                                        <Paperclip className="h-4 w-4" />
                                                    </a>
                                                )}
                                                {item.link && (
                                                    <a 
                                                        href={item.link} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-green-600 hover:text-green-800"
                                                        title="External link"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </a>
                                                )}
                                                {!item.attachment && !item.link && (
                                                    <span className="text-muted-foreground text-sm">None</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Actions</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/announcements/${item.id}`}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/announcements/${item.id}/edit`}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <DropdownMenuItem 
                                                                className="text-destructive focus:text-destructive"
                                                                onSelect={(e) => e.preventDefault()}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
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
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {items.last_page > 1 && (
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
