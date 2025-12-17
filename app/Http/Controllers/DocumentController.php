<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DocumentController extends Controller
{
    /**
     * Document categories with labels
     */
    public const CATEGORIES = [
        'circular' => 'Circulars',
        'academic' => 'Academic',
        'form' => 'Forms',
        'report' => 'Reports',
        'policy' => 'Policies',
        'newsletter' => 'Newsletters',
        'other' => 'Other',
    ];

    /**
     * Display the public documents/downloads page
     */
    public function index(Request $request)
    {
        $query = Document::active()->orderBy('created_at', 'desc');

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
            $query->byCategory($request->category);
        }

        // Get documents
        $documents = $query->paginate(12)->withQueryString();

        // Get category counts for filter sidebar
        $categoryCounts = Document::active()
            ->selectRaw('category, count(*) as count')
            ->groupBy('category')
            ->pluck('count', 'category')
            ->toArray();

        // Recent circulars for sidebar
        $recentCirculars = Document::active()
            ->circulars()
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get(['id', 'title', 'slug', 'created_at', 'file_type']);

        return Inertia::render('downloads/index', [
            'documents' => $documents,
            'filters' => $request->only(['search', 'category']),
            'categories' => self::CATEGORIES,
            'categoryCounts' => $categoryCounts,
            'recentCirculars' => $recentCirculars,
        ]);
    }

    /**
     * Display documents by category
     */
    public function category(string $category)
    {
        if (!array_key_exists($category, self::CATEGORIES)) {
            abort(404);
        }

        $documents = Document::active()
            ->byCategory($category)
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        // Get category counts
        $categoryCounts = Document::active()
            ->selectRaw('category, count(*) as count')
            ->groupBy('category')
            ->pluck('count', 'category')
            ->toArray();

        return Inertia::render('downloads/index', [
            'documents' => $documents,
            'filters' => ['category' => $category],
            'categories' => self::CATEGORIES,
            'categoryCounts' => $categoryCounts,
            'currentCategory' => $category,
            'categoryTitle' => self::CATEGORIES[$category],
        ]);
    }

    /**
     * Download a document
     */
    public function download(Document $document)
    {
        // Check if document is active
        if (!$document->is_active) {
            abort(404, 'Document not found or no longer available.');
        }

        // Check if file exists
        if (!Storage::disk('public')->exists($document->path)) {
            abort(404, 'File not found.');
        }

        // Increment download count
        $document->increment('download_count');

        // Return file download
        return Storage::disk('public')->download(
            $document->path,
            $document->filename,
            [
                'Content-Type' => $this->getMimeType($document->file_type),
            ]
        );
    }

    /**
     * Get MIME type based on file extension
     */
    private function getMimeType(string $extension): string
    {
        $mimeTypes = [
            'pdf' => 'application/pdf',
            'doc' => 'application/msword',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xls' => 'application/vnd.ms-excel',
            'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'ppt' => 'application/vnd.ms-powerpoint',
            'pptx' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
        ];

        return $mimeTypes[strtolower($extension)] ?? 'application/octet-stream';
    }
}
