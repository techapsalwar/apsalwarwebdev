import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Plus, 
    Search, 
    Edit, 
    Trash2, 
    Eye,
    EyeOff,
    Users,
    UserPlus,
    ChevronDown,
    ChevronUp,
    Shield,
    Star,
    Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import { type BreadcrumbItem } from '@/types';

interface CommitteeMember {
    id: number;
    name: string;
    designation: string;
    role: string | null;
    email: string | null;
    phone: string | null;
    photo: string | null;
    organization: string | null;
    order: number;
    is_active: boolean;
}

interface Committee {
    id: number;
    name: string;
    slug: string;
    type: string;
    description: string | null;
    session: string | null;
    functions: string[] | null;
    image: string | null;
    is_active: boolean;
    order: number;
    members: CommitteeMember[];
}

interface CommitteeType {
    value: string;
    label: string;
}

interface Props {
    committees: {
        data: Committee[];
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
        links: {
            prev: string | null;
            next: string | null;
        };
    };
    filters: {
        search: string;
        type: string;
        active: string;
    };
    types: CommitteeType[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Committees', href: '/admin/committees' },
];

const typeColors: Record<string, string> = {
    'smc': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    'academic': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'administrative': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'student_welfare': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'examination': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'discipline': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'pta': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
    'other': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
};

function getInitials(name: string) {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

function getDesignationIcon(designation: string) {
    const d = designation.toLowerCase();
    if (d.includes('chairman') || d.includes('president')) return Star;
    if (d.includes('principal') || d.includes('secretary')) return Award;
    return Shield;
}

export default function CommitteesIndex({ committees, filters, types }: Props) {
    const [search, setSearch] = useState(filters.search);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [committeeToDelete, setCommitteeToDelete] = useState<Committee | null>(null);
    const [expandedCommittees, setExpandedCommittees] = useState<Set<number>>(new Set());

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/committees', { search, type: filters.type, active: filters.active }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleFilterChange = (key: string, value: string) => {
        router.get('/admin/committees', { 
            search: filters.search, 
            type: filters.type,
            active: filters.active,
            [key]: value === 'all' ? '' : value 
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (id: number) => {
        router.delete(`/admin/committees/${id}`, {
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setCommitteeToDelete(null);
            }
        });
    };

    const openDeleteDialog = (committee: Committee) => {
        setCommitteeToDelete(committee);
        setDeleteDialogOpen(true);
    };

    const handleToggleActive = (id: number) => {
        router.post(`/admin/committees/${id}/toggle-active`);
    };

    const toggleExpanded = (id: number) => {
        const newSet = new Set(expandedCommittees);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setExpandedCommittees(newSet);
    };

    const getTypeLabel = (type: string) => {
        return types.find(t => t.value === type)?.label || type;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Committees - APS Alwar Admin" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Committees</h1>
                        <p className="text-muted-foreground">
                            Manage school committees and their members.
                        </p>
                    </div>
                    <Button asChild className="bg-amber-600 hover:bg-amber-700">
                        <Link href="/admin/committees/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Committee
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <form onSubmit={handleSearch} className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search committees..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </form>
                            <div className="flex gap-2">
                                <Select
                                    value={filters.type || 'all'}
                                    onValueChange={(value) => handleFilterChange('type', value)}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        {types.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={filters.active || 'all'}
                                    onValueChange={(value) => handleFilterChange('active', value)}
                                >
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="1">Active</SelectItem>
                                        <SelectItem value="0">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Committees List */}
                {committees.data.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Users className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No committees found</h3>
                            <p className="text-muted-foreground text-center mb-4">
                                {filters.search || filters.type || filters.active
                                    ? 'Try adjusting your filters.'
                                    : 'Get started by adding your first committee.'}
                            </p>
                            {!filters.search && !filters.type && !filters.active && (
                                <Button asChild>
                                    <Link href="/admin/committees/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Committee
                                    </Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {committees.data.map((committee) => (
                            <Collapsible
                                key={committee.id}
                                open={expandedCommittees.has(committee.id)}
                                onOpenChange={() => toggleExpanded(committee.id)}
                            >
                                <Card className={`${!committee.is_active ? 'opacity-60' : ''}`}>
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <CardTitle className="text-xl">{committee.name}</CardTitle>
                                                    <Badge className={typeColors[committee.type] || typeColors.other}>
                                                        {getTypeLabel(committee.type)}
                                                    </Badge>
                                                    {!committee.is_active && (
                                                        <Badge variant="secondary">Hidden</Badge>
                                                    )}
                                                </div>
                                                {committee.session && (
                                                    <p className="text-sm text-muted-foreground">
                                                        Session: {committee.session}
                                                    </p>
                                                )}
                                                {committee.description && (
                                                    <CardDescription className="mt-2">
                                                        {committee.description}
                                                    </CardDescription>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CollapsibleTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <Users className="mr-2 h-4 w-4" />
                                                        {committee.members.length} Members
                                                        {expandedCommittees.has(committee.id) ? (
                                                            <ChevronUp className="ml-2 h-4 w-4" />
                                                        ) : (
                                                            <ChevronDown className="ml-2 h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </CollapsibleTrigger>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    
                                    <CollapsibleContent>
                                        <CardContent className="pt-4 border-t">
                                            {committee.members.length === 0 ? (
                                                <div className="text-center py-6 text-muted-foreground">
                                                    <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                                    <p>No members added yet.</p>
                                                    <Button variant="outline" size="sm" className="mt-2" asChild>
                                                        <Link href={`/admin/committees/${committee.id}/edit`}>
                                                            <UserPlus className="mr-2 h-4 w-4" />
                                                            Add Members
                                                        </Link>
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                                    {committee.members.map((member) => {
                                                        const DesignationIcon = getDesignationIcon(member.designation);
                                                        return (
                                                            <div
                                                                key={member.id}
                                                                className={`flex items-center gap-3 p-3 rounded-lg border ${
                                                                    !member.is_active ? 'opacity-50' : ''
                                                                }`}
                                                            >
                                                                <Avatar className="h-10 w-10">
                                                                    {member.photo ? (
                                                                        <AvatarImage src={`/storage/${member.photo}`} alt={member.name} />
                                                                    ) : null}
                                                                    <AvatarFallback className="bg-amber-100 text-amber-700 text-sm">
                                                                        {getInitials(member.name)}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-medium text-sm truncate">{member.name}</p>
                                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                        <DesignationIcon className="h-3 w-3" />
                                                                        <span className="truncate">{member.designation}</span>
                                                                    </div>
                                                                    {member.organization && (
                                                                        <p className="text-xs text-muted-foreground truncate">
                                                                            {member.organization}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </CardContent>
                                    </CollapsibleContent>

                                    <CardFooter className="border-t pt-4 flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            asChild
                                        >
                                            <Link href={`/admin/committees/${committee.id}/edit`}>
                                                <Edit className="mr-1 h-4 w-4" />
                                                Edit
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => handleToggleActive(committee.id)}
                                        >
                                            {committee.is_active ? (
                                                <>
                                                    <EyeOff className="mr-1 h-4 w-4" />
                                                    Hide
                                                </>
                                            ) : (
                                                <>
                                                    <Eye className="mr-1 h-4 w-4" />
                                                    Show
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => openDeleteDialog(committee)}
                                        >
                                            <Trash2 className="mr-1 h-4 w-4" />
                                            Delete
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </Collapsible>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {committees.data.length > 0 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {(committees.meta.current_page - 1) * committees.meta.per_page + 1} to{' '}
                            {Math.min(committees.meta.current_page * committees.meta.per_page, committees.meta.total)} of{' '}
                            {committees.meta.total} committees
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={!committees.links.prev}
                                onClick={() => router.get(committees.links.prev!)}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={!committees.links.next}
                                onClick={() => router.get(committees.links.next!)}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Committee?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete "{committeeToDelete?.name}" and all its members. 
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => committeeToDelete && handleDelete(committeeToDelete.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
