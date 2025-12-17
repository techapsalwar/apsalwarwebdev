import PublicLayout from '@/layouts/public-layout';
import { Link } from '@inertiajs/react';
import { 
    ArrowLeft,
    Trophy,
    Award,
    Users,
    Star,
    TrendingUp,
    GraduationCap,
    Medal,
    Target,
    Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Topper {
    name: string;
    percentage: number | null;
    photo: string | null;
    photoUrl: string | null;
    stream: string | null;
    rank: number | null;
}

interface Result {
    id: number;
    year: string;
    class: string;
    stream: string | null;
    totalStudents: number;
    passedStudents: number;
    passPercentage: number;
    schoolAverage: number | null;
    highestMarks: number | null;
    distinctionCount: number;
    firstDivisionCount: number;
    secondDivisionCount: number;
    thirdDivisionCount: number;
    apiScore: number | null;
    topperName: string | null;
    topperPercentage: number | null;
    topperPhoto: string | null;
    topperStream: string | null;
    streamToppers: Record<string, Topper[]>;
    classXToppers: Topper[];
}

interface Achievement {
    title: string;
    description: string;
}

interface Props {
    results: Record<string, Result[]>;
    achievements: Achievement[];
}

// Fancy Topper Card Component
const TopperCard = ({ 
    topper, 
    rank, 
    size = 'normal',
}: { 
    topper: Topper; 
    rank: number;
    size?: 'small' | 'normal' | 'large';
}) => {
    const sizeClasses = {
        small: 'w-16 h-16',
        normal: 'w-24 h-24',
        large: 'w-32 h-32',
    };

    const rankColors = {
        1: 'from-amber-400 to-yellow-500',
        2: 'from-gray-300 to-gray-400',
        3: 'from-amber-600 to-amber-700',
    };

    const getRankBadge = (rank: number) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    return (
        <div className="flex flex-col items-center group">
            {/* Photo with animated border */}
            <div className="relative mb-3">
                {/* Glowing ring effect */}
                <div className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-gradient-to-r ${rankColors[rank as keyof typeof rankColors] || 'from-blue-400 to-blue-500'} animate-pulse opacity-50 blur-md`} />
                
                {/* Photo container */}
                <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden border-4 border-white shadow-xl ring-4 ring-amber-200 dark:ring-amber-800`}>
                    {topper.photoUrl ? (
                        <img
                            src={topper.photoUrl}
                            alt={topper.name}
                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800 flex items-center justify-center">
                            <GraduationCap className="w-1/2 h-1/2 text-amber-600" />
                        </div>
                    )}
                </div>

                {/* Rank badge */}
                <div className="absolute -top-2 -right-2 text-2xl">
                    {getRankBadge(rank)}
                </div>
            </div>

            {/* Name */}
            <h4 className="font-bold text-gray-900 dark:text-white text-center text-sm md:text-base">
                {topper.name}
            </h4>

            {/* Percentage with fancy styling */}
            {topper.percentage && (
                <div className="relative mt-2">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full blur opacity-50" />
                    <div className="relative bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold px-4 py-1 rounded-full text-lg shadow-lg">
                        {topper.percentage}%
                    </div>
                </div>
            )}

            {/* Stream badge (for Class XII) */}
            {topper.stream && (
                <Badge variant="outline" className="mt-2 text-xs">
                    {topper.stream}
                </Badge>
            )}
        </div>
    );
};

