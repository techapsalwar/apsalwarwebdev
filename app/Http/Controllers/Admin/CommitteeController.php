<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Committee;
use App\Models\CommitteeMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CommitteeController extends Controller
{
    public function index(Request $request)
    {
        $query = Committee::with(['members' => function ($q) {
            $q->orderBy('order');
        }]);

        // Search
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by type
        if ($type = $request->input('type')) {
            $query->where('type', $type);
        }

        // Filter by status
        if ($request->has('active')) {
            $query->where('is_active', $request->boolean('active'));
        }

        $committees = $query
            ->orderBy('order')
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/committees/index', [
            'committees' => [
                'data' => $committees->items(),
                'meta' => [
                    'current_page' => $committees->currentPage(),
                    'last_page' => $committees->lastPage(),
                    'per_page' => $committees->perPage(),
                    'total' => $committees->total(),
                ],
                'links' => [
                    'prev' => $committees->previousPageUrl(),
                    'next' => $committees->nextPageUrl(),
                ],
            ],
            'filters' => [
                'search' => $request->input('search', ''),
                'type' => $request->input('type', ''),
                'active' => $request->input('active', ''),
            ],
            'types' => Committee::getTypeOptions(),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/committees/create', [
            'types' => Committee::getTypeOptions(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:' . implode(',', array_keys(Committee::TYPES)),
            'description' => 'nullable|string',
            'functions' => 'nullable|string',
            'session' => 'nullable|string|max:50',
            'image' => 'nullable|image|max:2048',
            'order' => 'integer|min:0',
            'is_active' => 'boolean',
            // Members array validation
            'members' => 'nullable|array',
            'members.*.name' => 'required|string|max:255',
            'members.*.designation' => 'required|string|max:255',
            'members.*.role' => 'nullable|string|max:255',
            'members.*.email' => 'nullable|email|max:255',
            'members.*.phone' => 'nullable|string|max:50',
            'members.*.organization' => 'nullable|string|max:255',
            'members.*.bio' => 'nullable|string',
            'members.*.order' => 'nullable|integer|min:0',
            'members.*.photo' => 'nullable|image|max:2048',
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        $validated['is_active'] = $request->boolean('is_active');

        // Convert functions from newline-separated string to array
        if (!empty($validated['functions'])) {
            $validated['functions'] = array_filter(
                array_map('trim', explode("\n", $validated['functions']))
            );
        }

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('committees', 'public');
        }

        $committee = Committee::create($validated);

        // Create members if provided
        if ($request->has('members')) {
            foreach ($request->input('members', []) as $index => $memberData) {
                $photoPath = null;
                if ($request->hasFile("members.{$index}.photo")) {
                    $photoPath = $request->file("members.{$index}.photo")->store('committee-members', 'public');
                }

                $committee->members()->create([
                    'name' => $memberData['name'],
                    'designation' => $memberData['designation'],
                    'role' => $memberData['role'] ?? null,
                    'email' => $memberData['email'] ?? null,
                    'phone' => $memberData['phone'] ?? null,
                    'organization' => $memberData['organization'] ?? null,
                    'bio' => $memberData['bio'] ?? null,
                    'order' => $memberData['order'] ?? $index,
                    'photo' => $photoPath,
                    'is_active' => true,
                ]);
            }
        }

        return redirect()->route('admin.committees.index')
            ->with('success', 'Committee created successfully.');
    }

    public function edit(int $committee)
    {
        $committee = Committee::with(['members' => function ($q) {
            $q->orderBy('order');
        }])->findOrFail($committee);

        return Inertia::render('admin/committees/edit', [
            'committee' => $committee,
            'types' => Committee::getTypeOptions(),
        ]);
    }

    public function update(Request $request, int $committee)
    {
        $committeeModel = Committee::findOrFail($committee);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:' . implode(',', array_keys(Committee::TYPES)),
            'description' => 'nullable|string',
            'functions' => 'nullable|string',
            'session' => 'nullable|string|max:50',
            'image' => 'nullable|image|max:2048',
            'order' => 'integer|min:0',
            'is_active' => 'boolean',
        ]);

        $validated['is_active'] = $request->boolean('is_active');

        // Convert functions from newline-separated string to array
        if (!empty($validated['functions'])) {
            $validated['functions'] = array_filter(
                array_map('trim', explode("\n", $validated['functions']))
            );
        } else {
            $validated['functions'] = null;
        }

        if ($request->hasFile('image')) {
            if ($committeeModel->image) {
                Storage::disk('public')->delete($committeeModel->image);
            }
            $validated['image'] = $request->file('image')->store('committees', 'public');
        } elseif ($request->boolean('remove_image')) {
            if ($committeeModel->image) {
                Storage::disk('public')->delete($committeeModel->image);
            }
            $validated['image'] = null;
        }

        $committeeModel->update($validated);

        return redirect()->route('admin.committees.index')
            ->with('success', 'Committee updated successfully.');
    }

    public function destroy(int $committee)
    {
        $committeeModel = Committee::findOrFail($committee);

        if ($committeeModel->image) {
            Storage::disk('public')->delete($committeeModel->image);
        }

        // Delete member photos
        foreach ($committeeModel->members as $member) {
            if ($member->photo) {
                Storage::disk('public')->delete($member->photo);
            }
        }

        $committeeModel->delete();

        return redirect()->route('admin.committees.index')
            ->with('success', 'Committee deleted successfully.');
    }

    public function toggleActive(int $committee)
    {
        $committeeModel = Committee::findOrFail($committee);
        $committeeModel->update(['is_active' => !$committeeModel->is_active]);

        return back()->with('success', 'Committee status updated.');
    }

    // Member management methods
    public function storeMember(Request $request, int $committee)
    {
        $committeeModel = Committee::findOrFail($committee);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'designation' => 'required|string|max:255',
            'role' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'photo' => 'nullable|image|max:2048',
            'bio' => 'nullable|string',
            'organization' => 'nullable|string|max:255',
            'order' => 'integer|min:0',
            'is_active' => 'boolean',
        ]);

        $validated['committee_id'] = $committeeModel->id;
        $validated['is_active'] = $request->boolean('is_active', true);

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('committee-members', 'public');
        }

        // Set order to last if not provided
        if (!isset($validated['order'])) {
            $validated['order'] = $committeeModel->members()->max('order') + 1;
        }

        CommitteeMember::create($validated);

        return back()->with('success', 'Member added successfully.');
    }

    public function updateMember(Request $request, int $committee, int $member)
    {
        $committeeModel = Committee::findOrFail($committee);
        $memberModel = $committeeModel->members()->findOrFail($member);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'designation' => 'required|string|max:255',
            'role' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'photo' => 'nullable|image|max:2048',
            'bio' => 'nullable|string',
            'organization' => 'nullable|string|max:255',
            'order' => 'integer|min:0',
            'is_active' => 'boolean',
        ]);

        $validated['is_active'] = $request->boolean('is_active', true);

        if ($request->hasFile('photo')) {
            if ($memberModel->photo) {
                Storage::disk('public')->delete($memberModel->photo);
            }
            $validated['photo'] = $request->file('photo')->store('committee-members', 'public');
        } elseif ($request->boolean('remove_photo')) {
            if ($memberModel->photo) {
                Storage::disk('public')->delete($memberModel->photo);
            }
            $validated['photo'] = null;
        }

        $memberModel->update($validated);

        return back()->with('success', 'Member updated successfully.');
    }

    public function destroyMember(int $committee, int $member)
    {
        $committeeModel = Committee::findOrFail($committee);
        $memberModel = $committeeModel->members()->findOrFail($member);

        if ($memberModel->photo) {
            Storage::disk('public')->delete($memberModel->photo);
        }

        $memberModel->delete();

        return back()->with('success', 'Member removed successfully.');
    }

    public function reorderMembers(Request $request, int $committee)
    {
        $committeeModel = Committee::findOrFail($committee);

        $request->validate([
            'members' => 'required|array',
            'members.*.id' => 'required|exists:committee_members,id',
            'members.*.order' => 'required|integer|min:0',
        ]);

        foreach ($request->members as $item) {
            $committeeModel->members()->where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return back()->with('success', 'Member order updated.');
    }
}
