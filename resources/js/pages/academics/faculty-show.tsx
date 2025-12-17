import PublicLayout from '@/layouts/public-layout';
import { Link } from '@inertiajs/react';
import { 
    ArrowLeft,
    Mail,
    Phone,
    Building,
    GraduationCap,
    Calendar,
    Award,
    BookOpen,
    ChevronRight,
    Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface RelatedStaff {
    id: number;
    name: string;
    slug: string;
    designation: string;
    photo_url: string | null;
}

interface StaffMember {
    id: number;
    name: string;
    slug: string;
    designation: string;
    qualifications: string | null;
    department: string | null;
    type: 'teaching' | 'non_teaching' | 'management';
    photo: string | null;
    photo_url: string | null;
    email: string | null;
    phone: string | null;
    subjects: string[] | null;
    experience: string | null;
    years_of_experience: number | null;
    bio: string | null;
    joining_date: string | null;
}

interface Props {
    staff: StaffMember;
    relatedStaff: RelatedStaff[];
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

export default function FacultyShow({ staff, relatedStaff }: Props) {
    return (
        <PublicLayout title={`${staff.name} - Faculty - APS Alwar`}>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 py-16">
                <div className="container mx-auto px-4">
                    <Button variant="ghost" size="sm" className="mb-6" asChild>
                        <Link href="/academics/faculty">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Faculty
                        </Link>
                    </Button>
                    
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                            {/* Photo */}
                            <div className="flex-shrink-0">
                                <Avatar className="h-48 w-48 border-4 border-white shadow-xl">
                                    {staff.photo_url ? (
                                        <AvatarImage src={staff.photo_url} alt={staff.name} />
                                    ) : staff.photo ? (
                                        <AvatarImage src={`/storage/${staff.photo}`} alt={staff.name} />
                                    ) : null}
                                    <AvatarFallback className="bg-amber-100 text-amber-700 text-5xl">
                                        {getInitials(staff.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            {/* Info */}
                            <div className="text-center md:text-left flex-1">
                                <Badge className={`mb-4 ${typeColors[staff.type]}`}>
                                    {typeLabels[staff.type]}
                                </Badge>
                                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                    {staff.name}
                                </h1>
                                <p className="text-xl text-amber-600 font-medium mb-4">
                                    {staff.designation}
                                </p>
                                {staff.department && (
                                    <p className="text-gray-600 dark:text-gray-300 flex items-center justify-center md:justify-start gap-2 mb-4">
                                        <Building className="h-5 w-5" />
                                        {staff.department}
                                    </p>
                                )}

                                {/* Contact Buttons */}
                                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                    {staff.email && (
                                        <Button asChild>
                                            <a href={`mailto:${staff.email}`}>
                                                <Mail className="mr-2 h-4 w-4" />
                                                Send Email
                                            </a>
                                        </Button>
                                    )}
                                    {staff.phone && (
                                        <Button variant="outline" asChild>
                                            <a href={`tel:${staff.phone}`}>
                                                <Phone className="mr-2 h-4 w-4" />
                                                Call
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Details Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="md:col-span-2 space-y-8">
                            {/* Bio */}
                            {staff.bio && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>About</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                                            {staff.bio}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Subjects */}
                            {staff.subjects && staff.subjects.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <BookOpen className="h-5 w-5 text-amber-600" />
                                            Subjects Taught
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {staff.subjects.map((subject, index) => (
                                                <Badge key={index} variant="secondary" className="text-base px-4 py-2">
                                                    {subject}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {staff.qualifications && (
                                        <div className="flex items-start gap-3">
                                            <GraduationCap className="h-5 w-5 text-amber-600 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Qualifications</p>
                                                <p className="font-medium">{staff.qualifications}</p>
                                            </div>
                                        </div>
                                    )}
                                    {staff.experience && (
                                        <div className="flex items-start gap-3">
                                            <Award className="h-5 w-5 text-amber-600 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Experience</p>
                                                <p className="font-medium">{staff.experience}</p>
                                            </div>
                                        </div>
                                    )}
                                    {staff.joining_date && (
                                        <div className="flex items-start gap-3">
                                            <Calendar className="h-5 w-5 text-amber-600 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Joined</p>
                                                <p className="font-medium">{staff.joining_date}</p>
                                            </div>
                                        </div>
                                    )}
                                    {staff.email && (
                                        <div className="flex items-start gap-3">
                                            <Mail className="h-5 w-5 text-amber-600 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Email</p>
                                                <a href={`mailto:${staff.email}`} className="font-medium text-amber-600 hover:underline break-all">
                                                    {staff.email}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                    {staff.phone && (
                                        <div className="flex items-start gap-3">
                                            <Phone className="h-5 w-5 text-amber-600 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Phone</p>
                                                <a href={`tel:${staff.phone}`} className="font-medium">
                                                    {staff.phone}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Staff */}
            {relatedStaff.length > 0 && (
                <section className="py-16 bg-gray-50 dark:bg-gray-900">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Other Faculty from {staff.department}
                                </h2>
                                <Button variant="outline" asChild>
                                    <Link href="/academics/faculty">
                                        View All
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {relatedStaff.map((member) => (
                                    <Link 
                                        key={member.id} 
                                        href={`/academics/faculty/${member.slug}`}
                                        className="group"
                                    >
                                        <Card className="text-center hover:shadow-lg transition-shadow group-hover:border-amber-500">
                                            <CardContent className="pt-6">
                                                <Avatar className="h-16 w-16 mx-auto mb-3 ring-2 ring-transparent group-hover:ring-amber-200 transition-all">
                                                    {member.photo_url ? (
                                                        <AvatarImage src={member.photo_url} alt={member.name} />
                                                    ) : null}
                                                    <AvatarFallback className="bg-amber-100 text-amber-700">
                                                        {getInitials(member.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <p className="font-medium text-sm group-hover:text-amber-600 transition-colors">
                                                    {member.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {member.designation}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Contact CTA */}
            <section className="py-16 bg-gradient-to-r from-amber-500 to-amber-600">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Have Questions?
                    </h2>
                    <p className="text-amber-100 mb-8 max-w-2xl mx-auto">
                        Feel free to reach out to our staff for any academic queries or information.
                    </p>
                    <Button size="lg" variant="secondary" asChild>
                        <Link href="/contact">
                            Contact Us
                        </Link>
                    </Button>
                </div>
            </section>
        </PublicLayout>
    );
}
