<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class FeeType extends Model
{
    protected $fillable = [
        'name',
        'key',
        'type',
        'description',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * Boot function to auto-generate key from name
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($feeType) {
            if (empty($feeType->key)) {
                $feeType->key = Str::snake($feeType->name);
            }
        });
    }

    /**
     * Scope for active fee types
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for one-time fees
     */
    public function scopeOneTime($query)
    {
        return $query->where('type', 'one_time');
    }

    /**
     * Scope for recurring fees
     */
    public function scopeRecurring($query)
    {
        return $query->where('type', 'recurring');
    }

    /**
     * Get ordered fee types
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }
}
