<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AchievementController extends Controller
{
    /**
     * Display a listing of achievements
     */
    public function index(Request $request): Response
    {
        $query = Achievement::query();

        // Filter by category
        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        // Filter by level
        if ($request->filled('level') && $request->level !== 'all') {
            $query->where('level', $request->level);
        }

        // Search
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                    ->orWhere('achiever_name', 'like', '%' . $request->search . '%');
            });
        }

        $achievements = $query->orderByDesc('achievement_date')
            ->orderBy('order')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/achievements/index', [
            'achievements' => $achievements,
            'categories' => $this->getCategoryOptions(),
            'levels' => $this->getLevelOptions(),
            'filters' => [
                'category' => $request->category ?? 'all',
                'level' => $request->level ?? 'all',
                'search' => $request->search,
            ],
        ]);
    }

    /**
     * Show the form for creating a new achievement
     */
    public function create(): Response
    {
        return Inertia::render('admin/achievements/create', [
            'categories' => $this->getCategoryOptions(),
            'levels' => $this->getLevelOptions(),
        ]);
    }

    /**
     * Store a newly created achievement
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'image' => ['nullable', 'image', 'max:2048'],
            'category' => ['required', 'string'],
            'level' => ['required', 'string'],
            'achiever_name' => ['nullable', 'string', 'max:255'],
            'achiever_class' => ['nullable', 'string', 'max:50'],
            'achievement_date' => ['nullable', 'date'],
            'academic_year' => ['nullable', 'string', 'max:20'],
            'is_featured' => ['boolean'],
            'is_active' => ['boolean'],
        ]);

        // Generate slug
        $validated['slug'] = Str::slug($validated['title']);
        
        // Ensure unique slug
        $count = Achievement::where('slug', 'like', $validated['slug'] . '%')->count();
        if ($count > 0) {
            $validated['slug'] .= '-' . ($count + 1);
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('achievements', 'public');
        }

        // Set order
        $validated['order'] = Achievement::max('order') + 1;

        Achievement::create($validated);

        return redirect()->route('admin.achievements.index')
            ->with('success', 'Achievement created successfully.');
    }

    /**
     * Show the form for editing the specified achievement
     */
    public function edit(Achievement $achievement): Response
    {
        return Inertia::render('admin/achievements/edit', [
            'achievement' => $achievement,
            'categories' => $this->getCategoryOptions(),
            'levels' => $this->getLevelOptions(),
        ]);
    }

    /**
     * Update the specified achievement
     */
    public function update(Request $request, Achievement $achievement)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'image' => ['nullable', 'image', 'max:2048'],
            'category' => ['required', 'string'],
            'level' => ['required', 'string'],
            'achiever_name' => ['nullable', 'string', 'max:255'],
            'achiever_class' => ['nullable', 'string', 'max:50'],
            'achievement_date' => ['nullable', 'date'],
            'academic_year' => ['nullable', 'string', 'max:20'],
            'is_featured' => ['boolean'],
            'is_active' => ['boolean'],
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            if ($achievement->image) {
                Storage::disk('public')->delete($achievement->image);
            }
            $validated['image'] = $request->file('image')->store('achievements', 'public');
        }

        $achievement->update($validated);

        return redirect()->route('admin.achievements.index')
            ->with('success', 'Achievement updated successfully.');
    }

    /**
     * Display the specified achievement
     */
    public function show(Achievement $achievement): Response
    {
        return Inertia::render('admin/achievements/show', [
            'achievement' => $achievement,
            'categories' => $this->getCategoryOptions(),
            'levels' => $this->getLevelOptions(),
        ]);
    }

    /**
     * Remove the specified achievement
     */
    public function destroy(Achievement $achievement)
    {
        if ($achievement->image) {
            Storage::disk('public')->delete($achievement->image);
        }

        $achievement->delete();

        return redirect()->route('admin.achievements.index')
            ->with('success', 'Achievement deleted successfully.');
    }

    /**
     * Toggle active status
     */
    public function toggleActive(Achievement $achievement)
    {
        $achievement->update(['is_active' => !$achievement->is_active]);

        return back()->with('success', 'Achievement status updated.');
    }

    /**
     * Toggle featured status
     */
    public function toggleFeatured(Achievement $achievement)
    {
        $achievement->update(['is_featured' => !$achievement->is_featured]);

        return back()->with('success', 'Achievement featured status updated.');
    }

    /**
     * Get category options
     */
    private function getCategoryOptions(): array
    {
        return [
            'academic' => 'Academic',
            'sports' => 'Sports',
            'cultural' => 'Cultural',
            'ncc' => 'NCC',
            'co_curricular' => 'Co-curricular',
            'faculty' => 'Faculty',
            'school' => 'School',
            'other' => 'Other',
        ];
    }

    /**
     * Get level options
     */
    private function getLevelOptions(): array
    {
        return [
            'international' => 'International',
            'national' => 'National',
            'state' => 'State',
            'district' => 'District',
            'school' => 'School',
        ];
    }
}
