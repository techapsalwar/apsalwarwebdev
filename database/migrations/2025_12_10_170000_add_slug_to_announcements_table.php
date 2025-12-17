<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('announcements', function (Blueprint $table) {
            $table->string('slug')->nullable()->unique()->after('title');
        });

        // Generate slugs for existing announcements
        $announcements = DB::table('announcements')->get();
        foreach ($announcements as $announcement) {
            $slug = Str::slug($announcement->title);
            $originalSlug = $slug;
            $counter = 1;
            
            // Ensure unique slug
            while (DB::table('announcements')->where('slug', $slug)->where('id', '!=', $announcement->id)->exists()) {
                $slug = $originalSlug . '-' . $counter;
                $counter++;
            }
            
            DB::table('announcements')
                ->where('id', $announcement->id)
                ->update(['slug' => $slug]);
        }

        // Make slug required after populating existing records
        Schema::table('announcements', function (Blueprint $table) {
            $table->string('slug')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('announcements', function (Blueprint $table) {
            $table->dropColumn('slug');
        });
    }
};
