import PublicLayout from '@/layouts/public-layout';
import { Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Download,
    Eye,
    FileCheck,
    FileSpreadsheet,
    FileText,
    File,
    Filter,
    FolderOpen,
    Image,
    Newspaper,
    Search,
    X,
    FileIcon,
    BookOpen,
    ScrollText,
    ClipboardList,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

interface Document {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    original_name: string;
    file_path: string;
    file_type: string;
    file_size: number;
    category: string;
    is_active: boolean;
    download_count: number;
    valid_from: string | null;
    valid_until: string | null;
    created_at: string;
    file_url: string;
    file_size_human: string;
    icon: string;
}

interface PaginatedDocuments {
    data: Document[];
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

interface Props {
    documents: PaginatedDocuments;
    filters: {
        search?: string;
        category?: string;
    };
    categories: Record<string, string>;
    categoryCounts: Record<string, number>;
    recentCirculars?: Document[];
    currentCategory?: string;
    categoryTitle?: string;
}

// Category icons
const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    circular: Newspaper,
    academic: BookOpen,
    form: ClipboardList,
    report: FileSpreadsheet,
    policy: ScrollText,
    newsletter: FileText,
    other: File,
};

// Category colors
const categoryColors: Record<string, string> = {
    circular: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    academic: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    form: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    report: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    policy: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    newsletter: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
    other: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
};

// File type icons
const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
        case 'pdf':
            return <FileText className="h-8 w-8 text-red-500" />;
        case 'doc':
        case 'docx':
            return <FileText className="h-8 w-8 text-blue-500" />;
        case 'xls':
        case 'xlsx':
            return <FileSpreadsheet className="h-8 w-8 text-green-500" />;
        case 'jpg':
        case 'jpeg':
        case 'png':
            return <Image className="h-8 w-8 text-purple-500" />;
        default:
            return <File className="h-8 w-8 text-gray-500" />;
    }
};

