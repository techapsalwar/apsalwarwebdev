import PublicLayout from '@/layouts/public-layout';
import { Head, Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, X, Calendar, Images as ImagesIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

interface Photo {
    id: number;
    filename: string;
    path: string;
    thumbnail_path?: string;
    alt_text?: string;
    caption?: string;
    width?: number;
    height?: number;
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
}

interface Props {
    album: Album;
}

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default function AlbumShow({ album }: Props) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    const formatDate = (year?: number, month?: number): string => {
        if (!year) return 'No Date';
        if (!month) return year.toString();
        return `${MONTHS[month - 1]} ${year}`;
    };

    const openLightbox = (index: number) => {
        setCurrentPhotoIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const nextPhoto = () => {
        setCurrentPhotoIndex((prev) =>
            prev === album.photos.length - 1 ? 0 : prev + 1
        );
    };

    const prevPhoto = () => {
        setCurrentPhotoIndex((prev) =>
            prev === 0 ? album.photos.length - 1 : prev - 1
        );
    };

    const currentPhoto = album.photos[currentPhotoIndex];

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (!lightboxOpen) return;
            if (e.key === 'ArrowRight') nextPhoto();
            if (e.key === 'ArrowLeft') prevPhoto();
            if (e.key === 'Escape') closeLightbox();
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [lightboxOpen, album.photos.length]);

    const getImageUrl = (photo: Photo): string => {
        return `/storage/${photo.path}`;
    };

    const getThumbnailUrl = (photo: Photo): string => {
        return `/storage/${photo.thumbnail_path || photo.path}`;
    };

    return (
        <PublicLayout title={album.title} description={album.description || ''}>
            <Head title={album.title} />

            {/* Back Navigation */}
            <div className="bg-gray-50 border-b">
                <div className="container mx-auto px-4 py-4">
                    <Link href="/albums">
                        <Button variant="ghost" className="gap-2">
                            <ChevronLeft className="h-4 w-4" />
                            Back to Albums
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Album Header */}
            <section className="bg-gradient-to-b from-primary/5 to-white py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            {album.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 mb-6">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="h-5 w-5" />
                                <span>{formatDate(album.year, album.month)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <ImagesIcon className="h-5 w-5" />
                                <span>{album.photos.length} {album.photos.length === 1 ? 'Photo' : 'Photos'}</span>
                            </div>
                        </div>

                        {album.description && (
                            <p className="text-lg text-gray-700 leading-relaxed max-w-2xl">
                                {album.description}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Photos Gallery */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    {album.photos.length === 0 ? (
                        <div className="text-center py-12">
                            <ImagesIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Photos Yet</h2>
                            <p className="text-gray-600">
                                Photos will be added to this album soon.
                            </p>
                        </div>
                    ) : (
                        <div className="max-w-6xl mx-auto">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {album.photos.map((photo, index) => (
                                    <div
                                        key={photo.id}
                                        className="group relative overflow-hidden rounded-lg cursor-pointer bg-gray-100 h-64"
                                        onClick={() => openLightbox(index)}
                                    >
                                        <img
                                            src={getThumbnailUrl(photo)}
                                            alt={photo.alt_text || photo.filename}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                                            <ChevronRight className="h-8 w-8 text-white/0 group-hover:text-white transition-all duration-300 transform group-hover:scale-125" />
                                        </div>
                                        {photo.caption && (
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <p className="text-sm line-clamp-2">{photo.caption}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Lightbox Modal */}
            {lightboxOpen && currentPhoto && (
                <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 text-white hover:bg-white/10 p-2 rounded-full transition-colors z-10"
                        aria-label="Close lightbox"
                    >
                        <X className="h-8 w-8" />
                    </button>

                    {/* Main Image */}
                    <div className="absolute inset-4 md:inset-16 flex items-center justify-center">
                        <img
                            src={getImageUrl(currentPhoto)}
                            alt={currentPhoto.alt_text || currentPhoto.filename}
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>

                    {/* Navigation Buttons */}
                    {album.photos.length > 1 && (
                        <>
                            <button
                                onClick={prevPhoto}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 p-3 rounded-full transition-colors"
                                aria-label="Previous photo"
                            >
                                <ChevronLeft className="h-8 w-8" />
                            </button>
                            <button
                                onClick={nextPhoto}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 p-3 rounded-full transition-colors"
                                aria-label="Next photo"
                            >
                                <ChevronRight className="h-8 w-8" />
                            </button>
                        </>
                    )}

                    {/* Photo Information */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                        <div className="max-w-4xl mx-auto">
                            {currentPhoto.caption && (
                                <p className="text-white text-lg mb-3">
                                    {currentPhoto.caption}
                                </p>
                            )}
                            <div className="flex items-center justify-between text-white/70 text-sm">
                                <span>
                                    {currentPhotoIndex + 1} / {album.photos.length}
                                </span>
                                {currentPhoto.filename && (
                                    <span>{currentPhoto.filename}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Thumbnail Strip */}
                    {album.photos.length > 1 && (
                        <div className="absolute bottom-32 md:bottom-40 left-0 right-0 px-4 md:px-16">
                            <div className="flex gap-2 justify-center overflow-x-auto max-w-4xl mx-auto">
                                {album.photos.map((photo, index) => (
                                    <button
                                        key={photo.id}
                                        onClick={() => setCurrentPhotoIndex(index)}
                                        className={`flex-shrink-0 w-16 h-16 rounded border-2 transition-all ${
                                            index === currentPhotoIndex
                                                ? 'border-white'
                                                : 'border-white/30 hover:border-white/60'
                                        }`}
                                    >
                                        <img
                                            src={getThumbnailUrl(photo)}
                                            alt={photo.alt_text || photo.filename}
                                            className="w-full h-full object-cover rounded"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Keyboard Instructions */}
                    <div className="absolute top-4 left-4 text-white/50 text-sm hidden md:block">
                        <p>← → Arrow keys to navigate</p>
                        <p>ESC to close</p>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
