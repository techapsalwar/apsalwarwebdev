<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    /**
     * Display a listing of events
     */
    public function index(Request $request)
    {
        $query = Event::query()
            ->whereIn('status', ['upcoming', 'ongoing'])
            ->orderBy('start_date', 'asc');

        // Filter by type if provided
        if ($request->has('type') && $request->type !== 'all') {
            $query->where('event_type', $request->type);
        }

        // Filter by status if provided
        if ($request->has('status') && in_array($request->status, ['upcoming', 'ongoing', 'completed'])) {
            $query->where('status', $request->status);
        }

        // Search functionality
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('short_description', 'like', "%{$search}%")
                    ->orWhere('venue', 'like', "%{$search}%");
            });
        }

        // Show past events if requested
        if ($request->has('show_past') && $request->show_past === 'true') {
            $query = Event::query()
                ->orderBy('start_date', 'desc');
            
            if ($request->has('type') && $request->type !== 'all') {
                $query->where('event_type', $request->type);
            }
        }

        $events = $query->paginate(12)->withQueryString();

        // Get event types for filter
        $eventTypes = Event::distinct()
            ->whereNotNull('event_type')
            ->pluck('event_type')
            ->filter()
            ->values();

        // Get upcoming featured events
        $featuredEvents = Event::where('is_featured', true)
            ->whereIn('status', ['upcoming', 'ongoing'])
            ->orderBy('start_date', 'asc')
            ->take(3)
            ->get();

        return Inertia::render('events/index', [
            'events' => $events,
            'featuredEvents' => $featuredEvents,
            'eventTypes' => $eventTypes,
            'filters' => [
                'type' => $request->type ?? 'all',
                'status' => $request->status ?? null,
                'search' => $request->search ?? '',
                'show_past' => $request->show_past ?? 'false',
            ],
        ]);
    }

    /**
     * Display the specified event
     */
    public function show(string $slug)
    {
        $event = Event::where('slug', $slug)->firstOrFail();

        // Get related events (same type or nearby dates)
        $relatedEvents = Event::where('id', '!=', $event->id)
            ->whereIn('status', ['upcoming', 'ongoing'])
            ->where(function ($query) use ($event) {
                $query->where('event_type', $event->event_type)
                    ->orWhereBetween('start_date', [
                        now()->subDays(30)->toDateString(),
                        now()->addDays(60)->toDateString()
                    ]);
            })
            ->orderBy('start_date', 'asc')
            ->take(4)
            ->get();

        return Inertia::render('events/show', [
            'event' => $event,
            'relatedEvents' => $relatedEvents,
        ]);
    }

    /**
     * Redirect to registration (Google Form)
     */
    public function register(string $slug)
    {
        $event = Event::where('slug', $slug)->firstOrFail();

        if (!$event->registration_required) {
            return redirect()->route('events.show', $slug)
                ->with('info', 'This event does not require registration.');
        }

        // Check registration deadline
        if ($event->registration_deadline && now()->isAfter($event->registration_deadline)) {
            return redirect()->route('events.show', $slug)
                ->with('error', 'Registration deadline has passed.');
        }

        // Check max participants
        if ($event->max_participants && $event->current_participants >= $event->max_participants) {
            return redirect()->route('events.show', $slug)
                ->with('error', 'Event is fully booked.');
        }

        // Redirect to Google Form if available
        if ($event->google_form_url) {
            return redirect()->away($event->google_form_url);
        }

        // Redirect to external registration link if available
        if ($event->registration_link) {
            return redirect()->away($event->registration_link);
        }

        return redirect()->route('events.show', $slug)
            ->with('info', 'Registration link is not available yet.');
    }
}
