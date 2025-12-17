import PublicLayout from '@/layouts/public-layout';
import { Link } from '@inertiajs/react';
import { 
    GraduationCap,
    MapPin,
    Briefcase,
    Building2,
    Calendar,
    Linkedin,
    ChevronRight,
    Star,
    Quote,
    Users,
    ArrowLeft,
    Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Alumni {
    id: number;
    name: string;
    slug: string;
    batch_year: string;
    class_section: string | null;
    house: string | null;
    photo: string | null;
    photo_url: string | null;
    current_designation: string | null;
    organization: string | null;
    location: string | null;
    category: string;
    category_label: string;
    achievement: string | null;
    story: string | null;
    school_memories: string | null;
    message_to_juniors: string | null;
    linkedin_url: string | null;
    linkedin_link: string | null;
    is_featured: boolean;
    years_ago: number;
}

interface Props {
    alumnus: Alumni;
    relatedAlumni: Alumni[];
    categories: Record<string, string>;
}

const houseColors: Record<string, { bg: string; text: string; border: string }> = {
    prithviraj: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
    shivaji: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
    ashoka: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
    ranjit: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' },
};

export default function AlumniShow({ alumnus, relatedAlumni, categories }: Props) {
    const houseStyle = alumnus.house ? houseColors[alumnus.house] : null;

    return (
        <PublicLayout title={`${alumnus.name} - Alumni - APS Alwar`}>
            {/* Back Navigation */}
            <div className="bg-gray-50 dark:bg-gray-900 py-4 border-b">
                <div className="container mx-auto px-4">
                    <Button variant="ghost" asChild>
                        <Link href="/alumni">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Alumni Directory
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Profile Header */}
            <section className="bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-950 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                            {/* Photo */}
                            <div className="relative">
                                {alumnus.photo_url ? (
                                    <img 
                                        src={alumnus.photo_url} 
                                        alt={alumnus.name}
                                        className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
                                    />
                                ) : (
                                    <div className="w-40 h-40 rounded-full bg-emerald-100 flex items-center justify-center border-4 border-white shadow-lg">
                                        <span className="text-5xl font-bold text-emerald-600">
                                            {alumnus.name.charAt(0)}
                                        </span>
                                    </div>
                                )}
                                {alumnus.is_featured && (
                                    <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-500">
                                        <Star className="h-3 w-3 mr-1" />
                                        Featured
                                    </Badge>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                    {alumnus.name}
                                </h1>
                                
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                                    <Badge className="bg-emerald-100 text-emerald-800">
                                        <GraduationCap className="h-3 w-3 mr-1" />
                                        Batch of {alumnus.batch_year}
                                    </Badge>
                                    <Badge variant="outline">
                                        {alumnus.category_label}
                                    </Badge>
                                    {houseStyle && alumnus.house && (
                                        <Badge className={`${houseStyle.bg} ${houseStyle.text} ${houseStyle.border}`}>
                                            {alumnus.house.charAt(0).toUpperCase() + alumnus.house.slice(1)} House
                                        </Badge>
                                    )}
                                </div>

                                {(alumnus.current_designation || alumnus.organization) && (
                                    <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4 text-gray-600 dark:text-gray-400 mb-4">
                                        {alumnus.current_designation && (
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="h-4 w-4" />
                                                <span>{alumnus.current_designation}</span>
                                            </div>
                                        )}
                                        {alumnus.organization && (
                                            <div className="flex items-center gap-2">
                                                <Building2 className="h-4 w-4" />
                                                <span>{alumnus.organization}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {alumnus.location && (
                                    <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 mb-4">
                                        <MapPin className="h-4 w-4" />
                                        <span>{alumnus.location}</span>
                                    </div>
                                )}

                                {alumnus.linkedin_link && (
                                    <Button asChild className="bg-blue-600 hover:bg-blue-700">
                                        <a href={alumnus.linkedin_link} target="_blank" rel="noopener noreferrer">
                                            <Linkedin className="h-4 w-4 mr-2" />
                                            Connect on LinkedIn
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Sections */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto space-y-8">
                        {/* Achievement */}
                        {alumnus.achievement && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Award className="h-5 w-5 text-amber-600" />
                                        Achievements
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                                        {alumnus.achievement}
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Story */}
                        {alumnus.story && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <GraduationCap className="h-5 w-5 text-emerald-600" />
                                        My Journey After APS Alwar
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                                        {alumnus.story}
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* School Memories */}
                        {alumnus.school_memories && (
                            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 border-emerald-200">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-emerald-600" />
                                        School Memories
                                    </CardTitle>
                                    <CardDescription>
                                        {alumnus.years_ago} years since passing out
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line italic">
                                        "{alumnus.school_memories}"
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Message to Juniors */}
                        {alumnus.message_to_juniors && (
                            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-amber-200">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Quote className="h-5 w-5 text-amber-600" />
                                        Message to Current Students
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <blockquote className="text-lg text-gray-700 dark:text-gray-300 italic border-l-4 border-amber-400 pl-4">
                                        "{alumnus.message_to_juniors}"
                                    </blockquote>
                                    <p className="text-right text-gray-500 mt-4">
                                        — {alumnus.name}, Batch of {alumnus.batch_year}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </section>

            {/* Related Alumni */}
            {relatedAlumni.length > 0 && (
                <section className="py-16 bg-gray-50 dark:bg-gray-900">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                More Alumni You Might Know
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                From similar batch or field
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                            {relatedAlumni.map((related) => (
                                <Link key={related.id} href={`/alumni/${related.slug}`}>
                                    <Card className="h-full hover:shadow-lg transition-all group">
                                        <CardContent className="p-6 text-center">
                                            {related.photo_url ? (
                                                <img 
                                                    src={related.photo_url} 
                                                    alt={related.name}
                                                    className="w-16 h-16 rounded-full object-cover mx-auto mb-3"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                                                    <span className="text-xl font-bold text-emerald-600">
                                                        {related.name.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                                                {related.name}
                                            </h3>
                                            <p className="text-sm text-emerald-600">
                                                Batch {related.batch_year}
                                            </p>
                                            {related.current_designation && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {related.current_designation}
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-700">
                <div className="container mx-auto px-4 text-center">
                    <Users className="h-12 w-12 text-white mx-auto mb-4 opacity-90" />
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Are You an APS Alwar Alumni?
                    </h2>
                    <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
                        Join our growing alumni network and share your journey with the community!
                    </p>
                    <Button size="lg" variant="secondary" asChild>
                        <Link href="/alumni/register">
                            Register Now
                            <ChevronRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </section>
        </PublicLayout>
    );
}
