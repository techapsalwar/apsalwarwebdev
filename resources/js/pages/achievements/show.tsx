import PublicLayout from '@/layouts/public-layout';
import { Head, Link } from '@inertiajs/react';
import { 
    ArrowLeft,
    Award, 
    Trophy, 
    Calendar,
    User,
    GraduationCap,
    ChevronRight,
    Share2,
    Music,
    Shield,
    Star,
    Medal,
    Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface Achievement {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    image: string | null;
    image_url: string | null;
    category: string;
    category_label: string;
    level: string;
    level_label: string;
    achiever_name: string | null;
    achiever_class: string | null;
    achievement_date: string | null;
    academic_year: string | null;
}

interface RelatedAchievement {
    id: number;
    title: string;
    slug: string;
    image: string | null;
    image_url: string | null;
    category: string;
    level: string;
    level_label: string;
}

interface Props {
    achievement: Achievement;
    related: RelatedAchievement[];
    categories: Record<string, string>;
    levels: Record<string, string>;
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

const levelGradients: Record<string, string> = {
    international: 'from-purple-600 to-indigo-600',
    national: 'from-red-600 to-rose-600',
    state: 'from-orange-500 to-amber-500',
    district: 'from-blue-500 to-cyan-500',
    school: 'from-green-500 to-emerald-500',
};

export default function AchievementShow({ achievement, related, categories, levels }: Props) {
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: achievement.title,
                    text: achievement.description || `Check out this achievement from APS Alwar!`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Share cancelled');
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const getImageUrl = (image: string | null) => {
        if (!image) return null;
        return image.startsWith('http') ? image : `/storage/${image}`;
    };

    return (
        <PublicLayout title={`${achievement.title} - Achievements - APS Alwar`}>
            <Head title={`${achievement.title} - Achievements`} />

            {/* Hero Section */}
            <section className={`relative bg-gradient-to-r ${levelGradients[achievement.level] || 'from-amber-600 to-orange-600'} py-12`}>
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 mb-6">
                        <Button asChild variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">
                            <Link href="/achievements">
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Back to Achievements
                            </Link>
                        </Button>
                    </div>
                    <div className="max-w-4xl">
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <Badge className={`${levelColors[achievement.level]} text-sm`}>
                                {achievement.level_label}
                            </Badge>
                            <Badge variant="outline" className="bg-white/20 text-white border-white/30 flex items-center gap-1">
                                {categoryIcons[achievement.category]}
                                {achievement.category_label}
                            </Badge>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            {achievement.title}
                        </h1>
                        {(achievement.achiever_name || achievement.achievement_date) && (
                            <div className="flex flex-wrap items-center gap-4 text-white/90">
                                {achievement.achiever_name && (
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        <span>
                                            {achievement.achiever_name}
                                            {achievement.achiever_class && ` (${achievement.achiever_class})`}
                                        </span>
                                    </div>
                                )}
                                {achievement.achievement_date && (
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>{achievement.achievement_date}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Image */}
                            {achievement.image_url && (
                                <Card className="overflow-hidden">
                                    <img 
                                        src={achievement.image_url} 
                                        alt={achievement.title}
                                        className="w-full h-auto max-h-[500px] object-cover"
                                    />
                                </Card>
                            )}

                            {/* Description */}
                            {achievement.description && (
                                <Card>
                                    <CardContent className="p-6">
                                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                            <Award className="h-5 w-5 text-amber-600" />
                                            About This Achievement
                                        </h2>
                                        <div className="prose prose-gray dark:prose-invert max-w-none">
                                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                                                {achievement.description}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Achiever Details */}
                            {achievement.achiever_name && (
                                <Card>
                                    <CardContent className="p-6">
                                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                            <User className="h-5 w-5 text-blue-600" />
                                            Achiever Details
                                        </h2>
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
                                                <Trophy className="h-8 w-8 text-amber-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {achievement.achiever_name}
                                                </h3>
                                                {achievement.achiever_class && (
                                                    <p className="text-gray-600 dark:text-gray-400">
                                                        {achievement.achiever_class}
                                                    </p>
                                                )}
                                                {achievement.academic_year && (
                                                    <p className="text-sm text-gray-500">
                                                        Academic Year: {achievement.academic_year}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Achievement Info Card */}
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="font-semibold mb-4">Achievement Details</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Level</span>
                                            <Badge className={levelColors[achievement.level]}>
                                                {achievement.level_label}
                                            </Badge>
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Category</span>
                                            <Badge variant="outline" className="flex items-center gap-1">
                                                {categoryIcons[achievement.category]}
                                                {achievement.category_label}
                                            </Badge>
                                        </div>
                                        {achievement.achievement_date && (
                                            <>
                                                <Separator />
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-600 dark:text-gray-400">Date</span>
                                                    <span className="font-medium">{achievement.achievement_date}</span>
                                                </div>
                                            </>
                                        )}
                                        {achievement.academic_year && (
                                            <>
                                                <Separator />
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-600 dark:text-gray-400">Academic Year</span>
                                                    <span className="font-medium">{achievement.academic_year}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    
                                    <Button 
                                        variant="outline" 
                                        className="w-full mt-6"
                                        onClick={handleShare}
                                    >
                                        <Share2 className="h-4 w-4 mr-2" />
                                        Share Achievement
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Quick Links */}
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="font-semibold mb-4">Explore More</h3>
                                    <div className="space-y-2">
                                        <Button asChild variant="ghost" className="w-full justify-start">
                                            <Link href={`/achievements?category=${achievement.category}`}>
                                                {categoryIcons[achievement.category]}
                                                <span className="ml-2">More {achievement.category_label} Achievements</span>
                                            </Link>
                                        </Button>
                                        <Button asChild variant="ghost" className="w-full justify-start">
                                            <Link href={`/achievements?level=${achievement.level}`}>
                                                <Trophy className="h-4 w-4" />
                                                <span className="ml-2">More {achievement.level_label} Achievements</span>
                                            </Link>
                                        </Button>
                                        <Button asChild variant="ghost" className="w-full justify-start">
                                            <Link href="/achievements">
                                                <Award className="h-4 w-4" />
                                                <span className="ml-2">All Achievements</span>
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Achievements */}
            {related.length > 0 && (
                <section className="py-12 bg-gray-50 dark:bg-gray-900">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                                Related Achievements
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {related.map((item) => (
                                    <Link 
                                        key={item.id} 
                                        href={`/achievements/${item.slug}`}
                                        className="group"
                                    >
                                        <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
                                            {item.image_url ? (
                                                <div className="aspect-video relative overflow-hidden">
                                                    <img 
                                                        src={item.image_url} 
                                                        alt={item.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                    <div className="absolute top-2 left-2">
                                                        <Badge className={`${levelColors[item.level]} text-xs`}>
                                                            {item.level_label}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="aspect-video bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center relative">
                                                    <Award className="h-10 w-10 text-amber-500 opacity-50" />
                                                    <div className="absolute top-2 left-2">
                                                        <Badge className={`${levelColors[item.level]} text-xs`}>
                                                            {item.level_label}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            )}
                                            <CardContent className="p-4">
                                                <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-amber-600 transition-colors">
                                                    {item.title}
                                                </h3>
                                                <div className="flex items-center text-amber-600 mt-2 text-sm">
                                                    View Details <ChevronRight className="h-4 w-4" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="py-12">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Inspired by Our Achievements?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-xl mx-auto">
                        Join Army Public School Alwar and be part of our legacy of excellence.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
                            <Link href="/admissions">Apply for Admission</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg">
                            <Link href="/contact">Contact Us</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
