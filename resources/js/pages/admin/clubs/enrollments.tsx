import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { 
    CheckCircle2, 
    XCircle, 
    Clock, 
    Users, 
    Search, 
    Eye,
    Mail,
    Phone,
    Calendar,
    User,
    BookOpen,
    Hash,
    Filter,
    Loader2,
    Download,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle, 
    AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';

interface ClubMember {
    id: number;
    club_id: number;
    student_name: string;
    class: string;
    admission_number: string | null;
    email: string;
    phone: string;
    parent_phone: string | null;
    reason: string | null;
    academic_year: number;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    club: {
        id: number;
        name: string;
        category: string;
    };
}

interface Club {
    id: number;
    name: string;
    category: string;
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
    enrollments: PaginatedData<ClubMember>;
    clubs: Club[];
    statistics: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
    };
    filters: {
        search?: string;
        status?: string;
        club_id?: string;
    };
}

const statusColors: Record<string, { badge: string; icon: React.ElementType }> = {
    pending: { badge: 'bg-yellow-100 text-yellow-800', icon: Clock },
    approved: { badge: 'bg-green-100 text-green-800', icon: CheckCircle2 },
    rejected: { badge: 'bg-red-100 text-red-800', icon: XCircle },
};

const categoryLabels: Record<string, string> = {
    academic_interest: 'Academic & Interest',
    creative_physical: 'Creative & Physical',
};

