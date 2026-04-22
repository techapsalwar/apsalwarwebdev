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

        $domains = $this->domainsToClear($request);

        if ($domains === []) {
            return $response;
        }

        $path = (string) config('session.path', '/');
        $sessionCookie = (string) config('session.cookie');

        foreach ($domains as $domain) {
            $response->headers->setCookie(cookie()->forget($sessionCookie, $path, $domain));
            $response->headers->setCookie(cookie()->forget('XSRF-TOKEN', $path, $domain));
        }

        return $response;
    }

    private function domainsToClear(Request $request): array
    {
        if (config('session.domain') !== null) {
            return [];
        }

        $host = $request->getHost();

        if ($host === '' || ! str_contains($host, '.')) {
            return [null];
        }

        $domains = [null, $host];
        $segments = explode('.', $host);

        while (count($segments) > 2) {
            array_shift($segments);
            $domains[] = implode('.', $segments);
        }

        return array_values(array_unique($domains));
    }
}