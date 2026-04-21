<?php

namespace App\Http\Controllers;

use App\Models\Magazine;
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
}
