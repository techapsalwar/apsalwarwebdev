import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
    Card,
    CardContent,
    CardDescription,
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
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Save, Shield, UserCog } from 'lucide-react';

interface Role {
    id: number;
    name: string;
}

interface Module {
    key: string;
    name: string;
    description: string;
}

interface GroupedModules {
    [group: string]: Module[];
}

interface User {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    is_active: boolean;
    role: string;
    direct_permissions: string[];
    all_permissions: string[];
    created_at: string;
    last_login_at: string | null;
}

interface Props {
    user: User;
    roles: Role[];
    permissions: string[];
    modules: Record<string, { name: string; description: string; group: string }>;
    groupedModules: GroupedModules;
}

export default function EditUser({ user, roles, permissions, modules, groupedModules }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        phone: user.phone || '',
        role: user.role,
        permissions: user.all_permissions,
        is_active: user.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`);
    };

    const togglePermission = (permission: string) => {
        setData('permissions', 
            data.permissions.includes(permission)
                ? data.permissions.filter((p) => p !== permission)
                : [...data.permissions, permission]
        );
    };

    const toggleGroup = (group: string) => {
        const groupPermissions = groupedModules[group].map((m) => m.key);
        const allSelected = groupPermissions.every((p) => data.permissions.includes(p));
        
        if (allSelected) {
            setData('permissions', data.permissions.filter((p) => !groupPermissions.includes(p)));
        } else {
            setData('permissions', [...new Set([...data.permissions, ...groupPermissions])]);
        }
    };

    const selectAllPermissions = () => {
        setData('permissions', permissions);
    };

    const deselectAllPermissions = () => {
        setData('permissions', []);
    };

    const isSuperAdmin = data.role === 'super_admin';

    return (
        <AppLayout>
            <Head title={`Edit User: ${user.name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/users">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <UserCog className="h-6 w-6" />
                            Edit User
                        </h1>
                        <p className="text-muted-foreground">
                            Update user details and permissions
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className={errors.name ? 'border-red-500' : ''}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">{errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className={errors.email ? 'border-red-500' : ''}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500">{errors.email}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="+91 98765 43210"
                                    />
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <Label htmlFor="password">New Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Leave blank to keep current password"
                                        className={errors.password ? 'border-red-500' : ''}
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-red-500">{errors.password}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">Confirm New Password</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Leave blank to keep current password"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Role & Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Role & Status</CardTitle>
                                <CardDescription>
                                    Manage role and account status
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role *</Label>
                                    <Select
                                        value={data.role}
                                        onValueChange={(value) => setData('role', value)}
                                    >
                                        <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map((role) => (
                                                <SelectItem key={role.id} value={role.name}>
                                                    {role.name.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.role && (
                                        <p className="text-sm text-red-500">{errors.role}</p>
                                    )}
                                    {isSuperAdmin && (
                                        <p className="text-sm text-amber-600">
                                            ⚠️ Super Admin has full access to all modules
                                        </p>
                                    )}
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Account Status</Label>
                                        <p className="text-sm text-muted-foreground">
                                            User can only login if active
                                        </p>
                                    </div>
                                    <Switch
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked)}
                                    />
                                </div>

                                <Separator />

                                <div className="text-sm text-muted-foreground space-y-1">
                                    <p>
                                        <span className="font-medium">Created:</span>{' '}
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </p>
                                    <p>
                                        <span className="font-medium">Last Login:</span>{' '}
                                        {user.last_login_at
                                            ? new Date(user.last_login_at).toLocaleDateString()
                                            : 'Never'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Permissions */}
                    {!isSuperAdmin && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <Shield className="h-5 w-5" />
                                            Module Permissions
                                        </CardTitle>
                                        <CardDescription>
                                            Select which admin modules this user can access
                                        </CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={selectAllPermissions}
                                        >
                                            Select All
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={deselectAllPermissions}
                                        >
                                            Deselect All
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {Object.entries(groupedModules).map(([group, groupModules]) => {
                                        const groupPermissions = groupModules.map((m) => m.key);
                                        const selectedInGroup = groupPermissions.filter((p) =>
                                            data.permissions.includes(p)
                                        ).length;
                                        const allSelected = selectedInGroup === groupPermissions.length;

                                        return (
                                            <div key={group} className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                                                        {group}
                                                        <span className="ml-2 text-xs font-normal">
                                                            ({selectedInGroup}/{groupPermissions.length})
                                                        </span>
                                                    </h4>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => toggleGroup(group)}
                                                    >
                                                        {allSelected ? 'Deselect All' : 'Select All'}
                                                    </Button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                                    {groupModules.map((module) => (
                                                        <label
                                                            key={module.key}
                                                            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                                                data.permissions.includes(module.key)
                                                                    ? 'bg-primary/5 border-primary'
                                                                    : 'hover:bg-muted/50'
                                                            }`}
                                                        >
                                                            <Checkbox
                                                                checked={data.permissions.includes(module.key)}
                                                                onCheckedChange={() => togglePermission(module.key)}
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="font-medium text-sm">
                                                                    {module.name}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground truncate">
                                                                    {module.description}
                                                                </div>
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                                <Separator />
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-4">
                        <Button variant="outline" asChild>
                            <Link href="/admin/users">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
