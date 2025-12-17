import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Plus, Search, Edit, Trash2, GripVertical, Users, Calendar, UserPlus } from 'lucide-react';
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

interface Club {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    icon: string | null;
    in_charge: string | null;
    meeting_schedule: string | null;
    is_active: boolean;
    accepts_enrollment: boolean;
    order: number;
    members_count: number;
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
    clubs: PaginatedData<Club>;
    filters: {
        search?: string;
        status?: string;
    };
}

export default function ClubsIndex({ clubs, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Clubs', href: '/admin/clubs' },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/clubs', { search, status: filters.status }, { preserveState: true });
    };

    const handleStatusFilter = (status: string) => {
        router.get('/admin/clubs', { search: filters.search, status: status === 'all' ? undefined : status }, { preserveState: true });
    };

    const handleToggleActive = (id: number) => {
        router.post(`/admin/clubs/${id}/toggle-active`, {}, { preserveState: true });
    };

    const handleToggleEnrollment = (id: number) => {
        router.post(`/admin/clubs/${id}/toggle-enrollment`, {}, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        router.delete(`/admin/clubs/${id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Clubs Management" />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Clubs Management</h1>
                        <p className="text-gray-500">Manage school clubs and their activities</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/admin/clubs/enrollments">
                                <UserPlus className="h-4 w-4 mr-2" />
                                View Enrollments
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href="/admin/clubs/create">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Club
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                                <Input
                                    placeholder="Search clubs..."
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
                                onValueChange={handleStatusFilter}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by status" />
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

                {/* Clubs Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Clubs ({clubs.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]"></TableHead>
                                    <TableHead>Club</TableHead>
                                    <TableHead>In-Charge</TableHead>
                                    <TableHead>Schedule</TableHead>
                                    <TableHead>Members</TableHead>
                                    <TableHead>Active</TableHead>
                                    <TableHead>Enrollment</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clubs.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8">
                                            <p className="text-gray-500">No clubs found</p>
                                            <Button asChild variant="link" className="mt-2">
                                                <Link href="/admin/clubs/create">Create your first club</Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    clubs.data.map((club) => (
                                        <TableRow key={club.id}>
                                            <TableCell>
                                                <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    {club.image ? (
                                                        <img
                                                            src={`/storage/${club.image}`}
                                                            alt={club.name}
                                                            className="h-10 w-10 rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                            <Users className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium">{club.name}</p>
                                                        {club.icon && (
                                                            <Badge variant="outline" className="text-xs">
                                                                {club.icon}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {club.in_charge || <span className="text-gray-400">-</span>}
                                            </TableCell>
                                            <TableCell>
                                                {club.meeting_schedule ? (
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <Calendar className="h-3 w-3" />
                                                        {club.meeting_schedule}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {club.members_count} members
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Switch
                                                    checked={club.is_active}
                                                    onCheckedChange={() => handleToggleActive(club.id)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Switch
                                                    checked={club.accepts_enrollment}
                                                    onCheckedChange={() => handleToggleEnrollment(club.id)}
                                                />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={`/admin/clubs/${club.slug}/edit`}>
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
                                                                <AlertDialogTitle>Delete Club?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This will permanently delete "{club.name}" and all associated data.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDelete(club.id)}
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
                        {clubs.last_page > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-4">
                                {clubs.links.map((link, index) => (
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
