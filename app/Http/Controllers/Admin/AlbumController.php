<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Models\Photo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class AlbumController extends Controller
{
    public function index(Request $request)
    {
        $query = Album::query()
            ->withCount('photos');

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Year filter
        if ($request->filled('year')) {
            $query->where('year', $request->year);
        }

        $albums = $query->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        // Get years for filter
        $years = Album::distinct()->pluck('year')->filter()->sort()->reverse()->values();

        return Inertia::render('admin/albums/index', [
            'albums' => $albums,
            'filters' => $request->only(['search', 'status', 'year']),
            'years' => $years,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/albums/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'year' => 'nullable|integer|min:2000|max:' . (date('Y') + 1),
            'month' => 'nullable|integer|min:1|max:12',
            'status' => 'required|in:draft,published',
            'is_featured' => 'boolean',
        ]);

        // Generate slug
        $validated['slug'] = Str::slug($validated['title']);

        // Handle cover image upload
        if ($request->hasFile('cover_image')) {
            $validated['cover_image'] = $request->file('cover_image')->store('albums/covers', 'public');
        }

        // Set order
        $validated['order'] = Album::max('order') + 1;

        $album = Album::create($validated);

        return redirect()->route('admin.albums.edit', $album)
            ->with('success', 'Album created. Now you can add photos.');
    }

    public function edit(Album $album)
    {
        $album->load('photos');

        return Inertia::render('admin/albums/edit', [
            'album' => $album,
        ]);
    }

    public function update(Request $request, Album $album)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'year' => 'nullable|integer|min:2000|max:' . (date('Y') + 1),
            'month' => 'nullable|integer|min:1|max:12',
            'status' => 'required|in:draft,published',
            'is_featured' => 'boolean',
        ]);

        // Generate slug if title changed
        if ($album->title !== $validated['title']) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        // Handle cover image upload
        if ($request->hasFile('cover_image')) {
            // Delete old cover
            if ($album->cover_image) {
                Storage::disk('public')->delete($album->cover_image);
            }
            $validated['cover_image'] = $request->file('cover_image')->store('albums/covers', 'public');
        }

        $album->update($validated);

        return back()->with('success', 'Album updated successfully.');
    }

    public function destroy(Album $album)
    {
        // Delete all photos
        foreach ($album->photos as $photo) {
            Storage::disk('public')->delete($photo->path);
            if ($photo->thumbnail_path) {
                Storage::disk('public')->delete($photo->thumbnail_path);
            }
        }

        // Delete cover image
        if ($album->cover_image) {
            Storage::disk('public')->delete($album->cover_image);
        }

        $album->delete();

        return redirect()->route('admin.albums.index')
            ->with('success', 'Album deleted successfully.');
    }

    public function toggleFeatured(Album $album)
    {
        $album->update(['is_featured' => !$album->is_featured]);

        return back()->with('success', 'Album featured status updated.');
    }

    public function toggleStatus(Album $album)
    {
        $newStatus = $album->status === 'published' ? 'draft' : 'published';
        $album->update(['status' => $newStatus]);

        return back()->with('success', 'Album status updated.');
    }

    // Photo management
    public function uploadPhotos(Request $request, Album $album)
    {
        $request->validate([
            'photos' => 'required|array',
            'photos.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        $uploadedPhotos = [];
        $maxOrder = $album->photos()->max('order') ?? 0;

        foreach ($request->file('photos') as $file) {
            $filename = $file->getClientOriginalName();
            $path = $file->store('albums/' . $album->id, 'public');

            // Create thumbnail
            $thumbnailPath = null;
            try {
                $manager = new ImageManager(new Driver());
                $image = $manager->read(Storage::disk('public')->path($path));
                $image->scale(width: 400);
                
                $thumbnailPath = 'albums/' . $album->id . '/thumbs/' . basename($path);
                Storage::disk('public')->makeDirectory('albums/' . $album->id . '/thumbs');
                $image->save(Storage::disk('public')->path($thumbnailPath));
            } catch (\Exception $e) {
                // Thumbnail creation failed, use original
            }

            // Get image dimensions
            $dimensions = @getimagesize(Storage::disk('public')->path($path));

            $photo = Photo::create([
                'album_id' => $album->id,
                'filename' => $filename,
                'path' => $path,
                'thumbnail_path' => $thumbnailPath,
                'file_size' => Storage::disk('public')->size($path),
                'width' => $dimensions[0] ?? null,
                'height' => $dimensions[1] ?? null,
                'order' => ++$maxOrder,
            ]);

            $uploadedPhotos[] = $photo;
        }

        return back()->with('success', count($uploadedPhotos) . ' photos uploaded successfully.');
    }

    public function updatePhoto(Request $request, Album $album, Photo $photo)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'alt_text' => 'nullable|string|max:255',
            'caption' => 'nullable|string',
            'is_featured' => 'boolean',
        ]);

        $photo->update($validated);

        return back()->with('success', 'Photo updated successfully.');
    }

    public function deletePhoto(Album $album, Photo $photo)
    {
        Storage::disk('public')->delete($photo->path);
        if ($photo->thumbnail_path) {
            Storage::disk('public')->delete($photo->thumbnail_path);
        }

        $photo->delete();

        return back()->with('success', 'Photo deleted successfully.');
    }

    public function reorderPhotos(Request $request, Album $album)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:photos,id',
            'items.*.order' => 'required|integer|min:0',
        ]);

        foreach ($request->items as $item) {
            Photo::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return back()->with('success', 'Photos reordered successfully.');
    }

    public function setPhotoCover(Album $album, Photo $photo)
    {
        // Delete existing cover image if it was manually uploaded
        if ($album->cover_image && !Str::startsWith($album->cover_image, 'albums/' . $album->id)) {
            Storage::disk('public')->delete($album->cover_image);
        }

        $album->update(['cover_image' => $photo->path]);

        return back()->with('success', 'Cover image updated.');
    }
}
