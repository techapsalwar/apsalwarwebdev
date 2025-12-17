<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NewsController extends Controller
{
    /**
     * Display a listing of published news articles.
     */
    public function index(Request $request): Response
    {
        $query = News::published()->orderBy('published_at', 'desc');

        // Apply search filter
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            });
        }

        // Paginate results
        $news = $query->paginate(12)->withQueryString();

        // Transform the data
        $news->getCollection()->transform(function ($item) {
            return [
                'id' => $item->id,
                'title' => $item->title,
                'slug' => $item->slug,
                'excerpt' => $item->excerpt,
                'featured_image' => $item->featured_image 
                    ? (str_starts_with($item->featured_image, 'http') 
                        ? $item->featured_image 
                        : '/storage/' . $item->featured_image)
                    : null,
                'published_at' => $item->published_at?->format('d M Y'),
                'is_featured' => $item->is_featured,
            ];
        });

        return Inertia::render('news/index', [
            'news' => $news,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Display the specified news article.
     */
    public function show(string $slug): Response
    {
        $news = News::where('slug', $slug)
            ->published()
            ->firstOrFail();

        // Increment views
        $news->incrementViews();

        // Get related news (same category or recent)
        $relatedNews = News::published()
            ->where('id', '!=', $news->id)
            ->orderBy('published_at', 'desc')
            ->limit(3)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'slug' => $item->slug,
                    'excerpt' => $item->excerpt,
                    'featured_image' => $item->featured_image 
                        ? (str_starts_with($item->featured_image, 'http') 
                            ? $item->featured_image 
                            : '/storage/' . $item->featured_image)
                        : null,
                    'published_at' => $item->published_at?->format('d M Y'),
                ];
            });

        return Inertia::render('news/show', [
            'news' => [
                'id' => $news->id,
                'title' => $news->title,
                'slug' => $news->slug,
                'excerpt' => $news->excerpt,
                'content' => $news->content,
                'featured_image' => $news->featured_image 
                    ? (str_starts_with($news->featured_image, 'http') 
                        ? $news->featured_image 
                        : '/storage/' . $news->featured_image)
                    : null,
                'published_at' => $news->published_at?->format('d M Y'),
                'meta_title' => $news->meta_title ?? $news->title,
                'meta_description' => $news->meta_description ?? $news->excerpt,
                'views' => $news->views,
                'author' => $news->author ? [
                    'name' => $news->author->name,
                ] : null,
            ],
            'relatedNews' => $relatedNews,
        ]);
    }
}
