import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { type BreadcrumbItem } from '@/types';
import { useRef, useState } from 'react';

interface Disclosure {
    id: number;
    title: string;
    category: string | null;
    file_path: string;
    file_name: string | null;
    file_size: number | null;
    sort_order: number;
    is_active: boolean;
}

interface Props {
    disclosure: Disclosure;
    categories: Record<string, string>;
}

const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return 'N/A';
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    while (bytes >= 1024 && i < units.length - 1) {
        bytes /= 1024;
        i++;
    }
    return `${bytes.toFixed(1)} ${units[i]}`;
};

export default function MandatoryDisclosuresEdit({ disclosure, categories }: Props) {
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Mandatory Disclosures', href: '/admin/mandatory-disclosures' },
        { title: 'Edit', href: `/admin/mandatory-disclosures/${disclosure.id}/edit` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: disclosure.title,
        category: disclosure.category || '',
        file: null as File | null,
        sort_order: disclosure.sort_order,
        is_active: disclosure.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/mandatory-disclosures/${disclosure.id}`, {
            forceFormData: true,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('file', file);
            setFileName(file.name);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Mandatory Disclosure" />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/mandatory-disclosures">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Edit Mandatory Disclosure</h1>
                        <p className="text-muted-foreground">Update disclosure document details</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Current File */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Current Document</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                                    <FileText className="h-10 w-10 text-red-500" />
                                    <div className="flex-1">
                                        <p className="font-medium">{disclosure.file_name || disclosure.title}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Size: {formatFileSize(disclosure.file_size)}
                                        </p>
                                    </div>
                                    <Button variant="outline" size="sm" asChild>
                                        <a href={`/storage/${disclosure.file_path}`} target="_blank" rel="noopener noreferrer">
                                            View PDF
                                        </a>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Replace File */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Replace Document (Optional)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div 
                                    className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {fileName ? (
                                        <div className="space-y-2">
                                            <Upload className="h-8 w-8 mx-auto text-green-500" />
                                            <p className="font-medium">{fileName}</p>
                                            <p className="text-sm text-muted-foreground">Click to change file</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                                            <p className="text-sm">Click to upload a new PDF to replace the current one</p>
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                {errors.file && <p className="text-sm text-red-500 mt-2">{errors.file}</p>}
                            </CardContent>
                        </Card>

                        {/* Document Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Document Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="e.g., School Infrastructure Details"
                                        required
                                    />
                                    {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
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
                                    <Label htmlFor="sort_order">Sort Order</Label>
                                    <Input
                                        id="sort_order"
                                        type="number"
                                        min="0"
                                        value={data.sort_order}
                                        onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                                        placeholder="0"
                                    />
                                    <p className="text-sm text-muted-foreground">Lower numbers appear first</p>
                                    {errors.sort_order && <p className="text-sm text-red-500">{errors.sort_order}</p>}
                                </div>
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
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="is_active">Active</Label>
                                    <Switch
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked)}
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Active disclosures are visible on the website
                                </p>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <Card>
                            <CardContent className="p-4">
                                <Button type="submit" className="w-full" disabled={processing}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
