<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Appointment extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'purpose',
        'message',
        'preferred_date',
        'preferred_time',
        'status',
        'admin_notes',
        'handled_by',
    ];

    protected $casts = [
        'preferred_date' => 'date',
        'preferred_time' => 'datetime:H:i',
    ];

    public function handler(): BelongsTo
    {
        return $this->belongsTo(User::class, 'handled_by');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('preferred_date', '>=', now()->toDateString())
            ->whereIn('status', ['pending', 'confirmed'])
            ->orderBy('preferred_date')
            ->orderBy('preferred_time');
    }

    public function confirm(): void
    {
        $this->update(['status' => 'confirmed']);
    }

    public function complete(): void
    {
        $this->update(['status' => 'completed']);
    }

    public function cancel(): void
    {
        $this->update(['status' => 'cancelled']);
    }

    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            'pending' => 'yellow',
            'confirmed' => 'blue',
            'completed' => 'green',
            'cancelled' => 'red',
            default => 'gray',
        };
    }

    public function getPurposeLabelAttribute(): string
    {
        return match ($this->purpose) {
            'admission' => 'Admission Inquiry',
            'tc' => 'TC Collection',
            'meeting' => 'Meeting with Staff',
            'counseling' => 'Counseling Session',
            default => 'Other',
        };
    }
}
