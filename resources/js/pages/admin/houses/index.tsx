import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    Plus,
    Edit,
    Trash2,
    MoreHorizontal,
    Trophy,
    Flag,
    Medal,
    Award,
    Loader2,
    Star,
    BookOpen,
    Music,
    Shield,
    Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Houses', href: '/admin/houses' },
];

interface HouseItem {
    id: number;
    name: string;
    slug: string;
    color: string;
    motto: string | null;
    description: string | null;
    image: string | null;
    logo: string | null;
    order: number;
    is_active: boolean;
    total_points: number;
}

interface PointEntry {
    id: number;
    house_id: number;
    category: string;
    points: number;
    event_name: string;
    remarks: string | null;
    event_date: string;
    house_name: string;
    house_color: string;
}

interface HousesIndexProps {
    items: HouseItem[];
    recentPoints: PointEntry[];
    filters: {
        search?: string;
        sort?: string;
        direction?: string;
    };
}

const categoryIcons: Record<string, React.ReactNode> = {
    sports: <Trophy className="h-4 w-4 text-orange-500" />,
    academics: <BookOpen className="h-4 w-4 text-blue-500" />,
    cultural: <Music className="h-4 w-4 text-purple-500" />,
    discipline: <Shield className="h-4 w-4 text-green-500" />,
    other: <Sparkles className="h-4 w-4 text-pink-500" />,
};

const categoryColors: Record<string, string> = {
    sports: 'bg-orange-100 text-orange-700',
    academics: 'bg-blue-100 text-blue-700',
    cultural: 'bg-purple-100 text-purple-700',
    discipline: 'bg-green-100 text-green-700',
    other: 'bg-pink-100 text-pink-700',
};

