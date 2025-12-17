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
    UserCheck,
    UserX,
    Users,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Staff', href: '/admin/staff' },
];

interface Department {
    id: number;
    name: string;
}

interface StaffItem {
    id: number;
    name: string;
    slug: string;
    designation: string;
    department_id: number | null;
    department?: Department;
    photo: string | null;
    email: string | null;
    phone: string | null;
    type: 'teaching' | 'non_teaching' | 'management';
    is_active: boolean;
    show_on_website: boolean;
    order: number;
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

interface StaffIndexProps {
    items: {
        data: StaffItem[];
    } & Pagination;
    filters: {
        search?: string;
        type?: string;
        department?: string;
        active?: string;
        sort?: string;
        direction?: string;
    };
    departments: Department[];
    types: Record<string, string>;
}

const typeColors: Record<string, string> = {
    teaching: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    non_teaching: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    management: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
};

export default function StaffIndex({ items, filters, departments, types }: StaffIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [type, setType] = useState(filters.type || 'all');
    const [department, setDepartment] = useState(filters.department || 'all');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    const applyFilters = () => {
        router.get('/admin/staff', { 
            search: search || undefined, 
            type: type !== 'all' ? type : undefined,
            department: department !== 'all' ? department : undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleTypeChange = (value: string) => {
        setType(value);
        router.get('/admin/staff', { 
            search, 
            type: value !== 'all' ? value : undefined,
            department: department !== 'all' ? department : undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDepartmentChange = (value: string) => {
        setDepartment(value);
        router.get('/admin/staff', { 
            search, 
            type: type !== 'all' ? type : undefined,
            department: value !== 'all' ? value : undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (id: number) => {
        router.delete(`/admin/staff/${id}`, {
            preserveScroll: true,
        });
    };

    const handleToggleActive = (id: number) => {
        router.post(`/admin/staff/${id}/toggle-active`, {}, {
            preserveScroll: true,
        });
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Staff Management - APS Alwar Admin" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Staff Management</h1>
                        <p className="text-muted-foreground">
                            Manage teaching and non-teaching staff members.
                        </p>
                    </div>
                    <Button asChild className="bg-amber-600 hover:bg-amber-700">
                        <Link href="/admin/staff/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Staff
                        </Link>
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-lg border bg-card p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                                <Users className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Staff</p>
                                <p className="text-2xl font-bold">{items.total}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                                <UserCheck className="h-5 w-5 text-green-600 dark:text-green-300" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Active</p>
                                <p className="text-2xl font-bold">
                                    {items.data.filter(s => s.is_active).length}
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
                                placeholder="Search staff..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Button type="submit" variant="secondary">
                            Search
                        </Button>
                    </form>
                    <Select value={type} onValueChange={handleTypeChange}>
                        <SelectTrigger className="w-[180px]">
                            <Filter className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Staff Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            {Object.entries(types).map(([key, label]) => (
                                <SelectItem key={key} value={key}>{label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={department} onValueChange={handleDepartmentChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Department" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Departments</SelectItem>
                            {departments.map((dept) => (
                                <SelectItem key={dept.id} value={dept.id.toString()}>{dept.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[35%]">Staff Member</TableHead>
                                <TableHead>Designation</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No staff members found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                items.data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10">
                                                    {item.photo ? (
                                                        <AvatarImage src={`/storage/${item.photo}`} alt={item.name} />
                                                    ) : null}
                                                    <AvatarFallback className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                                                        {getInitials(item.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{item.name}</p>
                                                    {item.email && (
                                                        <p className="text-sm text-muted-foreground">{item.email}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{item.designation}</TableCell>
                                        <TableCell>
                                            {item.department?.name || (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={typeColors[item.type]}>
                                                {types[item.type]}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={item.is_active ? 'default' : 'secondary'}>
                                                {item.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
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
                                                        <Link href={`/admin/staff/${item.id}`}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/staff/${item.id}/edit`}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleToggleActive(item.id)}>
                                                        {item.is_active ? (
                                                            <>
                                                                <UserX className="mr-2 h-4 w-4" />
                                                                Deactivate
                                                            </>
                                                        ) : (
                                                            <>
                                                                <UserCheck className="mr-2 h-4 w-4" />
                                                                Activate
                                                            </>
                                                        )}
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
                                                                <AlertDialogTitle>Delete Staff Member</AlertDialogTitle>
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
