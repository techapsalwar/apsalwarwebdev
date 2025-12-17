<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Slider extends Model
{
    protected $fillable = [
        'title',
        'subtitle',
        'description',
        'image',
        'button_text',
        'button_link',
        'button_text_2',
        'button_link_2',
        'text_position',
        'is_active',
        'order',
        'start_date',
        'end_date',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('start_date')
                    ->orWhere('start_date', '<=', Carbon::today());
            })
            ->where(function ($q) {
                $q->whereNull('end_date')
                    ->orWhere('end_date', '>=', Carbon::today());
            })
            ->orderBy('order');
    }
}
