<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SportsAchievement extends Model
{
    protected $fillable = [
        'team_id',
        'sport_name',
        'title',
        'description',
        'level',
        'position',
        'player_name',
        'player_class',
        'image',
        'achievement_date',
        'academic_year',
        'is_featured',
    ];

    protected $casts = [
        'achievement_date' => 'date',
        'is_featured' => 'boolean',
    ];

    public function team(): BelongsTo
    {
        return $this->belongsTo(SportsTeam::class, 'team_id');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeByLevel($query, string $level)
    {
        return $query->where('level', $level);
    }

    public function scopeNational($query)
    {
        return $query->byLevel('national');
    }

    public function scopeState($query)
    {
        return $query->byLevel('state');
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->image ? asset('storage/' . $this->image) : null;
    }

    public function getLevelColorAttribute(): string
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

    public function getPositionLabelAttribute(): string
    {
        return match ($this->position) {
            'gold' => '🥇 Gold Medal',
            'silver' => '🥈 Silver Medal',
            'bronze' => '🥉 Bronze Medal',
            'winner' => '🏆 Winner',
            'runner_up' => '🥈 Runner Up',
            'participant' => 'Participant',
            default => $this->position,
        };
    }
}
