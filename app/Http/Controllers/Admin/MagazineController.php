<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Magazine;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class MagazineController extends Controller
{
    public function index(Request $request)
    {
        $query = Magazine::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('issue_number', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        $magazines = $query->orderBy('issue_date', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/magazines/index', [
            'magazines' => $magazines,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/magazines/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'pdf' => 'required|file|mimes:pdf|max:102400',
            'cover_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'issue_date' => 'required|date',
            'issue_number' => 'nullable|string|max:50',
            'is_active' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['title']);

        // Handle PDF upload
        $pdf = $request->file('pdf');
        $validated['pdf_path'] = $pdf->store('magazines', 'public');
        $validated['file_size'] = $pdf->getSize();

        // Handle cover image upload
        if ($request->hasFile('cover_image')) {
            $validated['cover_image'] = $request->file('cover_image')->store('magazines/covers', 'public');
        }

        unset($validated['pdf']);

        Magazine::create($validated);

        return redirect()->route('admin.magazines.index')
            ->with('success', 'Magazine uploaded successfully.');
    }

    public function edit(Magazine $magazine)
    {
        return Inertia::render('admin/magazines/edit', [
            'magazine' => $magazine,
        ]);
    }

    public function update(Request $request, Magazine $magazine)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'pdf' => 'nullable|file|mimes:pdf|max:102400',
            'cover_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'issue_date' => 'required|date',
            'issue_number' => 'nullable|string|max:50',
            'is_active' => 'boolean',
        ]);

        if ($magazine->title !== $validated['title']) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        // Handle PDF replacement
        if ($request->hasFile('pdf')) {
            Storage::disk('public')->delete($magazine->pdf_path);
            $pdf = $request->file('pdf');
            $validated['pdf_path'] = $pdf->store('magazines', 'public');
            $validated['file_size'] = $pdf->getSize();
        }

        // Handle cover image replacement
        if ($request->hasFile('cover_image')) {
            if ($magazine->cover_image) {
                Storage::disk('public')->delete($magazine->cover_image);
            }
            $validated['cover_image'] = $request->file('cover_image')->store('magazines/covers', 'public');
        }

        unset($validated['pdf']);

        $magazine->update($validated);

        return redirect()->route('admin.magazines.index')
            ->with('success', 'Magazine updated successfully.');
    }

    public function destroy(Magazine $magazine)
    {
        Storage::disk('public')->delete($magazine->pdf_path);
        if ($magazine->cover_image) {
            Storage::disk('public')->delete($magazine->cover_image);
        }

        $magazine->delete();

        return redirect()->route('admin.magazines.index')
            ->with('success', 'Magazine deleted successfully.');
    }

    public function toggleActive(Magazine $magazine)
    {
        $magazine->update(['is_active' => !$magazine->is_active]);

        return back()->with('success', 'Magazine status updated.');
    }

    public function setFeatured(Magazine $magazine)
    {
        // Unset all other featured magazines
        Magazine::where('is_featured', true)->update(['is_featured' => false]);

        $magazine->update(['is_featured' => true]);

        return back()->with('success', 'Magazine set as featured.');
    }
}
