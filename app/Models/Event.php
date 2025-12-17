<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;

class Event extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'description',
        'short_description',
        'content',
        'featured_image',
        'event_type',
        'venue',
        'organizer',
        'contact_email',
        'contact_phone',
        'start_date',
        'end_date',
        'start_time',
        'end_time',
        'is_all_day',
        'status',
        'is_featured',
        'registration_link',
        'registration_required',
        'registration_deadline',
        'max_participants',
        'current_participants',
        'google_form_url',
        'google_sheet_url',
        'created_by',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
        'registration_deadline' => 'datetime',
        'is_all_day' => 'boolean',
        'is_featured' => 'boolean',
        'registration_required' => 'boolean',
        'max_participants' => 'integer',
        'current_participants' => 'integer',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($event) {
            if (empty($event->slug)) {
                $event->slug = Str::slug($event->title);
            }
            if (auth()->check() && empty($event->created_by)) {
                $event->created_by = auth()->id();
            }
        });
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopeUpcoming($query)
    {
        return $query->where('start_date', '>=', Carbon::today())
            ->where('status', 'upcoming')
            ->orderBy('start_date');
    }

    public function scopeOngoing($query)
    {
        return $query->where('start_date', '<=', Carbon::today())
            ->where(function ($q) {
                $q->whereNull('end_date')
                    ->orWhere('end_date', '>=', Carbon::today());
            })
            ->where('status', 'ongoing');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function isUpcoming(): bool
    {
        return $this->start_date->isFuture();
    }

    public function isOngoing(): bool
    {
        $today = Carbon::today();
        return $this->start_date->lte($today) && 
            ($this->end_date === null || $this->end_date->gte($today));
    }

    public function getFormattedDateAttribute(): string
    {
        if ($this->end_date && !$this->start_date->isSameDay($this->end_date)) {
            return $this->start_date->format('M d') . ' - ' . $this->end_date->format('M d, Y');
        }
        return $this->start_date->format('F d, Y');
    }
}
