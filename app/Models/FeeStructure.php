<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeeStructure extends Model
{
    protected $fillable = [
        'academic_year',
        'category',
        'class_range',
        'admission_fee',
        'registration_fee',
        'security_deposit',
        'annual_fee',
        'tuition_fee',
        'computer_fee',
        'science_fee',
        'other_fees',
        'notes',
        'is_active',
    ];

    protected $casts = [
        'academic_year' => 'integer',
        'admission_fee' => 'decimal:2',
        'registration_fee' => 'decimal:2',
        'security_deposit' => 'decimal:2',
        'annual_fee' => 'decimal:2',
        'tuition_fee' => 'decimal:2',
        'computer_fee' => 'decimal:2',
        'science_fee' => 'decimal:2',
        'other_fees' => 'array',
        'is_active' => 'boolean',
    ];

    // Category constants
    public const CATEGORIES = [
        'officers' => 'Officers',
        'jco' => 'JCOs',
        'or' => 'OR (Other Ranks)',
        'civilian' => 'Civilians',
    ];

    // Class range constants
    public const CLASS_RANGES = [
        'nursery_ukg' => 'Nursery to UKG',
        'i_v' => 'Class I to V',
        'vi_viii' => 'Class VI to VIII',
        'ix_x' => 'Class IX to X',
        'xi_xii' => 'Class XI to XII',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByYear($query, int $year)
    {
        return $query->where('academic_year', $year);
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function scopeByClassRange($query, string $classRange)
    {
        return $query->where('class_range', $classRange);
    }

    public function getCategoryLabelAttribute(): string
    {
        return self::CATEGORIES[$this->category] ?? $this->category;
    }

    public function getClassRangeLabelAttribute(): string
    {
        return self::CLASS_RANGES[$this->class_range] ?? $this->class_range;
    }

    public function getFormattedAdmissionFeeAttribute(): string
    {
        return '₹' . number_format($this->admission_fee, 0);
    }

    public function getFormattedRegistrationFeeAttribute(): string
    {
        return '₹' . number_format($this->registration_fee, 0);
    }

    public function getFormattedSecurityDepositAttribute(): string
    {
        return '₹' . number_format($this->security_deposit, 0);
    }

    public function getFormattedAnnualFeeAttribute(): string
    {
        return '₹' . number_format($this->annual_fee, 0);
    }

    public function getFormattedTuitionFeeAttribute(): string
    {
        return '₹' . number_format($this->tuition_fee, 0);
    }

    public function getFormattedComputerFeeAttribute(): string
    {
        return '₹' . number_format($this->computer_fee, 0);
    }

    public function getFormattedScienceFeeAttribute(): string
    {
        return '₹' . number_format($this->science_fee, 0);
    }

    public function getTotalOneTimeFeeAttribute(): float
    {
        return $this->registration_fee + $this->admission_fee + $this->security_deposit;
    }

    public function getTotalMonthlyFeeAttribute(): float
    {
        return $this->tuition_fee + $this->computer_fee + $this->science_fee;
    }

    public static function getCategoryOptions(): array
    {
        return self::CATEGORIES;
    }

    public static function getClassRangeOptions(): array
    {
        return self::CLASS_RANGES;
    }
}
