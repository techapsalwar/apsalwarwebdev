import PublicLayout from '@/layouts/public-layout';
import { Link } from '@inertiajs/react';
import { 
    GraduationCap,
    BookOpen,
    Users,
    Trophy,
    Monitor,
    FlaskConical,
    Laptop,
    Target,
    Library,
    ChevronRight,
    ArrowRight,
    Award,
    CheckCircle2,
    School,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Stream {
    name: string;
    classes: string;
    description: string;
    highlights: string[];
}

interface AcademicFeature {
    title: string;
    description: string;
    icon: string;
}

interface Props {
    streams: Stream[];
    curriculum: {
        board: string;
        affiliationNumber: string;
        framework: string;
        medium: string;
        features: string[];
    };
    academicFeatures: AcademicFeature[];
    statistics: {
        totalStudents: number;
        sections: number;
        teachers: number;
        passRate: string;
        streams: number;
        subjects: number;
    };
}

const iconMap: Record<string, React.ElementType> = {
    monitor: Monitor,
    flask: FlaskConical,
    laptop: Laptop,
    users: Users,
    book: Library,
    target: Target,
};

export default function Academics({ streams, curriculum, academicFeatures, statistics }: Props) {
    return (
        <PublicLayout title="Academics - APS Alwar">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="mb-4 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                            CBSE Affiliated
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Academic Excellence
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                            Nurturing minds through innovative teaching, state-of-the-art facilities, 
                            and a comprehensive curriculum aligned with NCF 2023
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button size="lg" className="bg-amber-600 hover:bg-amber-700" asChild>
                                <Link href="/academics/curriculum">
                                    Explore Curriculum
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <Link href="/academics/results">
                                    View Results
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics */}
            <section className="py-12 bg-amber-600 dark:bg-amber-800">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-6 text-center">
                        <div className="text-white">
                            <GraduationCap className="h-8 w-8 mx-auto mb-2 opacity-90" />
                            <div className="text-2xl font-bold">{statistics.totalStudents}</div>
                            <div className="text-amber-100 text-sm">Students</div>
                        </div>
                        <div className="text-white">
                            <School className="h-8 w-8 mx-auto mb-2 opacity-90" />
                            <div className="text-2xl font-bold">{statistics.sections}</div>
                            <div className="text-amber-100 text-sm">Sections</div>
                        </div>
                        <div className="text-white">
                            <Users className="h-8 w-8 mx-auto mb-2 opacity-90" />
                            <div className="text-2xl font-bold">{statistics.teachers}+</div>
                            <div className="text-amber-100 text-sm">Teachers</div>
                        </div>
                        <div className="text-white">
                            <Trophy className="h-8 w-8 mx-auto mb-2 opacity-90" />
                            <div className="text-2xl font-bold">{statistics.passRate}</div>
                            <div className="text-amber-100 text-sm">Pass Rate</div>
                        </div>
                        <div className="text-white">
                            <Award className="h-8 w-8 mx-auto mb-2 opacity-90" />
                            <div className="text-2xl font-bold">{statistics.streams}</div>
                            <div className="text-amber-100 text-sm">Streams</div>
                        </div>
                        <div className="text-white">
                            <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-90" />
                            <div className="text-2xl font-bold">{statistics.subjects}+</div>
                            <div className="text-amber-100 text-sm">Subjects</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CBSE Affiliation Banner */}
            <section className="py-8 bg-white dark:bg-gray-950 border-b dark:border-gray-800">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                <BookOpen className="h-8 w-8 text-blue-700 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">{curriculum.board}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Affiliation No: {curriculum.affiliationNumber}
                                </p>
                            </div>
                        </div>
                        <div className="h-10 w-px bg-gray-200 dark:bg-gray-700 hidden md:block" />
                        <div>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                {curriculum.framework}
                            </Badge>
                            <p className="text-sm text-gray-500 mt-1">Medium of Instruction: {curriculum.medium}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Academic Streams */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-amber-100 text-amber-800">Academic Programs</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Our Academic Streams
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Comprehensive education from Nursery to Class XII with Science and Commerce streams
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {streams.map((stream, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <Badge variant="outline" className="w-fit mb-2">
                                        {stream.classes}
                                    </Badge>
                                    <CardTitle>{stream.name}</CardTitle>
                                    <CardDescription>{stream.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {stream.highlights.map((highlight, idx) => (
                                            <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                                                {highlight}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Academic Features */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-blue-100 text-blue-800">Our Strengths</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Academic Excellence Through
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {academicFeatures.map((feature, index) => {
                            const Icon = iconMap[feature.icon] || BookOpen;
                            return (
                                <Card key={index} className="text-center">
                                    <CardHeader>
                                        <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                                            <Icon className="h-7 w-7 text-amber-600" />
                                        </div>
                                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription>{feature.description}</CardDescription>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Curriculum Features */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <Badge className="mb-4 bg-green-100 text-green-800">NCF 2023</Badge>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                Modern Curriculum Features
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {curriculum.features.map((feature, index) => (
                                <div 
                                    key={index}
                                    className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700"
                                >
                                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Links */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-amber-100 text-amber-800">Explore More</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Academic Resources
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                        {[
                            { title: 'Board Results', href: '/academics/results', icon: Trophy, description: 'View our board exam performance' },
                            { title: 'Faculty', href: '/academics/faculty', icon: Users, description: 'Meet our experienced teachers' },
                            { title: 'Departments', href: '/academics/departments', icon: School, description: 'Explore academic departments' },
                            { title: 'Competitive Exams', href: '/academics/competitive-exams', icon: Award, description: 'Olympiads & entrance prep' },
                        ].map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={index}
                                    href={item.href}
                                    className="group block p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-amber-200 dark:hover:border-amber-700 transition-all"
                                >
                                    <Icon className="h-8 w-8 text-amber-600 mb-4 group-hover:scale-110 transition-transform" />
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-amber-600">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                        {item.description}
                                    </p>
                                    <span className="inline-flex items-center text-sm text-amber-600 font-medium">
                                        Learn More
                                        <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-amber-600 to-amber-700">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Start Your Academic Journey
                    </h2>
                    <p className="text-amber-100 mb-8 max-w-2xl mx-auto">
                        Join APS Alwar for a transformative educational experience that prepares students for future success.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button size="lg" variant="secondary" asChild>
                            <Link href="/admissions">
                                Apply for Admission
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                            <Link href="/contact">
                                Contact Us
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
