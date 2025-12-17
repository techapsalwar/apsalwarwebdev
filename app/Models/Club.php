<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Club extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'category',
        'description',
        'image',
        'icon',
        'in_charge',
        'meeting_schedule',
        'is_active',
        'accepts_enrollment',
        'order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'accepts_enrollment' => 'boolean',
    ];

    public function members(): HasMany
    {
        return $this->hasMany(ClubMember::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('order');
    }

    public function scopeAcceptingEnrollment($query)
    {
        return $query->where('accepts_enrollment', true);
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function scopeAcademicInterest($query)
    {
        return $query->where('category', 'academic_interest');
    }

    public function scopeCreativePhysical($query)
    {
        return $query->where('category', 'creative_physical');
    }

    public function getCategoryLabelAttribute(): string
    {
        return match($this->category) {
            'academic_interest' => 'Academic & Interest Clubs',
            'creative_physical' => 'Creative & Physical Clubs',
            default => 'Other Clubs',
        };
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function getMemberCountAttribute(): int
    {
        return $this->members()
            ->where('academic_year', date('Y'))
            ->where('status', 'approved')
            ->count();
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->image ? asset('storage/' . $this->image) : null;
    }
}
