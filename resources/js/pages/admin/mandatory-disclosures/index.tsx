import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, Edit, Trash2, Download, FileText, GripVertical } from 'lucide-react';
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

interface Disclosure {
    id: number;
    title: string;
    category: string | null;
    file_path: string;
    file_name: string | null;
    file_size: number | null;
    sort_order: number;
    is_active: boolean;
    created_at: string;
    formatted_file_size?: string;
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
    disclosures: PaginatedData<Disclosure>;
    filters: {
        search?: string;
        category?: string;
        status?: string;
    };
    categories: Record<string, string>;
}

const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return 'N/A';
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    while (bytes >= 1024 && i < units.length - 1) {
        bytes /= 1024;
        i++;
    }
    return `${bytes.toFixed(1)} ${units[i]}`;
};

export default function MandatoryDisclosuresIndex({ disclosures, filters, categories }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Mandatory Disclosures', href: '/admin/mandatory-disclosures' },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/mandatory-disclosures', { ...filters, search }, { preserveState: true });
    };

    const handleFilter = (key: string, value: string) => {
        router.get('/admin/mandatory-disclosures', { ...filters, [key]: value === 'all' ? undefined : value }, { preserveState: true });
    };

    const handleToggleActive = (id: number) => {
        router.post(`/admin/mandatory-disclosures/${id}/toggle-active`, {}, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        router.delete(`/admin/mandatory-disclosures/${id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mandatory Disclosures Management" />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Mandatory Disclosures</h1>
                        <p className="text-muted-foreground">Manage CBSE mandatory disclosure documents</p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/mandatory-disclosures/create">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Disclosure
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                                <Input
                                    placeholder="Search disclosures..."
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

                {/* Disclosures Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Disclosures ({disclosures.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-10"></TableHead>
                                    <TableHead>Document</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Size</TableHead>
                                    <TableHead>Active</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {disclosures.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">
                                            <p className="text-muted-foreground">No disclosures found</p>
                                            <Button asChild variant="link" className="mt-2">
                                                <Link href="/admin/mandatory-disclosures/create">Add your first disclosure</Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    disclosures.data.map((disclosure) => (
                                        <TableRow key={disclosure.id}>
                                            <TableCell>
                                                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <FileText className="h-5 w-5 text-red-500" />
                                                    <div>
                                                        <p className="font-medium">{disclosure.title}</p>
                                                        <p className="text-sm text-muted-foreground">{disclosure.file_name}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {disclosure.category && (
                                                    <Badge variant="outline">
                                                        {categories[disclosure.category] || disclosure.category}
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {formatFileSize(disclosure.file_size)}
                                            </TableCell>
                                            <TableCell>
                                                <Switch
                                                    checked={disclosure.is_active}
                                                    onCheckedChange={() => handleToggleActive(disclosure.id)}
                                                />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                    >
                                                        <a href={`/storage/${disclosure.file_path}`} target="_blank" rel="noopener noreferrer">
                                                            <Download className="h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={`/admin/mandatory-disclosures/${disclosure.id}/edit`}>
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
                                                                <AlertDialogTitle>Delete Disclosure?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This will permanently delete "{disclosure.title}".
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDelete(disclosure.id)}
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
                        {disclosures.last_page > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-4">
                                {disclosures.links.map((link, index) => (
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
