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
        Schema::table('houses', function (Blueprint $table) {
            $table->string('house_master')->nullable()->after('description');
            $table->string('house_master_designation')->nullable()->after('house_master');
            $table->string('house_master_photo')->nullable()->after('house_master_designation');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('houses', function (Blueprint $table) {
            $table->dropColumn(['house_master', 'house_master_designation', 'house_master_photo']);
        });
    }
};
