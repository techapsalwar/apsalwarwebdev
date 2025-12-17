<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends Controller
{
    /**
     * Display a listing of all active announcements.
     */
    public function index(): Response
    {
        $announcements = Announcement::active()
            ->orderByRaw("FIELD(priority, 'critical', 'high', 'medium', 'low') ASC")
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        return Inertia::render('announcements/index', [
            'announcements' => $announcements,
        ]);
    }

    /**
     * Display the specified announcement.
     */
    public function show(Announcement $announcement): Response
    {
        // Ensure announcement is active (for public access)
        if (!$announcement->is_active) {
            abort(404);
        }

        // Check date constraints
        $now = now()->startOfDay();
        if ($announcement->start_date && $announcement->start_date > $now) {
            abort(404);
        }
        if ($announcement->end_date && $announcement->end_date < $now) {
            abort(404);
        }

        // Get related announcements (same type or priority)
        $relatedAnnouncements = Announcement::active()
            ->where('id', '!=', $announcement->id)
            ->where(function ($query) use ($announcement) {
                $query->where('type', $announcement->type)
                    ->orWhere('priority', $announcement->priority);
            })
            ->orderByRaw("FIELD(priority, 'critical', 'high', 'medium', 'low') ASC")
            ->limit(5)
            ->get();

        return Inertia::render('announcements/show', [
            'announcement' => $announcement,
            'relatedAnnouncements' => $relatedAnnouncements,
        ]);
    }
}
