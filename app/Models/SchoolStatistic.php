<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SchoolStatistic extends Model
{
    protected $fillable = [
        'key',
        'label',
        'value',
        'icon',
        'color',
        'suffix',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('order');
    }

    public function scopeByKey($query, string $key)
    {
        return $query->where('key', $key);
    }

    public static function getValue(string $key): ?string
    {
        return static::byKey($key)->first()?->value;
    }

    public static function setValue(string $key, string $value): bool
    {
        return static::where('key', $key)->update(['value' => $value]) > 0;
    }

    public static function increment(string $key, int $amount = 1): bool
    {
        $stat = static::byKey($key)->first();
        if (!$stat) {
            return false;
        }
        
        $stat->value = (int) $stat->value + $amount;
        return $stat->save();
    }

    public function getFormattedValueAttribute(): string
    {
        $value = $this->value;
        
        // Add suffix if present
        if ($this->suffix) {
            $value .= $this->suffix;
        }
        
        return $value;
    }

    public function getDisplayDataAttribute(): array
    {
        return [
            'key' => $this->key,
            'label' => $this->label,
            'value' => $this->value,
            'formatted_value' => $this->formatted_value,
            'icon' => $this->icon,
            'color' => $this->color,
        ];
    }
}
