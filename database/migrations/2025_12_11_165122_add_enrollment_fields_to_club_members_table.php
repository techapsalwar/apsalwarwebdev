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
        Schema::table('club_members', function (Blueprint $table) {
            $table->string('admission_number', 50)->nullable()->after('class');
            $table->string('parent_phone', 15)->nullable()->after('phone');
            $table->text('reason')->nullable()->after('academic_year');
            
            // Add index for faster lookups
            $table->index(['admission_number', 'academic_year']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('club_members', function (Blueprint $table) {
            $table->dropIndex(['admission_number', 'academic_year']);
            $table->dropColumn(['admission_number', 'parent_phone', 'reason']);
        });
    }
};
