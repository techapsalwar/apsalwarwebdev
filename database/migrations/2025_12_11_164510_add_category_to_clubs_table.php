<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Categories:
     * - academic_interest: Environmental Club, Debate Club, Book Club, Photography & Writing Club, Astronomy Club, Robotics Club
     * - creative_physical: Dance Club, Music Club, Art Club, Gardening Club, Martial-Art Club
     */
    public function up(): void
    {
        Schema::table('clubs', function (Blueprint $table) {
            $table->enum('category', ['academic_interest', 'creative_physical'])->default('academic_interest')->after('name');
        });

        // Update existing clubs with correct categories
        DB::table('clubs')->whereIn('name', [
            'Environmental Club', 
            'Debate Club', 
            'Book Club', 
            'Photography & Writing Club', 
            'Astronomy Club', 
            'Robotics Club'
        ])->update(['category' => 'academic_interest']);

        DB::table('clubs')->whereIn('name', [
            'Dance Club', 
            'Music Club', 
            'Art Club', 
            'Gardening Club', 
            'Martial-Art Club'
        ])->update(['category' => 'creative_physical']);

        // Add Martial-Art Club if it doesn't exist
        $exists = DB::table('clubs')->where('name', 'Martial-Art Club')->exists();
        if (!$exists) {
            DB::table('clubs')->insert([
                'name' => 'Martial-Art Club',
                'slug' => 'martial-art-club',
                'description' => 'Learn self-defense techniques, discipline, and physical fitness through various martial arts forms.',
                'category' => 'creative_physical',
                'in_charge' => 'Sports Department',
                'is_active' => true,
                'accepts_enrollment' => true,
                'order' => 11,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clubs', function (Blueprint $table) {
            $table->dropColumn('category');
        });

        DB::table('clubs')->where('name', 'Martial-Art Club')->delete();
    }
};
