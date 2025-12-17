import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, Edit, Trash2, Star, Quote, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';

interface Testimonial {
    id: number;
    name: string;
    content: string;
    photo: string | null;
    type: string;
    designation: string | null;
    rating: number | null;
    is_featured: boolean;
    is_active: boolean;
    order: number;
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
    testimonials: PaginatedData<Testimonial>;
    filters: {
        search?: string;
        type?: string;
        status?: string;
    };
    types: Record<string, string>;
}

const getTypeBadge = (type: string, types: Record<string, string>) => {
    const colors: Record<string, string> = {
        student: 'bg-blue-100 text-blue-800',
        parent: 'bg-green-100 text-green-800',
        alumni: 'bg-purple-100 text-purple-800',
        staff: 'bg-orange-100 text-orange-800',
        other: 'bg-gray-100 text-gray-800',
    };
    return (
        <Badge variant="outline" className={colors[type] || colors.other}>
            {types[type] || type}
        </Badge>
    );
};

const renderStars = (rating: number | null) => {
    if (!rating) return <span className="text-gray-400">-</span>;
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                />
            ))}
        </div>
    );
};

export default function TestimonialsIndex({ testimonials, filters, types }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Testimonials', href: '/admin/testimonials' },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/testimonials', { ...filters, search }, { preserveState: true });
    };

    const handleFilter = (key: string, value: string) => {
        router.get('/admin/testimonials', { ...filters, [key]: value === 'all' ? undefined : value }, { preserveState: true });
    };

    const handleToggleActive = (id: number) => {
        router.post(`/admin/testimonials/${id}/toggle-active`, {}, { preserveState: true });
    };

    const handleToggleFeatured = (id: number) => {
        router.post(`/admin/testimonials/${id}/toggle-featured`, {}, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        router.delete(`/admin/testimonials/${id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Testimonials Management" />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Testimonials</h1>
                        <p className="text-gray-500">Manage testimonials from students, parents, and alumni</p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/testimonials/create">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Testimonial
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                                <Input
                                    placeholder="Search testimonials..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="flex-1"
                                />
                                <Button type="submit" variant="secondary">
                                    <Search className="h-4 w-4" />
                                </Button>
                            </form>
                            <Select 
                                value={filters.type || 'all'} 
                                onValueChange={(value) => handleFilter('type', value)}
                            >
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    {Object.entries(types).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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

                {/* Testimonials Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Testimonials ({testimonials.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Person</TableHead>
                                    <TableHead className="max-w-md">Testimonial</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead>Featured</TableHead>
                                    <TableHead>Active</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {testimonials.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8">
                                            <p className="text-gray-500">No testimonials found</p>
                                            <Button asChild variant="link" className="mt-2">
                                                <Link href="/admin/testimonials/create">Add your first testimonial</Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    testimonials.data.map((testimonial) => (
                                        <TableRow key={testimonial.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    {testimonial.photo ? (
                                                        <img
                                                            src={`/storage/${testimonial.photo}`}
                                                            alt={testimonial.name}
                                                            className="h-10 w-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                            <User className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium">{testimonial.name}</p>
                                                        {testimonial.designation && (
                                                            <p className="text-sm text-gray-500">{testimonial.designation}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-start gap-2">
                                                    <Quote className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                                                    <p className="text-sm line-clamp-2 max-w-md">
                                                        {testimonial.content}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getTypeBadge(testimonial.type, types)}
                                            </TableCell>
                                            <TableCell>
                                                {renderStars(testimonial.rating)}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleToggleFeatured(testimonial.id)}
                                                    className={testimonial.is_featured ? 'text-yellow-500' : 'text-gray-400'}
                                                >
                                                    <Star className={`h-4 w-4 ${testimonial.is_featured ? 'fill-current' : ''}`} />
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                                <Switch
                                                    checked={testimonial.is_active}
                                                    onCheckedChange={() => handleToggleActive(testimonial.id)}
                                                />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={`/admin/testimonials/${testimonial.id}/edit`}>
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
                                                                <AlertDialogTitle>Delete Testimonial?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This will permanently delete the testimonial from {testimonial.name}.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDelete(testimonial.id)}
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
                        {testimonials.last_page > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-4">
                                {testimonials.links.map((link, index) => (
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
