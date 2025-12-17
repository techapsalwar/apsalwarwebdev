import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, Edit, Trash2, Handshake, Globe, ExternalLink } from 'lucide-react';
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

interface Partnership {
    id: number;
    partner_name: string;
    slug: string;
    description: string | null;
    logo: string | null;
    logo_url: string | null;
    website_url: string | null;
    type: string;
    type_label: string;
    benefits: string[] | null;
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
    partnerships: PaginatedData<Partnership>;
    filters: {
        search?: string;
        type?: string;
        status?: string;
    };
    types: Record<string, string>;
}

const getTypeBadge = (type: string, types: Record<string, string>) => {
    const colors: Record<string, string> = {
        technology: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
        educational: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        corporate: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        government: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        ngo: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        other: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    };
    return (
        <Badge variant="outline" className={colors[type] || colors.other}>
            {types[type] || type}
        </Badge>
    );
};

export default function PartnershipsIndex({ partnerships, filters, types }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Partnerships', href: '/admin/partnerships' },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/partnerships', { ...filters, search }, { preserveState: true });
    };

    const handleFilter = (key: string, value: string) => {
        router.get('/admin/partnerships', { ...filters, [key]: value === 'all' ? undefined : value }, { preserveState: true });
    };

    const handleToggleActive = (id: number) => {
        router.post(`/admin/partnerships/${id}/toggle-active`, {}, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        router.delete(`/admin/partnerships/${id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Partnerships Management" />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Partnerships</h1>
                        <p className="text-gray-500">Manage partner organizations displayed on the homepage</p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/partnerships/create">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Partnership
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                                <Input
                                    placeholder="Search partnerships..."
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
                                <SelectTrigger className="w-[180px]">
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

                {/* Partnerships Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Partnerships ({partnerships.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Partner</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Website</TableHead>
                                    <TableHead>Benefits</TableHead>
                                    <TableHead>Active</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {partnerships.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">
                                            <p className="text-gray-500">No partnerships found</p>
                                            <Button asChild variant="link" className="mt-2">
                                                <Link href="/admin/partnerships/create">Add your first partnership</Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    partnerships.data.map((partnership) => (
                                        <TableRow key={partnership.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    {partnership.logo_url ? (
                                                        <img
                                                            src={partnership.logo_url}
                                                            alt={partnership.partner_name}
                                                            className="h-10 w-10 rounded-lg object-contain bg-gray-50 p-1"
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                                            <Handshake className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium">{partnership.partner_name}</p>
                                                        {partnership.description && (
                                                            <p className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                                                                {partnership.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getTypeBadge(partnership.type, types)}
                                            </TableCell>
                                            <TableCell>
                                                {partnership.website_url ? (
                                                    <a
                                                        href={partnership.website_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                                                    >
                                                        <Globe className="h-4 w-4" />
                                                        <span className="text-sm">Visit</span>
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-400">—</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {partnership.benefits && partnership.benefits.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {partnership.benefits.slice(0, 2).map((benefit, idx) => (
                                                            <Badge key={idx} variant="secondary" className="text-xs">
                                                                {benefit}
                                                            </Badge>
                                                        ))}
                                                        {partnership.benefits.length > 2 && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                +{partnership.benefits.length - 2}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">—</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Switch
                                                    checked={partnership.is_active}
                                                    onCheckedChange={() => handleToggleActive(partnership.id)}
                                                />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={`/admin/partnerships/${partnership.id}/edit`}>
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
                                                                <AlertDialogTitle>Delete Partnership?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This will permanently delete the partnership with {partnership.partner_name}.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDelete(partnership.id)}
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
                        {partnerships.last_page > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-4">
                                {partnerships.links.map((link, index) => (
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
