<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class NccCadet extends Model
{
    protected $fillable = [
        'name',
        'class',
        'enrollment_number',
        'rank',
        'photo',
        'enrollment_date',
        'academic_year',
        'is_active',
    ];

    protected $casts = [
        'enrollment_date' => 'date',
        'is_active' => 'boolean',
    ];

    public function achievements(): HasMany
    {
        return $this->hasMany(NccAchievement::class, 'cadet_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByYear($query, int $year)
    {
        return $query->where('academic_year', $year);
    }

    public function scopeByRank($query, string $rank)
    {
        return $query->where('rank', $rank);
    }

    public function getPhotoUrlAttribute(): ?string
    {
        return $this->photo ? asset('storage/' . $this->photo) : null;
    }

    public function getRankLabelAttribute(): string
    {
        return match ($this->rank) {
            'cadet' => 'Cadet',
            'lance_corporal' => 'Lance Corporal',
            'corporal' => 'Corporal',
            'sergeant' => 'Sergeant',
            'under_officer' => 'Under Officer',
            'senior_under_officer' => 'Senior Under Officer',
            'cadet_sergeant_major' => 'Cadet Sergeant Major',
            default => $this->rank,
        };
    }
}
