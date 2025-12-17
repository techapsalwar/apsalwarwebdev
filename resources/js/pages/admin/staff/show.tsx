import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    ArrowLeft, 
    Edit, 
    Trash2,
    Mail,
    Phone,
    Building,
    GraduationCap,
    Calendar,
    Award,
    BookOpen,
    CheckCircle,
    XCircle,
    Eye,
    Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
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

interface Department {
    id: number;
    name: string;
}

interface StaffItem {
    id: number;
    name: string;
    slug: string;
    designation: string;
    department_id: number | null;
    department?: Department;
    photo: string | null;
    email: string | null;
    phone: string | null;
    qualifications: string | null;
    experience: string | null;
    bio: string | null;
    subjects: string[] | null;
    type: 'teaching' | 'non_teaching' | 'management';
    joining_date: string | null;
    is_active: boolean;
    show_on_website: boolean;
    order: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    item: StaffItem;
    types: Record<string, string>;
}

function getInitials(name: string) {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

const typeColors: Record<string, string> = {
    teaching: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    non_teaching: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    management: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
};

export default function StaffShow({ item, types }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Staff', href: '/admin/staff' },
        { title: item.name, href: `/admin/staff/${item.id}` },
    ];

    const handleDelete = () => {
        router.delete(`/admin/staff/${item.id}`);
    };

    const handleToggleActive = () => {
        router.post(`/admin/staff/${item.id}/toggle-active`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${item.name} - Staff - APS Alwar Admin`} />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                        <Button variant="ghost" size="icon" asChild className="mt-2">
                            <Link href="/admin/staff">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div className="flex items-start gap-4">
                            <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                                {item.photo ? (
                                    <AvatarImage src={`/storage/${item.photo}`} alt={item.name} />
                                ) : null}
                                <AvatarFallback className="bg-amber-100 text-amber-700 text-2xl">
                                    {getInitials(item.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h1 className="text-2xl font-bold tracking-tight">{item.name}</h1>
                                    <Badge className={typeColors[item.type]}>
                                        {types[item.type]}
                                    </Badge>
                                    <Badge variant={item.is_active ? 'default' : 'secondary'}>
                                        {item.is_active ? (
                                            <><CheckCircle className="mr-1 h-3 w-3" /> Active</>
                                        ) : (
                                            <><XCircle className="mr-1 h-3 w-3" /> Inactive</>
                                        )}
                                    </Badge>
                                </div>
                                <p className="text-lg text-muted-foreground">{item.designation}</p>
                                {item.department && (
                                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                        <Building className="h-4 w-4" />
                                        {item.department.name}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <Button variant="outline" onClick={handleToggleActive}>
                            {item.is_active ? (
                                <><XCircle className="mr-2 h-4 w-4" /> Deactivate</>
                            ) : (
                                <><CheckCircle className="mr-2 h-4 w-4" /> Activate</>
                            )}
                        </Button>
                        <Button asChild>
                            <Link href={`/admin/staff/${item.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Staff Member</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete "{item.name}"? This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                        onClick={handleDelete}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Contact Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                            <Mail className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <label className="text-sm text-muted-foreground">Email</label>
                                            {item.email ? (
                                                <a href={`mailto:${item.email}`} className="block font-medium text-blue-600 hover:underline">
                                                    {item.email}
                                                </a>
                                            ) : (
                                                <p className="text-muted-foreground">Not provided</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                            <Phone className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <label className="text-sm text-muted-foreground">Phone</label>
                                            {item.phone ? (
                                                <a href={`tel:${item.phone}`} className="block font-medium">
                                                    {item.phone}
                                                </a>
                                            ) : (
                                                <p className="text-muted-foreground">Not provided</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Professional Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Professional Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                            <GraduationCap className="h-4 w-4" />
                                            <label className="text-sm">Qualifications</label>
                                        </div>
                                        <p>{item.qualifications || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                            <Award className="h-4 w-4" />
                                            <label className="text-sm">Experience</label>
                                        </div>
                                        <p>{item.experience || 'Not provided'}</p>
                                    </div>
                                </div>

                                {item.subjects && item.subjects.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                            <BookOpen className="h-4 w-4" />
                                            <label className="text-sm">Subjects Taught</label>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {item.subjects.map((subject, index) => (
                                                <Badge key={index} variant="secondary">
                                                    {subject}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {item.joining_date && (
                                    <div>
                                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                            <Calendar className="h-4 w-4" />
                                            <label className="text-sm">Joining Date</label>
                                        </div>
                                        <p>{new Date(item.joining_date).toLocaleDateString('en-IN', { 
                                            dateStyle: 'long' 
                                        })}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Bio */}
                        {item.bio && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Biography</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="whitespace-pre-wrap">{item.bio}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Active</span>
                                    <Badge variant={item.is_active ? 'default' : 'secondary'}>
                                        {item.is_active ? 'Yes' : 'No'}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Show on Website</span>
                                    <Badge variant={item.show_on_website ? 'default' : 'secondary'}>
                                        {item.show_on_website ? 'Yes' : 'No'}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Display Order</span>
                                    <span className="font-medium">{item.order}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Metadata */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Metadata</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div>
                                    <label className="text-muted-foreground">Slug</label>
                                    <p className="font-mono text-xs bg-muted px-2 py-1 rounded mt-1">
                                        {item.slug}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-muted-foreground">Created</label>
                                    <p>{new Date(item.created_at).toLocaleDateString('en-IN', { 
                                        dateStyle: 'long' 
                                    })}</p>
                                </div>
                                <div>
                                    <label className="text-muted-foreground">Last Updated</label>
                                    <p>{new Date(item.updated_at).toLocaleDateString('en-IN', { 
                                        dateStyle: 'long' 
                                    })}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {item.show_on_website && item.is_active && (
                                    <Button variant="outline" className="w-full justify-start" asChild>
                                        <Link href={`/academics/faculty/${item.slug}`} target="_blank">
                                            <Globe className="mr-2 h-4 w-4" />
                                            View on Website
                                        </Link>
                                    </Button>
                                )}
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <Link href="/academics/faculty" target="_blank">
                                        <Eye className="mr-2 h-4 w-4" />
                                        View Faculty Page
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
