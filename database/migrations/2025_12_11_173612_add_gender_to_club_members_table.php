<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('club_members', function (Blueprint $table) {
            $table->enum('gender', ['male', 'female'])->default('male')->after('class');
        });
        
        // Update existing records with random gender based on names
        $maleNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Shaurya', 'Atharva', 'Advik', 'Pranav', 'Advaith', 'Aarush', 'Kabir', 'Ritvik', 'Anirudh', 'Dhruv'];
        $femaleNames = ['Ananya', 'Aadhya', 'Myra', 'Sara', 'Aanya', 'Ira', 'Aarohi', 'Pari', 'Anika', 'Navya', 'Diya', 'Kiara', 'Avni', 'Saanvi', 'Ishita', 'Prisha', 'Anvi', 'Riya', 'Tanya', 'Kavya'];
        
        // Update gender based on first name
        foreach ($femaleNames as $name) {
            DB::table('club_members')
                ->where('student_name', 'like', $name . ' %')
                ->update(['gender' => 'female']);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('club_members', function (Blueprint $table) {
            $table->dropColumn('gender');
        });
    }
};
