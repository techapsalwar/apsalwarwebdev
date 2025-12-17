<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TestimonialController extends Controller
{
    public const TYPES = [
        'student' => 'Student',
        'parent' => 'Parent',
        'alumni' => 'Alumni',
        'staff' => 'Staff',
        'other' => 'Other',
    ];

    public function index(Request $request)
    {
        $query = Testimonial::query();

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%")
                    ->orWhere('designation', 'like', "%{$search}%");
            });
        }

        // Type filter
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        $testimonials = $query->orderBy('order')
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/testimonials/index', [
            'testimonials' => $testimonials,
            'filters' => $request->only(['search', 'type', 'status']),
            'types' => self::TYPES,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/testimonials/create', [
            'types' => self::TYPES,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'content' => 'required|string|min:20',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:1024',
            'type' => 'required|string|in:' . implode(',', array_keys(self::TYPES)),
            'designation' => 'nullable|string|max:255',
            'rating' => 'nullable|integer|min:1|max:5',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ]);

        // Handle photo upload
        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('testimonials', 'public');
        }

        // Set order
        $validated['order'] = Testimonial::max('order') + 1;

        Testimonial::create($validated);

        return redirect()->route('admin.testimonials.index')
            ->with('success', 'Testimonial created successfully.');
    }

    public function edit(Testimonial $testimonial)
    {
        return Inertia::render('admin/testimonials/edit', [
            'testimonial' => $testimonial,
            'types' => self::TYPES,
        ]);
    }

    public function update(Request $request, Testimonial $testimonial)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'content' => 'required|string|min:20',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:1024',
            'type' => 'required|string|in:' . implode(',', array_keys(self::TYPES)),
            'designation' => 'nullable|string|max:255',
            'rating' => 'nullable|integer|min:1|max:5',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ]);

        // Handle photo upload
        if ($request->hasFile('photo')) {
            // Delete old photo
            if ($testimonial->photo) {
                Storage::disk('public')->delete($testimonial->photo);
            }
            $validated['photo'] = $request->file('photo')->store('testimonials', 'public');
        }

        $testimonial->update($validated);

        return redirect()->route('admin.testimonials.index')
            ->with('success', 'Testimonial updated successfully.');
    }

    public function destroy(Testimonial $testimonial)
    {
        // Delete photo
        if ($testimonial->photo) {
            Storage::disk('public')->delete($testimonial->photo);
        }

        $testimonial->delete();

        return redirect()->route('admin.testimonials.index')
            ->with('success', 'Testimonial deleted successfully.');
    }

    public function toggleActive(Testimonial $testimonial)
    {
        $testimonial->update(['is_active' => !$testimonial->is_active]);

        return back()->with('success', 'Testimonial status updated.');
    }

    public function toggleFeatured(Testimonial $testimonial)
    {
        $testimonial->update(['is_featured' => !$testimonial->is_featured]);

        return back()->with('success', 'Featured status updated.');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:testimonials,id',
            'items.*.order' => 'required|integer|min:0',
        ]);

        foreach ($request->items as $item) {
            Testimonial::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return back()->with('success', 'Testimonials reordered successfully.');
    }
}
