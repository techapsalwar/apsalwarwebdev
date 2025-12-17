<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Video extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'description',
        'youtube_url',
        'youtube_id',
        'thumbnail',
        'status',
        'is_featured',
        'order',
        'created_by',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($video) {
            if (empty($video->slug)) {
                $video->slug = Str::slug($video->title);
            }
            if (empty($video->youtube_id) && $video->youtube_url) {
                $video->youtube_id = static::extractYouTubeId($video->youtube_url);
            }
            if (auth()->check() && empty($video->created_by)) {
                $video->created_by = auth()->id();
            }
        });

        static::updating(function ($video) {
            if ($video->isDirty('youtube_url')) {
                $video->youtube_id = static::extractYouTubeId($video->youtube_url);
            }
        });
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public static function extractYouTubeId(string $url): ?string
    {
        $pattern = '/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/';
        preg_match($pattern, $url, $matches);
        return $matches[1] ?? null;
    }

    public function getThumbnailUrlAttribute(): string
    {
        if ($this->thumbnail) {
            return asset('storage/' . $this->thumbnail);
        }
        return "https://img.youtube.com/vi/{$this->youtube_id}/maxresdefault.jpg";
    }

    public function getEmbedUrlAttribute(): string
    {
        return "https://www.youtube.com/embed/{$this->youtube_id}";
    }
}
