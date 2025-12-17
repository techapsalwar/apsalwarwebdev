# World-Class School Website Best Practices
## Comprehensive Guide for APS Alwar School Website

> A structured compilation of industry best practices for building a modern, accessible, secure, and high-performance school website using Laravel + React/Inertia.js

---

## Table of Contents
1. [PWA Implementation](#1-pwa-implementation)
2. [Performance Optimization](#2-performance-optimization)
3. [SEO Best Practices](#3-seo-best-practices)
4. [Security Best Practices](#4-security-best-practices)
5. [Admin Panel Best Practices](#5-admin-panel-best-practices)
6. [Accessibility (WCAG 2.1)](#6-accessibility-wcag-21)
7. [Modern School Website Features](#7-modern-school-website-features)

---

## 1. PWA Implementation

### 1.1 Web App Manifest
Create a comprehensive manifest for installability:

```json
{
  "name": "Army Public School Alwar",
  "short_name": "APS Alwar",
  "description": "Official website of Army Public School, Alwar",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1e40af",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "categories": ["education", "school"],
  "screenshots": [
    {
      "src": "/screenshots/home.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    }
  ]
}
```

### 1.2 Service Worker Strategy
Implement strategic caching for school websites:

**Recommended Caching Strategies:**
- **Cache First** - Static assets (images, CSS, fonts)
- **Network First** - News, announcements, notices (always fresh when online)
- **Stale While Revalidate** - Academic calendar, faculty info
- **Network Only** - Admission forms, fee payments

```javascript
// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered:', registration.scope);
      })
      .catch(error => {
        console.log('SW registration failed:', error);
      });
  });
}
```

### 1.3 Offline Capabilities for Schools
**Essential Offline Content:**
- School information and contact details
- Academic calendar
- Fee structure
- Emergency contact numbers
- Campus map
- Previously viewed notices

**Implementation with IndexedDB:**
```javascript
// Store notices offline
const dbPromise = idb.openDB('school-db', 1, {
  upgrade(db) {
    db.createObjectStore('notices', { keyPath: 'id' });
    db.createObjectStore('calendar', { keyPath: 'month' });
  }
});
```

### 1.4 Push Notifications
**School-Specific Notification Categories:**
- Exam schedules and results
- Holiday announcements
- Fee payment reminders
- Emergency alerts (school closure)
- Event reminders
- PTM schedules

```javascript
// Request notification permission
Notification.requestPermission().then(permission => {
  if (permission === 'granted') {
    // Subscribe to push notifications
    subscribeToPush();
  }
});
```

### 1.5 Installation Prompt
```javascript
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallButton();
});

function installApp() {
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    deferredPrompt = null;
  });
}
```

---

## 2. Performance Optimization

### 2.1 Server-Side Rendering (SSR) with Inertia.js

**Setup SSR Entry Point (`resources/js/ssr.js`):**
```javascript
import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import ReactDOMServer from 'react-dom/server';

createServer((page) =>
  createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    resolve: (name) => {
      const pages = import.meta.glob('./pages/**/*.tsx', { eager: true });
      return pages[`./pages/${name}.tsx`];
    },
    setup: ({ App, props }) => <App {...props} />,
  })
);
```

**Vite Configuration for SSR:**
```javascript
// vite.config.ts
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/js/app.tsx'],
      ssr: 'resources/js/ssr.tsx',
      refresh: true,
    }),
    react(),
  ],
});
```

**Build and Run:**
```bash
vite build && vite build --ssr
php artisan inertia:start-ssr
```

### 2.2 Image Optimization

**Format Selection:**
| Use Case | Recommended Format | Fallback |
|----------|-------------------|----------|
| Photos (Hero images, Gallery) | AVIF → WebP → JPEG | JPEG |
| Logos, Icons | SVG | PNG-8 |
| Transparent images | WebP | PNG-24 |
| Animated content | WebP animated | GIF |

**Responsive Images Implementation:**
```html
<picture>
  <source 
    type="image/avif" 
    srcset="hero-480w.avif 480w,
            hero-800w.avif 800w,
            hero-1200w.avif 1200w"
    sizes="(max-width: 600px) 100vw, 50vw">
  <source 
    type="image/webp" 
    srcset="hero-480w.webp 480w,
            hero-800w.webp 800w,
            hero-1200w.webp 1200w"
    sizes="(max-width: 600px) 100vw, 50vw">
  <img 
    src="hero-800w.jpg" 
    alt="APS Alwar Campus" 
    width="800" 
    height="600"
    loading="lazy"
    decoding="async">
</picture>
```

**Critical Image Loading:**
```html
<!-- Above-the-fold images: eager loading with priority -->
<img src="hero.webp" fetchpriority="high" loading="eager">

<!-- Below-the-fold images: lazy loading -->
<img src="gallery-1.webp" loading="lazy">
```

### 2.3 Code Splitting
```typescript
// React lazy loading for routes
import { lazy, Suspense } from 'react';

const Gallery = lazy(() => import('./pages/Gallery'));
const Admissions = lazy(() => import('./pages/Admissions'));

// Usage
<Suspense fallback={<Loading />}>
  <Gallery />
</Suspense>
```

### 2.4 Database Query Optimization

**Eager Loading (N+1 Prevention):**
```php
// Bad - N+1 queries
$notices = Notice::all();
foreach ($notices as $notice) {
    echo $notice->author->name; // Query per notice
}

// Good - Eager loading
$notices = Notice::with('author')->get();
```

**Query Caching:**
```php
// Cache frequently accessed data
$academicCalendar = Cache::remember('academic_calendar', 3600, function () {
    return AcademicEvent::where('year', date('Y'))
        ->orderBy('date')
        ->get();
});
```

### 2.5 Redis Caching Strategy

**Cache Configuration:**
```php
// config/cache.php
'default' => env('CACHE_DRIVER', 'redis'),

// Cache common data
Cache::tags(['notices'])->remember('latest_notices', 600, fn() => 
    Notice::latest()->take(10)->get()
);

// Invalidate on update
Cache::tags(['notices'])->flush();
```

**Recommended Cache Times:**
| Content Type | Cache Duration |
|--------------|----------------|
| Static pages (About, Contact) | 24 hours |
| News/Notices list | 10 minutes |
| Gallery images list | 1 hour |
| Fee structure | 24 hours |
| Faculty list | 1 hour |
| Academic calendar | 1 hour |

### 2.6 Asset Optimization with Vite

**Asset Prefetching:**
```php
// AppServiceProvider.php
use Illuminate\Support\Facades\Vite;

public function boot(): void
{
    Vite::prefetch(concurrency: 3);
}
```

**CDN Configuration:**
```env
ASSET_URL=https://cdn.apsalwar.edu.in
```

### 2.7 Core Web Vitals Targets

| Metric | Target | Description |
|--------|--------|-------------|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | Hero image/main content load |
| **INP** (Interaction to Next Paint) | ≤ 200ms | Button clicks, form interactions |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | Visual stability |

**LCP Optimization:**
- Preload hero images
- Use `fetchpriority="high"` for critical images
- Inline critical CSS
- Server-side render above-the-fold content

**CLS Prevention:**
```css
/* Always define dimensions */
img, video, iframe {
  aspect-ratio: attr(width) / attr(height);
}

/* Reserve space for dynamic content */
.notice-card {
  min-height: 200px;
}
```

---

## 3. SEO Best Practices

### 3.1 Schema.org Markup (EducationalOrganization)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "School",
  "name": "Army Public School, Alwar",
  "alternateName": "APS Alwar",
  "url": "https://www.apsalwar.edu.in",
  "logo": "https://www.apsalwar.edu.in/logo.png",
  "image": "https://www.apsalwar.edu.in/campus.jpg",
  "description": "Army Public School, Alwar - A CBSE affiliated school providing quality education from Nursery to Class XII",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Military Station",
    "addressLocality": "Alwar",
    "addressRegion": "Rajasthan",
    "postalCode": "301001",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "27.5530",
    "longitude": "76.6346"
  },
  "telephone": "+91-XXXX-XXXXXX",
  "email": "info@apsalwar.edu.in",
  "foundingDate": "YYYY",
  "isAccreditedBy": {
    "@type": "Organization",
    "name": "Central Board of Secondary Education (CBSE)"
  },
  "hasCredential": {
    "@type": "EducationalOccupationalCredential",
    "credentialCategory": "CBSE Affiliation",
    "recognizedBy": {
      "@type": "Organization",
      "name": "CBSE"
    }
  },
  "sameAs": [
    "https://www.facebook.com/apsalwar",
    "https://www.instagram.com/apsalwar",
    "https://twitter.com/apsalwar"
  ],
  "openingHours": "Mo-Sa 08:00-14:30",
  "priceRange": "$$"
}
</script>
```

### 3.2 Event Schema (School Events)
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "Annual Sports Day 2025",
  "startDate": "2025-02-15T09:00",
  "endDate": "2025-02-15T16:00",
  "location": {
    "@type": "Place",
    "name": "APS Alwar Sports Ground",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Alwar"
    }
  },
  "organizer": {
    "@type": "School",
    "name": "Army Public School, Alwar"
  },
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode"
}
</script>
```

### 3.3 Meta Tags Implementation

```php
// Laravel Head Component
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Primary Meta Tags -->
    <title>{{ $title }} | Army Public School Alwar</title>
    <meta name="title" content="{{ $title }} | Army Public School Alwar">
    <meta name="description" content="{{ $description }}">
    <meta name="keywords" content="APS Alwar, Army Public School, CBSE School Alwar, Best School Alwar">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:title" content="{{ $title }}">
    <meta property="og:description" content="{{ $description }}">
    <meta property="og:image" content="{{ $ogImage }}">
    <meta property="og:site_name" content="Army Public School Alwar">
    <meta property="og:locale" content="en_IN">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="{{ url()->current() }}">
    <meta property="twitter:title" content="{{ $title }}">
    <meta property="twitter:description" content="{{ $description }}">
    <meta property="twitter:image" content="{{ $ogImage }}">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="{{ url()->current() }}">
    
    <!-- Alternate Languages (if applicable) -->
    <link rel="alternate" hreflang="en" href="{{ url()->current() }}">
    <link rel="alternate" hreflang="hi" href="{{ url()->current() }}?lang=hi">
</head>
```

### 3.4 XML Sitemap Structure
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
  <url>
    <loc>https://www.apsalwar.edu.in/</loc>
    <lastmod>2025-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.apsalwar.edu.in/admissions</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <!-- Dynamic: News/Notices -->
  <url>
    <loc>https://www.apsalwar.edu.in/notices</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

### 3.5 Robots.txt
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /storage/private/

Sitemap: https://www.apsalwar.edu.in/sitemap.xml
```

---

## 4. Security Best Practices

### 4.1 Laravel Security Fundamentals

**Environment Configuration:**
```env
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:generated-key-here

# Session Security
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_SECURE_COOKIE=true
```

**Cookie Security (`config/session.php`):**
```php
return [
    'secure' => env('SESSION_SECURE_COOKIE', true),
    'http_only' => true,
    'same_site' => 'lax',
    'domain' => null, // Same origin only
];
```

### 4.2 CSRF Protection
```php
// Already enabled by default in web middleware
// In Blade templates
<form method="POST" action="/contact">
    @csrf
    <!-- form fields -->
</form>

// For AJAX (React/Inertia)
// Inertia handles this automatically
```

### 4.3 XSS Prevention

**Blade Templating:**
```php
// Escaped output (safe)
{{ $userInput }}

// Raw output (use sparingly, only for trusted HTML)
{!! $trustedHtml !!}
```

**React/Inertia:**
```tsx
// React automatically escapes by default
<p>{userInput}</p>

// Dangerous - avoid unless necessary
<div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
```

### 4.4 SQL Injection Prevention

**Always use Eloquent or Query Builder:**
```php
// Safe - parameterized queries
User::where('email', $request->email)->first();

// Safe with bindings
DB::select('SELECT * FROM users WHERE email = ?', [$email]);

// DANGEROUS - never do this
DB::select("SELECT * FROM users WHERE email = '$email'");
```

**Column Name Validation:**
```php
// Validate sortable columns
$request->validate([
    'sortBy' => 'in:name,created_at,updated_at'
]);
$users = User::orderBy($request->validated()['sortBy'])->get();
```

### 4.5 Two-Factor Authentication (Laravel Fortify)

**Enable 2FA in Fortify:**
```php
// config/fortify.php
'features' => [
    Features::registration(),
    Features::resetPasswords(),
    Features::emailVerification(),
    Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]),
],
```

**User Model Setup:**
```php
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    use TwoFactorAuthenticatable;
}
```

### 4.6 Role-Based Access Control (RBAC)

**Define Gates:**
```php
// AppServiceProvider
Gate::define('manage-notices', function (User $user) {
    return $user->role === 'admin' || $user->role === 'teacher';
});

Gate::before(function (User $user, string $ability) {
    if ($user->isAdministrator()) {
        return true;
    }
});
```

**Create Policies:**
```php
// app/Policies/NoticePolicy.php
class NoticePolicy
{
    public function update(User $user, Notice $notice): bool
    {
        return $user->id === $notice->user_id || 
               $user->hasRole('admin');
    }
    
    public function delete(User $user, Notice $notice): bool
    {
        return $user->hasRole('admin');
    }
}
```

**Use in Controllers:**
```php
public function update(Request $request, Notice $notice)
{
    $this->authorize('update', $notice);
    // or
    if ($request->user()->cannot('update', $notice)) {
        abort(403);
    }
}
```

### 4.7 File Upload Security

```php
public function store(Request $request)
{
    $request->validate([
        'document' => [
            'required',
            'file',
            'max:10240', // 10MB
            'mimes:pdf,doc,docx,jpg,png',
        ],
    ]);
    
    // Generate safe filename
    $filename = Str::uuid() . '.' . $request->file('document')->extension();
    
    // Store in private directory
    $path = $request->file('document')->storeAs(
        'documents',
        $filename,
        'private'
    );
    
    // Never use user-provided filename directly
    // basename() for any user input in paths
}
```

### 4.8 Rate Limiting

```php
// routes/web.php
Route::middleware(['throttle:60,1'])->group(function () {
    Route::post('/contact', [ContactController::class, 'store']);
    Route::post('/admission-inquiry', [AdmissionController::class, 'inquiry']);
});

// Custom rate limiter (RouteServiceProvider)
RateLimiter::for('login', function (Request $request) {
    return Limit::perMinute(5)->by($request->email . $request->ip());
});

RateLimiter::for('admission', function (Request $request) {
    return Limit::perHour(10)->by($request->ip());
});
```

### 4.9 Security Headers

```php
// Middleware for security headers
class SecurityHeaders
{
    public function handle($request, Closure $next)
    {
        $response = $next($request);
        
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'geolocation=(), microphone=()');
        
        if (config('app.env') === 'production') {
            $response->headers->set(
                'Strict-Transport-Security', 
                'max-age=31536000; includeSubDomains'
            );
        }
        
        return $response;
    }
}
```

### 4.10 Content Security Policy

```php
// CSP Nonce with Vite
Vite::useCspNonce();

// In blade
<script nonce="{{ Vite::cspNonce() }}">
    // Inline scripts
</script>
```

---

## 5. Admin Panel Best Practices

### 5.1 CMS Architecture

**Content Types for Schools:**
- Pages (About, Facilities, etc.)
- Notices/Announcements
- News/Blog Posts
- Events
- Gallery Albums
- Documents/Downloads
- Faculty Profiles
- Student Achievements

### 5.2 WYSIWYG Editor Integration

**Recommended: TipTap or Editor.js**

```tsx
// TipTap React Integration
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';

const NoticeEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: true }),
      Link.configure({ openOnClick: false }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return <EditorContent editor={editor} />;
};
```

### 5.3 Media Library

**Features to Implement:**
- Image upload with automatic optimization (WebP conversion)
- Folder organization by type/year
- Image cropping/resizing
- Alt text management
- Search and filter
- Bulk operations

```php
// Media Model
class Media extends Model
{
    protected $fillable = [
        'filename', 'original_name', 'mime_type', 
        'size', 'path', 'alt_text', 'folder_id'
    ];
    
