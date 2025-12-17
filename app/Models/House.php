<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class House extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'color',
        'motto',
        'icon',
        'logo',
        'image',
        'description',
        'house_master',
        'house_master_designation',
        'house_master_photo',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function points(): HasMany
    {
        return $this->hasMany(HousePoint::class);
    }

    public function leaders(): HasMany
    {
        return $this->hasMany(HouseLeader::class);
    }

    public function teachers(): HasMany
    {
        return $this->hasMany(HouseTeacher::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('order');
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function getTotalPointsAttribute(): int
    {
        return $this->points()
            ->where('academic_year', date('Y'))
            ->sum('points');
    }

    public function getPointsByYear(int $year): int
    {
        return $this->points()
            ->where('academic_year', $year)
            ->sum('points');
    }

    public function getCurrentLeadersAttribute()
    {
        return $this->leaders()
            ->where('academic_year', date('Y'))
            ->where('is_active', true)
            ->get();
    }
}
