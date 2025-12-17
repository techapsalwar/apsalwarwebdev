<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FeeStructure;
use App\Models\FeeType;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class FeeStructureController extends Controller
{
    /**
     * Display a listing of fee structures.
     */
    public function index(Request $request): Response
    {
        $query = FeeStructure::query();

        // Apply category filter
        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        // Apply class range filter
        if ($request->filled('class_range') && $request->class_range !== 'all') {
            $query->where('class_range', $request->class_range);
        }

        // Get sorted results
        $feeStructures = $query
            ->orderBy('category')
            ->orderByRaw("FIELD(class_range, 'nursery_ukg', 'i_v', 'vi_viii', 'ix_x', 'xi_xii')")
            ->paginate(50)
            ->withQueryString();

        // Get custom fee types
        $feeTypes = FeeType::active()->ordered()->get();

        return Inertia::render('admin/fee-structures/index', [
            'feeStructures' => $feeStructures,
            'filters' => $request->only(['category', 'class_range']),
            'categories' => FeeStructure::getCategoryOptions(),
            'classRanges' => FeeStructure::getClassRangeOptions(),
            'feeTypes' => $feeTypes,
        ]);
    }

    /**
     * Show the form for creating a new fee structure.
     */
    public function create(): Response
    {
        return Inertia::render('admin/fee-structures/create', [
            'categories' => FeeStructure::getCategoryOptions(),
            'classRanges' => FeeStructure::getClassRangeOptions(),
        ]);
    }

    /**
     * Store a newly created fee structure.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'academic_year' => 'required|integer|min:2020|max:2100',
            'category' => 'required|in:officers,jco,or,civilian',
            'class_range' => 'required|in:nursery_ukg,i_v,vi_viii,ix_x,xi_xii',
            'admission_fee' => 'required|numeric|min:0',
            'registration_fee' => 'required|numeric|min:0',
            'security_deposit' => 'required|numeric|min:0',
            'annual_fee' => 'required|numeric|min:0',
            'tuition_fee' => 'required|numeric|min:0',
            'computer_fee' => 'nullable|numeric|min:0',
            'science_fee' => 'nullable|numeric|min:0',
            'other_fees' => 'nullable|array',
            'notes' => 'nullable|string|max:1000',
            'is_active' => 'boolean',
        ]);

        // Check for duplicate
        $exists = FeeStructure::where('academic_year', $validated['academic_year'])
            ->where('category', $validated['category'])
            ->where('class_range', $validated['class_range'])
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'class_range' => 'A fee structure already exists for this category and class range in the selected academic year.',
            ])->withInput();
        }

        $validated['computer_fee'] = $validated['computer_fee'] ?? 0;
        $validated['science_fee'] = $validated['science_fee'] ?? 0;
        $validated['is_active'] = $validated['is_active'] ?? true;

        FeeStructure::create($validated);

        return redirect()
            ->route('admin.fee-structures.index')
            ->with('success', 'Fee structure created successfully.');
    }

    /**
     * Display the specified fee structure.
     */
    public function show(FeeStructure $feeStructure): Response
    {
        return Inertia::render('admin/fee-structures/show', [
            'feeStructure' => $feeStructure,
            'categories' => FeeStructure::getCategoryOptions(),
            'classRanges' => FeeStructure::getClassRangeOptions(),
        ]);
    }

    /**
     * Show the form for editing the specified fee structure.
     */
    public function edit(FeeStructure $feeStructure): Response
    {
        return Inertia::render('admin/fee-structures/edit', [
            'feeStructure' => $feeStructure,
            'categories' => FeeStructure::getCategoryOptions(),
            'classRanges' => FeeStructure::getClassRangeOptions(),
        ]);
    }

    /**
     * Update the specified fee structure.
     */
    public function update(Request $request, FeeStructure $feeStructure): RedirectResponse
    {
        $validated = $request->validate([
            'academic_year' => 'required|integer|min:2020|max:2100',
            'category' => 'required|in:officers,jco,or,civilian',
            'class_range' => 'required|in:nursery_ukg,i_v,vi_viii,ix_x,xi_xii',
            'admission_fee' => 'required|numeric|min:0',
            'registration_fee' => 'required|numeric|min:0',
            'security_deposit' => 'required|numeric|min:0',
            'annual_fee' => 'required|numeric|min:0',
            'tuition_fee' => 'required|numeric|min:0',
            'computer_fee' => 'nullable|numeric|min:0',
            'science_fee' => 'nullable|numeric|min:0',
            'other_fees' => 'nullable|array',
            'notes' => 'nullable|string|max:1000',
            'is_active' => 'boolean',
        ]);

        // Check for duplicate (exclude current record)
        $exists = FeeStructure::where('academic_year', $validated['academic_year'])
            ->where('category', $validated['category'])
            ->where('class_range', $validated['class_range'])
            ->where('id', '!=', $feeStructure->id)
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'class_range' => 'A fee structure already exists for this category and class range in the selected academic year.',
            ])->withInput();
        }

        $validated['computer_fee'] = $validated['computer_fee'] ?? 0;
        $validated['science_fee'] = $validated['science_fee'] ?? 0;

        $feeStructure->update($validated);

        return redirect()
            ->route('admin.fee-structures.index')
            ->with('success', 'Fee structure updated successfully.');
    }

    /**
     * Remove the specified fee structure.
     */
    public function destroy(FeeStructure $feeStructure): RedirectResponse
    {
        $feeStructure->delete();

        return redirect()
            ->route('admin.fee-structures.index')
            ->with('success', 'Fee structure deleted successfully.');
    }

    /**
     * Toggle the active status of a fee structure.
     */
    public function toggleActive(FeeStructure $feeStructure): RedirectResponse
    {
        $feeStructure->update(['is_active' => !$feeStructure->is_active]);

        $status = $feeStructure->is_active ? 'activated' : 'deactivated';

        return back()->with('success', "Fee structure {$status} successfully.");
    }

    /**
     * Bulk copy fee structures from one year to another.
     */
    public function copyToYear(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'from_year' => 'required|integer',
            'to_year' => 'required|integer|different:from_year',
        ]);

        $sourceFees = FeeStructure::where('academic_year', $validated['from_year'])->get();

        if ($sourceFees->isEmpty()) {
            return back()->withErrors([
                'from_year' => 'No fee structures found for the selected source year.',
            ]);
        }

        $copied = 0;
        foreach ($sourceFees as $fee) {
            $exists = FeeStructure::where('academic_year', $validated['to_year'])
                ->where('category', $fee->category)
                ->where('class_range', $fee->class_range)
                ->exists();

            if (!$exists) {
                $newFee = $fee->replicate();
                $newFee->academic_year = $validated['to_year'];
                $newFee->is_active = true;
                $newFee->save();
                $copied++;
            }
        }

        return back()->with('success', "{$copied} fee structure(s) copied to {$validated['to_year']}.");
    }

    /**
     * Store a new custom fee type (column).
     */
    public function storeFeeType(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'type' => 'required|in:one_time,recurring',
            'description' => 'nullable|string|max:255',
        ]);

        $feeType = FeeType::create([
            'name' => $validated['name'],
            'type' => $validated['type'],
            'description' => $validated['description'] ?? null,
            'is_active' => true,
            'sort_order' => FeeType::max('sort_order') + 1,
        ]);

        return back()->with('success', "Fee column '{$feeType->name}' added successfully.");
    }

    /**
     * Delete a custom fee type.
     */
    public function destroyFeeType(FeeType $feeType): RedirectResponse
    {
        $name = $feeType->name;
        $key = $feeType->key;

        // Remove this fee from all fee structures' other_fees
        $feeStructures = FeeStructure::whereNotNull('other_fees')->get();
        foreach ($feeStructures as $feeStructure) {
            $otherFees = $feeStructure->other_fees ?? [];
            if (isset($otherFees[$key])) {
                unset($otherFees[$key]);
                $feeStructure->update(['other_fees' => $otherFees ?: null]);
            }
        }

        $feeType->delete();

        return back()->with('success', "Fee column '{$name}' deleted successfully.");
    }

    /**
     * Toggle fee type active status.
     */
    public function toggleFeeTypeActive(FeeType $feeType): RedirectResponse
    {
        $feeType->update(['is_active' => !$feeType->is_active]);

        $status = $feeType->is_active ? 'shown' : 'hidden';

        return back()->with('success', "Fee column '{$feeType->name}' is now {$status}.");
    }
}
