<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Add location, capacity, and equipment fields to facilities table.
     */
    public function up(): void
    {
        Schema::table('facilities', function (Blueprint $table) {
            $table->string('location')->nullable()->after('features');
            $table->string('capacity')->nullable()->after('location');
            $table->json('equipment')->nullable()->after('capacity');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('facilities', function (Blueprint $table) {
            $table->dropColumn(['location', 'capacity', 'equipment']);
        });
    }
};