    public function getUrlAttribute(): string
    {
        return Storage::url($this->path);
    }
    
    public function getThumbnailAttribute(): string
    {
        return Storage::url("thumbnails/{$this->filename}");
    }
}
```

### 5.4 Audit Logging

```php
// Activity Log for Admin Actions
class ActivityLog extends Model
{
    protected $fillable = [
        'user_id', 'action', 'model_type', 
        'model_id', 'old_values', 'new_values', 'ip_address'
    ];
    
    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
    ];
}

// Trait for Models
trait LogsActivity
{
    protected static function bootLogsActivity()
    {
        static::created(fn($model) => $model->logActivity('created'));
        static::updated(fn($model) => $model->logActivity('updated'));
        static::deleted(fn($model) => $model->logActivity('deleted'));
    }
    
    protected function logActivity(string $action): void
    {
        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => $action,
            'model_type' => get_class($this),
            'model_id' => $this->id,
            'old_values' => $action === 'updated' ? $this->getOriginal() : null,
            'new_values' => $action !== 'deleted' ? $this->getAttributes() : null,
            'ip_address' => request()->ip(),
        ]);
    }
}
```

### 5.5 Preview Functionality

```php
// Draft/Preview System
class Notice extends Model
{
    const STATUS_DRAFT = 'draft';
    const STATUS_PUBLISHED = 'published';
    const STATUS_SCHEDULED = 'scheduled';
    
