<?php

namespace App\Http\Controllers;

use App\Models\Facility;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FacilitiesController extends Controller
{
    /**
     * Display the public facilities page.
     */
    public function index(Request $request)
    {
        $category = $request->query('category');
        
        $query = Facility::where('is_active', true)->orderBy('order');
            
        if ($category && $category !== 'all') {
            $query->where('category', $category);
        }
        
        $facilities = $query->get()->map(fn($f) => $f->toPublicArray())->toArray();

        // Get categories with counts using centralized method
        $categories = Facility::getCategoriesWithCounts();

        // Campus info
        $totalFacilities = Facility::where('is_active', true)->count();
        $labCount = Facility::where('is_active', true)->where('category', 'lab')->count();

        return Inertia::render('facilities/index', [
            'facilities' => $facilities,
            'categories' => $categories,
            'selectedCategory' => $category ?? 'all',
            'campusInfo' => [
                'area' => '14.5 acres',
                'totalFacilities' => $totalFacilities,
                'smartClassrooms' => 38,
                'labs' => $labCount,
            ],
        ]);
    }

    /**
     * Display a specific facility.
     */
    public function show(string $slug)
    {
        $facility = Facility::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        // Get related facilities from same category
        $relatedFacilities = Facility::where('category', $facility->category)
            ->where('id', '!=', $facility->id)
            ->where('is_active', true)
            ->orderBy('order')
            ->limit(4)
            ->get()
            ->map(fn($f) => [
                'id' => $f->id,
                'name' => $f->name,
                'slug' => $f->slug,
                'image' => $f->image,
                'category' => $f->category,
            ])
            ->toArray();

        return Inertia::render('facilities/show', [
            'facility' => $facility->toPublicArray(),
            'relatedFacilities' => $relatedFacilities,
        ]);
    }
}
