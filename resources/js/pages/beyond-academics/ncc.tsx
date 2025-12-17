import PublicLayout from '@/layouts/public-layout';
import { Link } from '@inertiajs/react';
import { 
    Flag,
    Shield,
    Medal,
    Users,
    Target,
    Tent,
    Mountain,
    Award,
    ChevronRight,
    Star,
    Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface NccInfo {
    unit: string;
    battalion: string;
    group: string;
    directorate: string;
    strength: string;
    categories: string[];
    motto: string;
    aim: string;
}

interface Achievement {
    title: string;
    description: string;
    year: number;
    level: string;
}

interface Camp {
    name: string;
    duration: string;
    description: string;
}

interface Props {
    nccInfo: NccInfo;
    achievements: Achievement[];
    activities: string[];
    camps: Camp[];
}

const levelColors: Record<string, string> = {
    National: 'bg-purple-100 text-purple-800',
    State: 'bg-blue-100 text-blue-800',
    Group: 'bg-green-100 text-green-800',
    Directorate: 'bg-amber-100 text-amber-800',
};

export default function NCC({ nccInfo, achievements, activities, camps }: Props) {
    return (
        <PublicLayout title="NCC - Beyond Academics - APS Alwar">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-950 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="mb-4 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            <Flag className="h-3 w-3 mr-1" />
                            National Cadet Corps
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            NCC - {nccInfo.unit}
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                            "{nccInfo.motto}"
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                            Building disciplined, patriotic, and service-oriented future citizens
                        </p>
                    </div>
                </div>
            </section>

            {/* NCC Info Banner */}
            <section className="py-8 bg-green-700 dark:bg-green-900">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="text-white">
                            <Shield className="h-8 w-8 mx-auto mb-2 opacity-90" />
                            <div className="text-lg font-bold">{nccInfo.battalion}</div>
                            <div className="text-green-100 text-sm">Battalion</div>
                        </div>
                        <div className="text-white">
                            <Users className="h-8 w-8 mx-auto mb-2 opacity-90" />
                            <div className="text-lg font-bold">{nccInfo.strength}</div>
                            <div className="text-green-100 text-sm">Cadets</div>
                        </div>
                        <div className="text-white">
                            <Target className="h-8 w-8 mx-auto mb-2 opacity-90" />
                            <div className="text-lg font-bold">JD & SD</div>
                            <div className="text-green-100 text-sm">Divisions</div>
                        </div>
                        <div className="text-white">
                            <Medal className="h-8 w-8 mx-auto mb-2 opacity-90" />
                            <div className="text-lg font-bold">Multiple</div>
                            <div className="text-green-100 text-sm">Achievements</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About NCC */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="h-5 w-5 text-green-600" />
                                        Aim of NCC
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {nccInfo.aim}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5 text-green-600" />
                                        Our Unit
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                        <li><strong>Unit:</strong> {nccInfo.unit}</li>
                                        <li><strong>Battalion:</strong> {nccInfo.battalion}</li>
                                        <li><strong>Group:</strong> {nccInfo.group}</li>
                                        <li><strong>Directorate:</strong> {nccInfo.directorate}</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Categories */}
                        <Card className="mt-8">
                            <CardHeader>
                                <CardTitle>Cadet Categories</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-4">
                                    {nccInfo.categories.map((category, index) => (
                                        <Badge key={index} variant="outline" className="bg-green-50 text-green-800 border-green-200 py-2 px-4">
                                            {category}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Activities */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-amber-100 text-amber-800">Training</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            NCC Activities
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
                        {activities.map((activity, index) => (
                            <Card key={index} className="text-center">
                                <CardContent className="p-4">
                                    <Star className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        {activity}
                                    </span>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Camps */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-blue-100 text-blue-800">Camps</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            NCC Camps
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Training camps that build character and skills
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {camps.map((camp, index) => (
                            <Card key={index}>
                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                            <Tent className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{camp.name}</CardTitle>
                                            <Badge variant="outline" className="mt-1">
                                                <Calendar className="h-3 w-3 mr-1" />
                                                {camp.duration}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>{camp.description}</CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Achievements */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-purple-100 text-purple-800">Achievements</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Our Achievements
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {achievements.map((achievement, index) => (
                            <Card key={index}>
                                <CardContent className="flex items-start gap-4 p-6">
                                    <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                                        <Award className="h-6 w-6 text-amber-600" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                {achievement.title}
                                            </h3>
                                            <Badge className={levelColors[achievement.level] || 'bg-gray-100 text-gray-800'}>
                                                {achievement.level}
                                            </Badge>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
                                            {achievement.description}
                                        </p>
                                        <span className="text-xs text-gray-400">{achievement.year}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-green-100 text-green-800">Benefits</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Why Join NCC?
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                        {[
                            { title: 'Discipline', description: 'Learn self-discipline and time management', icon: Shield },
                            { title: 'Physical Fitness', description: 'Regular drills and physical training', icon: Mountain },
                            { title: 'Leadership', description: 'Develop leadership qualities', icon: Flag },
                            { title: 'Career Benefits', description: 'Special entry schemes in Defence', icon: Star },
                        ].map((benefit, index) => (
                            <Card key={index} className="text-center">
                                <CardHeader className="pb-2">
                                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-2">
                                        <benefit.icon className="h-6 w-6 text-green-600" />
                                    </div>
                                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>{benefit.description}</CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-green-600 to-green-700">
                <div className="container mx-auto px-4 text-center">
                    <Flag className="h-12 w-12 text-white mx-auto mb-4 opacity-90" />
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Unity and Discipline
                    </h2>
                    <p className="text-green-100 mb-8 max-w-2xl mx-auto">
                        Be a part of NCC and serve the nation with pride!
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button size="lg" variant="secondary" asChild>
                            <Link href="/beyond-academics">
                                Explore More
                                <ChevronRight className="ml-2 h-5 w-5" />
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