export default function Downloads({
    documents,
    filters,
    categories,
    categoryCounts,
    recentCirculars,
    currentCategory,
    categoryTitle,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || 'all');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/downloads', {
            search: search || undefined,
            category: category !== 'all' ? category : undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleCategoryChange = (value: string) => {
        setCategory(value);
        router.get('/downloads', {
            search: search || undefined,
            category: value !== 'all' ? value : undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setCategory('all');
        router.get('/downloads');
    };

    const hasFilters = search || category !== 'all';
    const totalDocuments = Object.values(categoryCounts).reduce((a, b) => a + b, 0);

    return (
        <PublicLayout title="Downloads - APS Alwar">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 py-16 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 blur-xl" />
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-amber-200 rounded-full opacity-20 blur-xl" />

                <div className="container mx-auto px-4 relative">
                    <Button variant="ghost" size="sm" className="mb-6" asChild>
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Link>
                    </Button>
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="mb-4 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                            <FolderOpen className="h-3 w-3 mr-1" />
                            {totalDocuments} Documents Available
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            {categoryTitle || 'Downloads & Documents'}
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Access circulars, forms, academic documents, and important school notices
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Search & Filters */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Filter className="h-4 w-4" />
                                        Filter Documents
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <form onSubmit={handleSearch}>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                placeholder="Search documents..."
                                                className="pl-10"
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                            />
                                        </div>
                                    </form>

                                    <Select value={category} onValueChange={handleCategoryChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Categories" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Categories</SelectItem>
                                            {Object.entries(categories).map(([key, label]) => (
                                                <SelectItem key={key} value={key}>
                                                    {label} ({categoryCounts[key] || 0})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {hasFilters && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full"
                                            onClick={clearFilters}
                                        >
                                            <X className="h-4 w-4 mr-2" />
                                            Clear Filters
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Category Quick Links */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">Categories</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {Object.entries(categories).map(([key, label]) => {
                                        const Icon = categoryIcons[key] || File;
                                        const count = categoryCounts[key] || 0;
                                        const isActive = currentCategory === key || category === key;

                                        return (
                                            <Link
                                                key={key}
                                                href={`/downloads/category/${key}`}
                                                className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                                                    isActive
                                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Icon className="h-4 w-4" />
                                                    <span className="text-sm font-medium">{label}</span>
                                                </div>
                                                <Badge variant="secondary" className="text-xs">
                                                    {count}
                                                </Badge>
                                            </Link>
                                        );
                                    })}
                                </CardContent>
                            </Card>

                            {/* Recent Circulars */}
                            {recentCirculars && recentCirculars.length > 0 && (
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Newspaper className="h-4 w-4" />
                                            Recent Circulars
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {recentCirculars.map((doc) => (
                                            <a
                                                key={doc.id}
                                                href={`/downloads/${doc.slug}/download`}
                                                className="block group"
                                                download
                                            >
                                                <div className="flex items-start gap-2">
                                                    <FileText className="h-4 w-4 mt-0.5 text-red-500 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-sm font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
                                                            {doc.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-0.5">
                                                            {new Date(doc.created_at).toLocaleDateString('en-IN', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric',
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </a>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Documents Grid */}
                        <div className="lg:col-span-3">
                            {/* Results Info */}
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-gray-600 dark:text-gray-400">
                                    Showing <span className="font-medium">{documents.data.length}</span> of{' '}
                                    <span className="font-medium">{documents.total}</span> documents
                                </p>
                                {currentCategory && (
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href="/downloads">
                                            <X className="h-4 w-4 mr-1" />
                                            Clear Category
                                        </Link>
                                    </Button>
                                )}
                            </div>

                            {documents.data.length === 0 ? (
                                <Card className="p-12 text-center">
                                    <FolderOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                        No Documents Found
                                    </h3>
                                    <p className="text-gray-500 mb-4">
                                        {hasFilters
                                            ? 'Try adjusting your search or filter criteria'
                                            : 'No documents have been uploaded yet'}
                                    </p>
                                    {hasFilters && (
                                        <Button variant="outline" onClick={clearFilters}>
                                            Clear Filters
                                        </Button>
                                    )}
                                </Card>
                            ) : (
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {documents.data.map((doc) => (
                                        <Card key={doc.id} className="group hover:shadow-lg transition-shadow">
                                            <CardContent className="p-4">
                                                <div className="flex gap-4">
                                                    {/* File Icon */}
                                                    <div className="flex-shrink-0 w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                                        {getFileIcon(doc.file_type)}
                                                    </div>

                                                    {/* Document Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2 mb-1">
                                                            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
                                                                {doc.title}
                                                            </h3>
                                                        </div>

                                                        <Badge className={`text-xs mb-2 ${categoryColors[doc.category]}`}>
                                                            {categories[doc.category]}
                                                        </Badge>

                                                        {doc.description && (
                                                            <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                                                                {doc.description}
                                                            </p>
                                                        )}

                                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                                            <span className="flex items-center gap-1 uppercase">
                                                                <FileIcon className="h-3 w-3" />
                                                                {doc.file_type}
                                                            </span>
                                                            <span>{doc.file_size_human}</span>
                                                            <span className="flex items-center gap-1">
                                                                <Download className="h-3 w-3" />
                                                                {doc.download_count}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center gap-2 mt-3">
                                                            <Button size="sm" asChild>
                                                                <a href={`/downloads/${doc.slug}/download`} download>
                                                                    <Download className="h-4 w-4 mr-1" />
                                                                    Download
                                                                </a>
                                                            </Button>
                                                            {doc.file_type === 'pdf' && (
                                                                <Button size="sm" variant="outline" asChild>
                                                                    <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                                                                        <Eye className="h-4 w-4 mr-1" />
                                                                        View
                                                                    </a>
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {documents.last_page > 1 && (
                                <div className="flex justify-center gap-2 mt-8">
                                    {documents.links.map((link, index) => (
                                        <Button
                                            key={index}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            disabled={!link.url}
                                            asChild={!!link.url}
                                        >
                                            {link.url ? (
                                                <Link
                                                    href={link.url}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ) : (
                                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                            )}
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Info Section */}
            <section className="py-12 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileCheck className="h-5 w-5 text-green-600" />
                                    Important Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="prose dark:prose-invert max-w-none">
                                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                    <li>All documents are official and issued by Army Public School, Alwar.</li>
                                    <li>Please check the validity period of documents before use.</li>
                                    <li>For any queries regarding documents, please contact the school office.</li>
                                    <li>Latest circulars and notices are regularly updated on this page.</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
