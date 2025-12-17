<?php

namespace App\Http\Controllers;

use App\Models\Album;
use Inertia\Inertia;
use Inertia\Response;

class AlbumController extends Controller
{
    /**
     * Display a listing of published albums.
     */
    public function index(): Response
    {
        $albums = Album::published()
            ->with('photos')
            ->withCount('photos')
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('albums/index', [
            'albums' => $albums,
        ]);
    }

    /**
     * Display the specified album with its photos.
     */
    public function show(Album $album): Response
    {
        // Check if album is published
        if ($album->status !== 'published') {
            abort(404);
        }

        $album->load('photos');

        return Inertia::render('albums/show', [
            'album' => $album,
        ]);
    }
}
