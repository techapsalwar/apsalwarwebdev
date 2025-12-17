<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $fillable = [
        'name',
        'content',
        'photo',
        'type',
        'designation',
        'rating',
        'is_featured',
        'is_active',
        'order',
    ];

    protected $casts = [
        'rating' => 'integer',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function getPhotoUrlAttribute(): ?string
    {
        return $this->photo ? asset('storage/' . $this->photo) : null;
    }

    public function getTypeColorAttribute(): string
    {
        return match ($this->type) {
            'student' => 'blue',
            'parent' => 'green',
            'alumni' => 'purple',
            default => 'gray',
        };
    }
}
