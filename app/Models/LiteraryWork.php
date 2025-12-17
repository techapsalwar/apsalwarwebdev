<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LiteraryWork extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'author_name',
        'author_class',
        'type',
        'content',
        'image',
        'language',
        'academic_year',
        'is_published',
        'is_featured',
        'published_at',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
        'published_at' => 'datetime',
    ];

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function scopeByLanguage($query, string $language)
    {
        return $query->where('language', $language);
    }

    public function scopeByYear($query, int $year)
    {
        return $query->where('academic_year', $year);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->image ? asset('storage/' . $this->image) : null;
    }

    public function getTypeLabelAttribute(): string
    {
        return match ($this->type) {
            'poem' => 'Poem',
            'story' => 'Short Story',
            'essay' => 'Essay',
            'article' => 'Article',
            'speech' => 'Speech',
            'painting' => 'Painting/Art',
            default => 'Literary Work',
        };
    }

    public function getTypeIconAttribute(): string
    {
        return match ($this->type) {
            'poem' => '📝',
            'story' => '📖',
            'essay' => '✍️',
            'article' => '📰',
            'speech' => '🎤',
            'painting' => '🎨',
            default => '📄',
        };
    }
}