// Stream Topper Section for Class XII
const StreamToppersSection = ({ 
    streamToppers 
}: { 
    streamToppers: Record<string, Topper[]> 
}) => {
    const streamColors = {
        Science: { bg: 'from-blue-500 to-cyan-500', light: 'bg-blue-50 dark:bg-blue-900/20', icon: '🔬' },
        Commerce: { bg: 'from-green-500 to-emerald-500', light: 'bg-green-50 dark:bg-green-900/20', icon: '📊' },
        Humanities: { bg: 'from-purple-500 to-pink-500', light: 'bg-purple-50 dark:bg-purple-900/20', icon: '📚' },
    };

    const streams = Object.keys(streamToppers);
    
    if (streams.length === 0) return null;

    return (
        <div className="mt-8">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Stream Toppers
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {streams.map((stream) => {
                    const toppers = streamToppers[stream];
                    const colors = streamColors[stream as keyof typeof streamColors] || streamColors.Science;
                    
                    if (!toppers || toppers.length === 0) return null;
                    
                    return (
                        <Card key={stream} className={`overflow-hidden ${colors.light}`}>
                            <CardHeader className={`bg-gradient-to-r ${colors.bg} text-white py-3`}>
                                <CardTitle className="text-center text-lg flex items-center justify-center gap-2">
                                    <span>{colors.icon}</span>
                                    {stream}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 pb-4">
                                {toppers.map((topper, idx) => (
                                    <TopperCard 
                                        key={idx} 
                                        topper={{ ...topper, stream }} 
                                        rank={1} 
                                        size="normal"
                                    />
                                ))}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

// Class X Top 5 Section
const ClassXToppersSection = ({ toppers }: { toppers: Topper[] }) => {
    if (!toppers || toppers.length === 0) return null;

    return (
        <div className="mt-8">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                Top Performers
            </h4>
            <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-900/20 dark:via-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-6 md:p-8">
                {/* Top 3 row */}
                <div className="flex justify-center items-end gap-4 md:gap-8 mb-8">
                    {/* Second place */}
                    {toppers[1] && (
                        <div className="order-1">
                            <TopperCard topper={toppers[1]} rank={2} size="normal" />
                        </div>
                    )}
                    
                    {/* First place (larger) */}
                    {toppers[0] && (
                        <div className="order-2 transform md:scale-110">
                            <TopperCard topper={toppers[0]} rank={1} size="large" />
                        </div>
                    )}
                    
                    {/* Third place */}
                    {toppers[2] && (
                        <div className="order-3">
                            <TopperCard topper={toppers[2]} rank={3} size="normal" />
                        </div>
                    )}
                </div>

                {/* Remaining toppers */}
                {toppers.length > 3 && (
                    <div className="flex justify-center gap-6 md:gap-12 pt-4 border-t border-amber-200 dark:border-amber-800">
                        {toppers.slice(3).map((topper, idx) => (
                            <TopperCard key={idx} topper={topper} rank={idx + 4} size="small" />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default function Results({ results, achievements }: Props) {
    const years = Object.keys(results).sort().reverse();
    const defaultYear = years[0] || '2024';

    // Calculate overall stats
    const allResults = Object.values(results).flat();
    const avgPassRate = allResults.length > 0 
        ? (allResults.reduce((sum, r) => sum + r.passPercentage, 0) / allResults.length).toFixed(1)
        : '100';
    const totalDistinctions = allResults.reduce((sum, r) => sum + r.distinctionCount, 0);

    return (
        <PublicLayout title="Board Results - APS Alwar">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-950 py-16 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-10 left-10 w-20 h-20 bg-amber-200 rounded-full opacity-20 blur-xl" />
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-green-200 rounded-full opacity-20 blur-xl" />
                
                <div className="container mx-auto px-4 relative">
                    <Button variant="ghost" size="sm" className="mb-6" asChild>
                        <Link href="/academics">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Academics
                        </Link>
                    </Button>
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="mb-4 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 animate-pulse">
                            <Trophy className="h-3 w-3 mr-1" />
                            100% Pass Rate
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Board Examination Results
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Consistently achieving excellence in CBSE Board Examinations
                        </p>
                    </div>
                </div>
            </section>

            {/* Achievements Banner */}
            <section className="py-8 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="text-white">
                            <Trophy className="h-8 w-8 mx-auto mb-2 opacity-90" />
                            <div className="text-2xl md:text-3xl font-bold">{avgPassRate}%</div>
                            <div className="text-amber-100 text-sm">Pass Rate</div>
                        </div>
                        <div className="text-white">
                            <Star className="h-8 w-8 mx-auto mb-2 opacity-90" />
                            <div className="text-2xl md:text-3xl font-bold">{totalDistinctions}+</div>
                            <div className="text-amber-100 text-sm">Distinctions</div>
                        </div>
                        <div className="text-white">
                            <Medal className="h-8 w-8 mx-auto mb-2 opacity-90" />
                            <div className="text-2xl md:text-3xl font-bold">50%+</div>
                            <div className="text-amber-100 text-sm">First Division</div>
                        </div>
                        <div className="text-white">
                            <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-90" />
                            <div className="text-2xl md:text-3xl font-bold">20+</div>
                            <div className="text-amber-100 text-sm">Years Excellence</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Results by Year */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <Tabs defaultValue={defaultYear} className="w-full">
                            <div className="flex justify-center mb-8">
                                <TabsList className="grid grid-cols-3 md:grid-cols-5 gap-2">
                                    {years.map(year => (
                                        <TabsTrigger key={year} value={year} className="px-6">
                                            {year}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </div>

                            {years.map(year => (
                                <TabsContent key={year} value={year}>
                                    <div className="space-y-12">
                                        {results[year]?.map((result, index) => (
                                            <Card key={result.id || index} className="overflow-hidden shadow-lg">
                                                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800">
                                                    <div className="flex items-center justify-between flex-wrap gap-4">
                                                        <div>
                                                            <CardTitle className="flex items-center gap-2 text-xl">
                                                                <GraduationCap className="h-6 w-6 text-amber-600" />
                                                                Class {result.class} - {result.year}
                                                            </CardTitle>
                                                            <CardDescription>
                                                                CBSE Board Examination Results
                                                                {result.apiScore && (
                                                                    <span className="ml-2 text-amber-600 font-medium">
                                                                        API Score: {result.apiScore}
                                                                    </span>
                                                                )}
                                                            </CardDescription>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Badge className="bg-green-600 text-lg px-4 py-1.5 shadow-md">
                                                                <Trophy className="h-4 w-4 mr-1" />
                                                                {result.passPercentage}% Pass
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="pt-6">
                                                    {/* Statistics Grid */}
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
                                                            <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                                                            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                                                {result.totalStudents}
                                                            </div>
                                                            <div className="text-sm text-blue-600 dark:text-blue-400">
                                                                Students Appeared
                                                            </div>
                                                        </div>
                                                        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 text-center">
                                                            <Star className="h-6 w-6 mx-auto mb-2 text-amber-600" />
                                                            <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                                                                {result.distinctionCount}
                                                            </div>
                                                            <div className="text-sm text-amber-600 dark:text-amber-400">
                                                                90%+ Distinction
                                                            </div>
                                                        </div>
                                                        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center">
                                                            <Award className="h-6 w-6 mx-auto mb-2 text-green-600" />
                                                            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                                                                {result.firstDivisionCount}
                                                            </div>
                                                            <div className="text-sm text-green-600 dark:text-green-400">
                                                                80%+ First Division
                                                            </div>
                                                        </div>
                                                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center">
                                                            <TrendingUp className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                                                            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                                                                {result.highestMarks || result.topperPercentage || '-'}%
                                                            </div>
                                                            <div className="text-sm text-purple-600 dark:text-purple-400">
                                                                Highest Score
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Overall School Topper */}
                                                    {result.topperName && (
                                                        <div className="mb-8">
                                                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                                                <Medal className="h-5 w-5 text-amber-500" />
                                                                School Topper
                                                            </h4>
                                                            <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 dark:from-amber-900/30 dark:via-yellow-900/30 dark:to-amber-900/30 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
                                                                <div className="relative">
                                                                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full blur-lg opacity-50" />
                                                                    <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-2xl ring-4 ring-amber-300">
                                                                        {result.topperPhoto ? (
                                                                            <img
                                                                                src={`/storage/${result.topperPhoto}`}
                                                                                alt={result.topperName}
                                                                                className="w-full h-full object-cover"
                                                                            />
                                                                        ) : (
                                                                            <div className="w-full h-full bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center">
                                                                                <GraduationCap className="h-12 w-12 text-amber-700" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="absolute -top-2 -right-2 text-3xl">🏆</div>
                                                                </div>
                                                                <div className="text-center md:text-left">
                                                                    <h5 className="text-2xl font-bold text-gray-900 dark:text-white">
                                                                        {result.topperName}
                                                                    </h5>
                                                                    {result.topperStream && (
                                                                        <Badge className="mt-2 bg-amber-100 text-amber-800">
                                                                            {result.topperStream} Stream
                                                                        </Badge>
                                                                    )}
                                                                    {result.topperPercentage && (
                                                                        <div className="mt-3 inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold px-6 py-2 rounded-full text-2xl shadow-lg">
                                                                            <Sparkles className="h-5 w-5" />
                                                                            {result.topperPercentage}%
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Class X Toppers (Top 5) */}
                                                    {result.class === 'X' && result.classXToppers && result.classXToppers.length > 0 && (
                                                        <ClassXToppersSection toppers={result.classXToppers} />
                                                    )}

                                                    {/* Class XII Stream Toppers */}
                                                    {result.class === 'XII' && result.streamToppers && Object.keys(result.streamToppers).length > 0 && (
                                                        <StreamToppersSection streamToppers={result.streamToppers} />
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </div>
                </div>
            </section>

            {/* Achievements */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-amber-100 text-amber-800">Our Pride</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Academic Achievements
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {achievements.map((achievement, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Target className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{achievement.title}</CardTitle>
                                            <CardDescription className="mt-1">{achievement.description}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-green-600 via-green-700 to-green-600">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Be Part of Our Success Story
                    </h2>
                    <p className="text-green-100 mb-8 max-w-2xl mx-auto">
                        Join APS Alwar and achieve academic excellence with our dedicated faculty and proven track record.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button size="lg" variant="secondary" asChild>
                            <a href="https://erp.awesindia.edu.in/webinterface/searchschool" target="_blank" rel="noopener noreferrer">
                                Apply for Admission
                            </a>
                        </Button>
                        <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                            <Link href="/academics/faculty">
                                Meet Our Faculty
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
