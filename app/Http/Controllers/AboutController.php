<?php

namespace App\Http\Controllers;

use App\Models\Committee;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AboutController extends Controller
{
    /**
     * Display the main about page with school overview.
     */
    public function index()
    {
        return Inertia::render('about/index', [
            'history' => $this->getHistory(),
            'milestones' => $this->getMilestones(),
            'vision' => $this->getSettings('school_vision'),
            'mission' => $this->getSettings('school_mission'),
            'motto' => $this->getSettings('school_motto'),
            'objectives' => $this->getObjectives(),
            'statistics' => $this->getStatistics(),
        ]);
    }

    /**
     * Display principal's message page.
     */
    public function principalMessage()
    {
        $settings = DB::table('settings')
            ->whereIn('key', [
                'principal_name',
                'principal_message',
                'principal_photo',
                'principal_qualification',
            ])
            ->pluck('value', 'key')
            ->toArray();

        return Inertia::render('about/principal-message', [
            'principal' => [
                'name' => $settings['principal_name'] ?? 'Dr. Neera Pandey',
                'qualification' => $settings['principal_qualification'] ?? 'M.A., M.Ed., PG in School Management & Leadership, Diploma in Introduction to Psychology (Yale University)',
                'message' => $settings['principal_message'] ?? $this->getDefaultPrincipalMessage(),
                'photo' => $settings['principal_photo'] ?? '/images/principal.jpg',
            ],
        ]);
    }

    /**
     * Display vision and mission page.
     */
    public function visionMission()
    {
        return Inertia::render('about/vision-mission', [
            'vision' => $this->getSettings('school_vision') ?? 'To foster the talent and individuality of every student, ensuring they become conscientious global citizens who understand the value of protecting the environment, ethics, community service, and commitment while becoming flexible, adaptable, and disciplined individuals.',
            'mission' => $this->getSettings('school_mission') ?? 'To provide the fullest possible development of each learner for living morally, creatively, and productively in a democratic society.',
            'motto' => $this->getSettings('school_motto') ?? 'A HAPPY LEARNER IS A MOTIVATED LEARNER',
            'objectives' => $this->getObjectives(),
        ]);
    }

    /**
     * Display management committee page.
     */
    public function management()
    {
        // Get all active committees except SMC, with their members
        $committees = Committee::with(['members' => function ($q) {
            $q->where('is_active', true)->orderBy('order');
        }])
            ->where('is_active', true)
            ->where('type', '!=', 'smc')
            ->orderBy('order')
            ->get()
            ->map(function ($committee) {
                $members = $committee->members ?? collect();
                return [
                    'id' => $committee->id,
                    'name' => $committee->name,
                    'slug' => $committee->slug,
                    'type' => $committee->type,
                    'description' => $committee->description,
                    'functions' => $committee->functions,
                    'session' => $committee->session,
                    'members' => $members->map(fn($m) => [
                        'id' => $m->id,
                        'name' => $m->name,
                        'designation' => $m->designation,
                        'role' => $m->role,
                        'email' => $m->email,
                        'phone' => $m->phone,
                        'photo' => $m->photo ? "/storage/{$m->photo}" : null,
                        'bio' => $m->bio,
                        'organization' => $m->organization,
                        'order' => $m->order,
                    ])->toArray(),
                ];
            })
            ->toArray();

        // Get SMC committee with its members
        $smcCommittee = Committee::with(['members' => function ($q) {
            $q->where('is_active', true)->orderBy('order');
        }])
            ->where('type', 'smc')
            ->where('is_active', true)
            ->first();
            
        $smcMembers = [];
        $smcData = null;
        
        if ($smcCommittee) {
            $smcData = [
                'id' => $smcCommittee->id,
                'name' => $smcCommittee->name,
                'description' => $smcCommittee->description,
                'functions' => $smcCommittee->functions,
                'session' => $smcCommittee->session,
            ];
            
            $members = $smcCommittee->members ?? collect();
            $smcMembers = $members->map(fn($m) => [
                'id' => $m->id,
                'name' => $m->name,
                'designation' => $m->designation,
                'role' => $m->role,
                'email' => $m->email,
                'phone' => $m->phone,
                'photo' => $m->photo ? "/storage/{$m->photo}" : null,
                'bio' => $m->bio,
                'organization' => $m->organization,
                'order' => $m->order,
            ])->toArray();
        }

        // If no SMC members found, use defaults from brochure
        if (empty($smcMembers)) {
            $smcMembers = $this->getDefaultManagementMembers();
        }

        return Inertia::render('about/management', [
            'committees' => $committees,
            'smcData' => $smcData,
            'smcMembers' => $smcMembers,
        ]);
    }

    /**
     * Display history and milestones page.
     */
    public function history()
    {
        $foundingYear = 1981;
        $currentYear = (int) date('Y');
        
        return Inertia::render('about/history', [
            'milestones' => $this->getMilestones(),
            'foundingYear' => $foundingYear,
            'yearsOfExcellence' => $currentYear - $foundingYear,
            'statistics' => [
                'totalStudents' => 1046,
                'totalStaff' => 65,
                'totalAlumni' => 10000,
            ],
        ]);
    }

    /**
     * Get history text from settings.
     */
    private function getHistory(): string
    {
        $history = $this->getSettings('school_history');
        return $history ?? 'Army Public School, Alwar has a distinguished legacy of educational excellence spanning over four decades. Founded on 04 July 1981 as a Pre-Primary School with 100 students, the institution has grown to become one of the most respected educational establishments in the region. The school was renamed as Army School on 14 June 1991 and expanded to 350 students (up to Class VIII). On 22 June 2001, the school received CBSE Affiliation (No: 1780018), marking a significant milestone in its journey. The first Class X batch graduated in 2004, and on 01 April 2008, the institution was renamed as Army Public School with comprehensive upgrades. Today, APS Alwar serves over 1,046 students across Nursery to Class XII, with 55 qualified teachers, spread across a beautiful 14.5-acre campus.';
    }

    /**
     * Get milestones from settings or return defaults.
     */
    private function getMilestones(): array
    {
        return [
            ['year' => '1981', 'title' => 'Establishment', 'description' => 'Founded as Pre-Primary School with 100 students on 04 July'],
            ['year' => '1991', 'title' => 'Renamed as Army School', 'description' => 'Expanded to 350 students (up to Class VIII) on 14 June'],
            ['year' => '2001', 'title' => 'CBSE Affiliation', 'description' => 'Received CBSE Affiliation No: 1780018 on 22 June'],
            ['year' => '2004', 'title' => 'First Class X Batch', 'description' => 'Inaugural batch of Class X students graduated'],
            ['year' => '2008', 'title' => 'Renamed as Army Public School', 'description' => 'New building inaugurated by Lt Gen R S Sujlana on 12 May'],
            ['year' => '2014', 'title' => 'First Class XII Batch', 'description' => 'Inaugural batch of Class XII students graduated'],
            ['year' => '2025', 'title' => 'Astronomy Lab Inauguration', 'description' => 'Inaugurated by Maj Gen SC Kandpal on 08 November'],
        ];
    }

    /**
     * Get core objectives.
     */
    private function getObjectives(): array
    {
        return [
            ['title' => 'Liberal & Enlightening Education', 'description' => 'Providing comprehensive learning opportunities for holistic development'],
            ['title' => 'Critical Thinking', 'description' => 'Motivating students to think independently, make informed decisions, and take responsibility'],
            ['title' => 'Infrastructure Excellence', 'description' => 'Offering world-class facilities for personality development'],
            ['title' => 'Discipline & Patriotism', 'description' => 'Fostering discipline and commitment to serve the nation'],
            ['title' => 'Modern Empowerment', 'description' => 'Providing contemporary facilities for skill acquisition and honest living'],
            ['title' => 'Values of Hard Work', 'description' => 'Encouraging determination, perseverance, and self-discipline'],
            ['title' => 'Independent Learning', 'description' => 'Helping students evolve into self-directed learners'],
            ['title' => 'Physical & Mental Wellness', 'description' => 'Promoting good qualities of head and heart through sports and yoga'],
            ['title' => 'Social Harmony', 'description' => 'Building friendships and respect within the school community'],
            ['title' => 'Responsibility', 'description' => 'Accepting assigned work as rightful contribution'],
            ['title' => 'Respect & Courtesy', 'description' => 'Maintaining respect for teachers, elders, officials, and peers'],
        ];
    }

    /**
     * Get statistics.
     */
    private function getStatistics(): array
    {
        $stats = DB::table('school_statistics')
            ->pluck('value', 'key')
            ->toArray();

        return [
            'students' => $stats['total_students'] ?? '1046',
            'teachers' => $stats['total_teachers'] ?? '55',
            'sections' => $stats['total_sections'] ?? '38',
            'campus' => $stats['campus_area'] ?? '14.5 acres',
            'yearsOfExcellence' => $stats['years_of_excellence'] ?? '43',
            'boardPassRate' => '100%',
        ];
    }

    /**
     * Get a setting value by key.
     */
    private function getSettings(string $key): ?string
    {
        return DB::table('settings')->where('key', $key)->value('value');
    }

    /**
     * Get default principal message.
     */
    private function getDefaultPrincipalMessage(): string
    {
        return 'Dear Parents and Students,

It gives me immense pleasure to welcome you to Army Public School, Alwar. Our school has been a beacon of educational excellence for over four decades, nurturing generations of students who have gone on to make significant contributions in various fields.

At APS Alwar, we believe that education is not just about academic achievement, but about developing the whole person - intellectually, emotionally, socially, and physically. Our motto, "A Happy Learner is a Motivated Learner," reflects our commitment to creating a nurturing environment where every child can discover their unique potential.

We are blessed with a beautiful 14.5-acre campus, state-of-the-art infrastructure, and a dedicated team of 55+ qualified teachers who are committed to providing the highest quality education. Our students consistently achieve 100% pass rate in board examinations, with many securing distinctions.

Beyond academics, we offer a rich tapestry of co-curricular activities including NCC, sports, cultural programs, and various clubs. Our students have excelled at national and state-level competitions in various fields.

I invite you to explore our school and discover what makes APS Alwar special. Together, let us nurture the leaders of tomorrow.

Warm regards,
Dr. Neera Pandey
Principal, Army Public School Alwar';
    }

    /**
     * Get default management committee members.
     */
    private function getDefaultManagementMembers(): array
    {
        return [
            ['id' => 1, 'name' => 'Brig Millind Vyas', 'designation' => 'Chairman', 'role' => 'Commander, 18 Artillery Brigade', 'email' => null, 'phone' => null, 'photo' => null, 'bio' => null, 'order' => 1],
            ['id' => 2, 'name' => 'Col Udit Chawla', 'designation' => 'Vice Chairman', 'role' => null, 'email' => null, 'phone' => null, 'photo' => null, 'bio' => null, 'order' => 2],
            ['id' => 3, 'name' => 'Col Rahul Kumar', 'designation' => 'Member', 'role' => 'Admin Commandant, Station HQ', 'email' => null, 'phone' => null, 'photo' => null, 'bio' => null, 'order' => 3],
            ['id' => 4, 'name' => 'Col Kunal Gauray', 'designation' => 'Member', 'role' => 'CO, 343 Field Regiment', 'email' => null, 'phone' => null, 'photo' => null, 'bio' => null, 'order' => 4],
            ['id' => 5, 'name' => 'Maj Manoj Bisht', 'designation' => 'Member', 'role' => 'Garrison Engineer, Alwar', 'email' => null, 'phone' => null, 'photo' => null, 'bio' => null, 'order' => 5],
            ['id' => 6, 'name' => 'Lt Col Deepak Sharma', 'designation' => 'Member', 'role' => 'Education Officer', 'email' => null, 'phone' => null, 'photo' => null, 'bio' => null, 'order' => 6],
            ['id' => 7, 'name' => 'Dr. Neera Pandey', 'designation' => 'Principal & Member Secretary', 'role' => 'Principal, APS Alwar', 'email' => 'principal@apsalwar.edu.in', 'phone' => null, 'photo' => null, 'bio' => null, 'order' => 7],
            ['id' => 8, 'name' => 'Mr. GD Meena', 'designation' => 'Member', 'role' => 'Principal, KV-1', 'email' => null, 'phone' => null, 'photo' => null, 'bio' => null, 'order' => 8],
            ['id' => 9, 'name' => 'Mr. Suresh Kumar', 'designation' => 'Member', 'role' => 'Principal, KV-2, Itarana', 'email' => null, 'phone' => null, 'photo' => null, 'bio' => null, 'order' => 9],
            ['id' => 10, 'name' => 'Mr. Satendra Kumar', 'designation' => 'Teacher Representative', 'role' => 'TGT', 'email' => null, 'phone' => null, 'photo' => null, 'bio' => null, 'order' => 10],
            ['id' => 11, 'name' => 'Mrs. Alka Yadav', 'designation' => 'Teacher Representative', 'role' => 'PRT', 'email' => null, 'phone' => null, 'photo' => null, 'bio' => null, 'order' => 11],
        ];
    }
}
