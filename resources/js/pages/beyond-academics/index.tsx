import PublicLayout from '@/layouts/public-layout';
import { Link } from '@inertiajs/react';
import { 
    Shield,
    Users,
    Flag,
    Trophy,
    Palette,
    ArrowRight,
    Star,
    Medal,
    Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Highlight {
    title: string;
    description: string;
    icon: string;
    link: string;
}

interface Statistics {
    houses: number;
    clubs: number;
    nccCadets: number;
    achievements: number;
}

interface Props {
    statistics: Statistics;
    highlights: Highlight[];
}

const iconMap: Record<string, React.ElementType> = {
    shield: Shield,
    users: Users,
    flag: Flag,
    trophy: Trophy,
    palette: Palette,
};

export default function BeyondAcademics({ statistics, highlights }: Props) {
    return (
        <PublicLayout title="Beyond Academics - APS Alwar">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950 py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="mb-4 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Holistic Development
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Beyond Academics
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                            At APS Alwar, we believe in nurturing well-rounded individuals. 
                            Our comprehensive co-curricular program ensures every student discovers 
                            their potential beyond the classroom.
                        </p>
                    </div>
                </div>
            </section>

            {/* Statistics Banner */}
            <section className="py-8 bg-amber-600 dark:bg-amber-800">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="text-white">
                            <Shield className="h-8 w-8 mx-auto mb-2 opacity-90" />
                            <div className="text-3xl font-bold">{statistics.houses}</div>
                            <div className="text-amber-100 text-sm">Houses</div>
                        </div>
                        <div className="text-white">
                            <Users className="h-8 w-8 mx-auto mb-2 opacity-90" />
                            <div className="text-3xl font-bold">{statistics.clubs}+</div>
                            <div className="text-amber-100 text-sm">Clubs & Societies</div>
                        </div>
                        <div className="text-white">
                            <Flag className="h-8 w-8 mx-auto mb-2 opacity-90" />
                            <div className="text-3xl font-bold">{statistics.nccCadets}+</div>
                            <div className="text-amber-100 text-sm">NCC Cadets</div>
                        </div>
                        <div className="text-white">
                            <Medal className="h-8 w-8 mx-auto mb-2 opacity-90" />
                            <div className="text-3xl font-bold">{statistics.achievements}+</div>
                            <div className="text-amber-100 text-sm">Achievements</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Highlights Grid */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-amber-100 text-amber-800">Explore</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Discover Your Passion
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
                            From sports to arts, leadership to service - find your calling
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {highlights.map((highlight, index) => {
                            const Icon = iconMap[highlight.icon] || Star;
                            return (
                                <Card key={index} className="group hover:shadow-xl transition-all hover:-translate-y-1">
                                    <CardHeader className="text-center pb-2">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            <Icon className="h-8 w-8 text-amber-600" />
                                        </div>
                                        <CardTitle className="text-xl">{highlight.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-center">
                                        <CardDescription className="mb-6">
                                            {highlight.description}
                                        </CardDescription>
                                        <Button className="bg-amber-600 hover:bg-amber-700" asChild>
                                            <Link href={highlight.link}>
                                                Explore
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
                        <div>
                            <Badge className="mb-4 bg-purple-100 text-purple-800">Our Philosophy</Badge>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                Education Beyond Textbooks
                            </h2>
                            <div className="space-y-4 text-gray-600 dark:text-gray-300">
                                <p>
                                    At APS Alwar, we understand that true education goes far beyond academic 
                                    excellence. Our comprehensive co-curricular program is designed to develop 
                                    leadership, teamwork, creativity, and physical fitness.
                                </p>
                                <p>
                                    Through our house system, students learn healthy competition and school pride. 
                                    Our NCC unit instills discipline and patriotism. Sports and arts programs 
                                    nurture talents and build confidence.
                                </p>
                                <p>
                                    Every student at APS Alwar is encouraged to explore, experiment, and excel 
                                    in areas that spark their interest, creating well-rounded individuals ready 
                                    to face the world.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { title: 'Leadership Development', description: 'House captains, prefects, and club leaders' },
                                { title: 'Physical Fitness', description: 'Sports, NCC, and yoga programs' },
                                { title: 'Creative Expression', description: 'Music, dance, art, and drama' },
                                { title: 'Social Responsibility', description: 'Community service and environmental awareness' },
                            ].map((item, index) => (
                                <Card key={index}>
                                    <CardContent className="flex items-center gap-4 p-4">
                                        <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                                            <Star className="h-5 w-5 text-amber-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                {item.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {item.description}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Quote Section */}
            <section className="py-16 bg-gradient-to-r from-purple-600 to-purple-700">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-3xl mx-auto">
                        <Sparkles className="h-8 w-8 text-purple-200 mx-auto mb-6" />
                        <blockquote className="text-2xl md:text-3xl font-light text-white italic mb-6">
                            "Education is not the filling of a pail, but the lighting of a fire."
                        </blockquote>
                        <cite className="text-purple-200 not-italic">— W.B. Yeats</cite>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <Card className="max-w-3xl mx-auto bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/10 border-amber-200">
                        <CardContent className="text-center p-8">
                            <Trophy className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Join the APS Alwar Community
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Be part of a vibrant community that celebrates diversity, 
                                encourages exploration, and builds future leaders.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Button className="bg-amber-600 hover:bg-amber-700" asChild>
                                    <Link href="/admissions">
                                        Apply for Admission
                                    </Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/contact">
                                        Schedule a Visit
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </PublicLayout>
    );
}
