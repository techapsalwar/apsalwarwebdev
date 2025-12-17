<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Partnership extends Model
{
    protected $fillable = [
        'partner_name',
        'slug',
        'description',
        'logo',
        'website_url',
        'type',
        'benefits',
        'is_active',
        'order',
    ];

    protected $casts = [
        'benefits' => 'array',
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    protected $appends = ['logo_url', 'type_label', 'type_color'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($partnership) {
            if (empty($partnership->slug)) {
                $partnership->slug = Str::slug($partnership->partner_name);
            }
        });
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function scopeTechnology($query)
    {
        return $query->byType('technology');
    }

    public function scopeEducational($query)
    {
        return $query->byType('educational');
    }

    public function scopeCorporate($query)
    {
        return $query->byType('corporate');
    }

    public function scopeGovernment($query)
    {
        return $query->byType('government');
    }

    public function getLogoUrlAttribute(): ?string
    {
        if (!$this->logo) {
            return null;
        }
        
        // If it's already a full URL (external logos)
        if (str_starts_with($this->logo, 'http')) {
            return $this->logo;
        }
        
        return asset('storage/' . $this->logo);
    }

    public function getTypeLabelAttribute(): string
    {
        return match ($this->type) {
            'educational' => 'Educational Institution',
            'corporate' => 'Corporate Partner',
            'government' => 'Government Body',
            'ngo' => 'NGO / Foundation',
            'technology' => 'Technology Partner',
            'other' => 'Partner',
            default => 'Partner',
        };
    }

    public function getTypeColorAttribute(): string
    {
        return match ($this->type) {
            'educational' => 'blue',
            'corporate' => 'green',
            'government' => 'red',
            'ngo' => 'purple',
            'technology' => 'cyan',
            'other' => 'gray',
            default => 'gray',
        };
    }
}
