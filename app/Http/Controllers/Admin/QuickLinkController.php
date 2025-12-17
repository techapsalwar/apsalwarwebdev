<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\QuickLink;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QuickLinkController extends Controller
{
    /**
     * Display a listing of quick links
     */
    public function index(): Response
    {
        $quickLinks = QuickLink::orderBy('order')->get();

        return Inertia::render('admin/quick-links/index', [
            'quickLinks' => $quickLinks,
        ]);
    }

    /**
     * Show the form for creating a new quick link
     */
    public function create(): Response
    {
        return Inertia::render('admin/quick-links/create', [
            'icons' => $this->getIconOptions(),
        ]);
    }

    /**
     * Store a newly created quick link
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:100'],
            'url' => ['required', 'string', 'max:255'],
            'icon' => ['nullable', 'string', 'max:50'],
            'target' => ['required', 'in:_self,_blank'],
            'is_active' => ['boolean'],
            'is_new' => ['boolean'],
        ]);

        // Set order to max + 1
        $validated['order'] = QuickLink::max('order') + 1;

        QuickLink::create($validated);

        return redirect()->route('admin.quick-links.index')
            ->with('success', 'Quick link created successfully.');
    }

    /**
     * Show the form for editing the specified quick link
     */
    public function edit(QuickLink $quickLink): Response
    {
        return Inertia::render('admin/quick-links/edit', [
            'quickLink' => $quickLink,
            'icons' => $this->getIconOptions(),
        ]);
    }

    /**
     * Update the specified quick link
     */
    public function update(Request $request, QuickLink $quickLink)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:100'],
            'url' => ['required', 'string', 'max:255'],
            'icon' => ['nullable', 'string', 'max:50'],
            'target' => ['required', 'in:_self,_blank'],
            'is_active' => ['boolean'],
            'is_new' => ['boolean'],
        ]);

        $quickLink->update($validated);

        return redirect()->route('admin.quick-links.index')
            ->with('success', 'Quick link updated successfully.');
    }

    /**
     * Remove the specified quick link
     */
    public function destroy(QuickLink $quickLink)
    {
        $quickLink->delete();

        return redirect()->route('admin.quick-links.index')
            ->with('success', 'Quick link deleted successfully.');
    }

    /**
     * Toggle active status
     */
    public function toggleActive(QuickLink $quickLink)
    {
        $quickLink->update(['is_active' => !$quickLink->is_active]);

        return back()->with('success', 'Quick link status updated.');
    }

    /**
     * Reorder quick links
     */
    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'exists:quick_links,id'],
            'items.*.order' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($validated['items'] as $item) {
            QuickLink::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return back()->with('success', 'Quick links reordered successfully.');
    }

    /**
     * Get available icon options
     */
    private function getIconOptions(): array
    {
        return [
            'home' => 'Home',
            'book' => 'Book',
            'calendar' => 'Calendar',
            'users' => 'Users',
            'file' => 'File',
            'image' => 'Image',
            'phone' => 'Phone',
            'mail' => 'Mail',
            'map' => 'Map',
            'award' => 'Award',
            'star' => 'Star',
            'heart' => 'Heart',
            'info' => 'Info',
            'bell' => 'Bell',
            'download' => 'Download',
            'external-link' => 'External Link',
            'graduation-cap' => 'Graduation Cap',
            'building' => 'Building',
            'newspaper' => 'Newspaper',
            'clipboard' => 'Clipboard',
        ];
    }
}
