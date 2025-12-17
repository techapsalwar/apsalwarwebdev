<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Photo extends Model
{
    protected $fillable = [
        'album_id',
        'title',
        'filename',
        'path',
        'thumbnail_path',
        'alt_text',
        'caption',
        'file_size',
        'width',
        'height',
        'order',
        'is_featured',
    ];

    protected $casts = [
        'file_size' => 'integer',
        'width' => 'integer',
        'height' => 'integer',
        'is_featured' => 'boolean',
    ];

    public function album(): BelongsTo
    {
        return $this->belongsTo(Album::class);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function getUrlAttribute(): string
    {
        return asset('storage/' . $this->path);
    }

    public function getThumbnailUrlAttribute(): string
    {
        return asset('storage/' . ($this->thumbnail_path ?? $this->path));
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
        return round($bytes, 2) . ' ' . $units[$i];
    }
}
