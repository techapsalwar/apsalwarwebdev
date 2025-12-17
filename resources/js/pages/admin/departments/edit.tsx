import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { ArrowLeft, Save, Loader2, Trash2 } from 'lucide-react';
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { type BreadcrumbItem } from '@/types';

interface DepartmentItem {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    order: number;
    is_active: boolean;
    staff_count: number;
}

interface DepartmentEditProps {
    item: DepartmentItem;
    icons: Record<string, string>;
}

export default function DepartmentEdit({ item, icons }: DepartmentEditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Departments', href: '/admin/departments' },
        { title: item.name, href: `/admin/departments/${item.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: item.name,
        description: item.description || '',
        icon: item.icon || '',
        order: item.order,
        is_active: item.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/departments/${item.id}`);
    };

    const handleDelete = () => {
        router.delete(`/admin/departments/${item.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${item.name} - APS Alwar Admin`} />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/admin/departments">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Edit Department</h1>
                            <p className="text-muted-foreground">
                                Update department: {item.name}
                            </p>
                        </div>
                    </div>
                    {item.staff_count === 0 && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Department</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete "{item.name}"? This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                        onClick={handleDelete}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Department Details</CardTitle>
                            <CardDescription>
                                Update the department information below.
                                {item.staff_count > 0 && (
                                    <span className="block mt-1 text-amber-600">
                                        This department has {item.staff_count} staff member(s).
                                    </span>
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Department Name *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g., Mathematics"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Brief description of the department..."
                                    rows={3}
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">{errors.description}</p>
                                )}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="icon">Icon</Label>
                                    <Select value={data.icon} onValueChange={(v) => setData('icon', v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select an icon" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">No Icon</SelectItem>
                                            {Object.entries(icons).map(([key, label]) => (
                                                <SelectItem key={key} value={key}>{label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.icon && (
                                        <p className="text-sm text-destructive">{errors.icon}</p>
                                    )}
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
                                    {errors.order && (
                                        <p className="text-sm text-destructive">{errors.order}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label>Active Status</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Make this department visible on the website.
                                    </p>
                                </div>
                                <Switch
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', checked)}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button 
                                    type="submit" 
                                    className="bg-amber-600 hover:bg-amber-700" 
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Update Department
                                        </>
                                    )}
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href="/admin/departments">Cancel</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
