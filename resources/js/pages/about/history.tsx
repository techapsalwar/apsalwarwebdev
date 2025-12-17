import PublicLayout from '@/layouts/public-layout';
import { Link } from '@inertiajs/react';
import { 
    ArrowLeft,
    Calendar,
    Award,
    Users,
    Building2,
    Trophy,
    GraduationCap,
    BookOpen,
    Flag,
    Star,
    ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Milestone {
    year: string;
    title: string;
    description: string;
}

interface Props {
    milestones: Milestone[];
    foundingYear: number;
    yearsOfExcellence: number;
    statistics: {
        totalStudents: number;
        totalStaff: number;
        totalAlumni: number;
    };
}

const iconMap: Record<string, React.ElementType> = {
    'establishment': Building2,
    'affiliation': BookOpen,
    'achievement': Trophy,
    'expansion': Users,
    'recognition': Award,
    'default': Star,
};

function getIconForMilestone(title: string): React.ElementType {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('establish') || lowerTitle.includes('found')) return Building2;
    if (lowerTitle.includes('cbse') || lowerTitle.includes('affiliat')) return BookOpen;
    if (lowerTitle.includes('achieve') || lowerTitle.includes('award') || lowerTitle.includes('winner')) return Trophy;
    if (lowerTitle.includes('expansion') || lowerTitle.includes('new') || lowerTitle.includes('added')) return Users;
    if (lowerTitle.includes('recognition') || lowerTitle.includes('honor')) return Award;
    if (lowerTitle.includes('ncc') || lowerTitle.includes('flag')) return Flag;
    if (lowerTitle.includes('student') || lowerTitle.includes('batch')) return GraduationCap;
    return Star;
}

