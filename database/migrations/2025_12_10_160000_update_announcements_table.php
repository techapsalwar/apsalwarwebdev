<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, we need to modify the enum columns to support more values
        // Since MySQL doesn't easily support altering enums, we'll use string columns
        
        Schema::table('announcements', function (Blueprint $table) {
            // Change type from enum to string for flexibility
            $table->string('type_new', 50)->default('general')->after('content');
            $table->string('priority_new', 20)->default('medium')->after('type_new');
            $table->string('target_audience', 50)->nullable()->after('link');
        });

        // Copy existing data
        DB::statement("UPDATE announcements SET type_new = type, priority_new = priority");

        // Drop old columns and rename new ones
        Schema::table('announcements', function (Blueprint $table) {
            $table->dropColumn(['type', 'priority']);
        });

        Schema::table('announcements', function (Blueprint $table) {
            $table->renameColumn('type_new', 'type');
            $table->renameColumn('priority_new', 'priority');
        });

        // Add index
        Schema::table('announcements', function (Blueprint $table) {
            $table->index('type');
            $table->index('priority');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('announcements', function (Blueprint $table) {
            $table->dropIndex(['type']);
            $table->dropIndex(['priority']);
            $table->dropColumn('target_audience');
        });
    }
};
