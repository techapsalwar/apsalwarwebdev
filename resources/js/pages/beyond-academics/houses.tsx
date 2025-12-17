import PublicLayout from '@/layouts/public-layout';
import { Link } from '@inertiajs/react';
import { 
    Shield,
    Trophy,
    Users,
    Star,
    Target,
    Medal,
    Flame,
    ChevronRight,
    User,
    Crown,
    Award,
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
    total_points: number;
}

interface HouseSystemInfo {
    purpose: string;
    activities: string[];
    points_system: string;
}

interface Props {
    houses: House[];
    houseSystem: HouseSystemInfo;
}

function LeaderCard({ 
    title, 
    leader, 
    color, 
    icon: Icon 
}: { 
    title: string; 
    leader: Leader | null; 
    color: string; 
    icon: React.ElementType;
}) {
    if (!leader) {
        return (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${color}20` }}
                >
                    <Icon className="h-5 w-5" style={{ color }} />
                </div>
                <div>
                    <p className="text-xs text-muted-foreground">{title}</p>
                    <p className="text-sm text-muted-foreground italic">Not assigned</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <Avatar className="h-10 w-10 border-2" style={{ borderColor: color }}>
                <AvatarImage src={leader.photo || undefined} alt={leader.name} />
                <AvatarFallback style={{ backgroundColor: `${color}20`, color }}>
                    {leader.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{title}</p>
                <p className="font-medium text-sm truncate">{leader.name}</p>
                <p className="text-xs text-muted-foreground">Class {leader.class}</p>
            </div>
        </div>
    );
}

export default function Houses({ houses, houseSystem }: Props) {
    return (
        <PublicLayout title="House System - Beyond Academics - APS Alwar">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-red-50 to-white dark:from-gray-900 dark:to-gray-950 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="mb-4 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                            <Shield className="h-3 w-3 mr-1" />
                            House System
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Our Four Houses
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Named after great Indian warriors and emperors, our houses foster 
                            healthy competition, teamwork, and school spirit.
                        </p>
                    </div>
                </div>
            </section>

            {/* Houses Grid */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {houses.map((house) => (
                            <Card 
                                key={house.id} 
                                className="overflow-hidden hover:shadow-xl transition-all group"
                                style={{ borderTopColor: house.color, borderTopWidth: '4px' }}
                            >
                                {/* House Image Header */}
                                {house.image && (
                                    <div className="relative h-48 overflow-hidden">
                                        <img 
                                            src={house.image} 
                                            alt={house.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div 
                                            className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
                                        />
                                        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                                            <div className="flex items-center gap-3">
                                                <div 
                                                    className="w-14 h-14 rounded-full flex items-center justify-center bg-white shadow-lg overflow-hidden"
                                                >
                                                    {house.logo ? (
                                                        <img 
                                                            src={house.logo} 
                                                            alt={house.name}
                                                            className="w-10 h-10 object-contain"
                                                        />
                                                    ) : (
                                                        <Shield 
                                                            className="h-7 w-7" 
                                                            style={{ color: house.color }}
                                                        />
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-white">{house.name}</h3>
                                                    <Badge 
                                                        className="text-white"
                                                        style={{ backgroundColor: house.color }}
                                                    >
                                                        {house.color_name} House
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 bg-white/90 dark:bg-gray-900/90 rounded-full px-3 py-1">
                                                <Trophy className="h-4 w-4 text-amber-500" />
                                                <span className="font-bold text-gray-900 dark:text-white">{house.total_points}</span>
                                                <span className="text-xs text-gray-500">pts</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Card Header (shown when no image) */}
                                {!house.image && (
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div 
                                                    className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden"
                                                    style={{ backgroundColor: `${house.color}20` }}
                                                >
                                                    {house.logo ? (
                                                        <img 
                                                            src={house.logo} 
                                                            alt={house.name}
                                                            className="w-12 h-12 object-contain"
                                                        />
                                                    ) : (
                                                        <Shield 
                                                            className="h-8 w-8" 
                                                            style={{ color: house.color }}
                                                        />
                                                    )}
                                                </div>
                                                <div>
                                                    <CardTitle className="text-xl">{house.name}</CardTitle>
                                                    <Badge 
                                                        variant="outline"
                                                        style={{ 
                                                            borderColor: house.color, 
                                                            color: house.color,
                                                            backgroundColor: `${house.color}10`
                                                        }}
                                                    >
                                                        {house.color_name} House
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 rounded-full px-3 py-1">
                                                <Trophy className="h-4 w-4 text-amber-500" />
                                                <span className="font-bold">{house.total_points}</span>
                                                <span className="text-xs text-gray-500">pts</span>
                                            </div>
                                        </div>
                                    </CardHeader>
                                )}

                                <CardContent className={house.image ? 'pt-4' : ''}>
                                    {/* Motto */}
                                    <div className="flex items-center gap-2 mb-4 text-gray-600 dark:text-gray-400">
                                        <Target className="h-4 w-4 flex-shrink-0" />
                                        <span className="italic">"{house.motto}"</span>
                                    </div>
                                    
                                    {/* Description */}
                                    <CardDescription className="mb-5">
                                        {house.description}
                                    </CardDescription>

                                    <Separator className="my-4" />

                                    {/* House Master */}
                                    {house.house_master && (
                                        <div className="mb-4">
                                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                                <User className="h-4 w-4" style={{ color: house.color }} />
                                                House Master
                                            </h4>
                                            <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: `${house.color}10` }}>
                                                <Avatar className="h-12 w-12 border-2" style={{ borderColor: house.color }}>
                                                    <AvatarImage src={house.house_master_photo || undefined} />
                                                    <AvatarFallback style={{ backgroundColor: house.color, color: 'white' }}>
                                                        {house.house_master.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white">{house.house_master}</p>
                                                    {house.house_master_designation && (
                                                        <p className="text-sm text-muted-foreground">{house.house_master_designation}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Student Leaders */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                            <Users className="h-4 w-4" style={{ color: house.color }} />
                                            Student Leadership
                                        </h4>
                                        
                                        <div className="grid grid-cols-2 gap-2">
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
                                            <div className="mt-3">
                                                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                                                    <Star className="h-3 w-3" />
                                                    House Prefects
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {house.prefects.map((prefect, index) => (
                                                        <div 
                                                            key={index}
                                                            className="flex items-center gap-2 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs"
                                                        >
                                                            <Avatar className="h-5 w-5">
                                                                <AvatarImage src={prefect.photo || undefined} />
                                                                <AvatarFallback className="text-[8px]" style={{ backgroundColor: `${house.color}30` }}>
                                                                    {prefect.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <span>{prefect.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* View Details Button */}
                                    <Separator className="my-4" />
                                    <div className="text-center">
                                        <Button 
                                            variant="outline" 
                                            asChild 
                                            className="w-full"
                                            style={{ borderColor: house.color, color: house.color }}
                                        >
                                            <Link href={`/beyond-academics/houses/${house.slug}`}>
                                                <ChevronRight className="h-4 w-4 mr-2" />
                                                View {house.name} Details
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* House System Info */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <Badge className="mb-4 bg-amber-100 text-amber-800">About the System</Badge>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                How It Works
                            </h2>
                        </div>

                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="h-5 w-5 text-amber-600" />
                                    Purpose
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {houseSystem.purpose}
                                </p>
                            </CardContent>
                        </Card>

                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Flame className="h-5 w-5 text-orange-600" />
                                        House Activities
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {houseSystem.activities.map((activity, index) => (
                                            <li key={index} className="flex items-center gap-2">
                                                <ChevronRight className="h-4 w-4 text-amber-600" />
                                                <span className="text-gray-600 dark:text-gray-300">{activity}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Trophy className="h-5 w-5 text-yellow-600" />
                                        Points System
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {houseSystem.points_system}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-amber-600 to-amber-700">
                <div className="container mx-auto px-4 text-center">
                    <Medal className="h-12 w-12 text-white mx-auto mb-4 opacity-90" />
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Be Part of the Legacy
                    </h2>
                    <p className="text-amber-100 mb-8 max-w-2xl mx-auto">
                        Join one of our prestigious houses and compete for glory!
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button size="lg" variant="secondary" asChild>
                            <Link href="/beyond-academics">
                                Explore More
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                            <Link href="/admissions">
                                Join APS Alwar
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