    public function scopePublished($query)
    {
        return $query->where('status', self::STATUS_PUBLISHED)
                     ->where('published_at', '<=', now());
    }
    
    public function getPreviewUrl(): string
    {
        return route('notices.preview', [
            'notice' => $this->id,
            'token' => $this->preview_token
        ]);
    }
}
```

### 5.6 Version Control for Content

```php
// Content Versioning
class ContentVersion extends Model
{
    protected $fillable = [
        'versionable_type', 'versionable_id', 
        'content', 'user_id', 'version_number'
    ];
    
    public function versionable()
    {
        return $this->morphTo();
    }
}

trait HasVersions
{
    public function versions()
    {
        return $this->morphMany(ContentVersion::class, 'versionable');
    }
    
    public function saveVersion(): void
    {
        $this->versions()->create([
            'content' => $this->getOriginal(),
            'user_id' => auth()->id(),
            'version_number' => $this->versions()->count() + 1,
        ]);
    }
    
    public function revertTo(ContentVersion $version): void
    {
        $this->update($version->content);
    }
}
```

---

## 6. Accessibility (WCAG 2.1)

### 6.1 Priority Compliance Levels

**Target: WCAG 2.1 Level AA** (recommended for schools)

### 6.2 Perceivable (Principle 1)

**1.1.1 Non-text Content:**
```tsx
// All images must have alt text
<img 
  src="/principal.jpg" 
  alt="Mrs. Sharma, Principal of APS Alwar"
