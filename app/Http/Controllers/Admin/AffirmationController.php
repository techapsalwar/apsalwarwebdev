<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Affirmation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AffirmationController extends Controller
{
    /**
     * Display a listing of affirmations
     */
    public function index(Request $request): Response
    {
        $query = Affirmation::query();

        // Filter by month
        if ($request->filled('month')) {
            $query->whereMonth('display_date', $request->month);
        }

        // Filter by year
        if ($request->filled('year')) {
            $query->whereYear('display_date', $request->year);
        }

        $affirmations = $query->orderByDesc('display_date')
            ->paginate(15)
            ->withQueryString();

        // Get today's affirmation
        $today = Affirmation::current();

        // Get thought change time setting
        $thoughtChangeTime = DB::table('settings')
            ->where('key', 'thought_change_time')
            ->value('value') ?? '00:00';

        return Inertia::render('admin/affirmations/index', [
            'affirmations' => $affirmations,
            'today' => $today,
            'thoughtChangeTime' => $thoughtChangeTime,
            'filters' => [
                'month' => $request->month,
                'year' => $request->year,
            ],
        ]);
    }

    /**
     * Show the form for creating a new affirmation
     */
    public function create(): Response
    {
        return Inertia::render('admin/affirmations/create');
    }

    /**
     * Store a newly created affirmation
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'quote' => ['required', 'string', 'max:1000'],
            'author' => ['nullable', 'string', 'max:255'],
            'display_date' => ['required', 'date', 'unique:affirmations,display_date'],
            'is_active' => ['boolean'],
        ]);

        Affirmation::create($validated);

        return redirect()->route('admin.affirmations.index')
            ->with('success', 'Affirmation created successfully.');
    }

    /**
     * Show the form for editing the specified affirmation
     */
    public function edit(Affirmation $affirmation): Response
    {
        return Inertia::render('admin/affirmations/edit', [
            'affirmation' => $affirmation,
        ]);
    }

    /**
     * Update the specified affirmation
     */
    public function update(Request $request, Affirmation $affirmation)
    {
        $validated = $request->validate([
            'quote' => ['required', 'string', 'max:1000'],
            'author' => ['nullable', 'string', 'max:255'],
            'display_date' => ['required', 'date', 'unique:affirmations,display_date,' . $affirmation->id],
            'is_active' => ['boolean'],
        ]);

        $affirmation->update($validated);

        return redirect()->route('admin.affirmations.index')
            ->with('success', 'Affirmation updated successfully.');
    }

    /**
     * Remove the specified affirmation
     */
    public function destroy(Affirmation $affirmation)
    {
        $affirmation->delete();

        return redirect()->route('admin.affirmations.index')
            ->with('success', 'Affirmation deleted successfully.');
    }

    /**
     * Toggle active status
     */
    public function toggleActive(Affirmation $affirmation)
    {
        $affirmation->update(['is_active' => !$affirmation->is_active]);

        return back()->with('success', 'Affirmation status updated.');
    }

    /**
     * Update thought change time setting
     */
    public function updateChangeTime(Request $request)
    {
        $validated = $request->validate([
            'time' => ['required', 'date_format:H:i'],
        ]);

        DB::table('settings')
            ->updateOrInsert(
                ['key' => 'thought_change_time'],
                [
                    'value' => $validated['time'],
                    'group' => 'general',
                    'type' => 'time',
                    'updated_at' => now(),
                ]
            );

        return back()->with('success', 'Thought change time updated to ' . $validated['time']);
    }

    /**
     * Bulk create affirmations for a week
     */
    public function bulkCreate(): Response
    {
        return Inertia::render('admin/affirmations/bulk-create');
    }

    /**
     * Store bulk affirmations
     */
    public function bulkStore(Request $request)
    {
        $validated = $request->validate([
            'affirmations' => ['required', 'array', 'min:1'],
            'affirmations.*.quote' => ['required', 'string', 'max:1000'],
            'affirmations.*.author' => ['nullable', 'string', 'max:255'],
            'affirmations.*.display_date' => ['required', 'date', 'unique:affirmations,display_date'],
        ]);

        foreach ($validated['affirmations'] as $data) {
            Affirmation::create([
                'quote' => $data['quote'],
                'author' => $data['author'] ?? null,
                'display_date' => $data['display_date'],
                'is_active' => true,
            ]);
        }

        return redirect()->route('admin.affirmations.index')
            ->with('success', count($validated['affirmations']) . ' affirmations created successfully.');
    }
}
