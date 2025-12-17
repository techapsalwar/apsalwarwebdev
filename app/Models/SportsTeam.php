<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SportsTeam extends Model
{
    protected $fillable = [
        'sport_name',
        'slug',
        'description',
        'icon',
        'image',
        'coach_name',
        'category',
        'is_active',
        'order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function members(): HasMany
    {
        return $this->hasMany(SportsTeamMember::class, 'team_id');
    }

    public function achievements(): HasMany
    {
        return $this->hasMany(SportsAchievement::class, 'team_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('order');
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function scopeOutdoor($query)
    {
        return $query->byCategory('outdoor');
    }

    public function scopeIndoor($query)
    {
        return $query->byCategory('indoor');
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->image ? asset('storage/' . $this->image) : null;
    }

    public function getMemberCountAttribute(): int
    {
        return $this->members()
            ->where('academic_year', date('Y'))
            ->where('is_active', true)
            ->count();
    }
}