/>

// Decorative images
<img src="/decoration.svg" alt="" role="presentation" />

// Complex images (charts, infographics)
<figure>
  <img 
    src="/results-chart.png" 
    alt="CBSE Results 2024 Summary"
    aria-describedby="results-description"
  />
  <figcaption id="results-description">
    Bar chart showing 98% pass rate with 45% students 
    scoring above 90% in Class XII CBSE 2024 examinations.
  </figcaption>
</figure>
```

**1.3.1 Info and Relationships:**
```tsx
// Proper heading hierarchy
<h1>Army Public School Alwar</h1>
  <h2>Academics</h2>
    <h3>Primary Section</h3>
    <h3>Secondary Section</h3>
  <h2>Admissions</h2>

// Form labels
<label htmlFor="student-name">Student Name</label>
<input 
  type="text" 
  id="student-name" 
  name="studentName"
  aria-required="true"
/>

// Data tables
<table>
  <caption>Fee Structure 2025-26</caption>
  <thead>
    <tr>
      <th scope="col">Class</th>
      <th scope="col">Tuition Fee</th>
      <th scope="col">Annual Charges</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Nursery-KG</th>
      <td>₹3,000</td>
      <td>₹5,000</td>
    </tr>
  </tbody>
</table>
```

**1.4.3 Contrast (Minimum):**
```css
/* Minimum 4.5:1 for normal text, 3:1 for large text */
:root {
  --text-primary: #1f2937; /* On white: 13.53:1 ✓ */
  --text-secondary: #4b5563; /* On white: 7.21:1 ✓ */
  --link-color: #1d4ed8; /* On white: 8.59:1 ✓ */
}

