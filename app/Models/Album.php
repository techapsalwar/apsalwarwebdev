<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Album extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'description',
        'cover_image',
        'year',
        'month',
        'status',
        'is_featured',
        'order',
        'created_by',
    ];

    protected $casts = [
        'year' => 'integer',
        'month' => 'integer',
        'is_featured' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($album) {
            if (empty($album->slug)) {
                $album->slug = Str::slug($album->title);
            }
            if (auth()->check() && empty($album->created_by)) {
                $album->created_by = auth()->id();
            }
        });
    }

    public function photos(): HasMany
    {
        return $this->hasMany(Photo::class)->orderBy('order');
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

    public function getPhotoCountAttribute(): int
    {
        return $this->photos()->count();
    }

    public function getCoverAttribute(): ?string
    {
        if ($this->cover_image) {
            return $this->cover_image;
        }
        return $this->photos()->first()?->thumbnail_path ?? $this->photos()->first()?->path;
    }
}
