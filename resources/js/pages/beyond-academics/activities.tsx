import PublicLayout from '@/layouts/public-layout';
import { Link } from '@inertiajs/react';
import { 
    Palette,
    Music,
    Drama,
    Mic,
    Camera,
    Leaf,
    Calendar,
    Star,
    PartyPopper,
    Flag,
    ChevronRight,
    Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Activity {
    name: string;
    description: string;
    icon: string;
}

interface AnnualEvent {
    name: string;
    month: string;
    description: string;
}

interface Props {
    activities: Activity[];
    events: AnnualEvent[];
    celebrations: string[];
}

const iconMap: Record<string, React.ElementType> = {
    music: Music,
    palette: Palette,
    theater: Drama,
    mic: Mic,
    camera: Camera,
    leaf: Leaf,
};

export default function Activities({ activities, events, celebrations }: Props) {
    return (
        <PublicLayout title="Co-curricular Activities - Beyond Academics - APS Alwar">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-violet-50 to-white dark:from-gray-900 dark:to-gray-950 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="mb-4 bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-100">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Co-curricular Activities
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Express. Create. Celebrate.
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Beyond academics, APS Alwar offers a rich tapestry of co-curricular 
                            activities that nurture creativity, expression, and cultural awareness.
                        </p>
                    </div>
                </div>
            </section>

            {/* Activities Grid */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-amber-100 text-amber-800">Activities</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Co-curricular Programs
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Discover your talents and express yourself
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {activities.map((activity, index) => {
                            const Icon = iconMap[activity.icon] || Star;
                            return (
                                <Card key={index} className="hover:shadow-lg transition-shadow group">
                                    <CardHeader className="text-center pb-2">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-100 to-pink-100 dark:from-violet-900/30 dark:to-pink-900/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            <Icon className="h-8 w-8 text-violet-600" />
                                        </div>
                                        <CardTitle className="text-xl">{activity.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-center">
                                        <CardDescription>{activity.description}</CardDescription>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Annual Events */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-blue-100 text-blue-800">Events</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Annual Events
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Major events that showcase talent and spirit
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                        {events.map((event, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-2">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-2">
                                        <Calendar className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <CardTitle className="text-lg">{event.name}</CardTitle>
                                    <Badge variant="outline" className="mt-1 bg-amber-50 text-amber-800 border-amber-200">
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

            {/* Celebrations */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-pink-100 text-pink-800">Celebrations</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Days We Celebrate
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Important days celebrated with enthusiasm
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-wrap justify-center gap-3">
                            {celebrations.map((celebration, index) => (
                                <Card key={index} className="inline-block">
                                    <CardContent className="flex items-center gap-2 p-4">
                                        <PartyPopper className="h-5 w-5 text-pink-600" />
                                        <span className="font-medium text-gray-800 dark:text-gray-200">
                                            {celebration}
                                        </span>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Assembly Activities */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <Badge className="mb-4 bg-green-100 text-green-800">Daily Routine</Badge>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Morning Assembly
                            </h2>
                        </div>

                        <Card>
                            <CardContent className="p-8">
                                <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
                                    Our morning assembly is a vibrant start to every school day, featuring:
                                </p>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[
                                        { name: 'Prayer & National Anthem', icon: Music },
                                        { name: 'Thought for the Day', icon: Star },
                                        { name: 'News Headlines', icon: Mic },
                                        { name: 'Student Presentations', icon: Drama },
                                        { name: 'Special Day Celebrations', icon: PartyPopper },
                                        { name: 'Awards & Recognition', icon: Flag },
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <item.icon className="h-5 w-5 text-amber-600" />
                                            <span className="text-gray-700 dark:text-gray-300 text-sm">
                                                {item.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* House Activities */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <Badge className="mb-4 bg-purple-100 text-purple-800">Competitions</Badge>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Inter-House Competitions
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[
                                'Debate Competition',
                                'Quiz Competition',
                                'Declamation',
                                'Poetry Recitation',
                                'Solo & Group Singing',
                                'Solo & Group Dance',
                                'Drama & Skit',
                                'Art & Craft',
                                'Science Exhibition',
                            ].map((competition, index) => (
                                <Card key={index}>
                                    <CardContent className="flex items-center gap-3 p-4">
                                        <Star className="h-5 w-5 text-purple-600" />
                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                            {competition}
                                        </span>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Facilities for Activities */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <Card className="bg-gradient-to-br from-violet-50 to-pink-50 dark:from-violet-900/20 dark:to-pink-900/10 border-violet-200">
                            <CardContent className="p-8">
                                <div className="text-center">
                                    <Sparkles className="h-12 w-12 text-violet-600 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                        Supporting Infrastructure
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                                        Our school provides excellent facilities to support co-curricular activities:
                                    </p>
                                    <div className="flex flex-wrap justify-center gap-3">
                                        {[
                                            'Auditorium',
                                            'Music Room',
                                            'Dance Room',
                                            'Art Room',
                                            'Amphitheater',
                                            'Open Stage',
                                        ].map((facility, idx) => (
                                            <Badge key={idx} variant="outline" className="bg-white dark:bg-gray-800 py-2 px-4">
                                                {facility}
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
            <section className="py-16 bg-gradient-to-r from-violet-600 to-purple-700">
                <div className="container mx-auto px-4 text-center">
                    <Sparkles className="h-12 w-12 text-white mx-auto mb-4 opacity-90" />
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Discover Your Talent
                    </h2>
                    <p className="text-violet-100 mb-8 max-w-2xl mx-auto">
                        Every child has unique talents waiting to be discovered. Join us to explore yours!
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
