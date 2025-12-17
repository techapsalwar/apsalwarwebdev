<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApiTrend extends Model
{
    protected $fillable = [
        'endpoint',
        'hits',
        'date',
        'response_time_avg',
        'error_count',
    ];

    protected $casts = [
        'date' => 'date',
        'response_time_avg' => 'decimal:2',
    ];

    public function scopeByEndpoint($query, string $endpoint)
    {
        return $query->where('endpoint', $endpoint);
    }

    public function scopeToday($query)
    {
        return $query->whereDate('date', today());
    }

    public function scopeThisWeek($query)
    {
        return $query->whereBetween('date', [
            now()->startOfWeek(),
            now()->endOfWeek(),
        ]);
    }

    public function scopeThisMonth($query)
    {
        return $query->whereMonth('date', now()->month)
            ->whereYear('date', now()->year);
    }

    public function scopeRecent($query, int $days = 30)
    {
        return $query->where('date', '>=', now()->subDays($days));
    }

    public function getErrorRateAttribute(): float
    {
        if ($this->hits === 0) {
            return 0;
        }
        return round(($this->error_count / $this->hits) * 100, 2);
    }

    public static function recordHit(string $endpoint, float $responseTime = 0, bool $isError = false): void
    {
        $today = today();
        $trend = static::firstOrCreate(
            ['endpoint' => $endpoint, 'date' => $today],
            ['hits' => 0, 'response_time_avg' => 0, 'error_count' => 0]
        );

        $newHits = $trend->hits + 1;
        $newAvg = (($trend->response_time_avg * $trend->hits) + $responseTime) / $newHits;
        
        $trend->update([
            'hits' => $newHits,
            'response_time_avg' => $newAvg,
            'error_count' => $isError ? $trend->error_count + 1 : $trend->error_count,
        ]);
    }
}
