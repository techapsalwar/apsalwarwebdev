<?php

namespace App\Http\Controllers;

use App\Models\Achievement;
use App\Models\Club;
use App\Models\House;
use App\Models\HouseTeacher;
use App\Models\NccAchievement;
use App\Models\NccCadet;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BeyondAcademicsController extends Controller
{
    /**
     * Display beyond academics landing page
     */
    public function index(): Response
    {
        return Inertia::render('beyond-academics/index', [
            'statistics' => [
                'houses' => House::where('is_active', true)->count() ?: 4,
                'clubs' => Club::where('is_active', true)->count() ?: 12,
                'nccCadets' => NccCadet::where('status', 'active')->count() ?: 150,
                'achievements' => Achievement::count() ?: 50,
            ],
            'highlights' => $this->getHighlights(),
        ]);
    }

    /**
     * Display houses page
     */
    public function houses(): Response
    {
        $currentYear = date('Y');
        
        $houses = House::where('is_active', true)
            ->with(['leaders' => function ($query) use ($currentYear) {
                $query->where('academic_year', $currentYear)
                    ->where('is_active', true)
                    ->orderByRaw("FIELD(position, 'captain', 'vice_captain', 'prefect')");
            }])
            ->withSum(['points as total_points' => function ($query) use ($currentYear) {
                $query->where('academic_year', $currentYear);
            }], 'points')
            ->orderBy('order')
            ->get()
            ->map(function ($house) {
                $leaders = $house->leaders;
                $captain = $leaders->firstWhere('position', 'captain');
                $viceCaptain = $leaders->firstWhere('position', 'vice_captain');
                $prefects = $leaders->where('position', 'prefect')->values();
                
                return [
                    'id' => $house->id,
                    'name' => $house->name,
                    'slug' => $house->slug,
                    'motto' => $house->motto,
                    'color' => $house->color,
                    'color_name' => $this->getColorName($house->color),
                    'description' => $house->description,
                    'icon' => $house->icon,
                    'logo' => $house->logo ? asset('storage/' . $house->logo) : null,
                    'image' => $house->image ? asset('storage/' . $house->image) : null,
                    'house_master' => $house->house_master,
                    'house_master_designation' => $house->house_master_designation,
                    'house_master_photo' => $house->house_master_photo ? asset('storage/' . $house->house_master_photo) : null,
                    'captain' => $captain ? [
                        'name' => $captain->student_name,
                        'class' => $captain->class,
                        'photo' => $captain->photo ? asset('storage/' . $captain->photo) : null,
                    ] : null,
                    'vice_captain' => $viceCaptain ? [
                        'name' => $viceCaptain->student_name,
                        'class' => $viceCaptain->class,
                        'photo' => $viceCaptain->photo ? asset('storage/' . $viceCaptain->photo) : null,
                    ] : null,
                    'prefects' => $prefects->map(function ($prefect) {
                        return [
                            'name' => $prefect->student_name,
                            'class' => $prefect->class,
                            'photo' => $prefect->photo ? asset('storage/' . $prefect->photo) : null,
                        ];
                    })->toArray(),
                    'total_points' => (int) ($house->total_points ?? 0),
                ];
            });

        return Inertia::render('beyond-academics/houses', [
            'houses' => $houses->isEmpty() ? $this->getDefaultHouses() : $houses,
            'houseSystem' => $this->getHouseSystemInfo(),
        ]);
    }

    /**
     * Display individual house details page
     */
    public function houseShow(string $slug): Response
    {
        $currentYear = date('Y');
        
        $house = House::where('slug', $slug)
            ->where('is_active', true)
            ->with(['leaders' => function ($query) use ($currentYear) {
                $query->where('academic_year', $currentYear)
                    ->where('is_active', true)
                    ->orderByRaw("FIELD(position, 'captain', 'vice_captain', 'prefect')");
            }, 'teachers' => function ($query) {
                $query->where('is_active', true)->orderBy('order');
            }, 'points' => function ($query) use ($currentYear) {
                $query->where('academic_year', $currentYear)->orderByDesc('event_date')->limit(20);
            }])
            ->withSum(['points as total_points' => function ($query) use ($currentYear) {
                $query->where('academic_year', $currentYear);
            }], 'points')
            ->firstOrFail();

        $leaders = $house->leaders;
        $captain = $leaders->firstWhere('position', 'captain');
        $viceCaptain = $leaders->firstWhere('position', 'vice_captain');
        $prefects = $leaders->where('position', 'prefect')->values();

        // Get all houses for ranking
        $allHouses = House::where('is_active', true)
            ->withSum(['points as total_points' => function ($query) use ($currentYear) {
                $query->where('academic_year', $currentYear);
            }], 'points')
            ->orderByDesc('total_points')
            ->get();

        $rank = $allHouses->search(function ($h) use ($house) {
            return $h->id === $house->id;
        }) + 1;

        // Points breakdown by category
        $pointsBreakdown = $house->points()
            ->where('academic_year', $currentYear)
            ->selectRaw('category, SUM(points) as total')
            ->groupBy('category')
            ->pluck('total', 'category')
            ->toArray();

        $houseData = [
            'id' => $house->id,
            'name' => $house->name,
            'slug' => $house->slug,
            'motto' => $house->motto,
            'color' => $house->color,
            'color_name' => $this->getColorName($house->color),
            'description' => $house->description,
            'icon' => $house->icon,
            'logo' => $house->logo ? asset('storage/' . $house->logo) : null,
            'image' => $house->image ? asset('storage/' . $house->image) : null,
            'house_master' => $house->house_master,
            'house_master_designation' => $house->house_master_designation,
            'house_master_photo' => $house->house_master_photo ? asset('storage/' . $house->house_master_photo) : null,
            'captain' => $captain ? [
                'name' => $captain->student_name,
                'class' => $captain->class,
                'photo' => $captain->photo ? asset('storage/' . $captain->photo) : null,
            ] : null,
            'vice_captain' => $viceCaptain ? [
                'name' => $viceCaptain->student_name,
                'class' => $viceCaptain->class,
                'photo' => $viceCaptain->photo ? asset('storage/' . $viceCaptain->photo) : null,
            ] : null,
            'prefects' => $prefects->map(function ($prefect) {
                return [
                    'name' => $prefect->student_name,
                    'class' => $prefect->class,
                    'photo' => $prefect->photo ? asset('storage/' . $prefect->photo) : null,
                ];
            })->toArray(),
            'teachers' => $house->teachers->map(function ($teacher) {
                return [
                    'name' => $teacher->name,
                    'designation' => $teacher->designation,
                    'subject' => $teacher->subject,
                ];
            })->toArray(),
            'total_points' => (int) ($house->total_points ?? 0),
            'rank' => $rank,
            'total_houses' => $allHouses->count(),
            'points_breakdown' => $pointsBreakdown,
            'recent_points' => $house->points->map(function ($point) {
                return [
                    'category' => $point->category,
                    'points' => $point->points,
                    'reason' => $point->remarks,
                    'awarded_date' => $point->event_date,
                ];
            })->toArray(),
        ];

        return Inertia::render('beyond-academics/house-show', [
            'house' => $houseData,
        ]);
    }

    /**
     * Get color name from hex code
     */
    private function getColorName(string $hex): string
    {
        $colorMap = [
            '#DC2626' => 'Red',
            '#dc2626' => 'Red',
            '#EF4444' => 'Red',
            '#ef4444' => 'Red',
            '#2563EB' => 'Blue',
            '#2563eb' => 'Blue',
            '#3B82F6' => 'Blue',
            '#3b82f6' => 'Blue',
            '#16A34A' => 'Green',
            '#16a34a' => 'Green',
            '#22C55E' => 'Green',
            '#22c55e' => 'Green',
            '#CA8A04' => 'Yellow',
            '#ca8a04' => 'Yellow',
            '#EAB308' => 'Yellow',
            '#eab308' => 'Yellow',
            '#F59E0B' => 'Orange',
            '#f59e0b' => 'Orange',
            '#7C3AED' => 'Purple',
            '#7c3aed' => 'Purple',
        ];

        return $colorMap[$hex] ?? 'House Color';
    }

    /**
     * Display clubs page
     */
    public function clubs(): Response
    {
        $currentYear = date('Y');
        
        $clubs = Club::where('is_active', true)
            ->withCount(['members as members_count' => function ($query) use ($currentYear) {
                $query->where('academic_year', $currentYear)
                    ->where('status', 'approved');
            }])
            ->withCount(['members as male_count' => function ($query) use ($currentYear) {
                $query->where('academic_year', $currentYear)
                    ->where('status', 'approved')
                    ->where('gender', 'male');
            }])
            ->withCount(['members as female_count' => function ($query) use ($currentYear) {
                $query->where('academic_year', $currentYear)
                    ->where('status', 'approved')
                    ->where('gender', 'female');
            }])
            ->orderBy('order')
            ->get()
            ->map(function ($club) {
                return [
                    'id' => $club->id,
                    'name' => $club->name,
                    'slug' => $club->slug,
                    'category' => $club->category,
                    'description' => $club->description,
                    'image' => $club->image_url,
                    'icon' => $club->icon,
                    'in_charge' => $club->in_charge,
                    'meeting_schedule' => $club->meeting_schedule,
                    'members_count' => $club->members_count ?? 0,
                    'male_count' => $club->male_count ?? 0,
                    'female_count' => $club->female_count ?? 0,
                    'accepts_enrollment' => $club->accepts_enrollment,
                ];
            });

        $clubsByCategory = [
            'academic_interest' => $clubs->where('category', 'academic_interest')->values(),
            'creative_physical' => $clubs->where('category', 'creative_physical')->values(),
        ];

        // Calculate total enrollments across all clubs
        $totalEnrollments = $clubs->sum('members_count');

        return Inertia::render('beyond-academics/clubs', [
            'clubs' => $clubsByCategory,
            'allClubs' => $clubs,
            'categories' => [
                'academic_interest' => 'Academic & Interest Clubs',
                'creative_physical' => 'Creative & Physical Clubs',
            ],
            'statistics' => [
                'total_clubs' => $clubs->count(),
                'total_enrollments' => $totalEnrollments,
                'academic_count' => $clubs->where('category', 'academic_interest')->count(),
                'creative_count' => $clubs->where('category', 'creative_physical')->count(),
            ],
        ]);
    }

    /**
     * Display individual club details page
     */
    public function clubShow(string $slug): Response
    {
        $currentYear = date('Y');
        
        $club = Club::where('slug', $slug)
            ->where('is_active', true)
            ->withCount(['members as members_count' => function ($query) use ($currentYear) {
                $query->where('academic_year', $currentYear)
                    ->where('status', 'approved');
            }])
            ->firstOrFail();

        return Inertia::render('beyond-academics/club-show', [
            'club' => [
                'id' => $club->id,
                'name' => $club->name,
                'slug' => $club->slug,
                'category' => $club->category,
                'category_label' => $club->category_label,
                'description' => $club->description,
                'image' => $club->image_url,
                'icon' => $club->icon,
                'in_charge' => $club->in_charge,
                'meeting_schedule' => $club->meeting_schedule,
                'members_count' => $club->members_count ?? 0,
                'accepts_enrollment' => $club->accepts_enrollment,
            ],
        ]);
    }

    /**
     * Handle club enrollment request
     */
    public function clubEnroll(Request $request, string $slug)
    {
        $club = Club::where('slug', $slug)
            ->where('is_active', true)
            ->where('accepts_enrollment', true)
            ->firstOrFail();

        $currentYear = date('Y');

        // Validate the request
        $validated = $request->validate([
            'student_name' => 'required|string|max:100',
            'class' => 'required|string|max:20',
            'gender' => 'required|in:male,female',
            'admission_number' => 'required|string|max:50',
            'email' => 'required|email|max:100',
            'phone' => 'required|string|max:15',
            'parent_phone' => 'nullable|string|max:15',
            'reason' => 'nullable|string|max:500',
            'honeypot' => 'nullable|string|max:0', // Honeypot field must be empty
        ]);

        // Check honeypot (anti-spam)
        if (!empty($validated['honeypot'])) {
            return back()->withErrors(['honeypot' => 'Spam detected.']);
        }

        // Check if student already enrolled in a club of the same category this year
        $existingEnrollment = \App\Models\ClubMember::whereHas('club', function ($query) use ($club) {
            $query->where('category', $club->category);
        })
            ->where('admission_number', $validated['admission_number'])
            ->where('academic_year', $currentYear)
            ->whereIn('status', ['pending', 'approved'])
            ->first();

        if ($existingEnrollment) {
            $categoryLabel = $club->category === 'academic_interest' 
                ? 'Academic & Interest' 
                : 'Creative & Physical';
            
            return back()->withErrors([
                'admission_number' => "You are already enrolled/pending in a {$categoryLabel} club for this academic year. Each student can join only one club per category."
            ]);
        }

        // Check if student already applied to this specific club
        $existingApplication = \App\Models\ClubMember::where('club_id', $club->id)
            ->where('admission_number', $validated['admission_number'])
            ->where('academic_year', $currentYear)
            ->first();

        if ($existingApplication) {
            $status = $existingApplication->status;
            $message = match($status) {
                'pending' => 'Your application is already pending for approval.',
                'approved' => 'You are already a member of this club.',
                'rejected' => 'Your previous application was rejected. Please contact the club in-charge.',
            };
            return back()->withErrors(['admission_number' => $message]);
        }

        // Create the enrollment request
        \App\Models\ClubMember::create([
            'club_id' => $club->id,
            'student_name' => $validated['student_name'],
            'class' => $validated['class'],
            'gender' => $validated['gender'],
            'admission_number' => $validated['admission_number'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'parent_phone' => $validated['parent_phone'] ?? null,
            'reason' => $validated['reason'] ?? null,
            'academic_year' => $currentYear,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Your enrollment request has been submitted successfully! You will be notified once it is reviewed.');
    }

    /**
     * Display NCC page
     */
    public function ncc(): Response
    {
        $achievements = NccAchievement::orderBy('year', 'desc')
            ->orderBy('level', 'desc')
            ->take(10)
            ->get();

        return Inertia::render('beyond-academics/ncc', [
            'nccInfo' => $this->getNccInfo(),
            'achievements' => $achievements->isEmpty() ? $this->getDefaultNccAchievements() : $achievements,
            'activities' => $this->getNccActivities(),
            'camps' => $this->getNccCamps(),
        ]);
    }

    /**
     * Display sports page
     */
    public function sports(): Response
    {
        return Inertia::render('beyond-academics/sports', [
            'sports' => $this->getSportsInfo(),
            'facilities' => $this->getSportsFacilities(),
            'achievements' => $this->getSportsAchievements(),
            'coaches' => $this->getSportsCoaches(),
        ]);
    }

    /**
     * Display activities page
     */
    public function activities(): Response
    {
        return Inertia::render('beyond-academics/activities', [
            'activities' => $this->getActivities(),
            'events' => $this->getAnnualEvents(),
            'celebrations' => $this->getCelebrations(),
        ]);
    }

    /**
     * Get highlights for landing page
     */
    private function getHighlights(): array
    {
        return [
            [
                'title' => 'House System',
                'description' => 'Four vibrant houses promoting healthy competition',
                'icon' => 'shield',
                'link' => '/beyond-academics/houses',
            ],
            [
                'title' => 'Clubs & Societies',
                'description' => 'Various clubs for diverse interests and talents',
                'icon' => 'users',
                'link' => '/beyond-academics/clubs',
            ],
            [
                'title' => 'NCC',
                'description' => 'Army Wing NCC Unit fostering discipline and patriotism',
                'icon' => 'flag',
                'link' => '/beyond-academics/ncc',
            ],
            [
                'title' => 'Sports Excellence',
                'description' => 'Comprehensive sports program and facilities',
                'icon' => 'trophy',
                'link' => '/beyond-academics/sports',
            ],
            [
                'title' => 'Co-curricular Activities',
                'description' => 'Art, music, dance, drama and more',
                'icon' => 'palette',
                'link' => '/beyond-academics/activities',
            ],
        ];
    }

    /**
     * Get default houses data
     */
    private function getDefaultHouses(): array
    {
        return [
            [
                'id' => 1,
                'name' => 'Prithviraj House',
                'motto' => 'Courage and Valor',
                'color' => '#DC2626',
                'color_name' => 'Red',
                'description' => 'Named after the legendary Rajput king Prithviraj Chauhan, this house embodies courage and valor.',
                'icon' => 'sword',
                'leaders_count' => 4,
                'points_count' => 0,
            ],
            [
                'id' => 2,
                'name' => 'Shivaji House',
                'motto' => 'Leadership and Strategy',
                'color' => '#2563EB',
                'color_name' => 'Blue',
                'description' => 'Named after the great Maratha warrior Chhatrapati Shivaji, representing leadership and strategy.',
                'icon' => 'crown',
                'leaders_count' => 4,
                'points_count' => 0,
            ],
            [
                'id' => 3,
                'name' => 'Ashoka House',
                'motto' => 'Peace and Wisdom',
                'color' => '#16A34A',
                'color_name' => 'Green',
                'description' => 'Named after Emperor Ashoka the Great, symbolizing peace, wisdom and righteousness.',
                'icon' => 'chakra',
                'leaders_count' => 4,
                'points_count' => 0,
            ],
            [
                'id' => 4,
                'name' => 'Ranjit House',
                'motto' => 'Unity and Strength',
                'color' => '#CA8A04',
                'color_name' => 'Yellow',
                'description' => 'Named after Maharaja Ranjit Singh, the Lion of Punjab, representing unity and strength.',
                'icon' => 'lion',
                'leaders_count' => 4,
                'points_count' => 0,
            ],
        ];
    }

    /**
     * Get house system info
     */
    private function getHouseSystemInfo(): array
    {
        return [
            'purpose' => 'The House System at APS Alwar is designed to foster a spirit of healthy competition, teamwork, and school pride. Students are assigned to one of four houses and participate in various inter-house competitions throughout the year.',
            'activities' => [
                'Inter-House Sports Competitions',
                'Quiz and Debate Competitions',
                'Cultural Performances',
                'House Assemblies',
                'Academic Competitions',
                'Community Service Activities',
            ],
            'points_system' => 'Houses earn points through academic achievements, sports victories, cultural performances, discipline, and community service. The house with the highest points at the end of the year wins the coveted House Trophy.',
        ];
    }

    /**
     * Get default clubs data
     */
    private function getDefaultClubs(): array
    {
        return [
            'Academic' => [
                [
                    'id' => 1,
                    'name' => 'Science Club',
                    'description' => 'Exploring the wonders of science through experiments and projects',
                    'members_count' => 45,
                    'in_charge' => 'Science Department',
                ],
                [
                    'id' => 2,
                    'name' => 'Mathematics Club',
                    'description' => 'Making mathematics fun through puzzles and competitions',
                    'members_count' => 35,
                    'in_charge' => 'Mathematics Department',
                ],
                [
                    'id' => 3,
                    'name' => 'English Literary Club',
                    'description' => 'Debates, declamations, and creative writing activities',
                    'members_count' => 40,
                    'in_charge' => 'English Department',
                ],
            ],
            'Cultural' => [
                [
                    'id' => 4,
                    'name' => 'Music Club',
                    'description' => 'Vocal and instrumental music training and performances',
                    'members_count' => 30,
                    'in_charge' => 'Music Teacher',
                ],
                [
                    'id' => 5,
                    'name' => 'Dance Club',
                    'description' => 'Classical, folk, and contemporary dance forms',
                    'members_count' => 35,
                    'in_charge' => 'Dance Teacher',
                ],
                [
                    'id' => 6,
                    'name' => 'Art & Craft Club',
                    'description' => 'Painting, sketching, and various craft activities',
                    'members_count' => 40,
                    'in_charge' => 'Art Teacher',
                ],
            ],
            'Service' => [
                [
                    'id' => 7,
                    'name' => 'Eco Club',
                    'description' => 'Environmental awareness and conservation activities',
                    'members_count' => 50,
                    'in_charge' => 'Biology Department',
                ],
                [
                    'id' => 8,
                    'name' => 'Social Service Club',
                    'description' => 'Community outreach and service activities',
                    'members_count' => 45,
                    'in_charge' => 'Social Science Department',
                ],
            ],
            'Technical' => [
                [
                    'id' => 9,
                    'name' => 'Computer Club',
                    'description' => 'Coding, programming, and IT skills development',
                    'members_count' => 40,
                    'in_charge' => 'Computer Department',
                ],
                [
                    'id' => 10,
                    'name' => 'Robotics Club',
                    'description' => 'Building and programming robots',
                    'members_count' => 25,
                    'in_charge' => 'Physics Department',
                ],
            ],
        ];
    }

    /**
     * Get NCC info
     */
    private function getNccInfo(): array
    {
        return [
            'unit' => 'Army Wing NCC',
            'battalion' => '3 RAJ BN NCC',
            'group' => 'NCC Group HQ, Jaipur',
            'directorate' => 'NCC Directorate, Rajasthan',
            'strength' => '150+ Cadets',
            'categories' => ['Junior Division (JD) - Class 8-10', 'Senior Division (SD) - Class 11-12'],
            'motto' => 'Unity and Discipline',
            'aim' => 'To develop character, comradeship, discipline, a secular outlook, the spirit of adventure and ideals of selfless service amongst young citizens.',
        ];
    }

    /**
     * Get default NCC achievements
     */
    private function getDefaultNccAchievements(): array
    {
        return [
            [
                'title' => 'Republic Day Camp Selection',
                'description' => 'Cadets selected for Republic Day Camp, New Delhi',
                'year' => 2024,
                'level' => 'National',
            ],
            [
                'title' => 'Best Cadet Award',
                'description' => 'Cadet awarded Best Cadet at Group Level',
                'year' => 2024,
                'level' => 'Group',
            ],
            [
                'title' => 'Thal Sainik Camp',
                'description' => 'Participation in Thal Sainik Camp',
                'year' => 2023,
                'level' => 'Directorate',
            ],
            [
                'title' => 'Independence Day Parade',
                'description' => 'Outstanding performance at State Independence Day Parade',
                'year' => 2023,
                'level' => 'State',
            ],
        ];
    }

    /**
     * Get NCC activities
     */
    private function getNccActivities(): array
    {
        return [
            'Drill and Parade',
            'Map Reading',
            'Field Craft and Battle Craft',
            'Weapon Training',
            'First Aid Training',
            'Adventure Activities',
            'Social Service',
            'Environmental Conservation',
            'National Integration',
            'Career Counseling',
        ];
    }

    /**
     * Get NCC camps
     */
    private function getNccCamps(): array
    {
        return [
            [
                'name' => 'Annual Training Camp (ATC)',
                'duration' => '10 Days',
                'description' => 'Basic military training and discipline',
            ],
            [
                'name' => 'Combined Annual Training Camp (CATC)',
                'duration' => '10 Days',
                'description' => 'Combined training with other units',
            ],
            [
                'name' => 'Thal Sainik Camp',
                'duration' => '12 Days',
                'description' => 'National level camp for selected cadets',
            ],
            [
                'name' => 'Republic Day Camp',
                'duration' => '1 Month',
                'description' => 'Prestigious national camp in Delhi',
            ],
            [
                'name' => 'Adventure Activities Camp',
                'duration' => '7 Days',
                'description' => 'Trekking, rock climbing, and other adventures',
            ],
        ];
    }

    /**
     * Get sports info
     */
    private function getSportsInfo(): array
    {
        return [
            [
                'name' => 'Cricket',
                'description' => 'Cricket coaching and inter-school competitions',
                'facility' => 'Cricket Ground',
            ],
            [
                'name' => 'Football',
                'description' => 'Football training and tournaments',
                'facility' => 'Football Field',
            ],
            [
                'name' => 'Basketball',
                'description' => 'Basketball coaching and competitions',
                'facility' => 'Basketball Court',
            ],
            [
                'name' => 'Volleyball',
                'description' => 'Volleyball training and matches',
                'facility' => 'Volleyball Court',
            ],
            [
                'name' => 'Athletics',
                'description' => 'Track and field events training',
                'facility' => '200m Track',
            ],
            [
                'name' => 'Table Tennis',
                'description' => 'Indoor table tennis facility',
                'facility' => 'Indoor Sports Room',
            ],
            [
                'name' => 'Badminton',
                'description' => 'Badminton coaching and matches',
                'facility' => 'Badminton Court',
            ],
            [
                'name' => 'Chess',
                'description' => 'Chess club and competitions',
                'facility' => 'Chess Room',
            ],
        ];
    }

    /**
     * Get sports facilities
     */
    private function getSportsFacilities(): array
    {
        return [
            [
                'name' => 'Main Sports Ground',
                'description' => 'Large multi-purpose ground for cricket and football',
                'area' => '4 acres',
            ],
            [
                'name' => 'Basketball Court',
                'description' => 'Standard basketball court with floodlights',
                'area' => 'Standard size',
            ],
            [
                'name' => 'Volleyball Court',
                'description' => 'Outdoor volleyball facility',
                'area' => 'Standard size',
            ],
            [
                'name' => 'Indoor Sports Complex',
                'description' => 'Facilities for table tennis, chess, and carrom',
                'area' => '2000 sq ft',
            ],
        ];
    }

    /**
     * Get sports achievements
     */
    private function getSportsAchievements(): array
    {
        return [
            [
                'sport' => 'Cricket',
                'achievement' => 'District Champions',
                'year' => 2024,
            ],
            [
                'sport' => 'Athletics',
                'achievement' => 'State Level Gold Medal (100m)',
                'year' => 2024,
            ],
            [
                'sport' => 'Basketball',
                'achievement' => 'Inter-Army School Runner-up',
                'year' => 2023,
            ],
            [
                'sport' => 'Football',
                'achievement' => 'CBSE Cluster Champions',
                'year' => 2023,
            ],
        ];
    }

    /**
     * Get sports coaches
     */
    private function getSportsCoaches(): array
    {
        return [
            [
                'name' => 'Physical Education Department',
                'role' => 'Overall Sports Coordination',
                'sports' => 'All Sports',
            ],
        ];
    }

    /**
     * Get activities
     */
    private function getActivities(): array
    {
        return [
            [
                'name' => 'Music & Dance',
                'description' => 'Training in vocal, instrumental music and various dance forms',
                'icon' => 'music',
            ],
            [
                'name' => 'Art & Craft',
                'description' => 'Painting, sketching, pottery, and creative crafts',
                'icon' => 'palette',
            ],
            [
                'name' => 'Drama & Theatre',
                'description' => 'Acting workshops and theatrical performances',
                'icon' => 'theater',
            ],
            [
                'name' => 'Public Speaking',
                'description' => 'Debate, declamation, and elocution training',
                'icon' => 'mic',
            ],
            [
                'name' => 'Photography',
                'description' => 'Photography skills and visual storytelling',
                'icon' => 'camera',
            ],
            [
                'name' => 'Yoga & Meditation',
                'description' => 'Physical and mental wellness through yoga',
                'icon' => 'leaf',
            ],
        ];
    }

    /**
     * Get annual events
     */
    private function getAnnualEvents(): array
    {
        return [
            [
                'name' => 'Annual Day',
                'month' => 'December',
                'description' => 'Grand celebration with cultural performances',
            ],
            [
                'name' => 'Sports Day',
                'month' => 'November',
                'description' => 'Inter-house sports competitions',
            ],
            [
                'name' => 'Science Exhibition',
                'month' => 'January',
                'description' => 'Student projects and innovations showcase',
            ],
            [
                'name' => 'Literary Week',
                'month' => 'August',
                'description' => 'Debates, quiz, and literary competitions',
            ],
        ];
    }

    /**
     * Get celebrations
     */
    private function getCelebrations(): array
    {
        return [
            'Independence Day',
            'Republic Day',
            'Gandhi Jayanti',
            'Teachers\' Day',
            'Children\'s Day',
            'Hindi Diwas',
            'Founder\'s Day',
            'NCC Day',
        ];
    }
}
