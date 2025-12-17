<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Club;
use App\Models\ClubMember;
use App\Exports\ClubEnrollmentsExport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ClubController extends Controller
{
    public function index(Request $request)
    {
        $query = Club::query()
            ->withCount('members');

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('in_charge', 'like', "%{$search}%");
            });
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        $clubs = $query->orderBy('order')->paginate(15)->withQueryString();

        return Inertia::render('admin/clubs/index', [
            'clubs' => $clubs,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/clubs/create', [
            'icons' => $this->getAvailableIcons(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:clubs',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'icon' => 'nullable|string|max:100',
            'in_charge' => 'nullable|string|max:255',
            'meeting_schedule' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'accepts_enrollment' => 'boolean',
        ]);

        // Generate slug
        $validated['slug'] = Str::slug($validated['name']);

        // Handle image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('clubs', 'public');
        }

        // Set order
        $validated['order'] = Club::max('order') + 1;

        Club::create($validated);

        return redirect()->route('admin.clubs.index')
            ->with('success', 'Club created successfully.');
    }

    public function edit(Club $club)
    {
        return Inertia::render('admin/clubs/edit', [
            'club' => $club,
            'icons' => $this->getAvailableIcons(),
        ]);
    }

    public function update(Request $request, Club $club)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:clubs,name,' . $club->id,
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'icon' => 'nullable|string|max:100',
            'in_charge' => 'nullable|string|max:255',
            'meeting_schedule' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'accepts_enrollment' => 'boolean',
        ]);

        // Generate slug if name changed
        if ($club->name !== $validated['name']) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image
            if ($club->image) {
                Storage::disk('public')->delete($club->image);
            }
            $validated['image'] = $request->file('image')->store('clubs', 'public');
        }

        $club->update($validated);

        return redirect()->route('admin.clubs.index')
            ->with('success', 'Club updated successfully.');
    }

    public function destroy(Club $club)
    {
        // Delete image
        if ($club->image) {
            Storage::disk('public')->delete($club->image);
        }

        $club->delete();

        return redirect()->route('admin.clubs.index')
            ->with('success', 'Club deleted successfully.');
    }

    public function toggleActive(Club $club)
    {
        $club->update(['is_active' => !$club->is_active]);

        return back()->with('success', 'Club status updated.');
    }

    public function toggleEnrollment(Club $club)
    {
        $club->update(['accepts_enrollment' => !$club->accepts_enrollment]);

        return back()->with('success', 'Enrollment status updated.');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:clubs,id',
            'items.*.order' => 'required|integer|min:0',
        ]);

        foreach ($request->items as $item) {
            Club::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return back()->with('success', 'Clubs reordered successfully.');
    }

    /**
     * Display club enrollments management page
     */
    public function enrollments(Request $request)
    {
        $currentYear = date('Y');
        
        $query = ClubMember::with('club')
            ->where('academic_year', $currentYear);

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('student_name', 'like', "%{$search}%")
                    ->orWhere('admission_number', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Club filter
        if ($request->filled('club_id')) {
            $query->where('club_id', $request->club_id);
        }

        $enrollments = $query->orderByDesc('created_at')->paginate(20)->withQueryString();

        // Get clubs for filter dropdown
        $clubs = Club::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'category']);

        // Statistics
        $statistics = [
            'total' => ClubMember::where('academic_year', $currentYear)->count(),
            'pending' => ClubMember::where('academic_year', $currentYear)->where('status', 'pending')->count(),
            'approved' => ClubMember::where('academic_year', $currentYear)->where('status', 'approved')->count(),
            'rejected' => ClubMember::where('academic_year', $currentYear)->where('status', 'rejected')->count(),
        ];

        return Inertia::render('admin/clubs/enrollments', [
            'enrollments' => $enrollments,
            'clubs' => $clubs,
            'statistics' => $statistics,
            'filters' => $request->only(['search', 'status', 'club_id']),
        ]);
    }

    /**
     * Approve club enrollment
     */
    public function approveEnrollment(ClubMember $enrollment)
    {
        $enrollment->approve();

        return back()->with('success', "{$enrollment->student_name}'s enrollment has been approved.");
    }

    /**
     * Reject club enrollment
     */
    public function rejectEnrollment(ClubMember $enrollment)
    {
        $enrollment->reject();

        return back()->with('success', "{$enrollment->student_name}'s enrollment has been rejected.");
    }

    /**
     * Bulk approve multiple club enrollments
     */
    public function bulkApproveEnrollments(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'required|integer|exists:club_members,id',
        ]);

        $count = 0;
        foreach ($validated['ids'] as $id) {
            $enrollment = ClubMember::find($id);
            if ($enrollment && $enrollment->status === 'pending') {
                $enrollment->approve();
                $count++;
            }
        }

        return back()->with('success', "{$count} enrollment(s) have been approved successfully.");
    }

    /**
     * Export club enrollments to Excel
     */
    public function exportEnrollments(Request $request)
    {
        $clubId = $request->filled('club_id') ? (int) $request->club_id : null;
        $status = $request->filled('status') ? $request->status : null;
        
        // Generate filename
        $filename = 'club-enrollments';
        if ($clubId) {
            $club = Club::find($clubId);
            if ($club) {
                $filename .= '-' . Str::slug($club->name);
            }
        }
        if ($status) {
            $filename .= '-' . $status;
        }
        $filename .= '-' . date('Y-m-d') . '.xlsx';
        
        return Excel::download(new ClubEnrollmentsExport($clubId, $status), $filename);
    }

    private function getAvailableIcons(): array
    {
        return [
            'music' => 'Music',
            'drama' => 'Drama / Theatre',
            'art' => 'Art & Craft',
            'science' => 'Science',
            'math' => 'Mathematics',
            'literature' => 'Literary',
            'debate' => 'Debate',
            'quiz' => 'Quiz',
            'eco' => 'Eco Club',
            'heritage' => 'Heritage',
            'yoga' => 'Yoga',
            'sports' => 'Sports',
            'photography' => 'Photography',
            'coding' => 'Coding / Robotics',
            'other' => 'Other',
        ];
    }
}
