<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\AboutController;
use App\Http\Controllers\AcademicsController;
use App\Http\Controllers\AchievementController;
use App\Http\Controllers\AdmissionsController;
use App\Http\Controllers\AlbumController;
use App\Http\Controllers\AlumniController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\BeyondAcademicsController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\FacilitiesController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\TcVerificationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

// Public Routes
Route::get('/', HomeController::class)->name('home');

// Announcements/Notices Pages
Route::get('/announcements', [AnnouncementController::class, 'index'])->name('announcements.index');
Route::get('/announcements/{announcement}', [AnnouncementController::class, 'show'])->name('announcements.show');

// Achievements Pages
Route::get('/achievements', [AchievementController::class, 'index'])->name('achievements.index');
Route::get('/achievements/{achievement}', [AchievementController::class, 'show'])->name('achievements.show');

// Photo Albums Pages
Route::get('/albums', [AlbumController::class, 'index'])->name('albums.index');
Route::get('/albums/{album}', [AlbumController::class, 'show'])->name('albums.show');

// News Pages
Route::get('/news', [NewsController::class, 'index'])->name('news.index');
Route::get('/news/{slug}', [NewsController::class, 'show'])->name('news.show');

// Downloads/Documents Pages
Route::get('/downloads', [DocumentController::class, 'index'])->name('downloads.index');
Route::get('/downloads/category/{category}', [DocumentController::class, 'category'])->name('downloads.category');
Route::get('/downloads/{document:slug}/download', [DocumentController::class, 'download'])->name('downloads.download');

// Events Pages
Route::get('/events', [EventController::class, 'index'])->name('events.index');
Route::get('/events/{slug}', [EventController::class, 'show'])->name('events.show');
Route::get('/events/{slug}/register', [EventController::class, 'register'])->name('events.register');

// About Pages
Route::prefix('about')->group(function () {
    Route::get('/', [AboutController::class, 'index'])->name('about');
    Route::get('/principal-message', [AboutController::class, 'principalMessage'])->name('about.principal');
    Route::get('/vision-mission', [AboutController::class, 'visionMission'])->name('about.vision');
    Route::get('/management', [AboutController::class, 'management'])->name('about.management');
    Route::get('/history', [AboutController::class, 'history'])->name('about.history');
});

// Academics Pages
Route::prefix('academics')->group(function () {
    Route::get('/', [AcademicsController::class, 'index'])->name('academics');
    Route::get('/results', [AcademicsController::class, 'results'])->name('academics.results');
    Route::get('/departments', [AcademicsController::class, 'departments'])->name('academics.departments');
    Route::get('/faculty', [AcademicsController::class, 'faculty'])->name('academics.faculty');
    Route::get('/faculty/{staff}', [AcademicsController::class, 'facultyShow'])->name('academics.faculty.show');
    Route::get('/curriculum', [AcademicsController::class, 'curriculum'])->name('academics.curriculum');
    Route::get('/calendar', [AcademicsController::class, 'calendar'])->name('academics.calendar');
    Route::get('/competitive-exams', [AcademicsController::class, 'competitive'])->name('academics.competitive');
});

// Facilities Pages
Route::get('/facilities', [FacilitiesController::class, 'index'])->name('facilities');
Route::get('/facilities/{slug}', [FacilitiesController::class, 'show'])->name('facilities.show');

// Contact Page
Route::get('/contact', [ContactController::class, 'index'])->name('contact');
Route::post('/contact', [ContactController::class, 'submit'])->name('contact.submit');

// Admissions Pages
Route::prefix('admissions')->group(function () {
    Route::get('/', [AdmissionsController::class, 'index'])->name('admissions');
    Route::get('/process', [AdmissionsController::class, 'process'])->name('admissions.process');
    Route::get('/fee-structure', [AdmissionsController::class, 'feeStructure'])->name('admissions.fee-structure');
    Route::get('/faqs', [AdmissionsController::class, 'faqs'])->name('admissions.faqs');
    Route::get('/transfer-certificate', [TcVerificationController::class, 'index'])->name('admissions.tc');
    Route::post('/transfer-certificate/{tcRecord}/verify', [TcVerificationController::class, 'verify'])
        ->name('admissions.tc.verify')
        ->middleware('throttle:5,5');
    Route::get('/transfer-certificate/{tcRecord}/download', [TcVerificationController::class, 'download'])
        ->name('tc.download');
});

// Beyond Academics Pages
Route::prefix('beyond-academics')->group(function () {
    Route::get('/', [BeyondAcademicsController::class, 'index'])->name('beyond-academics');
    Route::get('/houses', [BeyondAcademicsController::class, 'houses'])->name('beyond-academics.houses');
    Route::get('/houses/{slug}', [BeyondAcademicsController::class, 'houseShow'])->name('beyond-academics.houses.show');
    Route::get('/clubs', [BeyondAcademicsController::class, 'clubs'])->name('beyond-academics.clubs');
    Route::get('/clubs/{slug}', [BeyondAcademicsController::class, 'clubShow'])->name('beyond-academics.clubs.show');
    Route::post('/clubs/{slug}/enroll', [BeyondAcademicsController::class, 'clubEnroll'])->name('beyond-academics.clubs.enroll');
    Route::get('/ncc', [BeyondAcademicsController::class, 'ncc'])->name('beyond-academics.ncc');
    Route::get('/sports', [BeyondAcademicsController::class, 'sports'])->name('beyond-academics.sports');
    Route::get('/activities', [BeyondAcademicsController::class, 'activities'])->name('beyond-academics.activities');
});

// Student Life redirect to Beyond Academics
Route::prefix('student-life')->group(function () {
    Route::redirect('/', '/beyond-academics');
    Route::redirect('/clubs', '/beyond-academics/clubs');
    Route::redirect('/houses', '/beyond-academics/houses');
    Route::redirect('/ncc', '/beyond-academics/ncc');
    Route::redirect('/sports', '/beyond-academics/sports');
});

// Alumni Pages
Route::prefix('alumni')->group(function () {
    Route::get('/', [AlumniController::class, 'index'])->name('alumni');
    Route::get('/register', [AlumniController::class, 'register'])->name('alumni.register');
    Route::post('/register', [AlumniController::class, 'store'])->name('alumni.store');
    Route::get('/registration-success', [AlumniController::class, 'registrationSuccess'])->name('alumni.registration-success');
    Route::get('/verify/{token}', [AlumniController::class, 'verify'])->name('alumni.verify');
    Route::post('/resend-verification', [AlumniController::class, 'resendVerification'])->name('alumni.resend-verification');
    Route::get('/{slug}', [AlumniController::class, 'show'])->name('alumni.show');
});

// Authenticated Routes (Admin Dashboard) - Legacy route for compatibility
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
});

// Include admin routes
require __DIR__.'/admin.php';
require __DIR__.'/settings.php';
