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

interface Props {
    categories: Record<string, string>;
    levels: Record<string, string>;
}

export default function AchievementsCreate({ categories, levels }: Props) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Achievements', href: '/admin/achievements' },
        { title: 'Create', href: '/admin/achievements/create' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        image: null as File | null,
        category: '',
        level: '',
        achiever_name: '',
        achiever_class: '',
        achievement_date: '',
        academic_year: '',
        is_featured: false,
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/achievements', {
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
            <Head title="Add Achievement" />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/achievements">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Add Achievement</h1>
                        <p className="text-gray-500">Record a new school achievement</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Achievement Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="e.g., First Prize in Science Olympiad"
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
                                        placeholder="Describe the achievement..."
                                        rows={4}
                                    />
                                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category *</Label>
                                        <Select 
                                            value={data.category} 
                                            onValueChange={(value) => setData('category', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(categories).map(([key, label]) => (
                                                    <SelectItem key={key} value={key}>{label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="level">Level *</Label>
                                        <Select 
                                            value={data.level} 
                                            onValueChange={(value) => setData('level', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(levels).map(([key, label]) => (
                                                    <SelectItem key={key} value={key}>{label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.level && <p className="text-sm text-red-500">{errors.level}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Achiever Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="achiever_name">Student / Faculty Name</Label>
                                        <Input
                                            id="achiever_name"
                                            value={data.achiever_name}
                                            onChange={(e) => setData('achiever_name', e.target.value)}
                                            placeholder="e.g., Rahul Sharma"
                                        />
                                        {errors.achiever_name && <p className="text-sm text-red-500">{errors.achiever_name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="achiever_class">Class / Designation</Label>
                                        <Input
                                            id="achiever_class"
                                            value={data.achiever_class}
                                            onChange={(e) => setData('achiever_class', e.target.value)}
                                            placeholder="e.g., Class XII-A"
                                        />
                                        {errors.achiever_class && <p className="text-sm text-red-500">{errors.achiever_class}</p>}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="achievement_date">Achievement Date</Label>
                                        <Input
                                            id="achievement_date"
                                            type="date"
                                            value={data.achievement_date}
                                            onChange={(e) => setData('achievement_date', e.target.value)}
                                        />
                                        {errors.achievement_date && <p className="text-sm text-red-500">{errors.achievement_date}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="academic_year">Academic Year</Label>
                                        <Input
                                            id="academic_year"
                                            value={data.academic_year}
                                            onChange={(e) => setData('academic_year', e.target.value)}
                                            placeholder="e.g., 2024-25"
                                        />
                                        {errors.academic_year && <p className="text-sm text-red-500">{errors.academic_year}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Image Upload */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Achievement Image</CardTitle>
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
                                            <p className="text-sm text-gray-500">Click to change image</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <Upload className="h-10 w-10 mx-auto text-gray-400" />
                                            <p className="text-gray-600">Click to upload image</p>
                                            <p className="text-sm text-gray-400">PNG, JPG up to 2MB</p>
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
                                        <p className="text-sm text-gray-500">Highlight this achievement</p>
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
                                <Link href="/admin/achievements">Cancel</Link>
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
