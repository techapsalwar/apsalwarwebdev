<?php

namespace App\Http\Controllers;

use App\Models\Achievement;
use App\Models\Affirmation;
use App\Models\Committee;
use App\Models\Partnership;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display the homepage with real data from database.
     */
    public function __invoke()
    {
        return Inertia::render('home', [
            'sliders' => $this->getSliders(),
            'statistics' => $this->getStatistics(),
            'announcements' => $this->getAnnouncements(),
            'events' => $this->getUpcomingEvents(),
            'news' => $this->getLatestNews(),
            'achievements' => $this->getAchievements(),
            'testimonials' => $this->getTestimonials(),
            'quickLinks' => $this->getQuickLinks(),
            'principalMessage' => $this->getPrincipalMessage(),
            'todaysThought' => $this->getTodaysThought(),
            'partnerships' => $this->getPartnerships(),
            'management' => $this->getManagementHighlights(),
        ]);
    }

    /**
     * Get hero sliders for the homepage.
     */
    private function getSliders(): array
    {
        $sliders = DB::table('sliders')
            ->where('is_active', true)
            ->orderBy('order')
            ->get();

        if ($sliders->isEmpty()) {
            // Return default sliders if none exist
            return [
                [
                    'id' => 1,
                    'title' => 'Welcome to Army Public School, Alwar',
                    'subtitle' => 'A Happy Learner is a Motivated Learner',
                    'description' => 'Nurturing excellence since 1981 with a perfect blend of academic excellence, discipline, and character building.',
                    'image' => '/images/sliders/hero-1.jpg',
                    'cta' => ['text' => 'Admission Now', 'href' => 'https://erp.awesindia.edu.in/webinterface/searchschool'],
                ],
                [
                    'id' => 2,
                    'title' => '100% Board Results',
                    'subtitle' => 'API Score: 502.70 (Class XII)',
                    'description' => 'Our students consistently achieve outstanding results in CBSE Board Examinations.',
                    'image' => '/images/sliders/hero-2.jpg',
                    'cta' => ['text' => 'View Results', 'href' => '/academics/results'],
                ],
            ];
        }

        return $sliders->map(function ($slider) {
            return [
                'id' => $slider->id,
                'title' => $slider->title,
                'subtitle' => $slider->subtitle,
                'description' => $slider->description,
                'image' => $slider->image ?? '/images/sliders/default.jpg',
                'cta' => [
                    'text' => $slider->button_text ?? 'Learn More',
                    'href' => $slider->button_link ?? '/about',
                ],
            ];
        })->toArray();
    }

    /**
     * Get statistics from school_statistics table.
     */
    private function getStatistics(): array
    {
        $stats = DB::table('school_statistics')
            ->pluck('value', 'key')
            ->toArray();

        return [
            [
                'label' => 'Students',
                'value' => number_format((int)($stats['total_students'] ?? 1046)),
                'icon' => 'Users',
                'color' => 'bg-blue-500',
            ],
            [
                'label' => 'Expert Teachers',
                'value' => ($stats['total_teachers'] ?? '55') . '+',
                'icon' => 'GraduationCap',
                'color' => 'bg-green-500',
            ],
            [
                'label' => 'Years of Excellence',
                'value' => ($stats['years_of_excellence'] ?? '43') . '+',
                'icon' => 'Trophy',
                'color' => 'bg-amber-500',
            ],
            [
                'label' => 'Board Pass Rate',
                'value' => '100%',
                'icon' => 'BookOpen',
                'color' => 'bg-purple-500',
            ],
        ];
    }

    /**
     * Get active announcements with ticker display.
     */
    private function getAnnouncements(): array
    {
        $announcements = DB::table('announcements')
            ->where('is_active', true)
            ->where('show_in_ticker', true)
            ->where(function ($query) {
                $query->whereNull('start_date')
                    ->orWhere('start_date', '<=', now()->toDateString());
            })
            ->where(function ($query) {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>=', now()->toDateString());
            })
            ->orderByRaw("FIELD(priority, 'critical', 'high', 'medium', 'low') ASC")
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        if ($announcements->isEmpty()) {
            return [
                [
                    'id' => 1, 
                    'title' => 'Admissions Open 2025-26', 
                    'slug' => 'admissions-open-2025-26',
                    'date' => now()->format('d M Y'), 
                    'type' => 'admission',
                    'priority' => 'high',
                    'priority_color' => 'orange',
                    'type_color' => 'purple',
                    'priority_icon' => 'Bell',
                    'has_link' => false,
                    'has_attachment' => false,
                ],
            ];
        }

        return $announcements->map(function ($item) {
            // Determine colors based on priority and type
            $priorityColor = match ($item->priority ?? 'medium') {
                'critical' => 'red',
                'high' => 'orange',
                'medium' => 'yellow',
                'low' => 'green',
                default => 'gray',
            };

            $typeColor = match ($item->type ?? 'general') {
                'urgent' => 'red',
                'important' => 'orange',
                'event' => 'blue',
                'holiday' => 'green',
                'admission' => 'purple',
                'exam' => 'amber',
                'result' => 'teal',
                'academic' => 'indigo',
                'general' => 'gray',
                default => 'gray',
            };

            $priorityIcon = match ($item->priority ?? 'medium') {
                'critical' => 'AlertTriangle',
                'high' => 'Bell',
                'medium' => 'Megaphone',
                'low' => 'Info',
                default => 'Bell',
            };

            return [
                'id' => $item->id,
                'title' => $item->title,
                'slug' => $item->slug ?? Str::slug($item->title),
                'date' => \Carbon\Carbon::parse($item->created_at)->format('d M Y'),
                'type' => $item->type ?? 'general',
                'priority' => $item->priority ?? 'medium',
                'priority_color' => $priorityColor,
                'type_color' => $typeColor,
                'priority_icon' => $priorityIcon,
                'has_link' => !empty($item->link),
                'has_attachment' => !empty($item->attachment),
            ];
        })->toArray();
    }

    /**
     * Get upcoming events.
     */
    private function getUpcomingEvents(): array
    {
        $events = DB::table('events')
            ->where('start_date', '>=', now())
            ->whereIn('status', ['upcoming', 'ongoing'])
            ->orderBy('start_date')
            ->limit(4)
            ->get();

        if ($events->isEmpty()) {
            return [
                [
                    'id' => 1,
                    'title' => 'Annual Sports Day',
                    'slug' => 'annual-sports-day',
                    'date' => now()->addDays(30)->format('d M Y'),
                    'time' => '9:00 AM',
                    'location' => 'Sports Ground',
                    'registration_required' => false,
                    'google_form_url' => null,
                ],
            ];
        }

        return $events->map(function ($event) {
            $startDate = \Carbon\Carbon::parse($event->start_date);
            return [
                'id' => $event->id,
                'title' => $event->title,
                'slug' => $event->slug,
                'date' => $startDate->format('d M Y'),
                'time' => $event->start_time ? \Carbon\Carbon::parse($event->start_time)->format('g:i A') : $startDate->format('g:i A'),
                'location' => $event->venue ?? 'School Campus',
                'registration_required' => (bool) $event->registration_required,
                'google_form_url' => $event->google_form_url ?? null,
            ];
        })->toArray();
    }

    /**
     * Get latest news articles.
     */
    private function getLatestNews(): array
    {
        $news = DB::table('news')
            ->where('status', 'published')
            ->orderBy('published_at', 'desc')
            ->limit(8)
            ->get();

        if ($news->isEmpty()) {
            return [
                [
                    'id' => 1,
                    'title' => 'National Literary Leadership Award',
                    'excerpt' => 'APS Alwar ranked 35th nationally with 101 student books published.',
                    'image' => '/images/news/default.jpg',
                    'date' => now()->format('d M Y'),
                ],
            ];
        }

        return $news->map(function ($item) {
            $image = null;
            if ($item->featured_image) {
                // Check if it's already a full URL or needs storage path
                $image = str_starts_with($item->featured_image, 'http') 
                    ? $item->featured_image 
                    : '/storage/' . $item->featured_image;
            } else {
                $image = '/images/news/default.jpg';
            }
            
            return [
                'id' => $item->id,
                'title' => $item->title,
                'excerpt' => $item->excerpt ?? Str::limit(strip_tags($item->content), 100),
                'image' => $image,
                'date' => \Carbon\Carbon::parse($item->published_at)->format('d M Y'),
                'slug' => $item->slug,
            ];
        })->toArray();
    }

    /**
     * Get featured achievements.
     */
    private function getAchievements(): array
    {
        // First try to get featured achievements
        $achievements = Achievement::active()
            ->featured()
            ->orderBy('order')
            ->limit(4)
            ->get();

        // If no featured achievements, get latest ones
        if ($achievements->isEmpty()) {
            $achievements = Achievement::active()
                ->orderByDesc('achievement_date')
                ->orderByDesc('created_at')
                ->limit(4)
                ->get();
        }

        // If still no achievements, return default data
        if ($achievements->isEmpty()) {
            return [
                ['title' => 'National Literary Award', 'position' => '35th Nationally', 'level' => 'National', 'slug' => null, 'image' => null],
                ['title' => 'CBSE Board Results', 'position' => '100% Pass', 'level' => 'National', 'slug' => null, 'image' => null],
                ['title' => 'Sports Excellence', 'position' => 'CBSE/SGFI Nationals', 'level' => 'National', 'slug' => null, 'image' => null],
                ['title' => 'Innovation Hub', 'position' => '22+ Projects', 'level' => 'School', 'slug' => null, 'image' => null],
            ];
        }

        $levelLabels = [
            'international' => 'International',
            'national' => 'National',
            'state' => 'State',
            'district' => 'District',
            'school' => 'School',
        ];

        return $achievements->map(function ($item) use ($levelLabels) {
            return [
                'title' => $item->title,
                'position' => $item->achiever_name ?? ($item->description ? Str::limit($item->description, 50) : 'Excellence'),
                'level' => $levelLabels[$item->level] ?? ucfirst($item->level ?? 'School'),
                'slug' => $item->slug,
                'image' => $item->image,
            ];
        })->toArray();
    }

    /**
     * Get testimonials.
     */
    private function getTestimonials(): array
    {
        $testimonials = DB::table('testimonials')
            ->where('is_active', true)
            ->where('is_featured', true)
            ->orderBy('order')
            ->limit(4)
            ->get();

        if ($testimonials->isEmpty()) {
            return [
                [
                    'id' => 1,
                    'content' => 'APS Alwar provided an excellent foundation for my career. The discipline and values instilled here shaped my personality.',
                    'author' => 'Alumni',
                    'role' => 'Graduate',
                    'image' => null,
                ],
            ];
        }

        return $testimonials->map(function ($item) {
            return [
                'id' => $item->id,
                'content' => $item->content,
                'author' => $item->name,
                'role' => $item->designation ?? $item->relation ?? 'Parent',
                'image' => $item->photo ?? null,
            ];
        })->toArray();
    }

    /**
     * Get quick links.
     */
    private function getQuickLinks(): array
    {
        return DB::table('quick_links')
            ->where('is_active', true)
            ->orderBy('order')
            ->get()
            ->map(function ($link) {
                return [
                    'id' => $link->id,
                    'title' => $link->title,
                    'url' => $link->url,
                    'icon' => $link->icon,
                    'target' => $link->target ?? '_self',
                    'is_new' => (bool) $link->is_new,
                ];
            })
            ->toArray();
    }

    /**
     * Get principal's message from settings.
     */
    private function getPrincipalMessage(): array
    {
        $settings = DB::table('settings')
            ->whereIn('key', ['principal_name', 'principal_message', 'principal_photo', 'principal_qualification'])
            ->pluck('value', 'key')
            ->toArray();

        return [
            'name' => $settings['principal_name'] ?? 'Dr. Neera Pandey',
            'qualification' => $settings['principal_qualification'] ?? 'M.A., M.Ed., PG (Yale)',
            'message' => $settings['principal_message'] ?? 'At Army Public School Alwar, we believe in nurturing not just academically excellent students, but well-rounded individuals who are prepared to face the challenges of tomorrow.',
            'photo' => $settings['principal_photo'] ?? '/images/principal.jpg',
        ];
    }

    /**
     * Get today's thought/affirmation.
     */
    private function getTodaysThought(): ?array
    {
        $affirmation = Affirmation::latest();

        if (!$affirmation) {
            return null;
        }

        return [
            'quote' => $affirmation->quote,
            'author' => $affirmation->author,
            'date' => $affirmation->display_date->format('d M Y'),
        ];
    }

    /**
     * Get active partnerships for the homepage.
     */
    private function getPartnerships(): array
    {
        return Partnership::active()
            ->ordered()
            ->get()
            ->map(function ($partnership) {
                return [
                    'id' => $partnership->id,
                    'name' => $partnership->partner_name,
                    'slug' => $partnership->slug,
                    'logo' => $partnership->logo_url,
                    'website' => $partnership->website_url,
                    'type' => $partnership->type,
                    'type_label' => $partnership->type_label,
                    'type_color' => $partnership->type_color,
                ];
            })
            ->toArray();
    }

    /**
     * Get management highlights (Chairman & Principal) for the homepage.
     */
    private function getManagementHighlights(): array
    {
        // Get SMC committee with key members (Chairman, Vice Chairman, Principal)
        $smcCommittee = Committee::with(['members' => function ($q) {
            $q->where('is_active', true)
                ->whereIn('designation', ['Chairman', 'Vice Chairman', 'Secretary & Principal'])
                ->orderBy('order')
                ->limit(3);
        }])
            ->where('type', 'smc')
            ->where('is_active', true)
            ->first();

        $members = $smcCommittee?->members ?? collect();

        if (!$smcCommittee || $members->isEmpty()) {
            // Return default data from brochure if no DB data
            return [
                'session' => '2024-25',
                'chairman' => [
                    'name' => 'Brig Milind Vyas',
                    'designation' => 'Chairman',
                    'role' => 'Cdr 37 Arty Bde',
                    'photo' => null,
                ],
                'principal' => [
                    'name' => 'Dr. Neera Pandey',
                    'designation' => 'Principal',
                    'role' => 'APS Alwar',
                    'photo' => null,
                ],
                'members' => [],
            ];
        }

        $chairman = $members->firstWhere('designation', 'Chairman');
        $principal = $members->first(function ($m) {
            return str_contains(strtolower($m->designation), 'principal') || 
                   str_contains(strtolower($m->designation), 'secretary');
        });

        return [
            'session' => $smcCommittee->session,
            'chairman' => $chairman ? [
                'name' => $chairman->name,
                'designation' => $chairman->designation,
                'role' => $chairman->role,
                'organization' => $chairman->organization,
                'photo' => $chairman->photo ? "/storage/{$chairman->photo}" : null,
            ] : null,
            'principal' => $principal ? [
                'name' => $principal->name,
                'designation' => $principal->designation,
                'role' => $principal->role,
                'organization' => $principal->organization,
                'photo' => $principal->photo ? "/storage/{$principal->photo}" : null,
            ] : null,
            'members' => $members->map(fn($m) => [
                'name' => $m->name,
                'designation' => $m->designation,
                'role' => $m->role,
                'photo' => $m->photo ? "/storage/{$m->photo}" : null,
            ])->toArray(),
        ];
    }
}