export default function HousesIndex({ items, recentPoints = [] }: HousesIndexProps) {
    const [addPointsOpen, setAddPointsOpen] = useState(false);
    const [selectedHouseId, setSelectedHouseId] = useState<number | null>(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        category: 'sports',
        points: 0,
        event_name: '',
        remarks: '',
        event_date: new Date().toISOString().split('T')[0],
    });

    const handleDelete = (id: number) => {
        router.delete(`/admin/houses/${id}`, {
            preserveScroll: true,
        });
    };

    const handleToggleActive = (id: number) => {
        router.post(`/admin/houses/${id}/toggle-active`, {}, {
            preserveScroll: true,
        });
    };

    const handleAddPoints = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedHouseId) return;

        post(`/admin/houses/${selectedHouseId}/add-points`, {
            preserveScroll: true,
            onSuccess: () => {
                setAddPointsOpen(false);
                setSelectedHouseId(null);
                reset();
            },
        });
    };

    const handleDeletePoint = (pointId: number, houseId: number) => {
        router.delete(`/admin/houses/${houseId}/points/${pointId}`, {
            preserveScroll: true,
        });
    };

    const openAddPointsDialog = (houseId: number) => {
        setSelectedHouseId(houseId);
        setAddPointsOpen(true);
    };

    // Sort houses by total points for ranking
    const sortedByPoints = [...items].sort((a, b) => b.total_points - a.total_points);
    const getRank = (house: HouseItem) => sortedByPoints.findIndex(h => h.id === house.id) + 1;

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Medal className="h-5 w-5 text-amber-500" />;
        if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
        if (rank === 3) return <Medal className="h-5 w-5 text-amber-700" />;
        return <Award className="h-5 w-5 text-gray-300" />;
    };

    const selectedHouse = items.find(h => h.id === selectedHouseId);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Houses - APS Alwar Admin" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">House Management</h1>
                        <p className="text-muted-foreground">
                            Manage the four houses: Cariappa, Manekshaw, Raina, and Thimayya.
                        </p>
                    </div>
                    <Button asChild className="bg-amber-600 hover:bg-amber-700">
                        <Link href="/admin/houses/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add House
                        </Link>
                    </Button>
                </div>

                {/* Leaderboard */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-amber-500" />
                            House Leaderboard
                        </CardTitle>
                        <CardDescription>Current standings based on total points.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            {sortedByPoints.map((house, index) => (
                                <div
                                    key={house.id}
                                    className={`relative p-4 rounded-lg border-2 ${
                                        index === 0 ? 'border-amber-400 bg-amber-50/50' : 'border-muted'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {getRankIcon(index + 1)}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="h-3 w-3 rounded-full"
                                                    style={{ backgroundColor: house.color }}
                                                />
                                                <span className="font-semibold">{house.name}</span>
                                            </div>
                                            <p className="text-2xl font-bold mt-1" style={{ color: house.color }}>
                                                {house.total_points || 0}
                                            </p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openAddPointsDialog(house.id)}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Houses Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {items.map((house) => (
                        <Card key={house.id} className="relative overflow-hidden">
                            {/* Color Banner */}
                            <div
                                className="h-2"
                                style={{ backgroundColor: house.color }}
                            />

                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        {house.logo ? (
                                            <img
                                                src={`/storage/${house.logo}`}
                                                alt={house.name}
                                                className="h-10 w-10 object-contain"
                                            />
                                        ) : (
                                            <Flag
                                                className="h-8 w-8"
                                                style={{ color: house.color }}
                                            />
                                        )}
                                        <div>
                                            <CardTitle className="text-lg">{house.name}</CardTitle>
                                            {house.motto && (
                                                <CardDescription className="mt-0.5 text-xs">
                                                    "{house.motto}"
                                                </CardDescription>
                                            )}
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => openAddPointsDialog(house.id)}>
                                                <Star className="mr-2 h-4 w-4" />
                                                Add Points
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href={`/admin/houses/${house.id}/edit`}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleToggleActive(house.id)}>
                                                {house.is_active ? 'Deactivate' : 'Activate'}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <DropdownMenuItem
                                                        className="text-destructive focus:text-destructive"
                                                        onSelect={(e) => e.preventDefault()}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete House</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to delete "{house.name}"? This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(house.id)}
                                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {/* Points Display */}
                                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Trophy className="h-5 w-5 text-amber-500" />
                                        <span className="font-semibold">Points</span>
                                    </div>
                                    <span className="text-2xl font-bold" style={{ color: house.color }}>
                                        {house.total_points || 0}
                                    </span>
                                </div>

                                {/* Rank Badge */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Current Rank</span>
                                    <Badge
                                        variant={getRank(house) === 1 ? 'default' : 'secondary'}
                                        className={getRank(house) === 1 ? 'bg-amber-500' : ''}
                                    >
                                        #{getRank(house)}
                                    </Badge>
                                </div>

                                {/* Status */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Status</span>
                                    <Badge variant={house.is_active ? 'default' : 'secondary'}>
                                        {house.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>

                                {/* Color Preview */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">House Color</span>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="h-6 w-6 rounded-full border"
                                            style={{ backgroundColor: house.color }}
                                        />
                                        <span className="text-xs font-mono">{house.color}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Recent Points History */}
                {recentPoints.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Star className="h-5 w-5 text-purple-500" />
                                Recent Points Activity
                            </CardTitle>
                            <CardDescription>Last 10 points awarded across all houses.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>House</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead className="text-right">Points</TableHead>
                                        <TableHead>Reason</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentPoints.map((point) => (
                                        <TableRow key={point.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="h-3 w-3 rounded-full"
                                                        style={{ backgroundColor: point.house_color || '#ccc' }}
                                                    />
                                                    <span className="font-medium">{point.house_name || 'Unknown'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`gap-1 ${categoryColors[point.category] || categoryColors.other}`}>
                                                    {categoryIcons[point.category] || categoryIcons.other}
                                                    <span className="capitalize">{point.category}</span>
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <span className={`font-bold ${point.points >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {point.points >= 0 ? '+' : ''}{point.points}
                                                </span>
                                            </TableCell>
                                            <TableCell className="max-w-[200px] truncate">
                                                {point.event_name || point.remarks || '-'}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {point.event_date || '-'}
                                            </TableCell>
                                            <TableCell>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Point Entry</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to delete this point entry? This will subtract {point.points} points from {point.house_name}.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDeletePoint(point.id, point.house_id)}
                                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                {/* Empty State */}
                {items.length === 0 && (
                    <Card className="p-8 text-center">
                        <Flag className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">No Houses Yet</h3>
                        <p className="text-muted-foreground mt-1">
                            Get started by creating the first house.
                        </p>
                        <Button asChild className="mt-4 bg-amber-600 hover:bg-amber-700">
                            <Link href="/admin/houses/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Add House
                            </Link>
                        </Button>
                    </Card>
                )}

                {/* Add Points Dialog */}
                <Dialog open={addPointsOpen} onOpenChange={setAddPointsOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Star className="h-5 w-5 text-amber-500" />
                                Add Points
                                {selectedHouse && (
                                    <span style={{ color: selectedHouse.color }}>
                                        - {selectedHouse.name}
                                    </span>
                                )}
                            </DialogTitle>
                            <DialogDescription>
                                Award points to the selected house.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddPoints}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select
                                        value={data.category}
                                        onValueChange={(value) => setData('category', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sports">
                                                <div className="flex items-center gap-2">
                                                    <Trophy className="h-4 w-4 text-orange-500" />
                                                    Sports
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="academics">
                                                <div className="flex items-center gap-2">
                                                    <BookOpen className="h-4 w-4 text-blue-500" />
                                                    Academics
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="cultural">
                                                <div className="flex items-center gap-2">
                                                    <Music className="h-4 w-4 text-purple-500" />
                                                    Cultural
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="discipline">
                                                <div className="flex items-center gap-2">
                                                    <Shield className="h-4 w-4 text-green-500" />
                                                    Discipline
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="other">
                                                <div className="flex items-center gap-2">
                                                    <Sparkles className="h-4 w-4 text-pink-500" />
                                                    Other
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="points">Points</Label>
                                    <Input
                                        id="points"
                                        type="number"
                                        value={data.points}
                                        onChange={(e) => setData('points', parseInt(e.target.value) || 0)}
                                        placeholder="Enter points (use negative for deduction)"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Use negative numbers to deduct points.
                                    </p>
                                    {errors.points && <p className="text-sm text-destructive">{errors.points}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="event_name">Event Name *</Label>
                                    <Input
                                        id="event_name"
                                        value={data.event_name}
                                        onChange={(e) => setData('event_name', e.target.value)}
                                        placeholder="e.g., Annual Sports Day, Science Quiz"
                                        required
                                    />
                                    {errors.event_name && <p className="text-sm text-destructive">{errors.event_name}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="remarks">Remarks</Label>
                                    <Textarea
                                        id="remarks"
                                        value={data.remarks}
                                        onChange={(e) => setData('remarks', e.target.value)}
                                        placeholder="Additional details about the points..."
                                        rows={3}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="event_date">Date</Label>
                                    <Input
                                        id="event_date"
                                        type="date"
                                        value={data.event_date}
                                        onChange={(e) => setData('event_date', e.target.value)}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setAddPointsOpen(false);
                                        reset();
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-amber-600 hover:bg-amber-700"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Points
                                        </>
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
