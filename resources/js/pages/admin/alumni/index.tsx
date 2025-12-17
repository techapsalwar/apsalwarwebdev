import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Search, 
    Edit, 
    Trash2, 
    Eye,
    MoreHorizontal,
    Filter,
    CheckCircle,
    XCircle,
    Clock,
    Star,
    StarOff,
    Mail,
    MailCheck,
    Users,
    GraduationCap,
    Send,
    ShieldCheck,
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Alumni', href: '/admin/alumni' },
];

interface AlumniItem {
    id: number;
    name: string;
    slug: string;
    batch_year: string;
    email: string;
    phone: string | null;
    category: string;
    current_designation: string | null;
    organization: string | null;
    photo: string | null;
    photo_url: string | null;
    is_featured: boolean;
    is_active: boolean;
    approval_status: 'pending' | 'approved' | 'rejected';
    email_verified_at: string | null;
    created_at: string;
    approved_by_user?: { name: string };
}

interface Pagination {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    alumni: { data: AlumniItem[] } & Pagination;
    stats: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
        unverified: number;
    };
    batchYears: string[];
    categories: Record<string, string>;
    filters: {
        status: string;
        verified: string;
        category: string;
        batch: string;
        search: string;
    };
}

export default function AdminAlumniIndex({ alumni, stats, batchYears, categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [rejectingAlumni, setRejectingAlumni] = useState<AlumniItem | null>(null);
    const [rejectReason, setRejectReason] = useState('');

    const handleFilter = (key: string, value: string) => {
        router.get('/admin/alumni', {
            ...filters,
            [key]: value !== 'all' ? value : undefined,
            search: search || undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilter('search', search);
    };

    const handleApprove = (alumnus: AlumniItem) => {
        router.post(`/admin/alumni/${alumnus.id}/approve`, {}, {
            preserveScroll: true,
        });
    };

    const handleReject = () => {
        if (!rejectingAlumni) return;
        router.post(`/admin/alumni/${rejectingAlumni.id}/reject`, {
            reason: rejectReason,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setRejectDialogOpen(false);
                setRejectingAlumni(null);
                setRejectReason('');
            },
        });
    };

    const openRejectDialog = (alumnus: AlumniItem) => {
        setRejectingAlumni(alumnus);
        setRejectDialogOpen(true);
    };

    const handleToggleFeatured = (alumnus: AlumniItem) => {
        router.post(`/admin/alumni/${alumnus.id}/toggle-featured`, {}, {
            preserveScroll: true,
        });
    };

    const handleDelete = (alumnus: AlumniItem) => {
        router.delete(`/admin/alumni/${alumnus.id}`, {
            preserveScroll: true,
        });
    };

    const handleVerifyEmail = (alumnus: AlumniItem) => {
        router.post(`/admin/alumni/${alumnus.id}/verify-email`, {}, {
            preserveScroll: true,
        });
    };

    const handleResendVerification = (alumnus: AlumniItem) => {
        router.post(`/admin/alumni/${alumnus.id}/resend-verification`, {}, {
            preserveScroll: true,
        });
    };

    const handleBulkApprove = () => {
        if (selectedIds.length === 0) return;
        router.post('/admin/alumni/bulk-approve', {
            ids: selectedIds,
        }, {
            preserveScroll: true,
            onSuccess: () => setSelectedIds([]),
        });
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === alumni.data.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(alumni.data.map(a => a.id));
        }
    };

    const toggleSelectOne = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const getStatusBadge = (status: string, emailVerified: boolean) => {
        if (!emailVerified) {
            return <Badge variant="outline" className="bg-gray-100 text-gray-700">Email Unverified</Badge>;
        }
        switch (status) {
            case 'approved':
                return <Badge className="bg-green-100 text-green-700">Approved</Badge>;
            case 'rejected':
                return <Badge className="bg-red-100 text-red-700">Rejected</Badge>;
            default:
                return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Alumni Management" />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <GraduationCap className="h-6 w-6" />
                            Alumni Management
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Review and manage alumni registrations
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <Card className={filters.status === 'all' ? 'ring-2 ring-primary' : ''} 
                          onClick={() => handleFilter('status', 'all')}>
                        <CardContent className="p-4 cursor-pointer">
                            <div className="flex items-center gap-3">
                                <Users className="h-8 w-8 text-blue-600" />
                                <div>
                                    <p className="text-2xl font-bold">{stats.total}</p>
                                    <p className="text-xs text-gray-500">Total</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className={filters.status === 'pending' ? 'ring-2 ring-primary' : ''} 
                          onClick={() => handleFilter('status', 'pending')}>
                        <CardContent className="p-4 cursor-pointer">
                            <div className="flex items-center gap-3">
                                <Clock className="h-8 w-8 text-yellow-600" />
                                <div>
                                    <p className="text-2xl font-bold">{stats.pending}</p>
                                    <p className="text-xs text-gray-500">Pending</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className={filters.status === 'approved' ? 'ring-2 ring-primary' : ''} 
                          onClick={() => handleFilter('status', 'approved')}>
                        <CardContent className="p-4 cursor-pointer">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="h-8 w-8 text-green-600" />
                                <div>
                                    <p className="text-2xl font-bold">{stats.approved}</p>
                                    <p className="text-xs text-gray-500">Approved</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className={filters.status === 'rejected' ? 'ring-2 ring-primary' : ''} 
                          onClick={() => handleFilter('status', 'rejected')}>
                        <CardContent className="p-4 cursor-pointer">
                            <div className="flex items-center gap-3">
                                <XCircle className="h-8 w-8 text-red-600" />
                                <div>
                                    <p className="text-2xl font-bold">{stats.rejected}</p>
                                    <p className="text-xs text-gray-500">Rejected</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className={filters.verified === 'no' ? 'ring-2 ring-primary' : ''} 
                          onClick={() => handleFilter('verified', 'no')}>
                        <CardContent className="p-4 cursor-pointer">
                            <div className="flex items-center gap-3">
                                <Mail className="h-8 w-8 text-gray-600" />
                                <div>
                                    <p className="text-2xl font-bold">{stats.unverified}</p>
                                    <p className="text-xs text-gray-500">Unverified</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                    <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search by name, email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button type="submit">
                            <Filter className="h-4 w-4 mr-2" />
                            Search
                        </Button>
                    </form>
                    <Select value={filters.category} onValueChange={(v) => handleFilter('category', v)}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {Object.entries(categories).map(([key, label]) => (
                                <SelectItem key={key} value={key}>{label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={filters.batch || 'all'} onValueChange={(v) => handleFilter('batch', v)}>
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder="Batch" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Batches</SelectItem>
                            {batchYears.map((year) => (
                                <SelectItem key={year} value={year}>{year}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Bulk Actions */}
                {selectedIds.length > 0 && (
                    <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <span className="text-sm font-medium">
                            {selectedIds.length} selected
                        </span>
                        <Button size="sm" onClick={handleBulkApprove}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve Selected
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setSelectedIds([])}>
                            Clear Selection
                        </Button>
                    </div>
                )}

                {/* Table */}
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">
                                    <Checkbox
                                        checked={selectedIds.length === alumni.data.length && alumni.data.length > 0}
                                        onCheckedChange={toggleSelectAll}
                                    />
                                </TableHead>
                                <TableHead>Alumni</TableHead>
                                <TableHead>Batch</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Registered</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {alumni.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-12">
                                        <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500">No alumni found</p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                alumni.data.map((alumnus) => (
                                    <TableRow key={alumnus.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedIds.includes(alumnus.id)}
                                                onCheckedChange={() => toggleSelectOne(alumnus.id)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={alumnus.photo_url || undefined} />
                                                    <AvatarFallback>
                                                        {alumnus.name.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium flex items-center gap-2">
                                                        {alumnus.name}
                                                        {alumnus.is_featured && (
                                                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-gray-500 flex items-center gap-1">
                                                        {alumnus.email}
                                                        {alumnus.email_verified_at && (
                                                            <MailCheck className="h-3 w-3 text-green-500" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{alumnus.batch_year}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {categories[alumnus.category] || alumnus.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(alumnus.approval_status, !!alumnus.email_verified_at)}
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-500">
                                            {new Date(alumnus.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/alumni/${alumnus.id}`}>
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View Details
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/alumni/${alumnus.id}/edit`}>
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    
                                                    {/* Email Verification Actions */}
                                                    {!alumnus.email_verified_at && (
                                                        <>
                                                            <DropdownMenuItem onClick={() => handleResendVerification(alumnus)}>
                                                                <Send className="h-4 w-4 mr-2 text-blue-600" />
                                                                Resend Verification
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleVerifyEmail(alumnus)}>
                                                                <ShieldCheck className="h-4 w-4 mr-2 text-green-600" />
                                                                Verify Email Manually
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                        </>
                                                    )}
                                                    
                                                    {/* Approval Actions */}
                                                    {alumnus.approval_status === 'pending' && alumnus.email_verified_at && (
                                                        <>
                                                            <DropdownMenuItem onClick={() => handleApprove(alumnus)}>
                                                                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                                                Approve
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => openRejectDialog(alumnus)}>
                                                                <XCircle className="h-4 w-4 mr-2 text-red-600" />
                                                                Reject
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                        </>
                                                    )}
                                                    <DropdownMenuItem onClick={() => handleToggleFeatured(alumnus)}>
                                                        {alumnus.is_featured ? (
                                                            <>
                                                                <StarOff className="h-4 w-4 mr-2" />
                                                                Remove Featured
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Star className="h-4 w-4 mr-2" />
                                                                Mark Featured
                                                            </>
                                                        )}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                                <Trash2 className="h-4 w-4 mr-2 text-red-600" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Delete Alumni?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Are you sure you want to delete {alumnus.name}? This action cannot be undone.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction 
                                                                    onClick={() => handleDelete(alumnus)}
                                                                    className="bg-red-600 hover:bg-red-700"
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
                {alumni.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {alumni.links.map((link, index) => (
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

            {/* Reject Dialog */}
            <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Alumni Registration</DialogTitle>
                        <DialogDescription>
                            {rejectingAlumni && `Reject ${rejectingAlumni.name}'s registration?`}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="reason">Reason for Rejection (Optional)</Label>
                            <Textarea
                                id="reason"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Provide a reason for rejection..."
                                rows={3}
                            />
                            <p className="text-xs text-gray-500">
                                This will be included in the notification email sent to the applicant.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleReject}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
