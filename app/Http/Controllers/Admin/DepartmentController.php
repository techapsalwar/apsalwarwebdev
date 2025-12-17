<?php

namespace App\Http\Controllers\Admin;

use App\Models\Department;
use App\Models\Staff;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DepartmentController extends AdminResourceController
{
    protected string $model = Department::class;
    protected string $pagePrefix = 'admin/departments';
    protected string $resourceName = 'Department';
    protected array $searchFields = ['name', 'description'];

    /**
     * Display a listing of departments.
     */
    public function index(Request $request): Response
    {
        $query = Department::withCount(['staff' => function ($q) {
            $q->where('is_active', true);
        }]);

        // Apply search filter
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Apply active filter
        if ($request->has('active') && $request->get('active') !== '') {
            $query->where('is_active', $request->get('active') === '1');
        }

        // Apply sorting
        $sortField = $request->get('sort', 'order');
        $sortDirection = $request->get('direction', 'asc');
        $query->orderBy($sortField, $sortDirection);

        // Paginate results
        $items = $query->paginate($request->get('per_page', 15))
            ->withQueryString();

        return Inertia::render('admin/departments/index', [
            'items' => $items,
            'filters' => $request->only(['search', 'sort', 'direction', 'active']),
        ]);
    }

    /**
     * Show the form for creating a new department.
     */
    public function create(): Response
    {
        return Inertia::render('admin/departments/create', [
            'icons' => $this->getAvailableIcons(),
        ]);
    }

    /**
     * Store a newly created department in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:departments,slug',
            'description' => 'nullable|string|max:1000',
            'icon' => 'nullable|string|max:50',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        // Generate slug if not provided
        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['name']);

        // Set defaults
        $validated['is_active'] = $validated['is_active'] ?? true;
        $validated['order'] = $validated['order'] ?? Department::max('order') + 1;

        $department = Department::create($validated);
        
        $this->logAudit('created', $department);

        return redirect()
            ->route('admin.departments.index')
            ->with('success', 'Department created successfully.');
    }

    /**
     * Show the form for editing the specified department.
     */
    public function edit(int $id): Response
    {
        $item = Department::withCount(['staff' => function ($q) {
            $q->where('is_active', true);
        }])->findOrFail($id);

        return Inertia::render('admin/departments/edit', [
            'item' => $item,
            'icons' => $this->getAvailableIcons(),
        ]);
    }

    /**
     * Display the specified department.
     */
    public function show(int $id): Response
    {
        $item = Department::withCount('staff')
            ->with(['staff' => function ($q) {
                $q->where('is_active', true)
                    ->orderBy('order')
                    ->select(['id', 'name', 'slug', 'designation', 'photo', 'email', 'type', 'department_id']);
            }])
            ->findOrFail($id);

        return Inertia::render('admin/departments/show', [
            'item' => $item,
        ]);
    }

    /**
     * Update the specified department in storage.
     */
    public function update(Request $request, int $id)
    {
        $department = Department::findOrFail($id);
        $oldData = $department->toArray();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:departments,slug,' . $id,
            'description' => 'nullable|string|max:1000',
            'icon' => 'nullable|string|max:50',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        // Generate slug if changed
        if ($validated['name'] !== $department->name && !$validated['slug']) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $department->update($validated);

        $this->logAudit('updated', $department, $oldData);

        return redirect()
            ->route('admin.departments.index')
            ->with('success', 'Department updated successfully.');
    }

    /**
     * Remove the specified department from storage.
     */
    public function destroy(int $id)
    {
        $department = Department::withCount('staff')->findOrFail($id);

        // Check if department has staff members
        if ($department->staff_count > 0) {
            return back()->with('error', 'Cannot delete department with assigned staff members. Please reassign or remove staff first.');
        }

        $this->logAudit('deleted', $department);
        
        $department->delete();

        return redirect()
            ->route('admin.departments.index')
            ->with('success', 'Department deleted successfully.');
    }

    /**
     * Toggle department active status.
     */
    public function toggleActive(int $id)
    {
        $department = Department::findOrFail($id);
        $department->update(['is_active' => !$department->is_active]);

        return back()->with('success', 'Department status updated.');
    }

    /**
     * Reorder departments.
     */
    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:departments,id',
            'items.*.order' => 'required|integer|min:0',
        ]);

        foreach ($validated['items'] as $item) {
            Department::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return back()->with('success', 'Department order updated.');
    }

    /**
     * Get available icons for departments.
     */
    private function getAvailableIcons(): array
    {
        return [
            'book-open' => 'Book Open',
            'calculator' => 'Calculator',
            'flask' => 'Flask / Science',
            'globe' => 'Globe',
            'laptop' => 'Computer',
            'music' => 'Music',
            'palette' => 'Art',
            'dumbbell' => 'Physical Education',
            'heart' => 'Health',
            'brain' => 'Psychology',
            'scale' => 'Commerce',
            'users' => 'General',
            'graduation-cap' => 'Academics',
            'building' => 'Administration',
            'wrench' => 'Maintenance',
            'book' => 'Library',
            'shield' => 'Security',
        ];
    }
}
