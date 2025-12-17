import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { type BreadcrumbItem } from '@/types';

interface QuickLink {
    id: number;
    title: string;
    url: string;
    icon: string | null;
    target: '_self' | '_blank';
    is_active: boolean;
    is_new: boolean;
}

interface Props {
    quickLink: QuickLink;
    icons: Record<string, string>;
}

export default function QuickLinksEdit({ quickLink, icons }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Quick Links', href: '/admin/quick-links' },
        { title: 'Edit', href: `/admin/quick-links/${quickLink.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        title: quickLink.title,
        url: quickLink.url,
        icon: quickLink.icon || '',
        target: quickLink.target,
        is_active: quickLink.is_active,
        is_new: quickLink.is_new,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/quick-links/${quickLink.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Quick Link - ${quickLink.title}`} />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/quick-links">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Edit Quick Link</h1>
                        <p className="text-gray-500">{quickLink.title}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Link Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g., Admissions"
                                    required
                                />
                                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="url">URL *</Label>
                                <Input
                                    id="url"
                                    value={data.url}
                                    onChange={(e) => setData('url', e.target.value)}
                                    placeholder="e.g., /admissions or https://example.com"
                                    required
                                />
                                {errors.url && <p className="text-sm text-red-500">{errors.url}</p>}
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="icon">Icon</Label>
                                    <Select 
                                        value={data.icon} 
                                        onValueChange={(value) => setData('icon', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select an icon" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(icons).map(([key, label]) => (
                                                <SelectItem key={key} value={key}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.icon && <p className="text-sm text-red-500">{errors.icon}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="target">Open In</Label>
                                    <Select 
                                        value={data.target} 
                                        onValueChange={(value) => setData('target', value as '_self' | '_blank')}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select target" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="_self">Same Tab</SelectItem>
                                            <SelectItem value="_blank">New Tab</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.target && <p className="text-sm text-red-500">{errors.target}</p>}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t">
                                <div>
                                    <Label>Active</Label>
                                    <p className="text-sm text-gray-500">Show this link on homepage</p>
                                </div>
                                <Switch
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between rounded-lg border p-4 bg-amber-50/60">
                                <div>
                                    <p className="font-medium">Show "New" badge</p>
                                    <p className="text-sm text-gray-500">Adds a sparkling badge beside this quick link.</p>
                                </div>
                                <Switch
                                    checked={data.is_new}
                                    onCheckedChange={(checked) => setData('is_new', checked)}
                                />
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button type="button" variant="outline" className="flex-1" asChild>
                                    <Link href="/admin/quick-links">Cancel</Link>
                                </Button>
                                <Button type="submit" className="flex-1" disabled={processing}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {processing ? 'Saving...' : 'Update'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
