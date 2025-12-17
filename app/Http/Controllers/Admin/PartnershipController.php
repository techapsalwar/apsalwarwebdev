<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Partnership;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PartnershipController extends Controller
{
    public const TYPES = [
        'technology' => 'Technology Partner',
        'educational' => 'Educational Institution',
        'corporate' => 'Corporate Partner',
        'government' => 'Government Body',
        'ngo' => 'NGO / Foundation',
        'other' => 'Other',
    ];

    public function index(Request $request)
    {
        $query = Partnership::query();

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('partner_name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Type filter
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        $partnerships = $query->orderBy('order')
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->through(function ($partnership) {
                return [
                    'id' => $partnership->id,
                    'partner_name' => $partnership->partner_name,
                    'slug' => $partnership->slug,
                    'description' => $partnership->description,
                    'logo' => $partnership->logo,
                    'logo_url' => $partnership->logo_url,
                    'website_url' => $partnership->website_url,
                    'type' => $partnership->type,
                    'type_label' => $partnership->type_label,
                    'benefits' => $partnership->benefits,
                    'is_active' => $partnership->is_active,
                    'order' => $partnership->order,
                    'created_at' => $partnership->created_at->format('d M Y'),
                ];
            })
            ->withQueryString();

        return Inertia::render('admin/partnerships/index', [
            'partnerships' => $partnerships,
            'filters' => $request->only(['search', 'type', 'status']),
            'types' => self::TYPES,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/partnerships/create', [
            'types' => self::TYPES,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'partner_name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'logo' => 'nullable|file|mimes:png,svg,jpeg,jpg,webp|max:2048',
            'website_url' => 'nullable|url|max:255',
            'type' => 'required|string|in:' . implode(',', array_keys(self::TYPES)),
            'benefits' => 'nullable|array',
            'benefits.*' => 'string|max:255',
            'is_active' => 'boolean',
        ]);

        // Generate slug
        $validated['slug'] = Str::slug($validated['partner_name']);

        // Handle logo upload
        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('partnerships', 'public');
        }

        // Set order
        $validated['order'] = Partnership::max('order') + 1;

        Partnership::create($validated);

        return redirect()->route('admin.partnerships.index')
            ->with('success', 'Partnership created successfully.');
    }

    public function edit(Partnership $partnership)
    {
        return Inertia::render('admin/partnerships/edit', [
            'partnership' => [
                'id' => $partnership->id,
                'partner_name' => $partnership->partner_name,
                'slug' => $partnership->slug,
                'description' => $partnership->description,
                'logo' => $partnership->logo,
                'logo_url' => $partnership->logo_url,
                'website_url' => $partnership->website_url,
                'type' => $partnership->type,
                'benefits' => $partnership->benefits ?? [],
                'is_active' => $partnership->is_active,
                'order' => $partnership->order,
            ],
            'types' => self::TYPES,
        ]);
    }

    public function update(Request $request, Partnership $partnership)
    {
        $validated = $request->validate([
            'partner_name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'logo' => 'nullable|file|mimes:png,svg,jpeg,jpg,webp|max:2048',
            'website_url' => 'nullable|url|max:255',
            'type' => 'required|string|in:' . implode(',', array_keys(self::TYPES)),
            'benefits' => 'nullable|array',
            'benefits.*' => 'string|max:255',
            'is_active' => 'boolean',
        ]);

        // Handle logo upload
        if ($request->hasFile('logo')) {
            // Delete old logo
            if ($partnership->logo && !str_starts_with($partnership->logo, 'http')) {
                Storage::disk('public')->delete($partnership->logo);
            }
            $validated['logo'] = $request->file('logo')->store('partnerships', 'public');
        }

        $partnership->update($validated);

        return redirect()->route('admin.partnerships.index')
            ->with('success', 'Partnership updated successfully.');
    }

    public function destroy(Partnership $partnership)
    {
        // Delete logo
        if ($partnership->logo && !str_starts_with($partnership->logo, 'http')) {
            Storage::disk('public')->delete($partnership->logo);
        }

        $partnership->delete();

        return redirect()->route('admin.partnerships.index')
            ->with('success', 'Partnership deleted successfully.');
    }

    public function toggleActive(Partnership $partnership)
    {
        $partnership->update(['is_active' => !$partnership->is_active]);

        return back()->with('success', 'Partnership status updated.');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:partnerships,id',
            'items.*.order' => 'required|integer|min:0',
        ]);

        foreach ($request->items as $item) {
            Partnership::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return back()->with('success', 'Order updated successfully.');
    }
}
