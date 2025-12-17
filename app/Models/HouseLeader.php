<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HouseLeader extends Model
{
    protected $fillable = [
        'house_id',
        'student_name',
        'class',
        'photo',
        'position',
        'academic_year',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function house(): BelongsTo
    {
        return $this->belongsTo(House::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByYear($query, int $year)
    {
        return $query->where('academic_year', $year);
    }

    public function scopeCaptains($query)
    {
        return $query->where('position', 'captain');
    }

    public function scopeViceCaptains($query)
    {
        return $query->where('position', 'vice_captain');
    }

    public function scopePrefects($query)
    {
        return $query->where('position', 'prefect');
    }

    public function getPhotoUrlAttribute(): ?string
    {
        return $this->photo ? asset('storage/' . $this->photo) : null;
    }

    public function getPositionLabelAttribute(): string
    {
        return match ($this->position) {
            'captain' => 'House Captain',
            'vice_captain' => 'Vice Captain',
            'prefect' => 'Prefect',
            default => $this->position,
        };
    }
}