export default function History({ milestones, foundingYear, yearsOfExcellence, statistics }: Props) {
    const defaultMilestones: Milestone[] = milestones.length > 0 ? milestones : [
        {
            year: '1981',
            title: 'School Established',
            description: 'Army Public School Alwar was established under the aegis of Army Welfare Education Society (AWES), New Delhi, with a vision to provide quality education.'
        },
        {
            year: '1985',
            title: 'CBSE Affiliation Received',
            description: 'The school received affiliation from Central Board of Secondary Education (CBSE) with affiliation number 1780018.'
        },
        {
            year: '1990',
            title: 'First Batch of Class X',
            description: 'The school proudly produced its first batch of Class X students, marking a significant milestone in academic progress.'
        },
        {
            year: '1995',
            title: 'Science Stream Introduced',
            description: 'Senior Secondary section with Science stream was introduced to cater to students aspiring for careers in science and technology.'
        },
        {
            year: '2000',
            title: 'Commerce Stream Added',
            description: 'Commerce stream was added to the Senior Secondary section, providing more options for students.'
        },
        {
            year: '2005',
            title: 'Infrastructure Expansion',
            description: 'Major infrastructure expansion including new science labs, computer labs, and sports facilities.'
        },
        {
            year: '2010',
            title: 'Smart Classroom Initiative',
            description: 'Implementation of smart classroom technology with interactive boards across all sections.'
        },
        {
            year: '2015',
            title: 'NCC Unit Established',
            description: 'Independent NCC unit established with both Army and Naval wings, promoting discipline and national service.'
        },
        {
            year: '2020',
            title: 'Digital Learning Platform',
            description: 'Launch of comprehensive digital learning platform with Digicamp for enhanced learning experience.'
        },
        {
            year: '2024',
            title: '43 Years of Excellence',
            description: 'Celebrating 43 years of educational excellence with over 10,000 proud alumni serving the nation.'
        },
    ];

    return (
        <PublicLayout title="Our History - APS Alwar">
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
                            Since {foundingYear}
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Our Rich History
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            A journey of {yearsOfExcellence}+ years of excellence in education, nurturing young minds
                            and shaping future leaders
                        </p>
                    </div>
                </div>
            </section>

            {/* Foundation Story */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <Badge className="mb-4 bg-green-100 text-green-800">Foundation</Badge>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                    A Legacy of Excellence
                                </h2>
                                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                                    <p>
                                        Army Public School Alwar was established in {foundingYear} under the aegis of 
                                        Army Welfare Education Society (AWES), New Delhi. The school was founded with
                                        a vision to provide quality education not only to the wards of Army personnel
                                        but also to the children of the local community.
                                    </p>
                                    <p>
                                        Starting as a small institution, APS Alwar has grown into one of the premier
                                        educational institutions in Rajasthan, known for its academic excellence,
                                        disciplined environment, and holistic development programs.
                                    </p>
                                    <p>
                                        The school is affiliated to the Central Board of Secondary Education (CBSE),
                                        New Delhi with Affiliation Number <strong>1780018</strong>, and follows the
                                        NCF 2023 curriculum framework.
                                    </p>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="aspect-square bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/20 rounded-2xl flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-7xl font-bold text-amber-600 mb-2">{foundingYear}</div>
                                        <div className="text-gray-600 dark:text-gray-400">Year of Establishment</div>
                                    </div>
                                </div>
                                <div className="absolute -bottom-6 -right-6 bg-green-700 text-white p-6 rounded-2xl shadow-lg">
                                    <div className="text-4xl font-bold">{yearsOfExcellence}+</div>
                                    <div className="text-green-100 text-sm">Years of Excellence</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics */}
            <section className="py-12 bg-amber-600 dark:bg-amber-800">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-3 gap-6 text-center">
                        <div className="text-white">
                            <GraduationCap className="h-10 w-10 mx-auto mb-2 opacity-90" />
                            <div className="text-3xl font-bold">{statistics.totalStudents.toLocaleString()}+</div>
                            <div className="text-amber-100">Current Students</div>
                        </div>
                        <div className="text-white">
                            <Users className="h-10 w-10 mx-auto mb-2 opacity-90" />
                            <div className="text-3xl font-bold">{statistics.totalStaff}+</div>
                            <div className="text-amber-100">Dedicated Staff</div>
                        </div>
                        <div className="text-white">
                            <Award className="h-10 w-10 mx-auto mb-2 opacity-90" />
                            <div className="text-3xl font-bold">{statistics.totalAlumni.toLocaleString()}+</div>
                            <div className="text-amber-100">Proud Alumni</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-amber-100 text-amber-800">Journey</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Key Milestones
                        </h2>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="relative">
                            {/* Timeline Line */}
                            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-amber-200 dark:bg-amber-800" />

                            {/* Timeline Items */}
                            <div className="space-y-12">
                                {defaultMilestones.map((milestone, index) => {
                                    const Icon = getIconForMilestone(milestone.title);
                                    const isLeft = index % 2 === 0;
                                    return (
                                        <div 
                                            key={index}
                                            className={`relative flex items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
                                        >
                                            {/* Content */}
                                            <div className={`w-5/12 ${isLeft ? 'text-right pr-8' : 'text-left pl-8'}`}>
                                                <Card className="inline-block text-left">
                                                    <CardHeader className="pb-2">
                                                        <Badge variant="outline" className="w-fit mb-2">
                                                            <Calendar className="h-3 w-3 mr-1" />
                                                            {milestone.year}
                                                        </Badge>
                                                        <CardTitle className="text-lg">{milestone.title}</CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <CardDescription className="text-sm">
                                                            {milestone.description}
                                                        </CardDescription>
                                                    </CardContent>
                                                </Card>
                                            </div>

                                            {/* Center Icon */}
                                            <div className="w-2/12 flex justify-center">
                                                <div className="w-12 h-12 bg-amber-600 dark:bg-amber-500 rounded-full flex items-center justify-center shadow-lg z-10">
                                                    <Icon className="h-6 w-6 text-white" />
                                                </div>
                                            </div>

                                            {/* Empty space */}
                                            <div className="w-5/12" />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* AWES Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <Card className="border-green-200 dark:border-green-800">
                            <CardHeader className="text-center">
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Flag className="h-8 w-8 text-green-700 dark:text-green-400" />
                                </div>
                                <CardTitle className="text-2xl">
                                    Army Welfare Education Society
                                </CardTitle>
                                <CardDescription className="text-base">
                                    Our Parent Organization
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                                    Army Welfare Education Society (AWES) was established in 1983 under the 
                                    Adjutant General's Branch, IHQ of MoD (Army). AWES manages all Army Public 
                                    Schools across India, ensuring uniform standards of education, discipline, 
                                    and overall development of students. APS Alwar is proud to be part of this 
                                    prestigious network of schools serving the nation.
                                </p>
                                <div className="grid grid-cols-3 gap-4 mt-8">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-green-700">136+</div>
                                        <div className="text-sm text-gray-500">Army Schools</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-green-700">5L+</div>
                                        <div className="text-sm text-gray-500">Students</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-green-700">40+</div>
                                        <div className="text-sm text-gray-500">Years</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Notable Achievements */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-amber-100 text-amber-800">Achievements</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            A Proud Legacy
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {[
                            {
                                icon: Trophy,
                                title: 'Academic Excellence',
                                description: 'Consistently achieving 100% pass rate in CBSE board examinations'
                            },
                            {
                                icon: Award,
                                title: 'Sports Achievements',
                                description: 'Multiple state and national level winners in various sports'
                            },
                            {
                                icon: Flag,
                                title: 'NCC Excellence',
                                description: 'Republic Day Parade participation and numerous NCC camps'
                            },
                            {
                                icon: GraduationCap,
                                title: 'Higher Education',
                                description: 'Alumni in top institutions including IITs, NITs, and medical colleges'
                            },
                            {
                                icon: Star,
                                title: 'Holistic Development',
                                description: 'Winners in art, music, debate, and other co-curricular activities'
                            },
                            {
                                icon: Users,
                                title: 'Community Service',
                                description: 'Active participation in social service and environmental initiatives'
                            },
                        ].map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <Card key={index} className="text-center">
                                    <CardHeader>
                                        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Icon className="h-6 w-6 text-amber-600" />
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

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-amber-600 to-amber-700">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Be Part of Our Legacy
                    </h2>
                    <p className="text-amber-100 mb-8 max-w-2xl mx-auto">
                        Join the APS Alwar family and become part of our proud legacy of excellence.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button size="lg" variant="secondary" asChild>
                            <Link href="/admissions">
                                Apply for Admission
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                            <Link href="/alumni">
                                Join Alumni Network
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
