# AI Coding Agent Instructions - APS Alwar School Website

## Project Overview
**Army Public School Alwar Digital Campus Platform** - A world-class school website built with Laravel 12, React 19, and Inertia.js v2. This is a full-featured SPA combining an admin panel with a modern public website.

## Tech Stack & Versions
- **PHP**: 8.2.12
- **Laravel**: 12.x
- **React**: 19.x with @inertiajs/react v2
- **Frontend Build**: Vite with @laravel/vite-plugin-wayfinder
- **Testing**: Pest v3 (PestPHP)
- **Authentication**: Laravel Fortify v1 with 2FA
- **Permissions**: Spatie Laravel Permission v6.24
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Database**: MySQL with `maatwebsite/excel` for imports

## Architecture & Data Flow

### Two-Tier Routing Model
The app uses **three separate route files**, each with distinct purposes:
- **`routes/web.php`**: Public website (home, news, events, admissions, about)
- **`routes/admin.php`**: Admin panel (CRUD for all content types)
- **`routes/settings.php`**: User profile & authentication settings

Routes are protected via:
- **Auth middleware**: All admin routes require `['auth', 'verified']`
- **Permission middleware**: Individual admin resources check specific permissions (e.g., `'permission:fee_structures'`)
- **Spatie Permissions**: Role-based access controlled in `app\Http\Controllers\Admin\UserController`

### Frontend Structure (React/Inertia)
- **`resources/js/pages/`**: Page components organized by section (admin/, public/)
- **`resources/js/components/ui/`**: Reusable shadcn/ui components
- **`resources/js/layouts/`**: Shared layouts (app-layout for admin/settings)
- **`resources/js/types/`**: TypeScript interfaces for Inertia props

**Key Pattern**: Controllers render Inertia views with props:
```php
Inertia::render('admin/fee-structures/edit', [
    'feeStructure' => $feeStructure,
    'categories' => FeeStructure::getCategoryOptions(),
]);
```

### Core Models & Relationships
**Structural Models** (with global helpers):
- `FeeStructure` (categories: officers/jco/or/civilian; class_ranges: nursery_ukg/i_v/etc.) - includes `getCategoryOptions()`, `getClassRangeOptions()` methods
- `User` (Spatie roles/permissions)
- `Staff`, `Department`, `Committee`, `House`

**Content Models**:
- `Achievement`, `News`, `Announcement`, `Event`, `Album` → Public visibility
- `Admission`, `TcRecord`, `Contact` → Portal features
- `Document`, `Facility`, `Partnership`, `Testimonial`

**Data Pattern**: Use Eloquent casts for decimals (financial fields) and arrays:
```php
protected $casts = [
    'tuition_fee' => 'decimal:2',
    'other_fees' => 'array',
    'is_active' => 'boolean',
];
```

## Development Workflows

### Running the Application
```bash
# Full dev stack (PHP server + queue + Vite HMR + SSR if enabled)
composer run dev

# Individual processes:
php artisan serve                    # Laravel server on :8000
php artisan queue:listen --tries=1  # Queue worker
npm run dev                          # Vite with HMR
php artisan inertia:start-ssr       # SSR server (if enabled)
```

### Build & Frontend Issues
- **Frontend changes not visible?** Run `npm run build` (production) or `npm run dev` (watch mode)
- **Vite manifest error?** This happens if frontend isn't built—run `npm run build`
- **TypeScript errors?** Run `npm run types` to check; doesn't block builds but catches issues

### Testing
```bash
composer test                  # Run all tests (clears config, then runs artisan test)
php artisan test              # Run Pest tests directly
php artisan test --unit       # Unit tests only
php artisan test tests/Feature/AdminControllerTest.php  # Single file
```
**Test Convention**: Use model factories for test setup; check factory definitions for available states before manually setting attributes.

### Code Quality
```bash
npm run lint                # ESLint with auto-fix
npm run format             # Prettier format
npm run types              # TypeScript validation
php artisan pint           # Laravel Pint for PHP style
```

## Project-Specific Patterns

### Admin Panel Conventions
1. **Toggle Actions**: Most admin resources include a `toggleActive()` method returning `back()->with('success', ...)`
   - Route: `POST /admin/{resource}/{id}/toggle-active`
   - Example: [StaffController](app/Http/Controllers/Admin/StaffController.php)

2. **Bulk Operations**: Contact, testimonial endpoints support bulk status/delete:
   - `POST /admin/contacts/bulk-status`
   - `POST /admin/contacts/bulk-delete`

3. **Resource Reordering**: Staff, departments, clubs, testimonials support drag-drop reordering
   - Route: `POST /admin/{resource}/reorder` with array of IDs
   - Check `StaffController::reorder()` for pattern

4. **Copy/Bulk Create**: Fee structures include `copyToYear()` to bulk duplicate across academic years
   - Route: `POST /admin/fee-structures/copy-to-year`

