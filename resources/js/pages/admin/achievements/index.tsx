import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Plus, 
    Edit, 
    Trash2, 
    Eye, 
    EyeOff,
    Award,
    Star,
    StarOff,
    Search,
    Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';

interface Achievement {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    image: string | null;
    category: string;
    level: string;
    achiever_name: string | null;
    achiever_class: string | null;
    achievement_date: string | null;
    academic_year: string | null;
    is_featured: boolean;
    is_active: boolean;
}

interface Props {
    achievements: {
        data: Achievement[];
        current_page: number;
        last_page: number;
        total: number;
    };
    categories: Record<string, string>;
    levels: Record<string, string>;
    filters: {
        category: string;
        level: string;
        search: string | null;
    };
}

export default function AchievementsIndex({ achievements, categories, levels, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Achievements', href: '/admin/achievements' },
    ];

    const handleFilter = (key: string, value: string) => {
        router.get('/admin/achievements', {
            ...filters,
            [key]: value === 'all' ? null : value,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/achievements', {
            ...filters,
            search: search || null,
        }, {
            preserveState: true,
        });
    };

    const handleToggleActive = (achievement: Achievement) => {
        router.post(`/admin/achievements/${achievement.slug}/toggle-active`, {}, {
            preserveScroll: true,
        });
    };

    const handleToggleFeatured = (achievement: Achievement) => {
        router.post(`/admin/achievements/${achievement.slug}/toggle-featured`, {}, {
            preserveScroll: true,
        });
    };

    const handleDelete = (achievement: Achievement) => {
        router.delete(`/admin/achievements/${achievement.slug}`, {
            preserveScroll: true,
        });
    };

    const getImageUrl = (image: string | null) => {
        if (!image) return null;
        return image.startsWith('http') ? image : `/storage/${image}`;
    };

    const getLevelColor = (level: string) => {
        const colors: Record<string, string> = {
            international: 'bg-purple-100 text-purple-800',
            national: 'bg-red-100 text-red-800',
            state: 'bg-orange-100 text-orange-800',
            district: 'bg-blue-100 text-blue-800',
            school: 'bg-green-100 text-green-800',
        };
        return colors[level] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Achievements" />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Achievements</h1>
                        <p className="text-gray-500">Manage school achievements and awards</p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/achievements/create">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Achievement
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-4">
                        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
                            <div className="flex-1 min-w-64">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search achievements..."
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <Select value={filters.category} onValueChange={(value) => handleFilter('category', value)}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {Object.entries(categories).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={filters.level} onValueChange={(value) => handleFilter('level', value)}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Levels</SelectItem>
                                    {Object.entries(levels).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button type="submit" variant="secondary">
                                <Filter className="h-4 w-4 mr-2" />
                                Filter
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Achievements List */}
                {achievements.data.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Award className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="font-semibold text-lg mb-2">No achievements yet</h3>
                            <p className="text-gray-500 mb-4">
                                Add achievements to showcase your school's accomplishments
                            </p>
                            <Button asChild>
                                <Link href="/admin/achievements/create">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Achievement
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Achievement</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Level</TableHead>
                                    <TableHead>Achiever</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-40">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {achievements.data.map((achievement) => (
                                    <TableRow key={achievement.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                {achievement.image ? (
                                                    <img 
                                                        src={getImageUrl(achievement.image)!} 
                                                        alt={achievement.title}
                                                        className="w-12 h-12 rounded object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded bg-amber-100 flex items-center justify-center">
                                                        <Award className="h-6 w-6 text-amber-600" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium">{achievement.title}</p>
                                                    {achievement.achievement_date && (
                                                        <p className="text-sm text-gray-500">
                                                            {new Date(achievement.achievement_date).toLocaleDateString('en-IN', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric',
                                                            })}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {categories[achievement.category] || achievement.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getLevelColor(achievement.level)}>
                                                {levels[achievement.level] || achievement.level}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {achievement.achiever_name ? (
                                                <div>
                                                    <p className="font-medium">{achievement.achiever_name}</p>
                                                    {achievement.achiever_class && (
                                                        <p className="text-sm text-gray-500">{achievement.achiever_class}</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <Badge variant={achievement.is_active ? 'default' : 'secondary'}>
                                                    {achievement.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                                {achievement.is_featured && (
                                                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                                        Featured
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Button 
                                                    size="icon" 
                                                    variant="ghost"
                                                    onClick={() => handleToggleFeatured(achievement)}
                                                    title={achievement.is_featured ? 'Unfeature' : 'Feature'}
                                                >
                                                    {achievement.is_featured ? (
                                                        <StarOff className="h-4 w-4 text-amber-500" />
                                                    ) : (
                                                        <Star className="h-4 w-4" />
                                                    )}
                                                </Button>
                                                <Button 
                                                    size="icon" 
                                                    variant="ghost"
                                                    onClick={() => handleToggleActive(achievement)}
                                                >
                                                    {achievement.is_active ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </Button>
                                                <Button size="icon" variant="ghost" asChild title="View">
                                                    <Link href={`/admin/achievements/${achievement.slug}`}>
                                                        <Eye className="h-4 w-4 text-blue-600" />
                                                    </Link>
                                                </Button>
                                                <Button size="icon" variant="ghost" asChild title="Edit">
                                                    <Link href={`/admin/achievements/${achievement.slug}/edit`}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button size="icon" variant="ghost" className="text-red-600 hover:text-red-700">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Achievement?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This will permanently delete "{achievement.title}". This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction 
                                                                onClick={() => handleDelete(achievement)}
                                                                className="bg-red-600 hover:bg-red-700"
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
