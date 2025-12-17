import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit, Shield, User, Mail, Phone, Calendar, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface Role {
    id: number;
    name: string;
}

interface Permission {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    is_active: boolean;
    role: string;
    roles: Role[];
    permissions: Permission[];
    direct_permissions: string[];
    all_permissions: string[];
    created_at: string;
    updated_at: string;
    last_login_at: string | null;
    email_verified_at: string | null;
}

interface Module {
    key: string;
    name: string;
    description: string;
}

interface GroupedModules {
    [group: string]: Module[];
}

interface Props {
    user: User;
    modules: Record<string, { name: string; description: string; group: string }>;
    groupedModules: GroupedModules;
}

const roleColors: Record<string, string> = {
    super_admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    content_editor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    academic_admin: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    admission_admin: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    viewer: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
};

export default function ShowUser({ user, modules, groupedModules }: Props) {
    const formatDate = (date: string | null) => {
        if (!date) return 'Never';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const roleName = user.roles?.[0]?.name || user.role;
    const isSuperAdmin = roleName === 'super_admin';

    return (
        <AppLayout>
            <Head title={`User: ${user.name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/admin/users">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                                <User className="h-6 w-6" />
                                {user.name}
                            </h1>
                            <p className="text-muted-foreground">
                                View user details and permissions
                            </p>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href={`/admin/users/${user.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>User Information</CardTitle>
                            <CardDescription>
                                Basic details about the user
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <User className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Full Name</p>
                                    <p className="font-medium">{user.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Email Address</p>
                                    <p className="font-medium">{user.email}</p>
                                    {user.email_verified_at && (
                                        <Badge variant="outline" className="mt-1 text-green-600">
                                            <CheckCircle2 className="mr-1 h-3 w-3" />
                                            Verified
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Phone Number</p>
                                    <p className="font-medium">{user.phone || 'Not provided'}</p>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Account Status</span>
                                {user.is_active ? (
                                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                        <CheckCircle2 className="mr-1 h-3 w-3" />
                                        Active
                                    </Badge>
                                ) : (
                                    <Badge variant="destructive">
                                        <XCircle className="mr-1 h-3 w-3" />
                                        Inactive
                                    </Badge>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Role</span>
                                <Badge className={roleColors[roleName] || roleColors.viewer}>
                                    {roleName.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Activity Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Activity</CardTitle>
                            <CardDescription>
                                User activity timestamps
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Account Created</p>
                                    <p className="font-medium">{formatDate(user.created_at)}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Clock className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Last Updated</p>
                                    <p className="font-medium">{formatDate(user.updated_at)}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <User className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Last Login</p>
                                    <p className="font-medium">{formatDate(user.last_login_at)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Permissions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Module Permissions
                        </CardTitle>
                        <CardDescription>
                            {isSuperAdmin
                                ? 'Super Admin has full access to all modules'
                                : `This user has access to ${user.all_permissions.length} modules`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isSuperAdmin ? (
                            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 p-4 text-center">
                                <Shield className="h-12 w-12 mx-auto text-amber-600 mb-2" />
                                <p className="font-medium text-amber-800 dark:text-amber-200">
                                    Full Administrative Access
                                </p>
                                <p className="text-sm text-amber-600 dark:text-amber-400">
                                    Super Admin role grants unrestricted access to all modules
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {Object.entries(groupedModules).map(([group, groupModules]) => {
                                    const enabledModules = groupModules.filter((m) =>
                                        user.all_permissions.includes(m.key)
                                    );

                                    if (enabledModules.length === 0) return null;

                                    return (
                                        <div key={group} className="space-y-3">
                                            <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                                                {group}
                                                <span className="ml-2 text-xs font-normal">
                                                    ({enabledModules.length}/{groupModules.length})
                                                </span>
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                                {groupModules.map((module) => {
                                                    const hasAccess = user.all_permissions.includes(module.key);
                                                    return (
                                                        <div
                                                            key={module.key}
                                                            className={`flex items-start gap-3 p-3 rounded-lg border ${
                                                                hasAccess
                                                                    ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800'
                                                                    : 'bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 opacity-50'
                                                            }`}
                                                        >
                                                            {hasAccess ? (
                                                                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                                                            ) : (
                                                                <XCircle className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                                            )}
                                                            <div className="flex-1 min-w-0">
                                                                <div className="font-medium text-sm">
                                                                    {module.name}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground truncate">
                                                                    {module.description}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <Separator />
                                        </div>
                                    );
                                })}

                                {user.all_permissions.length === 0 && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Shield className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                        <p>No permissions assigned</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
