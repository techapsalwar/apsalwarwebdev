import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Plus, 
    Search, 
    Edit, 
    Trash2, 
    Eye,
    Filter,
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
    { title: 'News', href: '/admin/news' },
];

interface NewsItem {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    status: 'draft' | 'published' | 'archived';
    is_featured: boolean;
    published_at: string | null;
    created_at: string;
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

interface NewsIndexProps {
    items: {
        data: NewsItem[];
    } & Pagination;
    filters: {
        search?: string;
        status?: string;
        sort?: string;
        direction?: string;
    };
}

const statusColors: Record<string, string> = {
    draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    archived: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

export default function NewsIndex({ items, filters }: NewsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/news', { search, status: status !== 'all' ? status : undefined }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        router.get('/admin/news', { search, status: value !== 'all' ? value : undefined }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (id: number) => {
        router.delete(`/admin/news/${id}`, {
            preserveScroll: true,
        });
    };

    const formatDate = (date: string | null) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="News Management - APS Alwar Admin" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">News Management</h1>
                        <p className="text-muted-foreground">
                            Manage news articles and updates for the school website.
                        </p>
                    </div>
                    <Button asChild className="bg-amber-600 hover:bg-amber-700">
                        <Link href="/admin/news/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add News
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search news..."
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
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40%]">Title</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Featured</TableHead>
                                <TableHead>Published</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No news articles found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                items.data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{item.title}</p>
                                                {item.excerpt && (
                                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                                        {item.excerpt}
                                                    </p>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={statusColors[item.status]}>
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {item.is_featured ? (
                                                <Badge variant="outline" className="text-amber-600 border-amber-600">
                                                    Featured
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(item.published_at)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                {/* View Button */}
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    asChild
                                                    title="View"
                                                >
                                                    <Link href={`/admin/news/${item.id}`}>
                                                        <Eye className="h-4 w-4 text-blue-600" />
                                                        <span className="sr-only">View</span>
                                                    </Link>
                                                </Button>

                                                {/* Edit Button */}
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    asChild
                                                    title="Edit"
                                                >
                                                    <Link href={`/admin/news/${item.id}/edit`}>
                                                        <Edit className="h-4 w-4 text-amber-600" />
                                                        <span className="sr-only">Edit</span>
                                                    </Link>
                                                </Button>

                                                {/* Delete Button */}
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                            <span className="sr-only">Delete</span>
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete News Article</AlertDialogTitle>
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
