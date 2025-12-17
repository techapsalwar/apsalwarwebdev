<?php

namespace App\Http\Middleware;

use App\Models\QuickLink;
use App\Models\Setting;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        // Get user permissions for sidebar filtering
        $userPermissions = [];
        $userRole = null;
        
        if ($user = $request->user()) {
            $userRole = $user->roles->first()?->name;
            
            // Super admin has all permissions
            if ($userRole === 'super_admin') {
                $userPermissions = ['*']; // Wildcard for all permissions
            } else {
                $userPermissions = $user->getAllPermissions()->pluck('name')->toArray();
            }
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
                'role' => $userRole,
                'permissions' => $userPermissions,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'quickLinks' => QuickLink::active()
                ->orderBy('order')
                ->get(['id', 'title', 'url', 'target', 'is_new']),
            'socialLinks' => Setting::getByGroup('social'),
        ];
    }
}
