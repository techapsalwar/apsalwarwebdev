<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Extended tables from school brochure analysis
     */
    public function up(): void
    {
        // Houses Table (Cariappa, Manekshaw, Raina, Thimayya)
        Schema::create('houses', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('color'); // Hex color code
            $table->string('motto')->nullable();
            $table->string('icon')->nullable();
            $table->string('image')->nullable();
            $table->text('description')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // House Points Tracking
        Schema::create('house_points', function (Blueprint $table) {
            $table->id();
            $table->foreignId('house_id')->constrained()->cascadeOnDelete();
            $table->year('academic_year');
            $table->string('event_name');
            $table->enum('category', ['sports', 'academics', 'cultural', 'discipline', 'other'])->default('other');
            $table->integer('points')->default(0);
            $table->text('remarks')->nullable();
            $table->date('event_date')->nullable();
            $table->foreignId('awarded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            
            $table->index(['house_id', 'academic_year']);
        });

        // House Leaders (Captains, Vice-Captains, Prefects)
        Schema::create('house_leaders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('house_id')->constrained()->cascadeOnDelete();
            $table->string('student_name');
            $table->string('class');
            $table->string('photo')->nullable();
            $table->enum('position', ['captain', 'vice_captain', 'prefect'])->default('prefect');
            $table->year('academic_year');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['house_id', 'academic_year']);
        });

        // Clubs / Hobby Clubs Table
        Schema::create('clubs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->string('icon')->nullable();
            $table->string('in_charge')->nullable(); // Teacher in charge
            $table->string('meeting_schedule')->nullable(); // e.g., "Every Saturday 2-4 PM"
            $table->boolean('is_active')->default(true);
            $table->boolean('accepts_enrollment')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        // Club Members / Enrollment
        Schema::create('club_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('club_id')->constrained()->cascadeOnDelete();
            $table->string('student_name');
            $table->string('class');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->year('academic_year');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamps();
            
            $table->index(['club_id', 'academic_year']);
        });

        // Facilities / Infrastructure
        Schema::create('facilities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->json('gallery')->nullable(); // Array of additional images
            $table->enum('category', [
                'lab',
                'classroom',
                'sports',
                'library',
                'auditorium',
                'playground',
                'special_room',
                'other'
            ])->default('other');
            $table->json('features')->nullable(); // Array of features
            $table->boolean('has_virtual_tour')->default(false);
            $table->string('virtual_tour_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('facilities');
        Schema::dropIfExists('club_members');
        Schema::dropIfExists('clubs');
        Schema::dropIfExists('house_leaders');
        Schema::dropIfExists('house_points');
        Schema::dropIfExists('houses');
    }
};
