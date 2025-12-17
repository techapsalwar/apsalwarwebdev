import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit, Calendar, Eye, Star, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { type BreadcrumbItem } from '@/types';

interface NewsItem {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    status: 'draft' | 'published' | 'archived';
    is_featured: boolean;
    published_at: string | null;
    featured_image: string | null;
    meta_title: string | null;
    meta_description: string | null;
    created_at: string;
    updated_at: string;
}

interface NewsShowProps {
    item: NewsItem;
}

export default function NewsShow({ item }: NewsShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'News', href: '/admin/news' },
        { title: item.title, href: `/admin/news/${item.id}` },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'published':
                return <Badge className="bg-green-100 text-green-800">Published</Badge>;
            case 'draft':
                return <Badge variant="secondary">Draft</Badge>;
            case 'archived':
                return <Badge variant="outline">Archived</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const featuredImageUrl = item.featured_image
        ? item.featured_image.startsWith('http')
            ? item.featured_image
            : `/storage/${item.featured_image}`
        : null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${item.title} - APS Alwar Admin`} />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/admin/news">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">{item.title}</h1>
                            <p className="text-muted-foreground">News Article Details</p>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href={`/admin/news/${item.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Article
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Featured Image */}
                        {featuredImageUrl && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Featured Image</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <img
                                        src={featuredImageUrl}
                                        alt={item.title}
                                        className="w-full rounded-lg object-cover max-h-96"
                                    />
                                </CardContent>
                            </Card>
                        )}

                        {/* Article Content */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Content</CardTitle>
                                {item.excerpt && (
                                    <CardDescription className="text-base">
                                        {item.excerpt}
                                    </CardDescription>
                                )}
                            </CardHeader>
                            <CardContent>
                                <div 
                                    className="prose prose-sm max-w-none dark:prose-invert"
                                    dangerouslySetInnerHTML={{ __html: item.content }}
                                />
                            </CardContent>
                        </Card>

                        {/* SEO Information */}
                        {(item.meta_title || item.meta_description) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Globe className="h-5 w-5" />
                                        SEO Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {item.meta_title && (
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Meta Title</p>
                                            <p className="mt-1">{item.meta_title}</p>
                                        </div>
                                    )}
                                    {item.meta_description && (
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Meta Description</p>
                                            <p className="mt-1">{item.meta_description}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Status</span>
                                    {getStatusBadge(item.status)}
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Featured</span>
                                    {item.is_featured ? (
                                        <Badge className="bg-amber-100 text-amber-800">
                                            <Star className="mr-1 h-3 w-3" />
                                            Featured
                                        </Badge>
                                    ) : (
                                        <span className="text-sm">No</span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Details Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Slug</p>
                                    <p className="mt-1 font-mono text-sm">{item.slug}</p>
                                </div>
                                <Separator />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        Published At
                                    </p>
                                    <p className="mt-1">{formatDate(item.published_at)}</p>
                                </div>
                                <Separator />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Created At</p>
                                    <p className="mt-1">{formatDate(item.created_at)}</p>
                                </div>
                                <Separator />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                                    <p className="mt-1">{formatDate(item.updated_at)}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button className="w-full" asChild>
                                    <Link href={`/admin/news/${item.id}/edit`}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Article
                                    </Link>
                                </Button>
                                {item.status === 'published' && (
                                    <Button variant="outline" className="w-full" asChild>
                                        <a href={`/news/${item.slug}`} target="_blank" rel="noopener noreferrer">
                                            <Eye className="mr-2 h-4 w-4" />
                                            View on Website
                                        </a>
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
