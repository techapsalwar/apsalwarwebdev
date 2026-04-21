<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), geolocation=(), microphone=(), payment=()');

        if ($request->isSecure()) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000');
        }

        if (app()->environment('production')) {
            $response->headers->set('Content-Security-Policy', $this->contentSecurityPolicy());
        }

        return $response;
    }

    private function contentSecurityPolicy(): string
    {
        return implode('; ', [
            "default-src 'self'",
            "base-uri 'self'",
            "frame-ancestors 'self'",
            "object-src 'none'",
            "form-action 'self'",
            "img-src 'self' data: blob: https://envoklear.info https://fonts.bunny.net https://via.placeholder.com https://www.google.com https://www.gstatic.com",
            "font-src 'self' data: https://fonts.bunny.net",
            "style-src 'self' 'unsafe-inline' https://fonts.bunny.net",
            "script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com",
            "connect-src 'self' https://www.google.com https://www.gstatic.com",
            "frame-src 'self' https://calendar.google.com https://erp.awesindia.edu.in https://www.google.com https://www.gstatic.com",
            "media-src 'self' blob:",
            "worker-src 'self' blob:",
        ]);
    }
}