<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TcRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use ZipArchive;

class TcRecordController extends Controller
{
    /**
     * Display a listing of TC records.
     */
    public function index(Request $request): Response
    {
        $query = TcRecord::with('uploader:id,name');

        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('student_name', 'like', "%{$search}%")
                    ->orWhere('tc_number', 'like', "%{$search}%")
                    ->orWhere('admission_number', 'like', "%{$search}%")
                    ->orWhere('father_name', 'like', "%{$search}%");
            });
        }

        // Apply class filter
        if ($request->filled('class') && $request->class !== 'all') {
            $query->where('class', $request->class);
        }

        // Apply verification filter
        if ($request->filled('is_verified') && $request->is_verified !== 'all') {
            $query->where('is_verified', $request->boolean('is_verified'));
        }

        // Get sorted results
        $tcRecords = $query
            ->orderBy('created_at', 'desc')
            ->paginate(20)
            ->withQueryString();

        // Get unique classes for filter
        $classes = TcRecord::distinct()->pluck('class')->sort()->values();

        return Inertia::render('admin/tc-records/index', [
            'tcRecords' => $tcRecords,
            'filters' => $request->only(['search', 'class', 'is_verified']),
            'classes' => $classes,
        ]);
    }

    /**
     * Show the form for creating a new TC record.
     */
    public function create(): Response
    {
        return Inertia::render('admin/tc-records/create');
    }

    /**
     * Store a newly created TC record.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'tc_number' => 'required|string|max:50|unique:tc_records,tc_number',
            'student_name' => 'required|string|max:255',
            'father_name' => 'required|string|max:255',
            'admission_number' => 'required|string|max:50',
            'class' => 'required|string|max:20',
            'date_of_issue' => 'required|date',
            'pdf' => 'required|file|mimes:pdf|max:5120', // 5MB max
        ]);

        // Store the PDF
        $pdfPath = $request->file('pdf')->store('tc-records', 'private');

        TcRecord::create([
            'tc_number' => $validated['tc_number'],
            'student_name' => $validated['student_name'],
            'father_name' => $validated['father_name'],
            'admission_number' => $validated['admission_number'],
            'class' => $validated['class'],
            'date_of_issue' => $validated['date_of_issue'],
            'pdf_path' => $pdfPath,
            'is_verified' => true,
            'uploaded_by' => auth()->id(),
        ]);

        return redirect()
            ->route('admin.tc-records.index')
            ->with('success', 'Transfer Certificate uploaded successfully.');
    }

    /**
     * Display the specified TC record.
     */
    public function show(TcRecord $tcRecord): Response
    {
        $tcRecord->load('uploader:id,name');

        return Inertia::render('admin/tc-records/show', [
            'tcRecord' => $tcRecord,
        ]);
    }

    /**
     * Show the form for editing the specified TC record.
     */
    public function edit(TcRecord $tcRecord): Response
    {
        return Inertia::render('admin/tc-records/edit', [
            'tcRecord' => $tcRecord,
        ]);
    }

    /**
     * Update the specified TC record.
     */
    public function update(Request $request, TcRecord $tcRecord): RedirectResponse
    {
        $validated = $request->validate([
            'tc_number' => 'required|string|max:50|unique:tc_records,tc_number,' . $tcRecord->id,
            'student_name' => 'required|string|max:255',
            'father_name' => 'required|string|max:255',
            'admission_number' => 'required|string|max:50',
            'class' => 'required|string|max:20',
            'date_of_issue' => 'required|date',
            'pdf' => 'nullable|file|mimes:pdf|max:5120',
        ]);

        // Update PDF if new one uploaded
        if ($request->hasFile('pdf')) {
            // Delete old PDF
            if ($tcRecord->pdf_path) {
                Storage::disk('private')->delete($tcRecord->pdf_path);
            }
            $validated['pdf_path'] = $request->file('pdf')->store('tc-records', 'private');
        }

        unset($validated['pdf']);
        $tcRecord->update($validated);

        return redirect()
            ->route('admin.tc-records.index')
            ->with('success', 'Transfer Certificate updated successfully.');
    }

    /**
     * Remove the specified TC record.
     */
    public function destroy(TcRecord $tcRecord): RedirectResponse
    {
        // Delete the PDF file
        if ($tcRecord->pdf_path) {
            Storage::disk('private')->delete($tcRecord->pdf_path);
        }

        $tcRecord->delete();

        return redirect()
            ->route('admin.tc-records.index')
            ->with('success', 'Transfer Certificate deleted successfully.');
    }

    /**
     * Download the TC PDF (admin only).
     */
    public function download(TcRecord $tcRecord)
    {
        if (!$tcRecord->pdf_path || !Storage::disk('private')->exists($tcRecord->pdf_path)) {
            abort(404, 'PDF file not found.');
        }

        return Storage::disk('private')->download(
            $tcRecord->pdf_path,
            "TC_{$tcRecord->tc_number}_{$tcRecord->student_name}.pdf"
        );
    }

    /**
     * Show bulk upload form.
     */
    public function bulkUploadForm(): Response
    {
        return Inertia::render('admin/tc-records/bulk-upload');
    }

    /**
     * Process bulk upload (CSV + ZIP).
     */
    public function bulkUpload(Request $request): RedirectResponse
    {
        $request->validate([
            'csv_file' => 'required|file|mimes:csv,txt|max:2048',
            'zip_file' => 'required|file|mimes:zip|max:102400', // 100MB max
        ]);

        $csvFile = $request->file('csv_file');
        $zipFile = $request->file('zip_file');

        // Parse CSV
        $csvData = [];
        $handle = fopen($csvFile->getPathname(), 'r');
        $headers = fgetcsv($handle);

        // Normalize headers
        $headers = array_map(function ($header) {
            return strtolower(trim(str_replace([' ', '-'], '_', $header)));
        }, $headers);

        // Expected headers
        $expectedHeaders = ['tc_number', 'student_name', 'father_name', 'admission_number', 'class', 'date_of_issue', 'pdf_filename'];

        // Validate headers
        $missingHeaders = array_diff($expectedHeaders, $headers);
        if (!empty($missingHeaders)) {
            fclose($handle);
            return back()->withErrors([
                'csv_file' => 'Missing required columns: ' . implode(', ', $missingHeaders),
            ])->withInput();
        }

        $rowNumber = 1;
        while (($row = fgetcsv($handle)) !== false) {
            $rowNumber++;
            if (count($row) !== count($headers)) {
                continue; // Skip malformed rows
            }
            $data = array_combine($headers, $row);
            $data['row_number'] = $rowNumber;
            $csvData[] = $data;
        }
        fclose($handle);

        if (empty($csvData)) {
            return back()->withErrors([
                'csv_file' => 'CSV file is empty or contains no valid data.',
            ])->withInput();
        }

        // Extract ZIP
        $zip = new ZipArchive();
        $tempDir = storage_path('app/temp/tc-bulk-' . uniqid());

        if ($zip->open($zipFile->getPathname()) !== true) {
            return back()->withErrors([
                'zip_file' => 'Failed to open ZIP file.',
            ])->withInput();
        }

        if (!mkdir($tempDir, 0755, true)) {
            return back()->withErrors([
                'zip_file' => 'Failed to create temp directory.',
            ])->withInput();
        }

        $zip->extractTo($tempDir);
        $zip->close();

        // Get all PDFs from ZIP (including subdirectories)
        $pdfFiles = [];
        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($tempDir, \RecursiveDirectoryIterator::SKIP_DOTS)
        );
        foreach ($iterator as $file) {
            if (strtolower($file->getExtension()) === 'pdf') {
                $pdfFiles[strtolower($file->getFilename())] = $file->getPathname();
            }
        }

        // Process records
        $created = 0;
        $skipped = 0;
        $errors = [];

        DB::beginTransaction();
        try {
            foreach ($csvData as $data) {
                $pdfFilename = strtolower(trim($data['pdf_filename']));

                // Check if TC already exists
                if (TcRecord::where('tc_number', $data['tc_number'])->exists()) {
                    $skipped++;
                    $errors[] = "Row {$data['row_number']}: TC #{$data['tc_number']} already exists.";
                    continue;
                }

                // Find PDF file
                if (!isset($pdfFiles[$pdfFilename])) {
                    $skipped++;
                    $errors[] = "Row {$data['row_number']}: PDF file '{$data['pdf_filename']}' not found in ZIP.";
                    continue;
                }

                // Store PDF
                $pdfPath = 'tc-records/' . uniqid() . '_' . $pdfFilename;
                Storage::disk('private')->put($pdfPath, file_get_contents($pdfFiles[$pdfFilename]));

                // Create record
                TcRecord::create([
                    'tc_number' => trim($data['tc_number']),
                    'student_name' => trim($data['student_name']),
                    'father_name' => trim($data['father_name']),
                    'admission_number' => trim($data['admission_number']),
                    'class' => trim($data['class']),
                    'date_of_issue' => date('Y-m-d', strtotime($data['date_of_issue'])),
                    'pdf_path' => $pdfPath,
                    'is_verified' => true,
                    'uploaded_by' => auth()->id(),
                ]);

                $created++;
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            // Clean up temp directory
            $this->deleteDirectory($tempDir);

            return back()->withErrors([
                'csv_file' => 'An error occurred: ' . $e->getMessage(),
            ])->withInput();
        }

        // Clean up temp directory
        $this->deleteDirectory($tempDir);

        $message = "{$created} Transfer Certificate(s) uploaded successfully.";
        if ($skipped > 0) {
            $message .= " {$skipped} record(s) skipped.";
        }

        return redirect()
            ->route('admin.tc-records.index')
            ->with('success', $message)
            ->with('bulk_errors', $errors);
    }

    /**
     * Toggle verification status.
     */
    public function toggleVerified(TcRecord $tcRecord): RedirectResponse
    {
        $tcRecord->update(['is_verified' => !$tcRecord->is_verified]);

        $status = $tcRecord->is_verified ? 'verified' : 'unverified';

        return back()->with('success', "Transfer Certificate marked as {$status}.");
    }

    /**
     * Download sample CSV template for bulk upload.
     */
    public function downloadTemplate()
    {
        $headers = ['tc_number', 'student_name', 'father_name', 'admission_number', 'class', 'date_of_issue', 'pdf_filename'];
        $sampleData = [
            ['TC-2025-001', 'Rahul Sharma', 'Rajesh Sharma', 'ADM-2020-001', 'XII', '2025-03-15', 'rahul_sharma_tc.pdf'],
            ['TC-2025-002', 'Priya Singh', 'Amit Singh', 'ADM-2019-042', 'X', '2025-03-15', 'priya_singh_tc.pdf'],
        ];

        $callback = function () use ($headers, $sampleData) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $headers);
            foreach ($sampleData as $row) {
                fputcsv($file, $row);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="tc_bulk_upload_template.csv"',
        ]);
    }

    /**
     * Delete a directory recursively.
     */
    private function deleteDirectory(string $dir): bool
    {
        if (!is_dir($dir)) {
            return false;
        }

        $files = array_diff(scandir($dir), ['.', '..']);
        foreach ($files as $file) {
            $path = $dir . DIRECTORY_SEPARATOR . $file;
            is_dir($path) ? $this->deleteDirectory($path) : unlink($path);
        }

        return rmdir($dir);
    }
}
