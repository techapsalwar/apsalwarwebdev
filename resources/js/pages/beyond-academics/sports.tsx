import PublicLayout from '@/layouts/public-layout';
import { Link } from '@inertiajs/react';
import { 
    Trophy,
    Medal,
    Users,
    Target,
    Dumbbell,
    Timer,
    MapPin,
    Award,
    ChevronRight,
    Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Sport {
    name: string;
    description: string;
    facility: string;
}

interface Facility {
    name: string;
    description: string;
    area: string;
}

interface Achievement {
    sport: string;
    achievement: string;
    year: number;
}

interface Coach {
    name: string;
    role: string;
    sports: string;
}

interface Props {
    sports: Sport[];
    facilities: Facility[];
    achievements: Achievement[];
    coaches: Coach[];
}

export default function Sports({ sports, facilities, achievements, coaches }: Props) {
    return (
        <PublicLayout title="Sports - Beyond Academics - APS Alwar">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-950 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="mb-4 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100">
                            <Trophy className="h-3 w-3 mr-1" />
                            Sports Excellence
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Sports at APS Alwar
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            A healthy body houses a healthy mind. Our comprehensive sports program 
                            develops physical fitness, teamwork, and competitive spirit.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Banner */}
            <section className="py-8 bg-orange-600 dark:bg-orange-800">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="text-white">
                            <Dumbbell className="h-8 w-8 mx-auto mb-2 opacity-90" />
                            <div className="text-2xl font-bold">{sports.length}+</div>
                            <div className="text-orange-100 text-sm">Sports Offered</div>
                        </div>
                        <div className="text-white">
                            <MapPin className="h-8 w-8 mx-auto mb-2 opacity-90" />
                            <div className="text-2xl font-bold">{facilities.length}</div>
                            <div className="text-orange-100 text-sm">Sports Facilities</div>
                        </div>
                        <div className="text-white">
                            <Trophy className="h-8 w-8 mx-auto mb-2 opacity-90" />
                            <div className="text-2xl font-bold">{achievements.length}+</div>
                            <div className="text-orange-100 text-sm">Recent Achievements</div>
                        </div>
                        <div className="text-white">
                            <Users className="h-8 w-8 mx-auto mb-2 opacity-90" />
                            <div className="text-2xl font-bold">Expert</div>
                            <div className="text-orange-100 text-sm">Coaching Staff</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sports Offered */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-amber-100 text-amber-800">Sports Programs</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Sports We Offer
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {sports.map((sport, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-2 text-center">
                                    <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mx-auto mb-2">
                                        <Dumbbell className="h-6 w-6 text-orange-600" />
                                    </div>
                                    <CardTitle className="text-lg">{sport.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <CardDescription className="mb-2">
                                        {sport.description}
                                    </CardDescription>
                                    <Badge variant="outline" className="text-xs">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        {sport.facility}
                                    </Badge>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Facilities */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-blue-100 text-blue-800">Infrastructure</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Sports Facilities
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {facilities.map((facility, index) => (
                            <Card key={index}>
                                <CardContent className="flex items-start gap-4 p-6">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                            {facility.name}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                                            {facility.description}
                                        </p>
                                        <Badge variant="outline" className="text-xs">
                                            Area: {facility.area}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Achievements */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-yellow-100 text-yellow-800">Achievements</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Recent Sports Achievements
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {achievements.map((achievement, index) => (
                            <Card key={index} className="border-l-4 border-l-amber-500">
                                <CardContent className="flex items-center gap-4 p-6">
                                    <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                                        <Medal className="h-6 w-6 text-amber-600" />
                                    </div>
                                    <div>
                                        <Badge className="mb-1 bg-amber-100 text-amber-800">
                                            {achievement.sport}
                                        </Badge>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {achievement.achievement}
                                        </h3>
                                        <span className="text-sm text-gray-500">{achievement.year}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Annual Events */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-green-100 text-green-800">Events</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Annual Sports Events
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {[
                            {
                                name: 'Annual Sports Day',
                                description: 'Grand sports event with inter-house competitions',
                                month: 'November',
                            },
                            {
                                name: 'Inter-House Tournaments',
                                description: 'Year-round competitions in various sports',
                                month: 'Throughout Year',
                            },
                            {
                                name: 'CBSE Cluster Meet',
                                description: 'Participation in CBSE sports competitions',
                                month: 'As per CBSE',
                            },
                        ].map((event, index) => (
                            <Card key={index} className="text-center">
                                <CardHeader className="pb-2">
                                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-2">
                                        <Trophy className="h-6 w-6 text-green-600" />
                                    </div>
                                    <CardTitle className="text-lg">{event.name}</CardTitle>
                                    <Badge variant="outline" className="mt-1">
                                        {event.month}
                                    </Badge>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>{event.description}</CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sports Philosophy */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/10 border-orange-200">
                            <CardContent className="p-8">
                                <div className="text-center">
                                    <Award className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                        Our Sports Philosophy
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                                        At APS Alwar, we believe that sports are an integral part of education. 
                                        Our sports program aims to develop not just physical fitness, but also 
                                        important life skills like teamwork, leadership, discipline, and resilience.
                                    </p>
                                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                                        {['Teamwork', 'Discipline', 'Fair Play', 'Excellence', 'Sportsmanship'].map((value, idx) => (
                                            <Badge key={idx} variant="outline" className="bg-white dark:bg-gray-800">
                                                <Star className="h-3 w-3 mr-1 text-amber-500" />
                                                {value}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-700">
                <div className="container mx-auto px-4 text-center">
                    <Trophy className="h-12 w-12 text-white mx-auto mb-4 opacity-90" />
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Play. Compete. Excel.
                    </h2>
                    <p className="text-orange-100 mb-8 max-w-2xl mx-auto">
                        Join us and discover your sporting potential!
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button size="lg" variant="secondary" asChild>
                            <Link href="/beyond-academics">
                                Explore More
                                <ChevronRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                            <Link href="/facilities">
                                View Facilities
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
