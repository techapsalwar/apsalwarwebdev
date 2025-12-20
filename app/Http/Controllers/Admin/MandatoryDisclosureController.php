<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MandatoryDisclosure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MandatoryDisclosureController extends Controller
{
    /**
     * Display listing of mandatory disclosures.
     */
    public function index(Request $request)
    {
        $query = MandatoryDisclosure::query();

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('title', 'like', "%{$search}%");
        }

        // Category filter
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        $disclosures = $query->ordered()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/mandatory-disclosures/index', [
            'disclosures' => $disclosures,
            'filters' => $request->only(['search', 'category', 'status']),
            'categories' => MandatoryDisclosure::getCategoryOptions(),
        ]);
    }

    /**
     * Show form for creating a new disclosure.
     */
    public function create()
    {
        return Inertia::render('admin/mandatory-disclosures/create', [
            'categories' => MandatoryDisclosure::getCategoryOptions(),
        ]);
    }

    /**
     * Store a newly created disclosure.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'nullable|string|in:' . implode(',', array_keys(MandatoryDisclosure::getCategoryOptions())),
            'file' => 'required|file|mimes:pdf|max:10240', // Max 10MB PDF
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        // Handle file upload
        $file = $request->file('file');
        $validated['file_name'] = $file->getClientOriginalName();
        $validated['file_path'] = $file->store('mandatory-disclosures', 'public');
        $validated['file_size'] = $file->getSize();

        // Set default sort order if not provided
        if (!isset($validated['sort_order'])) {
            $validated['sort_order'] = MandatoryDisclosure::max('sort_order') + 1;
        }

        MandatoryDisclosure::create($validated);

        return redirect()->route('admin.mandatory-disclosures.index')
            ->with('success', 'Mandatory disclosure uploaded successfully.');
    }

    /**
     * Show form for editing a disclosure.
     */
    public function edit(MandatoryDisclosure $mandatoryDisclosure)
    {
        return Inertia::render('admin/mandatory-disclosures/edit', [
            'disclosure' => $mandatoryDisclosure,
            'categories' => MandatoryDisclosure::getCategoryOptions(),
        ]);
    }

    /**
     * Update the specified disclosure.
     */
    public function update(Request $request, MandatoryDisclosure $mandatoryDisclosure)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'nullable|string|in:' . implode(',', array_keys(MandatoryDisclosure::getCategoryOptions())),
            'file' => 'nullable|file|mimes:pdf|max:10240',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        // Handle file upload if new file provided
        if ($request->hasFile('file')) {
            // Delete old file
            if ($mandatoryDisclosure->file_path) {
                Storage::disk('public')->delete($mandatoryDisclosure->file_path);
            }

            $file = $request->file('file');
            $validated['file_name'] = $file->getClientOriginalName();
            $validated['file_path'] = $file->store('mandatory-disclosures', 'public');
            $validated['file_size'] = $file->getSize();
        }

        $mandatoryDisclosure->update($validated);

        return redirect()->route('admin.mandatory-disclosures.index')
            ->with('success', 'Mandatory disclosure updated successfully.');
    }

    /**
     * Remove the specified disclosure.
     */
    public function destroy(MandatoryDisclosure $mandatoryDisclosure)
    {
        // Delete file
        if ($mandatoryDisclosure->file_path) {
            Storage::disk('public')->delete($mandatoryDisclosure->file_path);
        }

        $mandatoryDisclosure->delete();

        return redirect()->route('admin.mandatory-disclosures.index')
            ->with('success', 'Mandatory disclosure deleted successfully.');
    }

    /**
     * Toggle active status.
     */
    public function toggleActive(MandatoryDisclosure $mandatoryDisclosure)
    {
        $mandatoryDisclosure->update(['is_active' => !$mandatoryDisclosure->is_active]);

        return back()->with('success', 'Status updated successfully.');
    }

    /**
     * Update sort order via drag and drop.
     */
    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:mandatory_disclosures,id',
        ]);

        foreach ($validated['ids'] as $index => $id) {
            MandatoryDisclosure::where('id', $id)->update(['sort_order' => $index]);
        }

        return back()->with('success', 'Order updated successfully.');
    }

    /**
     * Download a disclosure file.
     */
    public function download(MandatoryDisclosure $mandatoryDisclosure)
    {
        return Storage::disk('public')->download(
            $mandatoryDisclosure->file_path,
            $mandatoryDisclosure->file_name ?? $mandatoryDisclosure->title . '.pdf'
        );
    }
}
