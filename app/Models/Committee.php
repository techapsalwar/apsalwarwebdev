<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Committee extends Model
{
    /**
     * Committee type constants.
     */
    public const TYPE_SMC = 'smc';
    public const TYPE_ACADEMIC = 'academic';
    public const TYPE_ADMINISTRATIVE = 'administrative';
    public const TYPE_STUDENT_WELFARE = 'student_welfare';
    public const TYPE_EXAMINATION = 'examination';
    public const TYPE_DISCIPLINE = 'discipline';
    public const TYPE_PTA = 'pta';
    public const TYPE_OTHER = 'other';

    public const TYPES = [
        self::TYPE_SMC => 'School Management Committee',
        self::TYPE_ACADEMIC => 'Academic Committee',
        self::TYPE_ADMINISTRATIVE => 'Administrative Committee',
        self::TYPE_STUDENT_WELFARE => 'Student Welfare Committee',
        self::TYPE_EXAMINATION => 'Examination Committee',
        self::TYPE_DISCIPLINE => 'Discipline Committee',
        self::TYPE_PTA => 'Parent Teacher Association',
        self::TYPE_OTHER => 'Other Committee',
    ];

    protected $fillable = [
        'name',
        'slug',
        'type',
        'description',
        'functions',
        'session',
        'image',
        'is_active',
        'order',
    ];

    protected $casts = [
        'functions' => 'array',
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($committee) {
            if (empty($committee->slug)) {
                $committee->slug = Str::slug($committee->name);
            }
        });
    }

    /**
     * Get the members of this committee.
     */
    public function members(): HasMany
    {
        return $this->hasMany(CommitteeMember::class)->orderBy('order');
    }

    /**
     * Get active members only.
     */
    public function activeMembers(): HasMany
    {
        return $this->members()->where('is_active', true);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('order');
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function scopeSmc($query)
    {
        return $query->byType(self::TYPE_SMC);
    }

    public function scopeAcademic($query)
    {
        return $query->byType(self::TYPE_ACADEMIC);
    }

    public function scopeAdministrative($query)
    {
        return $query->byType(self::TYPE_ADMINISTRATIVE);
    }

    public function scopeStudentWelfare($query)
    {
        return $query->byType(self::TYPE_STUDENT_WELFARE);
    }

    public function scopePta($query)
    {
        return $query->byType(self::TYPE_PTA);
    }

    public function getTypeLabelAttribute(): string
    {
        return self::TYPES[$this->type] ?? 'Committee';
    }

    public function getMemberCountAttribute(): int
    {
        return $this->members()->count();
    }

    /**
     * Get the chairman/chairperson of this committee.
     */
    public function getChairmanAttribute(): ?CommitteeMember
    {
        return $this->members()
            ->where(function ($query) {
                $query->where('designation', 'like', '%Chairman%')
                    ->orWhere('designation', 'like', '%Chairperson%')
                    ->orWhere('designation', 'like', '%President%');
            })
            ->first();
    }

    /**
     * Get type options for dropdowns.
     */
    public static function getTypeOptions(): array
    {
        return collect(self::TYPES)->map(function ($label, $value) {
            return [
                'value' => $value,
                'label' => $label,
            ];
        })->values()->toArray();
    }
}
