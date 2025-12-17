<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'icon',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function staff(): HasMany
    {
        return $this->hasMany(Staff::class)->orderBy('order');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('order');
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function getStaffCountAttribute(): int
    {
        return $this->staff()->where('is_active', true)->count();
    }
}
