<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SiteSettingsController extends Controller
{
    /**
     * Display the settings management page.
     */
    public function index(): Response
    {
        $settings = $this->getGroupedSettings();

        return Inertia::render('admin/settings/index', [
            'settings' => $settings,
            'groups' => $this->getSettingGroups(),
        ]);
    }

    /**
     * Update settings.
     * Accepts flat key-value pairs: { setting_key: "value", another_key: "value" }
     */
    public function update(Request $request)
    {
        $data = $request->except(['_token', '_method']);

        foreach ($data as $key => $value) {
            // Skip non-string keys or empty keys
            if (!is_string($key) || empty($key)) {
                continue;
            }

            DB::table('settings')
                ->updateOrInsert(
                    ['key' => $key],
                    [
                        'value' => $value,
                        'updated_at' => now(),
                    ]
                );
        }

        // Clear all settings-related caches
        $this->clearSettingsCache();

        return back()->with('success', 'Settings updated successfully.');
    }

    /**
     * Update a single setting.
     */
    public function updateSingle(Request $request)
    {
        $validated = $request->validate([
            'key' => 'required|string',
            'value' => 'nullable|string',
        ]);

        DB::table('settings')
            ->updateOrInsert(
                ['key' => $validated['key']],
                [
                    'value' => $validated['value'],
                    'updated_at' => now(),
                ]
            );

        Cache::forget('site_settings');

        return back()->with('success', 'Setting updated.');
    }

    /**
     * Upload a logo or image setting.
     */
    public function uploadImage(Request $request)
    {
        $validated = $request->validate([
            'key' => 'required|string',
            'image' => 'required|image|max:2048',
        ]);

        // Get current value to delete old image
        $currentValue = DB::table('settings')
            ->where('key', $validated['key'])
            ->value('value');

        if ($currentValue && Storage::disk('public')->exists($currentValue)) {
            Storage::disk('public')->delete($currentValue);
        }

        // Store new image
        $path = $request->file('image')->store('settings', 'public');

        DB::table('settings')
            ->updateOrInsert(
                ['key' => $validated['key']],
                [
                    'value' => $path,
                    'updated_at' => now(),
                ]
            );

        $this->clearSettingsCache();

        return back()->with('success', 'Image uploaded successfully.');
    }

    /**
     * Clear all caches.
     */
    public function clearCache()
    {
        $this->clearSettingsCache();
        
        // Clear application caches
        Artisan::call('cache:clear');
        Artisan::call('view:clear');
        
        return back()->with('success', 'All caches cleared successfully.');
    }

    /**
     * Delete an image setting.
     */
    public function deleteImage(Request $request)
    {
        $validated = $request->validate([
            'key' => 'required|string',
        ]);

        $currentValue = DB::table('settings')
            ->where('key', $validated['key'])
            ->value('value');

        if ($currentValue && Storage::disk('public')->exists($currentValue)) {
            Storage::disk('public')->delete($currentValue);
        }

        DB::table('settings')
            ->where('key', $validated['key'])
            ->update([
                'value' => null,
                'updated_at' => now(),
            ]);

        $this->clearSettingsCache();

        return back()->with('success', 'Image deleted successfully.');
    }

    /**
     * Clear settings-related caches.
     */
    private function clearSettingsCache(): void
    {
        Cache::forget('site_settings');
        Cache::forget('settings');
        Cache::forget('grouped_settings');
    }

    /**
     * Get settings grouped by category.
     */
    private function getGroupedSettings(): array
    {
        $settings = DB::table('settings')
            ->orderBy('group')
            ->orderBy('key')
            ->get()
            ->map(function ($setting) {
                return [
                    'id' => $setting->id,
                    'key' => $setting->key,
                    'value' => $setting->value,
                    'type' => $setting->type ?? 'text',
                    'group' => $setting->group ?? 'general',
                    'label' => $this->generateLabel($setting->key),
                    'description' => $this->getSettingDescription($setting->key),
                ];
            });

        return $settings->groupBy('group')->toArray();
    }

    /**
     * Generate a human-readable label from a setting key.
     */
    private function generateLabel(string $key): string
    {
        // Custom labels for specific keys
        $customLabels = [
            'thought_change_time' => 'Thought Change Time',
            'site_name' => 'Site Name',
            'site_tagline' => 'Site Tagline',
            'site_logo' => 'Site Logo',
            'site_favicon' => 'Site Favicon',
            'site_description' => 'Site Description',
            'cbse_affiliation_no' => 'CBSE Affiliation No.',
        ];

        if (isset($customLabels[$key])) {
            return $customLabels[$key];
        }

        // Convert snake_case to Title Case
        return ucwords(str_replace('_', ' ', $key));
    }

    /**
     * Get description for a setting key.
     */
    private function getSettingDescription(string $key): ?string
    {
        $descriptions = [
            'thought_change_time' => 'Time at which the "Today\'s Thought" changes to the next day\'s thought (24-hour format, e.g., 06:00 for 6 AM)',
            'site_name' => 'The name of your school displayed across the website',
            'site_tagline' => 'A short slogan or motto for the school',
            'site_description' => 'Brief description of the school for SEO purposes',
        ];

        return $descriptions[$key] ?? null;
    }

    /**
     * Get setting groups with labels.
     */
    private function getSettingGroups(): array
    {
        return [
            'general' => [
                'label' => 'General Settings',
                'description' => 'Basic site information and configuration',
                'fields' => [
                    'school_name' => ['label' => 'School Name', 'type' => 'text'],
                    'school_slogan' => ['label' => 'School Slogan', 'type' => 'text'],
                    'site_tagline' => ['label' => 'Site Tagline', 'type' => 'text'],
                    'academic_year' => ['label' => 'Academic Year', 'type' => 'text'],
                    'cbse_affiliation_no' => ['label' => 'CBSE Affiliation No.', 'type' => 'text'],
                    'school_code' => ['label' => 'School Code', 'type' => 'text'],
                ],
            ],
            'contact' => [
                'label' => 'Contact Information',
                'description' => 'School contact details',
                'fields' => [
                    'address' => ['label' => 'Address', 'type' => 'textarea'],
                    'phone_primary' => ['label' => 'Primary Phone', 'type' => 'text'],
                    'phone_secondary' => ['label' => 'Secondary Phone', 'type' => 'text'],
                    'email_primary' => ['label' => 'Primary Email', 'type' => 'email'],
                    'email_admissions' => ['label' => 'Admissions Email', 'type' => 'email'],
                    'working_hours' => ['label' => 'Working Hours', 'type' => 'text'],
                ],
            ],
            'social' => [
                'label' => 'Social Media',
                'description' => 'Social media links',
                'fields' => [
                    'facebook_url' => ['label' => 'Facebook URL', 'type' => 'url'],
                    'twitter_url' => ['label' => 'Twitter URL', 'type' => 'url'],
                    'instagram_url' => ['label' => 'Instagram URL', 'type' => 'url'],
                    'youtube_url' => ['label' => 'YouTube URL', 'type' => 'url'],
                    'linkedin_url' => ['label' => 'LinkedIn URL', 'type' => 'url'],
                ],
            ],
            'branding' => [
                'label' => 'Branding',
                'description' => 'Logos and brand assets',
                'fields' => [
                    'logo' => ['label' => 'Site Logo', 'type' => 'image'],
                    'logo_dark' => ['label' => 'Dark Mode Logo', 'type' => 'image'],
                    'favicon' => ['label' => 'Favicon', 'type' => 'image'],
                    'principal_photo' => ['label' => 'Principal Photo', 'type' => 'image'],
                ],
            ],
            'seo' => [
                'label' => 'SEO Settings',
                'description' => 'Search engine optimization',
                'fields' => [
                    'meta_title' => ['label' => 'Default Meta Title', 'type' => 'text'],
                    'meta_description' => ['label' => 'Default Meta Description', 'type' => 'textarea'],
                    'meta_keywords' => ['label' => 'Meta Keywords', 'type' => 'text'],
                    'google_analytics_id' => ['label' => 'Google Analytics ID', 'type' => 'text'],
                ],
            ],
            'content' => [
                'label' => 'Content Settings',
                'description' => 'Principal message and important content',
                'fields' => [
                    'principal_name' => ['label' => 'Principal Name', 'type' => 'text'],
                    'principal_designation' => ['label' => 'Principal Designation', 'type' => 'text'],
                    'principal_message' => ['label' => 'Principal Message', 'type' => 'textarea'],
                    'vision' => ['label' => 'Vision Statement', 'type' => 'textarea'],
                    'mission' => ['label' => 'Mission Statement', 'type' => 'textarea'],
                ],
            ],
        ];
    }
}
