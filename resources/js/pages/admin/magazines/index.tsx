import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, Edit, Trash2, BookOpen, Star, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';

interface Magazine {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    cover_image: string | null;
    cover_url: string | null;
    pdf_path: string;
    pdf_url: string;
    issue_date: string;
    issue_number: string | null;
    is_featured: boolean;
    is_active: boolean;
    page_count: number | null;
    file_size: number;
    view_count: number;
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
    magazines: PaginatedData<Magazine>;
    filters: {
        search?: string;
        status?: string;
    };
}

const formatFileSize = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let i = 0;
    while (size >= 1024 && i < units.length - 1) {
        size /= 1024;
        i++;
    }
    return `${size.toFixed(1)} ${units[i]}`;
};

export default function MagazinesIndex({ magazines, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'E-Magazines', href: '/admin/magazines' },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/magazines', { ...filters, search }, { preserveState: true });
    };

    const handleFilter = (key: string, value: string) => {
        router.get('/admin/magazines', { ...filters, [key]: value === 'all' ? undefined : value }, { preserveState: true });
    };

    const handleToggleActive = (slug: string) => {
        router.post(`/admin/magazines/${slug}/toggle-active`, {}, { preserveState: true });
    };

    const handleSetFeatured = (slug: string) => {
        router.post(`/admin/magazines/${slug}/set-featured`, {}, { preserveState: true });
    };

    const handleDelete = (slug: string) => {
        router.delete(`/admin/magazines/${slug}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="E-Magazines Management" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">E-Magazines Management</h1>
                        <p className="text-gray-500">Upload and manage school e-magazines</p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/magazines/create">
                            <Plus className="h-4 w-4 mr-2" />
                            Upload Magazine
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                                <Input
                                    placeholder="Search magazines..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="flex-1"
                                />
                                <Button type="submit" variant="secondary">
                                    <Search className="h-4 w-4" />
                                </Button>
                            </form>
                            <Select
                                value={filters.status || 'all'}
                                onValueChange={(value) => handleFilter('status', value)}
                            >
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Cover</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Issue Date</TableHead>
                                    <TableHead>Size</TableHead>
                                    <TableHead>Views</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Active</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {magazines.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                            No magazines found. Upload your first e-magazine!
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    magazines.data.map((magazine) => (
                                        <TableRow key={magazine.id}>
                                            <TableCell>
                                                {magazine.cover_url ? (
                                                    <img
                                                        src={magazine.cover_url}
                                                        alt={magazine.title}
                                                        className="h-16 w-12 object-cover rounded shadow-sm"
                                                    />
                                                ) : (
                                                    <div className="h-16 w-12 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 rounded flex items-center justify-center">
                                                        <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{magazine.title}</p>
                                                    {magazine.issue_number && (
                                                        <p className="text-sm text-gray-500">Issue #{magazine.issue_number}</p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm text-gray-600">
                                                {new Date(magazine.issue_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                                            </TableCell>
                                            <TableCell className="text-sm text-gray-600">
                                                {formatFileSize(magazine.file_size)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                                    <Eye className="h-3.5 w-3.5" />
                                                    {magazine.view_count}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    {magazine.is_featured ? (
                                                        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                                                            <Star className="h-3 w-3 mr-1 fill-current" />
                                                            Featured
                                                        </Badge>
                                                    ) : (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-xs text-gray-400 hover:text-amber-600"
                                                            onClick={() => handleSetFeatured(magazine.slug)}
                                                        >
                                                            <Star className="h-3 w-3 mr-1" />
                                                            Set Featured
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Switch
                                                    checked={magazine.is_active}
                                                    onCheckedChange={() => handleToggleActive(magazine.slug)}
                                                />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={`/admin/magazines/${magazine.slug}/edit`}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Delete Magazine</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Are you sure you want to delete "{magazine.title}"? This will permanently remove the PDF and cover image.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDelete(magazine.slug)}
                                                                    className="bg-red-600 hover:bg-red-700"
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
                    </CardContent>
                </Card>

                {/* Pagination */}
                {magazines.last_page > 1 && (
                    <div className="flex justify-center gap-1">
                        {magazines.links.map((link, index) => (
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
                )}
            </div>
        </AppLayout>
    );
}
