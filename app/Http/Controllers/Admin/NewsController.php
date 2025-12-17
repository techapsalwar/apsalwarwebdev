<?php

namespace App\Http\Controllers\Admin;

use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class NewsController extends AdminResourceController
{
    protected string $model = News::class;
    protected string $pagePrefix = 'admin/news';
    protected string $resourceName = 'News';
    protected array $searchFields = ['title', 'excerpt', 'content'];

    /**
     * Display a listing of news articles.
     */
    public function index(Request $request): Response
    {
        $query = News::query();

        // Apply search filter
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            });
        }

        // Apply status filter
        if ($status = $request->get('status')) {
            if ($status !== 'all') {
                $query->where('status', $status);
            }
        }

        // Apply sorting
        $sortField = $request->get('sort', 'published_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        // Paginate results
        $items = $query->paginate($request->get('per_page', 15))
            ->withQueryString();

        return Inertia::render('admin/news/index', [
            'items' => $items,
            'filters' => $request->only(['search', 'sort', 'direction', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new news article.
     */
    public function create(): Response
    {
        return Inertia::render('admin/news/create', [
            'categories' => $this->getCategories(),
        ]);
    }

    /**
     * Store a newly created news article in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:news,slug',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'required|string',
            'featured_image' => 'nullable|image|max:2048',
            'status' => 'required|in:draft,published,archived',
            'is_featured' => 'boolean',
            'published_at' => 'nullable|date',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
        ]);

        // Generate slug if not provided
        $validated['slug'] = $validated['slug'] ?? $this->generateSlug($validated['title']);

        // Handle featured image upload
        if ($request->hasFile('featured_image')) {
            $validated['featured_image'] = $request->file('featured_image')
                ->store('news', 'public');
        }

        // Set published_at if publishing
        if ($validated['status'] === 'published' && !$validated['published_at']) {
            $validated['published_at'] = now();
        }

        $news = News::create($validated);
        
        $this->logAudit('created', $news);

        return redirect()
            ->route('admin.news.index')
            ->with('success', 'News article created successfully.');
    }

    /**
     * Display the specified news article.
     */
    public function show(int $id): Response
    {
        $item = News::findOrFail($id);

        return Inertia::render('admin/news/show', [
            'item' => $item,
        ]);
    }

    /**
     * Show the form for editing the specified news article.
     */
    public function edit(int $id): Response
    {
        $item = News::findOrFail($id);

        return Inertia::render('admin/news/edit', [
            'item' => $item,
            'categories' => $this->getCategories(),
        ]);
    }

    /**
     * Update the specified news article in storage.
     */
    public function update(Request $request, int $id)
    {
        $news = News::findOrFail($id);
        $oldData = $news->toArray();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:news,slug,' . $id,
            'excerpt' => 'nullable|string|max:500',
            'content' => 'required|string',
            'featured_image' => 'nullable|image|max:2048',
            'status' => 'required|in:draft,published,archived',
            'is_featured' => 'boolean',
            'published_at' => 'nullable|date',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
        ]);

        // Generate slug if title changed and no slug provided
        if ($validated['title'] !== $news->title && empty($validated['slug'])) {
            $validated['slug'] = $this->generateSlug($validated['title'], $id);
        } else if (!isset($validated['slug'])) {
            // Keep existing slug if not provided in request
            unset($validated['slug']);
        }

        // Handle featured image upload
        if ($request->hasFile('featured_image')) {
            // Delete old image
            if ($news->featured_image) {
                Storage::disk('public')->delete($news->featured_image);
            }
            $validated['featured_image'] = $request->file('featured_image')
                ->store('news', 'public');
        }

        // Set published_at if publishing for the first time
        if ($validated['status'] === 'published' && !$news->published_at && !$validated['published_at']) {
            $validated['published_at'] = now();
        }

        $news->update($validated);

        $this->logAudit('updated', $news, $oldData);

        return redirect()
            ->route('admin.news.index')
            ->with('success', 'News article updated successfully.');
    }

    /**
     * Remove the specified news article from storage.
     */
    public function destroy(int $id)
    {
        $news = News::findOrFail($id);

        // Delete featured image
        if ($news->featured_image) {
            Storage::disk('public')->delete($news->featured_image);
        }

        $this->logAudit('deleted', $news);
        
        $news->delete();

        return redirect()
            ->route('admin.news.index')
            ->with('success', 'News article deleted successfully.');
    }

    /**
     * Get available categories.
     */
    private function getCategories(): array
    {
        return [
            'general' => 'General',
            'academics' => 'Academics',
            'sports' => 'Sports',
            'achievements' => 'Achievements',
            'events' => 'Events',
            'announcements' => 'Announcements',
        ];
    }
}
