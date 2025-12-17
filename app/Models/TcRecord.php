<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TcRecord extends Model
{
    protected $fillable = [
        'tc_number',
        'student_name',
        'father_name',
        'admission_number',
        'class',
        'date_of_issue',
        'pdf_path',
        'is_verified',
        'uploaded_by',
    ];

    protected $casts = [
        'date_of_issue' => 'date',
        'is_verified' => 'boolean',
    ];

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    public function scopeSearch($query, string $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('tc_number', 'like', "%{$search}%")
                ->orWhere('student_name', 'like', "%{$search}%")
                ->orWhere('father_name', 'like', "%{$search}%")
                ->orWhere('admission_number', 'like', "%{$search}%");
        });
    }

    public function getPdfUrlAttribute(): ?string
    {
        return $this->pdf_path ? asset('storage/' . $this->pdf_path) : null;
    }
}
