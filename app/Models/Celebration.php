<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Celebration extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'description',
        'content',
        'type',
        'celebration_date',
        'image',
        'gallery',
        'academic_year',
        'is_featured',
    ];

    protected $casts = [
        'gallery' => 'array',
        'celebration_date' => 'date',
        'is_featured' => 'boolean',
    ];

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function scopeByYear($query, int $year)
    {
        return $query->where('academic_year', $year);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('celebration_date', '>=', now())
            ->orderBy('celebration_date');
    }

    public function scopeRecent($query)
    {
        return $query->where('celebration_date', '<', now())
            ->orderByDesc('celebration_date');
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
            'national' => 'National Day',
            'religious' => 'Religious Festival',
            'cultural' => 'Cultural Event',
            'school' => 'School Event',
            'sports' => 'Sports Day',
            'annual' => 'Annual Function',
            default => 'Event',
        };
    }

    public function getTypeColorAttribute(): string
    {
        return match ($this->type) {
            'national' => 'orange',
            'religious' => 'purple',
            'cultural' => 'pink',
            'school' => 'blue',
            'sports' => 'green',
            'annual' => 'red',
            default => 'gray',
        };
    }
}
