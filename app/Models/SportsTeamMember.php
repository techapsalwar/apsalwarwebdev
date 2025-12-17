<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SportsTeamMember extends Model
{
    protected $fillable = [
        'team_id',
        'student_name',
        'class',
        'photo',
        'position',
        'academic_year',
        'is_captain',
        'is_active',
    ];

    protected $casts = [
        'is_captain' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function team(): BelongsTo
    {
        return $this->belongsTo(SportsTeam::class, 'team_id');
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
        return $query->where('is_captain', true);
    }

    public function getPhotoUrlAttribute(): ?string
    {
        return $this->photo ? asset('storage/' . $this->photo) : null;
    }
}
