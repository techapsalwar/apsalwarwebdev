import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Plus, 
    Edit, 
    Trash2, 
    Eye, 
    EyeOff,
    Quote,
    Calendar,
    ListPlus,
    Clock,
    Settings,
    Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';

interface Affirmation {
    id: number;
    quote: string;
    author: string | null;
    display_date: string;
    is_active: boolean;
}

interface Props {
    affirmations: {
        data: Affirmation[];
        current_page: number;
        last_page: number;
        total: number;
    };
    today: Affirmation | null;
    thoughtChangeTime: string;
    filters: {
        month: string | null;
        year: string | null;
    };
}

export default function AffirmationsIndex({ affirmations, today, thoughtChangeTime, filters }: Props) {
    const [changeTime, setChangeTime] = useState(thoughtChangeTime);
    const [savingTime, setSavingTime] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Affirmations', href: '/admin/affirmations' },
    ];

    const handleSaveChangeTime = () => {
        setSavingTime(true);
        router.post('/admin/affirmations/change-time', { time: changeTime }, {
            preserveScroll: true,
            onFinish: () => setSavingTime(false),
        });
    };

    const handleToggleActive = (affirmation: Affirmation) => {
        router.post(`/admin/affirmations/${affirmation.id}/toggle-active`, {}, {
            preserveScroll: true,
        });
    };

    const handleDelete = (affirmation: Affirmation) => {
        router.delete(`/admin/affirmations/${affirmation.id}`, {
            preserveScroll: true,
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const isToday = (dateString: string) => {
        const today = new Date();
        const date = new Date(dateString);
        return today.toDateString() === date.toDateString();
    };

    const isPast = (dateString: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const date = new Date(dateString);
        return date < today;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Affirmations - Thought of the Day" />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Thought of the Day</h1>
                        <p className="text-gray-500">Manage daily affirmations & quotes</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/admin/affirmations/bulk-create">
                                <ListPlus className="h-4 w-4 mr-2" />
                                Bulk Add
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href="/admin/affirmations/create">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Affirmation
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Today's Thought */}
                {today && (
                    <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-amber-800 dark:text-amber-200 flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Today's Thought
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <blockquote className="text-lg italic text-amber-900 dark:text-amber-100">
                                "{today.quote}"
                            </blockquote>
                            {today.author && (
                                <p className="text-amber-700 dark:text-amber-300 mt-2">
                                    — {today.author}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                )}

                {!today && (
                    <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
                        <CardContent className="p-4">
                            <p className="text-orange-800 dark:text-orange-200">
                                ⚠️ No affirmation set for today. Add one to display on the homepage!
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Thought Change Time Setting */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            Display Settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="changeTime" className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    Thought Change Time
                                </Label>
                                <Input
                                    id="changeTime"
                                    type="time"
                                    value={changeTime}
                                    onChange={(e) => setChangeTime(e.target.value)}
                                    className="w-36"
                                />
                            </div>
                            <Button 
                                onClick={handleSaveChangeTime}
                                disabled={savingTime || changeTime === thoughtChangeTime}
                                size="sm"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {savingTime ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            The time at which the "Today's Thought" changes to the next day's thought on the homepage.
                            For example, if set to 06:00, Dec 10's thought will start showing at 6:00 AM on Dec 10.
                        </p>
                    </CardContent>
                </Card>

                {/* Affirmations List */}
                {affirmations.data.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Quote className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="font-semibold text-lg mb-2">No affirmations yet</h3>
                            <p className="text-gray-500 mb-4">
                                Add daily quotes and thoughts to inspire students
                            </p>
                            <Button asChild>
                                <Link href="/admin/affirmations/create">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Affirmation
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-32">Date</TableHead>
                                    <TableHead>Quote</TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-32">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {affirmations.data.map((affirmation) => (
                                    <TableRow key={affirmation.id} className={isToday(affirmation.display_date) ? 'bg-amber-50 dark:bg-amber-950/20' : ''}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                <span className={isToday(affirmation.display_date) ? 'font-semibold text-amber-600' : ''}>
                                                    {formatDate(affirmation.display_date)}
                                                </span>
                                            </div>
                                            {isToday(affirmation.display_date) && (
                                                <Badge variant="outline" className="mt-1 text-xs bg-amber-100 text-amber-700 border-amber-300">
                                                    Today
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="max-w-md">
                                            <p className="line-clamp-2 italic">"{affirmation.quote}"</p>
                                        </TableCell>
                                        <TableCell>{affirmation.author || '-'}</TableCell>
                                        <TableCell>
                                            <Badge variant={affirmation.is_active ? 'default' : 'secondary'}>
                                                {affirmation.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Button 
                                                    size="icon" 
                                                    variant="ghost"
                                                    onClick={() => handleToggleActive(affirmation)}
                                                >
                                                    {affirmation.is_active ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </Button>
                                                <Button size="icon" variant="ghost" asChild>
                                                    <Link href={`/admin/affirmations/${affirmation.id}/edit`}>
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
                                                            <AlertDialogTitle>Delete Affirmation?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This will permanently delete this affirmation. This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction 
                                                                onClick={() => handleDelete(affirmation)}
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
