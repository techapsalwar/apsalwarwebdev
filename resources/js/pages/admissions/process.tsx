import PublicLayout from '@/layouts/public-layout';
import { Link } from '@inertiajs/react';
import { 
    ClipboardCheck,
    FileText,
    FileSearch,
    Users,
    ListChecks,
    CreditCard,
    CheckCircle,
    Calendar,
    ChevronRight,
    Download,
    ArrowRight,
    Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Step {
    step: number;
    title: string;
    description: string;
    icon: string;
}

interface DocumentCategory {
    category: string;
    documents: string[];
}

interface TimelineItem {
    month: string;
    activity: string;
}

interface Reservation {
    category: string;
    description: string;
    priority: number;
}

interface Props {
    steps: Step[];
    documents: DocumentCategory[];
    timeline: TimelineItem[];
    reservations: Reservation[];
}

const stepIcons: Record<string, React.ElementType> = {
    form: ClipboardCheck,
    documents: FileText,
    test: FileSearch,
    interview: Users,
    list: ListChecks,
    payment: CreditCard,
    confirm: CheckCircle,
};

export default function AdmissionProcess({ steps, documents, timeline, reservations }: Props) {
    return (
        <PublicLayout title="Admission Process - APS Alwar">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="mb-4 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                            Step-by-Step Guide
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Admission Process
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Follow our simple admission process to become a part of the APS Alwar family
                        </p>
                    </div>
                </div>
            </section>

            {/* Steps Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <div className="relative">
                            {/* Vertical line connector */}
                            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-amber-200 dark:bg-amber-800 transform -translate-x-1/2 hidden md:block" />
                            
                            {steps.map((step, index) => {
                                const Icon = stepIcons[step.icon] || ClipboardCheck;
                                const isEven = index % 2 === 0;
                                
                                return (
                                    <div key={step.step} className="relative mb-8 last:mb-0">
                                        <div className={`flex items-start gap-6 md:gap-12 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                            {/* Content */}
                                            <div className={`flex-1 ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                                                <Card className="inline-block text-left">
                                                    <CardHeader className="pb-2">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center md:hidden">
                                                                <Icon className="h-5 w-5 text-amber-600" />
                                                            </div>
                                                            <div>
                                                                <Badge className="mb-2 bg-amber-100 text-amber-800">
                                                                    Step {step.step}
                                                                </Badge>
                                                                <CardTitle className="text-lg">{step.title}</CardTitle>
                                                            </div>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <CardDescription>{step.description}</CardDescription>
                                                    </CardContent>
                                                </Card>
                                            </div>

                                            {/* Center Icon (Desktop) */}
                                            <div className="hidden md:flex items-center justify-center">
                                                <div className="w-16 h-16 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-lg z-10">
                                                    <Icon className="h-7 w-7" />
                                                </div>
                                            </div>

                                            {/* Spacer for alignment */}
                                            <div className="flex-1 hidden md:block" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Required Documents */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-green-100 text-green-800">Checklist</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Required Documents
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Keep these documents ready before applying
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {documents.map((category, index) => (
                            <Card key={index}>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <FileText className="h-5 w-5 text-amber-600" />
                                        {category.category}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {category.documents.map((doc, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
                                                <span className="text-gray-600 dark:text-gray-300 text-sm">{doc}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <Button variant="outline" className="gap-2">
                            <Download className="h-4 w-4" />
                            Download Document Checklist
                        </Button>
                    </div>
                </div>
            </section>

            {/* Admission Timeline */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-blue-100 text-blue-800">Timeline</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Admission Calendar
                        </h2>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {timeline.map((item, index) => (
                                <Card key={index} className="text-center">
                                    <CardHeader className="pb-2">
                                        <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-2">
                                            <Calendar className="h-6 w-6 text-amber-600" />
                                        </div>
                                        <CardTitle className="text-lg">{item.month}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription>{item.activity}</CardDescription>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Reservation */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-purple-100 text-purple-800">Priority System</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Category-wise Reservation
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            As per AWES guidelines, admissions follow category-based priority
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <Card>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-amber-50 dark:bg-amber-900/20">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                    Priority
                                                </th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                    Category
                                                </th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                    Description
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {reservations.map((item) => (
                                                <tr key={item.priority} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                    <td className="px-6 py-4">
                                                        <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                                                            {item.priority}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                                        {item.category}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                                        {item.description}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div className="flex items-start gap-3">
                                <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                    <strong>Note:</strong> Civilians can apply under Category VI. Admission is subject to availability of seats after accommodating higher priority categories.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Important Notes */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileSearch className="h-5 w-5 text-amber-600" />
                                    Important Notes
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {[
                                        'Registration does not guarantee admission.',
                                        'Original documents must be produced at the time of admission.',
                                        'Incomplete applications will not be considered.',
                                        'Entrance test is mandatory for Class 6 onwards.',
                                        'Fee once paid is non-refundable.',
                                        'School reserves the right to verify all documents.',
                                        'Decision of the Admission Committee is final.',
                                    ].map((note, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <ChevronRight className="h-4 w-4 text-amber-600 flex-shrink-0 mt-1" />
                                            <span className="text-gray-700 dark:text-gray-300 text-sm">{note}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-amber-600 to-amber-700">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to Apply?
                    </h2>
                    <p className="text-amber-100 mb-8 max-w-2xl mx-auto">
                        Have questions? Check our FAQs or contact us for assistance.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button size="lg" variant="secondary" asChild>
                            <Link href="/admissions/faqs">
                                View FAQs
                                <ArrowRight className="ml-2 h-5 w-5" />
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
