import PublicLayout from '@/layouts/public-layout';
import { Link, router } from '@inertiajs/react';
import { 
    Building2,
    FlaskConical,
    BookOpen,
    Dumbbell,
    Trees,
    DoorOpen,
    Presentation,
    Video,
    Image,
    MapPin,
    Monitor,
    ChevronRight,
    Search,
    ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface Facility {
    id: number;
    name: string;
    slug: string;
    description: string;
    category: string;
    image: string | null;
    gallery: string[];
    features: string[];
    has_virtual_tour: boolean;
    virtual_tour_url: string | null;
}

interface Category {
    value: string;
    label: string;
    count: number;
}

interface Props {
    facilities: Facility[];
    categories: Category[];
    selectedCategory: string;
    campusInfo: {
        area: string;
        totalFacilities: number;
        smartClassrooms: number;
        labs: number;
    };
}

const categoryIcons: Record<string, React.ElementType> = {
    all: Building2,
    lab: FlaskConical,
    classroom: Monitor,
    library: BookOpen,
    sports: Dumbbell,
    playground: Trees,
    special_room: DoorOpen,
    auditorium: Presentation,
    other: Building2,
};

const categoryColors: Record<string, string> = {
    lab: 'bg-blue-100 text-blue-800 border-blue-200',
    classroom: 'bg-green-100 text-green-800 border-green-200',
    library: 'bg-amber-100 text-amber-800 border-amber-200',
    sports: 'bg-red-100 text-red-800 border-red-200',
    playground: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    special_room: 'bg-purple-100 text-purple-800 border-purple-200',
    auditorium: 'bg-pink-100 text-pink-800 border-pink-200',
    other: 'bg-gray-100 text-gray-800 border-gray-200',
};

export default function Facilities({ facilities, categories, selectedCategory, campusInfo }: Props) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredFacilities = facilities.filter(f => 
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCategoryChange = (category: string) => {
        router.get('/facilities', { category }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <PublicLayout title="Facilities - APS Alwar">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-gray-950 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="mb-4 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                            World-Class Infrastructure
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Our Facilities
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            State-of-the-art infrastructure spread across {campusInfo.area} of serene campus
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Banner */}
            <section className="py-8 bg-amber-600 dark:bg-amber-800">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="text-white">
                            <MapPin className="h-8 w-8 mx-auto mb-2 opacity-90" />
                            <div className="text-2xl font-bold">{campusInfo.area}</div>
                            <div className="text-amber-100 text-sm">Campus Area</div>
                        </div>
                        <div className="text-white">
                            <Building2 className="h-8 w-8 mx-auto mb-2 opacity-90" />
                            <div className="text-2xl font-bold">{campusInfo.totalFacilities}</div>
                            <div className="text-amber-100 text-sm">Total Facilities</div>
                        </div>
                        <div className="text-white">
                            <Monitor className="h-8 w-8 mx-auto mb-2 opacity-90" />
                            <div className="text-2xl font-bold">{campusInfo.smartClassrooms}</div>
                            <div className="text-amber-100 text-sm">Smart Classrooms</div>
                        </div>
                        <div className="text-white">
                            <FlaskConical className="h-8 w-8 mx-auto mb-2 opacity-90" />
                            <div className="text-2xl font-bold">{campusInfo.labs}</div>
                            <div className="text-amber-100 text-sm">Laboratories</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Search and Filter */}
            <section className="py-8 border-b dark:border-gray-800">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search facilities..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {categories.map(category => {
                                const Icon = categoryIcons[category.value] || Building2;
                                return (
                                    <Button
                                        key={category.value}
                                        variant={selectedCategory === category.value ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => handleCategoryChange(category.value)}
                                        className={selectedCategory === category.value ? 'bg-amber-600 hover:bg-amber-700' : ''}
                                    >
                                        <Icon className="h-4 w-4 mr-1" />
                                        {category.label}
                                        <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                                            {category.count}
                                        </Badge>
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Facilities Grid */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    {filteredFacilities.length === 0 ? (
                        <div className="text-center py-12">
                            <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                No facilities found
                            </h3>
                            <p className="text-gray-500">
                                Try adjusting your search or filter criteria
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredFacilities.map(facility => {
                                const Icon = categoryIcons[facility.category] || Building2;
                                const colorClass = categoryColors[facility.category] || categoryColors.other;
                                return (
                                    <Card key={facility.id} className="group overflow-hidden hover:shadow-xl transition-all">
                                        {/* Image */}
                                        <div className="relative aspect-video bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/10">
                                            {facility.image ? (
                                                <img
                                                    src={`/storage/${facility.image}`}
                                                    alt={facility.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Icon className="h-16 w-16 text-amber-400" />
                                                </div>
                                            )}
                                            {/* Badges */}
                                            <div className="absolute top-3 left-3 flex gap-2">
                                                {facility.has_virtual_tour && (
                                                    <Badge className="bg-blue-600">
                                                        <Video className="h-3 w-3 mr-1" />
                                                        360° Tour
                                                    </Badge>
                                                )}
                                                {facility.gallery.length > 0 && (
                                                    <Badge variant="secondary" className="bg-white/90">
                                                        <Image className="h-3 w-3 mr-1" />
                                                        {facility.gallery.length}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <CardHeader className="pb-2">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <CardTitle className="text-lg group-hover:text-amber-600 transition-colors">
                                                        {facility.name}
                                                    </CardTitle>
                                                    <Badge variant="outline" className={`mt-2 ${colorClass}`}>
                                                        <Icon className="h-3 w-3 mr-1" />
                                                        {categories.find(c => c.value === facility.category)?.label || facility.category}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <CardDescription className="line-clamp-2 mb-4">
                                                {facility.description}
                                            </CardDescription>
                                            {/* Features */}
                                            {facility.features && facility.features.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mb-4">
                                                    {facility.features.slice(0, 3).map((feature, idx) => (
                                                        <Badge key={idx} variant="secondary" className="text-xs">
                                                            {feature}
                                                        </Badge>
                                                    ))}
                                                    {facility.features.length > 3 && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            +{facility.features.length - 3} more
                                                        </Badge>
                                                    )}
                                                </div>
                                            )}
                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" className="flex-1" asChild>
                                                    <Link href={`/facilities/${facility.slug}`}>
                                                        View Details
                                                        <ChevronRight className="ml-1 h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                {facility.has_virtual_tour && facility.virtual_tour_url && (
                                                    <Button size="sm" variant="outline" asChild>
                                                        <a 
                                                            href={facility.virtual_tour_url} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                        >
                                                            <ExternalLink className="h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Highlights */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-amber-100 text-amber-800">Campus Highlights</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Why Our Campus Stands Out
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {[
                            {
                                title: 'Green & Pollution-Free',
                                description: 'Beautiful campus with lush greenery, botanical garden, and fresh air',
                            },
                            {
                                title: 'Technology-Enabled',
                                description: '38 smart classrooms with interactive panels and digital learning',
                            },
                            {
                                title: 'Safety First',
                                description: '75 CCTV cameras, 24/7 surveillance, and trained security personnel',
                            },
                            {
                                title: 'Sports Excellence',
                                description: 'Multiple sports grounds for football, cricket, basketball, and more',
                            },
                            {
                                title: 'Modern Laboratories',
                                description: 'State-of-the-art labs for Physics, Chemistry, Biology, Computer, and Robotics',
                            },
                            {
                                title: 'Rich Library',
                                description: '6,813+ books, journals, magazines with E-Library access',
                            },
                        ].map((item, index) => (
                            <Card key={index}>
                                <CardHeader>
                                    <CardTitle className="text-lg">{item.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>{item.description}</CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-amber-600 to-amber-700">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Experience Our Campus
                    </h2>
                    <p className="text-amber-100 mb-8 max-w-2xl mx-auto">
                        Visit APS Alwar to experience our world-class facilities firsthand.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button size="lg" variant="secondary" asChild>
                            <Link href="/contact">
                                Schedule a Visit
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                            <Link href="/admissions">
                                Apply for Admission
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
