<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Alumni, Literary Works, Results Analytics, and Competitive Exams tables
     */
    public function up(): void
    {
        // Alumni Achievements Table
        Schema::create('alumni', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('batch_year')->nullable(); // e.g., "2015", "2010"
            $table->string('photo')->nullable();
            $table->string('current_designation')->nullable();
            $table->string('organization')->nullable();
            $table->text('achievement')->nullable();
            $table->longText('story')->nullable();
            $table->string('email')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->enum('category', ['defense', 'civil_services', 'medical', 'engineering', 'business', 'arts', 'sports', 'other'])->default('other');
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_verified')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
            
            $table->index('category');
            $table->index('batch_year');
        });

        // Literary Works Table (BriBooks, Publications)
        Schema::create('literary_works', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('author_name');
            $table->string('author_class')->nullable(); // For student authors
            $table->enum('author_type', ['student', 'teacher', 'alumni'])->default('student');
            $table->text('description')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('isbn')->nullable();
            $table->string('publisher')->nullable();
            $table->year('publication_year')->nullable();
            $table->string('purchase_link')->nullable();
            $table->string('read_link')->nullable(); // Link to read online
            $table->enum('category', ['fiction', 'non_fiction', 'poetry', 'academic', 'other'])->default('other');
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        // Board Results Analytics (Detailed yearly data)
        Schema::create('board_results', function (Blueprint $table) {
            $table->id();
            $table->year('academic_year');
            $table->enum('board', ['cbse'])->default('cbse');
            $table->enum('class', ['X', 'XII'])->default('X');
            $table->unsignedInteger('appeared');
            $table->unsignedInteger('passed');
            $table->decimal('pass_percentage', 5, 2);
            $table->decimal('school_average', 5, 2)->nullable();
            $table->decimal('highest_marks', 5, 2)->nullable();
            $table->unsignedInteger('above_90_percent')->default(0);
            $table->unsignedInteger('above_80_percent')->default(0);
            $table->unsignedInteger('above_70_percent')->default(0);
            $table->unsignedInteger('above_60_percent')->default(0);
            $table->decimal('api_score', 5, 2)->nullable(); // Academic Performance Index
            $table->json('subject_wise_results')->nullable();
            $table->json('toppers')->nullable(); // Array of top 5 students
            $table->boolean('is_published')->default(false);
            $table->timestamps();
            
            $table->unique(['academic_year', 'class']);
        });

        // API Trends (Academic Performance Index History)
        Schema::create('api_trends', function (Blueprint $table) {
            $table->id();
            $table->year('academic_year');
            $table->enum('class', ['X', 'XII'])->default('X');
            $table->decimal('api_score', 5, 2);
            $table->decimal('previous_api', 5, 2)->nullable();
            $table->decimal('change_percentage', 5, 2)->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();
            
            $table->unique(['academic_year', 'class']);
        });

        // Competitive Exam Resources Table
        Schema::create('competitive_exams', function (Blueprint $table) {
            $table->id();
            $table->string('exam_name');
            $table->string('slug')->unique();
            $table->string('short_name')->nullable(); // e.g., "NDA", "NTSE"
            $table->text('description')->nullable();
            $table->longText('content')->nullable();
            $table->string('image')->nullable();
            $table->json('eligibility')->nullable(); // Class eligibility
            $table->json('resources')->nullable(); // Study materials, links
            $table->json('previous_selections')->nullable(); // Students who cleared
            $table->string('official_website')->nullable();
            $table->boolean('coaching_available')->default(false);
            $table->text('coaching_details')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        // Counseling Sessions Table
        Schema::create('counseling_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('student_name');
            $table->string('class');
            $table->string('parent_name')->nullable();
            $table->string('email');
            $table->string('phone');
            $table->enum('session_type', ['career', 'academic', 'personal', 'behavioral', 'other'])->default('other');
            $table->text('concern')->nullable();
            $table->date('preferred_date');
            $table->time('preferred_time')->nullable();
            $table->enum('status', ['pending', 'confirmed', 'completed', 'cancelled'])->default('pending');
            $table->text('counselor_notes')->nullable();
            $table->timestamp('session_at')->nullable();
            $table->timestamps();
            
            $table->index(['preferred_date', 'status']);
        });

        // School Statistics Table (For dashboard display)
        Schema::create('school_statistics', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('label');
            $table->string('value');
            $table->string('suffix')->nullable(); // e.g., "+", "%"
            $table->string('icon')->nullable();
            $table->string('description')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('show_on_homepage')->default(true);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('school_statistics');
        Schema::dropIfExists('counseling_sessions');
        Schema::dropIfExists('competitive_exams');
        Schema::dropIfExists('api_trends');
        Schema::dropIfExists('board_results');
        Schema::dropIfExists('literary_works');
        Schema::dropIfExists('alumni');
    }
};
