<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\Setting;

class ContactController extends Controller
{
    /**
     * Display the contact page.
     */
    public function index()
    {
        return Inertia::render('contact/index', [
            'contactInfo' => $this->getContactInfo(),
            'departments' => $this->getDepartmentContacts(),
            'mapUrl' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3547.2837562890877!2d76.65371257548458!3d27.522654776515594!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3972908e2c623109%3A0x585669f79a805d9f!2sArmy%20Public%20School!5e0!3m2!1sen!2sin!4v1734175200000!5m2!1sen!2sin',
        ]);
    }

    /**
     * Handle contact form submission.
     */
    public function submit(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'department' => 'nullable|string|max:100',
            'message' => 'required|string|max:2000',
        ]);

        try {
            // Store in database
            DB::table('contacts')->insert([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'subject' => $validated['subject'],
                'department' => $validated['department'] ?? 'general',
                'message' => $validated['message'],
                'status' => 'new',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Log the contact submission
            Log::info('Contact form submitted', [
                'name' => $validated['name'],
                'email' => $validated['email'],
                'subject' => $validated['subject'],
            ]);

            return back()->with('success', 'Thank you for your message! We will get back to you soon.');

        } catch (\Exception $e) {
            Log::error('Contact form submission failed', [
                'error' => $e->getMessage(),
            ]);
            
            return back()->with('error', 'Sorry, there was an error sending your message. Please try again later.');
        }
    }

    /**
     * Get school contact information.
     */
    private function getContactInfo(): array
    {
        $socialSettings = Setting::getByGroup('social');

        return [
            'address' => [
                'line1' => 'Army Public School',
                'line2' => 'Alwar Military Station',
                'city' => 'Alwar',
                'state' => 'Rajasthan',
                'pincode' => '301001',
                'country' => 'India',
            ],
            'phone' => [
                ['number' => '0144-2700365', 'label' => 'Main Office'],
                ['number' => '0144-2700366', 'label' => 'Admission'],
            ],
            'email' => [
                ['address' => 'apsalwar@gmail.com', 'label' => 'General Enquiry'],
                ['address' => 'principal@apsalwar.edu.in', 'label' => 'Principal'],
                ['address' => 'admin@apsalwar.edu.in', 'label' => 'Administration'],
            ],
            'timing' => [
                'days' => 'Monday - Saturday',
                'office' => '8:00 AM - 3:00 PM',
                'school' => '7:30 AM - 2:00 PM',
            ],
            'social' => array_values(array_filter([
                ['platform' => 'facebook', 'url' => $socialSettings['social_facebook'] ?? null, 'label' => 'Facebook'],
                ['platform' => 'twitter', 'url' => $socialSettings['social_twitter'] ?? null, 'label' => 'Twitter'],
                ['platform' => 'instagram', 'url' => $socialSettings['social_instagram'] ?? null, 'label' => 'Instagram'],
                ['platform' => 'youtube', 'url' => $socialSettings['social_youtube'] ?? null, 'label' => 'YouTube'],
            ], fn($link) => !empty($link['url']))),
        ];
    }

    /**
     * Get department-wise contact details.
     */
    private function getDepartmentContacts(): array
    {
        return [
            [
                'name' => 'Principal Office',
                'description' => 'For academic policies, grievances, and important matters',
                'email' => 'principal@apsalwar.edu.in',
                'phone' => '0144-2700365',
            ],
            [
                'name' => 'Admission Cell',
                'description' => 'New admissions, transfers, and enrollment queries',
                'email' => 'admission@apsalwar.edu.in',
                'phone' => '0144-2700366',
            ],
            [
                'name' => 'Accounts Office',
                'description' => 'Fee payment, receipts, and financial matters',
                'email' => 'accounts@apsalwar.edu.in',
                'phone' => '0144-2700367',
            ],
            [
                'name' => 'Examination Cell',
                'description' => 'Board exams, internal exams, and result queries',
                'email' => 'exam@apsalwar.edu.in',
                'phone' => '0144-2700368',
            ],
        ];
    }
}
