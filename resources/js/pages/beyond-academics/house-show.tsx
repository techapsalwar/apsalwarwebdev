import PublicLayout from '@/layouts/public-layout';
import { Link } from '@inertiajs/react';
import {
    Shield,
    Trophy,
    Users,
    Star,
    Target,
    Medal,
    ArrowLeft,
    User,
    Crown,
    Award,
    BookOpen,
    Music,
    Sparkles,
    Calendar,
    ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface Leader {
    name: string;
    class: string;
    photo: string | null;
}

interface Teacher {
    name: string;
    designation: string;
    subject: string | null;
}

interface PointEntry {
    category: string;
    points: number;
    reason: string | null;
    awarded_date: string;
}

interface House {
    id: number;
    name: string;
    slug: string;
    motto: string;
    color: string;
    color_name: string;
    description: string;
    icon: string;
    logo: string | null;
    image: string | null;
    house_master: string | null;
    house_master_designation: string | null;
    house_master_photo: string | null;
    captain: Leader | null;
    vice_captain: Leader | null;
    prefects: Leader[];
    teachers: Teacher[];
    total_points: number;
    rank: number;
    total_houses: number;
    points_breakdown: Record<string, number>;
    recent_points: PointEntry[];
}

interface Props {
    house: House;
}

const categoryIcons: Record<string, React.ReactNode> = {
    sports: <Trophy className="h-4 w-4" />,
    academics: <BookOpen className="h-4 w-4" />,
    cultural: <Music className="h-4 w-4" />,
    discipline: <Shield className="h-4 w-4" />,
    other: <Sparkles className="h-4 w-4" />,
};

const categoryColors: Record<string, string> = {
    sports: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    academics: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    cultural: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    discipline: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    other: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
};

function LeaderCard({
    title,
    leader,
    color,
    icon: Icon,
}: {
    title: string;
    leader: Leader | null;
    color: string;
    icon: React.ElementType;
}) {
    if (!leader) {
        return (
            <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${color}20` }}
                >
                    <Icon className="h-6 w-6" style={{ color }} />
                </div>
                <div>
                    <p className="text-xs text-muted-foreground">{title}</p>
                    <p className="text-sm text-muted-foreground italic">Not assigned</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <Avatar className="h-14 w-14 border-2" style={{ borderColor: color }}>
                <AvatarImage src={leader.photo || undefined} alt={leader.name} />
                <AvatarFallback style={{ backgroundColor: `${color}20`, color }}>
                    {leader.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{title}</p>
                <p className="font-semibold text-gray-900 dark:text-white">{leader.name}</p>
                <p className="text-sm text-muted-foreground">Class {leader.class}</p>
            </div>
        </div>
    );
}

export default function HouseShow({ house }: Props) {
    const maxPoints = Math.max(
        ...Object.values(house.points_breakdown).map(p => Number(p)),
        1
    );

    return (
        <PublicLayout title={`${house.name} - House System - APS Alwar`}>
            {/* Hero Section */}
            <section
                className="relative bg-gradient-to-b py-20"
                style={{
                    background: `linear-gradient(to bottom, ${house.color}15, transparent)`,
                }}
            >
                <div className="container mx-auto px-4">
                    <Button variant="ghost" asChild className="mb-6">
                        <Link href="/beyond-academics/houses">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Houses
                        </Link>
                    </Button>

                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            {/* House Logo/Icon */}
                            <div
                                className="w-32 h-32 rounded-full flex items-center justify-center shadow-lg"
                                style={{ backgroundColor: 'white' }}
                            >
                                {house.logo ? (
                                    <img
                                        src={house.logo}
                                        alt={house.name}
                                        className="w-24 h-24 object-contain"
                                    />
                                ) : (
                                    <Shield
                                        className="w-16 h-16"
                                        style={{ color: house.color }}
                                    />
                                )}
                            </div>

                            {/* House Info */}
                            <div className="flex-1 text-center md:text-left">
                                <Badge
                                    className="mb-3 text-white"
                                    style={{ backgroundColor: house.color }}
                                >
                                    {house.color_name} House
                                </Badge>
                                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
                                    {house.name}
                                </h1>
                                <p className="text-xl text-gray-600 dark:text-gray-300 italic flex items-center justify-center md:justify-start gap-2">
                                    <Target className="h-5 w-5" style={{ color: house.color }} />
                                    "{house.motto}"
                                </p>
                            </div>

                            {/* Points & Rank */}
                            <div className="flex gap-4">
                                <Card className="text-center p-4">
                                    <Trophy className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                                    <p className="text-3xl font-bold" style={{ color: house.color }}>
                                        {house.total_points}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Total Points</p>
                                </Card>
                                <Card className="text-center p-4">
                                    <Medal className="h-8 w-8 mx-auto mb-2" style={{ color: house.rank === 1 ? '#FFD700' : house.rank === 2 ? '#C0C0C0' : house.rank === 3 ? '#CD7F32' : '#9CA3AF' }} />
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                        #{house.rank}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        of {house.total_houses} Houses
                                    </p>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* House Banner Image */}
            {house.image && (
                <section className="container mx-auto px-4 -mt-4 mb-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="rounded-xl overflow-hidden shadow-lg">
                            <img
                                src={house.image}
                                alt={house.name}
                                className="w-full h-64 md:h-80 object-cover"
                            />
                        </div>
                    </div>
                </section>
            )}

            {/* Main Content */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
                        {/* Left Column - Main Info */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* About */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>About {house.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {house.description}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* House Master */}
                            {house.house_master && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <User className="h-5 w-5" style={{ color: house.color }} />
                                            House Master
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div
                                            className="flex items-center gap-4 p-4 rounded-lg"
                                            style={{ backgroundColor: `${house.color}10` }}
                                        >
                                            <Avatar className="h-16 w-16 border-2" style={{ borderColor: house.color }}>
                                                <AvatarImage src={house.house_master_photo || undefined} />
                                                <AvatarFallback style={{ backgroundColor: house.color, color: 'white' }}>
                                                    {house.house_master.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {house.house_master}
                                                </p>
                                                {house.house_master_designation && (
                                                    <p className="text-muted-foreground">{house.house_master_designation}</p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* House Teachers */}
                            {house.teachers.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Users className="h-5 w-5 text-blue-500" />
                                            House Teachers
                                        </CardTitle>
                                        <CardDescription>
                                            Teachers associated with {house.name}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {house.teachers.map((teacher, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-3 p-3 rounded-lg border"
                                                >
                                                    <div
                                                        className="w-10 h-10 rounded-full flex items-center justify-center"
                                                        style={{ backgroundColor: `${house.color}20` }}
                                                    >
                                                        <User className="h-5 w-5" style={{ color: house.color }} />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">
                                                            {teacher.name}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {teacher.designation}
                                                            {teacher.subject && ` • ${teacher.subject}`}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Student Leadership */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Crown className="h-5 w-5 text-amber-500" />
                                        Student Leadership
                                    </CardTitle>
                                    <CardDescription>
                                        House Captain, Vice Captain, and Prefects
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Captain & Vice Captain */}
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <LeaderCard
                                            title="House Captain"
                                            leader={house.captain}
                                            color={house.color}
                                            icon={Crown}
                                        />
                                        <LeaderCard
                                            title="Vice Captain"
                                            leader={house.vice_captain}
                                            color={house.color}
                                            icon={Award}
                                        />
                                    </div>

                                    {/* Prefects */}
                                    {house.prefects.length > 0 && (
                                        <>
                                            <Separator />
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                                    <Star className="h-4 w-4" style={{ color: house.color }} />
                                                    House Prefects
                                                </h4>
                                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {house.prefects.map((prefect, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                                                        >
                                                            <Avatar className="h-10 w-10">
                                                                <AvatarImage src={prefect.photo || undefined} />
                                                                <AvatarFallback style={{ backgroundColor: `${house.color}30` }}>
                                                                    {prefect.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="font-medium text-sm">{prefect.name}</p>
                                                                <p className="text-xs text-muted-foreground">Class {prefect.class}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Points & Activity */}
                        <div className="space-y-6">
                            {/* Points Breakdown */}
                            {Object.keys(house.points_breakdown).length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Trophy className="h-5 w-5 text-amber-500" />
                                            Points Breakdown
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {Object.entries(house.points_breakdown).map(([category, points]) => (
                                            <div key={category}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <Badge className={`gap-1 ${categoryColors[category] || categoryColors.other}`}>
                                                            {categoryIcons[category] || categoryIcons.other}
                                                            <span className="capitalize">{category}</span>
                                                        </Badge>
                                                    </div>
                                                    <span className="font-bold">{points}</span>
                                                </div>
                                                <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                                    <div 
                                                        className="h-full rounded-full transition-all duration-300"
                                                        style={{ 
                                                            width: `${(Number(points) / maxPoints) * 100}%`,
                                                            backgroundColor: house.color 
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Recent Activity */}
                            {house.recent_points.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Sparkles className="h-5 w-5 text-purple-500" />
                                            Recent Activity
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {house.recent_points.slice(0, 10).map((point, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                                                >
                                                    <div className={`p-2 rounded-full ${categoryColors[point.category] || categoryColors.other}`}>
                                                        {categoryIcons[point.category] || categoryIcons.other}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-semibold capitalize text-sm">
                                                                {point.category}
                                                            </span>
                                                            <span className={`font-bold ${point.points >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                                {point.points >= 0 ? '+' : ''}{point.points}
                                                            </span>
                                                        </div>
                                                        {point.reason && (
                                                            <p className="text-sm text-muted-foreground truncate">
                                                                {point.reason}
                                                            </p>
                                                        )}
                                                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                            <Calendar className="h-3 w-3" />
                                                            {new Date(point.awarded_date).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16" style={{ background: `linear-gradient(to right, ${house.color}, ${house.color}dd)` }}>
                <div className="container mx-auto px-4 text-center">
                    <Medal className="h-12 w-12 text-white mx-auto mb-4 opacity-90" />
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Go {house.name}!
                    </h2>
                    <p className="text-white/80 mb-8 max-w-2xl mx-auto">
                        Strive for excellence in academics, sports, and character.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button size="lg" variant="secondary" asChild>
                            <Link href="/beyond-academics/houses">
                                <ChevronRight className="h-4 w-4 mr-2" />
                                View All Houses
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                            <Link href="/beyond-academics">
                                Explore More
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
