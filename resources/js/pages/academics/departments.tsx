import PublicLayout from '@/layouts/public-layout';
import { Link } from '@inertiajs/react';
import { 
    ArrowLeft,
    Users,
    BookOpen,
    FlaskConical,
    Calculator,
    Globe,
    Languages,
    Music,
    Palette,
    Dumbbell,
    Monitor,
    Atom,
    History,
    MapPin,
    Briefcase,
    ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Department {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    staff_count?: number;
    hod?: {
        name: string;
        photo: string | null;
        qualifications: string | null;
    } | null;
}

interface Props {
    departments: Department[];
}

const iconMap: Record<string, React.ElementType> = {
    flask: FlaskConical,
    atom: Atom,
    calculator: Calculator,
    globe: Globe,
    languages: Languages,
    music: Music,
    palette: Palette,
    dumbbell: Dumbbell,
    monitor: Monitor,
    history: History,
    map: MapPin,
    briefcase: Briefcase,
    book: BookOpen,
};

function getIconByName(name: string, icon: string | null): React.ElementType {
    if (icon && iconMap[icon]) return iconMap[icon];
    
    const lowerName = name.toLowerCase();
    if (lowerName.includes('physics') || lowerName.includes('chemistry') || lowerName.includes('biology') || lowerName.includes('science')) return FlaskConical;
    if (lowerName.includes('math')) return Calculator;
    if (lowerName.includes('english') || lowerName.includes('hindi') || lowerName.includes('sanskrit') || lowerName.includes('language')) return Languages;
    if (lowerName.includes('social') || lowerName.includes('history') || lowerName.includes('civics')) return History;
    if (lowerName.includes('geography')) return MapPin;
    if (lowerName.includes('computer') || lowerName.includes('it')) return Monitor;
    if (lowerName.includes('music')) return Music;
    if (lowerName.includes('art') || lowerName.includes('craft')) return Palette;
    if (lowerName.includes('physical') || lowerName.includes('sports')) return Dumbbell;
    if (lowerName.includes('commerce') || lowerName.includes('business') || lowerName.includes('economics')) return Briefcase;
    
    return BookOpen;
}

function getInitials(name: string) {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

export default function Departments({ departments }: Props) {
    // Default departments if none provided
    const defaultDepartments: Department[] = [
        { id: 1, name: 'Physics', slug: 'physics', description: 'Understanding the fundamental laws governing the universe through experiments and theory', hod_id: null, icon: 'atom' },
        { id: 2, name: 'Chemistry', slug: 'chemistry', description: 'Exploring the composition, structure, and properties of matter', hod_id: null, icon: 'flask' },
        { id: 3, name: 'Biology', slug: 'biology', description: 'Study of living organisms and their vital processes', hod_id: null, icon: 'flask' },
        { id: 4, name: 'Mathematics', slug: 'mathematics', description: 'Developing logical reasoning and problem-solving abilities', hod_id: null, icon: 'calculator' },
        { id: 5, name: 'English', slug: 'english', description: 'Communication skills, literature, and language proficiency', hod_id: null, icon: 'languages' },
        { id: 6, name: 'Hindi', slug: 'hindi', description: 'National language education and Hindi literature', hod_id: null, icon: 'languages' },
        { id: 7, name: 'Social Science', slug: 'social-science', description: 'History, Geography, Civics, and Economics education', hod_id: null, icon: 'globe' },
        { id: 8, name: 'Computer Science', slug: 'computer-science', description: 'Programming, IT skills, and digital literacy', hod_id: null, icon: 'monitor' },
        { id: 9, name: 'Physical Education', slug: 'physical-education', description: 'Sports, fitness, and overall physical development', hod_id: null, icon: 'dumbbell' },
        { id: 10, name: 'Art & Craft', slug: 'art-craft', description: 'Creative expression through visual arts and handicrafts', hod_id: null, icon: 'palette' },
        { id: 11, name: 'Music', slug: 'music', description: 'Vocal and instrumental music education', hod_id: null, icon: 'music' },
        { id: 12, name: 'Commerce', slug: 'commerce', description: 'Accountancy, Business Studies, and Economics', hod_id: null, icon: 'briefcase' },
    ];

    const displayDepartments = departments.length > 0 ? departments : defaultDepartments;

    return (
        <PublicLayout title="Departments - APS Alwar">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950 py-16">
                <div className="container mx-auto px-4">
                    <Button variant="ghost" size="sm" className="mb-6" asChild>
                        <Link href="/academics">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Academics
                        </Link>
                    </Button>
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="mb-4 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                            <BookOpen className="h-3 w-3 mr-1" />
                            {displayDepartments.length} Departments
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Academic Departments
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Specialized departments ensuring comprehensive education across all subjects
                        </p>
                    </div>
                </div>
            </section>

            {/* Departments Grid */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {displayDepartments.map((dept) => {
                            const Icon = getIconByName(dept.name, dept.icon);
                            return (
                                <Card key={dept.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <Icon className="h-6 w-6 text-purple-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <CardTitle className="text-lg">{dept.name}</CardTitle>
                                                    {dept.staff_count !== undefined && dept.staff_count > 0 && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            <Users className="h-3 w-3 mr-1" />
                                                            {dept.staff_count}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <CardDescription className="mt-1">
                                                    {dept.description || `${dept.name} Department at APS Alwar`}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0 space-y-3">
                                        {dept.hod && (
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                <Avatar className="h-10 w-10">
                                                    {dept.hod.photo ? (
                                                        <AvatarImage src={`/storage/${dept.hod.photo}`} alt={dept.hod.name} />
                                                    ) : null}
                                                    <AvatarFallback className="bg-purple-100 text-purple-700 text-sm">
                                                        {getInitials(dept.hod.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-sm text-gray-900 dark:text-white">
                                                        {dept.hod.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {dept.hod.qualifications || 'Head of Department'}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {dept.staff_count !== undefined && dept.staff_count > 0 && (
                                            <Button asChild variant="outline" size="sm" className="w-full">
                                                <Link href={`/academics/faculty?department=${dept.id}`}>
                                                    View Faculty <ChevronRight className="h-4 w-4 ml-auto" />
                                                </Link>
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Subject Overview */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-amber-100 text-amber-800">Subjects Offered</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Comprehensive Subject Coverage
                        </h2>
                    </div>

                    <div className="max-w-5xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Core Subjects */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BookOpen className="h-5 w-5 text-blue-600" />
                                        Core Subjects
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            'English', 'Hindi', 'Mathematics', 'Science',
                                            'Social Science', 'Sanskrit', 'Physics',
                                            'Chemistry', 'Biology',
                                        ].map((subject, idx) => (
                                            <Badge key={idx} variant="secondary">
                                                {subject}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Commerce Subjects */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Briefcase className="h-5 w-5 text-green-600" />
                                        Commerce Stream
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            'Accountancy', 'Business Studies', 'Economics',
                                            'Entrepreneurship', 'Computer Science',
                                        ].map((subject, idx) => (
                                            <Badge key={idx} variant="secondary">
                                                {subject}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Optional Subjects */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Globe className="h-5 w-5 text-purple-600" />
                                        Optional Subjects
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            'Information Technology', 'French',
                                            'Physical Education', 'Art Education',
                                            'Music (Vocal/Instrumental)',
                                        ].map((subject, idx) => (
                                            <Badge key={idx} variant="secondary">
                                                {subject}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Co-curricular */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Music className="h-5 w-5 text-amber-600" />
                                        Co-curricular Activities
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            'NCC', 'Robotics Club', 'Science Club',
                                            'Literary Club', 'Sports', 'Art & Craft',
                                            'Dance', 'Debate', 'Quiz',
                                        ].map((activity, idx) => (
                                            <Badge key={idx} variant="secondary">
                                                {activity}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-purple-600 to-purple-700">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Explore Our Academic Programs
                    </h2>
                    <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
                        Learn more about our curriculum, teaching methodologies, and assessment patterns.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button size="lg" variant="secondary" asChild>
                            <Link href="/academics/curriculum">
                                View Curriculum
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                            <Link href="/academics/faculty">
                                Meet Faculty
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
