<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    public const STATUSES = [
        'unread' => 'Unread',
        'read' => 'Read',
        'replied' => 'Replied',
        'archived' => 'Archived',
    ];

    public const CATEGORIES = [
        'general' => 'General Inquiry',
        'admission' => 'Admission',
        'academic' => 'Academic',
        'fees' => 'Fees & Payments',
        'transport' => 'Transport',
        'complaint' => 'Complaint',
        'feedback' => 'Feedback',
        'other' => 'Other',
    ];

    public function index(Request $request)
    {
        $query = Contact::query();

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Category filter
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        $contacts = $query->orderByRaw("FIELD(status, 'unread', 'read', 'replied', 'archived')")
            ->orderBy('created_at', 'desc')
            ->paginate(20)
            ->withQueryString();

        // Get counts by status
        $statusCounts = [
            'total' => Contact::count(),
            'unread' => Contact::where('status', 'unread')->count(),
            'read' => Contact::where('status', 'read')->count(),
            'replied' => Contact::where('status', 'replied')->count(),
            'archived' => Contact::where('status', 'archived')->count(),
        ];

        return Inertia::render('admin/contacts/index', [
            'contacts' => $contacts,
            'filters' => $request->only(['search', 'status', 'category']),
            'statuses' => self::STATUSES,
            'categories' => self::CATEGORIES,
            'statusCounts' => $statusCounts,
        ]);
    }

    public function show(Contact $contact)
    {
        // Mark as read when viewing
        $contact->markAsRead();

        return Inertia::render('admin/contacts/show', [
            'contact' => $contact->load('repliedBy'),
            'statuses' => self::STATUSES,
            'categories' => self::CATEGORIES,
        ]);
    }

    public function reply(Request $request, Contact $contact)
    {
        $validated = $request->validate([
            'admin_reply' => 'required|string|min:10',
        ]);

        $contact->reply($validated['admin_reply']);

        // Here you could also send an email to the user
        // Mail::to($contact->email)->send(new ContactReplyMail($contact));

        return back()->with('success', 'Reply sent successfully.');
    }

    public function updateStatus(Request $request, Contact $contact)
    {
        $validated = $request->validate([
            'status' => 'required|in:' . implode(',', array_keys(self::STATUSES)),
        ]);

        $contact->update(['status' => $validated['status']]);

        return back()->with('success', 'Status updated.');
    }

    public function destroy(Contact $contact)
    {
        $contact->delete();

        return redirect()->route('admin.contacts.index')
            ->with('success', 'Contact message deleted.');
    }

    public function bulkUpdateStatus(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:contacts,id',
            'status' => 'required|in:' . implode(',', array_keys(self::STATUSES)),
        ]);

        Contact::whereIn('id', $validated['ids'])
            ->update(['status' => $validated['status']]);

        return back()->with('success', count($validated['ids']) . ' messages updated.');
    }

    public function bulkDelete(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:contacts,id',
        ]);

        Contact::whereIn('id', $validated['ids'])->delete();

        return back()->with('success', count($validated['ids']) . ' messages deleted.');
    }
}
