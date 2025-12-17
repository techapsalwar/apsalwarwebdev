<?php

namespace App\Http\Controllers\Admin;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends AdminResourceController
{
    protected string $model = Event::class;
    protected string $pagePrefix = 'admin/events';
    protected string $resourceName = 'Event';
    protected array $searchFields = ['title', 'description', 'venue'];

    /**
     * Display a listing of events.
     */
    public function index(Request $request): Response
    {
        $query = Event::query();

        // Apply search filter
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('venue', 'like', "%{$search}%");
            });
        }

        // Apply status filter
        if ($status = $request->get('status')) {
            if ($status !== 'all') {
                $query->where('status', $status);
            }
        }

        // Apply sorting
        $sortField = $request->get('sort', 'start_date');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        // Paginate results
        $items = $query->paginate($request->get('per_page', 15))
            ->withQueryString();

        return Inertia::render('admin/events/index', [
            'items' => $items,
            'filters' => $request->only(['search', 'sort', 'direction', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new event.
     */
    public function create(): Response
    {
        return Inertia::render('admin/events/create', [
            'eventTypes' => $this->getEventTypes(),
            'statuses' => $this->getStatuses(),
        ]);
    }

    /**
     * Store a newly created event in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:events,slug',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
            'content' => 'nullable|string',
            'venue' => 'nullable|string|max:255',
            'event_type' => 'nullable|string|max:50',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'start_time' => 'nullable|string',
            'end_time' => 'nullable|string',
            'featured_image' => 'nullable|image|max:2048',
            'status' => 'required|in:upcoming,ongoing,completed,cancelled',
            'is_featured' => 'boolean',
            'organizer' => 'nullable|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:20',
            'registration_required' => 'boolean',
            'registration_link' => 'nullable|url|max:255',
            'registration_deadline' => 'nullable|date',
            'max_participants' => 'nullable|integer|min:0',
            'google_form_url' => 'nullable|url|max:500',
            'google_sheet_url' => 'nullable|url|max:500',
        ]);

        // Generate slug if not provided
        $validated['slug'] = $validated['slug'] ?? $this->generateSlug($validated['title']);

        // Handle featured image upload
        if ($request->hasFile('featured_image')) {
            $validated['featured_image'] = $request->file('featured_image')
                ->store('events', 'public');
        }

        $event = Event::create($validated);

        $this->logAudit('created', $event);

        return redirect()
            ->route('admin.events.index')
            ->with('success', 'Event created successfully.');
    }

    /**
     * Display the specified event.
     */
    public function show(int $id): Response
    {
        $item = Event::findOrFail($id);

        return Inertia::render('admin/events/show', [
            'item' => $item,
        ]);
    }

    /**
     * Show the form for editing the specified event.
     */
    public function edit(int $id): Response
    {
        $item = Event::findOrFail($id);

        return Inertia::render('admin/events/edit', [
            'item' => $item,
            'eventTypes' => $this->getEventTypes(),
            'statuses' => $this->getStatuses(),
        ]);
    }

    /**
     * Update the specified event in storage.
     */
    public function update(Request $request, int $id)
    {
        $event = Event::findOrFail($id);
        $oldData = $event->toArray();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:events,slug,' . $id,
            'description' => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
            'content' => 'nullable|string',
            'venue' => 'nullable|string|max:255',
            'event_type' => 'nullable|string|max:50',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'start_time' => 'nullable|string',
            'end_time' => 'nullable|string',
            'featured_image' => 'nullable|image|max:2048',
            'status' => 'required|in:upcoming,ongoing,completed,cancelled',
            'is_featured' => 'boolean',
            'organizer' => 'nullable|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:20',
            'registration_required' => 'boolean',
            'registration_link' => 'nullable|url|max:255',
            'registration_deadline' => 'nullable|date',
            'max_participants' => 'nullable|integer|min:0',
            'google_form_url' => 'nullable|url|max:500',
            'google_sheet_url' => 'nullable|url|max:500',
        ]);

        // Generate slug if title changed and no slug provided
        if (empty($validated['slug']) || !isset($validated['slug'])) {
            if ($validated['title'] !== $event->title) {
                $validated['slug'] = $this->generateSlug($validated['title'], $id);
            } else {
                unset($validated['slug']);
            }
        }

        // Handle featured image upload
        if ($request->hasFile('featured_image')) {
            // Delete old image
            if ($event->featured_image) {
                Storage::disk('public')->delete($event->featured_image);
            }
            $validated['featured_image'] = $request->file('featured_image')
                ->store('events', 'public');
        }

        $event->update($validated);

        $this->logAudit('updated', $event, $oldData);

        return redirect()
            ->route('admin.events.index')
            ->with('success', 'Event updated successfully.');
    }

    /**
     * Remove the specified event from storage.
     */
    public function destroy(int $id)
    {
        $event = Event::findOrFail($id);

        // Delete featured image
        if ($event->featured_image) {
            Storage::disk('public')->delete($event->featured_image);
        }

        $this->logAudit('deleted', $event);

        $event->delete();

        return redirect()
            ->route('admin.events.index')
            ->with('success', 'Event deleted successfully.');
    }

    /**
     * Get available event types.
     */
    private function getEventTypes(): array
    {
        return [
            'cultural' => 'Cultural',
            'sports' => 'Sports',
            'academic' => 'Academic',
            'competition' => 'Competition',
            'workshop' => 'Workshop',
            'celebration' => 'Celebration',
            'meeting' => 'Meeting',
            'other' => 'Other',
        ];
    }

    /**
     * Get available statuses.
     */
    private function getStatuses(): array
    {
        return [
            'upcoming' => 'Upcoming',
            'ongoing' => 'Ongoing',
            'completed' => 'Completed',
            'cancelled' => 'Cancelled',
        ];
    }
}
