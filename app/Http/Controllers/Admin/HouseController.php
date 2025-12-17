<?php

namespace App\Http\Controllers\Admin;

use App\Models\House;
use App\Models\HouseLeader;
use App\Models\HousePoint;
use App\Models\HouseTeacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class HouseController extends AdminResourceController
{
    protected string $model = House::class;
    protected string $pagePrefix = 'admin/houses';
    protected string $resourceName = 'House';
    protected array $searchFields = ['name', 'motto', 'description'];

    /**
     * Display a listing of houses.
     */
    public function index(Request $request): Response
    {
        $currentYear = date('Y');
        
        $query = House::withSum(['points as total_points' => function ($q) use ($currentYear) {
            $q->where('academic_year', $currentYear);
        }], 'points');

        // Apply search filter
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('motto', 'like', "%{$search}%");
            });
        }

        // Apply sorting
        $sortField = $request->get('sort', 'order');
        $sortDirection = $request->get('direction', 'asc');
        $query->orderBy($sortField, $sortDirection);

        $items = $query->get();
        
        // Get recent points for display
        $recentPoints = HousePoint::with('house')
            ->where('academic_year', $currentYear)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($point) {
                return [
                    'id' => $point->id,
                    'house_id' => $point->house_id,
                    'house_name' => $point->house->name,
                    'house_color' => $point->house->color,
                    'event_name' => $point->event_name,
                    'category' => $point->category,
                    'points' => $point->points,
                    'event_date' => $point->event_date?->format('M d, Y'),
                    'remarks' => $point->remarks,
                ];
            });

        return Inertia::render('admin/houses/index', [
            'items' => $items,
            'recentPoints' => $recentPoints,
            'filters' => $request->only(['search', 'sort', 'direction']),
        ]);
    }

    /**
     * Show the form for creating a new house.
     */
    public function create(): Response
    {
        return Inertia::render('admin/houses/create');
    }

    /**
     * Store a newly created house in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:houses,slug',
            'color' => 'required|string|max:7',
            'motto' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:2000',
            'house_master' => 'nullable|string|max:255',
            'house_master_designation' => 'nullable|string|max:255',
            'house_master_photo' => 'nullable|image|max:2048',
            'logo' => 'nullable|image|max:2048',
            'image' => 'nullable|image|max:2048',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
            // Captain & Vice Captain fields
            'captain_name' => 'nullable|string|max:255',
            'captain_class' => 'nullable|string|max:50',
            'captain_photo' => 'nullable|image|max:2048',
            'vice_captain_name' => 'nullable|string|max:255',
            'vice_captain_class' => 'nullable|string|max:50',
            'vice_captain_photo' => 'nullable|image|max:2048',
            // Teachers array
            'teachers' => 'nullable',
            // Prefects array
            'prefects' => 'nullable',
        ]);

        // Generate slug if not provided
        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['name']);

        // Handle image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')
                ->store('houses', 'public');
        }
        
        // Handle logo upload
        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')
                ->store('house-logos', 'public');
        }

        // Handle house master photo upload
        if ($request->hasFile('house_master_photo')) {
            $validated['house_master_photo'] = $request->file('house_master_photo')
                ->store('house-masters', 'public');
        }

        // Set defaults
        $validated['is_active'] = $validated['is_active'] ?? true;
        $validated['order'] = $validated['order'] ?? House::max('order') + 1;

        // Remove leader/teacher/prefect fields from house data
        $excludeFields = ['captain_name', 'captain_class', 'captain_photo', 'vice_captain_name', 'vice_captain_class', 'vice_captain_photo', 'teachers', 'prefects'];
        $houseData = array_diff_key($validated, array_flip($excludeFields));

        $house = House::create($houseData);
        
        $currentYear = date('Y');
        
        // Save captain if provided
        if (!empty($request->captain_name)) {
            $captainPhoto = null;
            if ($request->hasFile('captain_photo')) {
                $captainPhoto = $request->file('captain_photo')->store('house-leaders', 'public');
            }
            HouseLeader::create([
                'house_id' => $house->id,
                'student_name' => $request->captain_name,
                'class' => $request->captain_class ?? '',
                'photo' => $captainPhoto,
                'position' => 'captain',
                'academic_year' => $currentYear,
                'is_active' => true,
            ]);
        }
        
        // Save vice captain if provided
        if (!empty($request->vice_captain_name)) {
            $viceCaptainPhoto = null;
            if ($request->hasFile('vice_captain_photo')) {
                $viceCaptainPhoto = $request->file('vice_captain_photo')->store('house-leaders', 'public');
            }
            HouseLeader::create([
                'house_id' => $house->id,
                'student_name' => $request->vice_captain_name,
                'class' => $request->vice_captain_class ?? '',
                'photo' => $viceCaptainPhoto,
                'position' => 'vice_captain',
                'academic_year' => $currentYear,
                'is_active' => true,
            ]);
        }
        
        // Save teachers if provided
        $teachers = $request->input('teachers', []);
        if (is_string($teachers)) {
            $teachers = json_decode($teachers, true) ?? [];
        }
        foreach ($teachers as $index => $teacher) {
            if (!empty($teacher['name'])) {
                HouseTeacher::create([
                    'house_id' => $house->id,
                    'name' => $teacher['name'],
                    'designation' => $teacher['designation'] ?? null,
                    'order' => $index,
                    'is_active' => true,
                ]);
            }
        }
        
        // Save prefects if provided
        $prefects = $request->input('prefects', []);
        if (is_string($prefects)) {
            $prefects = json_decode($prefects, true) ?? [];
        }
        foreach ($prefects as $prefect) {
            if (!empty($prefect['name'])) {
                HouseLeader::create([
                    'house_id' => $house->id,
                    'student_name' => $prefect['name'],
                    'class' => $prefect['class'] ?? '',
                    'position' => 'prefect',
                    'academic_year' => $currentYear,
                    'is_active' => true,
                ]);
            }
        }
        
        $this->logAudit('created', $house);

        return redirect()
            ->route('admin.houses.index')
            ->with('success', 'House created successfully.');
    }

    /**
     * Show the form for editing the specified house.
     */
    public function edit(int $id): Response
    {
        $item = House::findOrFail($id);
        $currentYear = date('Y');
        
        // Load captain and vice_captain for current year
        $captain = HouseLeader::where('house_id', $id)
            ->where('position', 'captain')
            ->where('academic_year', $currentYear)
            ->where('is_active', true)
            ->first();
            
        $viceCaptain = HouseLeader::where('house_id', $id)
            ->where('position', 'vice_captain')
            ->where('academic_year', $currentYear)
            ->where('is_active', true)
            ->first();
            
        // Load prefects for current year
        $prefects = HouseLeader::where('house_id', $id)
            ->where('position', 'prefect')
            ->where('academic_year', $currentYear)
            ->where('is_active', true)
            ->orderBy('id')
            ->get()
            ->map(function ($prefect) {
                return [
                    'id' => $prefect->id,
                    'name' => $prefect->student_name,
                    'class' => $prefect->class,
                ];
            });
            
        // Load teachers
        $teachers = HouseTeacher::where('house_id', $id)
            ->where('is_active', true)
            ->orderBy('order')
            ->get()
            ->map(function ($teacher) {
                return [
                    'id' => $teacher->id,
                    'name' => $teacher->name,
                    'designation' => $teacher->designation,
                ];
            });
            
        // Load points history
        $pointsHistory = HousePoint::where('house_id', $id)
            ->where('academic_year', $currentYear)
            ->orderBy('event_date', 'desc')
            ->limit(20)
            ->get()
            ->map(function ($point) {
                return [
                    'id' => $point->id,
                    'event_name' => $point->event_name,
                    'category' => $point->category,
                    'points' => $point->points,
                    'event_date' => $point->event_date?->format('Y-m-d'),
                    'remarks' => $point->remarks,
                ];
            });

        return Inertia::render('admin/houses/edit', [
            'item' => $item,
            'captain' => $captain ? [
                'id' => $captain->id,
                'student_name' => $captain->student_name,
                'class' => $captain->class,
                'photo' => $captain->photo,
            ] : null,
            'viceCaptain' => $viceCaptain ? [
                'id' => $viceCaptain->id,
                'student_name' => $viceCaptain->student_name,
                'class' => $viceCaptain->class,
                'photo' => $viceCaptain->photo,
            ] : null,
            'prefects' => $prefects,
            'teachers' => $teachers,
            'pointsHistory' => $pointsHistory,
        ]);
    }

    /**
     * Update the specified house in storage.
     */
    public function update(Request $request, int $id)
    {
        $house = House::findOrFail($id);
        $oldData = $house->toArray();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:houses,slug,' . $house->id,
            'color' => 'required|string|max:7',
            'motto' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:2000',
            'house_master' => 'nullable|string|max:255',
            'house_master_designation' => 'nullable|string|max:255',
            'house_master_photo' => 'nullable|image|max:2048',
            'logo' => 'nullable|image|max:2048',
            'image' => 'nullable|image|max:2048',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
            // Captain & Vice Captain fields
            'captain_name' => 'nullable|string|max:255',
            'captain_class' => 'nullable|string|max:50',
            'captain_photo' => 'nullable|image|max:2048',
            'vice_captain_name' => 'nullable|string|max:255',
            'vice_captain_class' => 'nullable|string|max:50',
            'vice_captain_photo' => 'nullable|image|max:2048',
            // Teachers array
            'teachers' => 'nullable',
            // Prefects array
            'prefects' => 'nullable',
        ]);

        // Generate slug if changed
        if ($validated['name'] !== $house->name && !$validated['slug']) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            if ($house->image) {
                Storage::disk('public')->delete($house->image);
            }
            $validated['image'] = $request->file('image')
                ->store('houses', 'public');
        }
        
        // Handle logo upload
        if ($request->hasFile('logo')) {
            if ($house->logo) {
                Storage::disk('public')->delete($house->logo);
            }
            $validated['logo'] = $request->file('logo')
                ->store('house-logos', 'public');
        }

        // Handle house master photo upload
        if ($request->hasFile('house_master_photo')) {
            if ($house->house_master_photo) {
                Storage::disk('public')->delete($house->house_master_photo);
            }
            $validated['house_master_photo'] = $request->file('house_master_photo')
                ->store('house-masters', 'public');
        }

        // Handle photo removal
        if ($request->boolean('remove_image') && $house->image) {
            Storage::disk('public')->delete($house->image);
            $validated['image'] = null;
        }
        
        if ($request->boolean('remove_logo') && $house->logo) {
            Storage::disk('public')->delete($house->logo);
            $validated['logo'] = null;
        }

        if ($request->boolean('remove_house_master_photo') && $house->house_master_photo) {
            Storage::disk('public')->delete($house->house_master_photo);
            $validated['house_master_photo'] = null;
        }

        // Remove leader/teacher/prefect fields from house data
        $excludeFields = ['captain_name', 'captain_class', 'captain_photo', 'vice_captain_name', 'vice_captain_class', 'vice_captain_photo', 'teachers', 'prefects'];
        $houseData = array_diff_key($validated, array_flip($excludeFields));

        $house->update($houseData);

        $currentYear = date('Y');

        // Handle captain
        $existingCaptain = HouseLeader::where('house_id', $id)
            ->where('position', 'captain')
            ->where('academic_year', $currentYear)
            ->first();
            
        if (!empty($request->captain_name)) {
            $captainData = [
                'student_name' => $request->captain_name,
                'class' => $request->captain_class ?? '',
                'is_active' => true,
            ];
            
            if ($request->hasFile('captain_photo')) {
                if ($existingCaptain && $existingCaptain->photo) {
                    Storage::disk('public')->delete($existingCaptain->photo);
                }
                $captainData['photo'] = $request->file('captain_photo')->store('house-leaders', 'public');
            }
            
            if ($request->boolean('remove_captain_photo') && $existingCaptain && $existingCaptain->photo) {
                Storage::disk('public')->delete($existingCaptain->photo);
                $captainData['photo'] = null;
            }
            
            if ($existingCaptain) {
                $existingCaptain->update($captainData);
            } else {
                $captainData['house_id'] = $house->id;
                $captainData['position'] = 'captain';
                $captainData['academic_year'] = $currentYear;
                HouseLeader::create($captainData);
            }
        } elseif ($existingCaptain) {
            if ($existingCaptain->photo) {
                Storage::disk('public')->delete($existingCaptain->photo);
            }
            $existingCaptain->delete();
        }
        
        // Handle vice captain
        $existingViceCaptain = HouseLeader::where('house_id', $id)
            ->where('position', 'vice_captain')
            ->where('academic_year', $currentYear)
            ->first();
            
        if (!empty($request->vice_captain_name)) {
            $viceCaptainData = [
                'student_name' => $request->vice_captain_name,
                'class' => $request->vice_captain_class ?? '',
                'is_active' => true,
            ];
            
            if ($request->hasFile('vice_captain_photo')) {
                if ($existingViceCaptain && $existingViceCaptain->photo) {
                    Storage::disk('public')->delete($existingViceCaptain->photo);
                }
                $viceCaptainData['photo'] = $request->file('vice_captain_photo')->store('house-leaders', 'public');
            }
            
            if ($request->boolean('remove_vice_captain_photo') && $existingViceCaptain && $existingViceCaptain->photo) {
                Storage::disk('public')->delete($existingViceCaptain->photo);
                $viceCaptainData['photo'] = null;
            }
            
            if ($existingViceCaptain) {
                $existingViceCaptain->update($viceCaptainData);
            } else {
                $viceCaptainData['house_id'] = $house->id;
                $viceCaptainData['position'] = 'vice_captain';
                $viceCaptainData['academic_year'] = $currentYear;
                HouseLeader::create($viceCaptainData);
            }
        } elseif ($existingViceCaptain) {
            if ($existingViceCaptain->photo) {
                Storage::disk('public')->delete($existingViceCaptain->photo);
            }
            $existingViceCaptain->delete();
        }
        
        // Handle teachers - Replace all existing teachers with the new list
        $teachers = $request->input('teachers', []);
        if (is_string($teachers)) {
            $teachers = json_decode($teachers, true) ?? [];
        }
        
        // Delete existing teachers
        HouseTeacher::where('house_id', $id)->delete();
        
        // Create new teachers
        foreach ($teachers as $index => $teacher) {
            if (!empty($teacher['name'])) {
                HouseTeacher::create([
                    'house_id' => $house->id,
                    'name' => $teacher['name'],
                    'designation' => $teacher['designation'] ?? null,
                    'order' => $index,
                    'is_active' => true,
                ]);
            }
        }
        
        // Handle prefects - Replace all existing prefects with the new list
        $prefects = $request->input('prefects', []);
        if (is_string($prefects)) {
            $prefects = json_decode($prefects, true) ?? [];
        }
        
        // Delete existing prefects for current year
        HouseLeader::where('house_id', $id)
            ->where('position', 'prefect')
            ->where('academic_year', $currentYear)
            ->delete();
        
        // Create new prefects
        foreach ($prefects as $prefect) {
            if (!empty($prefect['name'])) {
                HouseLeader::create([
                    'house_id' => $house->id,
                    'student_name' => $prefect['name'],
                    'class' => $prefect['class'] ?? '',
                    'position' => 'prefect',
                    'academic_year' => $currentYear,
                    'is_active' => true,
                ]);
            }
        }

        $this->logAudit('updated', $house, $oldData);

        return redirect()
            ->route('admin.houses.index')
            ->with('success', 'House updated successfully.');
    }

    /**
     * Remove the specified house from storage.
     */
    public function destroy(int $id)
    {
        $house = House::findOrFail($id);

        // Delete image
        if ($house->image) {
            Storage::disk('public')->delete($house->image);
        }
        
        // Delete logo
        if ($house->logo) {
            Storage::disk('public')->delete($house->logo);
        }
        
        // Delete house master photo
        if ($house->house_master_photo) {
            Storage::disk('public')->delete($house->house_master_photo);
        }
        
        // Delete leader photos
        $leaders = HouseLeader::where('house_id', $id)->get();
        foreach ($leaders as $leader) {
            if ($leader->photo) {
                Storage::disk('public')->delete($leader->photo);
            }
        }

        $this->logAudit('deleted', $house);
        
        $house->delete();

        return redirect()
            ->route('admin.houses.index')
            ->with('success', 'House deleted successfully.');
    }

    /**
     * Toggle house active status.
     */
    public function toggleActive(int $id)
    {
        $house = House::findOrFail($id);
        $house->update(['is_active' => !$house->is_active]);

        return back()->with('success', 'House status updated.');
    }

    /**
     * Add points to a house.
     */
    public function addPoints(Request $request, int $id)
    {
        $house = House::findOrFail($id);

        $validated = $request->validate([
            'points' => 'required|integer',
            'category' => 'required|string|in:sports,academics,cultural,discipline,other',
            'event_name' => 'required|string|max:255',
            'remarks' => 'nullable|string|max:500',
            'event_date' => 'nullable|date',
        ]);

        $house->points()->create([
            'points' => $validated['points'],
            'category' => $validated['category'],
            'event_name' => $validated['event_name'],
            'remarks' => $validated['remarks'] ?? null,
            'event_date' => $validated['event_date'] ?? now(),
            'academic_year' => date('Y'),
            'awarded_by' => Auth::id(),
        ]);

        return back()->with('success', 'Points added successfully.');
    }
    
    /**
     * Delete a house point entry.
     */
    public function deletePoint(int $id, int $pointId)
    {
        $point = HousePoint::where('house_id', $id)->findOrFail($pointId);
        $point->delete();
        
        return back()->with('success', 'Points deleted successfully.');
    }
}
