<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class Affirmation extends Model
{
    protected $fillable = [
        'quote',
        'author',
        'display_date',
        'is_active',
    ];

    protected $casts = [
        'display_date' => 'date',
        'is_active' => 'boolean',
    ];

    /**
     * Get the effective date based on the thought change time setting.
     * 
     * Example: If change time is 06:00 (6 AM):
     * - At 5:59 AM on Dec 10 → effective date is Dec 9 (show yesterday's thought)
     * - At 6:00 AM on Dec 10 → effective date is Dec 10 (show today's thought)
     */
    public static function getEffectiveDate(): Carbon
    {
        $changeTime = DB::table('settings')
            ->where('key', 'thought_change_time')
            ->value('value') ?? '00:00';

        $now = Carbon::now();
        $changeDateTime = Carbon::today()->setTimeFromTimeString($changeTime);

        // If current time is before the change time, use yesterday's date
        // This means the previous day's thought continues to show until change time
        if ($now->lt($changeDateTime)) {
            return Carbon::yesterday();
        }

        return Carbon::today();
    }

    /**
     * Get today's thought of the day based on effective date
     */
    public static function today(): ?self
    {
        $effectiveDate = self::getEffectiveDate();
        
        return static::where('display_date', $effectiveDate)
            ->where('is_active', true)
            ->first();
    }

    /**
     * Get the current thought - exact match for effective date, 
     * or fallback to the most recent one if no exact match.
     */
    public static function current(): ?self
    {
        // First try to get exact match for effective date
        $exactMatch = static::today();
        if ($exactMatch) {
            return $exactMatch;
        }

        // Fallback: get the most recent affirmation up to effective date
        $effectiveDate = self::getEffectiveDate();
        
        return static::where('is_active', true)
            ->where('display_date', '<=', $effectiveDate)
            ->orderBy('display_date', 'desc')
            ->first();
    }

    /**
     * Get the latest active affirmation (alias for current())
     * @deprecated Use current() instead for clarity
     */
    public static function latest(): ?self
    {
        return static::current();
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeForDate($query, Carbon $date)
    {
        return $query->where('display_date', $date);
    }
}
