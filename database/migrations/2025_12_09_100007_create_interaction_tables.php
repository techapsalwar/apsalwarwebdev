<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Admission Inquiries Table
        Schema::create('admissions', function (Blueprint $table) {
            $table->id();
            $table->string('student_name');
            $table->string('parent_name');
            $table->string('email');
            $table->string('phone');
            $table->string('alternate_phone')->nullable();
            $table->string('class_seeking'); // e.g., "Class 1", "Class 6"
            $table->year('academic_year')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->text('current_school')->nullable();
            $table->text('address')->nullable();
            $table->enum('category', ['officers', 'jco', 'or', 'civilian'])->nullable();
            $table->text('message')->nullable();
            $table->enum('status', ['pending', 'contacted', 'scheduled', 'admitted', 'rejected'])->default('pending');
            $table->text('admin_notes')->nullable();
            $table->foreignId('handled_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('contacted_at')->nullable();
            $table->timestamps();
            
            $table->index('status');
            $table->index('created_at');
        });

        // Contact Form Submissions
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('subject');
            $table->text('message');
            $table->enum('category', ['general', 'admission', 'feedback', 'complaint', 'other'])->default('general');
            $table->enum('status', ['unread', 'read', 'replied', 'archived'])->default('unread');
            $table->text('admin_reply')->nullable();
            $table->foreignId('replied_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('replied_at')->nullable();
            $table->timestamps();
            
            $table->index('status');
        });

        // Newsletter Subscriptions
        Schema::create('newsletters', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('name')->nullable();
            $table->boolean('is_active')->default(true);
            $table->string('token')->nullable(); // For unsubscribe
            $table->timestamp('subscribed_at')->nullable();
            $table->timestamp('unsubscribed_at')->nullable();
            $table->timestamps();
        });

        // Appointment Bookings
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->enum('purpose', ['admission', 'tc', 'meeting', 'counseling', 'other'])->default('other');
            $table->text('message')->nullable();
            $table->date('preferred_date');
            $table->time('preferred_time')->nullable();
            $table->enum('status', ['pending', 'confirmed', 'completed', 'cancelled'])->default('pending');
            $table->text('admin_notes')->nullable();
            $table->foreignId('handled_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            
            $table->index(['preferred_date', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
        Schema::dropIfExists('newsletters');
        Schema::dropIfExists('contacts');
        Schema::dropIfExists('admissions');
    }
};
