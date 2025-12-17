import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { ArrowLeft, Save, Loader2, Upload, X } from 'lucide-react';
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
import { useState, useRef } from 'react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Staff', href: '/admin/staff' },
    { title: 'Add Staff', href: '/admin/staff/create' },
];

interface Department {
    id: number;
    name: string;
}

interface StaffCreateProps {
    departments: Department[];
    types: Record<string, string>;
}

export default function StaffCreate({ departments, types }: StaffCreateProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [subjects, setSubjects] = useState<string[]>([]);
    const [newSubject, setNewSubject] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        designation: '',
        department_id: '',
        photo: null as File | null,
        email: '',
        phone: '',
        qualifications: '',
        experience: '',
        bio: '',
        subjects: [] as string[],
        type: 'teaching',
        joining_date: '',
        is_active: true,
        show_on_website: true,
        order: 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        
        Object.entries(data).forEach(([key, value]) => {
            if (key === 'photo' && value instanceof File) {
                formData.append(key, value);
            } else if (key === 'subjects') {
                formData.append(key, JSON.stringify(subjects));
            } else if (typeof value === 'boolean') {
                formData.append(key, value ? '1' : '0');
            } else if (value !== null && value !== '') {
                formData.append(key, String(value));
            }
        });

        router.post('/admin/staff', formData, {
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

    const removePhoto = () => {
        setData('photo', null);
        setPhotoPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const addSubject = () => {
        if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
            setSubjects([...subjects, newSubject.trim()]);
            setNewSubject('');
        }
    };

    const removeSubject = (subject: string) => {
        setSubjects(subjects.filter(s => s !== subject));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Staff Member - APS Alwar Admin" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/staff">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Add Staff Member</h1>
                        <p className="text-muted-foreground">
                            Add a new staff member to the school directory.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>
                                    Enter the staff member's personal details.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name *</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Enter full name"
                                            required
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-destructive">{errors.name}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="designation">Designation *</Label>
                                        <Input
                                            id="designation"
                                            value={data.designation}
                                            onChange={(e) => setData('designation', e.target.value)}
                                            placeholder="e.g., PGT Mathematics"
                                            required
                                        />
                                        {errors.designation && (
                                            <p className="text-sm text-destructive">{errors.designation}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Staff Type *</Label>
                                        <Select value={data.type} onValueChange={(v) => setData('type', v)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(types).map(([key, label]) => (
                                                    <SelectItem key={key} value={key}>{label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.type && (
                                            <p className="text-sm text-destructive">{errors.type}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="department_id">Department</Label>
                                        <Select 
                                            value={data.department_id} 
                                            onValueChange={(v) => setData('department_id', v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">No Department</SelectItem>
                                                {departments.map((dept) => (
                                                    <SelectItem key={dept.id} value={dept.id.toString()}>
                                                        {dept.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.department_id && (
                                            <p className="text-sm text-destructive">{errors.department_id}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="email@apsalwar.edu.in"
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-destructive">{errors.email}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder="+91 XXXXX XXXXX"
                                        />
                                        {errors.phone && (
                                            <p className="text-sm text-destructive">{errors.phone}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="joining_date">Joining Date</Label>
                                    <Input
                                        id="joining_date"
                                        type="date"
                                        value={data.joining_date}
                                        onChange={(e) => setData('joining_date', e.target.value)}
                                    />
                                    {errors.joining_date && (
                                        <p className="text-sm text-destructive">{errors.joining_date}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Professional Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Professional Details</CardTitle>
                                <CardDescription>
                                    Add qualifications, experience, and subjects taught.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="qualifications">Qualifications</Label>
                                    <Input
                                        id="qualifications"
                                        value={data.qualifications}
                                        onChange={(e) => setData('qualifications', e.target.value)}
                                        placeholder="e.g., M.Sc., B.Ed."
                                    />
                                    {errors.qualifications && (
                                        <p className="text-sm text-destructive">{errors.qualifications}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="experience">Experience</Label>
                                    <Input
                                        id="experience"
                                        value={data.experience}
                                        onChange={(e) => setData('experience', e.target.value)}
                                        placeholder="e.g., 10+ years in teaching"
                                    />
                                    {errors.experience && (
                                        <p className="text-sm text-destructive">{errors.experience}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        value={data.bio}
                                        onChange={(e) => setData('bio', e.target.value)}
                                        placeholder="Brief bio about the staff member..."
                                        rows={4}
                                    />
                                    {errors.bio && (
                                        <p className="text-sm text-destructive">{errors.bio}</p>
                                    )}
                                </div>

                                {/* Subjects */}
                                <div className="space-y-2">
                                    <Label>Subjects Taught</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={newSubject}
                                            onChange={(e) => setNewSubject(e.target.value)}
                                            placeholder="Add subject"
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSubject())}
                                        />
                                        <Button type="button" variant="secondary" onClick={addSubject}>
                                            Add
                                        </Button>
                                    </div>
                                    {subjects.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {subjects.map((subject) => (
                                                <span
                                                    key={subject}
                                                    className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-secondary rounded-md"
                                                >
                                                    {subject}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSubject(subject)}
                                                        className="text-muted-foreground hover:text-foreground"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Photo Upload */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Photo</CardTitle>
                                <CardDescription>
                                    Upload a profile photo.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    className="hidden"
                                />
                                {photoPreview ? (
                                    <div className="relative">
                                        <img
                                            src={photoPreview}
                                            alt="Preview"
                                            className="w-full aspect-square object-cover rounded-lg"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2"
                                            onClick={removePhoto}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                                    >
                                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">
                                            Click to upload photo
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            PNG, JPG up to 2MB
                                        </p>
                                    </div>
                                )}
                                {errors.photo && (
                                    <p className="text-sm text-destructive">{errors.photo}</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Status & Visibility */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Status & Visibility</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Active Status</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Is this staff member currently active?
                                        </p>
                                    </div>
                                    <Switch
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Show on Website</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Display in the public staff directory?
                                        </p>
                                    </div>
                                    <Switch
                                        checked={data.show_on_website}
                                        onCheckedChange={(checked) => setData('show_on_website', checked)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="order">Display Order</Label>
                                    <Input
                                        id="order"
                                        type="number"
                                        min="0"
                                        value={data.order}
                                        onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-700" disabled={processing}>
                                {processing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Staff
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
