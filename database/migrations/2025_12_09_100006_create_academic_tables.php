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
        // Departments Table
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('icon')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Staff / Faculty Table
        Schema::create('staff', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('designation');
            $table->foreignId('department_id')->nullable()->constrained()->nullOnDelete();
            $table->string('photo')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->text('qualifications')->nullable();
            $table->text('experience')->nullable();
            $table->text('bio')->nullable();
            $table->json('subjects')->nullable(); // Array of subjects taught
            $table->enum('type', ['teaching', 'non_teaching', 'management'])->default('teaching');
            $table->date('joining_date')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('show_on_website')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
            
            $table->index('department_id');
            $table->index('type');
        });

        // Achievements Table
        Schema::create('achievements', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->enum('category', [
                'academic',
                'sports',
                'cultural',
                'ncc',
                'co_curricular',
                'faculty',
                'school',
                'other'
            ])->default('other');
            $table->enum('level', ['school', 'district', 'state', 'national', 'international'])->nullable();
            $table->string('achiever_name')->nullable(); // Student/Teacher name
            $table->string('achiever_class')->nullable(); // Class if student
            $table->date('achievement_date')->nullable();
            $table->year('academic_year')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
            
            $table->index('category');
            $table->index('level');
        });

        // Testimonials Table
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('content');
            $table->string('photo')->nullable();
            $table->enum('type', ['student', 'parent', 'alumni', 'other'])->default('other');
            $table->string('designation')->nullable(); // e.g., "Class X, 2023" or "Parent of Student"
            $table->tinyInteger('rating')->nullable(); // 1-5
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        // TC Records Table
        Schema::create('tc_records', function (Blueprint $table) {
            $table->id();
            $table->string('tc_number')->unique();
            $table->string('student_name');
            $table->string('father_name');
            $table->string('admission_number')->nullable();
            $table->string('class')->nullable();
            $table->date('date_of_issue');
            $table->string('pdf_path')->nullable();
            $table->boolean('is_verified')->default(true);
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            
            $table->index('tc_number');
            $table->index('student_name');
        });

        // Board Results Table
        Schema::create('results', function (Blueprint $table) {
            $table->id();
            $table->year('academic_year');
            $table->enum('exam', ['class_10', 'class_12'])->default('class_10');
            $table->unsignedInteger('total_students');
            $table->unsignedInteger('passed_students');
            $table->decimal('pass_percentage', 5, 2);
            $table->decimal('highest_percentage', 5, 2)->nullable();
            $table->string('topper_name')->nullable();
            $table->string('topper_photo')->nullable();
            $table->json('subject_toppers')->nullable(); // Array of subject-wise toppers
            $table->json('percentage_distribution')->nullable(); // 90%+, 80-90%, etc.
            $table->boolean('is_published')->default(false);
            $table->timestamps();
            
            $table->unique(['academic_year', 'exam']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('results');
        Schema::dropIfExists('tc_records');
        Schema::dropIfExists('testimonials');
        Schema::dropIfExists('achievements');
        Schema::dropIfExists('staff');
        Schema::dropIfExists('departments');
    }
};
