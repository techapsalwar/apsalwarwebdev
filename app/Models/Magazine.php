<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Magazine extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'description',
        'cover_image',
        'pdf_path',
        'issue_date',
        'issue_number',
        'is_featured',
        'is_active',
        'page_count',
        'file_size',
        'view_count',
        'uploaded_by',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'issue_date' => 'date',
        'file_size' => 'integer',
        'view_count' => 'integer',
        'page_count' => 'integer',
    ];

    protected $appends = ['pdf_url', 'cover_url'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($magazine) {
            if (empty($magazine->slug)) {
                $magazine->slug = Str::slug($magazine->title);
            }
            if (auth()->check() && empty($magazine->uploaded_by)) {
                $magazine->uploaded_by = auth()->id();
            }
        });
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function getPdfUrlAttribute(): string
    {
        return asset('storage/' . $this->pdf_path);
    }

    public function getCoverUrlAttribute(): ?string
    {
        if (!$this->cover_image) {
            return null;
        }

        return asset('storage/' . $this->cover_image);
    }

    public function getFileSizeHumanAttribute(): string
    {
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];
        $i = 0;
        while ($bytes >= 1024 && $i < count($units) - 1) {
            $bytes /= 1024;
            $i++;
        }

        return round($bytes, 1) . ' ' . $units[$i];
    }

    public function incrementViews(): void
    {
        $this->increment('view_count');
    }
}
