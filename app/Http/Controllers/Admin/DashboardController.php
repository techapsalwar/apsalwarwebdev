<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard with real statistics.
     */
    public function __invoke()
    {
        // Fetch real statistics from the database
        $statistics = $this->getStatistics();
        $pendingItems = $this->getPendingItems();
        $recentActivities = $this->getRecentActivities();
        $contentOverview = $this->getContentOverview();
        $schoolInfo = $this->getSchoolInfo();

        return Inertia::render('dashboard', [
            'statistics' => $statistics,
            'pendingItems' => $pendingItems,
            'recentActivities' => $recentActivities,
            'contentOverview' => $contentOverview,
            'schoolInfo' => $schoolInfo,
        ]);
    }

    /**
     * Get main statistics for dashboard cards.
     */
    private function getStatistics(): array
    {
        // Get school statistics from seeded data
        $stats = DB::table('school_statistics')
            ->pluck('value', 'key')
            ->toArray();

        return [
            [
                'label' => 'Total Students',
                'value' => number_format((int)($stats['total_students'] ?? 0)),
                'icon' => 'Users',
                'color' => 'bg-blue-500',
                'trend' => null,
            ],
            [
                'label' => 'Teaching Staff',
                'value' => $stats['total_teachers'] ?? '0',
                'icon' => 'GraduationCap',
                'color' => 'bg-green-500',
                'trend' => null,
            ],
            [
                'label' => 'Achievements',
                'value' => (string) DB::table('achievements')->where('is_active', true)->count(),
                'icon' => 'Trophy',
                'color' => 'bg-amber-500',
                'trend' => null,
            ],
            [
                'label' => 'Events This Month',
                'value' => (string) DB::table('events')
                    ->whereMonth('start_date', now()->month)
                    ->whereYear('start_date', now()->year)
                    ->count(),
                'icon' => 'Calendar',
                'color' => 'bg-purple-500',
                'trend' => null,
            ],
        ];
    }

    /**
     * Get pending items that require attention.
     */
    private function getPendingItems(): array
    {
        return [
            [
                'label' => 'Admission Inquiries',
                'count' => DB::table('admissions')->where('status', 'pending')->count(),
                'href' => '/admin/admissions',
            ],
            [
                'label' => 'Contact Messages',
                'count' => DB::table('contacts')->where('status', 'unread')->count(),
                'href' => '/admin/contacts',
            ],
            [
                'label' => 'Unverified TCs',
                'count' => DB::table('tc_records')->where('is_verified', false)->count(),
                'href' => '/admin/tc-records',
            ],
        ];
    }

    /**
     * Get recent activities from audit logs.
     */
    private function getRecentActivities(): array
    {
        $activities = DB::table('audit_logs')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        if ($activities->isEmpty()) {
            // Return placeholder activities if no audit logs exist
            return [
                ['action' => 'System initialized', 'time' => 'Just now', 'type' => 'system'],
                ['action' => 'Database seeded with school data', 'time' => '1 minute ago', 'type' => 'system'],
            ];
        }

        return $activities->map(function ($log) {
            return [
                'action' => $log->action,
                'time' => \Carbon\Carbon::parse($log->created_at)->diffForHumans(),
                'type' => $log->model_type ?? 'general',
            ];
        })->toArray();
    }

    /**
     * Get content overview statistics.
     */
    private function getContentOverview(): array
    {
        return [
            'totalPages' => DB::table('pages')->count(),
            'publishedNews' => DB::table('news')->where('status', 'published')->count(),
            'photoAlbums' => DB::table('albums')->count(),
            'activeEvents' => DB::table('events')->where('status', 'upcoming')->count(),
        ];
    }

    /**
     * Get school information from settings.
     */
    private function getSchoolInfo(): array
    {
        $settings = DB::table('settings')
            ->whereIn('key', ['academic_year', 'cbse_affiliation_no', 'classes_offered'])
            ->pluck('value', 'key')
            ->toArray();

        // Get latest board results
        $latestResult = DB::table('board_results')
            ->where('is_published', true)
            ->orderBy('academic_year', 'desc')
            ->first();

        return [
            'academicSession' => $settings['academic_year'] ?? '2025-26',
            'cbseAffiliation' => $settings['cbse_affiliation_no'] ?? '1780018',
            'classesOffered' => $settings['classes_offered'] ?? 'Nursery to XII',
            'boardResultPass' => $latestResult ? ($latestResult->pass_percentage >= 100 ? '100% Pass' : $latestResult->pass_percentage . '%') : 'N/A',
        ];
    }
}
