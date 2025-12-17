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
}

export default function DocumentsCreate({ categories }: Props) {
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Documents', href: '/admin/documents' },
        { title: 'Upload', href: '/admin/documents/create' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        file: null as File | null,
        category: '',
        valid_from: '',
        valid_until: '',
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/documents', {
            forceFormData: true,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('file', file);
            setFileName(file.name);
            // Auto-fill title if empty
            if (!data.title) {
                const name = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
                setData('title', name);
            }
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Upload Document" />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/documents">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Upload Document</h1>
                        <p className="text-gray-500">Add a new downloadable document</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* File Upload */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Document File *</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div 
                                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {fileName ? (
                                        <div className="space-y-2">
                                            <Upload className="h-10 w-10 mx-auto text-green-500" />
                                            <p className="text-gray-800 font-medium">{fileName}</p>
                                            <p className="text-sm text-gray-500">Click to change file</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <Upload className="h-10 w-10 mx-auto text-gray-400" />
                                            <p className="text-gray-600">Click to upload document</p>
                                            <p className="text-sm text-gray-400">PDF, DOC, XLS, PPT, JPG up to 10MB</p>
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
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
                                        placeholder="e.g., Admission Form 2024-25"
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
                                        placeholder="Brief description of the document..."
                                        rows={3}
                                    />
                                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
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
                                            {Object.entries(categories).map(([key, label]) => (
                                                <SelectItem key={key} value={key}>{label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Validity Period */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Validity Period (Optional)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="valid_from">Valid From</Label>
                                        <Input
                                            id="valid_from"
                                            type="date"
                                            value={data.valid_from}
                                            onChange={(e) => setData('valid_from', e.target.value)}
                                        />
                                        {errors.valid_from && <p className="text-sm text-red-500">{errors.valid_from}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="valid_until">Valid Until</Label>
                                        <Input
                                            id="valid_until"
                                            type="date"
                                            value={data.valid_until}
                                            onChange={(e) => setData('valid_until', e.target.value)}
                                        />
                                        {errors.valid_until && <p className="text-sm text-red-500">{errors.valid_until}</p>}
                                    </div>
                                </div>
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
                            </CardContent>
                        </Card>

                        <div className="flex gap-2">
                            <Button type="button" variant="outline" className="flex-1" asChild>
                                <Link href="/admin/documents">Cancel</Link>
                            </Button>
                            <Button type="submit" className="flex-1" disabled={processing}>
                                <Save className="h-4 w-4 mr-2" />
                                {processing ? 'Uploading...' : 'Upload'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
