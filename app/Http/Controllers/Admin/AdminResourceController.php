<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

abstract class AdminResourceController extends Controller
{
    /**
     * The model class for this resource.
     */
    protected string $model;

    /**
     * The Inertia page component prefix.
     */
    protected string $pagePrefix;

    /**
     * The resource name for display.
     */
    protected string $resourceName;

    /**
     * The fields to search in.
     */
    protected array $searchFields = ['title', 'name'];

    /**
     * The default sort field.
     */
    protected string $sortField = 'created_at';

    /**
     * The default sort direction.
     */
    protected string $sortDirection = 'desc';

    /**
     * The number of items per page.
     */
    protected int $perPage = 15;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = $this->model::query();

        // Apply search filter
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                foreach ($this->searchFields as $field) {
                    $q->orWhere($field, 'like', "%{$search}%");
                }
            });
        }

        // Apply filters
        $query = $this->applyFilters($query, $request);

        // Apply sorting
        $sortField = $request->get('sort', $this->sortField);
        $sortDirection = $request->get('direction', $this->sortDirection);
        $query->orderBy($sortField, $sortDirection);

        // Paginate results
        $items = $query->paginate($request->get('per_page', $this->perPage))
            ->withQueryString();

        return Inertia::render("{$this->pagePrefix}/index", [
            'items' => $items,
            'filters' => $request->only(['search', 'sort', 'direction', 'status']),
            'resourceName' => $this->resourceName,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render("{$this->pagePrefix}/create", [
            'resourceName' => $this->resourceName,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    abstract public function store(Request $request);

    /**
     * Display the specified resource.
     */
    public function show(int $id): Response
    {
        $item = $this->model::findOrFail($id);

        return Inertia::render("{$this->pagePrefix}/show", [
            'item' => $item,
            'resourceName' => $this->resourceName,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(int $id): Response
    {
        $item = $this->model::findOrFail($id);

        return Inertia::render("{$this->pagePrefix}/edit", [
            'item' => $item,
            'resourceName' => $this->resourceName,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    abstract public function update(Request $request, int $id);

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $item = $this->model::findOrFail($id);
        $item->delete();

        return redirect()
            ->route("{$this->getRoutePrefix()}.index")
            ->with('success', "{$this->resourceName} deleted successfully.");
    }

    /**
     * Apply custom filters to the query.
     */
    protected function applyFilters($query, Request $request)
    {
        // Override in child classes to add custom filters
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        return $query;
    }

    /**
     * Get the route prefix for this resource.
     */
    protected function getRoutePrefix(): string
    {
        return 'admin.' . Str::kebab(Str::plural($this->resourceName));
    }

    /**
     * Generate a unique slug from a string.
     */
    protected function generateSlug(string $value, ?int $excludeId = null): string
    {
        $slug = Str::slug($value);
        $originalSlug = $slug;
        $count = 1;

        $query = $this->model::where('slug', $slug);
        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        while ($query->exists()) {
            $slug = "{$originalSlug}-{$count}";
            $query = $this->model::where('slug', $slug);
            if ($excludeId) {
                $query->where('id', '!=', $excludeId);
            }
            $count++;
        }

        return $slug;
    }

    /**
     * Log an audit action.
     */
    protected function logAudit(string $action, Model $model, ?array $oldData = null): void
    {
        \DB::table('audit_logs')->insert([
            'user_id' => auth()->id(),
            'action' => $action,
            'model_type' => class_basename($model),
            'model_id' => $model->id,
            'old_values' => $oldData ? json_encode($oldData) : null,
            'new_values' => json_encode($model->toArray()),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'created_at' => now(),
        ]);
    }
}
