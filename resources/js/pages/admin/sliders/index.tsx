import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Plus, 
    Edit, 
    Trash2, 
    Eye, 
    EyeOff,
    GripVertical,
    Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { type BreadcrumbItem } from '@/types';
import { useState, useEffect } from 'react';

interface Slider {
    id: number;
    title: string;
    subtitle: string | null;
    image: string;
    text_position: 'left' | 'center' | 'right';
    is_active: boolean;
    order: number;
    start_date: string | null;
    end_date: string | null;
    created_at: string;
}

interface Props {
    sliders: {
        data: Slider[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

export default function SlidersIndex({ sliders }: Props) {
    const [localSliders, setLocalSliders] = useState<Slider[]>(sliders.data);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [reordering, setReordering] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Sliders', href: '/admin/sliders' },
    ];

    // Sync local state when props change
    useEffect(() => {
        setLocalSliders(sliders.data);
    }, [sliders.data]);

    const handleToggleActive = (slider: Slider) => {
        router.post(`/admin/sliders/${slider.id}/toggle-active`, {}, {
            preserveScroll: true,
        });
    };

    const handleDelete = (slider: Slider) => {
        router.delete(`/admin/sliders/${slider.id}`, {
            preserveScroll: true,
        });
    };

    const getImageUrl = (image: string) => {
        return image.startsWith('http') ? image : `/storage/${image}`;
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        
        if (draggedIndex === null || draggedIndex === index) return;

        const newSliders = [...localSliders];
        const draggedItem = newSliders[draggedIndex];
        
        newSliders.splice(draggedIndex, 1);
        newSliders.splice(index, 0, draggedItem);
        
        setLocalSliders(newSliders);
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        if (draggedIndex === null) return;

        // Update order values and send to server
        const updatedSliders = localSliders.map((slider, index) => ({
            id: slider.id,
            order: index + 1,
        }));

        router.post('/admin/sliders/reorder', {
            items: updatedSliders,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setReordering(false);
            },
        });

        setDraggedIndex(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Home Sliders" />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Home Sliders</h1>
                        <p className="text-gray-500">Manage homepage banner sliders</p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/sliders/create">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Slider
                        </Link>
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold">{sliders.total}</div>
                            <div className="text-sm text-gray-500">Total Sliders</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-green-600">
                                {sliders.data.filter(s => s.is_active).length}
                            </div>
                            <div className="text-sm text-gray-500">Active</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-gray-400">
                                {sliders.data.filter(s => !s.is_active).length}
                            </div>
                            <div className="text-sm text-gray-500">Inactive</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sliders List */}
                {sliders.data.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="font-semibold text-lg mb-2">No sliders yet</h3>
                            <p className="text-gray-500 mb-4">
                                Create your first homepage slider to get started
                            </p>
                            <Button asChild>
                                <Link href="/admin/sliders/create">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Slider
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {localSliders.map((slider, index) => (
                            <Card 
                                key={slider.id} 
                                className={`overflow-hidden transition-all ${
                                    draggedIndex === index ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
                                }`}
                                draggable
                                onDragStart={() => handleDragStart(index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragEnd={handleDragEnd}
                            >
                                <div className="flex">
                                    {/* Drag Handle */}
                                    <div className="flex items-center px-2 bg-gray-50 dark:bg-gray-800 border-r cursor-move">
                                        <GripVertical className="h-5 w-5 text-gray-400" />
                                    </div>

                                    {/* Image Preview */}
                                    <div className="w-48 h-32 flex-shrink-0 relative">
                                        <img 
                                            src={getImageUrl(slider.image)} 
                                            alt={slider.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-2 left-2">
                                            <Badge variant={slider.is_active ? 'default' : 'secondary'}>
                                                {slider.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-semibold text-lg">{slider.title}</h3>
                                                {slider.subtitle && (
                                                    <p className="text-gray-500 text-sm">{slider.subtitle}</p>
                                                )}
                                            </div>
                                            <Badge variant="outline">
                                                Order: {slider.order}
                                            </Badge>
                                        </div>

                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                            <span>Position: {slider.text_position}</span>
                                            {slider.start_date && (
                                                <span>From: {formatDate(slider.start_date)}</span>
                                            )}
                                            {slider.end_date && (
                                                <span>Until: {formatDate(slider.end_date)}</span>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 mt-4">
                                            <Button 
                                                size="sm" 
                                                variant="outline"
                                                onClick={() => handleToggleActive(slider)}
                                            >
                                                {slider.is_active ? (
                                                    <>
                                                        <EyeOff className="h-4 w-4 mr-1" />
                                                        Deactivate
                                                    </>
                                                ) : (
                                                    <>
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        Activate
                                                    </>
                                                )}
                                            </Button>
                                            <Button size="sm" variant="outline" asChild>
                                                <Link href={`/admin/sliders/${slider.id}/edit`}>
                                                    <Edit className="h-4 w-4 mr-1" />
                                                    Edit
                                                </Link>
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                                        <Trash2 className="h-4 w-4 mr-1" />
                                                        Delete
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete Slider?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This will permanently delete "{slider.title}". This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction 
                                                            onClick={() => handleDelete(slider)}
                                                            className="bg-red-600 hover:bg-red-700"
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
