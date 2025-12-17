<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Admission extends Model
{
    protected $fillable = [
        'student_name',
        'parent_name',
        'email',
        'phone',
        'alternate_phone',
        'class_seeking',
        'academic_year',
        'date_of_birth',
        'gender',
        'current_school',
        'address',
        'category',
        'message',
        'status',
        'admin_notes',
        'handled_by',
        'contacted_at',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'contacted_at' => 'datetime',
    ];

    public function handler(): BelongsTo
    {
        return $this->belongsTo(User::class, 'handled_by');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeContacted($query)
    {
        return $query->where('status', 'contacted');
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            'pending' => 'yellow',
            'contacted' => 'blue',
            'scheduled' => 'purple',
            'admitted' => 'green',
            'rejected' => 'red',
            default => 'gray',
        };
    }

    public function getCategoryLabelAttribute(): ?string
    {
        return match ($this->category) {
            'officers' => 'Officers',
            'jco' => 'JCO',
            'or' => 'OR',
            'civilian' => 'Civilian',
            default => null,
        };
    }
}
