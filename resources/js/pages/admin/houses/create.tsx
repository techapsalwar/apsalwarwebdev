import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { ArrowLeft, Save, Loader2, Upload, X, Crown, Star, Plus, Users, ImageIcon } from 'lucide-react';
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
import { useState, useRef } from 'react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Houses', href: '/admin/houses' },
    { title: 'Create', href: '/admin/houses/create' },
];

interface Teacher {
    name: string;
    designation: string;
}

interface Prefect {
    name: string;
    class: string;
}

export default function HouseCreate() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);
    const houseMasterPhotoRef = useRef<HTMLInputElement>(null);
    const captainPhotoRef = useRef<HTMLInputElement>(null);
    const viceCaptainPhotoRef = useRef<HTMLInputElement>(null);

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [houseMasterPhotoPreview, setHouseMasterPhotoPreview] = useState<string | null>(null);
    const [captainPhotoPreview, setCaptainPhotoPreview] = useState<string | null>(null);
    const [viceCaptainPhotoPreview, setViceCaptainPhotoPreview] = useState<string | null>(null);

    // Dynamic teachers list
    const [teachersList, setTeachersList] = useState<Teacher[]>([]);

    // Dynamic prefects list
    const [prefectsList, setPrefectsList] = useState<Prefect[]>([]);

    const { data, setData, processing, errors } = useForm({
        name: '',
        color: '#3B82F6',
        motto: '',
        description: '',
        house_master: '',
        house_master_designation: '',
        house_master_photo: null as File | null,
        logo: null as File | null,
        captain_name: '',
        captain_class: '',
        captain_photo: null as File | null,
        vice_captain_name: '',
        vice_captain_class: '',
        vice_captain_photo: null as File | null,
        image: null as File | null,
        order: 0,
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if ((key === 'image' || key === 'logo' || key === 'house_master_photo' || key === 'captain_photo' || key === 'vice_captain_photo') && value instanceof File) {
                formData.append(key, value);
            } else if (typeof value === 'boolean') {
                formData.append(key, value ? '1' : '0');
            } else if (value !== null && value !== '') {
                formData.append(key, String(value));
            }
        });

        // Append teachers array as JSON
        formData.append('teachers', JSON.stringify(teachersList));

        // Append prefects array as JSON
        formData.append('prefects', JSON.stringify(prefectsList));

        router.post('/admin/houses', formData, {
            forceFormData: true,
        });
    };

    // Image handlers
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setData('image', null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('logo', file);
            const reader = new FileReader();
            reader.onloadend = () => setLogoPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const removeLogoImage = () => {
        setData('logo', null);
        setLogoPreview(null);
        if (logoInputRef.current) logoInputRef.current.value = '';
    };

    const handleHouseMasterPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('house_master_photo', file);
            const reader = new FileReader();
            reader.onloadend = () => setHouseMasterPhotoPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const removeHouseMasterPhotoImage = () => {
        setData('house_master_photo', null);
        setHouseMasterPhotoPreview(null);
        if (houseMasterPhotoRef.current) houseMasterPhotoRef.current.value = '';
    };

    const handleCaptainPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('captain_photo', file);
            const reader = new FileReader();
            reader.onloadend = () => setCaptainPhotoPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const removeCaptainPhotoImage = () => {
        setData('captain_photo', null);
        setCaptainPhotoPreview(null);
        if (captainPhotoRef.current) captainPhotoRef.current.value = '';
    };

    const handleViceCaptainPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('vice_captain_photo', file);
            const reader = new FileReader();
            reader.onloadend = () => setViceCaptainPhotoPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const removeViceCaptainPhotoImage = () => {
        setData('vice_captain_photo', null);
        setViceCaptainPhotoPreview(null);
        if (viceCaptainPhotoRef.current) viceCaptainPhotoRef.current.value = '';
    };

    // Teacher handlers
    const addTeacher = () => {
        setTeachersList([...teachersList, { name: '', designation: '' }]);
    };

    const removeTeacher = (index: number) => {
        setTeachersList(teachersList.filter((_, i) => i !== index));
    };

    const updateTeacher = (index: number, field: keyof Teacher, value: string) => {
        const updated = [...teachersList];
        updated[index] = { ...updated[index], [field]: value };
        setTeachersList(updated);
    };

    // Prefect handlers
    const addPrefect = () => {
        setPrefectsList([...prefectsList, { name: '', class: '' }]);
    };

    const removePrefect = (index: number) => {
        setPrefectsList(prefectsList.filter((_, i) => i !== index));
    };

    const updatePrefect = (index: number, field: keyof Prefect, value: string) => {
        const updated = [...prefectsList];
        updated[index] = { ...updated[index], [field]: value };
        setPrefectsList(updated);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create House - APS Alwar Admin" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/houses">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Create House</h1>
                        <p className="text-muted-foreground">Add a new house to the system.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>House Details</CardTitle>
                                <CardDescription>Enter the house information.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">House Name *</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="e.g., Cariappa House"
                                            required
                                        />
                                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="color">House Color *</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="color"
                                                type="color"
                                                value={data.color}
                                                onChange={(e) => setData('color', e.target.value)}
                                                className="w-16 h-10 p-1 cursor-pointer"
                                            />
                                            <Input
                                                value={data.color}
                                                onChange={(e) => setData('color', e.target.value)}
                                                placeholder="#3B82F6"
                                                className="font-mono"
                                            />
                                        </div>
                                        {errors.color && <p className="text-sm text-destructive">{errors.color}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="motto">House Motto</Label>
                                    <Input
                                        id="motto"
                                        value={data.motto}
                                        onChange={(e) => setData('motto', e.target.value)}
                                        placeholder="e.g., Courage and Determination"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Brief description about the house and its history..."
                                        rows={4}
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
                                        className="w-32"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* House Master Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>House Master</CardTitle>
                                <CardDescription>Teacher in charge of this house.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="house_master">Name</Label>
                                        <Input
                                            id="house_master"
                                            value={data.house_master}
                                            onChange={(e) => setData('house_master', e.target.value)}
                                            placeholder="e.g., Mr. Rajesh Kumar"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="house_master_designation">Designation</Label>
                                        <Input
                                            id="house_master_designation"
                                            value={data.house_master_designation}
                                            onChange={(e) => setData('house_master_designation', e.target.value)}
                                            placeholder="e.g., PGT Physics"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Photo</Label>
                                    <input ref={houseMasterPhotoRef} type="file" accept="image/*" onChange={handleHouseMasterPhotoChange} className="hidden" />
                                    {houseMasterPhotoPreview ? (
                                        <div className="relative inline-block">
                                            <img src={houseMasterPhotoPreview} alt="House Master" className="w-24 h-24 object-cover rounded-full" />
                                            <Button type="button" variant="destructive" size="icon" className="absolute -top-1 -right-1 h-6 w-6" onClick={removeHouseMasterPhotoImage}>
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div onClick={() => houseMasterPhotoRef.current?.click()} className="w-24 h-24 border-2 border-dashed rounded-full flex items-center justify-center cursor-pointer hover:border-primary">
                                            <Upload className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* House Teachers Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-blue-500" />
                                    House Teachers
                                </CardTitle>
                                <CardDescription>Teachers associated with this house.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {teachersList.map((teacher, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                                        <div className="flex-1 grid gap-3 sm:grid-cols-2">
                                            <Input
                                                value={teacher.name}
                                                onChange={(e) => updateTeacher(index, 'name', e.target.value)}
                                                placeholder="Teacher name"
                                            />
                                            <Input
                                                value={teacher.designation}
                                                onChange={(e) => updateTeacher(index, 'designation', e.target.value)}
                                                placeholder="Designation (e.g., PGT English)"
                                            />
                                        </div>
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeTeacher(index)} className="text-destructive hover:text-destructive">
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" onClick={addTeacher} className="w-full">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Teacher
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Student Leadership Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Crown className="h-5 w-5 text-amber-500" />
                                    Student Leadership
                                </CardTitle>
                                <CardDescription>House Captain and Vice Captain.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Captain Section */}
                                <div className="space-y-4 p-4 border rounded-lg" style={{ borderColor: `${data.color}40` }}>
                                    <div className="flex items-center gap-2">
                                        <Crown className="h-4 w-4" style={{ color: data.color }} />
                                        <Label className="font-semibold">House Captain</Label>
                                    </div>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="captain_name">Name</Label>
                                            <Input
                                                id="captain_name"
                                                value={data.captain_name}
                                                onChange={(e) => setData('captain_name', e.target.value)}
                                                placeholder="Student name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="captain_class">Class</Label>
                                            <Input
                                                id="captain_class"
                                                value={data.captain_class}
                                                onChange={(e) => setData('captain_class', e.target.value)}
                                                placeholder="e.g., XII-A"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Photo</Label>
                                        <input ref={captainPhotoRef} type="file" accept="image/*" onChange={handleCaptainPhotoChange} className="hidden" />
                                        {captainPhotoPreview ? (
                                            <div className="relative inline-block">
                                                <img src={captainPhotoPreview} alt="Captain" className="w-20 h-20 object-cover rounded-full" />
                                                <Button type="button" variant="destructive" size="icon" className="absolute -top-1 -right-1 h-6 w-6" onClick={removeCaptainPhotoImage}>
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div onClick={() => captainPhotoRef.current?.click()} className="w-20 h-20 border-2 border-dashed rounded-full flex items-center justify-center cursor-pointer hover:border-primary">
                                                <Upload className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Vice Captain Section */}
                                <div className="space-y-4 p-4 border rounded-lg" style={{ borderColor: `${data.color}40` }}>
                                    <div className="flex items-center gap-2">
                                        <Star className="h-4 w-4" style={{ color: data.color }} />
                                        <Label className="font-semibold">Vice Captain</Label>
                                    </div>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="vice_captain_name">Name</Label>
                                            <Input
                                                id="vice_captain_name"
                                                value={data.vice_captain_name}
                                                onChange={(e) => setData('vice_captain_name', e.target.value)}
                                                placeholder="Student name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="vice_captain_class">Class</Label>
                                            <Input
                                                id="vice_captain_class"
                                                value={data.vice_captain_class}
                                                onChange={(e) => setData('vice_captain_class', e.target.value)}
                                                placeholder="e.g., XI-B"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Photo</Label>
                                        <input ref={viceCaptainPhotoRef} type="file" accept="image/*" onChange={handleViceCaptainPhotoChange} className="hidden" />
                                        {viceCaptainPhotoPreview ? (
                                            <div className="relative inline-block">
                                                <img src={viceCaptainPhotoPreview} alt="Vice Captain" className="w-20 h-20 object-cover rounded-full" />
                                                <Button type="button" variant="destructive" size="icon" className="absolute -top-1 -right-1 h-6 w-6" onClick={removeViceCaptainPhotoImage}>
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div onClick={() => viceCaptainPhotoRef.current?.click()} className="w-20 h-20 border-2 border-dashed rounded-full flex items-center justify-center cursor-pointer hover:border-primary">
                                                <Upload className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* House Prefects Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Star className="h-5 w-5 text-purple-500" />
                                    House Prefects
                                </CardTitle>
                                <CardDescription>Student prefects for this house.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {prefectsList.map((prefect, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                                        <div className="flex-1 grid gap-3 sm:grid-cols-2">
                                            <Input
                                                value={prefect.name}
                                                onChange={(e) => updatePrefect(index, 'name', e.target.value)}
                                                placeholder="Prefect name"
                                            />
                                            <Input
                                                value={prefect.class}
                                                onChange={(e) => updatePrefect(index, 'class', e.target.value)}
                                                placeholder="Class (e.g., X-A)"
                                            />
                                        </div>
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removePrefect(index)} className="text-destructive hover:text-destructive">
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" onClick={addPrefect} className="w-full">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Prefect
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* House Logo */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ImageIcon className="h-5 w-5" />
                                    House Logo
                                </CardTitle>
                                <CardDescription>Upload the house logo/crest.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                                {logoPreview ? (
                                    <div className="relative">
                                        <img src={logoPreview} alt="Logo" className="w-full max-w-[150px] mx-auto object-contain rounded-lg" />
                                        <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={removeLogoImage}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div onClick={() => logoInputRef.current?.click()} className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
                                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">Click to upload logo</p>
                                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 2MB</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* House Image */}
                        <Card>
                            <CardHeader>
                                <CardTitle>House Banner</CardTitle>
                                <CardDescription>Upload a house banner image.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                {imagePreview ? (
                                    <div className="relative">
                                        <img src={imagePreview} alt="Preview" className="w-full aspect-video object-cover rounded-lg" />
                                        <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={removeImage}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
                                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">Click to upload image</p>
                                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 2MB</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Active Status</Label>
                                        <p className="text-sm text-muted-foreground">Show this house on the website.</p>
                                    </div>
                                    <Switch checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked)} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Color Preview */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Color Preview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-24 rounded-lg flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: data.color }}>
                                    {data.name || 'House Name'}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-700" disabled={processing}>
                                {processing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Create House
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
