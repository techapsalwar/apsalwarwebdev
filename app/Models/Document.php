<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Document extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'description',
        'filename',
        'path',
        'file_type',
        'file_size',
        'category',
        'is_active',
        'download_count',
        'valid_from',
        'valid_until',
        'uploaded_by',
    ];

    protected $casts = [
        'file_size' => 'integer',
        'is_active' => 'boolean',
        'valid_from' => 'date',
        'valid_until' => 'date',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($document) {
            if (empty($document->slug)) {
                $document->slug = Str::slug($document->title);
            }
            if (auth()->check() && empty($document->uploaded_by)) {
                $document->uploaded_by = auth()->id();
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

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function scopeCirculars($query)
    {
        return $query->byCategory('circular');
    }

    public function scopeAcademic($query)
    {
        return $query->byCategory('academic');
    }

    public function scopeForms($query)
    {
        return $query->byCategory('form');
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function incrementDownloads(): void
    {
        $this->increment('download_count');
    }

    public function getUrlAttribute(): string
    {
        return asset('storage/' . $this->path);
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

    public function getIconAttribute(): string
    {
        return match ($this->file_type) {
            'pdf' => 'file-pdf',
            'doc', 'docx' => 'file-word',
            'xls', 'xlsx' => 'file-excel',
            'ppt', 'pptx' => 'file-powerpoint',
            'jpg', 'jpeg', 'png', 'gif' => 'file-image',
            default => 'file',
        };
    }
}
