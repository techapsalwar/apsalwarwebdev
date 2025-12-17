<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Alumni extends Model
{
    protected $table = 'alumni';

    protected $fillable = [
        'name',
        'slug',
        'batch_year',
        'class_section',
        'house',
        'photo',
        'current_designation',
        'organization',
        'achievement',
        'story',
        'school_memories',
        'message_to_juniors',
        'awards_during_school',
        'email',
        'phone',
        'linkedin_url',
        'location',
        'social_links',
        'category',
        'is_featured',
        'is_verified',
        'is_active',
        'order',
        'verification_token',
        'email_verified_at',
        'approval_status',
        'rejection_reason',
        'approved_at',
        'approved_by',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_verified' => 'boolean',
        'is_active' => 'boolean',
        'email_verified_at' => 'datetime',
        'approved_at' => 'datetime',
        'social_links' => 'array',
        'awards_during_school' => 'array',
    ];

    protected $hidden = [
        'verification_token',
    ];

    protected $appends = [
        'photo_url',
        'category_label',
    ];

    /**
     * Boot method to auto-generate slug
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($alumni) {
            if (empty($alumni->slug)) {
                $alumni->slug = Str::slug($alumni->name . '-' . $alumni->batch_year . '-' . Str::random(4));
            }
            if (empty($alumni->verification_token)) {
                $alumni->verification_token = Str::random(64);
            }
        });
    }

    /**
     * Relationships
     */
    public function approvedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Scopes
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    public function scopeEmailVerified($query)
    {
        return $query->whereNotNull('email_verified_at');
    }

    public function scopeApproved($query)
    {
        return $query->where('approval_status', 'approved');
    }

    public function scopePending($query)
    {
        return $query->where('approval_status', 'pending');
    }

    public function scopeRejected($query)
    {
        return $query->where('approval_status', 'rejected');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopePublicVisible($query)
    {
        return $query->active()->approved()->emailVerified();
    }

    public function scopeByBatch($query, int $year)
    {
        return $query->where('batch_year', $year);
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function scopeRecent($query)
    {
        return $query->orderByDesc('batch_year');
    }

    /**
     * Accessors
     */
    public function getPhotoUrlAttribute(): ?string
    {
        return $this->photo ? asset('storage/' . $this->photo) : null;
    }

    public function getLinkedinLinkAttribute(): ?string
    {
        if (!$this->linkedin_url) {
            return null;
        }
        return str_starts_with($this->linkedin_url, 'http') 
            ? $this->linkedin_url 
            : 'https://linkedin.com/in/' . $this->linkedin_url;
    }

    public function getYearsAgoAttribute(): int
    {
        return now()->year - (int) $this->batch_year;
    }

    public function getIsEmailVerifiedAttribute(): bool
    {
        return $this->email_verified_at !== null;
    }

    public function getIsPendingAttribute(): bool
    {
        return $this->approval_status === 'pending';
    }

    public function getIsApprovedAttribute(): bool
    {
        return $this->approval_status === 'approved';
    }

    public function getIsRejectedAttribute(): bool
    {
        return $this->approval_status === 'rejected';
    }

    public function getStatusBadgeAttribute(): array
    {
        return match($this->approval_status) {
            'approved' => ['label' => 'Approved', 'color' => 'green'],
            'rejected' => ['label' => 'Rejected', 'color' => 'red'],
            default => ['label' => 'Pending', 'color' => 'yellow'],
        };
    }

    /**
     * Helper Methods
     */
    public function markEmailAsVerified(): bool
    {
        return $this->update([
            'email_verified_at' => now(),
            'verification_token' => null,
        ]);
    }

    public function approve(int $userId): bool
    {
        return $this->update([
            'approval_status' => 'approved',
            'approved_at' => now(),
            'approved_by' => $userId,
            'rejection_reason' => null,
        ]);
    }

    public function reject(int $userId, ?string $reason = null): bool
    {
        return $this->update([
            'approval_status' => 'rejected',
            'approved_at' => now(),
            'approved_by' => $userId,
            'rejection_reason' => $reason,
        ]);
    }

    /**
     * Category Labels
     */
    public static function getCategoryOptions(): array
    {
        return [
            'defense' => 'Defense Services',
            'civil_services' => 'Civil Services',
            'medical' => 'Medical',
            'engineering' => 'Engineering & Technology',
            'business' => 'Business & Entrepreneurship',
            'arts' => 'Arts & Entertainment',
            'sports' => 'Sports',
            'education' => 'Education',
            'other' => 'Other',
        ];
    }

    public function getCategoryLabelAttribute(): string
    {
        return self::getCategoryOptions()[$this->category] ?? 'Other';
    }
}
