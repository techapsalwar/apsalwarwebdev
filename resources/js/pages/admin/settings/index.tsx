import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { Save, Loader2, RefreshCw, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Settings', href: '/admin/settings' },
];

interface SettingItem {
    id: number;
    key: string;
    value: string | null;
    type: string;
    group: string;
    label: string;
    description: string | null;
}

interface GroupedSettings {
    [group: string]: SettingItem[];
}

interface SettingsIndexProps {
    settings: GroupedSettings;
}

const groupLabels: Record<string, string> = {
    general: 'General',
    about: 'About School',
    principal: 'Principal',
    contact: 'Contact Information',
    social: 'Social Media',
    timings: 'School Timings',
    cbse: 'CBSE Details',
    academics: 'Academics',
    homepage: 'Homepage',
    seo: 'SEO Settings',
    system: 'System',
    branding: 'Branding',
    content: 'Content',
};

const groupDescriptions: Record<string, string> = {
    general: 'Basic school information and settings.',
    about: 'About the school, vision, and mission.',
    principal: 'Principal details and message.',
    contact: 'Contact details displayed on the website.',
    social: 'Social media profile links.',
    timings: 'School timings and schedules.',
    cbse: 'CBSE affiliation and exam details.',
    academics: 'Academic information and settings.',
    homepage: 'Homepage content and configuration.',
    seo: 'Search engine optimization settings.',
    system: 'System settings and configuration.',
    branding: 'Logos and brand assets.',
    content: 'Important content like vision and mission.',
};

