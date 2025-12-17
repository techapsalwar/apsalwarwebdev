<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Contact extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'subject',
        'message',
        'category',
        'status',
        'admin_reply',
        'replied_by',
        'replied_at',
    ];

    protected $casts = [
        'replied_at' => 'datetime',
    ];

    public function repliedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'replied_by');
    }

    public function scopeUnread($query)
    {
        return $query->where('status', 'unread');
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function markAsRead(): void
    {
        if ($this->status === 'unread') {
            $this->update(['status' => 'read']);
        }
    }

    public function reply(string $message): void
    {
        $this->update([
            'admin_reply' => $message,
            'status' => 'replied',
            'replied_by' => auth()->id(),
            'replied_at' => now(),
        ]);
    }

    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            'unread' => 'red',
            'read' => 'yellow',
            'replied' => 'green',
            'archived' => 'gray',
            default => 'gray',
        };
    }
}