function EnrollmentDetailDialog({ enrollment }: { enrollment: ClubMember }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Enrollment Details</DialogTitle>
                    <DialogDescription>
                        Application for {enrollment.club.name}
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm text-gray-500">Student Name</label>
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-400" />
                                <span className="font-medium">{enrollment.student_name}</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm text-gray-500">Class</label>
                            <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-gray-400" />
                                <span className="font-medium">Class {enrollment.class}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm text-gray-500">Admission Number</label>
                        <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{enrollment.admission_number || 'N/A'}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm text-gray-500">Email</label>
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">{enrollment.email}</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm text-gray-500">Phone</label>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">{enrollment.phone}</span>
                            </div>
                        </div>
                    </div>

                    {enrollment.parent_phone && (
                        <div className="space-y-1">
                            <label className="text-sm text-gray-500">Parent Phone</label>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">{enrollment.parent_phone}</span>
                            </div>
                        </div>
                    )}

                    {enrollment.reason && (
                        <div className="space-y-1">
                            <label className="text-sm text-gray-500">Reason for Joining</label>
                            <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                {enrollment.reason}
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                        <div className="space-y-1">
                            <label className="text-sm text-gray-500">Club Category</label>
                            <Badge variant="outline">
                                {categoryLabels[enrollment.club.category] || enrollment.club.category}
                            </Badge>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm text-gray-500">Applied On</label>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">
                                    {new Date(enrollment.created_at).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default function ClubEnrollments({ enrollments, clubs, statistics, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isBulkApproving, setIsBulkApproving] = useState(false);
    const { flash } = usePage().props as any;

    // Get only pending enrollments for selection
    const pendingEnrollments = enrollments.data.filter(e => e.status === 'pending');
    const allPendingSelected = pendingEnrollments.length > 0 && pendingEnrollments.every(e => selectedIds.includes(e.id));
    const somePendingSelected = pendingEnrollments.some(e => selectedIds.includes(e.id));

    const toggleSelectAll = () => {
        if (allPendingSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(pendingEnrollments.map(e => e.id));
        }
    };

    const toggleSelect = (id: number) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Clubs', href: '/admin/clubs' },
        { title: 'Enrollments', href: '/admin/clubs/enrollments' },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/clubs/enrollments', { 
            search, 
            status: filters.status,
            club_id: filters.club_id,
        }, { preserveState: true });
    };

    const handleStatusFilter = (status: string) => {
        router.get('/admin/clubs/enrollments', { 
            search: filters.search, 
            status: status === 'all' ? undefined : status,
            club_id: filters.club_id,
        }, { preserveState: true });
    };

    const handleClubFilter = (clubId: string) => {
        router.get('/admin/clubs/enrollments', { 
            search: filters.search, 
            status: filters.status,
            club_id: clubId === 'all' ? undefined : clubId,
        }, { preserveState: true });
    };

    const handleApprove = (id: number) => {
        router.post(`/admin/clubs/enrollments/${id}/approve`, {}, { preserveState: true });
    };

    const handleReject = (id: number) => {
        router.post(`/admin/clubs/enrollments/${id}/reject`, {}, { preserveState: true });
    };

    const handleBulkApprove = () => {
        if (selectedIds.length === 0) return;
        setIsBulkApproving(true);
        router.post('/admin/clubs/enrollments/bulk-approve', { ids: selectedIds }, {
            preserveState: true,
            onSuccess: () => {
                setSelectedIds([]);
                setIsBulkApproving(false);
            },
            onError: () => {
                setIsBulkApproving(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Club Enrollments" />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold">Club Enrollments</h1>
                    <p className="text-gray-500">Review and manage club membership applications</p>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <span className="text-green-800">{flash.success}</span>
                    </div>
                )}

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Total</p>
                                    <p className="text-2xl font-bold text-blue-600">{statistics.total}</p>
                                </div>
                                <Users className="h-8 w-8 text-blue-300" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-900/20 dark:to-gray-900">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Pending</p>
                                    <p className="text-2xl font-bold text-yellow-600">{statistics.pending}</p>
                                </div>
                                <Clock className="h-8 w-8 text-yellow-300" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-900">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Approved</p>
                                    <p className="text-2xl font-bold text-green-600">{statistics.approved}</p>
                                </div>
                                <CheckCircle2 className="h-8 w-8 text-green-300" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-red-50 to-white dark:from-red-900/20 dark:to-gray-900">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Rejected</p>
                                    <p className="text-2xl font-bold text-red-600">{statistics.rejected}</p>
                                </div>
                                <XCircle className="h-8 w-8 text-red-300" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                                <Input
                                    placeholder="Search by name, admission number, email..."
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
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select 
                                value={filters.club_id || 'all'} 
                                onValueChange={handleClubFilter}
                            >
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Club" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Clubs</SelectItem>
                                    {clubs.map((club) => (
                                        <SelectItem key={club.id} value={club.id.toString()}>
                                            {club.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Export Button */}
                            <Button 
                                variant="outline" 
                                className="gap-2 border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800"
                                asChild
                            >
                                <a 
                                    href={`/admin/clubs/enrollments/export?${new URLSearchParams({
                                        ...(filters.club_id ? { club_id: filters.club_id } : {}),
                                        ...(filters.status ? { status: filters.status } : {}),
                                    }).toString()}`}
                                    download
                                >
                                    <Download className="h-4 w-4" />
                                    Export Excel
                                </a>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Enrollments Table */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <CardTitle>Enrollment Applications ({enrollments.total})</CardTitle>
                                <CardDescription>
                                    Review applications and approve or reject membership requests
                                </CardDescription>
                            </div>
                            
                            {/* Bulk Actions */}
                            {selectedIds.length > 0 && (
                                <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-lg border border-amber-200 dark:border-amber-800">
                                    <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                                        {selectedIds.length} selected
                                    </span>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button 
                                                size="sm" 
                                                className="bg-green-600 hover:bg-green-700"
                                                disabled={isBulkApproving}
                                            >
                                                {isBulkApproving ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                        Approving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                                        Approve Selected
                                                    </>
                                                )}
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Approve {selectedIds.length} Enrollments?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will approve all {selectedIds.length} selected enrollment applications. 
                                                    The students will become members of their respective clubs.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={handleBulkApprove}
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    Approve All
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                    <Button 
                                        size="sm" 
                                        variant="ghost"
                                        onClick={() => setSelectedIds([])}
                                    >
                                        Clear
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">
                                        <Checkbox 
                                            checked={allPendingSelected}
                                            onCheckedChange={toggleSelectAll}
                                            disabled={pendingEnrollments.length === 0}
                                            aria-label="Select all pending"
                                            className={somePendingSelected && !allPendingSelected ? 'data-[state=checked]:bg-amber-500' : ''}
                                        />
                                    </TableHead>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Club</TableHead>
                                    <TableHead>Class</TableHead>
                                    <TableHead>Admission No.</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Applied On</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {enrollments.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center py-8">
                                            <Filter className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                            <p className="text-gray-500">No enrollment applications found</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    enrollments.data.map((enrollment) => {
                                        const StatusIcon = statusColors[enrollment.status].icon;
                                        return (
                                            <TableRow key={enrollment.id} className={selectedIds.includes(enrollment.id) ? 'bg-amber-50 dark:bg-amber-900/10' : ''}>
                                                <TableCell>
                                                    <Checkbox 
                                                        checked={selectedIds.includes(enrollment.id)}
                                                        onCheckedChange={() => toggleSelect(enrollment.id)}
                                                        disabled={enrollment.status !== 'pending'}
                                                        aria-label={`Select ${enrollment.student_name}`}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{enrollment.student_name}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{enrollment.club.name}</div>
                                                        <Badge variant="outline" className="text-xs mt-1">
                                                            {categoryLabels[enrollment.club.category]}
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{enrollment.class}</TableCell>
                                                <TableCell>
                                                    <span className="font-mono text-sm">
                                                        {enrollment.admission_number || '-'}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm space-y-1">
                                                        <div className="flex items-center gap-1">
                                                            <Mail className="h-3 w-3 text-gray-400" />
                                                            {enrollment.email}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Phone className="h-3 w-3 text-gray-400" />
                                                            {enrollment.phone}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={statusColors[enrollment.status].badge}>
                                                        <StatusIcon className="h-3 w-3 mr-1" />
                                                        {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(enrollment.created_at).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                    })}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <EnrollmentDetailDialog enrollment={enrollment} />
                                                        
                                                        {enrollment.status === 'pending' && (
                                                            <>
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger asChild>
                                                                        <Button variant="ghost" size="icon" className="text-green-600">
                                                                            <CheckCircle2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent>
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle>Approve Enrollment?</AlertDialogTitle>
                                                                            <AlertDialogDescription>
                                                                                This will approve {enrollment.student_name}'s membership for {enrollment.club.name}.
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                            <AlertDialogAction
                                                                                onClick={() => handleApprove(enrollment.id)}
                                                                                className="bg-green-600 hover:bg-green-700"
                                                                            >
                                                                                Approve
                                                                            </AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>

                                                                <AlertDialog>
                                                                    <AlertDialogTrigger asChild>
                                                                        <Button variant="ghost" size="icon" className="text-red-600">
                                                                            <XCircle className="h-4 w-4" />
                                                                        </Button>
                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent>
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle>Reject Enrollment?</AlertDialogTitle>
                                                                            <AlertDialogDescription>
                                                                                This will reject {enrollment.student_name}'s application for {enrollment.club.name}.
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                            <AlertDialogAction
                                                                                onClick={() => handleReject(enrollment.id)}
                                                                                className="bg-red-600 hover:bg-red-700"
                                                                            >
                                                                                Reject
                                                                            </AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>
                                                            </>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {enrollments.last_page > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-4">
                                {enrollments.links.map((link, index) => (
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
