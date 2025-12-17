<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Achievement extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'description',
        'image',
        'category',
        'level',
        'achiever_name',
        'achiever_class',
        'achievement_date',
        'academic_year',
        'is_featured',
        'is_active',
        'order',
    ];

    protected $casts = [
        'achievement_date' => 'date',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($achievement) {
            if (empty($achievement->slug)) {
                $achievement->slug = Str::slug($achievement->title);
            }
        });
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function scopeByLevel($query, string $level)
    {
        return $query->where('level', $level);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function getLevelBadgeColorAttribute(): string
    {
        return match ($this->level) {
            'international' => 'purple',
            'national' => 'red',
            'state' => 'orange',
            'district' => 'blue',
            'school' => 'green',
            default => 'gray',
        };
    }

    public function getCategoryIconAttribute(): string
    {
        return match ($this->category) {
            'academic' => 'book',
            'sports' => 'trophy',
            'cultural' => 'music',
            'ncc' => 'shield',
            'co_curricular' => 'star',
            'faculty' => 'user',
            'school' => 'building',
            default => 'award',
        };
    }
}
