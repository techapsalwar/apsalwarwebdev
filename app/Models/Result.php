<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Result extends Model
{
    protected $fillable = [
        'academic_year',
        'exam',
        'total_students',
        'passed_students',
        'pass_percentage',
        'highest_percentage',
        'topper_name',
        'topper_photo',
        'subject_toppers',
        'percentage_distribution',
        'is_published',
    ];

    protected $casts = [
        'pass_percentage' => 'decimal:2',
        'highest_percentage' => 'decimal:2',
        'subject_toppers' => 'array',
        'percentage_distribution' => 'array',
        'is_published' => 'boolean',
    ];

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeClass10($query)
    {
        return $query->where('exam', 'class_10');
    }

    public function scopeClass12($query)
    {
        return $query->where('exam', 'class_12');
    }

    public function scopeByYear($query, int $year)
    {
        return $query->where('academic_year', $year);
    }

    public function getExamLabelAttribute(): string
    {
        return match ($this->exam) {
            'class_10' => 'Class X',
            'class_12' => 'Class XII',
            default => $this->exam,
        };
    }

    public function getTopperPhotoUrlAttribute(): ?string
    {
        return $this->topper_photo ? asset('storage/' . $this->topper_photo) : null;
    }
}
