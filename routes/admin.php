<?php

use App\Http\Controllers\Admin\AchievementController;
use App\Http\Controllers\Admin\AffirmationController;
use App\Http\Controllers\Admin\AlbumController;
use App\Http\Controllers\Admin\AlumniController;
use App\Http\Controllers\Admin\AnnouncementController;
use App\Http\Controllers\Admin\BoardResultController;
use App\Http\Controllers\Admin\ClubController;
use App\Http\Controllers\Admin\CommitteeController;
use App\Http\Controllers\Admin\ContactController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DepartmentController;
use App\Http\Controllers\Admin\DocumentController;
use App\Http\Controllers\Admin\EventController;
use App\Http\Controllers\Admin\FacilityController;
use App\Http\Controllers\Admin\FeeStructureController;
use App\Http\Controllers\Admin\HouseController;
use App\Http\Controllers\Admin\NewsController;
use App\Http\Controllers\Admin\PartnershipController;
use App\Http\Controllers\Admin\QuickLinkController;
use App\Http\Controllers\Admin\SiteSettingsController;
use App\Http\Controllers\Admin\SliderController;
use App\Http\Controllers\Admin\StaffController;
use App\Http\Controllers\Admin\TcRecordController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
|
| Here is where you can register admin routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group and the "auth" middleware.
|
*/

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard - accessible with dashboard permission
    Route::middleware('permission:dashboard')->group(function () {
        Route::get('/', DashboardController::class)->name('dashboard');
    });

    // User Management - restricted to super_admin only
    Route::middleware('permission:users')->group(function () {
        Route::resource('users', UserController::class);
        Route::post('users/{user}/toggle-active', [UserController::class, 'toggleActive'])
            ->name('users.toggle-active');
        Route::post('users/{user}/permissions', [UserController::class, 'updatePermissions'])
            ->name('users.permissions');
    });

    // Sliders Management
    Route::middleware('permission:sliders')->group(function () {
        Route::resource('sliders', SliderController::class)->except(['show']);
        Route::post('sliders/{slider}/toggle-active', [SliderController::class, 'toggleActive'])
            ->name('sliders.toggle-active');
        Route::post('sliders/reorder', [SliderController::class, 'reorder'])
            ->name('sliders.reorder');
    });

    // Quick Links Management
    Route::middleware('permission:quick_links')->group(function () {
        Route::resource('quick-links', QuickLinkController::class)->except(['show']);
        Route::post('quick-links/{quickLink}/toggle-active', [QuickLinkController::class, 'toggleActive'])
            ->name('quick-links.toggle-active');
        Route::post('quick-links/reorder', [QuickLinkController::class, 'reorder'])
            ->name('quick-links.reorder');
    });

    // Affirmations Management
    Route::middleware('permission:affirmations')->group(function () {
        Route::get('affirmations/bulk-create', [AffirmationController::class, 'bulkCreate'])
            ->name('affirmations.bulk-create');
        Route::post('affirmations/bulk-store', [AffirmationController::class, 'bulkStore'])
            ->name('affirmations.bulk-store');
        Route::post('affirmations/change-time', [AffirmationController::class, 'updateChangeTime'])
            ->name('affirmations.change-time');
        Route::resource('affirmations', AffirmationController::class)->except(['show']);
        Route::post('affirmations/{affirmation}/toggle-active', [AffirmationController::class, 'toggleActive'])
            ->name('affirmations.toggle-active');
    });

    // Achievements Management
    Route::middleware('permission:achievements')->group(function () {
        Route::resource('achievements', AchievementController::class);
        Route::post('achievements/{achievement}/toggle-active', [AchievementController::class, 'toggleActive'])
            ->name('achievements.toggle-active');
        Route::post('achievements/{achievement}/toggle-featured', [AchievementController::class, 'toggleFeatured'])
            ->name('achievements.toggle-featured');
    });

    // News Management
    Route::middleware('permission:news')->group(function () {
        Route::resource('news', NewsController::class);
    });

    // Events Management
    Route::middleware('permission:events')->group(function () {
        Route::resource('events', EventController::class);
    });

    // Announcements Management
    Route::middleware('permission:announcements')->group(function () {
        Route::resource('announcements', AnnouncementController::class);
        Route::post('announcements/{id}/toggle-active', [AnnouncementController::class, 'toggleActive'])
            ->name('announcements.toggle-active');
    });

    // Departments Management
    Route::middleware('permission:departments')->group(function () {
        Route::resource('departments', DepartmentController::class);
        Route::post('departments/{id}/toggle-active', [DepartmentController::class, 'toggleActive'])
            ->name('departments.toggle-active');
        Route::post('departments/reorder', [DepartmentController::class, 'reorder'])
            ->name('departments.reorder');
    });

    // Staff Management
    Route::middleware('permission:staff')->group(function () {
        Route::resource('staff', StaffController::class);
        Route::post('staff/{id}/toggle-active', [StaffController::class, 'toggleActive'])
            ->name('staff.toggle-active');
        Route::post('staff/reorder', [StaffController::class, 'reorder'])
            ->name('staff.reorder');
    });

    // Houses Management
    Route::middleware('permission:houses')->group(function () {
        Route::resource('houses', HouseController::class);
        Route::post('houses/{id}/toggle-active', [HouseController::class, 'toggleActive'])
            ->name('houses.toggle-active');
        Route::post('houses/{id}/add-points', [HouseController::class, 'addPoints'])
            ->name('houses.add-points');
        Route::delete('houses/{id}/points/{pointId}', [HouseController::class, 'deletePoint'])
            ->name('houses.delete-point');
    });

    // Clubs Management
    Route::middleware('permission:clubs')->group(function () {
        Route::resource('clubs', ClubController::class)->except(['show']);
        Route::post('clubs/{club}/toggle-active', [ClubController::class, 'toggleActive'])
            ->name('clubs.toggle-active');
        Route::post('clubs/{club}/toggle-enrollment', [ClubController::class, 'toggleEnrollment'])
            ->name('clubs.toggle-enrollment');
        Route::post('clubs/reorder', [ClubController::class, 'reorder'])
            ->name('clubs.reorder');
        
        // Club Enrollments Management
        Route::get('clubs/enrollments', [ClubController::class, 'enrollments'])
            ->name('clubs.enrollments');
        Route::get('clubs/enrollments/export', [ClubController::class, 'exportEnrollments'])
            ->name('clubs.enrollments.export');
        Route::post('clubs/enrollments/bulk-approve', [ClubController::class, 'bulkApproveEnrollments'])
            ->name('clubs.enrollments.bulk-approve');
        Route::post('clubs/enrollments/{enrollment}/approve', [ClubController::class, 'approveEnrollment'])
            ->name('clubs.enrollments.approve');
        Route::post('clubs/enrollments/{enrollment}/reject', [ClubController::class, 'rejectEnrollment'])
            ->name('clubs.enrollments.reject');
    });

    // Photo Albums Management
    Route::middleware('permission:albums')->group(function () {
        Route::resource('albums', AlbumController::class)->except(['show']);
        Route::post('albums/{album}/toggle-featured', [AlbumController::class, 'toggleFeatured'])
            ->name('albums.toggle-featured');
        Route::post('albums/{album}/toggle-status', [AlbumController::class, 'toggleStatus'])
            ->name('albums.toggle-status');
        Route::post('albums/{album}/photos', [AlbumController::class, 'uploadPhotos'])
            ->name('albums.photos.upload');
        Route::put('albums/{album}/photos/{photo}', [AlbumController::class, 'updatePhoto'])
            ->name('albums.photos.update');
        Route::delete('albums/{album}/photos/{photo}', [AlbumController::class, 'deletePhoto'])
            ->name('albums.photos.delete');
        Route::post('albums/{album}/photos/reorder', [AlbumController::class, 'reorderPhotos'])
            ->name('albums.photos.reorder');
        Route::post('albums/{album}/photos/{photo}/set-cover', [AlbumController::class, 'setPhotoCover'])
            ->name('albums.photos.set-cover');
    });

    // Documents Management
    Route::middleware('permission:documents')->group(function () {
        Route::resource('documents', DocumentController::class)->except(['show']);
        Route::post('documents/{document}/toggle-active', [DocumentController::class, 'toggleActive'])
            ->name('documents.toggle-active');
        Route::get('documents/{document}/download', [DocumentController::class, 'download'])
            ->name('documents.download');
    });

    // Contacts Management
    Route::middleware('permission:contacts')->group(function () {
        Route::get('contacts', [ContactController::class, 'index'])->name('contacts.index');
        Route::get('contacts/{contact}', [ContactController::class, 'show'])->name('contacts.show');
        Route::post('contacts/{contact}/reply', [ContactController::class, 'reply'])->name('contacts.reply');
        Route::post('contacts/{contact}/status', [ContactController::class, 'updateStatus'])->name('contacts.update-status');
        Route::delete('contacts/{contact}', [ContactController::class, 'destroy'])->name('contacts.destroy');
        Route::post('contacts/bulk-status', [ContactController::class, 'bulkUpdateStatus'])->name('contacts.bulk-status');
        Route::post('contacts/bulk-delete', [ContactController::class, 'bulkDelete'])->name('contacts.bulk-delete');
    });

    // Facilities Management
    Route::middleware('permission:facilities')->group(function () {
        Route::resource('facilities', FacilityController::class)->scoped(['facility' => 'id']);
        Route::post('facilities/{facility}/toggle-active', [FacilityController::class, 'toggleActive'])
            ->name('facilities.toggle-active')
            ->where('facility', '[0-9]+');
        Route::post('facilities/reorder', [FacilityController::class, 'reorder'])
            ->name('facilities.reorder');
    });

    // Committees Management
    Route::middleware('permission:committees')->group(function () {
        Route::resource('committees', CommitteeController::class)->except(['show'])->parameters(['committees' => 'committee'])->where(['committee' => '[0-9]+']);
        Route::post('committees/{committee}/toggle-active', [CommitteeController::class, 'toggleActive'])
            ->name('committees.toggle-active')
            ->where('committee', '[0-9]+');
        // Committee Members
        Route::post('committees/{committee}/members', [CommitteeController::class, 'storeMember'])
            ->name('committees.members.store')
            ->where('committee', '[0-9]+');
        Route::put('committees/{committee}/members/{member}', [CommitteeController::class, 'updateMember'])
            ->name('committees.members.update')
            ->where(['committee' => '[0-9]+', 'member' => '[0-9]+']);
        Route::delete('committees/{committee}/members/{member}', [CommitteeController::class, 'destroyMember'])
            ->name('committees.members.destroy')
            ->where(['committee' => '[0-9]+', 'member' => '[0-9]+']);
        Route::post('committees/{committee}/members/reorder', [CommitteeController::class, 'reorderMembers'])
            ->name('committees.members.reorder')
            ->where('committee', '[0-9]+');
    });

    // Alumni Management
    Route::middleware('permission:alumni')->group(function () {
        Route::get('alumni', [AlumniController::class, 'index'])->name('alumni.index');
        // Static routes MUST come before wildcard routes
        Route::post('alumni/bulk-approve', [AlumniController::class, 'bulkApprove'])->name('alumni.bulk-approve');
        // Wildcard routes
        Route::get('alumni/{alumnus}', [AlumniController::class, 'show'])->name('alumni.show');
        Route::get('alumni/{alumnus}/edit', [AlumniController::class, 'edit'])->name('alumni.edit');
        Route::put('alumni/{alumnus}', [AlumniController::class, 'update'])->name('alumni.update');
        Route::delete('alumni/{alumnus}', [AlumniController::class, 'destroy'])->name('alumni.destroy');
        Route::post('alumni/{alumnus}/approve', [AlumniController::class, 'approve'])->name('alumni.approve');
        Route::post('alumni/{alumnus}/reject', [AlumniController::class, 'reject'])->name('alumni.reject');
        Route::post('alumni/{alumnus}/toggle-featured', [AlumniController::class, 'toggleFeatured'])->name('alumni.toggle-featured');
        Route::post('alumni/{alumnus}/verify-email', [AlumniController::class, 'verifyEmail'])->name('alumni.verify-email');
        Route::post('alumni/{alumnus}/resend-verification', [AlumniController::class, 'resendVerification'])->name('alumni.resend-verification');
    });

    // Site Settings
    Route::middleware('permission:settings')->group(function () {
        Route::get('settings', [SiteSettingsController::class, 'index'])->name('settings.index');
        Route::post('settings', [SiteSettingsController::class, 'update'])->name('settings.update');
        Route::post('settings/single', [SiteSettingsController::class, 'updateSingle'])->name('settings.update-single');
        Route::post('settings/upload-image', [SiteSettingsController::class, 'uploadImage'])->name('settings.upload-image');
        Route::post('settings/clear-cache', [SiteSettingsController::class, 'clearCache'])->name('settings.clear-cache');
        Route::post('settings/delete-image', [SiteSettingsController::class, 'deleteImage'])->name('settings.delete-image');
    });

    // Testimonials Management
    Route::middleware('permission:testimonials')->group(function () {
        Route::resource('testimonials', TestimonialController::class)->except(['show']);
        Route::post('testimonials/{testimonial}/toggle-active', [TestimonialController::class, 'toggleActive'])
            ->name('testimonials.toggle-active');
        Route::post('testimonials/{testimonial}/toggle-featured', [TestimonialController::class, 'toggleFeatured'])
            ->name('testimonials.toggle-featured');
        Route::post('testimonials/reorder', [TestimonialController::class, 'reorder'])
            ->name('testimonials.reorder');
    });

    // Fee Structures Management
    Route::middleware('permission:fee_structures')->group(function () {
        Route::resource('fee-structures', FeeStructureController::class);
        Route::post('fee-structures/{fee_structure}/toggle-active', [FeeStructureController::class, 'toggleActive'])
            ->name('fee-structures.toggle-active');
        Route::post('fee-structures/copy-to-year', [FeeStructureController::class, 'copyToYear'])
            ->name('fee-structures.copy-to-year');
        
        // Fee Types (Custom Columns) Management
        Route::post('fee-types', [FeeStructureController::class, 'storeFeeType'])
            ->name('fee-types.store');
        Route::delete('fee-types/{fee_type}', [FeeStructureController::class, 'destroyFeeType'])
            ->name('fee-types.destroy');
        Route::post('fee-types/{fee_type}/toggle-active', [FeeStructureController::class, 'toggleFeeTypeActive'])
            ->name('fee-types.toggle-active');
    });

    // Transfer Certificates Management
    Route::middleware('permission:tc_records')->group(function () {
        Route::get('tc-records/bulk-upload', [TcRecordController::class, 'bulkUploadForm'])
            ->name('tc-records.bulk-upload');
        Route::post('tc-records/bulk-upload', [TcRecordController::class, 'bulkUpload'])
            ->name('tc-records.bulk-upload.process');
        Route::get('tc-records/download-template', [TcRecordController::class, 'downloadTemplate'])
            ->name('tc-records.download-template');
        Route::resource('tc-records', TcRecordController::class);
        Route::post('tc-records/{tc_record}/toggle-verified', [TcRecordController::class, 'toggleVerified'])
            ->name('tc-records.toggle-verified');
        Route::get('tc-records/{tc_record}/download', [TcRecordController::class, 'download'])
            ->name('tc-records.download');
    });

    // Board Results Management
    Route::middleware('permission:board_results')->group(function () {
        Route::resource('board-results', BoardResultController::class);
        Route::post('board-results/{board_result}/toggle-publish', [BoardResultController::class, 'togglePublish'])
            ->name('board-results.toggle-publish');
    });

    // Partnerships Management
    Route::middleware('permission:partnerships')->group(function () {
        Route::resource('partnerships', PartnershipController::class)->except(['show']);
        Route::post('partnerships/{partnership}/toggle-active', [PartnershipController::class, 'toggleActive'])
            ->name('partnerships.toggle-active');
        Route::post('partnerships/reorder', [PartnershipController::class, 'reorder'])
            ->name('partnerships.reorder');
    });
});
