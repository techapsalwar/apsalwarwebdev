<?php

namespace App\Http\Controllers\Admin;

use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends AdminResourceController
{
    protected string $model = Announcement::class;
    protected string $pagePrefix = 'admin/announcements';
    protected string $resourceName = 'Announcement';
    protected array $searchFields = ['title', 'content'];

    /**
     * Display a listing of announcements.
     */
    public function index(Request $request): Response
    {
        $query = Announcement::query();

        // Apply search filter
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            });
        }

        // Apply type filter
        if ($type = $request->get('type')) {
            if ($type !== 'all') {
                $query->where('type', $type);
            }
        }

        // Apply priority filter
        if ($priority = $request->get('priority')) {
            if ($priority !== 'all') {
                $query->where('priority', $priority);
            }
        }

        // Apply active filter
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Apply sorting - prioritize by priority level, then by date
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        
        // Custom priority ordering
        $query->orderByRaw("FIELD(priority, 'critical', 'high', 'medium', 'low') ASC")
              ->orderBy($sortField, $sortDirection);

        // Paginate results
        $items = $query->paginate($request->get('per_page', 15))
            ->withQueryString();

        return Inertia::render('admin/announcements/index', [
            'items' => $items,
            'filters' => $request->only(['search', 'sort', 'direction', 'type', 'priority', 'is_active']),
            'types' => $this->getTypes(),
            'priorities' => $this->getPriorities(),
        ]);
    }

    /**
     * Show the form for creating a new announcement.
     */
    public function create(): Response
    {
        return Inertia::render('admin/announcements/create', [
            'types' => $this->getTypes(),
            'priorities' => $this->getPriorities(),
        ]);
    }

    /**
     * Store a newly created announcement in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|in:general,important,urgent,event,holiday,admission,exam,result,academic,other',
            'priority' => 'required|in:low,medium,high,critical',
            'attachment' => 'nullable|file|max:10240',
            'link' => 'nullable|url|max:500',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_active' => 'boolean',
            'show_in_ticker' => 'boolean',
            'target_audience' => 'nullable|string|max:100',
        ]);

        // Handle attachment upload
        if ($request->hasFile('attachment')) {
            $validated['attachment'] = $request->file('attachment')
                ->store('announcements', 'public');
        }

        // Set created_by
        $validated['created_by'] = Auth::id();

        $announcement = Announcement::create($validated);

        $this->logAudit('created', $announcement);

        return redirect()
            ->route('admin.announcements.index')
            ->with('success', 'Announcement created successfully.');
    }

    /**
     * Display the specified announcement.
     */
    public function show(int $id): Response
    {
        $announcement = Announcement::with('creator')->findOrFail($id);

        return Inertia::render('admin/announcements/show', [
            'announcement' => $announcement,
            'types' => $this->getTypes(),
            'priorities' => $this->getPriorities(),
        ]);
    }

    /**
     * Show the form for editing the specified announcement.
     */
    public function edit(int $id): Response
    {
        $announcement = Announcement::findOrFail($id);

        return Inertia::render('admin/announcements/edit', [
            'announcement' => $announcement,
            'types' => $this->getTypes(),
            'priorities' => $this->getPriorities(),
        ]);
    }

    /**
     * Update the specified announcement in storage.
     */
    public function update(Request $request, int $id)
    {
        $announcement = Announcement::findOrFail($id);
        $oldData = $announcement->toArray();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|in:general,important,urgent,event,holiday,admission,exam,result,academic,other',
            'priority' => 'required|in:low,medium,high,critical',
            'attachment' => 'nullable|file|max:10240',
            'link' => 'nullable|url|max:500',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_active' => 'boolean',
            'show_in_ticker' => 'boolean',
            'target_audience' => 'nullable|string|max:100',
            'remove_attachment' => 'boolean',
        ]);

        // Handle attachment removal
        if ($request->boolean('remove_attachment') && $announcement->attachment) {
            Storage::disk('public')->delete($announcement->attachment);
            $validated['attachment'] = null;
        }

        // Handle attachment upload (overrides removal)
        if ($request->hasFile('attachment')) {
            // Delete old attachment
            if ($announcement->attachment) {
                Storage::disk('public')->delete($announcement->attachment);
            }
            $validated['attachment'] = $request->file('attachment')
                ->store('announcements', 'public');
        }

        // Remove remove_attachment from validated data before save
        unset($validated['remove_attachment']);

        $announcement->update($validated);

        $this->logAudit('updated', $announcement, $oldData);

        return redirect()
            ->route('admin.announcements.index')
            ->with('success', 'Announcement updated successfully.');
    }

    /**
     * Remove the specified announcement from storage.
     */
    public function destroy(int $id)
    {
        $announcement = Announcement::findOrFail($id);

        // Delete attachment
        if ($announcement->attachment) {
            Storage::disk('public')->delete($announcement->attachment);
        }

        $this->logAudit('deleted', $announcement);

        $announcement->delete();

        return redirect()
            ->route('admin.announcements.index')
            ->with('success', 'Announcement deleted successfully.');
    }

    /**
     * Toggle announcement active status.
     */
    public function toggleActive(int $id)
    {
        $announcement = Announcement::findOrFail($id);
        $announcement->update(['is_active' => !$announcement->is_active]);

        return back()->with('success', 'Announcement status updated.');
    }

    /**
     * Get available types.
     */
    private function getTypes(): array
    {
        return [
            'general' => 'General',
            'important' => 'Important',
            'urgent' => 'Urgent',
            'event' => 'Event',
            'holiday' => 'Holiday',
            'admission' => 'Admission',
            'exam' => 'Exam',
            'result' => 'Result',
            'academic' => 'Academic',
            'other' => 'Other',
        ];
    }

    /**
     * Get available priorities.
     */
    private function getPriorities(): array
    {
        return [
            'low' => 'Low',
            'medium' => 'Medium',
            'high' => 'High',
            'critical' => 'Critical',
        ];
    }
}
