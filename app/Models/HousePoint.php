<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HousePoint extends Model
{
    protected $fillable = [
        'house_id',
        'academic_year',
        'event_name',
        'category',
        'points',
        'remarks',
        'event_date',
        'awarded_by',
    ];

    protected $casts = [
        'event_date' => 'date',
    ];

    public function house(): BelongsTo
    {
        return $this->belongsTo(House::class);
    }

    public function awardedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'awarded_by');
    }

    public function scopeByYear($query, int $year)
    {
        return $query->where('academic_year', $year);
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function getCategoryColorAttribute(): string
    {
        return match ($this->category) {
            'sports' => 'green',
            'academics' => 'blue',
            'cultural' => 'purple',
            'discipline' => 'orange',
            default => 'gray',
        };
    }
}
