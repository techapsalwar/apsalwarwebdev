<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompetitiveExam extends Model
{
    protected $fillable = [
        'student_name',
        'class',
        'exam_name',
        'exam_type',
        'rank',
        'score',
        'percentile',
        'year',
        'photo',
        'is_featured',
    ];

    protected $casts = [
        'percentile' => 'decimal:2',
        'is_featured' => 'boolean',
    ];

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeByExam($query, string $examName)
    {
        return $query->where('exam_name', $examName);
    }

    public function scopeByExamType($query, string $type)
    {
        return $query->where('exam_type', $type);
    }

    public function scopeByYear($query, int $year)
    {
        return $query->where('year', $year);
    }

    public function scopeTopRanks($query, int $limit = 100)
    {
        return $query->where('rank', '<=', $limit);
    }

    public function getPhotoUrlAttribute(): ?string
    {
        return $this->photo ? asset('storage/' . $this->photo) : null;
    }

    public function getExamTypeLabelAttribute(): string
    {
        return match ($this->exam_type) {
            'olympiad' => 'Olympiad',
            'scholarship' => 'Scholarship Exam',
            'engineering' => 'Engineering Entrance',
            'medical' => 'Medical Entrance',
            'defence' => 'Defence Services',
            'government' => 'Government Exam',
            default => 'Competitive Exam',
        };
    }

    public function getRankLabelAttribute(): string
    {
        if (!$this->rank) {
            return 'Qualified';
        }
        
        $suffix = match ($this->rank % 10) {
            1 => 'st',
            2 => 'nd',
            3 => 'rd',
            default => 'th',
        };
        
        if (in_array($this->rank % 100, [11, 12, 13])) {
            $suffix = 'th';
        }
        
        return $this->rank . $suffix . ' Rank';
    }
}
