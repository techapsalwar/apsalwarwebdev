<?php

namespace App\Http\Controllers;

use App\Models\Magazine;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class EmagazineController extends Controller
{
    public function index()
    {
        $magazines = Magazine::active()
            ->orderBy('issue_date', 'desc')
            ->get()
            ->map(function ($magazine) {
                return [
                    'id' => $magazine->id,
                    'title' => $magazine->title,
                    'slug' => $magazine->slug,
                    'description' => $magazine->description,
                    'cover_url' => $magazine->cover_url,
                    'pdf_url' => $magazine->pdf_url,
                    'issue_date' => $magazine->issue_date->format('M Y'),
                    'issue_number' => $magazine->issue_number,
                    'is_featured' => $magazine->is_featured,
                ];
            });

        return Inertia::render('public/e-magazines', [
            'magazines' => $magazines,
        ]);
    }

    public function show(Magazine $magazine)
    {
        $magazine->incrementViews();

        return response()->json([
            'id' => $magazine->id,
            'title' => $magazine->title,
            'pdf_url' => $magazine->pdf_url,
        ]);
    }

    public function pdf(Magazine $magazine)
    {
        abort_unless($magazine->is_active, 404);
        abort_unless($magazine->pdf_path && Storage::disk('public')->exists($magazine->pdf_path), 404);

        return response()->file(
            Storage::disk('public')->path($magazine->pdf_path),
            [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="' . basename($magazine->pdf_path) . '"',
                'Cache-Control' => 'public, max-age=3600',
            ]
        );
    }
}
