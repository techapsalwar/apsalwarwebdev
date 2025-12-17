import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, Edit, Trash2, Download, FileText, FileSpreadsheet, FileImage, File } from 'lucide-react';
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

interface Document {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    filename: string;
    path: string;
    file_type: string;
    file_size: number;
    category: string;
    is_active: boolean;
    download_count: number;
    valid_from: string | null;
    valid_until: string | null;
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
    documents: PaginatedData<Document>;
    filters: {
        search?: string;
        category?: string;
        status?: string;
    };
    categories: Record<string, string>;
}

const formatFileSize = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    while (bytes >= 1024 && i < units.length - 1) {
        bytes /= 1024;
        i++;
    }
    return `${bytes.toFixed(1)} ${units[i]}`;
};

const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
        case 'pdf':
            return <FileText className="h-5 w-5 text-red-500" />;
        case 'doc':
        case 'docx':
            return <FileText className="h-5 w-5 text-blue-500" />;
        case 'xls':
        case 'xlsx':
            return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
        case 'jpg':
        case 'jpeg':
        case 'png':
            return <FileImage className="h-5 w-5 text-purple-500" />;
        default:
            return <File className="h-5 w-5 text-gray-500" />;
    }
};

export default function DocumentsIndex({ documents, filters, categories }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Documents', href: '/admin/documents' },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/documents', { ...filters, search }, { preserveState: true });
    };

    const handleFilter = (key: string, value: string) => {
        router.get('/admin/documents', { ...filters, [key]: value === 'all' ? undefined : value }, { preserveState: true });
    };

    const handleToggleActive = (id: number) => {
        router.post(`/admin/documents/${id}/toggle-active`, {}, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        router.delete(`/admin/documents/${id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Documents Management" />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Documents Management</h1>
                        <p className="text-gray-500">Upload and manage downloadable documents</p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/documents/create">
                            <Plus className="h-4 w-4 mr-2" />
                            Upload Document
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                                <Input
                                    placeholder="Search documents..."
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
                                <SelectTrigger className="w-[150px]">
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

                {/* Documents Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Documents ({documents.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Document</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Size</TableHead>
                                    <TableHead>Downloads</TableHead>
                                    <TableHead>Active</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {documents.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">
                                            <p className="text-gray-500">No documents found</p>
                                            <Button asChild variant="link" className="mt-2">
                                                <Link href="/admin/documents/create">Upload your first document</Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    documents.data.map((doc) => (
                                        <TableRow key={doc.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    {getFileIcon(doc.file_type)}
                                                    <div>
                                                        <p className="font-medium">{doc.title}</p>
                                                        <p className="text-sm text-gray-500">{doc.filename}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {categories[doc.category] || doc.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {formatFileSize(doc.file_size)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {doc.download_count}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Switch
                                                    checked={doc.is_active}
                                                    onCheckedChange={() => handleToggleActive(doc.id)}
                                                />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                    >
                                                        <a href={`/storage/${doc.path}`} download={doc.filename}>
                                                            <Download className="h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={`/admin/documents/${doc.slug}/edit`}>
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
                                                                <AlertDialogTitle>Delete Document?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This will permanently delete "{doc.title}".
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDelete(doc.id)}
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
                        {documents.last_page > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-4">
                                {documents.links.map((link, index) => (
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
