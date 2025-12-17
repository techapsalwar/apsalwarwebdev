<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\AlumniApprovedMail;
use App\Mail\AlumniRejectedMail;
use App\Models\Alumni;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AlumniController extends Controller
{
    /**
     * Display alumni list with filters
     */
    public function index(Request $request): Response
    {
        $query = Alumni::query()->with('approvedByUser');

        // Filter by approval status
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('approval_status', $request->status);
        }

        // Filter by email verification
        if ($request->filled('verified')) {
            if ($request->verified === 'yes') {
                $query->whereNotNull('email_verified_at');
            } else {
                $query->whereNull('email_verified_at');
            }
        }

        // Filter by category
        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        // Filter by batch year
        if ($request->filled('batch')) {
            $query->where('batch_year', $request->batch);
        }

        // Search
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('email', 'like', '%' . $request->search . '%')
                    ->orWhere('organization', 'like', '%' . $request->search . '%');
            });
        }

        $alumni = $query->latest()
            ->paginate(15)
            ->withQueryString();

        // Get statistics
        $stats = [
            'total' => Alumni::count(),
            'pending' => Alumni::pending()->count(),
            'approved' => Alumni::approved()->count(),
            'rejected' => Alumni::rejected()->count(),
            'unverified' => Alumni::whereNull('email_verified_at')->count(),
        ];

        // Get batch years for filter
        $batchYears = Alumni::whereNotNull('batch_year')
            ->distinct()
            ->orderByDesc('batch_year')
            ->pluck('batch_year')
            ->toArray();

        return Inertia::render('admin/alumni/index', [
            'alumni' => $alumni,
            'stats' => $stats,
            'batchYears' => $batchYears,
            'categories' => Alumni::getCategoryOptions(),
            'filters' => [
                'status' => $request->status ?? 'all',
                'verified' => $request->verified ?? 'all',
                'category' => $request->category ?? 'all',
                'batch' => $request->batch,
                'search' => $request->search,
            ],
        ]);
    }

    /**
     * Show alumni details
     */
    public function show(Alumni $alumnus): Response
    {
        $alumnus->load('approvedByUser');

        return Inertia::render('admin/alumni/show', [
            'alumnus' => $alumnus,
            'categories' => Alumni::getCategoryOptions(),
        ]);
    }

    /**
     * Show edit form
     */
    public function edit(Alumni $alumnus): Response
    {
        return Inertia::render('admin/alumni/edit', [
            'alumnus' => $alumnus,
            'categories' => Alumni::getCategoryOptions(),
            'houses' => [
                'prithviraj' => 'Prithviraj House (Red)',
                'shivaji' => 'Shivaji House (Blue)',
                'ashoka' => 'Ashoka House (Green)',
                'ranjit' => 'Ranjit House (Yellow)',
            ],
        ]);
    }

    /**
     * Update alumni
     */
    public function update(Request $request, Alumni $alumnus)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:alumni,email,' . $alumnus->id],
            'phone' => ['nullable', 'string', 'max:20'],
            'batch_year' => ['required', 'string', 'max:10'],
            'class_section' => ['nullable', 'string', 'max:50'],
            'house' => ['nullable', 'string', 'max:50'],
            'category' => ['required', 'string'],
            'current_designation' => ['nullable', 'string', 'max:255'],
            'organization' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'achievement' => ['nullable', 'string', 'max:1000'],
            'story' => ['nullable', 'string', 'max:5000'],
            'school_memories' => ['nullable', 'string', 'max:2000'],
            'message_to_juniors' => ['nullable', 'string', 'max:1000'],
            'linkedin_url' => ['nullable', 'url', 'max:255'],
            'is_featured' => ['boolean'],
            'is_active' => ['boolean'],
            'photo' => ['nullable', 'image', 'max:2048'],
        ]);

        // Handle photo upload
        if ($request->hasFile('photo')) {
            // Delete old photo
            if ($alumnus->photo) {
                Storage::disk('public')->delete($alumnus->photo);
            }
            $validated['photo'] = $request->file('photo')->store('alumni/photos', 'public');
        }

        $alumnus->update($validated);

        return redirect()->route('admin.alumni.show', $alumnus)
            ->with('success', 'Alumni profile updated successfully.');
    }

    /**
     * Approve alumni registration
     */
    public function approve(Request $request, Alumni $alumnus)
    {
        if (!$alumnus->email_verified_at) {
            return back()->with('error', 'Cannot approve: Email is not verified yet.');
        }

        $alumnus->approve(auth()->id());

        // Send approval email
        try {
            Mail::to($alumnus->email)->send(new AlumniApprovedMail($alumnus));
        } catch (\Exception $e) {
            \Log::error('Failed to send alumni approval email', [
                'alumni_id' => $alumnus->id,
                'error' => $e->getMessage(),
            ]);
        }

        return back()->with('success', "Alumni '{$alumnus->name}' has been approved and notified.");
    }

    /**
     * Reject alumni registration
     */
    public function reject(Request $request, Alumni $alumnus)
    {
        $validated = $request->validate([
            'reason' => ['nullable', 'string', 'max:500'],
        ]);

        $alumnus->reject(auth()->id(), $validated['reason'] ?? null);

        // Send rejection email
        try {
            Mail::to($alumnus->email)->send(new AlumniRejectedMail($alumnus));
        } catch (\Exception $e) {
            \Log::error('Failed to send alumni rejection email', [
                'alumni_id' => $alumnus->id,
                'error' => $e->getMessage(),
            ]);
        }

        return back()->with('success', "Alumni '{$alumnus->name}' has been rejected and notified.");
    }

    /**
     * Toggle featured status
     */
    public function toggleFeatured(Alumni $alumnus)
    {
        $alumnus->update(['is_featured' => !$alumnus->is_featured]);

        $status = $alumnus->is_featured ? 'featured' : 'unfeatured';
        return back()->with('success', "Alumni '{$alumnus->name}' has been {$status}.");
    }

    /**
     * Delete alumni
     */
    public function destroy(Alumni $alumnus)
    {
        // Delete photo if exists
        if ($alumnus->photo) {
            Storage::disk('public')->delete($alumnus->photo);
        }

        $name = $alumnus->name;
        $alumnus->delete();

        return redirect()->route('admin.alumni.index')
            ->with('success', "Alumni '{$name}' has been deleted.");
    }

    /**
     * Bulk approve selected alumni
     */
    public function bulkApprove(Request $request)
    {
        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['exists:alumni,id'],
        ]);

        $approved = 0;
        $skipped = 0;
        
        foreach ($validated['ids'] as $id) {
            $alumni = Alumni::find($id);
            if ($alumni && $alumni->approval_status === 'pending') {
                // Skip unverified emails but count them
                if (!$alumni->email_verified_at) {
                    $skipped++;
                    continue;
                }
                
                $alumni->approve(auth()->id());
                
                try {
                    Mail::to($alumni->email)->send(new AlumniApprovedMail($alumni));
                } catch (\Exception $e) {
                    \Log::error('Failed to send bulk approval email', ['alumni_id' => $id]);
                }
                
                $approved++;
            }
        }

        $message = "{$approved} alumni approved successfully.";
        if ($skipped > 0) {
            $message .= " {$skipped} skipped (email not verified).";
        }
        
        return back()->with('success', $message);
    }

    /**
     * Manually verify email from admin panel
     */
    public function verifyEmail(Alumni $alumnus)
    {
        if ($alumnus->email_verified_at) {
            return back()->with('info', 'Email is already verified.');
        }

        $alumnus->markEmailAsVerified();

        return back()->with('success', "Email for '{$alumnus->name}' has been manually verified.");
    }

    /**
     * Resend verification email from admin panel
     */
    public function resendVerification(Alumni $alumnus)
    {
        if ($alumnus->email_verified_at) {
            return back()->with('info', 'Email is already verified.');
        }

        // Generate new token
        $alumnus->update([
            'verification_token' => \Illuminate\Support\Str::random(64),
        ]);

        // Send verification email
        try {
            Mail::to($alumnus->email)->send(new \App\Mail\AlumniVerificationMail($alumnus));
            return back()->with('success', "Verification email resent to '{$alumnus->email}'.");
        } catch (\Exception $e) {
            \Log::error('Failed to resend verification email', [
                'alumni_id' => $alumnus->id,
                'error' => $e->getMessage(),
            ]);
            return back()->with('error', 'Failed to send verification email. Please try again.');
        }
    }
}
