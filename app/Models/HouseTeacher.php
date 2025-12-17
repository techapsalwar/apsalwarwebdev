<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HouseTeacher extends Model
{
    protected $fillable = [
        'house_id',
        'name',
        'designation',
        'subject',
        'order',
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
}
