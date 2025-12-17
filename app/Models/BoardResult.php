<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BoardResult extends Model
{
    protected $fillable = [
        'academic_year',
        'board',
        'class',
        'stream',
        'appeared',
        'passed',
        'pass_percentage',
        'school_average',
        'highest_marks',
        'above_90_percent',
        'above_80_percent',
        'above_70_percent',
        'above_60_percent',
        'api_score',
        'subject_wise_results',
        'toppers',
        'class_x_toppers',
        'science_toppers',
        'commerce_toppers',
        'humanities_toppers',
        'overall_topper_name',
        'overall_topper_percentage',
        'overall_topper_photo',
        'overall_topper_stream',
        'is_published',
    ];

    protected $casts = [
        'subject_wise_results' => 'array',
        'toppers' => 'array',
        'class_x_toppers' => 'array',
        'science_toppers' => 'array',
        'commerce_toppers' => 'array',
        'humanities_toppers' => 'array',
        'pass_percentage' => 'decimal:2',
        'school_average' => 'decimal:2',
        'highest_marks' => 'decimal:2',
        'api_score' => 'decimal:2',
        'overall_topper_percentage' => 'decimal:2',
        'is_published' => 'boolean',
    ];

    protected $appends = ['overall_topper_photo_url'];

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeByYear($query, int $year)
    {
        return $query->where('academic_year', $year);
    }

    public function scopeByClass($query, string $class)
    {
        return $query->where('class', $class);
    }

    public function scopeClass10($query)
    {
        return $query->byClass('X');
    }

    public function scopeClass12($query)
    {
        return $query->byClass('XII');
    }

    public function scopeRecent($query)
    {
        return $query->orderByDesc('academic_year');
    }

    public function getOverallTopperPhotoUrlAttribute(): ?string
    {
        return $this->overall_topper_photo 
            ? asset('storage/' . $this->overall_topper_photo) 
            : null;
    }

    public function getCalculatedPassPercentageAttribute(): float
    {
        if ($this->appeared === 0) {
            return 0;
        }
        return round(($this->passed / $this->appeared) * 100, 2);
    }

    public function getDistinctionPercentageAttribute(): float
    {
        if ($this->appeared === 0) {
            return 0;
        }
        return round(($this->above_90_percent / $this->appeared) * 100, 2);
    }

    public function getResultSummaryAttribute(): string
    {
        return sprintf(
            '%s Pass Rate | %.2f%% School Average | %s Students with Distinction',
            $this->pass_percentage . '%',
            $this->school_average ?? 0,
            $this->above_90_percent ?? 0
        );
    }

    /**
     * Get formatted toppers for a specific stream
     */
    public function getFormattedToppers(string $stream = null): array
    {
        if ($this->class === 'X') {
            return $this->formatTopperArray($this->class_x_toppers ?? []);
        }

        return match ($stream) {
            'Science' => $this->formatTopperArray($this->science_toppers ?? []),
            'Commerce' => $this->formatTopperArray($this->commerce_toppers ?? []),
            'Humanities' => $this->formatTopperArray($this->humanities_toppers ?? []),
            default => [],
        };
    }

    /**
     * Format topper array with photo URLs
     */
    protected function formatTopperArray(array $toppers): array
    {
        return array_map(function ($topper) {
            if (isset($topper['photo']) && $topper['photo']) {
                $topper['photo_url'] = asset('storage/' . $topper['photo']);
            } else {
                $topper['photo_url'] = null;
            }
            return $topper;
        }, $toppers);
    }
}
