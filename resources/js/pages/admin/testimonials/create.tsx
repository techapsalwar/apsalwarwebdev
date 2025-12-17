import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Upload, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { type BreadcrumbItem } from '@/types';
import { useRef, useState } from 'react';

interface Props {
    types: Record<string, string>;
}

export default function TestimonialsCreate({ types }: Props) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Testimonials', href: '/admin/testimonials' },
        { title: 'Create', href: '/admin/testimonials/create' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        content: '',
        photo: null as File | null,
        type: '',
        designation: '',
        rating: 5,
        is_featured: false,
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/testimonials', {
            forceFormData: true,
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('photo', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Testimonial" />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/testimonials">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Add Testimonial</h1>
                        <p className="text-gray-500">Create a new testimonial</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Testimonial Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name *</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="e.g., Rahul Sharma"
                                            required
                                        />
                                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="type">Type *</Label>
                                        <Select 
                                            value={data.type} 
                                            onValueChange={(value) => setData('type', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(types).map(([key, label]) => (
                                                    <SelectItem key={key} value={key}>{label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="designation">Designation / Class</Label>
                                    <Input
                                        id="designation"
                                        value={data.designation}
                                        onChange={(e) => setData('designation', e.target.value)}
                                        placeholder="e.g., Class XII Student, 2024 or Parent of Rahul"
                                    />
                                    {errors.designation && <p className="text-sm text-red-500">{errors.designation}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="content">Testimonial Content *</Label>
                                    <Textarea
                                        id="content"
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        placeholder="Write the testimonial here..."
                                        rows={6}
                                        required
                                    />
                                    {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
                                </div>

                                {/* Rating */}
                                <div className="space-y-2">
                                    <Label>Rating</Label>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setData('rating', star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(null)}
                                                className="p-1"
                                            >
                                                <Star
                                                    className={`h-6 w-6 transition-colors ${
                                                        star <= (hoverRating || data.rating)
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-gray-300'
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Photo Upload */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Photo</CardTitle>
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
                                                className="h-24 w-24 mx-auto rounded-full object-cover"
                                            />
                                            <p className="text-sm text-gray-500">Click to change photo</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <Upload className="h-10 w-10 mx-auto text-gray-400" />
                                            <p className="text-gray-600">Click to upload photo</p>
                                            <p className="text-sm text-gray-400">JPG, PNG up to 1MB</p>
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
                                {errors.photo && <p className="text-sm text-red-500 mt-2">{errors.photo}</p>}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
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

                        <div className="flex gap-2">
                            <Button type="button" variant="outline" className="flex-1" asChild>
                                <Link href="/admin/testimonials">Cancel</Link>
                            </Button>
                            <Button type="submit" className="flex-1" disabled={processing}>
                                <Save className="h-4 w-4 mr-2" />
                                {processing ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
