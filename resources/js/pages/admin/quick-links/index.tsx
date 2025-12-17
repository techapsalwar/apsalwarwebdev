import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Plus, 
    Edit, 
    Trash2, 
    Eye, 
    EyeOff,
    GripVertical,
    Link as LinkIcon,
    ExternalLink,
    Sparkles,
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { type BreadcrumbItem } from '@/types';

interface QuickLink {
    id: number;
    title: string;
    url: string;
    icon: string | null;
    target: '_self' | '_blank';
    is_active: boolean;
    is_new: boolean;
    order: number;
}

interface Props {
    quickLinks: QuickLink[];
}

export default function QuickLinksIndex({ quickLinks }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Quick Links', href: '/admin/quick-links' },
    ];

    const handleToggleActive = (link: QuickLink) => {
        router.post(`/admin/quick-links/${link.id}/toggle-active`, {}, {
            preserveScroll: true,
        });
    };

    const handleDelete = (link: QuickLink) => {
        router.delete(`/admin/quick-links/${link.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Quick Links" />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Quick Links</h1>
                        <p className="text-gray-500">Manage homepage quick access links</p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/quick-links/create">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Quick Link
                        </Link>
                    </Button>
                </div>

                {/* Links List */}
                {quickLinks.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <LinkIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="font-semibold text-lg mb-2">No quick links yet</h3>
                            <p className="text-gray-500 mb-4">
                                Create quick access links for your homepage
                            </p>
                            <Button asChild>
                                <Link href="/admin/quick-links/create">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Quick Link
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12"></TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>URL</TableHead>
                                    <TableHead>Target</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-40">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {quickLinks.map((link) => (
                                    <TableRow key={link.id}>
                                        <TableCell>
                                            <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <LinkIcon className="h-4 w-4 text-gray-400" />
                                                <span className="flex items-center gap-2">
                                                    {link.title}
                                                    {link.is_new && (
                                                        <Badge className="bg-amber-500 text-white gap-1" variant="secondary">
                                                            <Sparkles className="h-3 w-3" />
                                                            New
                                                        </Badge>
                                                    )}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <a 
                                                href={link.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
                                            >
                                                {link.url.length > 40 ? link.url.substring(0, 40) + '...' : link.url}
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {link.target === '_blank' ? 'New Tab' : 'Same Tab'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={link.is_active ? 'default' : 'secondary'}>
                                                {link.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Button 
                                                    size="icon" 
                                                    variant="ghost"
                                                    onClick={() => handleToggleActive(link)}
                                                >
                                                    {link.is_active ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </Button>
                                                <Button size="icon" variant="ghost" asChild>
                                                    <Link href={`/admin/quick-links/${link.id}/edit`}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button size="icon" variant="ghost" className="text-red-600 hover:text-red-700">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Quick Link?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This will permanently delete "{link.title}". This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction 
                                                                onClick={() => handleDelete(link)}
                                                                className="bg-red-600 hover:bg-red-700"
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
