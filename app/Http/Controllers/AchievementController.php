<?php

namespace App\Http\Controllers;

use App\Models\Achievement;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AchievementController extends Controller
{
    /**
     * Display a listing of achievements.
     */
    public function index(Request $request): Response
    {
        $query = Achievement::active()
            ->orderByDesc('achievement_date')
            ->orderBy('order');

        // Filter by category
        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        // Filter by level
        if ($request->filled('level') && $request->level !== 'all') {
            $query->where('level', $request->level);
        }

        // Filter by academic year
        if ($request->filled('year') && $request->year !== 'all') {
            $query->where('academic_year', $request->year);
        }

        $achievements = $query->paginate(12)->withQueryString();

        // Get filter options
        $categories = $this->getCategoryOptions();
        $levels = $this->getLevelOptions();
        $years = Achievement::active()
            ->whereNotNull('academic_year')
            ->distinct()
            ->orderByDesc('academic_year')
            ->pluck('academic_year')
            ->toArray();

        // Get featured achievements for hero section
        $featured = Achievement::active()
            ->featured()
            ->orderBy('order')
            ->limit(3)
            ->get();

        // Get statistics
        $statistics = [
            'total' => Achievement::active()->count(),
            'international' => Achievement::active()->where('level', 'international')->count(),
            'national' => Achievement::active()->where('level', 'national')->count(),
            'state' => Achievement::active()->where('level', 'state')->count(),
        ];

        return Inertia::render('achievements/index', [
            'achievements' => $achievements,
            'featured' => $featured,
            'categories' => $categories,
            'levels' => $levels,
            'years' => $years,
            'statistics' => $statistics,
            'filters' => [
                'category' => $request->category ?? 'all',
                'level' => $request->level ?? 'all',
                'year' => $request->year ?? 'all',
            ],
        ]);
    }

    /**
     * Display the specified achievement.
     */
    public function show(Achievement $achievement): Response
    {
        if (!$achievement->is_active) {
            abort(404);
        }

        // Get related achievements (same category or level)
        $related = Achievement::active()
            ->where('id', '!=', $achievement->id)
            ->where(function ($query) use ($achievement) {
                $query->where('category', $achievement->category)
                    ->orWhere('level', $achievement->level);
            })
            ->orderByDesc('achievement_date')
            ->limit(4)
            ->get();

        return Inertia::render('achievements/show', [
            'achievement' => [
                'id' => $achievement->id,
                'title' => $achievement->title,
                'slug' => $achievement->slug,
                'description' => $achievement->description,
                'image' => $achievement->image,
                'image_url' => $achievement->image ? asset('storage/' . $achievement->image) : null,
                'category' => $achievement->category,
                'category_label' => $this->getCategoryOptions()[$achievement->category] ?? $achievement->category,
                'level' => $achievement->level,
                'level_label' => $this->getLevelOptions()[$achievement->level] ?? $achievement->level,
                'achiever_name' => $achievement->achiever_name,
                'achiever_class' => $achievement->achiever_class,
                'achievement_date' => $achievement->achievement_date?->format('F j, Y'),
                'academic_year' => $achievement->academic_year,
            ],
            'related' => $related->map(fn($a) => [
                'id' => $a->id,
                'title' => $a->title,
                'slug' => $a->slug,
                'image' => $a->image,
                'image_url' => $a->image ? asset('storage/' . $a->image) : null,
                'category' => $a->category,
                'level' => $a->level,
                'level_label' => $this->getLevelOptions()[$a->level] ?? $a->level,
            ]),
            'categories' => $this->getCategoryOptions(),
            'levels' => $this->getLevelOptions(),
        ]);
    }

    /**
     * Get category options.
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
     * Get level options.
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
