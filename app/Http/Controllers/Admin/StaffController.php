<?php

namespace App\Http\Controllers\Admin;

use App\Models\Department;
use App\Models\Staff;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class StaffController extends AdminResourceController
{
    protected string $model = Staff::class;
    protected string $pagePrefix = 'admin/staff';
    protected string $resourceName = 'Staff';
    protected array $searchFields = ['name', 'designation', 'email'];

    /**
     * Display a listing of staff members.
     */
    public function index(Request $request): Response
    {
        $query = Staff::with('department');

        // Apply search filter
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('designation', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Apply type filter
        if ($type = $request->get('type')) {
            if ($type !== 'all') {
                $query->where('type', $type);
            }
        }

        // Apply department filter
        if ($departmentId = $request->get('department')) {
            if ($departmentId !== 'all') {
                $query->where('department_id', $departmentId);
            }
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
        $items = $query->paginate($request->get('per_page', 20))
            ->withQueryString();

        return Inertia::render('admin/staff/index', [
            'items' => $items,
            'filters' => $request->only(['search', 'sort', 'direction', 'type', 'department', 'active']),
            'departments' => Department::active()->get(['id', 'name']),
            'types' => $this->getStaffTypes(),
        ]);
    }

    /**
     * Show the form for creating a new staff member.
     */
    public function create(): Response
    {
        return Inertia::render('admin/staff/create', [
            'departments' => Department::active()->get(['id', 'name']),
            'types' => $this->getStaffTypes(),
        ]);
    }

    /**
     * Store a newly created staff member in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:staff,slug',
            'designation' => 'required|string|max:255',
            'department_id' => 'nullable|exists:departments,id',
            'photo' => 'nullable|image|max:2048',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'qualifications' => 'nullable|string|max:1000',
            'experience' => 'nullable|string|max:1000',
            'bio' => 'nullable|string|max:2000',
            'subjects' => 'nullable|array',
            'subjects.*' => 'string|max:100',
            'type' => 'required|in:teaching,non_teaching,management',
            'joining_date' => 'nullable|date',
            'is_active' => 'boolean',
            'show_on_website' => 'boolean',
            'order' => 'nullable|integer|min:0',
        ]);

        // Generate slug if not provided
        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['name']);

        // Handle photo upload
        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')
                ->store('staff', 'public');
        }

        // Set defaults
        $validated['is_active'] = $validated['is_active'] ?? true;
        $validated['show_on_website'] = $validated['show_on_website'] ?? true;
        $validated['order'] = $validated['order'] ?? Staff::max('order') + 1;

        $staff = Staff::create($validated);
        
        $this->logAudit('created', $staff);

        return redirect()
            ->route('admin.staff.index')
            ->with('success', 'Staff member added successfully.');
    }

    /**
     * Show the form for editing the specified staff member.
     */
    public function edit(int $id): Response
    {
        $item = Staff::with('department')->findOrFail($id);

        return Inertia::render('admin/staff/edit', [
            'item' => $item,
            'departments' => Department::active()->get(['id', 'name']),
            'types' => $this->getStaffTypes(),
        ]);
    }

    /**
     * Display the specified staff member.
     */
    public function show(int $id): Response
    {
        $item = Staff::with('department')->findOrFail($id);

        return Inertia::render('admin/staff/show', [
            'item' => $item,
            'types' => $this->getStaffTypes(),
        ]);
    }

    /**
     * Update the specified staff member in storage.
     */
    public function update(Request $request, int $id)
    {
        $staff = Staff::findOrFail($id);
        $oldData = $staff->toArray();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:staff,slug,' . $id,
            'designation' => 'required|string|max:255',
            'department_id' => 'nullable|exists:departments,id',
            'photo' => 'nullable|image|max:2048',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'qualifications' => 'nullable|string|max:1000',
            'experience' => 'nullable|string|max:1000',
            'bio' => 'nullable|string|max:2000',
            'subjects' => 'nullable|array',
            'subjects.*' => 'string|max:100',
            'type' => 'required|in:teaching,non_teaching,management',
            'joining_date' => 'nullable|date',
            'is_active' => 'boolean',
            'show_on_website' => 'boolean',
            'order' => 'nullable|integer|min:0',
        ]);

        // Generate slug if changed
        if ($validated['name'] !== $staff->name && !$validated['slug']) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        // Handle photo upload
        if ($request->hasFile('photo')) {
            // Delete old photo
            if ($staff->photo) {
                Storage::disk('public')->delete($staff->photo);
            }
            $validated['photo'] = $request->file('photo')
                ->store('staff', 'public');
        }

        $staff->update($validated);

        $this->logAudit('updated', $staff, $oldData);

        return redirect()
            ->route('admin.staff.index')
            ->with('success', 'Staff member updated successfully.');
    }

    /**
     * Remove the specified staff member from storage.
     */
    public function destroy(int $id)
    {
        $staff = Staff::findOrFail($id);

        // Delete photo
        if ($staff->photo) {
            Storage::disk('public')->delete($staff->photo);
        }

        $this->logAudit('deleted', $staff);
        
        $staff->delete();

        return redirect()
            ->route('admin.staff.index')
            ->with('success', 'Staff member deleted successfully.');
    }

    /**
     * Toggle staff active status.
     */
    public function toggleActive(int $id)
    {
        $staff = Staff::findOrFail($id);
        $staff->update(['is_active' => !$staff->is_active]);

        return back()->with('success', 'Staff status updated.');
    }

    /**
     * Reorder staff members.
     */
    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:staff,id',
            'items.*.order' => 'required|integer|min:0',
        ]);

        foreach ($validated['items'] as $item) {
            Staff::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return back()->with('success', 'Staff order updated.');
    }

    /**
     * Get staff types.
     */
    private function getStaffTypes(): array
    {
        return [
            'teaching' => 'Teaching Staff',
            'non_teaching' => 'Non-Teaching Staff',
            'management' => 'Management',
        ];
    }
}
