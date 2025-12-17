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

interface Club {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    icon: string | null;
    in_charge: string | null;
    meeting_schedule: string | null;
    is_active: boolean;
    accepts_enrollment: boolean;
}

interface Props {
    club: Club;
    icons: Record<string, string>;
}

export default function ClubsEdit({ club, icons }: Props) {
    const [imagePreview, setImagePreview] = useState<string | null>(
        club.image ? `/storage/${club.image}` : null
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Clubs', href: '/admin/clubs' },
        { title: 'Edit', href: `/admin/clubs/${club.slug}/edit` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: club.name,
        description: club.description || '',
        image: null as File | null,
        icon: club.icon || '',
        in_charge: club.in_charge || '',
        meeting_schedule: club.meeting_schedule || '',
        is_active: club.is_active,
        accepts_enrollment: club.accepts_enrollment,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/clubs/${club.slug}`, {
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
            <Head title={`Edit Club - ${club.name}`} />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/clubs">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Edit Club</h1>
                        <p className="text-gray-500">Update club details</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Club Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Club Name *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g., Music Club"
                                        required
                                    />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Describe the club's activities and objectives..."
                                        rows={4}
                                    />
                                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="icon">Category / Icon</Label>
                                        <Select 
                                            value={data.icon} 
                                            onValueChange={(value) => setData('icon', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(icons).map(([key, label]) => (
                                                    <SelectItem key={key} value={key}>{label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.icon && <p className="text-sm text-red-500">{errors.icon}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="in_charge">In-Charge / Coordinator</Label>
                                        <Input
                                            id="in_charge"
                                            value={data.in_charge}
                                            onChange={(e) => setData('in_charge', e.target.value)}
                                            placeholder="e.g., Mr. Sharma"
                                        />
                                        {errors.in_charge && <p className="text-sm text-red-500">{errors.in_charge}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="meeting_schedule">Meeting Schedule</Label>
                                    <Input
                                        id="meeting_schedule"
                                        value={data.meeting_schedule}
                                        onChange={(e) => setData('meeting_schedule', e.target.value)}
                                        placeholder="e.g., Every Saturday, 3:00 PM"
                                    />
                                    {errors.meeting_schedule && <p className="text-sm text-red-500">{errors.meeting_schedule}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Image Upload */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Club Image</CardTitle>
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
                                            <p className="text-gray-600">Click to upload club image</p>
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
                                        <Label>Accept Enrollment</Label>
                                        <p className="text-sm text-gray-500">Allow students to join</p>
                                    </div>
                                    <Switch
                                        checked={data.accepts_enrollment}
                                        onCheckedChange={(checked) => setData('accepts_enrollment', checked)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex gap-2">
                            <Button type="button" variant="outline" className="flex-1" asChild>
                                <Link href="/admin/clubs">Cancel</Link>
                            </Button>
                            <Button type="submit" className="flex-1" disabled={processing}>
                                <Save className="h-4 w-4 mr-2" />
                                {processing ? 'Updating...' : 'Update'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
