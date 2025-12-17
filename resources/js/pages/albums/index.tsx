import PublicLayout from '@/layouts/public-layout';
import { Head, Link } from '@inertiajs/react';
import { Images, Calendar, Folder, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';

interface Photo {
    id: number;
    filename: string;
    path: string;
    thumbnail_path?: string;
    caption?: string;
}

interface Album {
    id: number;
    title: string;
    slug: string;
    description?: string;
    cover_image?: string;
    year?: number;
    month?: number;
    photos: Photo[];
    photos_count: number;
}

interface Props {
    albums: Album[];
}

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default function AlbumsIndex({ albums }: Props) {
    const [hoveredAlbum, setHoveredAlbum] = useState<number | null>(null);

    const getCoverImage = (album: Album): string => {
        if (album.cover_image) {
            return `/storage/${album.cover_image}`;
        }
        if (album.photos && album.photos.length > 0) {
            const firstPhoto = album.photos[0];
            return `/storage/${firstPhoto.thumbnail_path || firstPhoto.path}`;
        }
        return 'https://via.placeholder.com/400x300?text=No+Image';
    };

    const formatDate = (year?: number, month?: number): string => {
        if (!year) return 'No Date';
        if (!month) return year.toString();
        return `${MONTHS[month - 1]} ${year}`;
    };

    return (
        <PublicLayout title="Photo Albums" description="Explore our school's photo albums and memorable moments">
            <Head title="Photo Albums" />

            {/* Hero Section */}
            <section className="bg-gradient-to-b from-primary/10 to-white py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                            <Images className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Photo Albums</h1>
                        <p className="text-gray-600 text-lg">
                            Explore memorable moments from our school's events, celebrations, and student life
                        </p>
                    </div>
                </div>
            </section>

            {/* Albums Grid Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    {albums.length === 0 ? (
                        <div className="text-center py-12">
                            <Folder className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Albums Yet</h2>
                            <p className="text-gray-600">
                                Photo albums will be added soon. Please check back later.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {albums.map((album) => (
                                <Link key={album.id} href={`/albums/${album.slug}`}>
                                    <Card 
                                        className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                                        onMouseEnter={() => setHoveredAlbum(album.id)}
                                        onMouseLeave={() => setHoveredAlbum(null)}
                                    >
                                        {/* Cover Image */}
                                        <div className="relative overflow-hidden bg-gray-200 h-64">
                                            <img
                                                src={getCoverImage(album)}
                                                alt={album.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                                {hoveredAlbum === album.id && (
                                                    <div className="bg-primary/90 text-white px-4 py-2 rounded-full flex items-center gap-2 animate-in fade-in zoom-in">
                                                        <span>View Album</span>
                                                        <ArrowRight className="h-4 w-4" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Photo Count Badge */}
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-2">
                                                <Images className="h-4 w-4 text-primary" />
                                                <span className="text-sm font-medium">{album.photos_count}</span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <CardContent className="p-6">
                                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                                {album.title}
                                            </h3>

                                            {album.description && (
                                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                    {album.description}
                                                </p>
                                            )}

                                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                                <Calendar className="h-4 w-4" />
                                                <span>{formatDate(album.year, album.month)}</span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-primary">
                                                    {album.photos_count} {album.photos_count === 1 ? 'Photo' : 'Photos'}
                                                </span>
                                                <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            {albums.length > 0 && (
                <section className="bg-gradient-to-r from-primary/5 to-primary/10 py-12">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-2xl font-bold mb-4">Share Your Moments</h2>
                        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                            Have photos from a school event? Contact our administration to add them to our photo gallery.
                        </p>
                        <Button asChild variant="default" size="lg">
                            <Link href="/contact">
                                Get In Touch
                            </Link>
                        </Button>
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
