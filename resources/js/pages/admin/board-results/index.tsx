import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Plus, 
    Edit, 
    Trash2, 
    Eye, 
    EyeOff,
    Trophy,
    GraduationCap,
    Search,
    Filter,
    TrendingUp,
    Users,
    Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { useState } from 'react';

interface BoardResult {
    id: number;
    academic_year: string;
    board: string;
    class: string;
    stream: string | null;
    appeared: number;
    passed: number;
    pass_percentage: number;
    above_90_percent: number | null;
    api_score: number | null;
    overall_topper_name: string | null;
    overall_topper_percentage: number | null;
    is_published: boolean;
    created_at: string;
}

interface Props {
    results: {
        data: BoardResult[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    years: string[];
    filters: {
        year: string | null;
        class: string | null;
        published: string | null;
    };
}

export default function BoardResultsIndex({ results, years, filters }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Board Results', href: '/admin/board-results' },
    ];

    const handleFilter = (key: string, value: string) => {
        router.get('/admin/board-results', {
            ...filters,
            [key]: value === 'all' ? null : value,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleTogglePublish = (result: BoardResult) => {
        router.post(`/admin/board-results/${result.id}/toggle-publish`, {}, {
            preserveScroll: true,
        });
    };

    const handleDelete = (result: BoardResult) => {
        router.delete(`/admin/board-results/${result.id}`, {
            preserveScroll: true,
        });
    };

    // Calculate stats
    const totalResults = results.total;
    const publishedCount = results.data.filter(r => r.is_published).length;
    const avgPassRate = results.data.length > 0 
        ? (results.data.reduce((sum, r) => sum + parseFloat(String(r.pass_percentage)), 0) / results.data.length).toFixed(1)
        : '0';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Board Results" />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Trophy className="h-6 w-6 text-amber-500" />
                            Board Results
                        </h1>
                        <p className="text-gray-500">Manage CBSE board examination results</p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/board-results/create">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Result
                        </Link>
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Total Records</CardDescription>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-blue-500" />
                                {totalResults}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Published</CardDescription>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <Eye className="h-5 w-5 text-green-500" />
                                {publishedCount}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Avg Pass Rate</CardDescription>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-amber-500" />
                                {avgPassRate}%
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-wrap gap-4">
                            <Select 
                                value={filters.year || 'all'} 
                                onValueChange={(value) => handleFilter('year', value)}
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Academic Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Years</SelectItem>
                                    {years.map((year) => (
                                        <SelectItem key={year} value={year}>{year}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select 
                                value={filters.class || 'all'} 
                                onValueChange={(value) => handleFilter('class', value)}
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Class" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Classes</SelectItem>
                                    <SelectItem value="X">Class X</SelectItem>
                                    <SelectItem value="XII">Class XII</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select 
                                value={filters.published || 'all'} 
                                onValueChange={(value) => handleFilter('published', value)}
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="1">Published</SelectItem>
                                    <SelectItem value="0">Draft</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Table */}
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Year</TableHead>
                                    <TableHead>Class</TableHead>
                                    <TableHead className="text-center">Students</TableHead>
                                    <TableHead className="text-center">Pass %</TableHead>
                                    <TableHead className="text-center">Distinction</TableHead>
                                    <TableHead>Topper</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {results.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                            No board results found. Add your first result.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    results.data.map((result) => (
                                        <TableRow key={result.id}>
                                            <TableCell className="font-medium">
                                                {result.academic_year}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <GraduationCap className="h-4 w-4 text-gray-400" />
                                                    Class {result.class}
                                                    {result.stream && (
                                                        <Badge variant="outline" className="text-xs">
                                                            {result.stream}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Users className="h-4 w-4 text-gray-400" />
                                                    {result.passed}/{result.appeared}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge 
                                                    className={
                                                        result.pass_percentage >= 90 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : result.pass_percentage >= 75 
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : 'bg-amber-100 text-amber-800'
                                                    }
                                                >
                                                    {result.pass_percentage}%
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {result.above_90_percent !== null ? (
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Award className="h-4 w-4 text-amber-500" />
                                                        {result.above_90_percent}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {result.overall_topper_name ? (
                                                    <div>
                                                        <div className="font-medium text-sm">
                                                            {result.overall_topper_name}
                                                        </div>
                                                        {result.overall_topper_percentage && (
                                                            <div className="text-xs text-amber-600 font-semibold">
                                                                {result.overall_topper_percentage}%
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">Not set</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant={result.is_published ? 'default' : 'secondary'}>
                                                    {result.is_published ? 'Published' : 'Draft'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleTogglePublish(result)}
                                                        title={result.is_published ? 'Unpublish' : 'Publish'}
                                                    >
                                                        {result.is_published ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={`/admin/board-results/${result.id}/edit`}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="text-red-600">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Delete Result?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This will permanently delete the {result.academic_year} Class {result.class} result. 
                                                                    This action cannot be undone.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDelete(result)}
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
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {results.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {results.links.map((link, index) => (
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
            </div>
        </AppLayout>
    );
}
