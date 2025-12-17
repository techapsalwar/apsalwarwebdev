import PublicLayout from '@/layouts/public-layout';
import { Link } from '@inertiajs/react';
import { 
    Award, 
    BookOpen, 
    Building2, 
    Calendar, 
    ChevronRight,
    GraduationCap, 
    History, 
    Landmark, 
    MapPin, 
    Target, 
    Users,
    Quote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Props {
    history: string;
    milestones: Array<{
        year: string;
        title: string;
        description: string;
    }>;
    vision: string;
    mission: string;
    motto: string;
    objectives: Array<{
        title: string;
        description: string;
    }>;
    statistics: {
        students: string;
        teachers: string;
        sections: string;
        campus: string;
        yearsOfExcellence: string;
        boardPassRate: string;
    };
}

export default function AboutIndex({ 
    history, 
    milestones, 
    vision, 
    mission, 
    motto,
    objectives, 
    statistics 
}: Props) {
    return (
        <PublicLayout title="About Us - Army Public School Alwar">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-gray-950 py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="mb-4 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                            Since 1981
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            About Army Public School, Alwar
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                            A distinguished legacy of educational excellence spanning over four decades, 
                            nurturing responsible global citizens with discipline, integrity, and a passion for learning.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button asChild className="bg-amber-600 hover:bg-amber-700">
                                <Link href="/about/history">
                                    <History className="mr-2 h-4 w-4" />
                                    Our History
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/facilities">
                                    <Building2 className="mr-2 h-4 w-4" />
                                    Infrastructure
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="py-16 bg-amber-600 dark:bg-amber-800">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
                        <div className="text-white">
                            <Users className="h-10 w-10 mx-auto mb-3 opacity-90" />
                            <div className="text-3xl font-bold">{statistics.students}</div>
                            <div className="text-amber-100">Students</div>
                        </div>
                        <div className="text-white">
                            <GraduationCap className="h-10 w-10 mx-auto mb-3 opacity-90" />
                            <div className="text-3xl font-bold">{statistics.teachers}+</div>
                            <div className="text-amber-100">Teachers</div>
                        </div>
                        <div className="text-white">
                            <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-90" />
                            <div className="text-3xl font-bold">{statistics.sections}</div>
                            <div className="text-amber-100">Sections</div>
                        </div>
                        <div className="text-white">
                            <MapPin className="h-10 w-10 mx-auto mb-3 opacity-90" />
                            <div className="text-3xl font-bold">{statistics.campus}</div>
                            <div className="text-amber-100">Campus</div>
                        </div>
                        <div className="text-white">
                            <Calendar className="h-10 w-10 mx-auto mb-3 opacity-90" />
                            <div className="text-3xl font-bold">{statistics.yearsOfExcellence}+</div>
                            <div className="text-amber-100">Years</div>
                        </div>
                        <div className="text-white">
                            <Award className="h-10 w-10 mx-auto mb-3 opacity-90" />
                            <div className="text-3xl font-bold">{statistics.boardPassRate}</div>
                            <div className="text-amber-100">Pass Rate</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* History Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <Badge className="mb-4 bg-amber-100 text-amber-800">Our Story</Badge>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                A Legacy of Excellence
                            </h2>
                            <div className="prose prose-lg dark:prose-invert">
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {history}
                                </p>
                            </div>
                            <Button variant="outline" className="mt-6" asChild>
                                <Link href="/about/history">
                                    Read Full History
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                        <div className="relative">
                            <div className="bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/20 dark:to-amber-800/10 rounded-2xl p-8">
                                <div className="aspect-video bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-lg">
                                    <GraduationCap className="h-24 w-24 text-amber-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision & Mission */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-amber-100 text-amber-800">Our Purpose</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Vision, Mission & Values
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Vision */}
                        <Card className="border-t-4 border-t-amber-500">
                            <CardHeader>
                                <Target className="h-10 w-10 text-amber-600 mb-2" />
                                <CardTitle>Our Vision</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                    {vision || 'To foster the talent and individuality of every student, ensuring they become conscientious global citizens.'}
                                </p>
                            </CardContent>
                        </Card>
                        {/* Mission */}
                        <Card className="border-t-4 border-t-blue-500">
                            <CardHeader>
                                <Landmark className="h-10 w-10 text-blue-600 mb-2" />
                                <CardTitle>Our Mission</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                    {mission || 'To provide the fullest possible development of each learner for living morally, creatively, and productively.'}
                                </p>
                            </CardContent>
                        </Card>
                        {/* Motto */}
                        <Card className="border-t-4 border-t-green-500">
                            <CardHeader>
                                <Quote className="h-10 w-10 text-green-600 mb-2" />
                                <CardTitle>Our Motto</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 dark:text-gray-300 text-sm font-semibold italic">
                                    "{motto || 'A HAPPY LEARNER IS A MOTIVATED LEARNER'}"
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="text-center mt-8">
                        <Button variant="outline" asChild>
                            <Link href="/about/vision-mission">
                                Learn More
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Milestones Timeline */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-amber-100 text-amber-800">Journey</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Key Milestones
                        </h2>
                    </div>
                    <div className="max-w-4xl mx-auto">
                        <div className="relative">
                            {/* Timeline line */}
                            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-amber-200 dark:bg-amber-800 -translate-x-1/2" />
                            
                            {milestones.slice(0, 5).map((milestone, index) => (
                                <div 
                                    key={index} 
                                    className={`relative flex items-start mb-8 ${
                                        index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                    }`}
                                >
                                    <div className="flex-1 md:w-1/2" />
                                    {/* Timeline dot */}
                                    <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-amber-500 rounded-full border-4 border-white dark:border-gray-950 -translate-x-1/2 z-10" />
                                    {/* Content */}
                                    <div className={`flex-1 pl-16 md:pl-0 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <Badge variant="outline" className="w-fit mb-2">
                                                    {milestone.year}
                                                </Badge>
                                                <CardTitle className="text-lg">{milestone.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <CardDescription>{milestone.description}</CardDescription>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-8">
                            <Button variant="outline" asChild>
                                <Link href="/about/history">
                                    View Complete Timeline
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Links Section */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Explore More
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            Learn more about what makes APS Alwar special
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        <Link href="/about/principal-message" className="group">
                            <Card className="h-full transition-shadow hover:shadow-lg">
                                <CardHeader>
                                    <GraduationCap className="h-10 w-10 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
                                    <CardTitle className="group-hover:text-amber-600 transition-colors">
                                        Principal's Message
                                    </CardTitle>
                                    <CardDescription>
                                        Words from our esteemed Principal, Dr. Neera Pandey
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                        <Link href="/about/management" className="group">
                            <Card className="h-full transition-shadow hover:shadow-lg">
                                <CardHeader>
                                    <Users className="h-10 w-10 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                                    <CardTitle className="group-hover:text-blue-600 transition-colors">
                                        Management Committee
                                    </CardTitle>
                                    <CardDescription>
                                        Meet our School Management Committee members
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                        <Link href="/facilities" className="group">
                            <Card className="h-full transition-shadow hover:shadow-lg">
                                <CardHeader>
                                    <Building2 className="h-10 w-10 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                                    <CardTitle className="group-hover:text-green-600 transition-colors">
                                        Infrastructure
                                    </CardTitle>
                                    <CardDescription>
                                        Explore our world-class facilities and campus
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                        <Link href="/about/history" className="group">
                            <Card className="h-full transition-shadow hover:shadow-lg">
                                <CardHeader>
                                    <History className="h-10 w-10 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                                    <CardTitle className="group-hover:text-purple-600 transition-colors">
                                        History & Milestones
                                    </CardTitle>
                                    <CardDescription>
                                        Our journey of excellence since 1981
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
