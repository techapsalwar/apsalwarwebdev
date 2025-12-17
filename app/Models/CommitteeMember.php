<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CommitteeMember extends Model
{
    protected $fillable = [
        'committee_id',
        'name',
        'designation',
        'role',
        'email',
        'phone',
        'photo',
        'bio',
        'organization',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    /**
     * Get the committee this member belongs to.
     */
    public function committee(): BelongsTo
    {
        return $this->belongsTo(Committee::class);
    }

    /**
     * Scope to get active members only.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to order by display order.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order')->orderBy('id');
    }

    /**
     * Get the photo URL attribute.
     */
    public function getPhotoUrlAttribute(): ?string
    {
        return $this->photo ? asset('storage/' . $this->photo) : null;
    }

    /**
     * Get initials from name.
     */
    public function getInitialsAttribute(): string
    {
        return collect(explode(' ', $this->name))
            ->map(fn($part) => strtoupper(substr($part, 0, 1)))
            ->take(2)
            ->join('');
    }
}
