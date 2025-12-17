import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Plus, X, Upload, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState, useRef } from 'react';
import { type BreadcrumbItem } from '@/types';

interface CommitteeType {
    value: string;
    label: string;
}

interface MemberData {
    id: string;
    name: string;
    designation: string;
    role: string;
    email: string;
    phone: string;
    organization: string;
    bio: string;
    photo: File | null;
    photoPreview: string | null;
}

interface Props {
    types: CommitteeType[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Committees', href: '/admin/committees' },
    { title: 'Create', href: '/admin/committees/create' },
];

function getInitials(name: string) {
    if (!name) return 'M';
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

export default function CommitteeCreate({ types }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        type: 'smc',
        description: '',
        session: '',
        functions: '',
        image: null as File | null,
        is_active: true,
        order: 0,
    });

    const [members, setMembers] = useState<MemberData[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('type', data.type);
        formData.append('description', data.description);
        formData.append('session', data.session);
        formData.append('functions', data.functions);
        formData.append('is_active', data.is_active ? '1' : '0');
        formData.append('order', data.order.toString());
        
        if (data.image) {
            formData.append('image', data.image);
        }

        // Append members
        members.forEach((member, index) => {
            formData.append(`members[${index}][name]`, member.name);
            formData.append(`members[${index}][designation]`, member.designation);
            formData.append(`members[${index}][role]`, member.role);
            formData.append(`members[${index}][email]`, member.email);
            formData.append(`members[${index}][phone]`, member.phone);
            formData.append(`members[${index}][organization]`, member.organization);
            formData.append(`members[${index}][bio]`, member.bio);
            formData.append(`members[${index}][order]`, index.toString());
            if (member.photo) {
                formData.append(`members[${index}][photo]`, member.photo);
            }
        });

        router.post('/admin/committees', formData, {
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

    const addMember = () => {
        setMembers([...members, {
            id: Math.random().toString(36).slice(2),
            name: '',
            designation: '',
            role: '',
            email: '',
            phone: '',
            organization: '',
            bio: '',
            photo: null,
            photoPreview: null,
        }]);
    };

    const removeMember = (id: string) => {
        setMembers(members.filter(m => m.id !== id));
    };

    const updateMember = (id: string, field: keyof MemberData, value: string | File | null) => {
        setMembers(members.map(m => {
            if (m.id !== id) return m;
            
            if (field === 'photo' && value instanceof File) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setMembers(prev => prev.map(pm => 
                        pm.id === id ? { ...pm, photo: value, photoPreview: reader.result as string } : pm
                    ));
                };
                reader.readAsDataURL(value);
                return { ...m, photo: value };
            }
            
            return { ...m, [field]: value };
        }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Committee - APS Alwar Admin" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/committees">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Create Committee</h1>
                        <p className="text-muted-foreground">
                            Add a new committee with its members.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Basic Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Committee Details</CardTitle>
                                    <CardDescription>
                                        Basic information about the committee.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Committee Name *</Label>
                                            <Input
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="e.g., School Management Committee"
                                                required
                                            />
                                            {errors.name && (
                                                <p className="text-sm text-destructive">{errors.name}</p>
                                            )}
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
                                                    {types.map((type) => (
                                                        <SelectItem key={type.value} value={type.value}>
                                                            {type.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.type && (
                                                <p className="text-sm text-destructive">{errors.type}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="session">Session</Label>
                                        <Input
                                            id="session"
                                            value={data.session}
                                            onChange={(e) => setData('session', e.target.value)}
                                            placeholder="e.g., 2024-25"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Brief description of the committee's purpose..."
                                            rows={3}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="functions">Functions (one per line)</Label>
                                        <Textarea
                                            id="functions"
                                            value={data.functions}
                                            onChange={(e) => setData('functions', e.target.value)}
                                            placeholder="Enter each function on a new line..."
                                            rows={4}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            List the key responsibilities and functions of this committee.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Members */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Committee Members</CardTitle>
                                            <CardDescription>
                                                Add members to this committee.
                                            </CardDescription>
                                        </div>
                                        <Button type="button" onClick={addMember} variant="outline" size="sm">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Member
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {members.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                                            <User className="h-10 w-10 mx-auto mb-3 opacity-50" />
                                            <p className="font-medium">No members added yet</p>
                                            <p className="text-sm">Click "Add Member" to start adding committee members.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {members.map((member, index) => (
                                                <div
                                                    key={member.id}
                                                    className="relative border rounded-lg p-4 bg-muted/30"
                                                >
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute top-2 right-2 h-6 w-6"
                                                        onClick={() => removeMember(member.id)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>

                                                    <div className="flex gap-4 mb-4">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <Avatar className="h-16 w-16">
                                                                {member.photoPreview ? (
                                                                    <AvatarImage src={member.photoPreview} />
                                                                ) : null}
                                                                <AvatarFallback className="bg-amber-100 text-amber-700">
                                                                    {getInitials(member.name)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <label className="cursor-pointer">
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    className="hidden"
                                                                    onChange={(e) => {
                                                                        const file = e.target.files?.[0];
                                                                        if (file) {
                                                                            updateMember(member.id, 'photo', file);
                                                                        }
                                                                    }}
                                                                />
                                                                <span className="text-xs text-primary hover:underline">
                                                                    Upload Photo
                                                                </span>
                                                            </label>
                                                        </div>

                                                        <div className="flex-1 grid gap-3 sm:grid-cols-2">
                                                            <div className="space-y-1">
                                                                <Label className="text-xs">Name *</Label>
                                                                <Input
                                                                    value={member.name}
                                                                    onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                                                                    placeholder="Full name"
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <Label className="text-xs">Designation *</Label>
                                                                <Input
                                                                    value={member.designation}
                                                                    onChange={(e) => updateMember(member.id, 'designation', e.target.value)}
                                                                    placeholder="e.g., Chairman, Member"
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <Label className="text-xs">Role</Label>
                                                                <Input
                                                                    value={member.role}
                                                                    onChange={(e) => updateMember(member.id, 'role', e.target.value)}
                                                                    placeholder="e.g., Parent Representative"
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <Label className="text-xs">Organization</Label>
                                                                <Input
                                                                    value={member.organization}
                                                                    onChange={(e) => updateMember(member.id, 'organization', e.target.value)}
                                                                    placeholder="Company or institution"
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <Label className="text-xs">Email</Label>
                                                                <Input
                                                                    type="email"
                                                                    value={member.email}
                                                                    onChange={(e) => updateMember(member.id, 'email', e.target.value)}
                                                                    placeholder="email@example.com"
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <Label className="text-xs">Phone</Label>
                                                                <Input
                                                                    value={member.phone}
                                                                    onChange={(e) => updateMember(member.id, 'phone', e.target.value)}
                                                                    placeholder="+91 98765 43210"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <Label className="text-xs">Bio</Label>
                                                        <Textarea
                                                            value={member.bio}
                                                            onChange={(e) => updateMember(member.id, 'bio', e.target.value)}
                                                            placeholder="Brief background about this member..."
                                                            rows={2}
                                                        />
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
                            {/* Publish */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Publish</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="is_active">Active</Label>
                                        <Switch
                                            id="is_active"
                                            checked={data.is_active}
                                            onCheckedChange={(checked) => setData('is_active', checked)}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Inactive committees won't be visible on the website.
                                    </p>

                                    <div className="space-y-2">
                                        <Label htmlFor="order">Display Order</Label>
                                        <Input
                                            id="order"
                                            type="number"
                                            value={data.order}
                                            onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
                                            min={0}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Lower numbers appear first.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Image */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Committee Image</CardTitle>
                                    <CardDescription>
                                        Optional banner image for the committee.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div 
                                        className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="max-h-40 mx-auto rounded-lg"
                                            />
                                        ) : (
                                            <>
                                                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                                <p className="text-sm text-muted-foreground">
                                                    Click to upload image
                                                </p>
                                            </>
                                        )}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                    {imagePreview && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="mt-2 w-full"
                                            onClick={() => {
                                                setData('image', null);
                                                setImagePreview(null);
                                            }}
                                        >
                                            Remove Image
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Submit */}
                            <Button 
                                type="submit" 
                                className="w-full bg-amber-600 hover:bg-amber-700"
                                disabled={processing}
                            >
                                <Save className="mr-2 h-4 w-4" />
                                {processing ? 'Creating...' : 'Create Committee'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
