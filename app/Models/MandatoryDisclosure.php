<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MandatoryDisclosure extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'category',
        'file_path',
        'file_name',
        'file_size',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
        'file_size' => 'integer',
    ];

    /**
     * Get category options for dropdowns.
     */
    public static function getCategoryOptions(): array
    {
        return [
            'general' => 'General Information',
            'infrastructure' => 'Infrastructure',
            'faculty' => 'Faculty & Staff',
            'academics' => 'Academics',
            'fees' => 'Fees & Finance',
            'results' => 'Results',
            'affiliation' => 'Affiliation & Recognition',
            'other' => 'Other',
        ];
    }

    /**
     * Scope to get active disclosures.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to order by sort order.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('title');
    }

    /**
     * Get formatted file size.
     */
    public function getFormattedFileSizeAttribute(): string
    {
        if (!$this->file_size) {
            return 'N/A';
        }

        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];
        $i = 0;

        while ($bytes >= 1024 && $i < count($units) - 1) {
            $bytes /= 1024;
            $i++;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }
}
