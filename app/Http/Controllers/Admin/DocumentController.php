<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class DocumentController extends Controller
{
    public const CATEGORIES = [
        'circular' => 'Circular',
        'academic' => 'Academic',
        'form' => 'Form',
        'report' => 'Report',
        'policy' => 'Policy',
        'newsletter' => 'Newsletter',
        'other' => 'Other',
    ];

    public function index(Request $request)
    {
        $query = Document::query();

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Category filter
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        $documents = $query->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/documents/index', [
            'documents' => $documents,
            'filters' => $request->only(['search', 'category', 'status']),
            'categories' => self::CATEGORIES,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/documents/create', [
            'categories' => self::CATEGORIES,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file' => 'required|file|mimes:pdf,doc,docx,xls,xlsx,ppt,pptx,jpg,jpeg,png|max:10240',
            'category' => 'required|string|in:' . implode(',', array_keys(self::CATEGORIES)),
            'valid_from' => 'nullable|date',
            'valid_until' => 'nullable|date|after:valid_from',
            'is_active' => 'boolean',
        ]);

        // Generate slug
        $validated['slug'] = Str::slug($validated['title']);

        // Handle file upload
        $file = $request->file('file');
        $validated['filename'] = $file->getClientOriginalName();
        $validated['path'] = $file->store('documents/' . $validated['category'], 'public');
        $validated['file_type'] = $file->getClientOriginalExtension();
        $validated['file_size'] = $file->getSize();

        Document::create($validated);

        return redirect()->route('admin.documents.index')
            ->with('success', 'Document uploaded successfully.');
    }

    public function edit(Document $document)
    {
        return Inertia::render('admin/documents/edit', [
            'document' => $document,
            'categories' => self::CATEGORIES,
        ]);
    }

    public function update(Request $request, Document $document)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file' => 'nullable|file|mimes:pdf,doc,docx,xls,xlsx,ppt,pptx,jpg,jpeg,png|max:10240',
            'category' => 'required|string|in:' . implode(',', array_keys(self::CATEGORIES)),
            'valid_from' => 'nullable|date',
            'valid_until' => 'nullable|date|after:valid_from',
            'is_active' => 'boolean',
        ]);

        // Generate slug if title changed
        if ($document->title !== $validated['title']) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        // Handle file upload
        if ($request->hasFile('file')) {
            // Delete old file
            Storage::disk('public')->delete($document->path);

            $file = $request->file('file');
            $validated['filename'] = $file->getClientOriginalName();
            $validated['path'] = $file->store('documents/' . $validated['category'], 'public');
            $validated['file_type'] = $file->getClientOriginalExtension();
            $validated['file_size'] = $file->getSize();
        }

        $document->update($validated);

        return redirect()->route('admin.documents.index')
            ->with('success', 'Document updated successfully.');
    }

    public function destroy(Document $document)
    {
        // Delete file
        Storage::disk('public')->delete($document->path);

        $document->delete();

        return redirect()->route('admin.documents.index')
            ->with('success', 'Document deleted successfully.');
    }

    public function toggleActive(Document $document)
    {
        $document->update(['is_active' => !$document->is_active]);

        return back()->with('success', 'Document status updated.');
    }

    public function download(Document $document)
    {
        $document->incrementDownloads();

        return Storage::disk('public')->download($document->path, $document->filename);
    }
}
