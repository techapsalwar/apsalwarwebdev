<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Committees, Initiatives, and Administrative tables
     */
    public function up(): void
    {
        // School Committees Table
        Schema::create('committees', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->text('functions')->nullable();
            $table->string('chairman')->nullable();
            $table->string('convenor')->nullable();
            $table->json('members')->nullable(); // Array of member names
            $table->string('image')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        // Special Initiatives Table
        Schema::create('initiatives', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('short_name')->nullable(); // e.g., "CRISP", "P2E"
            $table->text('description')->nullable();
            $table->longText('content')->nullable();
            $table->string('image')->nullable();
            $table->json('gallery')->nullable();
            $table->string('partner')->nullable(); // e.g., "AWES-UNICEF", "CBSE"
            $table->string('website_url')->nullable();
            $table->enum('status', ['active', 'completed', 'upcoming'])->default('active');
            $table->boolean('is_featured')->default(false);
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        // Guest Lectures Table
        Schema::create('guest_lectures', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('speaker_name');
            $table->string('speaker_designation')->nullable();
            $table->string('speaker_photo')->nullable();
            $table->text('description')->nullable();
            $table->longText('content')->nullable();
            $table->string('topic');
            $table->date('lecture_date');
            $table->time('lecture_time')->nullable();
            $table->string('venue')->nullable();
            $table->string('featured_image')->nullable();
            $table->json('gallery')->nullable();
            $table->string('video_url')->nullable();
            $table->enum('status', ['upcoming', 'completed', 'cancelled'])->default('upcoming');
            $table->timestamps();
            
            $table->index('lecture_date');
        });

        // Technology Partnerships Table
        Schema::create('partnerships', function (Blueprint $table) {
            $table->id();
            $table->string('partner_name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('logo')->nullable();
            $table->string('website_url')->nullable();
            $table->enum('type', ['technology', 'educational', 'corporate', 'government', 'ngo', 'other'])->default('other');
            $table->json('benefits')->nullable(); // Array of benefits
            $table->boolean('is_active')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        // Fee Structure Table
        Schema::create('fee_structures', function (Blueprint $table) {
            $table->id();
            $table->year('academic_year');
            $table->enum('category', ['officers', 'jco', 'or', 'civilian'])->default('civilian');
            $table->string('class_range'); // e.g., "Nursery-KG", "I-V", "VI-VIII", "IX-X", "XI-XII"
            $table->decimal('admission_fee', 10, 2)->default(0);
            $table->decimal('registration_fee', 10, 2)->default(0);
            $table->decimal('security_deposit', 10, 2)->default(0);
            $table->decimal('annual_fee', 10, 2)->default(0);
            $table->decimal('tuition_fee', 10, 2)->default(0); // Monthly
            $table->decimal('computer_fee', 10, 2)->default(0); // Monthly
            $table->decimal('science_fee', 10, 2)->default(0); // Monthly (for science stream)
            $table->json('other_fees')->nullable(); // Any additional fees
            $table->text('notes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['academic_year', 'category']);
        });

        // Celebrations / Events Calendar
        Schema::create('celebrations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->json('gallery')->nullable();
            $table->enum('category', [
                'national',
                'school',
                'cultural',
                'religious',
                'awareness',
                'academic',
                'sports',
                'other'
            ])->default('other');
            $table->date('celebration_date')->nullable();
            $table->boolean('is_annual')->default(true);
            $table->year('academic_year')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('celebrations');
        Schema::dropIfExists('fee_structures');
        Schema::dropIfExists('partnerships');
        Schema::dropIfExists('guest_lectures');
        Schema::dropIfExists('initiatives');
        Schema::dropIfExists('committees');
    }
};
