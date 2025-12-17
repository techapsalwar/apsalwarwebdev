<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Module definitions with descriptions for UI.
     */
    protected array $moduleDefinitions = [
        'dashboard' => ['name' => 'Dashboard', 'description' => 'View admin dashboard and statistics', 'group' => 'Main'],
        'sliders' => ['name' => 'Home Sliders', 'description' => 'Manage homepage hero sliders', 'group' => 'Content'],
        'quick_links' => ['name' => 'Quick Links', 'description' => 'Manage homepage quick links', 'group' => 'Content'],
        'affirmations' => ['name' => 'Affirmations', 'description' => 'Manage thought of the day', 'group' => 'Content'],
        'news' => ['name' => 'News', 'description' => 'Manage news articles', 'group' => 'News & Events'],
        'events' => ['name' => 'Events', 'description' => 'Manage school events', 'group' => 'News & Events'],
        'announcements' => ['name' => 'Announcements', 'description' => 'Manage announcements/notices', 'group' => 'News & Events'],
        'departments' => ['name' => 'Departments', 'description' => 'Manage academic departments', 'group' => 'Academics'],
        'staff' => ['name' => 'Staff', 'description' => 'Manage faculty and staff profiles', 'group' => 'Academics'],
        'board_results' => ['name' => 'Board Results', 'description' => 'Manage board exam results', 'group' => 'Academics'],
        'achievements' => ['name' => 'Achievements', 'description' => 'Manage school achievements', 'group' => 'Academics'],
        'houses' => ['name' => 'Houses', 'description' => 'Manage student houses', 'group' => 'Student Life'],
        'clubs' => ['name' => 'Clubs', 'description' => 'Manage student clubs', 'group' => 'Student Life'],
        'alumni' => ['name' => 'Alumni', 'description' => 'Manage alumni records', 'group' => 'Student Life'],
        'fee_structures' => ['name' => 'Fee Structure', 'description' => 'Manage fee structures', 'group' => 'Admission'],
        'tc_records' => ['name' => 'Transfer Certificates', 'description' => 'Manage transfer certificates', 'group' => 'Admission'],
        'albums' => ['name' => 'Photo Albums', 'description' => 'Manage photo albums and galleries', 'group' => 'Media'],
        'documents' => ['name' => 'Documents', 'description' => 'Manage downloadable documents', 'group' => 'Media'],
        'contacts' => ['name' => 'Contacts', 'description' => 'Manage contact form submissions', 'group' => 'Interactions'],
        'testimonials' => ['name' => 'Testimonials', 'description' => 'Manage testimonials', 'group' => 'Interactions'],
        'partnerships' => ['name' => 'Partnerships', 'description' => 'Manage school partnerships', 'group' => 'Interactions'],
        'settings' => ['name' => 'Site Settings', 'description' => 'Manage site settings', 'group' => 'Settings'],
        'facilities' => ['name' => 'Facilities', 'description' => 'Manage school facilities', 'group' => 'Settings'],
        'committees' => ['name' => 'Committees', 'description' => 'Manage school committees', 'group' => 'Settings'],
        'users' => ['name' => 'Users', 'description' => 'Manage users and permissions', 'group' => 'Settings'],
    ];

    /**
     * Display a listing of users with their permissions.
     */
    public function index(Request $request)
    {
        $query = User::with(['roles', 'permissions']);

        // Search
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by role
        if ($role = $request->input('role')) {
            $query->whereHas('roles', fn($q) => $q->where('name', $role));
        }

        // Filter by status
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $users = $query->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        // Get all permissions and roles for the UI
        $permissions = Permission::all()->pluck('name')->toArray();
        $roles = Role::all();

        // Group modules by their group for organized display
        $groupedModules = [];
        foreach ($this->moduleDefinitions as $key => $module) {
            $group = $module['group'];
            if (!isset($groupedModules[$group])) {
                $groupedModules[$group] = [];
            }
            $groupedModules[$group][] = [
                'key' => $key,
                'name' => $module['name'],
                'description' => $module['description'],
            ];
        }

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'permissions' => $permissions,
            'roles' => $roles,
            'modules' => $this->moduleDefinitions,
            'groupedModules' => $groupedModules,
            'filters' => $request->only(['search', 'role', 'is_active']),
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create()
    {
        $roles = Role::all();
        $permissions = Permission::all()->pluck('name')->toArray();

        // Group modules by their group for organized display
        $groupedModules = [];
        foreach ($this->moduleDefinitions as $key => $module) {
            $group = $module['group'];
            if (!isset($groupedModules[$group])) {
                $groupedModules[$group] = [];
            }
            $groupedModules[$group][] = [
                'key' => $key,
                'name' => $module['name'],
                'description' => $module['description'],
            ];
        }

        return Inertia::render('admin/users/create', [
            'roles' => $roles,
            'permissions' => $permissions,
            'modules' => $this->moduleDefinitions,
            'groupedModules' => $groupedModules,
        ]);
    }

    /**
     * Store a newly created user.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Password::defaults()],
            'phone' => ['nullable', 'string', 'max:20'],
            'role' => ['required', 'string', 'exists:roles,name'],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
            'is_active' => ['boolean'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phone'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'role' => $this->mapSpatieRoleToEnum($validated['role']),
        ]);

        // Assign role
        $user->assignRole($validated['role']);

        // If not super_admin, assign individual permissions (super_admin gets all via role)
        if ($validated['role'] !== 'super_admin' && !empty($validated['permissions'])) {
            $user->syncPermissions($validated['permissions']);
        }

        return redirect()->route('admin.users.index')
            ->with('success', 'User created successfully.');
    }

    /**
     * Show the form for editing a user.
     */
    public function edit(User $user)
    {
        $user->load(['roles', 'permissions']);
        
        $roles = Role::all();
        $permissions = Permission::all()->pluck('name')->toArray();

        // Group modules by their group for organized display
        $groupedModules = [];
        foreach ($this->moduleDefinitions as $key => $module) {
            $group = $module['group'];
            if (!isset($groupedModules[$group])) {
                $groupedModules[$group] = [];
            }
            $groupedModules[$group][] = [
                'key' => $key,
                'name' => $module['name'],
                'description' => $module['description'],
            ];
        }

        // Get user's direct permissions (not via role)
        $userPermissions = $user->getDirectPermissions()->pluck('name')->toArray();
        
        // Get user's all permissions (including via role)
        $allUserPermissions = $user->getAllPermissions()->pluck('name')->toArray();

        return Inertia::render('admin/users/edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'is_active' => $user->is_active,
                'role' => $user->roles->first()?->name ?? 'viewer',
                'direct_permissions' => $userPermissions,
                'all_permissions' => $allUserPermissions,
                'created_at' => $user->created_at,
                'last_login_at' => $user->last_login_at,
            ],
            'roles' => $roles,
            'permissions' => $permissions,
            'modules' => $this->moduleDefinitions,
            'groupedModules' => $groupedModules,
        ]);
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, User $user)
    {
        // Prevent editing super_admin if current user is not super_admin
        if ($user->hasRole('super_admin') && !auth()->user()->hasRole('super_admin')) {
            return back()->with('error', 'You cannot edit a super admin user.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => ['nullable', 'confirmed', Password::defaults()],
            'phone' => ['nullable', 'string', 'max:20'],
            'role' => ['required', 'string', 'exists:roles,name'],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
            'is_active' => ['boolean'],
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'role' => $this->mapSpatieRoleToEnum($validated['role']),
        ]);

        // Update password if provided
        if (!empty($validated['password'])) {
            $user->update(['password' => Hash::make($validated['password'])]);
        }

        // Sync role (remove old, add new)
        $user->syncRoles([$validated['role']]);

        // If not super_admin, sync individual permissions
        if ($validated['role'] !== 'super_admin') {
            $user->syncPermissions($validated['permissions'] ?? []);
        } else {
            // Super admin doesn't need direct permissions (has all via role)
            $user->syncPermissions([]);
        }

        return redirect()->route('admin.users.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Update only the permissions for a user (quick update from index page).
     */
    public function updatePermissions(Request $request, User $user)
    {
        // Prevent editing super_admin if current user is not super_admin
        if ($user->hasRole('super_admin') && !auth()->user()->hasRole('super_admin')) {
            return back()->with('error', 'You cannot edit a super admin user.');
        }

        // Prevent users from editing their own permissions
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot edit your own permissions.');
        }

        $validated = $request->validate([
            'permissions' => ['required', 'array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
        ]);

        // For super_admin role, don't change permissions (they have all)
        if (!$user->hasRole('super_admin')) {
            $user->syncPermissions($validated['permissions']);
        }

        return back()->with('success', 'Permissions updated successfully.');
    }

    /**
     * Remove the specified user.
     */
    public function destroy(User $user)
    {
        // Prevent deleting yourself
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        // Prevent deleting super_admin if current user is not super_admin
        if ($user->hasRole('super_admin') && !auth()->user()->hasRole('super_admin')) {
            return back()->with('error', 'You cannot delete a super admin user.');
        }

        // Prevent deleting the last super_admin
        if ($user->hasRole('super_admin')) {
            $superAdminCount = User::whereHas('roles', fn($q) => $q->where('name', 'super_admin'))->count();
            if ($superAdminCount <= 1) {
                return back()->with('error', 'Cannot delete the last super admin user.');
            }
        }

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'User deleted successfully.');
    }

    /**
     * Toggle user active status.
     */
    public function toggleActive(User $user)
    {
        // Prevent toggling yourself
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot deactivate your own account.');
        }

        // Prevent deactivating super_admin if current user is not super_admin
        if ($user->hasRole('super_admin') && !auth()->user()->hasRole('super_admin')) {
            return back()->with('error', 'You cannot deactivate a super admin user.');
        }

        $user->update(['is_active' => !$user->is_active]);

        $status = $user->is_active ? 'activated' : 'deactivated';
        return back()->with('success', "User {$status} successfully.");
    }

    /**
     * Map Spatie role name to legacy enum value.
     */
    protected function mapSpatieRoleToEnum(string $role): string
    {
        return match ($role) {
            'super_admin' => 'super_admin',
            'admin' => 'admin',
            'content_editor' => 'editor',
            'academic_admin' => 'editor',
            'admission_admin' => 'editor',
            'viewer' => 'staff',
            default => 'staff',
        };
    }
}
