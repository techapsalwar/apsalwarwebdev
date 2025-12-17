import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Plus, X, Upload, User, GripVertical, Trash2 } from 'lucide-react';
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState, useRef } from 'react';
import { type BreadcrumbItem } from '@/types';

interface CommitteeType {
    value: string;
    label: string;
}

interface ExistingMember {
    id: number;
    name: string;
    designation: string;
    role: string | null;
    email: string | null;
    phone: string | null;
    photo: string | null;
    organization: string | null;
    bio: string | null;
    order: number;
    is_active: boolean;
}

interface Committee {
    id: number;
    name: string;
    slug: string;
    type: string;
    description: string | null;
    session: string | null;
    functions: string[] | null;
    image: string | null;
    is_active: boolean;
    order: number;
    members: ExistingMember[];
}

interface NewMemberData {
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
    isNew: true;
}

interface Props {
    committee: Committee;
    types: CommitteeType[];
}

function getInitials(name: string) {
    if (!name) return 'M';
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

export default function CommitteeEdit({ committee, types }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Committees', href: '/admin/committees' },
        { title: committee.name, href: `/admin/committees/${committee.id}/edit` },
    ];

    const { data, setData, processing, errors } = useForm({
        name: committee.name,
        type: committee.type,
        description: committee.description || '',
        session: committee.session || '',
        functions: committee.functions?.join('\n') || '',
        image: null as File | null,
        is_active: committee.is_active,
        order: committee.order,
    });

    const [existingMembers, setExistingMembers] = useState<ExistingMember[]>(committee.members);
    const [newMembers, setNewMembers] = useState<NewMemberData[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(
        committee.image ? `/storage/${committee.image}` : null
    );
    const [memberToDelete, setMemberToDelete] = useState<ExistingMember | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('_method', 'PUT');
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

        router.post(`/admin/committees/${committee.id}`, formData, {
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

    // New member management
    const addNewMember = () => {
        setNewMembers([...newMembers, {
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
            isNew: true,
        }]);
    };

    const removeNewMember = (id: string) => {
        setNewMembers(newMembers.filter(m => m.id !== id));
    };

    const updateNewMember = (id: string, field: keyof NewMemberData, value: string | File | null) => {
        setNewMembers(newMembers.map(m => {
            if (m.id !== id) return m;
            
            if (field === 'photo' && value instanceof File) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setNewMembers(prev => prev.map(pm => 
                        pm.id === id ? { ...pm, photo: value, photoPreview: reader.result as string } : pm
                    ));
                };
                reader.readAsDataURL(value);
                return { ...m, photo: value };
            }
            
            return { ...m, [field]: value };
        }));
    };

    const saveNewMember = (member: NewMemberData) => {
        if (!member.name || !member.designation) return;

        const formData = new FormData();
        formData.append('name', member.name);
        formData.append('designation', member.designation);
        formData.append('role', member.role);
        formData.append('email', member.email);
        formData.append('phone', member.phone);
        formData.append('organization', member.organization);
        formData.append('bio', member.bio);
        formData.append('order', existingMembers.length.toString());
        if (member.photo) {
            formData.append('photo', member.photo);
        }

        router.post(`/admin/committees/${committee.id}/members`, formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                removeNewMember(member.id);
            },
        });
    };

    // Existing member management
    const updateExistingMember = (memberId: number, field: string, value: string | boolean) => {
        setExistingMembers(existingMembers.map(m => 
            m.id === memberId ? { ...m, [field]: value } : m
        ));
    };

    const saveExistingMember = (member: ExistingMember, newPhoto?: File) => {
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('name', member.name);
        formData.append('designation', member.designation);
        formData.append('role', member.role || '');
        formData.append('email', member.email || '');
        formData.append('phone', member.phone || '');
        formData.append('organization', member.organization || '');
        formData.append('bio', member.bio || '');
        formData.append('is_active', member.is_active ? '1' : '0');
        if (newPhoto) {
            formData.append('photo', newPhoto);
        }

        router.post(`/admin/committees/${committee.id}/members/${member.id}`, formData, {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const openDeleteMemberDialog = (member: ExistingMember) => {
        setMemberToDelete(member);
        setDeleteDialogOpen(true);
    };

    const handleDeleteMember = () => {
        if (!memberToDelete) return;
        
        router.delete(`/admin/committees/${committee.id}/members/${memberToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setExistingMembers(existingMembers.filter(m => m.id !== memberToDelete.id));
                setDeleteDialogOpen(false);
                setMemberToDelete(null);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${committee.name} - APS Alwar Admin`} />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/committees">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Committee</h1>
                        <p className="text-muted-foreground">
                            Update {committee.name} details and members.
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Basic Info */}
                        <form onSubmit={handleSubmit}>
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
                                    </div>

                                    <Button 
                                        type="submit" 
                                        className="bg-amber-600 hover:bg-amber-700"
                                        disabled={processing}
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        {processing ? 'Saving...' : 'Save Committee Details'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </form>

                        {/* Existing Members */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Current Members ({existingMembers.length})</CardTitle>
                                        <CardDescription>
                                            Manage existing committee members.
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {existingMembers.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                                        <User className="h-10 w-10 mx-auto mb-3 opacity-50" />
                                        <p className="font-medium">No members yet</p>
                                        <p className="text-sm">Add members below.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {existingMembers.map((member) => (
                                            <ExistingMemberCard
                                                key={member.id}
                                                member={member}
                                                committeeId={committee.id}
                                                onUpdate={updateExistingMember}
                                                onSave={saveExistingMember}
                                                onDelete={() => openDeleteMemberDialog(member)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* New Members */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Add New Members</CardTitle>
                                        <CardDescription>
                                            Add new members to this committee.
                                        </CardDescription>
                                    </div>
                                    <Button type="button" onClick={addNewMember} variant="outline" size="sm">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Member
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {newMembers.length === 0 ? (
                                    <div className="text-center py-6 text-muted-foreground">
                                        <p className="text-sm">Click "Add Member" to add new committee members.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {newMembers.map((member) => (
                                            <NewMemberCard
                                                key={member.id}
                                                member={member}
                                                onUpdate={updateNewMember}
                                                onSave={() => saveNewMember(member)}
                                                onRemove={() => removeNewMember(member.id)}
                                            />
                                        ))}
                                    </div>
                                )}
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
                                </div>
                            </CardContent>
                        </Card>

                        {/* Image */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Committee Image</CardTitle>
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
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Delete Member Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Member?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to remove "{memberToDelete?.name}" from this committee? 
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteMember}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}

// Existing Member Card Component
function ExistingMemberCard({
    member,
    committeeId,
    onUpdate,
    onSave,
    onDelete,
}: {
    member: ExistingMember;
    committeeId: number;
    onUpdate: (id: number, field: string, value: string | boolean) => void;
    onSave: (member: ExistingMember, photo?: File) => void;
    onDelete: () => void;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [newPhoto, setNewPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewPhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => setPhotoPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        onSave(member, newPhoto || undefined);
        setIsEditing(false);
        setNewPhoto(null);
        setPhotoPreview(null);
    };

    if (!isEditing) {
        return (
            <div className={`flex items-center gap-4 p-4 border rounded-lg ${!member.is_active ? 'opacity-50' : ''}`}>
                <Avatar className="h-12 w-12">
                    {member.photo && <AvatarImage src={`/storage/${member.photo}`} />}
                    <AvatarFallback className="bg-amber-100 text-amber-700">
                        {getInitials(member.name)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.designation}</p>
                    {member.organization && (
                        <p className="text-xs text-muted-foreground">{member.organization}</p>
                    )}
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive" onClick={onDelete}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="border rounded-lg p-4 bg-muted/30 space-y-4">
            <div className="flex gap-4">
                <div className="flex flex-col items-center gap-2">
                    <Avatar className="h-16 w-16">
                        {(photoPreview || member.photo) && (
                            <AvatarImage src={photoPreview || `/storage/${member.photo}`} />
                        )}
                        <AvatarFallback className="bg-amber-100 text-amber-700">
                            {getInitials(member.name)}
                        </AvatarFallback>
                    </Avatar>
                    <label className="cursor-pointer">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handlePhotoChange}
                        />
                        <span className="text-xs text-primary hover:underline">Change Photo</span>
                    </label>
                </div>

                <div className="flex-1 grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                        <Label className="text-xs">Name *</Label>
                        <Input
                            value={member.name}
                            onChange={(e) => onUpdate(member.id, 'name', e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Designation *</Label>
                        <Input
                            value={member.designation}
                            onChange={(e) => onUpdate(member.id, 'designation', e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Role</Label>
                        <Input
                            value={member.role || ''}
                            onChange={(e) => onUpdate(member.id, 'role', e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Organization</Label>
                        <Input
                            value={member.organization || ''}
                            onChange={(e) => onUpdate(member.id, 'organization', e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Email</Label>
                        <Input
                            type="email"
                            value={member.email || ''}
                            onChange={(e) => onUpdate(member.id, 'email', e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Phone</Label>
                        <Input
                            value={member.phone || ''}
                            onChange={(e) => onUpdate(member.id, 'phone', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2">
                    <Switch
                        id={`active-${member.id}`}
                        checked={member.is_active}
                        onCheckedChange={(checked) => onUpdate(member.id, 'is_active', checked)}
                    />
                    <Label htmlFor={`active-${member.id}`} className="text-sm">Active</Label>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                        Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave} className="bg-amber-600 hover:bg-amber-700">
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
}

// New Member Card Component
function NewMemberCard({
    member,
    onUpdate,
    onSave,
    onRemove,
}: {
    member: NewMemberData;
    onUpdate: (id: string, field: keyof NewMemberData, value: string | File | null) => void;
    onSave: () => void;
    onRemove: () => void;
}) {
    return (
        <div className="relative border rounded-lg p-4 bg-green-50/50 dark:bg-green-950/20">
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={onRemove}
            >
                <X className="h-4 w-4" />
            </Button>

            <div className="flex gap-4 mb-4">
                <div className="flex flex-col items-center gap-2">
                    <Avatar className="h-16 w-16">
                        {member.photoPreview && <AvatarImage src={member.photoPreview} />}
                        <AvatarFallback className="bg-green-100 text-green-700">
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
                                if (file) onUpdate(member.id, 'photo', file);
                            }}
                        />
                        <span className="text-xs text-primary hover:underline">Upload Photo</span>
                    </label>
                </div>

                <div className="flex-1 grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                        <Label className="text-xs">Name *</Label>
                        <Input
                            value={member.name}
                            onChange={(e) => onUpdate(member.id, 'name', e.target.value)}
                            placeholder="Full name"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Designation *</Label>
                        <Input
                            value={member.designation}
                            onChange={(e) => onUpdate(member.id, 'designation', e.target.value)}
                            placeholder="e.g., Chairman, Member"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Role</Label>
                        <Input
                            value={member.role}
                            onChange={(e) => onUpdate(member.id, 'role', e.target.value)}
                            placeholder="e.g., Parent Representative"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Organization</Label>
                        <Input
                            value={member.organization}
                            onChange={(e) => onUpdate(member.id, 'organization', e.target.value)}
                            placeholder="Company or institution"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Email</Label>
                        <Input
                            type="email"
                            value={member.email}
                            onChange={(e) => onUpdate(member.id, 'email', e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Phone</Label>
                        <Input
                            value={member.phone}
                            onChange={(e) => onUpdate(member.id, 'phone', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-2 border-t">
                <Button 
                    size="sm" 
                    onClick={onSave}
                    disabled={!member.name || !member.designation}
                    className="bg-green-600 hover:bg-green-700"
                >
                    <Save className="mr-2 h-4 w-4" />
                    Save Member
                </Button>
            </div>
        </div>
    );
}
