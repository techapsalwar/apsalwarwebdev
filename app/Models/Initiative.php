<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Initiative extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'description',
        'content',
        'category',
        'image',
        'gallery',
        'start_date',
        'end_date',
        'status',
        'is_featured',
    ];

    protected $casts = [
        'gallery' => 'array',
        'start_date' => 'date',
        'end_date' => 'date',
        'is_featured' => 'boolean',
    ];

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeOngoing($query)
    {
        return $query->where('status', 'ongoing');
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->image ? asset('storage/' . $this->image) : null;
    }

    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            'active' => 'green',
            'ongoing' => 'blue',
            'completed' => 'gray',
            'upcoming' => 'yellow',
            default => 'gray',
        };
    }

    public function getCategoryLabelAttribute(): string
    {
        return match ($this->category) {
            'academic' => 'Academic Excellence',
            'social' => 'Social Responsibility',
            'environmental' => 'Environment & Sustainability',
            'health' => 'Health & Wellness',
            'cultural' => 'Cultural Heritage',
            'technology' => 'Technology & Innovation',
            default => 'General',
        };
    }
}
