import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { ArrowLeft, Save, Upload, Trash2, Star, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { type BreadcrumbItem } from '@/types';
import { useRef, useState, useCallback } from 'react';

interface Photo {
    id: number;
    album_id: number;
    title: string | null;
    filename: string;
    path: string;
    thumbnail_path: string | null;
    alt_text: string | null;
    caption: string | null;
    is_featured: boolean;
    order: number;
}

interface Album {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    cover_image: string | null;
    year: number | null;
    month: number | null;
    status: 'draft' | 'published';
    is_featured: boolean;
    photos: Photo[];
}

interface Props {
    album: Album;
}

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

export default function AlbumsEdit({ album }: Props) {
    const [coverPreview, setCoverPreview] = useState<string | null>(
        album.cover_image ? `/storage/${album.cover_image}` : null
    );
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const photosInputRef = useRef<HTMLInputElement>(null);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Photo Albums', href: '/admin/albums' },
        { title: 'Edit', href: `/admin/albums/${album.slug}/edit` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: album.title,
        description: album.description || '',
        cover_image: null as File | null,
        year: album.year?.toString() || '',
        month: album.month?.toString() || '',
        status: album.status,
        is_featured: album.is_featured,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/albums/${album.slug}`, {
            forceFormData: true,
        });
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('cover_image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePhotoUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        setUploading(true);
        const formData = new FormData();
        Array.from(files).forEach(file => {
            formData.append('photos[]', file);
        });

        router.post(`/admin/albums/${album.slug}/photos`, formData, {
            forceFormData: true,
            onFinish: () => setUploading(false),
            preserveScroll: true,
        });
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        handlePhotoUpload(e.dataTransfer.files);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
    }, []);

    const handleDeletePhoto = (photoId: number) => {
        router.delete(`/admin/albums/${album.slug}/photos/${photoId}`, {
            preserveScroll: true,
        });
    };

    const handleSetCover = (photoId: number) => {
        router.post(`/admin/albums/${album.slug}/photos/${photoId}/set-cover`, {}, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Album - ${album.title}`} />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/albums">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Edit Album</h1>
                        <p className="text-gray-500">{album.title}</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Album Details */}
                        <form onSubmit={handleSubmit}>
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
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-4">
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
                                        </div>

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
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t">
                                        <div>
                                            <Label>Featured Album</Label>
                                            <p className="text-sm text-gray-500">Show in gallery highlights</p>
                                        </div>
                                        <Switch
                                            checked={data.is_featured}
                                            onCheckedChange={(checked) => setData('is_featured', checked)}
                                        />
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <Button type="submit" disabled={processing}>
                                            <Save className="h-4 w-4 mr-2" />
                                            {processing ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </form>

                        {/* Photos Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Photos ({album.photos.length})</CardTitle>
                                <CardDescription>
                                    Upload photos by clicking the upload area or drag and drop
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Upload Area */}
                                <div 
                                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                                        dragOver ? 'border-primary bg-primary/5' : 'hover:border-primary'
                                    } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                                    onClick={() => photosInputRef.current?.click()}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                >
                                    <Upload className="h-10 w-10 mx-auto text-gray-400" />
                                    <p className="text-gray-600 mt-2">
                                        {uploading ? 'Uploading...' : 'Click or drag photos here to upload'}
                                    </p>
                                    <p className="text-sm text-gray-400">PNG, JPG, GIF up to 5MB each</p>
                                </div>
                                <input
                                    ref={photosInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={(e) => handlePhotoUpload(e.target.files)}
                                />

                                {/* Photos Grid */}
                                {album.photos.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                                        {album.photos.map((photo) => (
                                            <div key={photo.id} className="relative group aspect-square">
                                                <img
                                                    src={`/storage/${photo.thumbnail_path || photo.path}`}
                                                    alt={photo.alt_text || photo.filename}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                                {album.cover_image === photo.path && (
                                                    <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                                                        Cover
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-white hover:bg-white/20"
                                                        onClick={() => handleSetCover(photo.id)}
                                                        title="Set as cover"
                                                    >
                                                        <ImageIcon className="h-4 w-4" />
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-white hover:bg-white/20"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Delete Photo?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This will permanently delete this photo.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDeletePhoto(photo.id)}
                                                                    className="bg-red-500 hover:bg-red-600"
                                                                >
                                                                    Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                                                alt="Cover" 
                                                className="w-full h-32 object-cover rounded-lg"
                                            />
                                            <p className="text-xs text-gray-500">Click to change</p>
                                        </div>
                                    ) : (
                                        <div className="py-4">
                                            <Upload className="h-8 w-8 mx-auto text-gray-400" />
                                            <p className="text-sm text-gray-500 mt-2">Upload cover</p>
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={coverInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleCoverChange}
                                />
                            </CardContent>
                        </Card>

                        {/* Quick Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Stats</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Total Photos</span>
                                    <span className="font-medium">{album.photos.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Status</span>
                                    <span className={`font-medium ${album.status === 'published' ? 'text-green-600' : 'text-gray-600'}`}>
                                        {album.status === 'published' ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Featured</span>
                                    <span className="font-medium">{album.is_featured ? 'Yes' : 'No'}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/admin/albums">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Albums
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
