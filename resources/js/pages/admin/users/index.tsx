import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Plus,
    Search,
    MoreVertical,
    Pencil,
    Trash2,
    Shield,
    ShieldCheck,
    ShieldX,
    UserCog,
    Save,
    X,
    Info,
    Users,
    Lock,
} from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    is_active: boolean;
    created_at: string;
    last_login_at: string | null;
    roles: Array<{ id: number; name: string }>;
    permissions: Array<{ id: number; name: string }>;
}

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

interface Props {
    users: {
        data: User[];
        links: any;
        meta: any;
    };
    permissions: string[];
    roles: Role[];
    modules: Record<string, { name: string; description: string; group: string }>;
    groupedModules: GroupedModules;
    filters: {
        search?: string;
        role?: string;
        is_active?: string;
    };
}

export default function UsersIndex({
    users,
    permissions,
    roles,
    modules,
    groupedModules,
    filters,
}: Props) {
    const { flash } = usePage().props as any;
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || '');
    const [deleteDialog, setDeleteDialog] = useState<User | null>(null);
    const [permissionDialog, setPermissionDialog] = useState<User | null>(null);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);

    // Handle search
    const handleSearch = () => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (roleFilter && roleFilter !== 'all') params.set('role', roleFilter);
        router.get(`/admin/users?${params.toString()}`, {}, { preserveState: true });
    };

    // Handle role filter
    const handleRoleFilter = (value: string) => {
        setRoleFilter(value);
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (value && value !== 'all') params.set('role', value);
        router.get(`/admin/users?${params.toString()}`, {}, { preserveState: true });
    };

    // Open permission dialog
    const openPermissionDialog = (user: User) => {
        const userPermissions = user.permissions.map((p) => p.name);
        setSelectedPermissions(userPermissions);
        setPermissionDialog(user);
    };

    // Toggle permission
    const togglePermission = (permission: string) => {
        setSelectedPermissions((prev) =>
            prev.includes(permission)
                ? prev.filter((p) => p !== permission)
                : [...prev, permission]
        );
    };

    // Toggle all permissions in a group
    const toggleGroup = (group: string) => {
        const groupPermissions = groupedModules[group].map((m) => m.key);
        const allSelected = groupPermissions.every((p) => selectedPermissions.includes(p));
        
        if (allSelected) {
            setSelectedPermissions((prev) => prev.filter((p) => !groupPermissions.includes(p)));
        } else {
            setSelectedPermissions((prev) => [...new Set([...prev, ...groupPermissions])]);
        }
    };

    // Save permissions
    const savePermissions = () => {
        if (!permissionDialog) return;
        
        setSaving(true);
        router.post(
            `/admin/users/${permissionDialog.id}/permissions`,
            { permissions: selectedPermissions },
            {
                onSuccess: () => {
                    setPermissionDialog(null);
                    setSaving(false);
                },
                onError: () => setSaving(false),
            }
        );
    };

    // Delete user
    const handleDelete = () => {
        if (!deleteDialog) return;
        router.delete(`/admin/users/${deleteDialog.id}`, {
            onSuccess: () => setDeleteDialog(null),
        });
    };

    // Toggle active status
    const toggleActive = (user: User) => {
        router.post(`/admin/users/${user.id}/toggle-active`);
    };

    // Get role badge color
    const getRoleBadgeColor = (roleName: string) => {
        switch (roleName) {
            case 'super_admin':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
            case 'admin':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
            case 'content_editor':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
            case 'academic_admin':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
            case 'admission_admin':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
        }
    };

    return (
        <AppLayout>
            <Head title="User Management" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <Users className="h-6 w-6" />
                            User Management
                        </h1>
                        <p className="text-muted-foreground">
                            Manage users and their module-level permissions
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/users/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add User
                        </Link>
                    </Button>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="rounded-lg bg-green-50 p-4 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                        {flash.error}
                    </div>
                )}

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name or email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    className="pl-9"
                                />
                            </div>
                            <Select value={roleFilter || 'all'} onValueChange={handleRoleFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    {roles.map((role) => (
                                        <SelectItem key={role.id} value={role.name}>
                                            {role.name.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button onClick={handleSearch} variant="secondary">
                                <Search className="mr-2 h-4 w-4" />
                                Search
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Users</CardTitle>
                        <CardDescription>
                            Click the shield icon to manage module-level permissions for each user
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Permissions</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.data.map((user) => {
                                    const isSuperAdmin = user.roles.some((r) => r.name === 'super_admin');
                                    const permissionCount = isSuperAdmin
                                        ? permissions.length
                                        : user.permissions.length;

                                    return (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{user.name}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {user.roles.map((role) => (
                                                    <Badge
                                                        key={role.id}
                                                        className={getRoleBadgeColor(role.name)}
                                                    >
                                                        {role.name === 'super_admin' && (
                                                            <ShieldCheck className="mr-1 h-3 w-3" />
                                                        )}
                                                        {role.name.replace('_', ' ')}
                                                    </Badge>
                                                ))}
                                            </TableCell>
                                            <TableCell>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => openPermissionDialog(user)}
                                                                disabled={isSuperAdmin}
                                                            >
                                                                {isSuperAdmin ? (
                                                                    <Lock className="mr-1 h-3 w-3" />
                                                                ) : (
                                                                    <Shield className="mr-1 h-3 w-3" />
                                                                )}
                                                                {permissionCount} / {permissions.length}
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            {isSuperAdmin
                                                                ? 'Super Admin has all permissions'
                                                                : 'Click to manage permissions'}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={user.is_active ? 'default' : 'secondary'}
                                                    className={
                                                        user.is_active
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }
                                                >
                                                    {user.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/users/${user.id}/edit`}>
                                                                <Pencil className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => openPermissionDialog(user)}
                                                            disabled={isSuperAdmin}
                                                        >
                                                            <UserCog className="mr-2 h-4 w-4" />
                                                            Permissions
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => toggleActive(user)}>
                                                            {user.is_active ? (
                                                                <>
                                                                    <ShieldX className="mr-2 h-4 w-4" />
                                                                    Deactivate
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <ShieldCheck className="mr-2 h-4 w-4" />
                                                                    Activate
                                                                </>
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-destructive"
                                                            onClick={() => setDeleteDialog(user)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}

                                {users.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">
                                            <div className="text-muted-foreground">
                                                No users found
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Permission Dialog */}
                <Dialog
                    open={!!permissionDialog}
                    onOpenChange={() => setPermissionDialog(null)}
                >
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Manage Permissions: {permissionDialog?.name}
                            </DialogTitle>
                            <DialogDescription>
                                Select which admin modules this user can access.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6 py-4">
                            {Object.entries(groupedModules).map(([group, groupModules]) => {
                                const groupPermissions = groupModules.map((m) => m.key);
                                const selectedInGroup = groupPermissions.filter((p) =>
                                    selectedPermissions.includes(p)
                                ).length;
                                const allSelected = selectedInGroup === groupPermissions.length;

                                return (
                                    <div key={group} className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                                                {group}
                                            </h4>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toggleGroup(group)}
                                            >
                                                {allSelected ? 'Deselect All' : 'Select All'}
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {groupModules.map((module) => (
                                                <label
                                                    key={module.key}
                                                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                                        selectedPermissions.includes(module.key)
                                                            ? 'bg-primary/5 border-primary'
                                                            : 'hover:bg-muted/50'
                                                    }`}
                                                >
                                                    <Checkbox
                                                        checked={selectedPermissions.includes(module.key)}
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

                        <DialogFooter>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mr-auto">
                                <Info className="h-4 w-4" />
                                {selectedPermissions.length} of {permissions.length} modules selected
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => setPermissionDialog(null)}
                            >
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                            </Button>
                            <Button onClick={savePermissions} disabled={saving}>
                                <Save className="mr-2 h-4 w-4" />
                                {saving ? 'Saving...' : 'Save Permissions'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete User</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete{' '}
                                <span className="font-semibold">{deleteDialog?.name}</span>? This
                                action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteDialog(null)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDelete}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
