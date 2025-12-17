import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Plus, 
    Search, 
    Edit, 
    Trash2, 
    MoreHorizontal,
    Filter,
    Building,
    Users,
    Eye,
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
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Departments', href: '/admin/departments' },
];

interface DepartmentItem {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    order: number;
    is_active: boolean;
    staff_count: number;
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

interface DepartmentsIndexProps {
    items: {
        data: DepartmentItem[];
    } & Pagination;
    filters: {
        search?: string;
        active?: string;
        sort?: string;
        direction?: string;
    };
}

export default function DepartmentsIndex({ items, filters }: DepartmentsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [activeFilter, setActiveFilter] = useState(filters.active || 'all');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    const applyFilters = () => {
        router.get('/admin/departments', { 
            search: search || undefined, 
            active: activeFilter !== 'all' ? activeFilter : undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleActiveFilterChange = (value: string) => {
        setActiveFilter(value);
        router.get('/admin/departments', { 
            search, 
            active: value !== 'all' ? value : undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (id: number) => {
        router.delete(`/admin/departments/${id}`, {
            preserveScroll: true,
        });
    };

    const handleToggleActive = (id: number) => {
        router.post(`/admin/departments/${id}/toggle-active`, {}, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Departments - APS Alwar Admin" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Departments</h1>
                        <p className="text-muted-foreground">
                            Manage academic and administrative departments.
                        </p>
                    </div>
                    <Button asChild className="bg-amber-600 hover:bg-amber-700">
                        <Link href="/admin/departments/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Department
                        </Link>
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg border bg-card p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                                <Building className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Departments</p>
                                <p className="text-2xl font-bold">{items.total}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                                <Users className="h-5 w-5 text-green-600 dark:text-green-300" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Staff</p>
                                <p className="text-2xl font-bold">
                                    {items.data.reduce((sum, d) => sum + d.staff_count, 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search departments..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Button type="submit" variant="secondary">
                            Search
                        </Button>
                    </form>
                    <Select value={activeFilter} onValueChange={handleActiveFilterChange}>
                        <SelectTrigger className="w-[150px]">
                            <Filter className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="1">Active</SelectItem>
                            <SelectItem value="0">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">#</TableHead>
                                <TableHead className="w-[35%]">Department</TableHead>
                                <TableHead>Staff Count</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Active</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No departments found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                items.data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium text-muted-foreground">
                                            {item.order}
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                {item.description && (
                                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                                        {item.description}
                                                    </p>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4 text-muted-foreground" />
                                                <span>{item.staff_count}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={item.is_active ? 'default' : 'secondary'}>
                                                {item.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={item.is_active}
                                                onCheckedChange={() => handleToggleActive(item.id)}
                                            />
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
                                                        <Link href={`/admin/departments/${item.id}`}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/departments/${item.id}/edit`}>
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
                                                                disabled={item.staff_count > 0}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Delete Department</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Are you sure you want to delete "{item.name}"? This action cannot be undone.
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
