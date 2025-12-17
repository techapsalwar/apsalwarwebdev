<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class Announcement extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'content',
        'type',
        'priority',
        'is_active',
        'show_in_ticker',
        'start_date',
        'end_date',
        'attachment',
        'link',
        'target_audience',
        'created_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'show_in_ticker' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    // Append computed attributes
    protected $appends = ['priority_color', 'type_color', 'priority_icon', 'type_icon'];

    /**
     * Boot method to auto-generate slug
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($announcement) {
            if (empty($announcement->slug)) {
                $announcement->slug = static::generateUniqueSlug($announcement->title);
            }
        });

        static::updating(function ($announcement) {
            if ($announcement->isDirty('title') && !$announcement->isDirty('slug')) {
                $announcement->slug = static::generateUniqueSlug($announcement->title, $announcement->id);
            }
        });
    }

    /**
     * Generate a unique slug
     */
    public static function generateUniqueSlug(string $title, ?int $excludeId = null): string
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $counter = 1;

        $query = static::where('slug', $slug);
        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        while ($query->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
            $query = static::where('slug', $slug);
            if ($excludeId) {
                $query->where('id', '!=', $excludeId);
            }
        }

        return $slug;
    }

    /**
     * Get route key for URL bindings
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('start_date')
                    ->orWhere('start_date', '<=', Carbon::today());
            })
            ->where(function ($q) {
                $q->whereNull('end_date')
                    ->orWhere('end_date', '>=', Carbon::today());
            });
    }

    public function scopeForTicker($query)
    {
        return $query->active()->where('show_in_ticker', true);
    }

    public function scopeUrgent($query)
    {
        return $query->where('type', 'urgent');
    }

    public function scopeImportant($query)
    {
        return $query->whereIn('type', ['urgent', 'important']);
    }

    public function scopeByPriority($query, string $priority)
    {
        return $query->where('priority', $priority);
    }

    public function isUrgent(): bool
    {
        return $this->type === 'urgent';
    }

    public function isImportant(): bool
    {
        return in_array($this->type, ['urgent', 'important']);
    }

    /**
     * Get priority color for frontend styling
     */
    public function getPriorityColorAttribute(): string
    {
        return match ($this->priority) {
            'critical' => 'red',
            'high' => 'orange',
            'medium' => 'yellow',
            'low' => 'green',
            default => 'gray',
        };
    }

    /**
     * Get type color for frontend styling
     */
    public function getTypeColorAttribute(): string
    {
        return match ($this->type) {
            'urgent' => 'red',
            'important' => 'orange',
            'event' => 'blue',
            'holiday' => 'green',
            'admission' => 'purple',
            'exam' => 'amber',
            'result' => 'teal',
            'academic' => 'indigo',
            'general' => 'gray',
            default => 'gray',
        };
    }

    /**
     * Check if announcement has a link
     */
    public function hasLink(): bool
    {
        return !empty($this->link);
    }

    /**
     * Check if announcement has an attachment
     */
    public function hasAttachment(): bool
    {
        return !empty($this->attachment);
    }

    /**
     * Get priority icon name for frontend
     */
    public function getPriorityIconAttribute(): string
    {
        return match ($this->priority) {
            'critical' => 'AlertTriangle',
            'high' => 'Bell',
            'medium' => 'Megaphone',
            'low' => 'Info',
            default => 'Bell',
        };
    }

    /**
     * Get type icon name for frontend
     */
    public function getTypeIconAttribute(): string
    {
        return match ($this->type) {
            'urgent' => 'AlertTriangle',
            'important' => 'AlertCircle',
            'event' => 'Calendar',
            'holiday' => 'PartyPopper',
            'admission' => 'UserPlus',
            'exam' => 'ClipboardList',
            'result' => 'Trophy',
            'academic' => 'BookOpen',
            'general' => 'Info',
            default => 'Bell',
        };
    }
}
