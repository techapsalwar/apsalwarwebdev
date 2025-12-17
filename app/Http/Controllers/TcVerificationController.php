<?php

namespace App\Http\Controllers;

use App\Models\TcRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\RateLimiter;
use Inertia\Inertia;
use Inertia\Response;

class TcVerificationController extends Controller
{
    /**
     * Show the TC search page with all verified records.
     */
    public function index(): Response
    {
        // Get all verified TC records
        $records = TcRecord::verified()
            ->select('id', 'tc_number', 'student_name', 'father_name', 'class', 'date_of_issue')
            ->orderBy('date_of_issue', 'desc')
            ->orderBy('student_name')
            ->get();

        return Inertia::render('tc-verification/index', [
            'records' => $records,
            'recaptchaSiteKey' => config('services.recaptcha.site_key'),
        ]);
    }

    /**
     * Verify admission number and download TC.
     */
    public function verify(Request $request, TcRecord $tcRecord)
    {
        $request->validate([
            'admission_number' => 'required|string',
            'recaptcha_token' => 'required|string',
        ]);

        // Verify reCAPTCHA
        $recaptchaValid = $this->verifyRecaptcha($request->recaptcha_token);
        if (!$recaptchaValid) {
            return response()->json([
                'success' => false,
                'message' => 'reCAPTCHA verification failed. Please try again.',
            ], 422);
        }

        // Rate limiting for verification attempts
        $key = 'tc-verify:' . $request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'success' => false,
                'message' => "Too many verification attempts. Please try again in {$seconds} seconds.",
            ], 429);
        }
        RateLimiter::hit($key, 300); // 5 minutes window

        // Check if TC is verified
        if (!$tcRecord->is_verified) {
            return response()->json([
                'success' => false,
                'message' => 'This Transfer Certificate is not available for download.',
            ], 403);
        }

        // Verify admission number (case-insensitive)
        if (strtolower(trim($request->admission_number)) !== strtolower(trim($tcRecord->admission_number))) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid admission number. Please check and try again.',
            ], 422);
        }

        // Generate temporary signed download URL
        $downloadUrl = route('tc.download', [
            'tcRecord' => $tcRecord->id,
            'token' => $this->generateDownloadToken($tcRecord),
        ]);

        return response()->json([
            'success' => true,
            'download_url' => $downloadUrl,
            'expires_in' => 300, // 5 minutes
        ]);
    }

    /**
     * Download TC after verification.
     */
    public function download(Request $request, TcRecord $tcRecord)
    {
        $token = $request->query('token');

        if (!$token || !$this->validateDownloadToken($tcRecord, $token)) {
            abort(403, 'Invalid or expired download link.');
        }

        if (!$tcRecord->pdf_path || !Storage::disk('private')->exists($tcRecord->pdf_path)) {
            abort(404, 'PDF file not found.');
        }

        // Increment download count if needed (for analytics)
        // $tcRecord->increment('download_count');

        return Storage::disk('private')->download(
            $tcRecord->pdf_path,
            "TC_{$tcRecord->tc_number}_{$tcRecord->student_name}.pdf"
        );
    }

    /**
     * Verify Google reCAPTCHA token.
     */
    private function verifyRecaptcha(string $token): bool
    {
        $secretKey = config('services.recaptcha.secret_key');

        if (!$secretKey) {
            // If reCAPTCHA is not configured, skip verification in development
            return app()->environment('local', 'development');
        }

        $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
            'secret' => $secretKey,
            'response' => $token,
            'remoteip' => request()->ip(),
        ]);

        $data = $response->json();

        return $data['success'] ?? false;
    }

    /**
     * Generate a time-limited download token.
     */
    private function generateDownloadToken(TcRecord $tcRecord): string
    {
        $data = [
            'id' => $tcRecord->id,
            'expires' => now()->addMinutes(5)->timestamp,
        ];

        return base64_encode(
            hash_hmac('sha256', json_encode($data), config('app.key')) .
            '|' . $data['expires']
        );
    }

    /**
     * Validate a download token.
     */
    private function validateDownloadToken(TcRecord $tcRecord, string $token): bool
    {
        try {
            $decoded = base64_decode($token);
            [$hash, $expires] = explode('|', $decoded);

            // Check if expired
            if ((int)$expires < now()->timestamp) {
                return false;
            }

            // Verify hash
            $data = [
                'id' => $tcRecord->id,
                'expires' => (int)$expires,
            ];

            $expectedHash = hash_hmac('sha256', json_encode($data), config('app.key'));

            return hash_equals($expectedHash, $hash);
        } catch (\Exception $e) {
            return false;
        }
    }
}
