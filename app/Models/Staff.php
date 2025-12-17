<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Staff extends Model
{
    protected $table = 'staff';

    protected $fillable = [
        'name',
        'slug',
        'designation',
        'department_id',
        'photo',
        'email',
        'phone',
        'qualifications',
        'experience',
        'bio',
        'subjects',
        'type',
        'joining_date',
        'is_active',
        'show_on_website',
        'order',
    ];

    protected $casts = [
        'subjects' => 'array',
        'joining_date' => 'date',
        'is_active' => 'boolean',
        'show_on_website' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($staff) {
            if (empty($staff->slug)) {
                $staff->slug = Str::slug($staff->name);
            }
        });
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeVisible($query)
    {
        return $query->active()->where('show_on_website', true);
    }

    public function scopeTeaching($query)
    {
        return $query->where('type', 'teaching');
    }

    public function scopeNonTeaching($query)
    {
        return $query->where('type', 'non_teaching');
    }

    public function scopeManagement($query)
    {
        return $query->where('type', 'management');
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function getPhotoUrlAttribute(): ?string
    {
        return $this->photo ? asset('storage/' . $this->photo) : null;
    }

    public function getYearsOfExperienceAttribute(): ?int
    {
        if (!$this->joining_date) {
            return null;
        }
        return $this->joining_date->diffInYears(now());
    }
}
