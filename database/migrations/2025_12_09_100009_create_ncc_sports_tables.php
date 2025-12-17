<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * NCC and Sports related tables
     */
    public function up(): void
    {
        // NCC Cadets Table
        Schema::create('ncc_cadets', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('class');
            $table->string('enrollment_number')->nullable()->unique();
            $table->enum('rank', [
                'cadet',
                'lance_corporal',
                'corporal',
                'sergeant',
                'under_officer',
                'senior_under_officer',
                'cadet_sergeant_major'
            ])->default('cadet');
            $table->string('photo')->nullable();
            $table->date('enrollment_date')->nullable();
            $table->year('academic_year');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index('academic_year');
        });

        // NCC Achievements Table
        Schema::create('ncc_achievements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cadet_id')->nullable()->constrained('ncc_cadets')->nullOnDelete();
            $table->string('cadet_name')->nullable(); // For non-linked entries
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('type', ['camp', 'medal', 'promotion', 'certification', 'other'])->default('other');
            $table->enum('level', ['unit', 'district', 'state', 'national', 'international'])->nullable();
            $table->string('image')->nullable();
            $table->date('achievement_date')->nullable();
            $table->year('academic_year')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });

        // Sports Teams Table
        Schema::create('sports_teams', function (Blueprint $table) {
            $table->id();
            $table->string('sport_name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('icon')->nullable();
            $table->string('image')->nullable();
            $table->string('coach_name')->nullable();
            $table->enum('category', ['outdoor', 'indoor', 'athletics', 'martial_arts', 'other'])->default('other');
            $table->boolean('is_active')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        // Sports Team Members
        Schema::create('sports_team_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_id')->constrained('sports_teams')->cascadeOnDelete();
            $table->string('student_name');
            $table->string('class');
            $table->string('photo')->nullable();
            $table->string('position')->nullable(); // e.g., "Captain", "Goalkeeper", etc.
            $table->year('academic_year');
            $table->boolean('is_captain')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['team_id', 'academic_year']);
        });

        // Sports Achievements Table
        Schema::create('sports_achievements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_id')->nullable()->constrained('sports_teams')->nullOnDelete();
            $table->string('sport_name')->nullable(); // For non-linked entries
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('level', ['school', 'district', 'state', 'national', 'international'])->default('school');
            $table->enum('position', ['gold', 'silver', 'bronze', 'winner', 'runner_up', 'participant', 'other'])->nullable();
            $table->string('player_name')->nullable();
            $table->string('player_class')->nullable();
            $table->string('image')->nullable();
            $table->date('achievement_date')->nullable();
            $table->year('academic_year')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
            
            $table->index('level');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sports_achievements');
        Schema::dropIfExists('sports_team_members');
        Schema::dropIfExists('sports_teams');
        Schema::dropIfExists('ncc_achievements');
        Schema::dropIfExists('ncc_cadets');
    }
};
