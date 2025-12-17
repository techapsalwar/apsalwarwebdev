<?php

namespace App\Http\Controllers;

use App\Models\BoardResult;
use App\Models\Department;
use App\Models\Staff;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AcademicsController extends Controller
{
    /**
     * Display the main academics page.
     */
    public function index()
    {
        return Inertia::render('academics/index', [
            'streams' => $this->getStreams(),
            'curriculum' => $this->getCurriculumInfo(),
            'academicFeatures' => $this->getAcademicFeatures(),
            'statistics' => $this->getAcademicStatistics(),
        ]);
    }

    /**
     * Display board results page.
     */
    public function results()
    {
        $results = BoardResult::published()
            ->orderByDesc('academic_year')
            ->orderBy('class')
            ->get()
            ->map(function ($r) {
                // Format stream toppers based on class
                $streamToppers = [];
                if ($r->class === 'XII') {
                    if ($r->science_toppers) {
                        $streamToppers['Science'] = $this->formatToppers($r->science_toppers);
                    }
                    if ($r->commerce_toppers) {
                        $streamToppers['Commerce'] = $this->formatToppers($r->commerce_toppers);
                    }
                    if ($r->humanities_toppers) {
                        $streamToppers['Humanities'] = $this->formatToppers($r->humanities_toppers);
                    }
                }

                $classXToppers = [];
                if ($r->class === 'X' && $r->class_x_toppers) {
                    $classXToppers = $this->formatToppers($r->class_x_toppers);
                }

                return [
                    'id' => $r->id,
                    'year' => $r->academic_year,
                    'class' => $r->class,
                    'stream' => $r->stream,
                    'totalStudents' => $r->appeared,
                    'passedStudents' => $r->passed,
                    'passPercentage' => (float) $r->pass_percentage,
                    'schoolAverage' => $r->school_average ? (float) $r->school_average : null,
                    'highestMarks' => $r->highest_marks ? (float) $r->highest_marks : null,
                    'distinctionCount' => $r->above_90_percent ?? 0,
                    'firstDivisionCount' => $r->above_80_percent ?? 0,
                    'secondDivisionCount' => $r->above_70_percent ?? 0,
                    'thirdDivisionCount' => $r->above_60_percent ?? 0,
                    'apiScore' => $r->api_score ? (float) $r->api_score : null,
                    // Overall topper
                    'topperName' => $r->overall_topper_name,
                    'topperPercentage' => $r->overall_topper_percentage ? (float) $r->overall_topper_percentage : null,
                    'topperPhoto' => $r->overall_topper_photo,
                    'topperStream' => $r->overall_topper_stream,
                    // Stream-wise toppers for Class XII
                    'streamToppers' => $streamToppers,
                    // Class X toppers (top 5)
                    'classXToppers' => $classXToppers,
                ];
            })
            ->toArray();

        // Group by year
        $groupedResults = collect($results)->groupBy('year')->toArray();

        // If no results, provide default data
        if (empty($results)) {
            $groupedResults = $this->getDefaultBoardResults();
        }

        return Inertia::render('academics/results', [
            'results' => $groupedResults,
            'achievements' => $this->getBoardAchievements(),
        ]);
    }

    /**
     * Format toppers array with photo URLs
     */
    private function formatToppers(?array $toppers): array
    {
        if (!$toppers) {
            return [];
        }

        return array_map(function ($topper) {
            return [
                'name' => $topper['name'] ?? '',
                'percentage' => $topper['percentage'] ?? null,
                'photo' => $topper['photo'] ?? null,
                'photoUrl' => isset($topper['photo']) && $topper['photo'] 
                    ? asset('storage/' . $topper['photo']) 
                    : null,
                'stream' => $topper['stream'] ?? null,
                'rank' => $topper['rank'] ?? null,
            ];
        }, $toppers);
    }

    /**
     * Display departments page.
     */
    public function departments()
    {
        $departments = Department::active()
            ->withCount(['staff' => function ($query) {
                $query->where('is_active', true);
            }])
            ->with(['staff' => function ($query) {
                // Get the first visible staff member as a representative (like HOD)
                $query->where('is_active', true)
                    ->where('show_on_website', true)
                    ->orderBy('order')
                    ->limit(1);
            }])
            ->having('staff_count', '>', 0) // Only show departments with at least one staff member
            ->get()
            ->map(fn($d) => [
                'id' => $d->id,
                'name' => $d->name,
                'slug' => $d->slug,
                'description' => $d->description,
                'icon' => $d->icon,
                'staff_count' => $d->staff_count,
                'hod' => $d->staff->first() ? [
                    'name' => $d->staff->first()->name,
                    'photo' => $d->staff->first()->photo,
                    'qualifications' => $d->staff->first()->qualifications,
                ] : null,
            ])
            ->toArray();

        return Inertia::render('academics/departments', [
            'departments' => $departments,
        ]);
    }

    /**
     * Display faculty/staff page.
     */
    public function faculty(Request $request)
    {
        $query = Staff::with('department')
            ->where('is_active', true)
            ->where('show_on_website', true);

        // Filter by type if provided
        if ($request->has('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        // Filter by department if provided
        if ($request->has('department') && $request->department !== 'all') {
            $query->where('department_id', $request->department);
        }

        $staff = $query->orderBy('type')
            ->orderBy('order')
            ->get()
            ->map(fn($s) => [
                'id' => $s->id,
                'name' => $s->name,
                'slug' => $s->slug,
                'designation' => $s->designation,
                'qualifications' => $s->qualifications,
                'department' => $s->department?->name,
                'department_id' => $s->department_id,
                'type' => $s->type,
                'photo' => $s->photo,
                'photo_url' => $s->photo_url,
                'email' => $s->email,
                'subjects' => $s->subjects ?? [],
                'experience' => $s->experience,
                'years_of_experience' => $s->years_of_experience,
                'bio' => $s->bio,
            ])
            ->toArray();

        // Group by type
        $grouped = collect($staff)->groupBy('type')->toArray();

        // Get counts by type
        $typeStats = Staff::where('is_active', true)
            ->where('show_on_website', true)
            ->selectRaw('type, COUNT(*) as count')
            ->groupBy('type')
            ->pluck('count', 'type')
            ->toArray();

        return Inertia::render('academics/faculty', [
            'staff' => $staff,
            'grouped' => $grouped,
            'departments' => Department::active()->get(['id', 'name']),
            'statistics' => [
                'total' => count($staff),
                'teaching' => $typeStats['teaching'] ?? 0,
                'non_teaching' => $typeStats['non_teaching'] ?? 0,
                'management' => $typeStats['management'] ?? 0,
            ],
            'filters' => $request->only(['type', 'department']),
        ]);
    }

    /**
     * Display individual staff member page.
     */
    public function facultyShow(Staff $staff)
    {
        if (!$staff->is_active || !$staff->show_on_website) {
            abort(404);
        }

        // Get related staff from same department
        $relatedStaff = $staff->department_id 
            ? Staff::where('department_id', $staff->department_id)
                ->where('id', '!=', $staff->id)
                ->where('is_active', true)
                ->where('show_on_website', true)
                ->orderBy('order')
                ->limit(4)
                ->get()
            : collect();

        return Inertia::render('academics/faculty-show', [
            'staff' => [
                'id' => $staff->id,
                'name' => $staff->name,
                'slug' => $staff->slug,
                'designation' => $staff->designation,
                'qualifications' => $staff->qualifications,
                'department' => $staff->department?->name,
                'type' => $staff->type,
                'photo' => $staff->photo,
                'photo_url' => $staff->photo_url,
                'email' => $staff->email,
                'phone' => $staff->phone,
                'subjects' => $staff->subjects ?? [],
                'experience' => $staff->experience,
                'years_of_experience' => $staff->years_of_experience,
                'bio' => $staff->bio,
                'joining_date' => $staff->joining_date?->format('F Y'),
            ],
            'relatedStaff' => $relatedStaff->map(fn($s) => [
                'id' => $s->id,
                'name' => $s->name,
                'slug' => $s->slug,
                'designation' => $s->designation,
                'photo_url' => $s->photo_url,
            ]),
        ]);
    }

    /**
     * Display curriculum details page.
     */
    public function curriculum()
    {
        return Inertia::render('academics/curriculum', [
            'curriculum' => $this->getCurriculumInfo(),
            'subjects' => $this->getSubjectsByClass(),
            'assessment' => $this->getAssessmentPattern(),
        ]);
    }

    /**
     * Display academic calendar page with Google Calendar embed.
     */
    public function calendar()
    {
        return Inertia::render('academics/calendar', [
            'googleCalendarUrl' => env('GOOGLE_CALENDAR_EMBED_URL', ''),
        ]);
    }

    /**
     * Display competitive exams page.
     */
    public function competitive()
    {
        $exams = DB::table('competitive_exams')
            ->where('is_active', true)
            ->orderBy('order')
            ->get()
            ->map(fn($e) => [
                'id' => $e->id,
                'name' => $e->name,
                'slug' => $e->slug,
                'description' => $e->description,
                'eligibility' => $e->eligibility,
                'schedule' => $e->schedule,
                'achievements' => json_decode($e->achievements ?? '[]'),
            ])
            ->toArray();

        // If no data, provide defaults from brochure
        if (empty($exams)) {
            $exams = $this->getDefaultCompetitiveExams();
        }

        return Inertia::render('academics/competitive', [
            'exams' => $exams,
        ]);
    }

    /**
     * Get academic streams/sections.
     */
    private function getStreams(): array
    {
        return [
            [
                'name' => 'Primary Section',
                'classes' => 'Nursery to Class V',
                'description' => 'Foundation years focused on building fundamental skills, curiosity, and love for learning.',
                'highlights' => ['Activity-based Learning', 'Smart Classroom Teaching', 'Value Education', 'Art & Craft'],
            ],
            [
                'name' => 'Middle Section',
                'classes' => 'Class VI to VIII',
                'description' => 'Transition years developing analytical thinking, scientific temper, and holistic growth.',
                'highlights' => ['Lab-based Learning', 'Project Work', 'Sports Activities', 'NCC Introduction'],
            ],
            [
                'name' => 'Secondary Section',
                'classes' => 'Class IX to X',
                'description' => 'Board preparation with focus on conceptual clarity and career guidance.',
                'highlights' => ['CBSE Board Preparation', 'Career Counseling', 'Competitive Exam Coaching', 'NCC Training'],
            ],
            [
                'name' => 'Senior Secondary - Science',
                'classes' => 'Class XI to XII',
                'description' => 'Science stream with PCM/PCB for engineering and medical aspirants.',
                'highlights' => ['Physics, Chemistry, Maths/Biology', 'Advanced Lab Facilities', 'JEE/NEET Coaching', 'Research Projects'],
            ],
            [
                'name' => 'Senior Secondary - Commerce',
                'classes' => 'Class XI to XII',
                'description' => 'Commerce stream for business and finance career aspirants.',
                'highlights' => ['Accountancy, Business Studies', 'Economics', 'Computer Science', 'CA Foundation Prep'],
            ],
        ];
    }

    /**
     * Get curriculum information.
     */
    private function getCurriculumInfo(): array
    {
        return [
            'board' => 'Central Board of Secondary Education (CBSE)',
            'affiliationNumber' => '1780018',
            'framework' => 'NCF 2023 (National Curriculum Framework)',
            'medium' => 'English',
            'features' => [
                'Competency-based Education',
                'Experiential Learning',
                'Art-integrated Education',
                'Technology-aided Enhanced Learning (TAeL)',
                'Continuous & Comprehensive Evaluation (CCE)',
                'Bagless Days & Fun Fridays',
            ],
        ];
    }

    /**
     * Get academic features.
     */
    private function getAcademicFeatures(): array
    {
        return [
            [
                'title' => 'Smart Classrooms',
                'description' => '38 smart classrooms with interactive panels and smart boards',
                'icon' => 'monitor',
            ],
            [
                'title' => 'Well-equipped Labs',
                'description' => 'Physics, Chemistry, Biology, Computer, Robotics, and Astronomy labs',
                'icon' => 'flask',
            ],
            [
                'title' => 'E-Learning',
                'description' => 'Digital learning platform with Digicamp for enhanced learning',
                'icon' => 'laptop',
            ],
            [
                'title' => 'Expert Faculty',
                'description' => '55+ qualified and experienced teachers with regular training',
                'icon' => 'users',
            ],
            [
                'title' => 'Library',
                'description' => '6,813+ books, journals, magazines with E-Library access',
                'icon' => 'book',
            ],
            [
                'title' => 'Remedial Classes',
                'description' => 'Special attention for academically challenged students',
                'icon' => 'target',
            ],
        ];
    }

    /**
     * Get academic statistics.
     */
    private function getAcademicStatistics(): array
    {
        return [
            'totalStudents' => 1046,
            'sections' => 38,
            'teachers' => 55,
            'passRate' => '100%',
            'streams' => 2,
            'subjects' => 20,
        ];
    }

    /**
     * Get default board results.
     */
    private function getDefaultBoardResults(): array
    {
        return [
            '2024' => [
                [
                    'id' => 1,
                    'year' => '2024',
                    'class' => 'XII',
                    'totalStudents' => 48,
                    'passPercentage' => 100.0,
                    'distinctionCount' => 12,
                    'firstDivisionCount' => 30,
                    'topperName' => 'Yash Sharma',
                    'topperMarks' => '95.4%',
                    'topperPhoto' => null,
                ],
                [
                    'id' => 2,
                    'year' => '2024',
                    'class' => 'X',
                    'totalStudents' => 65,
                    'passPercentage' => 100.0,
                    'distinctionCount' => 18,
                    'firstDivisionCount' => 40,
                    'topperName' => 'Ananya Gupta',
                    'topperMarks' => '96.2%',
                    'topperPhoto' => null,
                ],
            ],
            '2023' => [
                [
                    'id' => 3,
                    'year' => '2023',
                    'class' => 'XII',
                    'totalStudents' => 45,
                    'passPercentage' => 100.0,
                    'distinctionCount' => 10,
                    'firstDivisionCount' => 28,
                    'topperName' => null,
                    'topperMarks' => null,
                    'topperPhoto' => null,
                ],
                [
                    'id' => 4,
                    'year' => '2023',
                    'class' => 'X',
                    'totalStudents' => 60,
                    'passPercentage' => 100.0,
                    'distinctionCount' => 15,
                    'firstDivisionCount' => 35,
                    'topperName' => null,
                    'topperMarks' => null,
                    'topperPhoto' => null,
                ],
            ],
        ];
    }

    /**
     * Get board achievements.
     */
    private function getBoardAchievements(): array
    {
        return [
            ['title' => 'Consistent 100% Pass Rate', 'description' => 'Maintaining 100% pass rate in both Class X and XII board examinations'],
            ['title' => 'High Distinction Rate', 'description' => 'Over 25% students score distinction in board exams'],
            ['title' => 'State Toppers', 'description' => 'Multiple students in top 100 of state merit list'],
            ['title' => 'Medical & Engineering Success', 'description' => 'Students selected in JEE Mains, NEET, CLAT, and other competitive exams'],
        ];
    }

    /**
     * Get subjects by class.
     */
    private function getSubjectsByClass(): array
    {
        return [
            'primary' => [
                'English', 'Hindi', 'Mathematics', 'Environmental Science',
                'Art & Craft', 'Music', 'Physical Education', 'Computer Science',
            ],
            'middle' => [
                'English', 'Hindi', 'Sanskrit/French', 'Mathematics',
                'Science', 'Social Science', 'Computer Science',
                'Art', 'Music', 'Physical Education',
            ],
            'secondary' => [
                'English', 'Hindi', 'Sanskrit/French', 'Mathematics',
                'Science', 'Social Science', 'Information Technology',
                'Art', 'Physical Education',
            ],
            'seniorScience' => [
                'English', 'Physics', 'Chemistry', 'Mathematics/Biology',
                'Computer Science/Physical Education', 'Optional Subjects',
            ],
            'seniorCommerce' => [
                'English', 'Accountancy', 'Business Studies', 'Economics',
                'Mathematics/Computer Science', 'Physical Education',
            ],
        ];
    }

    /**
     * Get assessment pattern.
     */
    private function getAssessmentPattern(): array
    {
        return [
            'formative' => [
                'description' => 'Continuous assessment through class tests, projects, assignments',
                'weightage' => '20%',
                'components' => ['Class Tests', 'Projects', 'Assignments', 'Oral Tests'],
            ],
            'summative' => [
                'description' => 'Term-end examinations',
                'weightage' => '80%',
                'components' => ['Term 1 Exam', 'Term 2 Exam', 'Board Exams (X & XII)'],
            ],
            'cce' => [
                'description' => 'Continuous and Comprehensive Evaluation covering both scholastic and co-scholastic areas',
                'components' => ['Academic Performance', 'Co-curricular Activities', 'Life Skills', 'Attitudes & Values'],
            ],
        ];
    }

    /**
     * Get default competitive exams.
     */
    private function getDefaultCompetitiveExams(): array
    {
        return [
            [
                'id' => 1,
                'name' => 'National Talent Search Examination (NTSE)',
                'slug' => 'ntse',
                'description' => 'National level scholarship exam for Class X students',
                'eligibility' => 'Class X students',
                'schedule' => 'November',
                'achievements' => ['Multiple qualifiers in state level', 'Coaching provided'],
            ],
            [
                'id' => 2,
                'name' => 'Science Olympiad',
                'slug' => 'science-olympiad',
                'description' => 'International science competition for school students',
                'eligibility' => 'Class VI to XII',
                'schedule' => 'October-December',
                'achievements' => ['State and national level winners', 'International participation'],
            ],
            [
                'id' => 3,
                'name' => 'Mathematics Olympiad',
                'slug' => 'math-olympiad',
                'description' => 'Mathematical problem-solving competition',
                'eligibility' => 'Class VI to XII',
                'schedule' => 'October-December',
                'achievements' => ['Regional winners', 'Special coaching sessions'],
            ],
            [
                'id' => 4,
                'name' => 'JEE Main/Advanced Preparation',
                'slug' => 'jee',
                'description' => 'Engineering entrance exam coaching',
                'eligibility' => 'Class XI-XII Science (PCM)',
                'schedule' => 'Year-round preparation',
                'achievements' => ['Students qualified in JEE Mains', 'IIT selections'],
            ],
            [
                'id' => 5,
                'name' => 'NEET Preparation',
                'slug' => 'neet',
                'description' => 'Medical entrance exam coaching',
                'eligibility' => 'Class XI-XII Science (PCB)',
                'schedule' => 'Year-round preparation',
                'achievements' => ['Medical college selections', 'AIQ seat selections'],
            ],
            [
                'id' => 6,
                'name' => 'Cyber Olympiad',
                'slug' => 'cyber-olympiad',
                'description' => 'Computer and IT skills competition',
                'eligibility' => 'Class III to XII',
                'schedule' => 'November-December',
                'achievements' => ['School toppers', 'State level participation'],
            ],
        ];
    }
}
