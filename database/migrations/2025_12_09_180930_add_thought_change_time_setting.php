<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add the thought change time setting (default: midnight 00:00)
        DB::table('settings')->insertOrIgnore([
            'key' => 'thought_change_time',
            'value' => '00:00',
            'group' => 'general',
            'type' => 'time',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('settings')->where('key', 'thought_change_time')->delete();
    }
};
