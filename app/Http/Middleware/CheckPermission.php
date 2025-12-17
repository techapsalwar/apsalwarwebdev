<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * Check if user has the required module-level permission.
     * Super admins bypass all permission checks.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  $permission  The module permission name (e.g., 'news', 'events', 'users')
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $user = $request->user();

        // Not authenticated
        if (!$user) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }
            return redirect()->route('login');
        }

        // Super admin bypasses all permission checks
        if ($user->hasRole('super_admin')) {
            return $next($request);
        }

        // Check if user has the required permission
        if (!$user->hasPermissionTo($permission)) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'You do not have permission to access this resource.',
                    'required_permission' => $permission,
                ], 403);
            }

            // For Inertia requests, return 403 which will be handled by frontend
            if ($request->header('X-Inertia')) {
                return inertia('errors/403', [
                    'message' => 'You do not have permission to access this module.',
                    'permission' => $permission,
                ])->toResponse($request)->setStatusCode(403);
            }

            abort(403, 'You do not have permission to access this resource.');
        }

        return $next($request);
    }
}
