import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    ArrowLeft, 
    Edit, 
    Trash2,
    Users,
    Building,
    CheckCircle,
    XCircle,
    Mail,
    Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { type BreadcrumbItem } from '@/types';

interface StaffMember {
    id: number;
    name: string;
    slug: string;
    designation: string;
    photo: string | null;
    email: string | null;
    type: string;
}

interface DepartmentItem {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    order: number;
    is_active: boolean;
    staff_count: number;
    staff: StaffMember[];
    created_at: string;
    updated_at: string;
}

interface Props {
    item: DepartmentItem;
}

function getInitials(name: string) {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

const typeColors: Record<string, string> = {
    teaching: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    non_teaching: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    management: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
};

const typeLabels: Record<string, string> = {
    teaching: 'Teaching',
    non_teaching: 'Non-Teaching',
    management: 'Management',
};

export default function DepartmentShow({ item }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Departments', href: '/admin/departments' },
        { title: item.name, href: `/admin/departments/${item.id}` },
    ];

    const handleDelete = () => {
        router.delete(`/admin/departments/${item.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${item.name} - Department - APS Alwar Admin`} />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/admin/departments">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold tracking-tight">{item.name}</h1>
                                <Badge variant={item.is_active ? 'default' : 'secondary'}>
                                    {item.is_active ? (
                                        <><CheckCircle className="mr-1 h-3 w-3" /> Active</>
                                    ) : (
                                        <><XCircle className="mr-1 h-3 w-3" /> Inactive</>
                                    )}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground">
                                Department Details
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild>
                            <Link href={`/admin/departments/${item.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" disabled={item.staff_count > 0}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
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
                                        onClick={handleDelete}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building className="h-5 w-5" />
                                    Department Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                                    <p className="text-lg">{item.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Slug</label>
                                    <p className="font-mono text-sm bg-muted px-2 py-1 rounded inline-block">
                                        {item.slug}
                                    </p>
                                </div>
                                {item.description && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Description</label>
                                        <p className="text-muted-foreground">{item.description}</p>
                                    </div>
                                )}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Icon</label>
                                        <p>{item.icon || 'No icon'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Display Order</label>
                                        <p>{item.order}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Staff Members */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Staff Members ({item.staff.length})
                                </CardTitle>
                                <CardDescription>
                                    Active staff members in this department
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {item.staff.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>No staff members assigned to this department.</p>
                                        <Button variant="outline" className="mt-4" asChild>
                                            <Link href="/admin/staff/create">Add Staff Member</Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Staff Member</TableHead>
                                                <TableHead>Designation</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {item.staff.map((staff) => (
                                                <TableRow key={staff.id}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-8 w-8">
                                                                {staff.photo ? (
                                                                    <AvatarImage src={`/storage/${staff.photo}`} alt={staff.name} />
                                                                ) : null}
                                                                <AvatarFallback className="bg-amber-100 text-amber-700 text-xs">
                                                                    {getInitials(staff.name)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="font-medium">{staff.name}</p>
                                                                {staff.email && (
                                                                    <p className="text-xs text-muted-foreground">{staff.email}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{staff.designation}</TableCell>
                                                    <TableCell>
                                                        <Badge className={typeColors[staff.type]}>
                                                            {typeLabels[staff.type]}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button variant="ghost" size="sm" asChild>
                                                                <Link href={`/admin/staff/${staff.id}`}>
                                                                    <Eye className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                            <Button variant="ghost" size="sm" asChild>
                                                                <Link href={`/admin/staff/${staff.id}/edit`}>
                                                                    <Edit className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Statistics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Total Staff</span>
                                    <span className="font-semibold">{item.staff_count}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Active Staff</span>
                                    <span className="font-semibold">{item.staff.length}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Metadata */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Metadata</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div>
                                    <label className="text-muted-foreground">Created</label>
                                    <p>{new Date(item.created_at).toLocaleDateString('en-IN', { 
                                        dateStyle: 'long' 
                                    })}</p>
                                </div>
                                <div>
                                    <label className="text-muted-foreground">Last Updated</label>
                                    <p>{new Date(item.updated_at).toLocaleDateString('en-IN', { 
                                        dateStyle: 'long' 
                                    })}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <Link href={`/academics/departments`} target="_blank">
                                        <Eye className="mr-2 h-4 w-4" />
                                        View on Website
                                    </Link>
                                </Button>
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <Link href="/admin/staff/create">
                                        <Users className="mr-2 h-4 w-4" />
                                        Add Staff Member
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
