import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { type BreadcrumbItem } from '@/types';
import { useRef, useState } from 'react';

const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
];

export default function AlbumsCreate() {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Photo Albums', href: '/admin/albums' },
        { title: 'Create', href: '/admin/albums/create' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        cover_image: null as File | null,
        year: currentYear.toString(),
        month: '',
        status: 'draft',
        is_featured: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/albums', {
            forceFormData: true,
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('cover_image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Album" />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/albums">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Create Album</h1>
                        <p className="text-gray-500">Create a new photo album</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Album Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Album Title *</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="e.g., Annual Sports Day 2024"
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
                                        placeholder="Describe the event or occasion..."
                                        rows={4}
                                    />
                                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="year">Year</Label>
                                        <Select 
                                            value={data.year} 
                                            onValueChange={(value) => setData('year', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select year" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {years.map((year) => (
                                                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.year && <p className="text-sm text-red-500">{errors.year}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="month">Month</Label>
                                        <Select 
                                            value={data.month} 
                                            onValueChange={(value) => setData('month', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select month" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {months.map((month) => (
                                                    <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.month && <p className="text-sm text-red-500">{errors.month}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Cover Image Upload */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Cover Image</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div 
                                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {imagePreview ? (
                                        <div className="space-y-4">
                                            <img 
                                                src={imagePreview} 
                                                alt="Preview" 
                                                className="max-h-48 mx-auto rounded-lg"
                                            />
                                            <p className="text-sm text-gray-500">Click to change cover image</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <Upload className="h-10 w-10 mx-auto text-gray-400" />
                                            <p className="text-gray-600">Click to upload cover image</p>
                                            <p className="text-sm text-gray-400">PNG, JPG up to 2MB. Optional - first uploaded photo will be used if not set.</p>
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                                {errors.cover_image && <p className="text-sm text-red-500 mt-2">{errors.cover_image}</p>}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Publish</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select 
                                        value={data.status} 
                                        onValueChange={(value: 'draft' | 'published') => setData('status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="published">Published</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Featured</Label>
                                        <p className="text-sm text-gray-500">Show in highlights</p>
                                    </div>
                                    <Switch
                                        checked={data.is_featured}
                                        onCheckedChange={(checked) => setData('is_featured', checked)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="p-4">
                                <p className="text-sm text-blue-800">
                                    <strong>Note:</strong> After creating the album, you'll be able to upload photos.
                                </p>
                            </CardContent>
                        </Card>

                        <div className="flex gap-2">
                            <Button type="button" variant="outline" className="flex-1" asChild>
                                <Link href="/admin/albums">Cancel</Link>
                            </Button>
                            <Button type="submit" className="flex-1" disabled={processing}>
                                <Save className="h-4 w-4 mr-2" />
                                {processing ? 'Creating...' : 'Create'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
