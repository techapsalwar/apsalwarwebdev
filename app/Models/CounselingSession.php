<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CounselingSession extends Model
{
    protected $fillable = [
        'counselor_id',
        'student_name',
        'student_class',
        'parent_name',
        'parent_email',
        'parent_phone',
        'session_type',
        'concern_area',
        'description',
        'scheduled_at',
        'duration_minutes',
        'status',
        'notes',
        'follow_up_date',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'follow_up_date' => 'date',
    ];

    public function counselor(): BelongsTo
    {
        return $this->belongsTo(Staff::class, 'counselor_id');
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopePending($query)
    {
        return $query->byStatus('pending');
    }

    public function scopeScheduled($query)
    {
        return $query->byStatus('scheduled');
    }

    public function scopeCompleted($query)
    {
        return $query->byStatus('completed');
    }

    public function scopeUpcoming($query)
    {
        return $query->where('scheduled_at', '>', now())
            ->whereIn('status', ['pending', 'scheduled'])
            ->orderBy('scheduled_at');
    }

    public function scopeToday($query)
    {
        return $query->whereDate('scheduled_at', today());
    }

    public function scopeRequiresFollowUp($query)
    {
        return $query->whereNotNull('follow_up_date')
            ->where('follow_up_date', '<=', today())
            ->where('status', 'completed');
    }

    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            'pending' => 'yellow',
            'scheduled' => 'blue',
            'completed' => 'green',
            'cancelled' => 'red',
            'no_show' => 'gray',
            default => 'gray',
        };
    }

    public function getSessionTypeLabelAttribute(): string
    {
        return match ($this->session_type) {
            'academic' => 'Academic Counseling',
            'career' => 'Career Guidance',
            'behavioral' => 'Behavioral Counseling',
            'emotional' => 'Emotional Support',
            'parent' => 'Parent Consultation',
            default => 'General Counseling',
        };
    }

    public function getConcernAreaLabelAttribute(): string
    {
        return match ($this->concern_area) {
            'academics' => 'Academic Performance',
            'behavior' => 'Behavior Issues',
            'bullying' => 'Bullying/Harassment',
            'anxiety' => 'Anxiety/Stress',
            'peer_relations' => 'Peer Relations',
            'family' => 'Family Issues',
            'career' => 'Career Planning',
            default => 'Other',
        };
    }

    public function getFormattedTimeAttribute(): string
    {
        return $this->scheduled_at->format('d M Y, h:i A');
    }
}