export default function SettingsIndex({ settings }: SettingsIndexProps) {
    const [saving, setSaving] = useState(false);
    const [clearing, setClearing] = useState(false);
    const [uploading, setUploading] = useState<string | null>(null);
    const groups = Object.keys(settings);
    const [activeTab, setActiveTab] = useState(groups[0] || 'general');

    // Build initial form data from all settings (excluding image types - those are handled separately)
    const initialData: Record<string, string> = {};
    const imageKeys = new Set<string>();
    Object.values(settings).flat().forEach((setting) => {
        if (setting.type === 'image') {
            imageKeys.add(setting.key);
        }
        initialData[setting.key] = setting.value || '';
    });

    const { data, setData, post, processing, errors } = useForm(initialData);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        // Exclude image fields from the submit - they are handled by uploadImage
        const submitData: Record<string, string> = {};
        Object.entries(data).forEach(([key, value]) => {
            if (!imageKeys.has(key)) {
                submitData[key] = value;
            }
        });
        router.post('/admin/settings', submitData, {
            preserveScroll: true,
            onFinish: () => setSaving(false),
        });
    };

    const handleClearCache = () => {
        setClearing(true);
        router.post('/admin/settings/clear-cache', {}, {
            preserveScroll: true,
            onFinish: () => setClearing(false),
        });
    };

    const handleFileChange = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setUploading(key);
            
            const formData = new FormData();
            formData.append('key', key);
            formData.append('image', file);
            
            router.post('/admin/settings/upload-image', formData, {
                preserveScroll: true,
                // Let Inertia reload the page data to get the correct path from the server
                onFinish: () => setUploading(null),
            });
        }
    };

    const handleDeleteImage = (key: string) => {
        if (confirm('Are you sure you want to delete this image?')) {
            router.post('/admin/settings/delete-image', { key }, {
                preserveScroll: true,
                onSuccess: () => {
                    setData(key, '');
                },
            });
        }
    };

    const renderSettingInput = (setting: SettingItem) => {
        const errorKey = setting.key;
        const hasError = errors[errorKey];

        switch (setting.type) {
            case 'text':
                return (
                    <Input
                        id={setting.key}
                        value={data[setting.key] || ''}
                        onChange={(e) => setData(setting.key, e.target.value)}
                        placeholder={setting.label}
                        className={hasError ? 'border-destructive' : ''}
                    />
                );
            case 'textarea':
                return (
                    <Textarea
                        id={setting.key}
                        value={data[setting.key] || ''}
                        onChange={(e) => setData(setting.key, e.target.value)}
                        placeholder={setting.label}
                        rows={4}
                        className={hasError ? 'border-destructive' : ''}
                    />
                );
            case 'email':
                return (
                    <Input
                        id={setting.key}
                        type="email"
                        value={data[setting.key] || ''}
                        onChange={(e) => setData(setting.key, e.target.value)}
                        placeholder={setting.label}
                        className={hasError ? 'border-destructive' : ''}
                    />
                );
            case 'url':
                return (
                    <Input
                        id={setting.key}
                        type="url"
                        value={data[setting.key] || ''}
                        onChange={(e) => setData(setting.key, e.target.value)}
                        placeholder="https://..."
                        className={hasError ? 'border-destructive' : ''}
                    />
                );
            case 'number':
                return (
                    <Input
                        id={setting.key}
                        type="number"
                        value={data[setting.key] || ''}
                        onChange={(e) => setData(setting.key, e.target.value)}
                        placeholder={setting.label}
                        className={hasError ? 'border-destructive' : ''}
                    />
                );
            case 'time':
                return (
                    <Input
                        id={setting.key}
                        type="time"
                        value={data[setting.key] || '00:00'}
                        onChange={(e) => setData(setting.key, e.target.value)}
                        className={hasError ? 'border-destructive' : 'max-w-[150px]'}
                    />
                );
            case 'image':
                return (
                    <div className="space-y-3">
                        {data[setting.key] && (
                            <div className="flex items-center gap-4 rounded-lg border p-3 bg-muted/50">
                                <img 
                                    src={`/storage/${data[setting.key]}`} 
                                    alt={setting.label}
                                    className="h-16 w-16 object-contain rounded border bg-white"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                                <div className="flex-1">
                                    <p className="text-sm text-muted-foreground truncate">
                                        {data[setting.key]}
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeleteImage(setting.key)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <Input
                                id={setting.key}
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(setting.key, e)}
                                className={hasError ? 'border-destructive' : ''}
                                disabled={uploading === setting.key}
                            />
                            {uploading === setting.key && (
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            )}
                        </div>
                    </div>
                );
            default:
                return (
                    <Input
                        id={setting.key}
                        value={data[setting.key] || ''}
                        onChange={(e) => setData(setting.key, e.target.value)}
                        placeholder={setting.label}
                        className={hasError ? 'border-destructive' : ''}
                    />
                );
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Site Settings - APS Alwar Admin" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Site Settings</h1>
                        <p className="text-muted-foreground">
                            Manage website configuration and settings.
                        </p>
                    </div>
                    <Button 
                        variant="outline" 
                        onClick={handleClearCache}
                        disabled={clearing}
                    >
                        {clearing ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <RefreshCw className="mr-2 h-4 w-4" />
                        )}
                        Clear Cache
                    </Button>
                </div>

                <form onSubmit={handleSubmit}>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        <TabsList className="flex flex-wrap h-auto gap-2">
                            {groups.map((group) => (
                                <TabsTrigger 
                                    key={group} 
                                    value={group}
                                    className="capitalize"
                                >
                                    {groupLabels[group] || group}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {groups.map((group) => (
                            <TabsContent key={group} value={group} className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{groupLabels[group] || group}</CardTitle>
                                        <CardDescription>
                                            {groupDescriptions[group] || `Manage ${group} settings.`}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {settings[group]?.map((setting) => (
                                            <div key={setting.id} className="space-y-2">
                                                <Label htmlFor={setting.key}>
                                                    {setting.label}
                                                </Label>
                                                {renderSettingInput(setting)}
                                                {setting.description && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {setting.description}
                                                    </p>
                                                )}
                                                {errors[setting.key] && (
                                                    <p className="text-sm text-destructive">
                                                        {errors[setting.key]}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        ))}
                    </Tabs>

                    {/* Save Button */}
                    <div className="flex justify-end pt-6">
                        <Button 
                            type="submit" 
                            disabled={processing || saving}
                            className="bg-amber-600 hover:bg-amber-700"
                        >
                            {(processing || saving) ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save All Settings
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
