<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GuestLecture extends Model
{
    protected $fillable = [
        'guest_name',
        'designation',
        'organization',
        'topic',
        'description',
        'photo',
        'lecture_date',
        'academic_year',
        'is_featured',
    ];

    protected $casts = [
        'lecture_date' => 'datetime',
        'is_featured' => 'boolean',
    ];

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeByYear($query, int $year)
    {
        return $query->where('academic_year', $year);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('lecture_date', '>', now());
    }

    public function scopePast($query)
    {
        return $query->where('lecture_date', '<', now());
    }

    public function scopeRecent($query)
    {
        return $query->past()->orderByDesc('lecture_date');
    }

    public function getPhotoUrlAttribute(): ?string
    {
        return $this->photo ? asset('storage/' . $this->photo) : null;
    }

    public function getIsUpcomingAttribute(): bool
    {
        return $this->lecture_date > now();
    }

    public function getFormattedDateAttribute(): string
    {
        return $this->lecture_date->format('d M Y, h:i A');
    }
}
