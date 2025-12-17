import PublicLayout from '@/layouts/public-layout';
import { Link } from '@inertiajs/react';
import { 
    GraduationCap,
    Users,
    Calendar,
    FileText,
    CheckCircle2,
    ArrowRight,
    BookOpen,
    Building2,
    ClipboardList,
    HelpCircle,
    IndianRupee,
    Shield,
    Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AdmissionInfo {
    school_type: string;
    affiliation: string;
    classes: string;
    medium: string;
    streams: string;
    run_by: string;
    open_to: string[];
}

interface Eligibility {
    class: string;
    age: string;
    requirement: string;
}

interface Statistics {
    totalStudents: number;
    classesOffered: string;
    averageClassSize: number;
    teacherStudentRatio: string;
}

interface CurrentAdmission {
    academic_year: string;
    registration_start: string;
    registration_end: string;
    status: string;
}

interface Props {
    currentAdmission: CurrentAdmission | null;
    admissionInfo: AdmissionInfo;
    eligibility: Eligibility[];
    statistics: Statistics;
}

export default function Admissions({ currentAdmission, admissionInfo, eligibility, statistics }: Props) {
    const quickLinks = [
        {
            title: 'Admission Process',
            description: 'Step-by-step guide to apply',
            icon: ClipboardList,
            href: '/admissions/process',
            color: 'bg-blue-100 text-blue-600',
        },
        {
            title: 'Fee Structure',
            description: 'Fees for all classes',
            icon: IndianRupee,
            href: '/admissions/fee-structure',
            color: 'bg-green-100 text-green-600',
        },
        {
            title: 'FAQs',
            description: 'Common questions answered',
            icon: HelpCircle,
            href: '/admissions/faqs',
            color: 'bg-purple-100 text-purple-600',
        },
        {
            title: 'Contact Us',
            description: 'Get in touch with us',
            icon: Users,
            href: '/contact',
            color: 'bg-amber-100 text-amber-600',
        },
    ];

    return (
        <PublicLayout title="Admissions - APS Alwar">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="mb-4 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                            Admissions 2025-26
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Join the APS Alwar Family
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                            Begin your journey with one of Rajasthan's premier AWES schools.
                            Excellence in education, character building, and all-round development.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button size="lg" className="bg-amber-600 hover:bg-amber-700" asChild>
                                <Link href="/admissions/process">
                                    Start Application
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <Link href="/contact">
                                    Schedule a Visit
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Admission Status Banner */}
            {currentAdmission && currentAdmission.status === 'open' && (
                <section className="py-4 bg-green-600 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                            <CheckCircle2 className="h-5 w-5" />
                            <span className="font-semibold">
                                Admissions Open for {currentAdmission.academic_year}!
                            </span>
                            <Button size="sm" variant="secondary" className="ml-4" asChild>
                                <a href="https://erp.awesindia.edu.in/webinterface/searchschool" target="_blank" rel="noopener noreferrer">Admission Now</a>
                            </Button>
                        </div>
                    </div>
                </section>
            )}

            {/* Statistics Banner */}
            <section className="py-8 bg-amber-600 dark:bg-amber-800">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="text-white">
                            <Users className="h-8 w-8 mx-auto mb-2 opacity-90" />
                            <div className="text-2xl font-bold">{statistics.totalStudents}+</div>
                            <div className="text-amber-100 text-sm">Total Students</div>
                        </div>
                        <div className="text-white">
                            <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-90" />
                            <div className="text-2xl font-bold">{statistics.classesOffered}</div>
                            <div className="text-amber-100 text-sm">Classes Offered</div>
                        </div>
                        <div className="text-white">
                            <GraduationCap className="h-8 w-8 mx-auto mb-2 opacity-90" />
                            <div className="text-2xl font-bold">~{statistics.averageClassSize}</div>
                            <div className="text-amber-100 text-sm">Avg Class Size</div>
                        </div>
                        <div className="text-white">
                            <Star className="h-8 w-8 mx-auto mb-2 opacity-90" />
                            <div className="text-2xl font-bold">{statistics.teacherStudentRatio}</div>
                            <div className="text-amber-100 text-sm">Teacher:Student Ratio</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Links */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-amber-100 text-amber-800">Quick Links</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Admission Resources
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                        {quickLinks.map((link, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow">
                                <CardHeader className="text-center pb-2">
                                    <div className={`w-12 h-12 rounded-full ${link.color} flex items-center justify-center mx-auto mb-4`}>
                                        <link.icon className="h-6 w-6" />
                                    </div>
                                    <CardTitle className="text-lg">{link.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <CardDescription className="mb-4">{link.description}</CardDescription>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={link.href}>
                                            Learn More
                                            <ArrowRight className="ml-1 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* School Info */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <Badge className="mb-4 bg-blue-100 text-blue-800">About APS Alwar</Badge>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                A Premier AWES School
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Shield className="h-5 w-5 text-amber-600" />
                                    <span className="text-gray-700 dark:text-gray-300">
                                        <strong>Run by:</strong> {admissionInfo.run_by}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Building2 className="h-5 w-5 text-amber-600" />
                                    <span className="text-gray-700 dark:text-gray-300">
                                        <strong>Type:</strong> {admissionInfo.school_type}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <FileText className="h-5 w-5 text-amber-600" />
                                    <span className="text-gray-700 dark:text-gray-300">
                                        <strong>CBSE Affiliation:</strong> {admissionInfo.affiliation}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <BookOpen className="h-5 w-5 text-amber-600" />
                                    <span className="text-gray-700 dark:text-gray-300">
                                        <strong>Classes:</strong> {admissionInfo.classes}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <GraduationCap className="h-5 w-5 text-amber-600" />
                                    <span className="text-gray-700 dark:text-gray-300">
                                        <strong>Streams (11-12):</strong> {admissionInfo.streams}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-amber-600" />
                                    Who Can Apply?
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {admissionInfo.open_to.map((item, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700 dark:text-gray-300">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Eligibility Table */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-green-100 text-green-800">Requirements</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Eligibility Criteria
                        </h2>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <Card>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-amber-50 dark:bg-amber-900/20">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                    Class
                                                </th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                    Age Criteria
                                                </th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                    Requirements
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {eligibility.map((item, index) => (
                                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                                        {item.class}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                                        {item.age}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                                        {item.requirement}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-purple-100 text-purple-800">Why APS Alwar?</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Excellence in Every Aspect
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {[
                            {
                                title: 'Academic Excellence',
                                description: 'Consistent 100% board results with top scorers every year',
                            },
                            {
                                title: 'Holistic Development',
                                description: 'Sports, arts, NCC, clubs for all-round personality development',
                            },
                            {
                                title: 'Modern Infrastructure',
                                description: '14.5 acres campus with smart classrooms and modern labs',
                            },
                            {
                                title: 'Expert Faculty',
                                description: '65+ qualified teachers with specialized expertise',
                            },
                            {
                                title: 'Value Education',
                                description: 'Emphasis on discipline, integrity, and national pride',
                            },
                            {
                                title: 'Career Guidance',
                                description: 'Counseling for higher education and competitive exams',
                            },
                        ].map((item, index) => (
                            <Card key={index}>
                                <CardHeader>
                                    <CardTitle className="text-lg">{item.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>{item.description}</CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-amber-600 to-amber-700">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to Join Us?
                    </h2>
                    <p className="text-amber-100 mb-8 max-w-2xl mx-auto">
                        Take the first step towards excellence. Apply for admission today.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button size="lg" variant="secondary" asChild>
                            <Link href="/admissions/process">
                                View Admission Process
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                            <Link href="/admissions/faqs">
                                Read FAQs
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
