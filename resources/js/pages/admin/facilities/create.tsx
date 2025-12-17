import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { ArrowLeft, Save, Loader2, Upload, X, Plus, Trash2 } from 'lucide-react';
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
import { useState, useRef } from 'react';
import { type BreadcrumbItem } from '@/types';

interface Category {
    value: string;
    label: string;
    icon: string;
}

interface Props {
    categories: Category[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Facilities', href: '/admin/facilities' },
    { title: 'Create', href: '/admin/facilities/create' },
];

export default function FacilityCreate({ categories }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
    const [features, setFeatures] = useState<string[]>([]);
    const [newFeature, setNewFeature] = useState('');

    const [equipment, setEquipment] = useState<string[]>([]);
    const [newEquipment, setNewEquipment] = useState('');

    const { data, setData, processing, errors } = useForm({
        name: '',
        description: '',
        image: null as File | null,
        gallery: [] as File[],
        category: '',
        features: [] as string[],
        location: '',
        capacity: '',
        has_virtual_tour: false,
        virtual_tour_url: '',
        order: 0,
        is_active: true,
    });

    const addEquipment = () => {
        if (newEquipment.trim() && !equipment.includes(newEquipment.trim())) {
            setEquipment([...equipment, newEquipment.trim()]);
            setNewEquipment('');
        }
    };

    const removeEquipment = (index: number) => {
        setEquipment(equipment.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('category', data.category);
        formData.append('order', String(data.order));
        formData.append('is_active', data.is_active ? '1' : '0');
        formData.append('has_virtual_tour', data.has_virtual_tour ? '1' : '0');
        formData.append('location', data.location);
        formData.append('capacity', data.capacity);
        
        if (data.virtual_tour_url) {
            formData.append('virtual_tour_url', data.virtual_tour_url);
        }

        if (data.image) {
            formData.append('image', data.image);
        }

        data.gallery.forEach((file, index) => {
            formData.append(`gallery[${index}]`, file);
        });

        features.forEach((feature, index) => {
            formData.append(`features[${index}]`, feature);
        });

        equipment.forEach((item, index) => {
            formData.append(`equipment[${index}]`, item);
        });

        router.post('/admin/facilities', formData, {
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

    const removeImage = () => {
        setData('image', null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setData('gallery', [...data.gallery, ...files]);
            
            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setGalleryPreviews(prev => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeGalleryImage = (index: number) => {
        const newGallery = data.gallery.filter((_, i) => i !== index);
        const newPreviews = galleryPreviews.filter((_, i) => i !== index);
        setData('gallery', newGallery);
        setGalleryPreviews(newPreviews);
    };

    const addFeature = () => {
        if (newFeature.trim() && !features.includes(newFeature.trim())) {
            setFeatures([...features, newFeature.trim()]);
            setNewFeature('');
        }
    };

    const removeFeature = (index: number) => {
        setFeatures(features.filter((_, i) => i !== index));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Facility - APS Alwar Admin" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/facilities">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Add Facility</h1>
                        <p className="text-muted-foreground">
                            Add a new facility to the school infrastructure.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Facility Details</CardTitle>
                                <CardDescription>
                                    Enter the facility information.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Facility Name *</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="e.g., Physics Laboratory"
                                            required
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-destructive">{errors.name}</p>
                                        )}
                                    </div>
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
                                                {categories.map((category) => (
                                                    <SelectItem key={category.value} value={category.value}>
                                                        {category.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.category && (
                                            <p className="text-sm text-destructive">{errors.category}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Detailed description of the facility..."
                                        rows={4}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-destructive">{errors.description}</p>
                                    )}
                                </div>

                                {/* Features */}
                                <div className="space-y-2">
                                    <Label>Features</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={newFeature}
                                            onChange={(e) => setNewFeature(e.target.value)}
                                            placeholder="e.g., Air Conditioned"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addFeature();
                                                }
                                            }}
                                        />
                                        <Button type="button" onClick={addFeature} variant="outline">
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    {features.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {features.map((feature, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-1 bg-secondary rounded-full px-3 py-1 text-sm"
                                                >
                                                    {feature}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFeature(index)}
                                                        className="text-muted-foreground hover:text-foreground"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
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
                                </div>

                                {/* Location & Capacity */}
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                            id="location"
                                            value={data.location}
                                            onChange={(e) => setData('location', e.target.value)}
                                            placeholder="e.g., Block A, Ground Floor"
                                        />
                                        {errors.location && (
                                            <p className="text-sm text-destructive">{errors.location}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="capacity">Capacity</Label>
                                        <Input
                                            id="capacity"
                                            value={data.capacity}
                                            onChange={(e) => setData('capacity', e.target.value)}
                                            placeholder="e.g., 40 students"
                                        />
                                        {errors.capacity && (
                                            <p className="text-sm text-destructive">{errors.capacity}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Equipment */}
                                <div className="space-y-2">
                                    <Label>Equipment</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={newEquipment}
                                            onChange={(e) => setNewEquipment(e.target.value)}
                                            placeholder="e.g., Projector, Smart Board"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addEquipment();
                                                }
                                            }}
                                        />
                                        <Button type="button" onClick={addEquipment} variant="outline">
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    {equipment.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {equipment.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full px-3 py-1 text-sm"
                                                >
                                                    {item}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeEquipment(index)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Virtual Tour */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Virtual Tour</CardTitle>
                                <CardDescription>
                                    Add a 360° virtual tour link for this facility.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Enable Virtual Tour</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Show virtual tour option for this facility.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={data.has_virtual_tour}
                                        onCheckedChange={(checked) => setData('has_virtual_tour', checked)}
                                    />
                                </div>
                                {data.has_virtual_tour && (
                                    <div className="space-y-2">
                                        <Label htmlFor="virtual_tour_url">Virtual Tour URL</Label>
                                        <Input
                                            id="virtual_tour_url"
                                            type="url"
                                            value={data.virtual_tour_url}
                                            onChange={(e) => setData('virtual_tour_url', e.target.value)}
                                            placeholder="https://..."
                                        />
                                        {errors.virtual_tour_url && (
                                            <p className="text-sm text-destructive">{errors.virtual_tour_url}</p>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Gallery */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Photo Gallery</CardTitle>
                                <CardDescription>
                                    Upload multiple photos of the facility.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <input
                                    ref={galleryInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleGalleryChange}
                                    className="hidden"
                                />
                                <div className="grid grid-cols-3 gap-4">
                                    {galleryPreviews.map((preview, index) => (
                                        <div key={index} className="relative aspect-video">
                                            <img
                                                src={preview}
                                                alt={`Gallery ${index + 1}`}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-1 right-1 h-6 w-6"
                                                onClick={() => removeGalleryImage(index)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                    <div
                                        onClick={() => galleryInputRef.current?.click()}
                                        className="aspect-video border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                                    >
                                        <Plus className="h-6 w-6 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground mt-1">Add Photos</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Featured Image */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Featured Image</CardTitle>
                                <CardDescription>
                                    Main image for the facility.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                {imagePreview ? (
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full aspect-video object-cover rounded-lg"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2"
                                            onClick={removeImage}
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
                                            Click to upload image
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            PNG, JPG up to 2MB
                                        </p>
                                    </div>
                                )}
                                {errors.image && (
                                    <p className="text-sm text-destructive">{errors.image}</p>
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
                                        <p className="text-sm text-muted-foreground">
                                            Show this facility on the website.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button 
                                type="submit" 
                                className="flex-1 bg-amber-600 hover:bg-amber-700" 
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Create Facility
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
