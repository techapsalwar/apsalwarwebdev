import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    ArrowLeft, 
    Save,
    Upload,
    GraduationCap,
    User,
    Briefcase,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useState, useRef } from 'react';
import { type BreadcrumbItem } from '@/types';

interface Alumni {
    id: number;
    name: string;
    batch_year: string;
    class_section: string | null;
    house: string | null;
    email: string;
    phone: string | null;
    location: string | null;
    photo: string | null;
    photo_url: string | null;
    current_designation: string | null;
    organization: string | null;
    category: string;
    linkedin_url: string | null;
    achievement: string | null;
    story: string | null;
    school_memories: string | null;
    message_to_juniors: string | null;
    is_featured: boolean;
    is_active: boolean;
}

interface Props {
    alumnus: Alumni;
    categories: Record<string, string>;
    houses: Record<string, string>;
}

export default function AdminAlumniEdit({ alumnus, categories, houses }: Props) {
    const [photoPreview, setPhotoPreview] = useState<string | null>(alumnus.photo_url);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Alumni', href: '/admin/alumni' },
        { title: alumnus.name, href: `/admin/alumni/${alumnus.id}` },
        { title: 'Edit', href: `/admin/alumni/${alumnus.id}/edit` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: alumnus.name,
        email: alumnus.email,
        phone: alumnus.phone || '',
        batch_year: alumnus.batch_year,
        class_section: alumnus.class_section || '',
        house: alumnus.house || '',
        category: alumnus.category,
        current_designation: alumnus.current_designation || '',
        organization: alumnus.organization || '',
        location: alumnus.location || '',
        achievement: alumnus.achievement || '',
        story: alumnus.story || '',
        school_memories: alumnus.school_memories || '',
        message_to_juniors: alumnus.message_to_juniors || '',
        linkedin_url: alumnus.linkedin_url || '',
        is_featured: alumnus.is_featured,
        is_active: alumnus.is_active,
        photo: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/alumni/${alumnus.id}`, {
            forceFormData: true,
        });
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('photo', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const currentYear = new Date().getFullYear();
    const batchYears = Array.from({ length: 50 }, (_, i) => currentYear - i);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${alumnus.name} - Alumni`} />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Button variant="ghost" asChild>
                        <Link href={`/admin/alumni/${alumnus.id}`}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Details
                        </Link>
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
                    {/* Personal Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                    />
                                    {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        placeholder="City, Country"
                                    />
                                    {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
                                </div>
                            </div>

                            {/* Photo */}
                            <div className="flex items-center gap-6">
                                <div 
                                    className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer border-2 border-dashed border-gray-300 hover:border-primary transition-colors"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {photoPreview ? (
                                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <Upload className="h-8 w-8 text-gray-400" />
                                    )}
                                </div>
                                <div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handlePhotoChange}
                                    />
                                    <Button 
                                        type="button" 
                                        variant="outline"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        Change Photo
                                    </Button>
                                    <p className="text-xs text-gray-500 mt-2">
                                        JPG, PNG up to 2MB
                                    </p>
                                    {errors.photo && <p className="text-sm text-red-500">{errors.photo}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* School Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <GraduationCap className="h-5 w-5" />
                                School Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="batch_year">Batch Year *</Label>
                                <Select 
                                    value={data.batch_year} 
                                    onValueChange={(value) => setData('batch_year', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select batch year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {batchYears.map((year) => (
                                            <SelectItem key={year} value={year.toString()}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.batch_year && <p className="text-sm text-red-500">{errors.batch_year}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="class_section">Class & Section</Label>
                                <Input
                                    id="class_section"
                                    value={data.class_section}
                                    onChange={(e) => setData('class_section', e.target.value)}
                                    placeholder="e.g., XII-A Science"
                                />
                                {errors.class_section && <p className="text-sm text-red-500">{errors.class_section}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="house">House</Label>
                                <Select 
                                    value={data.house} 
                                    onValueChange={(value) => setData('house', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select house" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(houses).map(([key, label]) => (
                                            <SelectItem key={key} value={key}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.house && <p className="text-sm text-red-500">{errors.house}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Professional Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase className="h-5 w-5" />
                                Professional Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-4">
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
                                            <SelectItem key={key} value={key}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="current_designation">Designation</Label>
                                <Input
                                    id="current_designation"
                                    value={data.current_designation}
                                    onChange={(e) => setData('current_designation', e.target.value)}
                                />
                                {errors.current_designation && <p className="text-sm text-red-500">{errors.current_designation}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="organization">Organization</Label>
                                <Input
                                    id="organization"
                                    value={data.organization}
                                    onChange={(e) => setData('organization', e.target.value)}
                                />
                                {errors.organization && <p className="text-sm text-red-500">{errors.organization}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                                <Input
                                    id="linkedin_url"
                                    type="url"
                                    value={data.linkedin_url}
                                    onChange={(e) => setData('linkedin_url', e.target.value)}
                                />
                                {errors.linkedin_url && <p className="text-sm text-red-500">{errors.linkedin_url}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Story & Content */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Story & Content</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="achievement">Achievements</Label>
                                <Textarea
                                    id="achievement"
                                    value={data.achievement}
                                    onChange={(e) => setData('achievement', e.target.value)}
                                    rows={3}
                                />
                                {errors.achievement && <p className="text-sm text-red-500">{errors.achievement}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="story">Journey After School</Label>
                                <Textarea
                                    id="story"
                                    value={data.story}
                                    onChange={(e) => setData('story', e.target.value)}
                                    rows={4}
                                />
                                {errors.story && <p className="text-sm text-red-500">{errors.story}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="school_memories">School Memories</Label>
                                <Textarea
                                    id="school_memories"
                                    value={data.school_memories}
                                    onChange={(e) => setData('school_memories', e.target.value)}
                                    rows={3}
                                />
                                {errors.school_memories && <p className="text-sm text-red-500">{errors.school_memories}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message_to_juniors">Message to Students</Label>
                                <Textarea
                                    id="message_to_juniors"
                                    value={data.message_to_juniors}
                                    onChange={(e) => setData('message_to_juniors', e.target.value)}
                                    rows={3}
                                />
                                {errors.message_to_juniors && <p className="text-sm text-red-500">{errors.message_to_juniors}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Featured Alumni</Label>
                                    <p className="text-sm text-gray-500">Show in featured section on alumni page</p>
                                </div>
                                <Switch
                                    checked={data.is_featured}
                                    onCheckedChange={(checked) => setData('is_featured', checked)}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Active</Label>
                                    <p className="text-sm text-gray-500">Show on public alumni directory</p>
                                </div>
                                <Switch
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', checked)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit */}
                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" asChild>
                            <Link href={`/admin/alumni/${alumnus.id}`}>Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="h-4 w-4 mr-2" />
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
