import PublicLayout from '@/layouts/public-layout';
import { Link } from '@inertiajs/react';
import { 
    ArrowLeft,
    Award,
    Trophy,
    Target,
    Calendar,
    Users,
    CheckCircle2,
    Star,
    Medal,
    ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Exam {
    id: number;
    name: string;
    slug: string;
    description: string;
    eligibility: string;
    schedule: string;
    achievements: string[];
}

interface Props {
    exams: Exam[];
}

export default function Competitive({ exams }: Props) {
    return (
        <PublicLayout title="Competitive Exams - APS Alwar">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-gray-950 py-16">
                <div className="container mx-auto px-4">
                    <Button variant="ghost" size="sm" className="mb-6" asChild>
                        <Link href="/academics">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Academics
                        </Link>
                    </Button>
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="mb-4 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                            <Trophy className="h-3 w-3 mr-1" />
                            Excellence Beyond Classroom
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Competitive Exams & Olympiads
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Preparing students for national and international academic competitions
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Banner */}
            <section className="py-8 bg-amber-600 dark:bg-amber-800">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="text-white">
                            <Trophy className="h-8 w-8 mx-auto mb-2 opacity-90" />
                            <div className="text-2xl font-bold">15+</div>
                            <div className="text-amber-100 text-sm">Olympiads</div>
                        </div>
                        <div className="text-white">
                            <Medal className="h-8 w-8 mx-auto mb-2 opacity-90" />
                            <div className="text-2xl font-bold">100+</div>
                            <div className="text-amber-100 text-sm">Qualifiers Yearly</div>
                        </div>
                        <div className="text-white">
                            <Star className="h-8 w-8 mx-auto mb-2 opacity-90" />
                            <div className="text-2xl font-bold">50+</div>
                            <div className="text-amber-100 text-sm">State Winners</div>
                        </div>
                        <div className="text-white">
                            <Award className="h-8 w-8 mx-auto mb-2 opacity-90" />
                            <div className="text-2xl font-bold">10+</div>
                            <div className="text-amber-100 text-sm">National Winners</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Exams Grid */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {exams.map((exam) => (
                            <Card key={exam.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Trophy className="h-6 w-6 text-amber-600" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{exam.name}</CardTitle>
                                            <CardDescription className="mt-1">{exam.description}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {/* Details */}
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4 text-gray-400" />
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    {exam.eligibility}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    {exam.schedule}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Achievements */}
                                        {exam.achievements && exam.achievements.length > 0 && (
                                            <div className="pt-4 border-t dark:border-gray-700">
                                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                                    Our Achievements
                                                </h4>
                                                <div className="space-y-1">
                                                    {exam.achievements.map((achievement, idx) => (
                                                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                                                            {achievement}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Preparation Support */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-green-100 text-green-800">Our Support</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            How We Prepare Students
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {[
                            {
                                icon: Target,
                                title: 'Dedicated Coaching',
                                description: 'Special coaching sessions for Olympiad preparation after school hours',
                            },
                            {
                                icon: Award,
                                title: 'Expert Faculty',
                                description: 'Subject matter experts guide students for competitive exams',
                            },
                            {
                                icon: Trophy,
                                title: 'Practice Tests',
                                description: 'Regular mock tests and previous year paper solving sessions',
                            },
                            {
                                icon: Star,
                                title: 'Individual Attention',
                                description: 'Small batch sizes ensuring personalized guidance',
                            },
                        ].map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <Card key={index} className="text-center">
                                    <CardHeader>
                                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Icon className="h-6 w-6 text-green-600" />
                                        </div>
                                        <CardTitle className="text-lg">{item.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription>{item.description}</CardDescription>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Olympiad Categories */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-blue-100 text-blue-800">Competitions</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Olympiads & Competitions We Participate In
                        </h2>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Trophy className="h-5 w-5 text-blue-600" />
                                        Science Olympiads
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            'NSO (National Science Olympiad)',
                                            'NSTSE',
                                            'Science Quiz',
                                            'IJSO Selection',
                                        ].map((item, idx) => (
                                            <Badge key={idx} variant="secondary">{item}</Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Trophy className="h-5 w-5 text-green-600" />
                                        Mathematics Olympiads
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            'IMO (International Maths Olympiad)',
                                            'NTSE',
                                            'RMO Selection',
                                            'Maths Quiz',
                                        ].map((item, idx) => (
                                            <Badge key={idx} variant="secondary">{item}</Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Trophy className="h-5 w-5 text-purple-600" />
                                        Language & General Knowledge
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            'IEO (English Olympiad)',
                                            'IGKO (GK Olympiad)',
                                            'Hindi Olympiad',
                                            'Spelling Bee',
                                        ].map((item, idx) => (
                                            <Badge key={idx} variant="secondary">{item}</Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Trophy className="h-5 w-5 text-amber-600" />
                                        Entrance Examinations
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            'JEE Main & Advanced',
                                            'NEET',
                                            'CLAT',
                                            'CUET',
                                            'NDA/CDS',
                                        ].map((item, idx) => (
                                            <Badge key={idx} variant="secondary">{item}</Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-amber-600 to-amber-700">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Start Your Competitive Journey
                    </h2>
                    <p className="text-amber-100 mb-8 max-w-2xl mx-auto">
                        Join APS Alwar and get expert guidance for competitive examinations and Olympiads.
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
