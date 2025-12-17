import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Plus, 
    Search, 
    Edit, 
    Trash2, 
    Eye,
    EyeOff,
    FlaskConical,
    School,
    Trophy,
    Library,
    Presentation,
    Trees,
    DoorOpen,
    Building,
    Video,
    ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { CardFooter } from '@/components/ui/card';
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
import { useState } from 'react';
import { type BreadcrumbItem } from '@/types';

interface Facility {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    gallery: string[] | null;
    category: string;
    features: string[] | null;
    has_virtual_tour: boolean;
    virtual_tour_url: string | null;
    is_active: boolean;
    order: number;
}

interface Category {
    value: string;
    label: string;
    icon: string;
}

interface Props {
    facilities: {
        data: Facility[];
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
        links: {
            prev: string | null;
            next: string | null;
        };
    };
    filters: {
        search: string;
        category: string;
        active: string;
    };
    categories: Category[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Facilities', href: '/admin/facilities' },
];

const categoryIcons: Record<string, React.ElementType> = {
    'lab': FlaskConical,
    'classroom': School,
    'sports': Trophy,
    'library': Library,
    'auditorium': Presentation,
    'playground': Trees,
    'special_room': DoorOpen,
    'other': Building,
};

export default function FacilitiesIndex({ facilities, filters, categories }: Props) {
    const [search, setSearch] = useState(filters.search);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [facilityToDelete, setFacilityToDelete] = useState<Facility | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/facilities', { search, category: filters.category, active: filters.active }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleFilterChange = (key: string, value: string) => {
        router.get('/admin/facilities', { 
            search: filters.search, 
            category: filters.category,
            active: filters.active,
            [key]: value === 'all' ? '' : value 
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (id: number) => {
        router.delete(`/admin/facilities/${id}`, {
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setFacilityToDelete(null);
            }
        });
    };

    const openDeleteDialog = (facility: Facility) => {
        setFacilityToDelete(facility);
        setDeleteDialogOpen(true);
    };

    const handleToggleActive = (id: number) => {
        router.post(`/admin/facilities/${id}/toggle-active`);
    };

    const getCategoryLabel = (category: string) => {
        return categories.find(c => c.value === category)?.label || category;
    };

    const getCategoryColor = (category: string): string => {
        const colors: Record<string, string> = {
            'lab': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
            'classroom': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            'sports': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            'library': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
            'auditorium': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            'playground': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
            'special_room': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
            'other': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
        };
        return colors[category] || colors.other;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Facilities - APS Alwar Admin" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Facilities</h1>
                        <p className="text-muted-foreground">
                            Manage school infrastructure and facilities.
                        </p>
                    </div>
                    <Button asChild className="bg-amber-600 hover:bg-amber-700">
                        <Link href="/admin/facilities/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Facility
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <form onSubmit={handleSearch} className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search facilities..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </form>
                            <div className="flex gap-2">
                                <Select
                                    value={filters.category || 'all'}
                                    onValueChange={(value) => handleFilterChange('category', value)}
                                >
                                    <SelectTrigger className="w-[160px]">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem key={category.value} value={category.value}>
                                                {category.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={filters.active || 'all'}
                                    onValueChange={(value) => handleFilterChange('active', value)}
                                >
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="1">Active</SelectItem>
                                        <SelectItem value="0">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Facilities Grid */}
                {facilities.data.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Building className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No facilities found</h3>
                            <p className="text-muted-foreground text-center mb-4">
                                {filters.search || filters.category || filters.active
                                    ? 'Try adjusting your filters.'
                                    : 'Get started by adding your first facility.'}
                            </p>
                            {!filters.search && !filters.category && !filters.active && (
                                <Button asChild>
                                    <Link href="/admin/facilities/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Facility
                                    </Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {facilities.data.map((facility) => {
                            const CategoryIcon = categoryIcons[facility.category] || Building;
                            return (
                                <Card key={facility.id} className={`overflow-hidden ${!facility.is_active ? 'opacity-60' : ''}`}>
                                    {/* Image */}
                                    <div className="relative aspect-video bg-muted">
                                        {facility.image ? (
                                            <img
                                                src={`/storage/${facility.image}`}
                                                alt={facility.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20">
                                                <CategoryIcon className="h-12 w-12 text-amber-400" />
                                            </div>
                                        )}
                                        {/* Badges */}
                                        <div className="absolute top-2 left-2 flex gap-2">
                                            {facility.has_virtual_tour && (
                                                <Badge className="bg-blue-600">
                                                    <Video className="h-3 w-3 mr-1" />
                                                    360°
                                                </Badge>
                                            )}
                                            {facility.gallery && facility.gallery.length > 0 && (
                                                <Badge variant="secondary">
                                                    <ImageIcon className="h-3 w-3 mr-1" />
                                                    {facility.gallery.length}
                                                </Badge>
                                            )}
                                        </div>
                                        {/* Status */}
                                        <div className="absolute top-2 right-2">
                                            {!facility.is_active && (
                                                <Badge variant="secondary">Hidden</Badge>
                                            )}
                                        </div>
                                    </div>
                                    <CardHeader className="pb-2">
                                        <div className="space-y-1">
                                            <CardTitle className="line-clamp-1">{facility.name}</CardTitle>
                                            <Badge className={getCategoryColor(facility.category)}>
                                                <CategoryIcon className="h-3 w-3 mr-1" />
                                                {getCategoryLabel(facility.category)}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {facility.description && (
                                            <CardDescription className="line-clamp-2">
                                                {facility.description}
                                            </CardDescription>
                                        )}
                                        {facility.features && facility.features.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-3">
                                                {facility.features.slice(0, 3).map((feature, index) => (
                                                    <Badge key={index} variant="outline" className="text-xs">
                                                        {feature}
                                                    </Badge>
                                                ))}
                                                {facility.features.length > 3 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{facility.features.length - 3}
                                                    </Badge>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter className="border-t pt-4 flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            asChild
                                        >
                                            <Link href={`/admin/facilities/${facility.id}/edit`}>
                                                <Edit className="mr-1 h-4 w-4" />
                                                Edit
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => handleToggleActive(facility.id)}
                                        >
                                            {facility.is_active ? (
                                                <>
                                                    <EyeOff className="mr-1 h-4 w-4" />
                                                    Hide
                                                </>
                                            ) : (
                                                <>
                                                    <Eye className="mr-1 h-4 w-4" />
                                                    Show
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => openDeleteDialog(facility)}
                                        >
                                            <Trash2 className="mr-1 h-4 w-4" />
                                            Delete
                                        </Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {facilities.data.length > 0 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {(facilities.meta.current_page - 1) * facilities.meta.per_page + 1} to{' '}
                            {Math.min(facilities.meta.current_page * facilities.meta.per_page, facilities.meta.total)} of{' '}
                            {facilities.meta.total} facilities
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={!facilities.links.prev}
                                onClick={() => router.get(facilities.links.prev!)}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={!facilities.links.next}
                                onClick={() => router.get(facilities.links.next!)}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Facility?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete "{facilityToDelete?.name}". 
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => facilityToDelete && handleDelete(facilityToDelete.id)}
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