/* Large text (18px+ or 14px bold) */
.heading-large {
  color: #374151; /* 3:1 minimum met */
}
```

**1.4.11 Non-text Contrast:**
```css
/* UI components need 3:1 contrast */
button {
  border: 2px solid #1d4ed8; /* Clearly visible border */
}

input:focus {
  outline: 3px solid #2563eb; /* Visible focus indicator */
  outline-offset: 2px;
}
```

### 6.3 Operable (Principle 2)

**2.1.1 Keyboard Accessible:**
```tsx
// All interactive elements keyboard accessible
<button onClick={handleClick} onKeyDown={handleKeyDown}>
  Submit
</button>

// Custom components with proper keyboard handling
const Dropdown = ({ options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => Math.min(prev + 1, options.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        selectOption(activeIndex);
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };
  
  return (
    <div 
      role="listbox"
      aria-activedescendant={`option-${activeIndex}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* options */}
    </div>
  );
};
```

**2.4.1 Bypass Blocks:**
```tsx
// Skip link
<a href="#main-content" className="skip-link">
  Skip to main content
</a>

// CSS for skip link
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  padding: 8px;
  background: #000;
  color: #fff;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

**2.4.7 Focus Visible:**
```css
/* Never remove focus outlines */
*:focus {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}

/* Custom focus styles */
button:focus-visible {
  outline: 3px solid #2563eb;
  box-shadow: 0 0 0 6px rgba(37, 99, 235, 0.3);
}
```

### 6.4 Understandable (Principle 3)

**3.1.1 Language of Page:**
```html
<html lang="en">
<!-- For Hindi content -->
<html lang="hi">

<!-- Mixed language content -->
<p>The school motto is <span lang="hi">सत्यमेव जयते</span>.</p>
```

**3.3.1 Error Identification:**
```tsx
// Form validation with clear error messages
const AdmissionForm = () => {
  const [errors, setErrors] = useState({});
  
  return (
    <form aria-describedby="form-errors">
      {Object.keys(errors).length > 0 && (
        <div id="form-errors" role="alert" aria-live="polite">
          <h2>Please correct the following errors:</h2>
          <ul>
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>
                <a href={`#${field}`}>{message}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div>
        <label htmlFor="email">Email Address *</label>
        <input
          type="email"
          id="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <span id="email-error" role="alert">
            {errors.email}
          </span>
        )}
      </div>
    </form>
  );
};
```

### 6.5 Robust (Principle 4)

**4.1.2 Name, Role, Value:**
```tsx
// ARIA for custom components
<div
  role="tablist"
  aria-label="Academic sections"
>
  <button
    role="tab"
    aria-selected={activeTab === 'primary'}
    aria-controls="primary-panel"
    id="primary-tab"
  >
    Primary
  </button>
</div>

<div
  role="tabpanel"
  id="primary-panel"
  aria-labelledby="primary-tab"
  hidden={activeTab !== 'primary'}
>
  {/* Panel content */}
</div>

// Status messages
<div role="status" aria-live="polite">
  Form submitted successfully!
</div>

<div role="alert" aria-live="assertive">
  Error: Please check your input.
</div>
```

### 6.6 Accessibility Testing Checklist

- [ ] Keyboard navigation works for all interactive elements
- [ ] Focus indicators are visible
- [ ] Color contrast meets requirements (4.5:1 / 3:1)
- [ ] All images have appropriate alt text
- [ ] Forms have proper labels and error messages
- [ ] Headings follow logical hierarchy
- [ ] Page has skip links
- [ ] ARIA roles used correctly
- [ ] Screen reader testing completed
- [ ] Automated testing passed (axe, Lighthouse)

---

## 7. Modern School Website Features

### 7.1 Digital Notice Board

**Features:**
- Priority levels (Urgent, Important, General)
- Category filtering (Academic, Sports, Events, Administrative)
- Date-based archiving
- PDF attachment support
- Search functionality
- Push notification for urgent notices

```tsx
interface Notice {
  id: number;
  title: string;
  content: string;
  priority: 'urgent' | 'important' | 'general';
  category: string;
  attachments: Attachment[];
  publishedAt: Date;
  expiresAt?: Date;
  targetAudience: ('students' | 'parents' | 'staff')[];
}
```

### 7.2 Academic Calendar

**Features:**
- Monthly/yearly view
- Event categories (Exams, Holidays, PTM, Events)
- iCal export
- Google Calendar sync
- Reminder subscriptions

```tsx
interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  category: 'exam' | 'holiday' | 'ptm' | 'event' | 'deadline';
  targetClasses?: string[];
  location?: string;
  isRecurring: boolean;
}
```

### 7.3 Online Admission System

**Workflow:**
1. Registration & Form Fill
2. Document Upload
3. Application Review
4. Entrance Test Scheduling
5. Interview Scheduling
6. Result Declaration
7. Fee Payment
8. Confirmation

**Document Checklist:**
- Birth Certificate
- Previous School TC
- Report Cards
- Photographs
- Address Proof
- Parent ID Proof
- Aadhar Card
- Defence Certificate (if applicable)

### 7.4 Document Management

**Categories:**
- Circulars
- Prospectus
- Fee Structure
- Academic Calendar
- Exam Schedules
- Results
- Forms (Leave, TC, etc.)
- Policies

```php
class Document extends Model
{
    protected $fillable = [
        'title', 'description', 'category',
        'file_path', 'file_size', 'file_type',
        'academic_year', 'is_public', 'download_count'
    ];
    
    public function incrementDownloads(): void
    {
        $this->increment('download_count');
    }
}
```

### 7.5 Faculty Directory

**Information to Display:**
- Photo
- Name & Designation
- Qualifications
- Subject/Department
- Experience
- Email (optional, protected)

```tsx
interface Faculty {
  id: number;
  name: string;
  designation: string;
  department: string;
  qualifications: string[];
  experience: number; // years
  subjects: string[];
  photo?: string;
  email?: string;
  achievements?: string[];
}
```

### 7.6 Photo Gallery

**Organization:**
- By Year
- By Event Type
- Albums with descriptions

**Features:**
- Lightbox view
- Download options
- Social sharing
- Lazy loading
- WebP with JPEG fallback

### 7.7 Newsletter/Magazine

**Digital School Magazine:**
- Monthly/Quarterly editions
- PDF flip book viewer
- Article archive
- Search within editions

### 7.8 Parent Portal Features

**Dashboard:**
- Student attendance
- Fee status
- Upcoming events
- Recent notices
- Academic performance
- Communication with teachers

### 7.9 Student Achievements

**Categories:**
- Academic excellence
- Sports achievements
- Cultural activities
- Olympiads & Competitions
- Alumni success stories

### 7.10 Virtual Tour

**Implementation Options:**
- 360° panoramic images
- Video tour
- Interactive map of campus

### 7.11 Contact & Inquiry System

**Form Types:**
- General inquiry
- Admission inquiry
- Feedback
- Grievance

**Features:**
- Auto-response emails
- CRM integration
- Follow-up tracking
- Response time SLA

---

## Implementation Priority Matrix

| Feature | Priority | Complexity | Impact |
|---------|----------|------------|--------|
| Responsive Design | Critical | Medium | High |
| Notice Board | Critical | Low | High |
| Accessibility | Critical | Medium | High |
| SEO Optimization | High | Low | High |
| PWA Features | High | Medium | Medium |
| Online Admissions | High | High | High |
| Gallery | Medium | Low | Medium |
| Faculty Directory | Medium | Low | Medium |
| Parent Portal | Medium | High | High |
| Virtual Tour | Low | High | Low |

---

## Recommended Technology Stack

| Layer | Technology | Reason |
|-------|------------|--------|
| Backend | Laravel 11+ | Security, ecosystem, maintainability |
| Frontend | React 18+ | Component reusability, ecosystem |
| Routing | Inertia.js | SPA feel with server-side benefits |
| Styling | Tailwind CSS | Rapid development, consistency |
| UI Components | shadcn/ui | Accessible, customizable |
| Database | MySQL 8+ | Reliability, Laravel integration |
| Cache | Redis | Performance, sessions, queues |
| Search | Meilisearch/Algolia | Fast, typo-tolerant search |
| Media | Cloudinary/Spatie Media | Image optimization, CDN |
| Hosting | Laravel Forge + DigitalOcean | Easy deployment, SSL |

---

## Resources & References

### Official Documentation
- [Laravel Documentation](https://laravel.com/docs)
- [Inertia.js Documentation](https://inertiajs.com)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [web.dev Performance](https://web.dev/learn/performance)

### Tools
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance auditing
- [axe DevTools](https://www.deque.com/axe/) - Accessibility testing
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Schema Markup Validator](https://validator.schema.org/)

---

*Document Version: 1.0*
*Created: January 2025*
*For: APS Alwar School Website Project*
