<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Facility extends Model
{
    /**
     * Category constants for centralized definitions.
     */
    public const CATEGORIES = [
        'lab' => ['label' => 'Laboratory', 'icon' => 'flask-conical'],
        'classroom' => ['label' => 'Classroom', 'icon' => 'monitor'],
        'sports' => ['label' => 'Sports', 'icon' => 'dumbbell'],
        'library' => ['label' => 'Library', 'icon' => 'book-open'],
        'auditorium' => ['label' => 'Auditorium', 'icon' => 'presentation'],
        'playground' => ['label' => 'Playground', 'icon' => 'trees'],
        'special_room' => ['label' => 'Special Room', 'icon' => 'door-open'],
        'other' => ['label' => 'Other', 'icon' => 'building-2'],
    ];

    protected $fillable = [
        'name',
        'slug',
        'description',
        'image',
        'gallery',
        'category',
        'features',
        'location',
        'capacity',
        'equipment',
        'has_virtual_tour',
        'virtual_tour_url',
        'is_active',
        'order',
    ];

    protected $casts = [
        'gallery' => 'array',
        'features' => 'array',
        'equipment' => 'array',
        'has_virtual_tour' => 'boolean',
        'is_active' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($facility) {
            if (empty($facility->slug)) {
                $facility->slug = Str::slug($facility->name);
            }
        });
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('order');
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function scopeLabs($query)
    {
        return $query->byCategory('lab');
    }

    public function scopeSports($query)
    {
        return $query->byCategory('sports');
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->image ? asset('storage/' . $this->image) : null;
    }

    public function getCategoryIconAttribute(): string
    {
        return self::CATEGORIES[$this->category]['icon'] ?? 'building-2';
    }

    /**
     * Get category label.
     */
    public function getCategoryLabelAttribute(): string
    {
        return self::CATEGORIES[$this->category]['label'] ?? 'Other';
    }

    /**
     * Get all categories as array for dropdowns.
     */
    public static function getCategoryOptions(): array
    {
        return collect(self::CATEGORIES)->map(function ($data, $value) {
            return [
                'value' => $value,
                'label' => $data['label'],
                'icon' => $data['icon'],
            ];
        })->values()->toArray();
    }

    /**
     * Get categories with counts for public listing.
     */
    public static function getCategoriesWithCounts(): array
    {
        $counts = self::where('is_active', true)
            ->selectRaw('category, count(*) as count')
            ->groupBy('category')
            ->pluck('count', 'category')
            ->toArray();

        $total = array_sum($counts);

        $categories = [
            ['value' => 'all', 'label' => 'All Facilities', 'count' => $total],
        ];

        foreach (self::CATEGORIES as $value => $data) {
            $count = $counts[$value] ?? 0;
            if ($count > 0) {
                $categories[] = [
                    'value' => $value,
                    'label' => $data['label'],
                    'icon' => $data['icon'],
                    'count' => $count,
                ];
            }
        }

        return $categories;
    }

    /**
     * Convert facility to array for API/Inertia responses.
     */
    public function toPublicArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'category' => $this->category,
            'category_label' => $this->category_label,
            'image' => $this->image,
            'gallery' => $this->gallery ?? [],
            'features' => $this->features ?? [],
            'location' => $this->location,
            'capacity' => $this->capacity,
            'equipment' => $this->equipment ?? [],
            'has_virtual_tour' => $this->has_virtual_tour,
            'virtual_tour_url' => $this->virtual_tour_url,
        ];
    }
}
