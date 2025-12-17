import PublicLayout from '@/layouts/public-layout';
import { Link } from '@inertiajs/react';
import { 
    ArrowLeft,
    Target,
    Landmark,
    Quote,
    CheckCircle2,
    Lightbulb,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Objective {
    title: string;
    description: string;
}

interface Props {
    vision: string;
    mission: string;
    motto: string;
    objectives: Objective[];
}

export default function VisionMission({ vision, mission, motto, objectives }: Props) {
    return (
        <PublicLayout title="Vision & Mission - APS Alwar">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-gray-950 py-16">
                <div className="container mx-auto px-4">
                    <Button variant="ghost" size="sm" className="mb-6" asChild>
                        <Link href="/about">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to About
                        </Link>
                    </Button>
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="mb-4 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                            Our Purpose
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Vision, Mission & Objectives
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            The guiding principles that drive our commitment to educational excellence and holistic development.
                        </p>
                    </div>
                </div>
            </section>

            {/* Motto Section */}
            <section className="py-12 bg-amber-600 dark:bg-amber-800">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <Quote className="h-12 w-12 mx-auto mb-4 text-amber-200" />
                        <h2 className="text-3xl md:text-4xl font-bold text-white italic">
                            "{motto}"
                        </h2>
                        <p className="text-amber-100 mt-4">— School Motto</p>
                    </div>
                </div>
            </section>

            {/* Vision & Mission */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {/* Vision */}
                        <Card className="border-t-4 border-t-amber-500 shadow-lg">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-xl">
                                        <Target className="h-8 w-8 text-amber-600" />
                                    </div>
                                    <div>
                                        <Badge variant="outline" className="mb-2">Our Vision</Badge>
                                        <CardTitle className="text-2xl">What We Aspire To</CardTitle>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                                    {vision}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Mission */}
                        <Card className="border-t-4 border-t-blue-500 shadow-lg">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
                                        <Landmark className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <div>
                                        <Badge variant="outline" className="mb-2">Our Mission</Badge>
                                        <CardTitle className="text-2xl">How We Achieve It</CardTitle>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                                    {mission}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Core Objectives */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <Badge className="mb-4 bg-amber-100 text-amber-800">Core Objectives</Badge>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                Our Commitment to Excellence
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                                We are committed to achieving these core objectives in nurturing well-rounded individuals.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {objectives.map((objective, index) => (
                                <Card key={index} className="group hover:shadow-lg transition-shadow">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-800/50 transition-colors">
                                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                            </div>
                                            <CardTitle className="text-lg leading-tight">
                                                {objective.title}
                                            </CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-sm leading-relaxed">
                                            {objective.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Highlight */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <Badge className="mb-4 bg-amber-100 text-amber-800">Our Values</Badge>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                What We Stand For
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { name: 'Excellence', icon: '🌟', color: 'bg-amber-100 dark:bg-amber-900/30' },
                                { name: 'Discipline', icon: '🎯', color: 'bg-blue-100 dark:bg-blue-900/30' },
                                { name: 'Integrity', icon: '💎', color: 'bg-purple-100 dark:bg-purple-900/30' },
                                { name: 'Service', icon: '🤝', color: 'bg-green-100 dark:bg-green-900/30' },
                                { name: 'Innovation', icon: '💡', color: 'bg-yellow-100 dark:bg-yellow-900/30' },
                                { name: 'Compassion', icon: '❤️', color: 'bg-red-100 dark:bg-red-900/30' },
                                { name: 'Teamwork', icon: '👥', color: 'bg-cyan-100 dark:bg-cyan-900/30' },
                                { name: 'Patriotism', icon: '🇮🇳', color: 'bg-orange-100 dark:bg-orange-900/30' },
                            ].map((value, index) => (
                                <div 
                                    key={index}
                                    className={`${value.color} rounded-xl p-6 text-center hover:scale-105 transition-transform`}
                                >
                                    <span className="text-3xl mb-2 block">{value.icon}</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {value.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-amber-600 to-amber-700">
                <div className="container mx-auto px-4 text-center">
                    <Lightbulb className="h-12 w-12 mx-auto mb-4 text-amber-200" />
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Experience Our Vision in Action
                    </h2>
                    <p className="text-amber-100 mb-8 max-w-2xl mx-auto">
                        Visit our campus to see how we bring our vision and mission to life every day.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button size="lg" variant="secondary" asChild>
                            <Link href="/facilities">
                                Explore Campus
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                            <Link href="/contact">
                                Schedule a Visit
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
