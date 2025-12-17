import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'News', href: '/admin/news' },
    { title: 'Create', href: '/admin/news/create' },
];

export default function NewsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        excerpt: '',
        content: '',
        status: 'draft',
        is_featured: false,
        published_at: '',
        featured_image: null as File | null,
        meta_title: '',
        meta_description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/news', {
            forceFormData: true,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('featured_image', e.target.files[0]);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create News - APS Alwar Admin" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/news">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Create News Article</h1>
                        <p className="text-muted-foreground">
                            Add a new news article to the school website.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Article Details</CardTitle>
                                <CardDescription>
                                    Enter the main content for your news article.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Enter article title"
                                        className={errors.title ? 'border-destructive' : ''}
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-destructive">{errors.title}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="excerpt">Excerpt</Label>
                                    <Textarea
                                        id="excerpt"
                                        value={data.excerpt}
                                        onChange={(e) => setData('excerpt', e.target.value)}
                                        placeholder="Brief summary of the article (optional)"
                                        rows={3}
                                        className={errors.excerpt ? 'border-destructive' : ''}
                                    />
                                    {errors.excerpt && (
                                        <p className="text-sm text-destructive">{errors.excerpt}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="content">Content *</Label>
                                    <Textarea
                                        id="content"
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        placeholder="Write your article content here..."
                                        rows={12}
                                        className={errors.content ? 'border-destructive' : ''}
                                    />
                                    {errors.content && (
                                        <p className="text-sm text-destructive">{errors.content}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        You can use HTML formatting for rich content.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>SEO Settings</CardTitle>
                                <CardDescription>
                                    Optimize your article for search engines.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="meta_title">Meta Title</Label>
                                    <Input
                                        id="meta_title"
                                        value={data.meta_title}
                                        onChange={(e) => setData('meta_title', e.target.value)}
                                        placeholder="SEO title (leave empty to use article title)"
                                        className={errors.meta_title ? 'border-destructive' : ''}
                                    />
                                    {errors.meta_title && (
                                        <p className="text-sm text-destructive">{errors.meta_title}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="meta_description">Meta Description</Label>
                                    <Textarea
                                        id="meta_description"
                                        value={data.meta_description}
                                        onChange={(e) => setData('meta_description', e.target.value)}
                                        placeholder="SEO description (leave empty to use excerpt)"
                                        rows={3}
                                        className={errors.meta_description ? 'border-destructive' : ''}
                                    />
                                    {errors.meta_description && (
                                        <p className="text-sm text-destructive">{errors.meta_description}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Publishing</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) => setData('status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="published">Published</SelectItem>
                                            <SelectItem value="archived">Archived</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && (
                                        <p className="text-sm text-destructive">{errors.status}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="published_at">Publish Date</Label>
                                    <Input
                                        id="published_at"
                                        type="datetime-local"
                                        value={data.published_at}
                                        onChange={(e) => setData('published_at', e.target.value)}
                                        className={errors.published_at ? 'border-destructive' : ''}
                                    />
                                    {errors.published_at && (
                                        <p className="text-sm text-destructive">{errors.published_at}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Leave empty to publish immediately.
                                    </p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label htmlFor="is_featured">Featured Article</Label>
                                    <Switch
                                        id="is_featured"
                                        checked={data.is_featured}
                                        onCheckedChange={(checked) => setData('is_featured', checked)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Featured Image</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Input
                                        id="featured_image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className={errors.featured_image ? 'border-destructive' : ''}
                                    />
                                    {errors.featured_image && (
                                        <p className="text-sm text-destructive">{errors.featured_image}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Recommended size: 1200x630 pixels (JPG, PNG)
                                    </p>
                                </div>

                                {data.featured_image && (
                                    <div className="rounded-lg border bg-muted/50 p-2">
                                        <p className="text-sm font-medium">Selected:</p>
                                        <p className="text-sm text-muted-foreground truncate">
                                            {data.featured_image.name}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                            <Button 
                                type="submit" 
                                disabled={processing}
                                className="bg-amber-600 hover:bg-amber-700"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Create Article
                                    </>
                                )}
                            </Button>
                            <Button type="button" variant="outline" asChild>
                                <Link href="/admin/news">Cancel</Link>
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
