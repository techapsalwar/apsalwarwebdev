<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ClearLegacyCookieDomain
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $legacyDomain = $this->legacyDomain($request);

        if ($legacyDomain === null) {
            return $response;
        }

        $path = (string) config('session.path', '/');

        $response->headers->setCookie(cookie()->forget(config('session.cookie'), $path, $legacyDomain));
        $response->headers->setCookie(cookie()->forget('XSRF-TOKEN', $path, $legacyDomain));

        return $response;
    }

    private function legacyDomain(Request $request): ?string
    {
        if (config('session.domain') !== null) {
            return null;
        }

        $host = $request->getHost();

        if ($host === '' || ! str_contains($host, '.')) {
            return null;
        }

        return $host;
    }
}