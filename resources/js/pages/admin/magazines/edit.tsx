import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Upload, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { type BreadcrumbItem } from '@/types';
import { useRef, useState } from 'react';

interface Magazine {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    cover_image: string | null;
    cover_url: string | null;
    pdf_path: string;
    pdf_url: string;
    issue_date: string;
    issue_number: string | null;
    is_featured: boolean;
    is_active: boolean;
    file_size: number;
}

interface Props {
    magazine: Magazine;
}

export default function MagazinesEdit({ magazine }: Props) {
    const [pdfFileName, setPdfFileName] = useState<string | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(magazine.cover_url);
    const pdfInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'E-Magazines', href: '/admin/magazines' },
        { title: 'Edit', href: `/admin/magazines/${magazine.slug}/edit` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: magazine.title,
        description: magazine.description || '',
        pdf: null as File | null,
        cover_image: null as File | null,
        issue_date: magazine.issue_date ? magazine.issue_date.split('T')[0] : '',
        issue_number: magazine.issue_number || '',
        is_active: magazine.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/magazines/${magazine.slug}`, {
            forceFormData: true,
        });
    };

    const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('pdf', file);
            setPdfFileName(file.name);
        }
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('cover_image', file);
            const reader = new FileReader();
            reader.onload = (ev) => setCoverPreview(ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit: ${magazine.title}`} />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/magazines">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Edit E-Magazine</h1>
                        <p className="text-gray-500">{magazine.title}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* PDF Upload */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Magazine PDF</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div
                                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                                    onClick={() => pdfInputRef.current?.click()}
                                >
                                    {pdfFileName ? (
                                        <div className="space-y-2">
                                            <Upload className="h-10 w-10 mx-auto text-green-500" />
                                            <p className="text-gray-800 dark:text-gray-200 font-medium">{pdfFileName}</p>
                                            <p className="text-sm text-gray-500">New file selected — click to change</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <Upload className="h-10 w-10 mx-auto text-gray-400" />
                                            <p className="text-gray-600 dark:text-gray-400">Current PDF uploaded</p>
                                            <p className="text-sm text-gray-500">Click to replace with a new file (optional)</p>
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={pdfInputRef}
                                    type="file"
                                    accept=".pdf"
                                    className="hidden"
                                    onChange={handlePdfChange}
                                />
                                {errors.pdf && <p className="text-sm text-red-500 mt-2">{errors.pdf}</p>}
                            </CardContent>
                        </Card>

                        {/* Magazine Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Magazine Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="e.g., APS Alwar Newsletter - April 2026"
                                        required
                                    />
                                    {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Brief description of this magazine issue..."
                                        rows={3}
                                    />
                                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="issue_date">Issue Date *</Label>
                                        <Input
                                            id="issue_date"
                                            type="date"
                                            value={data.issue_date}
                                            onChange={(e) => setData('issue_date', e.target.value)}
                                            required
                                        />
                                        {errors.issue_date && <p className="text-sm text-red-500">{errors.issue_date}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="issue_number">Issue Number</Label>
                                        <Input
                                            id="issue_number"
                                            value={data.issue_number}
                                            onChange={(e) => setData('issue_number', e.target.value)}
                                            placeholder="e.g., Vol 3, Issue 1"
                                        />
                                        {errors.issue_number && <p className="text-sm text-red-500">{errors.issue_number}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Cover Image */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Cover Image</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div
                                    className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
                                    onClick={() => coverInputRef.current?.click()}
                                >
                                    {coverPreview ? (
                                        <div className="space-y-2">
                                            <img
                                                src={coverPreview}
                                                alt="Cover preview"
                                                className="max-h-48 mx-auto rounded shadow-sm"
                                            />
                                            <p className="text-sm text-gray-500">Click to change</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2 py-4">
                                            <ImageIcon className="h-10 w-10 mx-auto text-gray-400" />
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Upload cover image</p>
                                            <p className="text-xs text-gray-400">JPG, PNG, WebP up to 2MB</p>
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={coverInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="hidden"
                                    onChange={handleCoverChange}
                                />
                                {errors.cover_image && <p className="text-sm text-red-500 mt-2">{errors.cover_image}</p>}
                            </CardContent>
                        </Card>

                        {/* Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Active</Label>
                                        <p className="text-sm text-gray-500">Show on website</p>
                                    </div>
                                    <Switch
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex gap-2">
                            <Button type="button" variant="outline" className="flex-1" asChild>
                                <Link href="/admin/magazines">Cancel</Link>
                            </Button>
                            <Button type="submit" className="flex-1" disabled={processing}>
                                <Save className="h-4 w-4 mr-2" />
                                {processing ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
