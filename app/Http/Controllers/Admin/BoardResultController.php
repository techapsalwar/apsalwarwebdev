<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BoardResult;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BoardResultController extends Controller
{
    /**
     * Display a listing of board results.
     */
    public function index(Request $request)
    {
        $query = BoardResult::query();

        // Filter by academic year
        if ($request->has('year') && $request->year) {
            $query->where('academic_year', $request->year);
        }

        // Filter by class
        if ($request->has('class') && $request->class) {
            $query->where('class', $request->class);
        }

        // Filter by published status
        if ($request->has('published')) {
            $query->where('is_published', $request->boolean('published'));
        }

        $results = $query->orderByDesc('academic_year')
            ->orderBy('class')
            ->paginate(10)
            ->through(fn($result) => [
                'id' => $result->id,
                'academic_year' => $result->academic_year,
                'board' => strtoupper($result->board),
                'class' => $result->class,
                'stream' => $result->stream,
                'appeared' => $result->appeared,
                'passed' => $result->passed,
                'pass_percentage' => $result->pass_percentage,
                'above_90_percent' => $result->above_90_percent,
                'api_score' => $result->api_score,
                'overall_topper_name' => $result->overall_topper_name,
                'overall_topper_percentage' => $result->overall_topper_percentage,
                'is_published' => $result->is_published,
                'created_at' => $result->created_at->format('M d, Y'),
            ]);

        // Get unique years for filter
        $years = BoardResult::selectRaw('DISTINCT academic_year')
            ->orderByDesc('academic_year')
            ->pluck('academic_year');

        return Inertia::render('admin/board-results/index', [
            'results' => $results,
            'years' => $years,
            'filters' => [
                'year' => $request->year,
                'class' => $request->class,
                'published' => $request->published,
            ],
        ]);
    }

    /**
     * Show the form for creating a new board result.
     */
    public function create()
    {
        return Inertia::render('admin/board-results/create');
    }

    /**
     * Store a newly created board result.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'academic_year' => 'required|string|max:4',
            'board' => 'required|string|in:cbse,icse,state',
            'class' => 'required|string|in:X,XII',
            'stream' => 'nullable|string|in:Science,Commerce,Humanities',
            'appeared' => 'required|integer|min:0',
            'passed' => 'required|integer|min:0|lte:appeared',
            'pass_percentage' => 'required|numeric|min:0|max:100',
            'school_average' => 'nullable|numeric|min:0|max:100',
            'highest_marks' => 'nullable|numeric|min:0|max:100',
            'above_90_percent' => 'nullable|integer|min:0',
            'above_80_percent' => 'nullable|integer|min:0',
            'above_70_percent' => 'nullable|integer|min:0',
            'above_60_percent' => 'nullable|integer|min:0',
            'api_score' => 'nullable|numeric|min:0',
            'is_published' => 'boolean',
            // Overall topper
            'overall_topper_name' => 'nullable|string|max:255',
            'overall_topper_percentage' => 'nullable|numeric|min:0|max:100',
            'overall_topper_photo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'overall_topper_stream' => 'nullable|string|in:Science,Commerce,Humanities',
            // Toppers arrays
            'class_x_toppers' => 'nullable|array|max:5',
            'class_x_toppers.*.name' => 'required_with:class_x_toppers|string|max:255',
            'class_x_toppers.*.percentage' => 'required_with:class_x_toppers|numeric|min:0|max:100',
            'class_x_toppers.*.photo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'science_toppers' => 'nullable|array|max:3',
            'science_toppers.*.name' => 'required_with:science_toppers|string|max:255',
            'science_toppers.*.percentage' => 'required_with:science_toppers|numeric|min:0|max:100',
            'science_toppers.*.photo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'commerce_toppers' => 'nullable|array|max:3',
            'commerce_toppers.*.name' => 'required_with:commerce_toppers|string|max:255',
            'commerce_toppers.*.percentage' => 'required_with:commerce_toppers|numeric|min:0|max:100',
            'commerce_toppers.*.photo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'humanities_toppers' => 'nullable|array|max:3',
            'humanities_toppers.*.name' => 'required_with:humanities_toppers|string|max:255',
            'humanities_toppers.*.percentage' => 'required_with:humanities_toppers|numeric|min:0|max:100',
            'humanities_toppers.*.photo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        // Handle overall topper photo upload
        if ($request->hasFile('overall_topper_photo')) {
            $validated['overall_topper_photo'] = $request->file('overall_topper_photo')
                ->store('board-results/toppers', 'public');
        }

        // Handle Class X toppers photos
        if ($request->has('class_x_toppers')) {
            $validated['class_x_toppers'] = $this->processTopperPhotos(
                $request->class_x_toppers ?? [],
                $request->file('class_x_toppers') ?? [],
                'board-results/class-x-toppers'
            );
        }

        // Handle stream toppers photos
        foreach (['science_toppers', 'commerce_toppers', 'humanities_toppers'] as $streamKey) {
            if ($request->has($streamKey)) {
                $validated[$streamKey] = $this->processTopperPhotos(
                    $request->$streamKey ?? [],
                    $request->file($streamKey) ?? [],
                    'board-results/' . str_replace('_', '-', $streamKey)
                );
            }
        }

        BoardResult::create($validated);

        return redirect()->route('admin.board-results.index')
            ->with('success', 'Board result created successfully.');
    }

    /**
     * Show the form for editing a board result.
     */
    public function edit(BoardResult $boardResult)
    {
        return Inertia::render('admin/board-results/edit', [
            'boardResult' => [
                'id' => $boardResult->id,
                'academic_year' => $boardResult->academic_year,
                'board' => $boardResult->board,
                'class' => $boardResult->class,
                'stream' => $boardResult->stream,
                'appeared' => $boardResult->appeared,
                'passed' => $boardResult->passed,
                'pass_percentage' => (float) $boardResult->pass_percentage,
                'school_average' => $boardResult->school_average ? (float) $boardResult->school_average : null,
                'highest_marks' => $boardResult->highest_marks ? (float) $boardResult->highest_marks : null,
                'above_90_percent' => $boardResult->above_90_percent,
                'above_80_percent' => $boardResult->above_80_percent,
                'above_70_percent' => $boardResult->above_70_percent,
                'above_60_percent' => $boardResult->above_60_percent,
                'api_score' => $boardResult->api_score ? (float) $boardResult->api_score : null,
                'overall_topper_name' => $boardResult->overall_topper_name,
                'overall_topper_percentage' => $boardResult->overall_topper_percentage 
                    ? (float) $boardResult->overall_topper_percentage 
                    : null,
                'overall_topper_photo' => $boardResult->overall_topper_photo,
                'overall_topper_photo_url' => $boardResult->overall_topper_photo_url,
                'overall_topper_stream' => $boardResult->overall_topper_stream,
                'class_x_toppers' => $this->formatToppersForEdit($boardResult->class_x_toppers),
                'science_toppers' => $this->formatToppersForEdit($boardResult->science_toppers),
                'commerce_toppers' => $this->formatToppersForEdit($boardResult->commerce_toppers),
                'humanities_toppers' => $this->formatToppersForEdit($boardResult->humanities_toppers),
                'is_published' => $boardResult->is_published,
            ],
        ]);
    }

    /**
     * Update the specified board result.
     */
    public function update(Request $request, BoardResult $boardResult)
    {
        $validated = $request->validate([
            'academic_year' => 'required|string|max:4',
            'board' => 'required|string|in:cbse,icse,state',
            'class' => 'required|string|in:X,XII',
            'stream' => 'nullable|string|in:Science,Commerce,Humanities',
            'appeared' => 'required|integer|min:0',
            'passed' => 'required|integer|min:0|lte:appeared',
            'pass_percentage' => 'required|numeric|min:0|max:100',
            'school_average' => 'nullable|numeric|min:0|max:100',
            'highest_marks' => 'nullable|numeric|min:0|max:100',
            'above_90_percent' => 'nullable|integer|min:0',
            'above_80_percent' => 'nullable|integer|min:0',
            'above_70_percent' => 'nullable|integer|min:0',
            'above_60_percent' => 'nullable|integer|min:0',
            'api_score' => 'nullable|numeric|min:0',
            'is_published' => 'boolean',
            'overall_topper_name' => 'nullable|string|max:255',
            'overall_topper_percentage' => 'nullable|numeric|min:0|max:100',
            'overall_topper_photo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'overall_topper_stream' => 'nullable|string|in:Science,Commerce,Humanities',
            'remove_overall_topper_photo' => 'boolean',
            'class_x_toppers' => 'nullable|array|max:5',
            'science_toppers' => 'nullable|array|max:3',
            'commerce_toppers' => 'nullable|array|max:3',
            'humanities_toppers' => 'nullable|array|max:3',
        ]);

        // Handle overall topper photo
        if ($request->boolean('remove_overall_topper_photo')) {
            if ($boardResult->overall_topper_photo) {
                Storage::disk('public')->delete($boardResult->overall_topper_photo);
            }
            $validated['overall_topper_photo'] = null;
        } elseif ($request->hasFile('overall_topper_photo')) {
            if ($boardResult->overall_topper_photo) {
                Storage::disk('public')->delete($boardResult->overall_topper_photo);
            }
            $validated['overall_topper_photo'] = $request->file('overall_topper_photo')
                ->store('board-results/toppers', 'public');
        } else {
            unset($validated['overall_topper_photo']);
        }

        // Process toppers for each category
        $validated['class_x_toppers'] = $this->processTopperPhotosForUpdate(
            $boardResult->class_x_toppers ?? [],
            $request->class_x_toppers ?? [],
            $request->file('class_x_toppers') ?? [],
            'board-results/class-x-toppers'
        );

        foreach (['science_toppers', 'commerce_toppers', 'humanities_toppers'] as $streamKey) {
            $validated[$streamKey] = $this->processTopperPhotosForUpdate(
                $boardResult->$streamKey ?? [],
                $request->$streamKey ?? [],
                $request->file($streamKey) ?? [],
                'board-results/' . str_replace('_', '-', $streamKey)
            );
        }

        unset($validated['remove_overall_topper_photo']);
        $boardResult->update($validated);

        return redirect()->route('admin.board-results.index')
            ->with('success', 'Board result updated successfully.');
    }

    /**
     * Remove the specified board result.
     */
    public function destroy(BoardResult $boardResult)
    {
        // Delete all associated photos
        if ($boardResult->overall_topper_photo) {
            Storage::disk('public')->delete($boardResult->overall_topper_photo);
        }

        $this->deleteTopperPhotos($boardResult->class_x_toppers ?? []);
        $this->deleteTopperPhotos($boardResult->science_toppers ?? []);
        $this->deleteTopperPhotos($boardResult->commerce_toppers ?? []);
        $this->deleteTopperPhotos($boardResult->humanities_toppers ?? []);

        $boardResult->delete();

        return redirect()->route('admin.board-results.index')
            ->with('success', 'Board result deleted successfully.');
    }

    /**
     * Toggle published status.
     */
    public function togglePublish(BoardResult $boardResult)
    {
        $boardResult->update(['is_published' => !$boardResult->is_published]);

        return back()->with('success', 
            $boardResult->is_published 
                ? 'Result published successfully.' 
                : 'Result unpublished successfully.'
        );
    }

    /**
     * Process topper photos for storage (create)
     */
    private function processTopperPhotos(array $toppers, array $files, string $path): array
    {
        $result = [];
        foreach ($toppers as $index => $topper) {
            $topperData = [
                'name' => $topper['name'] ?? '',
                'percentage' => $topper['percentage'] ?? null,
                'rank' => $index + 1,
            ];

            if (isset($files[$index]['photo']) && $files[$index]['photo']) {
                $topperData['photo'] = $files[$index]['photo']->store($path, 'public');
            }

            $result[] = $topperData;
        }
        return $result;
    }

    /**
     * Process topper photos for update
     */
    private function processTopperPhotosForUpdate(
        array $existingToppers, 
        array $newToppers, 
        array $files, 
        string $path
    ): array {
        $result = [];
        
        foreach ($newToppers as $index => $topper) {
            $topperData = [
                'name' => $topper['name'] ?? '',
                'percentage' => $topper['percentage'] ?? null,
                'rank' => $index + 1,
            ];

            // Check if there's a new photo upload
            if (isset($files[$index]['photo']) && $files[$index]['photo']) {
                // Delete old photo if exists
                if (isset($existingToppers[$index]['photo'])) {
                    Storage::disk('public')->delete($existingToppers[$index]['photo']);
                }
                $topperData['photo'] = $files[$index]['photo']->store($path, 'public');
            } elseif (!empty($topper['remove_photo'])) {
                // Remove photo if requested
                if (isset($existingToppers[$index]['photo'])) {
                    Storage::disk('public')->delete($existingToppers[$index]['photo']);
                }
            } elseif (isset($existingToppers[$index]['photo'])) {
                // Keep existing photo
                $topperData['photo'] = $existingToppers[$index]['photo'];
            }

            $result[] = $topperData;
        }

        // Delete photos of removed toppers
        for ($i = count($newToppers); $i < count($existingToppers); $i++) {
            if (isset($existingToppers[$i]['photo'])) {
                Storage::disk('public')->delete($existingToppers[$i]['photo']);
            }
        }

        return $result;
    }

    /**
     * Delete topper photos
     */
    private function deleteTopperPhotos(array $toppers): void
    {
        foreach ($toppers as $topper) {
            if (isset($topper['photo']) && $topper['photo']) {
                Storage::disk('public')->delete($topper['photo']);
            }
        }
    }

    /**
     * Format toppers for edit form
     */
    private function formatToppersForEdit(?array $toppers): array
    {
        if (!$toppers) {
            return [];
        }

        return array_map(function ($topper) {
            return [
                'name' => $topper['name'] ?? '',
                'percentage' => $topper['percentage'] ?? null,
                'photo' => $topper['photo'] ?? null,
                'photo_url' => isset($topper['photo']) && $topper['photo'] 
                    ? asset('storage/' . $topper['photo']) 
                    : null,
                'rank' => $topper['rank'] ?? null,
            ];
        }, $toppers);
    }
}
