<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class PermissionSeeder extends Seeder
{
    /**
     * Module-level permissions for admin panel.
     * Each permission controls access to an entire admin module.
     */
    protected array $modules = [
        'dashboard' => 'View admin dashboard and statistics',
        'sliders' => 'Manage homepage hero sliders',
        'quick_links' => 'Manage homepage quick links',
        'affirmations' => 'Manage thought of the day',
        'news' => 'Manage news articles',
        'events' => 'Manage school events',
        'announcements' => 'Manage announcements/notices',
        'departments' => 'Manage academic departments',
        'staff' => 'Manage faculty and staff profiles',
        'board_results' => 'Manage board exam results',
        'achievements' => 'Manage school achievements',
        'houses' => 'Manage student houses',
        'clubs' => 'Manage student clubs',
        'alumni' => 'Manage alumni records',
        'fee_structures' => 'Manage fee structures',
        'tc_records' => 'Manage transfer certificates',
        'albums' => 'Manage photo albums and galleries',
        'documents' => 'Manage downloadable documents',
        'contacts' => 'Manage contact form submissions',
        'testimonials' => 'Manage testimonials',
        'partnerships' => 'Manage school partnerships',
        'settings' => 'Manage site settings',
        'facilities' => 'Manage school facilities',
        'committees' => 'Manage school committees',
        'users' => 'Manage users and permissions',
    ];

    /**
     * Default roles with their permissions.
     */
    protected array $roles = [
        'super_admin' => [
            'description' => 'Full system access including user management',
            'permissions' => '*', // All permissions
        ],
        'admin' => [
            'description' => 'Full content management access',
            'permissions' => [
                'dashboard', 'sliders', 'quick_links', 'affirmations',
                'news', 'events', 'announcements', 'departments', 'staff',
                'board_results', 'achievements', 'houses', 'clubs', 'alumni',
                'fee_structures', 'tc_records', 'albums', 'documents',
                'contacts', 'testimonials', 'partnerships', 'settings',
                'facilities', 'committees',
            ],
        ],
        'content_editor' => [
            'description' => 'News, events, and media management',
            'permissions' => [
                'dashboard', 'news', 'events', 'announcements',
                'albums', 'documents', 'affirmations',
            ],
        ],
        'academic_admin' => [
            'description' => 'Academic content management',
            'permissions' => [
                'dashboard', 'departments', 'staff', 'board_results',
                'achievements', 'houses', 'clubs',
            ],
        ],
        'admission_admin' => [
            'description' => 'Admission and TC management',
            'permissions' => [
                'dashboard', 'fee_structures', 'tc_records', 'alumni', 'contacts',
            ],
        ],
        'viewer' => [
            'description' => 'Read-only access to admin panel',
            'permissions' => ['dashboard'],
        ],
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions for each module
        foreach ($this->modules as $module => $description) {
            Permission::firstOrCreate(
                ['name' => $module, 'guard_name' => 'web'],
                ['name' => $module]
            );
        }

        // Create roles and assign permissions
        foreach ($this->roles as $roleName => $roleData) {
            $role = Role::firstOrCreate(
                ['name' => $roleName, 'guard_name' => 'web'],
                ['name' => $roleName]
            );

            // Assign permissions
            if ($roleData['permissions'] === '*') {
                // Super admin gets all permissions
                $role->syncPermissions(Permission::all());
            } else {
                $role->syncPermissions($roleData['permissions']);
            }
        }

        // Assign super_admin role to existing admin users
        $this->assignRolesToExistingUsers();
    }

    /**
     * Assign roles to existing users based on their current role column.
     */
    protected function assignRolesToExistingUsers(): void
    {
        $users = \App\Models\User::all();

        foreach ($users as $user) {
            // Map old role enum to new Spatie role
            $roleMapping = [
                'super_admin' => 'super_admin',
                'admin' => 'admin',
                'editor' => 'content_editor',
                'staff' => 'viewer',
            ];

            $newRole = $roleMapping[$user->role] ?? 'viewer';
            
            // Only assign if user doesn't already have a role
            if (!$user->hasAnyRole(Role::all())) {
                $user->assignRole($newRole);
            }
        }
    }
}
