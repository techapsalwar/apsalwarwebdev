import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    ArrowLeft, 
    Edit, 
    Trash2, 
    Award,
    Calendar,
    User,
    GraduationCap,
    Star,
    Eye,
    EyeOff,
    ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
    order: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    achievement: Achievement;
    categories: Record<string, string>;
    levels: Record<string, string>;
}

export default function AchievementShow({ achievement, categories, levels }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Achievements', href: '/admin/achievements' },
        { title: achievement.title, href: `/admin/achievements/${achievement.slug}` },
    ];

    const handleDelete = () => {
        router.delete(`/admin/achievements/${achievement.slug}`);
    };

    const getImageUrl = (image: string | null) => {
        if (!image) return null;
        return image.startsWith('http') ? image : `/storage/${image}`;
    };

    const getLevelColor = (level: string) => {
        const colors: Record<string, string> = {
            international: 'bg-purple-100 text-purple-800 border-purple-200',
            national: 'bg-red-100 text-red-800 border-red-200',
            state: 'bg-orange-100 text-orange-800 border-orange-200',
            district: 'bg-blue-100 text-blue-800 border-blue-200',
            school: 'bg-green-100 text-green-800 border-green-200',
        };
        return colors[level] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getCategoryIcon = (category: string) => {
        const icons: Record<string, React.ReactNode> = {
            academic: <GraduationCap className="h-4 w-4" />,
            sports: <Award className="h-4 w-4" />,
            cultural: <Star className="h-4 w-4" />,
            ncc: <Award className="h-4 w-4" />,
        };
        return icons[category] || <Award className="h-4 w-4" />;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${achievement.title} - Achievements`} />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/admin/achievements">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">{achievement.title}</h1>
                            <p className="text-gray-500">Achievement Details</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/achievements/${achievement.slug}`} target="_blank">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View Public
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={`/admin/achievements/${achievement.slug}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </Link>
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
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
                                        onClick={handleDelete}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image */}
                        {achievement.image && (
                            <Card>
                                <CardContent className="p-0">
                                    <img 
                                        src={getImageUrl(achievement.image)!} 
                                        alt={achievement.title}
                                        className="w-full h-80 object-cover rounded-lg"
                                    />
                                </CardContent>
                            </Card>
                        )}

                        {/* Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Award className="h-5 w-5 text-amber-600" />
                                    Achievement Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-lg">{achievement.title}</h3>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <Badge className={getLevelColor(achievement.level)}>
                                            {levels[achievement.level] || achievement.level}
                                        </Badge>
                                        <Badge variant="outline" className="flex items-center gap-1">
                                            {getCategoryIcon(achievement.category)}
                                            {categories[achievement.category] || achievement.category}
                                        </Badge>
                                    </div>
                                </div>

                                {achievement.description && (
                                    <>
                                        <Separator />
                                        <div>
                                            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Description</h4>
                                            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                                {achievement.description}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Achiever Info */}
                        {(achievement.achiever_name || achievement.achiever_class) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5 text-blue-600" />
                                        Achiever Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
                                            <User className="h-8 w-8 text-amber-600" />
                                        </div>
                                        <div>
                                            {achievement.achiever_name && (
                                                <p className="font-semibold text-lg">{achievement.achiever_name}</p>
                                            )}
                                            {achievement.achiever_class && (
                                                <p className="text-gray-500">{achievement.achiever_class}</p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
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
                                    <span className="text-gray-600 dark:text-gray-400">Visibility</span>
                                    <Badge variant={achievement.is_active ? 'default' : 'secondary'}>
                                        {achievement.is_active ? (
                                            <><Eye className="h-3 w-3 mr-1" /> Active</>
                                        ) : (
                                            <><EyeOff className="h-3 w-3 mr-1" /> Inactive</>
                                        )}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Featured</span>
                                    <Badge variant={achievement.is_featured ? 'default' : 'outline'} className={achievement.is_featured ? 'bg-amber-500 hover:bg-amber-600' : ''}>
                                        {achievement.is_featured ? (
                                            <><Star className="h-3 w-3 mr-1 fill-current" /> Featured</>
                                        ) : (
                                            'Not Featured'
                                        )}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Display Order</span>
                                    <span className="font-medium">{achievement.order}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Timeline Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {achievement.achievement_date && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Achievement Date</span>
                                        <span className="font-medium">
                                            {new Date(achievement.achievement_date).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                )}
                                {achievement.academic_year && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Academic Year</span>
                                        <span className="font-medium">{achievement.academic_year}</span>
                                    </div>
                                )}
                                <Separator />
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Created</span>
                                    <span>
                                        {new Date(achievement.created_at).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Last Updated</span>
                                    <span>
                                        {new Date(achievement.updated_at).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button 
                                    variant="outline" 
                                    className="w-full justify-start"
                                    onClick={() => router.post(`/admin/achievements/${achievement.slug}/toggle-active`)}
                                >
                                    {achievement.is_active ? (
                                        <><EyeOff className="h-4 w-4 mr-2" /> Deactivate</>
                                    ) : (
                                        <><Eye className="h-4 w-4 mr-2" /> Activate</>
                                    )}
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="w-full justify-start"
                                    onClick={() => router.post(`/admin/achievements/${achievement.slug}/toggle-featured`)}
                                >
                                    {achievement.is_featured ? (
                                        <><Star className="h-4 w-4 mr-2" /> Remove from Featured</>
                                    ) : (
                                        <><Star className="h-4 w-4 mr-2 fill-amber-500 text-amber-500" /> Mark as Featured</>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
