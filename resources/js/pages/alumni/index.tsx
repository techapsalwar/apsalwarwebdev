import PublicLayout from '@/layouts/public-layout';
import { Link, router } from '@inertiajs/react';
import { 
    Users,
    GraduationCap,
    Shield,
    Building2,
    Search,
    Filter,
    Star,
    MapPin,
    Briefcase,
    ExternalLink,
    UserPlus,
    ChevronRight,
    Linkedin,
    Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

interface Alumni {
    id: number;
    name: string;
    slug: string;
    batch_year: string;
    photo: string | null;
    photo_url: string | null;
    current_designation: string | null;
    organization: string | null;
    location: string | null;
    category: string;
    category_label: string;
    achievement: string | null;
    is_featured: boolean;
    linkedin_url: string | null;
    linkedin_link: string | null;
}

interface PaginatedAlumni {
    data: Alumni[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    alumni: PaginatedAlumni;
    featuredAlumni: Alumni[];
    batchYears: string[];
    categories: Record<string, string>;
    categoryStats: Record<string, number>;
    filters: {
        category: string | null;
        batch: string | null;
        search: string | null;
    };
    stats: {
        total: number;
        defense: number;
        civil_services: number;
        batches: number;
    };
}

const categoryIcons: Record<string, React.ElementType> = {
    defense: Shield,
    civil_services: Building2,
    medical: GraduationCap,
    engineering: Building2,
    business: Briefcase,
    arts: Star,
    sports: Award,
    education: GraduationCap,
    other: Users,
};

export default function AlumniIndex({ 
    alumni, 
    featuredAlumni, 
    batchYears, 
    categories,
    categoryStats,
    filters,
    stats 
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || 'all');
    const [selectedBatch, setSelectedBatch] = useState(filters.batch || 'all');

    const handleFilter = () => {
        router.get('/alumni', {
            search: search || undefined,
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            batch: selectedBatch !== 'all' ? selectedBatch : undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilter();
    };

    return (
        <PublicLayout title="Alumni Network - APS Alwar">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-950 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="mb-4 bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
                            <GraduationCap className="h-3 w-3 mr-1" />
                            Alumni Network
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Our Proud Alumni
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                            Celebrating the achievements of APS Alwar alumni who have made their mark 
                            in various fields across the globe.
                        </p>
                        <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700" asChild>
                            <Link href="/alumni/register">
                                <UserPlus className="h-5 w-5 mr-2" />
                                Join Alumni Network
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-white dark:bg-gray-950 border-b">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-emerald-600">{stats.total}+</div>
                            <div className="text-gray-600 dark:text-gray-400 text-sm">Registered Alumni</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-blue-600">{stats.defense}+</div>
                            <div className="text-gray-600 dark:text-gray-400 text-sm">In Defense</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-amber-600">{stats.civil_services}+</div>
                            <div className="text-gray-600 dark:text-gray-400 text-sm">In Civil Services</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-purple-600">{stats.batches}+</div>
                            <div className="text-gray-600 dark:text-gray-400 text-sm">Batch Years</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Alumni */}
            {featuredAlumni.length > 0 && (
                <section className="py-16 bg-gray-50 dark:bg-gray-900">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <Badge className="mb-4 bg-amber-100 text-amber-800">
                                <Star className="h-3 w-3 mr-1" />
                                Featured
                            </Badge>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Notable Alumni
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                            {featuredAlumni.map((alumnus) => (
                                <Link key={alumnus.id} href={`/alumni/${alumnus.slug}`}>
                                    <Card className="h-full hover:shadow-lg transition-all group border-amber-200 bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/10 dark:to-gray-900">
                                        <CardContent className="p-6 text-center">
                                            <div className="relative inline-block mb-4">
                                                {alumnus.photo_url ? (
                                                    <img 
                                                        src={alumnus.photo_url} 
                                                        alt={alumnus.name}
                                                        className="w-24 h-24 rounded-full object-cover border-4 border-amber-200"
                                                    />
                                                ) : (
                                                    <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center border-4 border-amber-200">
                                                        <span className="text-2xl font-bold text-amber-600">
                                                            {alumnus.name.charAt(0)}
                                                        </span>
                                                    </div>
                                                )}
                                                <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-500">
                                                    <Star className="h-3 w-3" />
                                                </Badge>
                                            </div>
                                            <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-amber-600 transition-colors">
                                                {alumnus.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Batch of {alumnus.batch_year}
                                            </p>
                                            {alumnus.current_designation && (
                                                <p className="text-sm font-medium text-amber-700 dark:text-amber-400 mt-2">
                                                    {alumnus.current_designation}
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

            {/* Search & Filter Section */}
            <section className="py-8 bg-white dark:bg-gray-950 border-b sticky top-0 z-10">
                <div className="container mx-auto px-4">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search by name, organization..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={selectedCategory} onValueChange={(value) => { setSelectedCategory(value); }}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {Object.entries(categories).map(([key, label]) => (
                                    <SelectItem key={key} value={key}>
                                        {label} {categoryStats[key] ? `(${categoryStats[key]})` : ''}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={selectedBatch} onValueChange={(value) => { setSelectedBatch(value); }}>
                            <SelectTrigger className="w-full md:w-40">
                                <SelectValue placeholder="All Batches" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Batches</SelectItem>
                                {batchYears.map((year) => (
                                    <SelectItem key={year} value={year}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                        </Button>
                    </form>
                </div>
            </section>

            {/* Alumni Grid */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    {alumni.data.length > 0 ? (
                        <>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {alumni.data.map((alumnus) => {
                                    const CategoryIcon = categoryIcons[alumnus.category] || Users;
                                    return (
                                        <Link key={alumnus.id} href={`/alumni/${alumnus.slug}`}>
                                            <Card className="h-full hover:shadow-lg transition-all group">
                                                <CardContent className="p-6">
                                                    <div className="flex items-start gap-4">
                                                        {alumnus.photo_url ? (
                                                            <img 
                                                                src={alumnus.photo_url} 
                                                                alt={alumnus.name}
                                                                className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                                                            />
                                                        ) : (
                                                            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                                                <span className="text-xl font-bold text-emerald-600">
                                                                    {alumnus.name.charAt(0)}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors truncate">
                                                                {alumnus.name}
                                                            </h3>
                                                            <p className="text-sm text-emerald-600 font-medium">
                                                                Batch {alumnus.batch_year}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {(alumnus.current_designation || alumnus.organization) && (
                                                        <div className="mt-4 pt-4 border-t">
                                                            {alumnus.current_designation && (
                                                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                                    <Briefcase className="h-4 w-4" />
                                                                    <span className="truncate">{alumnus.current_designation}</span>
                                                                </div>
                                                            )}
                                                            {alumnus.organization && (
                                                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                                    <Building2 className="h-4 w-4" />
                                                                    <span className="truncate">{alumnus.organization}</span>
                                                                </div>
                                                            )}
                                                            {alumnus.location && (
                                                                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                                    <MapPin className="h-4 w-4" />
                                                                    <span className="truncate">{alumnus.location}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    <div className="mt-4 flex items-center justify-between">
                                                        <Badge variant="outline" className="text-xs">
                                                            <CategoryIcon className="h-3 w-3 mr-1" />
                                                            {alumnus.category_label}
                                                        </Badge>
                                                        {alumnus.linkedin_link && (
                                                            <Linkedin className="h-4 w-4 text-blue-600" />
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Pagination */}
                            {alumni.last_page > 1 && (
                                <div className="mt-12 flex justify-center gap-2">
                                    {alumni.links.map((link, index) => (
                                        <Button
                                            key={index}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url)}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-16">
                            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                No Alumni Found
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                {filters.search || filters.category || filters.batch 
                                    ? "Try adjusting your search filters"
                                    : "Be the first to register!"}
                            </p>
                            <Button asChild>
                                <Link href="/alumni/register">
                                    Register Now
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-700">
                <div className="container mx-auto px-4 text-center">
                    <GraduationCap className="h-12 w-12 text-white mx-auto mb-4 opacity-90" />
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Are You an APS Alwar Alumni?
                    </h2>
                    <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
                        Join our growing alumni network! Share your journey, connect with old friends, 
                        and inspire the next generation of students.
                    </p>
                    <Button size="lg" variant="secondary" asChild>
                        <Link href="/alumni/register">
                            <UserPlus className="mr-2 h-5 w-5" />
                            Register as Alumni
                            <ChevronRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </section>
        </PublicLayout>
    );
}