### Frontend Component Patterns
- **Inertia Link**: Use `<Link href="/path">` for navigation (preserves scroll on same-page links)
- **Forms**: Use `useForm()` hook for mutations (POST/PUT/DELETE via Inertia)
- **Data Display**: Prefer shadcn/ui components for consistency—check existing pages (e.g., fee-structures/index)
- **TypeScript**: Define prop interfaces at component top; leverage Inertia's `props` type

### Form Validation Flow
1. Controller validates with `$request->validate([...])`
2. On error: return `back()->withErrors([...])->withInput()`
3. Frontend catches errors in `errors` object from `useForm()`
4. Show inline error messages under each field

### Permission System
- Permissions tied to resources: `permission:fee_structures`, `permission:staff`, etc.
- Admin users have permissions via role (check `UserController::updatePermissions()`)
- Middleware intercepts at route group: `Route::middleware('permission:news')->group(...)`
- Custom middleware: [CheckPermission](app/Http/Middleware/CheckPermission.php)

## External Dependencies & Integration Points

### Spatie Laravel Permission
- Used for role-based access throughout admin panel
- Check permissions in templates: `$user->can('view', $resource)`
- Setup in `config/permission.php`

### Intervention Image (v3.11)
- Used for image optimization in uploads (likely in models with media handling)
- Check factories for image generation examples

### Maatwebsite Excel (v3.1)
- Bulk import/export capability (e.g., TC records, results)
- Controllers: [TcRecordController](app/Http/Controllers/Admin/TcRecordController.php) has `bulkUploadForm()`, `bulkUpload()`

### Laravel Fortify & 2FA
- Handles authentication flows; 2FA settings in `routes/settings.php`
- Features configured in `config/fortify.php`
- Don't modify Fortify controllers—use hooks or events if needed

## Common Tasks & Examples

### Creating a New Admin Resource
1. Generate controller: `php artisan make:controller Admin/MyResourceController --model=MyModel`
2. Add routes in `routes/admin.php`: `Route::middleware('permission:my_resource')->group(...)`
3. Create Inertia pages in `resources/js/pages/admin/my-resources/`
4. Follow existing controller pattern (index, create, store, edit, update, destroy)
5. Use model's `getCategoryOptions()` style methods for dropdown data

### Adding a Frontend Page
1. Create `.tsx` in `resources/js/pages/` (public) or `resources/js/pages/admin/` (admin)
2. Import `AppLayout` for admin pages, wrap in `<Head title="...">`
3. Use Inertia's `useForm()` for mutations, `Link` for navigation
4. Import shadcn/ui components from `@/components/ui/*`
5. Route in `routes/web.php` or `routes/admin.php` with `Inertia::render(...)`

### Database Queries with Filters
- Follow existing patterns in controllers (e.g., FeeStructureController::index)
- Build queries conditionally: `if ($request->filled('category')) { $query->where(...) }`
- Use model scopes for reusable filters (check models for existing scopes)
- Pagination: `->paginate(50)->withQueryString()` preserves filters in links

## Critical Rules & Constraints

1. **No Breaking Changes**: Existing route structure, model relationships, and permission system are fixed
2. **Frontend Build Required**: Always remind users if frontend changes need `npm run build` or `npm run dev`
3. **No Middleware Files**: Laravel 12 uses `bootstrap/app.php` to register middleware (no `app/Http/Middleware/` files)
4. **Use Factories in Tests**: Don't manually create models in tests when factories exist
5. **Descriptive Naming**: Variables/methods: `isRegisteredForDiscounts`, not `discount()`
6. **Code Reuse**: Check sibling files for existing components/patterns before creating new ones
7. **PHP Curly Braces**: All control structures use braces, even single-line blocks
8. **Constructor Promotion**: Use PHP 8 constructor property promotion: `public function __construct(public GitHub $github) { }`

## Reference Files
- **Core Bootstrap**: [bootstrap/app.php](bootstrap/app.php) - middleware, routing, exception handling
- **Admin Routing**: [routes/admin.php](routes/admin.php) - all admin CRUD endpoints
- **Public Routing**: [routes/web.php](routes/web.php) - public website pages
- **Example Controller**: [app/Http/Controllers/Admin/FeeStructureController.php](app/Http/Controllers/Admin/FeeStructureController.php) - resource CRUD pattern
- **Example Model**: [app/Models/FeeStructure.php](app/Models/FeeStructure.php) - casts, relationships, helper methods
- **Example React Page**: [resources/js/pages/admin/fee-structures/edit.tsx](resources/js/pages/admin/fee-structures/edit.tsx) - Inertia form pattern
- **Cursor Rules**: [.cursor/rules/laravel-boost.mdc](.cursor/rules/laravel-boost.mdc) - comprehensive Laravel guidelines

---

**Last Updated**: December 17, 2025  
**Maintained By**: Development Team
