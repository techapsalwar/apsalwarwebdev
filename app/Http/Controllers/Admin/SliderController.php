<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Slider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SliderController extends Controller
{
    /**
     * Display a listing of sliders
     */
    public function index(Request $request): Response
    {
        $sliders = Slider::orderBy('order')
            ->orderByDesc('created_at')
            ->paginate(10);

        return Inertia::render('admin/sliders/index', [
            'sliders' => $sliders,
        ]);
    }

    /**
     * Show the form for creating a new slider
     */
    public function create(): Response
    {
        return Inertia::render('admin/sliders/create');
    }

    /**
     * Store a newly created slider
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:500'],
            'image' => ['required', 'image', 'max:5120'], // 5MB max
            'button_text' => ['nullable', 'string', 'max:50'],
            'button_link' => ['nullable', 'string', 'max:255'],
            'button_text_2' => ['nullable', 'string', 'max:50'],
            'button_link_2' => ['nullable', 'string', 'max:255'],
            'text_position' => ['required', 'in:left,center,right'],
            'is_active' => ['boolean'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('sliders', 'public');
        }

        // Set order to max + 1
        $validated['order'] = Slider::max('order') + 1;

        Slider::create($validated);

        return redirect()->route('admin.sliders.index')
            ->with('success', 'Slider created successfully.');
    }

    /**
     * Show the form for editing the specified slider
     */
    public function edit(Slider $slider): Response
    {
        return Inertia::render('admin/sliders/edit', [
            'slider' => $slider,
        ]);
    }

    /**
     * Update the specified slider
     */
    public function update(Request $request, Slider $slider)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:500'],
            'image' => ['nullable', 'image', 'max:5120'],
            'button_text' => ['nullable', 'string', 'max:50'],
            'button_link' => ['nullable', 'string', 'max:255'],
            'button_text_2' => ['nullable', 'string', 'max:50'],
            'button_link_2' => ['nullable', 'string', 'max:255'],
            'text_position' => ['required', 'in:left,center,right'],
            'is_active' => ['boolean'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image
            if ($slider->image) {
                Storage::disk('public')->delete($slider->image);
            }
            $validated['image'] = $request->file('image')->store('sliders', 'public');
        }

        $slider->update($validated);

        return redirect()->route('admin.sliders.index')
            ->with('success', 'Slider updated successfully.');
    }

    /**
     * Remove the specified slider
     */
    public function destroy(Slider $slider)
    {
        // Delete image
        if ($slider->image) {
            Storage::disk('public')->delete($slider->image);
        }

        $slider->delete();

        return redirect()->route('admin.sliders.index')
            ->with('success', 'Slider deleted successfully.');
    }

    /**
     * Toggle active status
     */
    public function toggleActive(Slider $slider)
    {
        $slider->update(['is_active' => !$slider->is_active]);

        return back()->with('success', 'Slider status updated.');
    }

    /**
     * Reorder sliders
     */
    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'exists:sliders,id'],
            'items.*.order' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($validated['items'] as $item) {
            Slider::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return back()->with('success', 'Sliders reordered successfully.');
    }
}
