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

interface Slider {
    id: number;
    title: string;
    subtitle: string | null;
    description: string | null;
    image: string;
    button_text: string | null;
    button_link: string | null;
    button_text_2: string | null;
    button_link_2: string | null;
    text_position: string;
    is_active: boolean;
    start_date: string | null;
    end_date: string | null;
}

interface Props {
    slider: Slider;
}

export default function SlidersEdit({ slider }: Props) {
    const getImageUrl = (image: string) => {
        return image.startsWith('http') ? image : `/storage/${image}`;
    };

    const [imagePreview, setImagePreview] = useState<string | null>(getImageUrl(slider.image));
    const fileInputRef = useRef<HTMLInputElement>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Sliders', href: '/admin/sliders' },
        { title: 'Edit', href: `/admin/sliders/${slider.id}/edit` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: slider.title,
        subtitle: slider.subtitle || '',
        description: slider.description || '',
        image: null as File | null,
        button_text: slider.button_text || '',
        button_link: slider.button_link || '',
        button_text_2: slider.button_text_2 || '',
        button_link_2: slider.button_link_2 || '',
        text_position: slider.text_position,
        is_active: slider.is_active,
        start_date: slider.start_date || '',
        end_date: slider.end_date || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/sliders/${slider.id}`, {
            forceFormData: true,
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Slider - ${slider.title}`} />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/sliders">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Edit Slider</h1>
                        <p className="text-gray-500">{slider.title}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Slider Content</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="e.g., Welcome to APS Alwar"
                                        required
                                    />
                                    {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subtitle">Subtitle</Label>
                                    <Input
                                        id="subtitle"
                                        value={data.subtitle}
                                        onChange={(e) => setData('subtitle', e.target.value)}
                                        placeholder="e.g., Excellence in Education Since 1978"
                                    />
                                    {errors.subtitle && <p className="text-sm text-red-500">{errors.subtitle}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Brief description for the slide..."
                                        rows={3}
                                    />
                                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="text_position">Text Position</Label>
                                    <Select 
                                        value={data.text_position} 
                                        onValueChange={(value) => setData('text_position', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select position" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="left">Left</SelectItem>
                                            <SelectItem value="center">Center</SelectItem>
                                            <SelectItem value="right">Right</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.text_position && <p className="text-sm text-red-500">{errors.text_position}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Buttons */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Call to Action Buttons</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="button_text">Button 1 Text</Label>
                                        <Input
                                            id="button_text"
                                            value={data.button_text}
                                            onChange={(e) => setData('button_text', e.target.value)}
                                            placeholder="e.g., Learn More"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="button_link">Button 1 Link</Label>
                                        <Input
                                            id="button_link"
                                            value={data.button_link}
                                            onChange={(e) => setData('button_link', e.target.value)}
                                            placeholder="e.g., /about"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="button_text_2">Button 2 Text</Label>
                                        <Input
                                            id="button_text_2"
                                            value={data.button_text_2}
                                            onChange={(e) => setData('button_text_2', e.target.value)}
                                            placeholder="e.g., Apply Now"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="button_link_2">Button 2 Link</Label>
                                        <Input
                                            id="button_link_2"
                                            value={data.button_link_2}
                                            onChange={(e) => setData('button_link_2', e.target.value)}
                                            placeholder="e.g., /admissions"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Image Upload */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Slider Image</CardTitle>
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
                                                className="max-h-64 mx-auto rounded-lg"
                                            />
                                            <p className="text-sm text-gray-500">Click to change image</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <Upload className="h-10 w-10 mx-auto text-gray-400" />
                                            <p className="text-gray-600">Click to upload slider image</p>
                                            <p className="text-sm text-gray-400">
                                                Recommended: 1920x600px, Max 5MB
                                            </p>
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
                                {errors.image && <p className="text-sm text-red-500 mt-2">{errors.image}</p>}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Active</Label>
                                        <p className="text-sm text-gray-500">Show on homepage</p>
                                    </div>
                                    <Switch
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Schedule */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Schedule (Optional)</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="start_date">Start Date</Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                    />
                                    {errors.start_date && <p className="text-sm text-red-500">{errors.start_date}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="end_date">End Date</Label>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                    />
                                    {errors.end_date && <p className="text-sm text-red-500">{errors.end_date}</p>}
                                </div>

                                <p className="text-xs text-gray-500">
                                    Leave empty to show slider indefinitely
                                </p>
                            </CardContent>
                        </Card>

                        {/* Submit */}
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" className="flex-1" asChild>
                                <Link href="/admin/sliders">Cancel</Link>
                            </Button>
                            <Button type="submit" className="flex-1" disabled={processing}>
                                <Save className="h-4 w-4 mr-2" />
                                {processing ? 'Saving...' : 'Update'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
