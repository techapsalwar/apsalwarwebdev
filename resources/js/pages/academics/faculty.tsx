import PublicLayout from '@/layouts/public-layout';
import { Link } from '@inertiajs/react';
import { 
    ArrowLeft,
    Users,
    GraduationCap,
    Mail,
    Award,
    BookOpen,
    Search,
    Building,
    ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

interface Department {
    id: number;
    name: string;
}

interface Staff {
    id: number;
    name: string;
    slug: string;
    designation: string;
    qualifications: string | null;
    department: string | null;
    department_id: number | null;
    type: 'teaching' | 'non_teaching' | 'management';
    photo: string | null;
    photo_url: string | null;
    email: string | null;
    subjects: string[] | null;
    experience: string | null;
    years_of_experience: number | null;
    bio: string | null;
}

interface Props {
    staff: Staff[];
    grouped: Record<string, Staff[]>;
    departments: Department[];
    statistics: {
        total: number;
        teaching: number;
        non_teaching: number;
        management: number;
    };
    filters: {
        type?: string;
        department?: string;
    };
}

function getInitials(name: string) {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

const typeLabels: Record<string, string> = {
    teaching: 'Teaching Staff',
    non_teaching: 'Non-Teaching Staff',
    management: 'Management',
};

const typeColors: Record<string, string> = {
    teaching: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    non_teaching: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    management: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
};

export default function Faculty({ staff, grouped, departments = [], statistics, filters = {} }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState(filters.type || 'all');
    const [selectedDepartment, setSelectedDepartment] = useState(filters.department || 'all');

    const filteredStaff = staff.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (member.department?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
        const matchesType = selectedType === 'all' || member.type === selectedType;
        const matchesDepartment = selectedDepartment === 'all' || member.department_id?.toString() === selectedDepartment;
        return matchesSearch && matchesType && matchesDepartment;
    });

    const types = Object.keys(grouped);

    return (
        <PublicLayout title="Faculty - APS Alwar">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 py-16">
                <div className="container mx-auto px-4">
                    <Button variant="ghost" size="sm" className="mb-6" asChild>
                        <Link href="/academics">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Academics
                        </Link>
                    </Button>
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="mb-4 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                            <Users className="h-3 w-3 mr-1" />
                            {statistics.total}+ Members
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Our Dedicated Faculty
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Meet the passionate educators shaping the future of our students
                        </p>
                    </div>
                </div>
            </section>

            {/* Statistics */}
            <section className="py-8 bg-amber-600 dark:bg-amber-800">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="text-white">
                            <Users className="h-8 w-8 mx-auto mb-2 opacity-90" />
                            <div className="text-2xl font-bold">{statistics.total}</div>
                            <div className="text-amber-100 text-sm">Total Staff</div>
                        </div>
                        <div className="text-white">
                            <GraduationCap className="h-8 w-8 mx-auto mb-2 opacity-90" />
                            <div className="text-2xl font-bold">{statistics.teaching}</div>
                            <div className="text-amber-100 text-sm">Teaching</div>
                        </div>
                        <div className="text-white">
                            <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-90" />
                            <div className="text-2xl font-bold">{statistics.non_teaching}</div>
                            <div className="text-amber-100 text-sm">Non-Teaching</div>
                        </div>
                        <div className="text-white">
                            <Award className="h-8 w-8 mx-auto mb-2 opacity-90" />
                            <div className="text-2xl font-bold">{statistics.management}</div>
                            <div className="text-amber-100 text-sm">Management</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Search and Filter */}
            <section className="py-8 border-b dark:border-gray-800">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search by name, designation, or department..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <Select value={selectedType} onValueChange={setSelectedType}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Staff Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    {Object.entries(typeLabels).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {departments.length > 0 && (
                                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Departments</SelectItem>
                                        {departments.map((dept) => (
                                            <SelectItem key={dept.id} value={dept.id.toString()}>
                                                {dept.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Faculty Grid */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    {filteredStaff.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                No faculty members found
                            </h3>
                            <p className="text-gray-500">
                                Try adjusting your search or filter criteria
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredStaff.map((member) => (
                                <Link 
                                    key={member.id} 
                                    href={`/academics/faculty/${member.slug}`}
                                    className="block group"
                                >
                                    <Card className="hover:shadow-lg transition-all duration-300 group-hover:border-amber-500 h-full">
                                        <CardHeader className="text-center pb-2">
                                            <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-transparent group-hover:ring-amber-200 transition-all">
                                                {member.photo_url ? (
                                                    <AvatarImage src={member.photo_url} alt={member.name} />
                                                ) : member.photo ? (
                                                    <AvatarImage src={`/storage/${member.photo}`} alt={member.name} />
                                                ) : null}
                                                <AvatarFallback className="bg-amber-100 text-amber-700 text-xl">
                                                    {getInitials(member.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <CardTitle className="text-lg group-hover:text-amber-600 transition-colors">
                                                {member.name}
                                            </CardTitle>
                                            <CardDescription className="font-medium">
                                                {member.designation}
                                            </CardDescription>
                                            <Badge className={`mt-2 ${typeColors[member.type]}`}>
                                                {typeLabels[member.type]}
                                            </Badge>
                                        </CardHeader>
                                        <CardContent className="text-center">
                                            {member.qualifications && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                                    <GraduationCap className="h-3 w-3 inline mr-1" />
                                                    {member.qualifications}
                                            </p>
                                        )}
                                        {member.department && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                                <Building className="h-3 w-3 inline mr-1" />
                                                {member.department}
                                            </p>
                                        )}
                                        {member.experience && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                                <Award className="h-3 w-3 inline mr-1" />
                                                {member.experience}
                                            </p>
                                        )}
                                        <div className="mt-4 flex items-center justify-center text-amber-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                            View Profile
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </div>
                                    </CardContent>
                                </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Why Our Faculty */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-amber-100 text-amber-800">Excellence</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Why Our Faculty Stands Out
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {[
                            {
                                icon: GraduationCap,
                                title: 'Highly Qualified',
                                description: 'Post-graduate and professionally trained educators',
                            },
                            {
                                icon: Award,
                                title: 'Experienced',
                                description: 'Years of teaching experience in CBSE curriculum',
                            },
                            {
                                icon: BookOpen,
                                title: 'Continuous Learning',
                                description: 'Regular training and professional development',
                            },
                            {
                                icon: Users,
                                title: 'Student-Centric',
                                description: 'Dedicated to individual student growth and success',
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
            <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Join Our Teaching Community
                    </h2>
                    <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                        We're always looking for passionate educators to join our team.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button size="lg" variant="secondary" asChild>
                            <Link href="/careers">
                                View Career Opportunities
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                            <Link href="/contact">
                                Contact HR
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
