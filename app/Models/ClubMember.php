<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClubMember extends Model
{
    protected $fillable = [
        'club_id',
        'student_name',
        'class',
        'gender',
        'admission_number',
        'email',
        'phone',
        'parent_phone',
        'reason',
        'academic_year',
        'status',
    ];

    public function club(): BelongsTo
    {
        return $this->belongsTo(Club::class);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeByYear($query, int $year)
    {
        return $query->where('academic_year', $year);
    }

    public function approve(): void
    {
        $this->update(['status' => 'approved']);
    }

    public function reject(): void
    {
        $this->update(['status' => 'rejected']);
    }

    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            'pending' => 'yellow',
            'approved' => 'green',
            'rejected' => 'red',
            default => 'gray',
        };
    }
}
