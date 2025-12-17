import PublicLayout from '@/layouts/public-layout';
import { Link } from '@inertiajs/react';
import { 
    ArrowLeft,
    Users,
    Mail,
    Phone,
    ChevronRight,
    Star,
    Award,
    Building,
    Shield,
    UserCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Member {
    id: number;
    name: string;
    designation: string;
    role: string | null;
    email: string | null;
    phone: string | null;
    photo: string | null;
    bio: string | null;
    order: number;
}

interface Committee {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    members: Member[];
}

interface Props {
    committees: Committee[];
    smcMembers: Member[];
    parentMembers?: Member[];
}

function getInitials(name: string) {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

function getRoleIcon(role: string | null, designation: string) {
    const d = designation.toLowerCase();
    if (d.includes('chairman') || d.includes('president')) return Star;
    if (d.includes('secretary')) return Shield;
    if (d.includes('principal')) return Award;
    if (d.includes('teacher') || d.includes('representative')) return Users;
    return UserCircle;
}

export default function Management({ committees, smcMembers, parentMembers = [] }: Props) {
    return (
        <PublicLayout title="Management - APS Alwar">
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
                            Our Leadership
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            School Management
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Meet the dedicated team guiding Army Public School Alwar towards excellence in education
                        </p>
                    </div>
                </div>
            </section>

            {/* AWES Banner */}
            <section className="py-8 bg-green-700 dark:bg-green-900">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
                        <Shield className="h-12 w-12 text-white" />
                        <div className="text-white">
                            <h3 className="text-xl font-bold">Army Welfare Education Society (AWES)</h3>
                            <p className="text-green-100">
                                Sponsored by Army Welfare Education Society, New Delhi
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* School Management Committee */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-amber-100 text-amber-800">SMC</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            School Managing Committee
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            The School Managing Committee oversees the academic and administrative functions
                            of the school, ensuring quality education and holistic development of students.
                        </p>
                    </div>

                    {/* SMC Members Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {smcMembers.length > 0 ? (
                            smcMembers.map((member) => {
                                const Icon = getRoleIcon(member.role, member.designation);
                                return (
                                    <Card key={member.id} className="text-center hover:shadow-lg transition-shadow">
                                        <CardHeader>
                                            <Avatar className="h-24 w-24 mx-auto mb-4">
                                                {member.photo ? (
                                                    <AvatarImage src={`/storage/${member.photo}`} alt={member.name} />
                                                ) : null}
                                                <AvatarFallback className="bg-amber-100 text-amber-700 text-xl">
                                                    {getInitials(member.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <CardTitle className="text-lg">{member.name}</CardTitle>
                                            <Badge variant="outline" className="mt-2">
                                                <Icon className="h-3 w-3 mr-1" />
                                                {member.designation}
                                            </Badge>
                                            {member.role && (
                                                <CardDescription className="mt-2">{member.role}</CardDescription>
                                            )}
                                        </CardHeader>
                                        {(member.email || member.phone) && (
                                            <CardContent className="pt-0">
                                                <div className="flex flex-col gap-2 text-sm text-gray-500">
                                                    {member.email && (
                                                        <a 
                                                            href={`mailto:${member.email}`}
                                                            className="flex items-center justify-center gap-2 hover:text-amber-600"
                                                        >
                                                            <Mail className="h-4 w-4" />
                                                            {member.email}
                                                        </a>
                                                    )}
                                                    {member.phone && (
                                                        <a 
                                                            href={`tel:${member.phone}`}
                                                            className="flex items-center justify-center gap-2 hover:text-amber-600"
                                                        >
                                                            <Phone className="h-4 w-4" />
                                                            {member.phone}
                                                        </a>
                                                    )}
                                                </div>
                                            </CardContent>
                                        )}
                                    </Card>
                                );
                            })
                        ) : (
                            /* Default SMC Structure */
                            <>
                                {[
                                    { name: 'Brig Mukesh Sharma', designation: 'Chairman', role: 'Station Commander Alwar' },
                                    { name: 'Col Randhir Singh', designation: 'Vice Chairman', role: 'Commanding Officer' },
                                    { name: 'Mrs. Pushplata Sharma', designation: 'Principal & Member Secretary', role: 'Yale University Certificate' },
                                    { name: 'Major Vinod Kumar', designation: 'Administrative Officer', role: 'School Administration' },
                                    { name: 'Parent Representative', designation: 'Parent Member', role: 'PTA Representative' },
                                    { name: 'Teacher Representative', designation: 'Teacher Member', role: 'Faculty Representative' },
                                ].map((member, index) => {
                                    const Icon = getRoleIcon(null, member.designation);
                                    return (
                                        <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                                            <CardHeader>
                                                <Avatar className="h-24 w-24 mx-auto mb-4">
                                                    <AvatarFallback className="bg-amber-100 text-amber-700 text-xl">
                                                        {getInitials(member.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <CardTitle className="text-lg">{member.name}</CardTitle>
                                                <Badge variant="outline" className="mt-2">
                                                    <Icon className="h-3 w-3 mr-1" />
                                                    {member.designation}
                                                </Badge>
                                                <CardDescription className="mt-2">{member.role}</CardDescription>
                                            </CardHeader>
                                        </Card>
                                    );
                                })}
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Other Committees */}
            {committees.length > 0 && (
                <section className="py-16 bg-gray-50 dark:bg-gray-900">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <Badge className="mb-4 bg-amber-100 text-amber-800">Committees</Badge>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                School Committees
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                Various committees ensure smooth functioning of different aspects of school life
                            </p>
                        </div>

                        <div className="space-y-12">
                            {committees.map((committee) => (
                                <div key={committee.id}>
                                    <div className="text-center mb-6">
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {committee.name}
                                        </h3>
                                        {committee.description && (
                                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                                {committee.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                                        {committee.members.map((member) => (
                                            <Card key={member.id} className="text-center p-4">
                                                <Avatar className="h-16 w-16 mx-auto mb-3">
                                                    {member.photo ? (
                                                        <AvatarImage src={`/storage/${member.photo}`} alt={member.name} />
                                                    ) : null}
                                                    <AvatarFallback className="bg-amber-100 text-amber-700">
                                                        {getInitials(member.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <h4 className="font-semibold text-sm">{member.name}</h4>
                                                <Badge variant="secondary" className="mt-1 text-xs">
                                                    {member.designation}
                                                </Badge>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Parent Representatives */}
            {parentMembers.length > 0 && (
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <Badge className="mb-4 bg-amber-100 text-amber-800">PTA</Badge>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                Parent Representatives
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                Parent-Teacher Association members who bridge the gap between school and home
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                            {parentMembers.map((member) => (
                                <Card key={member.id} className="text-center p-4">
                                    <Avatar className="h-16 w-16 mx-auto mb-3">
                                        {member.photo ? (
                                            <AvatarImage src={`/storage/${member.photo}`} alt={member.name} />
                                        ) : null}
                                        <AvatarFallback className="bg-blue-100 text-blue-700">
                                            {getInitials(member.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <h4 className="font-semibold text-sm">{member.name}</h4>
                                    <Badge variant="secondary" className="mt-1 text-xs">
                                        {member.designation}
                                    </Badge>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Governance Info */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <Badge className="mb-4 bg-amber-100 text-amber-800">Governance</Badge>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                School Governance Structure
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <Building className="h-10 w-10 text-amber-600 mb-2" />
                                    <CardTitle>AWES (Army Welfare Education Society)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        APS Alwar is sponsored by Army Welfare Education Society, New Delhi.
                                        AWES oversees all Army Public Schools across India, ensuring uniform
                                        standards of education and administration.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <Users className="h-10 w-10 text-amber-600 mb-2" />
                                    <CardTitle>School Managing Committee</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        The SMC is the local governing body responsible for day-to-day
                                        management, academic decisions, and ensuring the school meets
                                        CBSE and AWES standards.
                                    </p>
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
                        Connect With Us
                    </h2>
                    <p className="text-amber-100 mb-8 max-w-2xl mx-auto">
                        Have questions or want to learn more about our school? We're here to help.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button size="lg" variant="secondary" asChild>
                            <Link href="/contact">
                                Contact Us
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                            <Link href="/about/principal-message">
                                Principal's Message
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
