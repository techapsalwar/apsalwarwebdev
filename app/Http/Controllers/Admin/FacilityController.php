<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class FacilityController extends Controller
{
    public function index(Request $request)
    {
        $query = Facility::query();

        // Search
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($category = $request->input('category')) {
            $query->where('category', $category);
        }

        // Filter by status
        if ($request->has('active')) {
            $query->where('is_active', $request->boolean('active'));
        }

        $facilities = $query
            ->orderBy('order')
            ->orderBy('name')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('admin/facilities/index', [
            'facilities' => [
                'data' => $facilities->items(),
                'meta' => [
                    'current_page' => $facilities->currentPage(),
                    'last_page' => $facilities->lastPage(),
                    'per_page' => $facilities->perPage(),
                    'total' => $facilities->total(),
                ],
                'links' => [
                    'prev' => $facilities->previousPageUrl(),
                    'next' => $facilities->nextPageUrl(),
                ],
            ],
            'filters' => [
                'search' => $request->input('search', ''),
                'category' => $request->input('category', ''),
                'active' => $request->input('active', ''),
            ],
            'categories' => $this->getCategories(),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/facilities/create', [
            'categories' => $this->getCategories(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'gallery' => 'nullable|array',
            'gallery.*' => 'image|max:2048',
            'category' => 'required|string|in:lab,classroom,sports,library,auditorium,playground,special_room,other',
            'features' => 'nullable|array',
            'features.*' => 'string|max:255',
            'location' => 'nullable|string|max:255',
            'capacity' => 'nullable|string|max:100',
            'equipment' => 'nullable|array',
            'equipment.*' => 'string|max:255',
            'has_virtual_tour' => 'boolean',
            'virtual_tour_url' => 'nullable|url',
            'order' => 'integer|min:0',
            'is_active' => 'boolean',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('facilities', 'public');
        }

        // Handle gallery upload
        if ($request->hasFile('gallery')) {
            $galleryPaths = [];
            foreach ($request->file('gallery') as $file) {
                $galleryPaths[] = $file->store('facilities/gallery', 'public');
            }
            $validated['gallery'] = $galleryPaths;
        }

        $validated['is_active'] = $request->boolean('is_active');
        $validated['has_virtual_tour'] = $request->boolean('has_virtual_tour');

        Facility::create($validated);

        return redirect()->route('admin.facilities.index')
            ->with('success', 'Facility created successfully.');
    }

    public function edit(Facility $facility)
    {
        return Inertia::render('admin/facilities/edit', [
            'facility' => $facility,
            'categories' => $this->getCategories(),
        ]);
    }

    public function update(Request $request, Facility $facility)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'gallery' => 'nullable|array',
            'gallery.*' => 'image|max:2048',
            'category' => 'required|string|in:lab,classroom,sports,library,auditorium,playground,special_room,other',
            'features' => 'nullable|array',
            'features.*' => 'string|max:255',
            'location' => 'nullable|string|max:255',
            'capacity' => 'nullable|string|max:100',
            'equipment' => 'nullable|array',
            'equipment.*' => 'string|max:255',
            'gallery_keep' => 'nullable|array',
            'gallery_keep.*' => 'string',
            'has_virtual_tour' => 'boolean',
            'virtual_tour_url' => 'nullable|url',
            'order' => 'integer|min:0',
            'is_active' => 'boolean',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            if ($facility->image) {
                Storage::disk('public')->delete($facility->image);
            }
            $validated['image'] = $request->file('image')->store('facilities', 'public');
        } elseif ($request->boolean('remove_image')) {
            if ($facility->image) {
                Storage::disk('public')->delete($facility->image);
            }
            $validated['image'] = null;
        }

        // Handle gallery: keep selected + add new uploads
        $galleryPaths = [];
        
        // Keep selected existing images
        if ($request->has('gallery_keep')) {
            $keptImages = $request->input('gallery_keep', []);
            // Delete removed images from storage
            if ($facility->gallery) {
                foreach ($facility->gallery as $existingImage) {
                    if (!in_array($existingImage, $keptImages)) {
                        Storage::disk('public')->delete($existingImage);
                    }
                }
            }
            $galleryPaths = $keptImages;
        } elseif (!$request->hasFile('gallery') && $facility->gallery) {
            // No gallery_keep and no new files = keep existing
            $galleryPaths = $facility->gallery;
        }

        // Add new gallery uploads
        if ($request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $file) {
                $galleryPaths[] = $file->store('facilities/gallery', 'public');
            }
        }

        $validated['gallery'] = !empty($galleryPaths) ? $galleryPaths : null;

        $validated['is_active'] = $request->boolean('is_active');
        $validated['has_virtual_tour'] = $request->boolean('has_virtual_tour');

        // Remove validation-only keys
        unset($validated['gallery_keep']);

        $facility->update($validated);

        return redirect()->route('admin.facilities.index')
            ->with('success', 'Facility updated successfully.');
    }

    public function destroy(Facility $facility)
    {
        if ($facility->image) {
            Storage::disk('public')->delete($facility->image);
        }

        if ($facility->gallery) {
            foreach ($facility->gallery as $image) {
                Storage::disk('public')->delete($image);
            }
        }

        $facility->delete();

        return redirect()->route('admin.facilities.index')
            ->with('success', 'Facility deleted successfully.');
    }

    public function toggleActive(int $facility)
    {
        $facilityModel = Facility::findOrFail($facility);
        $facilityModel->update(['is_active' => !$facilityModel->is_active]);

        return back()->with('success', 'Facility status updated.');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'facilities' => 'required|array',
            'facilities.*.id' => 'required|exists:facilities,id',
            'facilities.*.order' => 'required|integer|min:0',
        ]);

        foreach ($request->facilities as $item) {
            Facility::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return back()->with('success', 'Facility order updated.');
    }

    private function getCategories(): array
    {
        return Facility::getCategoryOptions();
    }
}
