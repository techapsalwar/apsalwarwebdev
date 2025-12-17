import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, Edit, Trash2, Image, Star, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';

interface Album {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    cover_image: string | null;
    year: number | null;
    month: number | null;
    status: 'draft' | 'published';
    is_featured: boolean;
    photos_count: number;
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
    albums: PaginatedData<Album>;
    filters: {
        search?: string;
        status?: string;
        year?: string;
    };
    years: number[];
}

const months = [
    '', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default function AlbumsIndex({ albums, filters, years }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Photo Albums', href: '/admin/albums' },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/albums', { ...filters, search }, { preserveState: true });
    };

    const handleFilter = (key: string, value: string) => {
        router.get('/admin/albums', { ...filters, [key]: value === 'all' ? undefined : value }, { preserveState: true });
    };

    const handleToggleFeatured = (id: number) => {
        router.post(`/admin/albums/${id}/toggle-featured`, {}, { preserveState: true });
    };

    const handleToggleStatus = (id: number) => {
        router.post(`/admin/albums/${id}/toggle-status`, {}, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        router.delete(`/admin/albums/${id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Photo Albums" />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Photo Albums</h1>
                        <p className="text-gray-500">Manage photo galleries for events and activities</p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/albums/create">
                            <Plus className="h-4 w-4 mr-2" />
                            Create Album
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                                <Input
                                    placeholder="Search albums..."
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
                                    <SelectItem value="published">Published</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select 
                                value={filters.year || 'all'} 
                                onValueChange={(value) => handleFilter('year', value)}
                            >
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Years</SelectItem>
                                    {years.map((year) => (
                                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Albums Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Albums ({albums.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Album</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Photos</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Featured</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {albums.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">
                                            <p className="text-gray-500">No albums found</p>
                                            <Button asChild variant="link" className="mt-2">
                                                <Link href="/admin/albums/create">Create your first album</Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    albums.data.map((album) => (
                                        <TableRow key={album.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    {album.cover_image ? (
                                                        <img
                                                            src={`/storage/${album.cover_image}`}
                                                            alt={album.title}
                                                            className="h-12 w-16 rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-12 w-16 rounded-lg bg-gray-100 flex items-center justify-center">
                                                            <Image className="h-6 w-6 text-gray-400" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium">{album.title}</p>
                                                        {album.description && (
                                                            <p className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                                                                {album.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {album.year ? (
                                                    <span>
                                                        {album.month ? months[album.month] + ' ' : ''}{album.year}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {album.photos_count} photos
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleToggleStatus(album.id)}
                                                    className={album.status === 'published' ? 'text-green-600' : 'text-gray-400'}
                                                >
                                                    {album.status === 'published' ? (
                                                        <>
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            Published
                                                        </>
                                                    ) : (
                                                        <>
                                                            <EyeOff className="h-4 w-4 mr-1" />
                                                            Draft
                                                        </>
                                                    )}
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleToggleFeatured(album.id)}
                                                    className={album.is_featured ? 'text-yellow-500' : 'text-gray-400'}
                                                >
                                                    <Star className={`h-4 w-4 ${album.is_featured ? 'fill-current' : ''}`} />
                                                </Button>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={`/admin/albums/${album.slug}/edit`}>
                                                            <Edit className="h-4 w-4" />
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
                                                                <AlertDialogTitle>Delete Album?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This will permanently delete "{album.title}" and all {album.photos_count} photos.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDelete(album.id)}
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
                        {albums.last_page > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-4">
                                {albums.links.map((link, index) => (
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
