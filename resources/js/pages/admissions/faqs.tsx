import PublicLayout from '@/layouts/public-layout';
import { Link } from '@inertiajs/react';
import { 
    HelpCircle,
    Search,
    ChevronDown,
    MessageCircle,
    Phone,
    Mail,
    ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useState } from 'react';

interface FAQ {
    category: string;
    question: string;
    answer: string;
}

interface Props {
    faqs: FAQ[];
    categories: string[];
}

const categoryColors: Record<string, string> = {
    General: 'bg-blue-100 text-blue-800',
    Eligibility: 'bg-green-100 text-green-800',
    Fees: 'bg-amber-100 text-amber-800',
    Process: 'bg-purple-100 text-purple-800',
    Facilities: 'bg-pink-100 text-pink-800',
};

export default function AdmissionFAQs({ faqs, categories }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const filteredFAQs = faqs.filter(faq => {
        const matchesSearch = searchQuery === '' ||
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === null || faq.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const faqsByCategory = filteredFAQs.reduce((acc, faq) => {
        if (!acc[faq.category]) {
            acc[faq.category] = [];
        }
        acc[faq.category].push(faq);
        return acc;
    }, {} as Record<string, FAQ[]>);

    return (
        <PublicLayout title="Admission FAQs - APS Alwar">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="mb-4 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                            Help Center
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Find answers to common questions about admissions at APS Alwar
                        </p>
                    </div>
                </div>
            </section>

            {/* Search and Filter */}
            <section className="py-8 border-b dark:border-gray-800">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="relative mb-6">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                placeholder="Search for answers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 py-6 text-lg"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center">
                            <Button
                                variant={selectedCategory === null ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedCategory(null)}
                                className={selectedCategory === null ? 'bg-amber-600 hover:bg-amber-700' : ''}
                            >
                                All Categories
                            </Button>
                            {categories.map(category => (
                                <Button
                                    key={category}
                                    variant={selectedCategory === category ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setSelectedCategory(category)}
                                    className={selectedCategory === category ? 'bg-amber-600 hover:bg-amber-700' : ''}
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Accordion */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        {filteredFAQs.length === 0 ? (
                            <div className="text-center py-12">
                                <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    No questions found
                                </h3>
                                <p className="text-gray-500">
                                    Try adjusting your search or filter criteria
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {Object.entries(faqsByCategory).map(([category, categoryFaqs]) => (
                                    <div key={category}>
                                        <div className="flex items-center gap-3 mb-4">
                                            <Badge className={categoryColors[category] || 'bg-gray-100 text-gray-800'}>
                                                {category}
                                            </Badge>
                                            <span className="text-sm text-gray-500">
                                                {categoryFaqs.length} question{categoryFaqs.length > 1 ? 's' : ''}
                                            </span>
                                        </div>
                                        <Accordion type="single" collapsible className="space-y-2">
                                            {categoryFaqs.map((faq, index) => (
                                                <AccordionItem 
                                                    key={index} 
                                                    value={`${category}-${index}`}
                                                    className="border rounded-lg px-4"
                                                >
                                                    <AccordionTrigger className="text-left hover:no-underline">
                                                        <div className="flex items-start gap-3">
                                                            <HelpCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                                            <span className="font-medium text-gray-900 dark:text-white">
                                                                {faq.question}
                                                            </span>
                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="pl-8 text-gray-600 dark:text-gray-300">
                                                        {faq.answer}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Still Have Questions */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-amber-100 text-amber-800">Need More Help?</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Still Have Questions?
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Our admission team is here to help you
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <Card className="text-center">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-2">
                                    <Phone className="h-6 w-6 text-blue-600" />
                                </div>
                                <CardTitle className="text-lg">Call Us</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    Speak directly with our admission office
                                </p>
                                <a 
                                    href="tel:+911442661234"
                                    className="text-amber-600 font-medium hover:underline"
                                >
                                    +91-144-266-1234
                                </a>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-2">
                                    <Mail className="h-6 w-6 text-green-600" />
                                </div>
                                <CardTitle className="text-lg">Email Us</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    Send us your detailed query
                                </p>
                                <a 
                                    href="mailto:admission@apsalwar.edu.in"
                                    className="text-amber-600 font-medium hover:underline"
                                >
                                    admission@apsalwar.edu.in
                                </a>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-2">
                                    <MessageCircle className="h-6 w-6 text-purple-600" />
                                </div>
                                <CardTitle className="text-lg">Visit Us</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    Schedule a campus visit
                                </p>
                                <Button size="sm" variant="outline" asChild>
                                    <Link href="/contact">
                                        Schedule Visit
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Quick Links */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-800">
                            <CardHeader>
                                <CardTitle>Quick Links</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Button variant="outline" className="justify-between" asChild>
                                        <Link href="/admissions">
                                            Admissions Overview
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button variant="outline" className="justify-between" asChild>
                                        <Link href="/admissions/process">
                                            Admission Process
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button variant="outline" className="justify-between" asChild>
                                        <Link href="/admissions/fee-structure">
                                            Fee Structure
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button variant="outline" className="justify-between" asChild>
                                        <Link href="/facilities">
                                            Our Facilities
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
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
                        Join the APS Alwar family and embark on a journey of excellence.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button size="lg" variant="secondary" asChild>
                            <Link href="/admissions/process">
                                Start Application
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
