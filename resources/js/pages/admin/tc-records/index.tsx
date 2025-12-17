import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, Edit, Trash2, Download, FileCheck, Upload, Eye, CheckCircle, XCircle } from 'lucide-react';
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

interface TcRecord {
    id: number;
    tc_number: string;
    student_name: string;
    father_name: string;
    admission_number: string;
    class: string;
    date_of_issue: string;
    pdf_path: string | null;
    is_verified: boolean;
    uploaded_by: number | null;
    uploader?: { id: number; name: string };
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
    tcRecords: PaginatedData<TcRecord>;
    filters: {
        search?: string;
        class?: string;
        is_verified?: string;
    };
    classes: string[];
}

export default function TcRecordsIndex({ tcRecords, filters, classes }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Transfer Certificates', href: '/admin/tc-records' },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/tc-records', { ...filters, search }, { preserveState: true });
    };

    const handleFilter = (key: string, value: string) => {
        router.get('/admin/tc-records', { ...filters, [key]: value === 'all' ? undefined : value }, { preserveState: true });
    };

    const handleToggleVerified = (id: number) => {
        router.post(`/admin/tc-records/${id}/toggle-verified`, {}, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        router.delete(`/admin/tc-records/${id}`);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transfer Certificates Management" />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <FileCheck className="h-6 w-6" />
                            Transfer Certificates
                        </h1>
                        <p className="text-gray-500">Manage transfer certificate records and PDF files</p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link href="/admin/tc-records/bulk-upload">
                                <Upload className="h-4 w-4 mr-2" />
                                Bulk Upload
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href="/admin/tc-records/create">
                                <Plus className="h-4 w-4 mr-2" />
                                Add TC
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
                                    placeholder="Search by name, TC number, or admission number..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="flex-1"
                                />
                                <Button type="submit" variant="secondary">
                                    <Search className="h-4 w-4" />
                                </Button>
                            </form>
                            <Select 
                                value={filters.class || 'all'} 
                                onValueChange={(value) => handleFilter('class', value)}
                            >
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Class" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Classes</SelectItem>
                                    {classes.map((cls) => (
                                        <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select 
                                value={filters.is_verified || 'all'} 
                                onValueChange={(value) => handleFilter('is_verified', value)}
                            >
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="true">Verified</SelectItem>
                                    <SelectItem value="false">Unverified</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* TC Records Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Transfer Certificates ({tcRecords.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>TC Number</TableHead>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead>Father's Name</TableHead>
                                    <TableHead>Admission No.</TableHead>
                                    <TableHead>Class</TableHead>
                                    <TableHead>Issue Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tcRecords.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8">
                                            <p className="text-gray-500">No transfer certificates found</p>
                                            <div className="flex gap-2 justify-center mt-4">
                                                <Button asChild variant="link">
                                                    <Link href="/admin/tc-records/create">Add single TC</Link>
                                                </Button>
                                                <span className="text-gray-400">or</span>
                                                <Button asChild variant="link">
                                                    <Link href="/admin/tc-records/bulk-upload">Bulk upload</Link>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    tcRecords.data.map((tc) => (
                                        <TableRow key={tc.id}>
                                            <TableCell className="font-medium">{tc.tc_number}</TableCell>
                                            <TableCell>{tc.student_name}</TableCell>
                                            <TableCell>{tc.father_name}</TableCell>
                                            <TableCell className="font-mono text-sm">{tc.admission_number}</TableCell>
                                            <TableCell>{tc.class}</TableCell>
                                            <TableCell>{formatDate(tc.date_of_issue)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {tc.is_verified ? (
                                                        <Badge variant="outline" className="bg-green-100 text-green-800">
                                                            <CheckCircle className="h-3 w-3 mr-1" />
                                                            Verified
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                                                            <XCircle className="h-3 w-3 mr-1" />
                                                            Pending
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-1 justify-end">
                                                    {tc.pdf_path && (
                                                        <Button asChild size="icon" variant="ghost" title="Download PDF">
                                                            <a href={`/admin/tc-records/${tc.id}/download`} download>
                                                                <Download className="h-4 w-4" />
                                                            </a>
                                                        </Button>
                                                    )}
                                                    <Button 
                                                        size="icon" 
                                                        variant="ghost" 
                                                        title={tc.is_verified ? 'Mark as Unverified' : 'Mark as Verified'}
                                                        onClick={() => handleToggleVerified(tc.id)}
                                                    >
                                                        {tc.is_verified ? (
                                                            <XCircle className="h-4 w-4 text-yellow-600" />
                                                        ) : (
                                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                                        )}
                                                    </Button>
                                                    <Button asChild size="icon" variant="ghost">
                                                        <Link href={`/admin/tc-records/${tc.id}/edit`}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button size="icon" variant="ghost" className="text-red-600 hover:text-red-700">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Delete Transfer Certificate?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This will permanently delete the TC record for {tc.student_name} (TC #{tc.tc_number}) including the PDF file.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDelete(tc.id)}
                                                                    className="bg-red-600 hover:bg-red-700"
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
                        {tcRecords.last_page > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-6">
                                {tcRecords.links.map((link, index) => (
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
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
