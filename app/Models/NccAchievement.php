<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NccAchievement extends Model
{
    protected $fillable = [
        'cadet_id',
        'cadet_name',
        'title',
        'description',
        'type',
        'level',
        'image',
        'achievement_date',
        'academic_year',
        'is_featured',
    ];

    protected $casts = [
        'achievement_date' => 'date',
        'is_featured' => 'boolean',
    ];

    public function cadet(): BelongsTo
    {
        return $this->belongsTo(NccCadet::class, 'cadet_id');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function scopeByLevel($query, string $level)
    {
        return $query->where('level', $level);
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->image ? asset('storage/' . $this->image) : null;
    }

    public function getTypeLabelAttribute(): string
    {
        return match ($this->type) {
            'camp' => 'Camp Participation',
            'medal' => 'Medal/Award',
            'promotion' => 'Rank Promotion',
            'certification' => 'Certification',
            default => 'Other',
        };
    }

    public function getLevelColorAttribute(): string
    {
        return match ($this->level) {
            'international' => 'purple',
            'national' => 'red',
            'state' => 'orange',
            'district' => 'blue',
            'unit' => 'green',
            default => 'gray',
        };
    }
}
