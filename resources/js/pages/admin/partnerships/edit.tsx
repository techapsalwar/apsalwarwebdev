import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Upload, X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { type BreadcrumbItem } from '@/types';
import { useState, useRef, useEffect } from 'react';

interface Partnership {
    id: number;
    partner_name: string;
    slug: string;
    description: string | null;
    logo: string | null;
    logo_url: string | null;
    website_url: string | null;
    type: string;
    benefits: string[] | null;
    is_active: boolean;
    order: number;
}

interface Props {
    partnership: Partnership;
    types: Record<string, string>;
}

export default function EditPartnership({ partnership, types }: Props) {
    const [preview, setPreview] = useState<string | null>(partnership.logo_url);
    const [benefits, setBenefits] = useState<string[]>(partnership.benefits || []);
    const [newBenefit, setNewBenefit] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        partner_name: partnership.partner_name,
        description: partnership.description || '',
        logo: null as File | null,
        website_url: partnership.website_url || '',
        type: partnership.type,
        benefits: partnership.benefits || [],
        is_active: partnership.is_active,
        order: partnership.order,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Partnerships', href: '/admin/partnerships' },
        { title: 'Edit', href: `/admin/partnerships/${partnership.id}/edit` },
    ];

    useEffect(() => {
        setData('benefits', benefits);
    }, [benefits]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('logo', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeLogo = () => {
        setData('logo', null);
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const addBenefit = () => {
        if (newBenefit.trim()) {
            const updatedBenefits = [...benefits, newBenefit.trim()];
            setBenefits(updatedBenefits);
            setNewBenefit('');
        }
    };

    const removeBenefit = (index: number) => {
        const updatedBenefits = benefits.filter((_, i) => i !== index);
        setBenefits(updatedBenefits);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/partnerships/${partnership.id}`, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${partnership.partner_name}`} />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/partnerships">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Edit Partnership</h1>
                        <p className="text-gray-500">{partnership.partner_name}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>Partner organization details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="partner_name">Partner Name *</Label>
                                    <Input
                                        id="partner_name"
                                        value={data.partner_name}
                                        onChange={(e) => setData('partner_name', e.target.value)}
                                        placeholder="e.g., Google for Education"
                                    />
                                    {errors.partner_name && (
                                        <p className="text-sm text-red-500">{errors.partner_name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Brief description of the partnership..."
                                        rows={3}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-500">{errors.description}</p>
                                    )}
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Partnership Type *</Label>
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
                                        {errors.type && (
                                            <p className="text-sm text-red-500">{errors.type}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="website_url">Website URL</Label>
                                        <Input
                                            id="website_url"
                                            type="url"
                                            value={data.website_url}
                                            onChange={(e) => setData('website_url', e.target.value)}
                                            placeholder="https://example.com"
                                        />
                                        {errors.website_url && (
                                            <p className="text-sm text-red-500">{errors.website_url}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Benefits */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Partnership Benefits</CardTitle>
                                <CardDescription>Add key benefits of this partnership</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        value={newBenefit}
                                        onChange={(e) => setNewBenefit(e.target.value)}
                                        placeholder="e.g., Free access to premium tools"
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                                    />
                                    <Button type="button" onClick={addBenefit} variant="secondary">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>

                                {benefits.length > 0 && (
                                    <div className="space-y-2">
                                        {benefits.map((benefit, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded"
                                            >
                                                <span className="flex-1 text-sm">{benefit}</span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 text-red-500"
                                                    onClick={() => removeBenefit(index)}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Partner Logo</CardTitle>
                                <CardDescription>Upload the partner's logo (PNG, SVG, JPG)</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {preview ? (
                                    <div className="relative">
                                        <img
                                            src={preview}
                                            alt="Logo preview"
                                            className="w-full h-40 object-contain bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 h-6 w-6"
                                            onClick={removeLogo}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-500">Click to upload</span>
                                        <span className="text-xs text-gray-400 mt-1">PNG, SVG, JPG</span>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".png,.svg,.jpg,.jpeg,.webp,image/png,image/svg+xml,image/jpeg,image/webp"
                                            onChange={handleLogoChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                                {errors.logo && (
                                    <p className="text-sm text-red-500 mt-2">{errors.logo}</p>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Active Status</Label>
                                        <p className="text-sm text-gray-500">Show on website</p>
                                    </div>
                                    <Switch
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="order">Display Order</Label>
                                    <Input
                                        id="order"
                                        type="number"
                                        value={data.order}
                                        onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
                                        min={0}
                                    />
                                    <p className="text-xs text-gray-500">Lower numbers display first</p>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex gap-2">
                            <Button type="submit" className="flex-1" disabled={processing}>
                                {processing ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
