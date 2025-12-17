import PublicLayout from '@/layouts/public-layout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Award, 
    Trophy, 
    Medal, 
    Star,
    Filter,
    Calendar,
    ChevronRight,
    GraduationCap,
    Music,
    Shield,
    Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
}

interface Props {
    achievements: {
        data: Achievement[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    featured: Achievement[];
    categories: Record<string, string>;
    levels: Record<string, string>;
    years: string[];
    statistics: {
        total: number;
        international: number;
        national: number;
        state: number;
    };
    filters: {
        category: string;
        level: string;
        year: string;
    };
}

const levelColors: Record<string, string> = {
    international: 'bg-purple-100 text-purple-800 border-purple-200',
    national: 'bg-red-100 text-red-800 border-red-200',
    state: 'bg-orange-100 text-orange-800 border-orange-200',
    district: 'bg-blue-100 text-blue-800 border-blue-200',
    school: 'bg-green-100 text-green-800 border-green-200',
};

const categoryIcons: Record<string, React.ReactNode> = {
    academic: <GraduationCap className="h-5 w-5" />,
    sports: <Trophy className="h-5 w-5" />,
    cultural: <Music className="h-5 w-5" />,
    ncc: <Shield className="h-5 w-5" />,
    co_curricular: <Star className="h-5 w-5" />,
    faculty: <Users className="h-5 w-5" />,
    school: <Award className="h-5 w-5" />,
    other: <Medal className="h-5 w-5" />,
};

export default function AchievementsIndex({ 
    achievements, 
    featured, 
    categories, 
    levels, 
    years,
    statistics,
    filters 
}: Props) {
    const handleFilter = (key: string, value: string) => {
        router.get('/achievements', {
            ...filters,
            [key]: value === 'all' ? undefined : value,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getImageUrl = (image: string | null) => {
        if (!image) return null;
        return image.startsWith('http') ? image : `/storage/${image}`;
    };

    return (
        <PublicLayout title="Achievements - Army Public School Alwar">
            <Head title="Achievements - APS Alwar" />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-gray-950 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <Badge className="mb-4 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                            <Trophy className="h-4 w-4 mr-1" />
                            Excellence & Recognition
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Our Achievements
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                            Celebrating the excellence, dedication, and outstanding accomplishments of our students, 
                            faculty, and the school community.
                        </p>

                        {/* Statistics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                                <div className="text-3xl font-bold text-amber-600">{statistics.total}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Total Achievements</div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                                <div className="text-3xl font-bold text-purple-600">{statistics.international}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">International</div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                                <div className="text-3xl font-bold text-red-600">{statistics.national}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">National</div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                                <div className="text-3xl font-bold text-orange-600">{statistics.state}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">State Level</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Achievements */}
            {featured.length > 0 && (
                <section className="py-12 bg-gradient-to-r from-amber-600 to-orange-600">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-center gap-2 mb-8">
                            <Star className="h-6 w-6 text-yellow-300 fill-yellow-300" />
                            <h2 className="text-2xl font-bold text-white">Featured Achievements</h2>
                            <Star className="h-6 w-6 text-yellow-300 fill-yellow-300" />
                        </div>
                        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {featured.map((item) => (
                                <Link 
                                    key={item.id} 
                                    href={`/achievements/${item.slug}`}
                                    className="group"
                                >
                                    <Card className="h-full bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all">
                                        <CardContent className="p-6 text-white">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <Trophy className="h-6 w-6 text-amber-800" />
                                                </div>
                                                <div>
                                                    <Badge className={`mb-2 ${levelColors[item.level]} text-xs`}>
                                                        {levels[item.level]}
                                                    </Badge>
                                                    <h3 className="font-semibold line-clamp-2 group-hover:underline">
                                                        {item.title}
                                                    </h3>
                                                    {item.achiever_name && (
                                                        <p className="text-sm text-white/80 mt-1">
                                                            {item.achiever_name}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Filters */}
            <section className="py-8 bg-gray-50 dark:bg-gray-900 border-b">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Filter by:</span>
                        </div>
                        <Select value={filters.category} onValueChange={(v) => handleFilter('category', v)}>
                            <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {Object.entries(categories).map(([key, label]) => (
                                    <SelectItem key={key} value={key}>{label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={filters.level} onValueChange={(v) => handleFilter('level', v)}>
                            <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder="Level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Levels</SelectItem>
                                {Object.entries(levels).map(([key, label]) => (
                                    <SelectItem key={key} value={key}>{label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {years.length > 0 && (
                            <Select value={filters.year} onValueChange={(v) => handleFilter('year', v)}>
                                <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Years</SelectItem>
                                    {years.map((year) => (
                                        <SelectItem key={year} value={year}>{year}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                </div>
            </section>

            {/* Achievements Grid */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    {achievements.data.length === 0 ? (
                        <div className="text-center py-12">
                            <Award className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                No achievements found
                            </h3>
                            <p className="text-gray-500 mb-4">
                                Try adjusting your filters to find what you're looking for.
                            </p>
                            <Button 
                                variant="outline"
                                onClick={() => router.get('/achievements')}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {achievements.data.map((achievement) => (
                                    <Link 
                                        key={achievement.id} 
                                        href={`/achievements/${achievement.slug}`}
                                        className="group"
                                    >
                                        <Card className="h-full hover:shadow-lg transition-all overflow-hidden">
                                            {achievement.image ? (
                                                <div className="aspect-video relative overflow-hidden">
                                                    <img 
                                                        src={getImageUrl(achievement.image)!} 
                                                        alt={achievement.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                    <div className="absolute top-3 left-3">
                                                        <Badge className={levelColors[achievement.level]}>
                                                            {levels[achievement.level]}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="aspect-video bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900 dark:to-orange-900 flex items-center justify-center relative">
                                                    <Award className="h-16 w-16 text-amber-500 opacity-50" />
                                                    <div className="absolute top-3 left-3">
                                                        <Badge className={levelColors[achievement.level]}>
                                                            {levels[achievement.level]}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            )}
                                            <CardContent className="p-5">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-amber-600">
                                                        {categoryIcons[achievement.category] || <Award className="h-5 w-5" />}
                                                    </span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {categories[achievement.category]}
                                                    </Badge>
                                                </div>
                                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2 group-hover:text-amber-600 transition-colors">
                                                    {achievement.title}
                                                </h3>
                                                {achievement.achiever_name && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                                        <span className="font-medium">{achievement.achiever_name}</span>
                                                        {achievement.achiever_class && (
                                                            <span className="text-gray-400"> • {achievement.achiever_class}</span>
                                                        )}
                                                    </p>
                                                )}
                                                {achievement.achievement_date && (
                                                    <div className="flex items-center gap-1 mt-3 text-sm text-gray-500">
                                                        <Calendar className="h-4 w-4" />
                                                        {new Date(achievement.achievement_date).toLocaleDateString('en-IN', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        })}
                                                    </div>
                                                )}
                                                <div className="flex items-center text-amber-600 mt-4 text-sm font-medium group-hover:gap-2 transition-all">
                                                    View Details <ChevronRight className="h-4 w-4" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>

                            {/* Pagination */}
                            {achievements.last_page > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-12">
                                    {achievements.links.map((link, index) => (
                                        <Button
                                            key={index}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url)}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-amber-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Be Part of Our Success Story
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                        Join Army Public School Alwar and unlock your potential. Our students consistently 
                        achieve excellence in academics, sports, and extracurricular activities.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
                            <Link href="/admissions">
                                Apply for Admission
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg">
                            <Link href="/about">
                                Learn More About Us
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
