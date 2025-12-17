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
        Schema::table('events', function (Blueprint $table) {
            // Event type for categorization
            $table->string('event_type', 50)->nullable()->after('content');
            
            // Short description for previews
            $table->string('short_description', 500)->nullable()->after('description');
            
            // Organizer and contact information
            $table->string('organizer')->nullable()->after('venue');
            $table->string('contact_email')->nullable()->after('organizer');
            $table->string('contact_phone', 20)->nullable()->after('contact_email');
            
            // Registration settings
            $table->boolean('registration_required')->default(false)->after('registration_link');
            $table->dateTime('registration_deadline')->nullable()->after('registration_required');
            $table->integer('max_participants')->nullable()->after('registration_deadline');
            $table->integer('current_participants')->default(0)->after('max_participants');
            
            // Google Form registration link (for external registration)
            $table->string('google_form_url')->nullable()->after('registration_link');
            $table->string('google_sheet_url')->nullable()->after('google_form_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn([
                'event_type',
                'short_description',
                'organizer',
                'contact_email',
                'contact_phone',
                'registration_required',
                'registration_deadline',
                'max_participants',
                'current_participants',
                'google_form_url',
                'google_sheet_url',
            ]);
        });
    }
};
