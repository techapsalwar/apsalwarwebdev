<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class News extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'featured_image',
        'meta_title',
        'meta_description',
        'status',
        'is_featured',
        'published_at',
        'views',
        'author_id',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'published_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($news) {
            if (empty($news->slug)) {
                $news->slug = Str::slug($news->title);
            }
            if (auth()->check() && empty($news->author_id)) {
                $news->author_id = auth()->id();
            }
        });
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeRecent($query, int $limit = 5)
    {
        return $query->published()
            ->orderBy('published_at', 'desc')
            ->limit($limit);
    }

    public function incrementViews(): void
    {
        $this->increment('views');
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function getExcerptAttribute($value): ?string
    {
        if ($value) {
            return $value;
        }
        return Str::limit(strip_tags($this->content), 150);
    }
}
