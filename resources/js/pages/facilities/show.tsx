import PublicLayout from '@/layouts/public-layout';
import { Link } from '@inertiajs/react';
import { 
    Building2,
    FlaskConical,
    BookOpen,
    Dumbbell,
    Trees,
    DoorOpen,
    Presentation,
    Monitor,
    ChevronLeft,
    ChevronRight,
    Video,
    Check,
    ExternalLink,
    MapPin,
    ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    equipment: string[];
    has_virtual_tour: boolean;
    virtual_tour_url: string | null;
    location: string | null;
    capacity: string | null;
}

interface RelatedFacility {
    id: number;
    name: string;
    slug: string;
    category: string;
    image: string | null;
}

interface Props {
    facility: Facility;
    relatedFacilities: RelatedFacility[];
}

const categoryIcons: Record<string, React.ElementType> = {
    lab: FlaskConical,
    classroom: Monitor,
    library: BookOpen,
    sports: Dumbbell,
    playground: Trees,
    special_room: DoorOpen,
    auditorium: Presentation,
    other: Building2,
};

const categoryLabels: Record<string, string> = {
    lab: 'Laboratory',
    classroom: 'Classroom',
    library: 'Library',
    sports: 'Sports Facility',
    playground: 'Playground',
    special_room: 'Special Room',
    auditorium: 'Auditorium',
    other: 'Other',
};

export default function FacilityShow({ facility, relatedFacilities }: Props) {
    const [activeImage, setActiveImage] = useState(0);
    const Icon = categoryIcons[facility.category] || Building2;

    const allImages = facility.image 
        ? [facility.image, ...facility.gallery] 
        : facility.gallery;

    const nextImage = () => {
        setActiveImage((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = () => {
        setActiveImage((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    return (
        <PublicLayout title={`${facility.name} - Facilities - APS Alwar`}>
            {/* Breadcrumb */}
            <section className="bg-gray-50 dark:bg-gray-900 py-4 border-b dark:border-gray-800">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-gray-500 hover:text-amber-600">Home</Link>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                        <Link href="/facilities" className="text-gray-500 hover:text-amber-600">Facilities</Link>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900 dark:text-white font-medium">{facility.name}</span>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Gallery */}
                        <div>
                            {/* Main Image */}
                            <div className="relative aspect-video bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/10 rounded-xl overflow-hidden mb-4">
                                {allImages.length > 0 ? (
                                    <img
                                        src={`/storage/${allImages[activeImage]}`}
                                        alt={facility.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Icon className="h-24 w-24 text-amber-400" />
                                    </div>
                                )}
                                
                                {/* Navigation arrows */}
                                {allImages.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    </>
                                )}

                                {/* Badges */}
                                {facility.has_virtual_tour && (
                                    <Badge className="absolute top-3 left-3 bg-blue-600">
                                        <Video className="h-3 w-3 mr-1" />
                                        360° Virtual Tour Available
                                    </Badge>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {allImages.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {allImages.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveImage(index)}
                                            className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition ${
                                                activeImage === index 
                                                    ? 'border-amber-600' 
                                                    : 'border-transparent hover:border-amber-300'
                                            }`}
                                        >
                                            <img
                                                src={`/storage/${img}`}
                                                alt={`${facility.name} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div>
                            <Badge className="mb-4 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                                <Icon className="h-3 w-3 mr-1" />
                                {categoryLabels[facility.category] || facility.category}
                            </Badge>
                            
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                {facility.name}
                            </h1>

                            <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
                                {facility.description}
                            </p>

                            {/* Quick Info */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                {facility.location && (
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                        <MapPin className="h-4 w-4 text-amber-600" />
                                        <span>{facility.location}</span>
                                    </div>
                                )}
                                {facility.capacity && (
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                        <Building2 className="h-4 w-4 text-amber-600" />
                                        <span>Capacity: {facility.capacity}</span>
                                    </div>
                                )}
                            </div>

                            {/* Features */}
                            {facility.features && facility.features.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                        Key Features
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {facility.features.map((feature, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                                    <Check className="h-3 w-3 text-green-600" />
                                                </div>
                                                <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Equipment */}
                            {facility.equipment && facility.equipment.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                        Equipment Available
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {facility.equipment.map((item, index) => (
                                            <Badge 
                                                key={index}
                                                variant="secondary"
                                                className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                                            >
                                                {item}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-wrap gap-4">
                                {facility.has_virtual_tour && facility.virtual_tour_url && (
                                    <Button className="bg-amber-600 hover:bg-amber-700" asChild>
                                        <a 
                                            href={facility.virtual_tour_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Video className="mr-2 h-4 w-4" />
                                            Take Virtual Tour
                                            <ExternalLink className="ml-2 h-4 w-4" />
                                        </a>
                                    </Button>
                                )}
                                <Button variant="outline" asChild>
                                    <Link href="/contact">
                                        Schedule a Visit
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Virtual Tour Embed */}
            {facility.has_virtual_tour && facility.virtual_tour_url && (
                <section className="py-12 bg-gray-50 dark:bg-gray-900">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-8">
                            <Badge className="mb-4 bg-blue-100 text-blue-800">360° Experience</Badge>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Virtual Tour
                            </h2>
                        </div>
                        <div className="max-w-4xl mx-auto">
                            <div className="aspect-video rounded-xl overflow-hidden border shadow-lg">
                                <iframe
                                    src={facility.virtual_tour_url}
                                    className="w-full h-full"
                                    allowFullScreen
                                    title={`${facility.name} Virtual Tour`}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Related Facilities */}
            {relatedFacilities.length > 0 && (
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <Badge className="mb-2 bg-amber-100 text-amber-800">Related</Badge>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Similar Facilities
                                </h2>
                            </div>
                            <Button variant="outline" asChild>
                                <Link href="/facilities">
                                    View All Facilities
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedFacilities.map((related) => {
                                const RelatedIcon = categoryIcons[related.category] || Building2;
                                return (
                                    <Card key={related.id} className="group overflow-hidden hover:shadow-lg transition-all">
                                        <div className="aspect-video bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/10">
                                            {related.image ? (
                                                <img
                                                    src={`/storage/${related.image}`}
                                                    alt={related.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <RelatedIcon className="h-12 w-12 text-amber-400" />
                                                </div>
                                            )}
                                        </div>
                                        <CardHeader className="pb-4">
                                            <CardTitle className="text-lg group-hover:text-amber-600 transition-colors">
                                                <Link href={`/facilities/${related.slug}`}>
                                                    {related.name}
                                                </Link>
                                            </CardTitle>
                                        </CardHeader>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Back Link */}
            <section className="pb-16">
                <div className="container mx-auto px-4">
                    <Button variant="ghost" asChild>
                        <Link href="/facilities">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to All Facilities
                        </Link>
                    </Button>
                </div>
            </section>
        </PublicLayout>
    );
}
