import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    ArrowLeft, 
    Edit, 
    CheckCircle,
    XCircle,
    Star,
    StarOff,
    Trash2,
    GraduationCap,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Building2,
    Calendar,
    Linkedin,
    Clock,
    MailCheck,
    User,
    Send,
    ShieldCheck,
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { type BreadcrumbItem } from '@/types';

interface Alumni {
    id: number;
    name: string;
    slug: string;
    batch_year: string;
    class_section: string | null;
    house: string | null;
    email: string;
    phone: string | null;
    location: string | null;
    photo: string | null;
    photo_url: string | null;
    current_designation: string | null;
    organization: string | null;
    category: string;
    linkedin_url: string | null;
    achievement: string | null;
    story: string | null;
    school_memories: string | null;
    message_to_juniors: string | null;
    is_featured: boolean;
    is_active: boolean;
    approval_status: 'pending' | 'approved' | 'rejected';
    rejection_reason: string | null;
    email_verified_at: string | null;
    approved_at: string | null;
    created_at: string;
    approved_by_user?: { name: string };
}

interface Props {
    alumnus: Alumni;
    categories: Record<string, string>;
}

export default function AdminAlumniShow({ alumnus, categories }: Props) {
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [processing, setProcessing] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Alumni', href: '/admin/alumni' },
        { title: alumnus.name, href: `/admin/alumni/${alumnus.id}` },
    ];

    const handleApprove = () => {
        setProcessing(true);
        router.post(`/admin/alumni/${alumnus.id}/approve`, {}, {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
        });
    };

    const handleReject = () => {
        setProcessing(true);
        router.post(`/admin/alumni/${alumnus.id}/reject`, {
            reason: rejectReason,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setRejectDialogOpen(false);
                setRejectReason('');
            },
            onFinish: () => setProcessing(false),
        });
    };

    const handleToggleFeatured = () => {
        router.post(`/admin/alumni/${alumnus.id}/toggle-featured`, {}, {
            preserveScroll: true,
        });
    };

    const handleDelete = () => {
        router.delete(`/admin/alumni/${alumnus.id}`);
    };

    const handleVerifyEmail = () => {
        setProcessing(true);
        router.post(`/admin/alumni/${alumnus.id}/verify-email`, {}, {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
        });
    };

    const handleResendVerification = () => {
        setProcessing(true);
        router.post(`/admin/alumni/${alumnus.id}/resend-verification`, {}, {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
        });
    };

    const getStatusBadge = () => {
        if (!alumnus.email_verified_at) {
            return <Badge variant="outline" className="bg-gray-100 text-gray-700">Email Unverified</Badge>;
        }
        switch (alumnus.approval_status) {
            case 'approved':
                return <Badge className="bg-green-100 text-green-700">Approved</Badge>;
            case 'rejected':
                return <Badge className="bg-red-100 text-red-700">Rejected</Badge>;
            default:
                return <Badge className="bg-yellow-100 text-yellow-700">Pending Review</Badge>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${alumnus.name} - Alumni`} />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Button variant="ghost" asChild>
                        <Link href="/admin/alumni">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Alumni List
                        </Link>
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/admin/alumni/${alumnus.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </Link>
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Alumni?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete {alumnus.name}? This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                        onClick={handleDelete}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Profile Card */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-start gap-6">
                                    <Avatar className="h-24 w-24">
                                        <AvatarImage src={alumnus.photo_url || undefined} />
                                        <AvatarFallback className="text-2xl">
                                            {alumnus.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h1 className="text-2xl font-bold">{alumnus.name}</h1>
                                            {alumnus.is_featured && (
                                                <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {getStatusBadge()}
                                            <Badge variant="outline">
                                                <GraduationCap className="h-3 w-3 mr-1" />
                                                Batch {alumnus.batch_year}
                                            </Badge>
                                            <Badge variant="outline">
                                                {categories[alumnus.category] || alumnus.category}
                                            </Badge>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-3 text-sm">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Mail className="h-4 w-4" />
                                                <span>{alumnus.email}</span>
                                                {alumnus.email_verified_at && (
                                                    <MailCheck className="h-4 w-4 text-green-500" />
                                                )}
                                            </div>
                                            {alumnus.phone && (
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Phone className="h-4 w-4" />
                                                    <span>{alumnus.phone}</span>
                                                </div>
                                            )}
                                            {alumnus.current_designation && (
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Briefcase className="h-4 w-4" />
                                                    <span>{alumnus.current_designation}</span>
                                                </div>
                                            )}
                                            {alumnus.organization && (
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Building2 className="h-4 w-4" />
                                                    <span>{alumnus.organization}</span>
                                                </div>
                                            )}
                                            {alumnus.location && (
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>{alumnus.location}</span>
                                                </div>
                                            )}
                                            {alumnus.linkedin_url && (
                                                <a 
                                                    href={alumnus.linkedin_url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-blue-600 hover:underline"
                                                >
                                                    <Linkedin className="h-4 w-4" />
                                                    <span>LinkedIn Profile</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* School Info */}
                        {(alumnus.class_section || alumnus.house) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">School Information</CardTitle>
                                </CardHeader>
                                <CardContent className="grid md:grid-cols-2 gap-4">
                                    {alumnus.class_section && (
                                        <div>
                                            <p className="text-sm text-gray-500">Class & Section</p>
                                            <p className="font-medium">{alumnus.class_section}</p>
                                        </div>
                                    )}
                                    {alumnus.house && (
                                        <div>
                                            <p className="text-sm text-gray-500">House</p>
                                            <p className="font-medium capitalize">{alumnus.house}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Content Sections */}
                        {alumnus.achievement && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Achievements</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="whitespace-pre-line text-gray-700">{alumnus.achievement}</p>
                                </CardContent>
                            </Card>
                        )}

                        {alumnus.story && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Journey After APS Alwar</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="whitespace-pre-line text-gray-700">{alumnus.story}</p>
                                </CardContent>
                            </Card>
                        )}

                        {alumnus.school_memories && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">School Memories</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="whitespace-pre-line text-gray-700 italic">"{alumnus.school_memories}"</p>
                                </CardContent>
                            </Card>
                        )}

                        {alumnus.message_to_juniors && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Message to Students</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="whitespace-pre-line text-gray-700 italic">"{alumnus.message_to_juniors}"</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {/* Email Verification Actions */}
                                {!alumnus.email_verified_at && (
                                    <>
                                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                            <p className="text-sm text-amber-800 mb-2">
                                                <strong>Email not verified.</strong> Alumni must verify their email before approval.
                                            </p>
                                            <div className="flex flex-col gap-2">
                                                <Button 
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full"
                                                    onClick={handleResendVerification}
                                                    disabled={processing}
                                                >
                                                    <Send className="h-4 w-4 mr-2" />
                                                    Resend Verification Email
                                                </Button>
                                                <Button 
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full border-green-500 text-green-600 hover:bg-green-50"
                                                    onClick={handleVerifyEmail}
                                                    disabled={processing}
                                                >
                                                    <ShieldCheck className="h-4 w-4 mr-2" />
                                                    Manually Verify Email
                                                </Button>
                                            </div>
                                        </div>
                                        <Separator />
                                    </>
                                )}

                                {/* Approval Actions - Show for pending with verified email */}
                                {alumnus.approval_status === 'pending' && alumnus.email_verified_at && (
                                    <>
                                        <Button 
                                            className="w-full bg-green-600 hover:bg-green-700"
                                            onClick={handleApprove}
                                            disabled={processing}
                                        >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Approve
                                        </Button>
                                        <Button 
                                            variant="destructive"
                                            className="w-full"
                                            onClick={() => setRejectDialogOpen(true)}
                                            disabled={processing}
                                        >
                                            <XCircle className="h-4 w-4 mr-2" />
                                            Reject
                                        </Button>
                                        <Separator />
                                    </>
                                )}
                                <Button 
                                    variant="outline"
                                    className="w-full"
                                    onClick={handleToggleFeatured}
                                >
                                    {alumnus.is_featured ? (
                                        <>
                                            <StarOff className="h-4 w-4 mr-2" />
                                            Remove Featured
                                        </>
                                    ) : (
                                        <>
                                            <Star className="h-4 w-4 mr-2" />
                                            Mark as Featured
                                        </>
                                    )}
                                </Button>
                                {alumnus.approval_status === 'approved' && (
                                    <Button 
                                        variant="outline"
                                        className="w-full"
                                        asChild
                                    >
                                        <a href={`/alumni/${alumnus.slug}`} target="_blank">
                                            View Public Profile
                                        </a>
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        {/* Status Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Status Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Email Verification</p>
                                    <p className="font-medium flex items-center gap-2">
                                        {alumnus.email_verified_at ? (
                                            <>
                                                <MailCheck className="h-4 w-4 text-green-500" />
                                                Verified on {new Date(alumnus.email_verified_at).toLocaleDateString()}
                                            </>
                                        ) : (
                                            <>
                                                <Mail className="h-4 w-4 text-gray-400" />
                                                Not Verified
                                            </>
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Approval Status</p>
                                    <p className="font-medium capitalize">{alumnus.approval_status}</p>
                                </div>
                                {alumnus.approved_at && alumnus.approved_by_user && (
                                    <div>
                                        <p className="text-sm text-gray-500">Reviewed By</p>
                                        <p className="font-medium flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            {alumnus.approved_by_user.name}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(alumnus.approved_at).toLocaleString()}
                                        </p>
                                    </div>
                                )}
                                {alumnus.rejection_reason && (
                                    <div>
                                        <p className="text-sm text-gray-500">Rejection Reason</p>
                                        <p className="text-sm text-red-600">{alumnus.rejection_reason}</p>
                                    </div>
                                )}
                                <Separator />
                                <div>
                                    <p className="text-sm text-gray-500">Registered On</p>
                                    <p className="font-medium flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        {new Date(alumnus.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Reject Dialog */}
            <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Alumni Registration</DialogTitle>
                        <DialogDescription>
                            Reject {alumnus.name}'s registration?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="reason">Reason for Rejection (Optional)</Label>
                            <Textarea
                                id="reason"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Provide a reason for rejection..."
                                rows={3}
                            />
                            <p className="text-xs text-gray-500">
                                This will be included in the notification email sent to the applicant.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleReject}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
