<?php

namespace App\Http\Controllers;

use App\Mail\AlumniVerificationMail;
use App\Models\Alumni;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AlumniController extends Controller
{
    /**
     * Display the alumni directory
     */
    public function index(Request $request): Response
    {
        $query = Alumni::publicVisible();

        // Filter by category
        if ($request->filled('category') && $request->category !== 'all') {
            $query->byCategory($request->category);
        }

        // Filter by batch year
        if ($request->filled('batch')) {
            $query->byBatch((int) $request->batch);
        }

        // Search by name
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('organization', 'like', '%' . $request->search . '%')
                    ->orWhere('current_designation', 'like', '%' . $request->search . '%');
            });
        }

        $alumni = $query->recent()
            ->orderByDesc('is_featured')
            ->paginate(12)
            ->withQueryString();

        // Get unique batch years for filter
        $batchYears = Alumni::publicVisible()
            ->whereNotNull('batch_year')
            ->distinct()
            ->orderByDesc('batch_year')
            ->pluck('batch_year')
            ->toArray();

        // Get category statistics
        $categoryStats = Alumni::publicVisible()
            ->selectRaw('category, COUNT(*) as count')
            ->groupBy('category')
            ->pluck('count', 'category')
            ->toArray();

        // Get featured alumni for showcase
        $featuredAlumni = Alumni::publicVisible()
            ->featured()
            ->take(4)
            ->get();

        return Inertia::render('alumni/index', [
            'alumni' => $alumni,
            'featuredAlumni' => $featuredAlumni,
            'batchYears' => $batchYears,
            'categories' => Alumni::getCategoryOptions(),
            'categoryStats' => $categoryStats,
            'filters' => [
                'category' => $request->category,
                'batch' => $request->batch,
                'search' => $request->search,
            ],
            'stats' => $this->getAlumniStats(),
        ]);
    }

    /**
     * Display a single alumni profile
     */
    public function show(string $slug): Response
    {
        $alumnus = Alumni::publicVisible()
            ->where('slug', $slug)
            ->firstOrFail();

        // Get related alumni (same category or batch)
        $relatedAlumni = Alumni::publicVisible()
            ->where('id', '!=', $alumnus->id)
            ->where(function ($query) use ($alumnus) {
                $query->where('category', $alumnus->category)
                    ->orWhere('batch_year', $alumnus->batch_year);
            })
            ->take(4)
            ->get();

        return Inertia::render('alumni/show', [
            'alumnus' => $alumnus,
            'relatedAlumni' => $relatedAlumni,
            'categories' => Alumni::getCategoryOptions(),
        ]);
    }

    /**
     * Display the registration form
     */
    public function register(): Response
    {
        return Inertia::render('alumni/register', [
            'categories' => Alumni::getCategoryOptions(),
            'houses' => $this->getHouseOptions(),
            'benefits' => $this->getRegistrationBenefits(),
            'testimonials' => $this->getAlumniTestimonials(),
        ]);
    }

    /**
     * Handle alumni registration
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:alumni,email'],
            'phone' => ['nullable', 'string', 'max:20'],
            'batch_year' => ['required', 'string', 'regex:/^(19|20)\d{2}$/'],
            'class_section' => ['nullable', 'string', 'max:50'],
            'house' => ['nullable', 'string', 'max:50'],
            'category' => ['required', 'string', 'in:defense,civil_services,medical,engineering,business,arts,sports,education,other'],
            'current_designation' => ['nullable', 'string', 'max:255'],
            'organization' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'achievement' => ['nullable', 'string', 'max:1000'],
            'story' => ['nullable', 'string', 'max:5000'],
            'school_memories' => ['nullable', 'string', 'max:2000'],
            'message_to_juniors' => ['nullable', 'string', 'max:1000'],
            'linkedin_url' => ['nullable', 'url', 'max:255'],
            'photo' => ['nullable', 'image', 'max:2048'], // 2MB max
        ], [
            'email.unique' => 'This email is already registered. If you need to update your profile, please contact us.',
            'batch_year.regex' => 'Please enter a valid batch year (e.g., 2015, 2010).',
            'photo.max' => 'Photo must be less than 2MB.',
        ]);

        // Handle photo upload
        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('alumni/photos', 'public');
        }

        // Create alumni record
        $alumni = Alumni::create([
            ...$validated,
            'is_active' => true,
            'approval_status' => 'pending',
        ]);

        // Send verification email
        try {
            Mail::to($alumni->email)->send(new AlumniVerificationMail($alumni));
        } catch (\Exception $e) {
            // Log the error but don't fail the registration
            \Log::error('Failed to send alumni verification email', [
                'alumni_id' => $alumni->id,
                'email' => $alumni->email,
                'error' => $e->getMessage(),
            ]);
        }

        return redirect()->route('alumni.registration-success', ['email' => $alumni->email]);
    }

    /**
     * Show registration success page
     */
    public function registrationSuccess(Request $request): Response
    {
        return Inertia::render('alumni/registration-success', [
            'email' => $request->query('email', ''),
        ]);
    }

    /**
     * Verify alumni email
     */
    public function verify(string $token)
    {
        $alumni = Alumni::where('verification_token', $token)->first();

        if (!$alumni) {
            return Inertia::render('alumni/verify-result', [
                'success' => false,
                'message' => 'Invalid or expired verification link.',
                'type' => 'invalid',
            ]);
        }

        if ($alumni->email_verified_at) {
            return Inertia::render('alumni/verify-result', [
                'success' => true,
                'message' => 'Your email has already been verified.',
                'type' => 'already_verified',
                'alumniName' => $alumni->name,
            ]);
        }

        // Mark email as verified
        $alumni->markEmailAsVerified();

        return Inertia::render('alumni/verify-result', [
            'success' => true,
            'message' => 'Your email has been verified successfully!',
            'type' => 'verified',
            'alumniName' => $alumni->name,
        ]);
    }

    /**
     * Resend verification email
     */
    public function resendVerification(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $alumni = Alumni::where('email', $request->email)
            ->whereNull('email_verified_at')
            ->first();

        if (!$alumni) {
            return back()->with('error', 'Email not found or already verified.');
        }

        // Generate new token
        $alumni->update([
            'verification_token' => Str::random(64),
        ]);

        // Send verification email
        Mail::to($alumni->email)->send(new AlumniVerificationMail($alumni));

        return back()->with('success', 'Verification email has been resent.');
    }

    /**
     * Get alumni statistics
     */
    private function getAlumniStats(): array
    {
        return [
            'total' => Alumni::publicVisible()->count(),
            'defense' => Alumni::publicVisible()->byCategory('defense')->count(),
            'civil_services' => Alumni::publicVisible()->byCategory('civil_services')->count(),
            'batches' => Alumni::publicVisible()->distinct('batch_year')->count('batch_year'),
        ];
    }

    /**
     * Get house options
     */
    private function getHouseOptions(): array
    {
        return [
            'prithviraj' => 'Prithviraj House (Red)',
            'shivaji' => 'Shivaji House (Blue)',
            'ashoka' => 'Ashoka House (Green)',
            'ranjit' => 'Ranjit House (Yellow)',
        ];
    }

    /**
     * Get registration benefits for display
     */
    private function getRegistrationBenefits(): array
    {
        return [
            [
                'icon' => 'users',
                'title' => 'Connect with Old Friends',
                'description' => 'Reconnect with classmates and teachers from your school days.',
            ],
            [
                'icon' => 'calendar',
                'title' => 'Alumni Events',
                'description' => 'Get invited to exclusive alumni meets, reunions, and school events.',
            ],
            [
                'icon' => 'star',
                'title' => 'Inspire Students',
                'description' => 'Your success story will inspire current students to achieve greatness.',
            ],
            [
                'icon' => 'briefcase',
                'title' => 'Professional Network',
                'description' => 'Build professional connections with fellow alumni across industries.',
            ],
            [
                'icon' => 'heart',
                'title' => 'Give Back',
                'description' => 'Participate in mentorship programs and support school initiatives.',
            ],
            [
                'icon' => 'trophy',
                'title' => 'Recognition',
                'description' => 'Get featured on our website and share your achievements with the community.',
            ],
        ];
    }

    /**
     * Get alumni testimonials for registration page
     */
    private function getAlumniTestimonials(): array
    {
        // Try to get real testimonials from approved alumni
        $testimonials = Alumni::publicVisible()
            ->whereNotNull('story')
            ->where('story', '!=', '')
            ->take(3)
            ->get()
            ->map(function ($alumni) {
                return [
                    'name' => $alumni->name,
                    'batch' => $alumni->batch_year,
                    'designation' => $alumni->current_designation,
                    'organization' => $alumni->organization,
                    'quote' => Str::limit($alumni->story, 200),
                    'photo' => $alumni->photo_url,
                ];
            })
            ->toArray();

        // Return default if no real testimonials
        if (empty($testimonials)) {
            return [
                [
                    'name' => 'Join Our Alumni Network',
                    'batch' => '',
                    'designation' => '',
                    'organization' => '',
                    'quote' => 'Be among the first to register and help us build a strong alumni community!',
                    'photo' => null,
                ],
            ];
        }

        return $testimonials;
    }
}
