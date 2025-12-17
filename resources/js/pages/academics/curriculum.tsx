import PublicLayout from '@/layouts/public-layout';
import { Link } from '@inertiajs/react';
import { 
    ArrowLeft,
    BookOpen,
    GraduationCap,
    CheckCircle2,
    FileText,
    Target,
    Award,
    Calendar,
    ClipboardCheck,
    ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Curriculum {
    board: string;
    affiliationNumber: string;
    framework: string;
    medium: string;
    features: string[];
}

interface Assessment {
    formative: {
        description: string;
        weightage: string;
        components: string[];
    };
    summative: {
        description: string;
        weightage: string;
        components: string[];
    };
    cce: {
        description: string;
        components: string[];
    };
}

interface Props {
    curriculum: Curriculum;
    subjects: {
        primary: string[];
        middle: string[];
        secondary: string[];
        seniorScience: string[];
        seniorCommerce: string[];
    };
    assessment: Assessment;
}

export default function Curriculum({ curriculum, subjects, assessment }: Props) {
    return (
        <PublicLayout title="Curriculum - APS Alwar">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-950 py-16">
                <div className="container mx-auto px-4">
                    <Button variant="ghost" size="sm" className="mb-6" asChild>
                        <Link href="/academics">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Academics
                        </Link>
                    </Button>
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="mb-4 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100">
                            <BookOpen className="h-3 w-3 mr-1" />
                            {curriculum.framework}
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Our Curriculum
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            A comprehensive CBSE curriculum designed to foster holistic development
                        </p>
                    </div>
                </div>
            </section>

            {/* CBSE Info Banner */}
            <section className="py-8 bg-indigo-600 dark:bg-indigo-800">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                        <div className="text-center text-white">
                            <h3 className="font-bold text-xl">{curriculum.board}</h3>
                            <p className="text-indigo-100">Affiliation No: {curriculum.affiliationNumber}</p>
                        </div>
                        <div className="h-10 w-px bg-indigo-400 hidden md:block" />
                        <div className="text-center text-white">
                            <h3 className="font-bold text-xl">{curriculum.framework}</h3>
                            <p className="text-indigo-100">Curriculum Framework</p>
                        </div>
                        <div className="h-10 w-px bg-indigo-400 hidden md:block" />
                        <div className="text-center text-white">
                            <h3 className="font-bold text-xl">{curriculum.medium}</h3>
                            <p className="text-indigo-100">Medium of Instruction</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Curriculum Features */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-amber-100 text-amber-800">Key Features</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Modern Teaching Approaches
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
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
            </section>

            {/* Subjects by Level */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-indigo-100 text-indigo-800">Subjects</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Subjects Offered by Level
                        </h2>
                    </div>

                    <div className="max-w-5xl mx-auto">
                        <Tabs defaultValue="primary" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
                                <TabsTrigger value="primary">Primary</TabsTrigger>
                                <TabsTrigger value="middle">Middle</TabsTrigger>
                                <TabsTrigger value="secondary">Secondary</TabsTrigger>
                                <TabsTrigger value="science">Sr. Sec (Science)</TabsTrigger>
                                <TabsTrigger value="commerce">Sr. Sec (Commerce)</TabsTrigger>
                            </TabsList>

                            <TabsContent value="primary">
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                                                <GraduationCap className="h-6 w-6 text-amber-600" />
                                            </div>
                                            <div>
                                                <CardTitle>Primary Section (Nursery - Class V)</CardTitle>
                                                <CardDescription>Foundation years building core skills</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {subjects.primary.map((subject, idx) => (
                                                <Badge key={idx} variant="secondary" className="px-4 py-1">
                                                    {subject}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="middle">
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                                <BookOpen className="h-6 w-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <CardTitle>Middle Section (Class VI - VIII)</CardTitle>
                                                <CardDescription>Developing analytical and scientific thinking</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {subjects.middle.map((subject, idx) => (
                                                <Badge key={idx} variant="secondary" className="px-4 py-1">
                                                    {subject}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="secondary">
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                                <Target className="h-6 w-6 text-green-600" />
                                            </div>
                                            <div>
                                                <CardTitle>Secondary Section (Class IX - X)</CardTitle>
                                                <CardDescription>Board preparation with career focus</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {subjects.secondary.map((subject, idx) => (
                                                <Badge key={idx} variant="secondary" className="px-4 py-1">
                                                    {subject}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="science">
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                                <Award className="h-6 w-6 text-purple-600" />
                                            </div>
                                            <div>
                                                <CardTitle>Senior Secondary - Science (Class XI - XII)</CardTitle>
                                                <CardDescription>For engineering and medical aspirants</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {subjects.seniorScience.map((subject, idx) => (
                                                <Badge key={idx} variant="secondary" className="px-4 py-1">
                                                    {subject}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="commerce">
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                                <FileText className="h-6 w-6 text-orange-600" />
                                            </div>
                                            <div>
                                                <CardTitle>Senior Secondary - Commerce (Class XI - XII)</CardTitle>
                                                <CardDescription>For business and finance careers</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {subjects.seniorCommerce.map((subject, idx) => (
                                                <Badge key={idx} variant="secondary" className="px-4 py-1">
                                                    {subject}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </section>

            {/* Assessment Pattern */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-green-100 text-green-800">Evaluation</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Assessment Pattern
                        </h2>
                    </div>

                    <div className="max-w-5xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            {/* Formative Assessment */}
                            <Card className="border-l-4 border-l-blue-500">
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <ClipboardCheck className="h-6 w-6 text-blue-600" />
                                        <div>
                                            <CardTitle>Formative Assessment</CardTitle>
                                            <Badge variant="outline" className="mt-1">{assessment.formative.weightage}</Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        {assessment.formative.description}
                                    </p>
                                    <div className="space-y-2">
                                        {assessment.formative.components.map((component, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-sm">
                                                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                                                <span>{component}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Summative Assessment */}
                            <Card className="border-l-4 border-l-green-500">
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-6 w-6 text-green-600" />
                                        <div>
                                            <CardTitle>Summative Assessment</CardTitle>
                                            <Badge variant="outline" className="mt-1">{assessment.summative.weightage}</Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        {assessment.summative.description}
                                    </p>
                                    <div className="space-y-2">
                                        {assessment.summative.components.map((component, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-sm">
                                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                <span>{component}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* CCE */}
                        <Card className="border-t-4 border-t-amber-500">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <Award className="h-6 w-6 text-amber-600" />
                                    <CardTitle>Continuous & Comprehensive Evaluation (CCE)</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    {assessment.cce.description}
                                </p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {assessment.cce.components.map((component, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                                            <CheckCircle2 className="h-4 w-4 text-amber-600" />
                                            <span>{component}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Academic Calendar Note */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <Calendar className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Academic Calendar
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            The academic session runs from April to March, divided into two terms.
                            Regular PTMs, examinations, and special events are scheduled throughout the year.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4 text-left max-w-lg mx-auto">
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-900 dark:text-white">Term 1</h4>
                                <p className="text-sm text-gray-500">April - September</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-900 dark:text-white">Term 2</h4>
                                <p className="text-sm text-gray-500">October - March</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-indigo-600 to-indigo-700">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to Join APS Alwar?
                    </h2>
                    <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
                        Experience our comprehensive curriculum and dedicated teaching methodology.
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
