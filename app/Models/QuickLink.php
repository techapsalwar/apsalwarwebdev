<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuickLink extends Model
{
    protected $fillable = [
        'title',
        'url',
        'icon',
        'target',
        'is_active',
        'is_new',
        'order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_new' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('order');
    }
}
