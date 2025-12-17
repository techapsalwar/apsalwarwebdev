<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add registration and verification fields to alumni table
     */
    public function up(): void
    {
        Schema::table('alumni', function (Blueprint $table) {
            // Registration & Verification
            $table->string('phone')->nullable()->after('email');
            $table->string('verification_token')->nullable()->after('is_active');
            $table->timestamp('email_verified_at')->nullable()->after('verification_token');
            $table->enum('approval_status', ['pending', 'approved', 'rejected'])->default('pending')->after('email_verified_at');
            $table->text('rejection_reason')->nullable()->after('approval_status');
            $table->timestamp('approved_at')->nullable()->after('rejection_reason');
            $table->foreignId('approved_by')->nullable()->after('approved_at')->constrained('users')->nullOnDelete();
            
            // Additional Profile Fields
            $table->string('location')->nullable()->after('linkedin_url');
            $table->text('message_to_juniors')->nullable()->after('story');
            $table->json('social_links')->nullable()->after('location'); // Twitter, Instagram, etc.
            
            // Student Info During School
            $table->string('class_section')->nullable()->after('batch_year'); // e.g., "XII-A Science"
            $table->string('house')->nullable()->after('class_section'); // House during school
            $table->text('school_memories')->nullable()->after('message_to_juniors');
            $table->json('awards_during_school')->nullable()->after('school_memories');
            
            // Index for faster queries
            $table->index('approval_status');
            $table->index('email_verified_at');
            $table->index('verification_token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('alumni', function (Blueprint $table) {
            $table->dropForeign(['approved_by']);
            $table->dropIndex(['approval_status']);
            $table->dropIndex(['email_verified_at']);
            $table->dropIndex(['verification_token']);
            
            $table->dropColumn([
                'phone',
                'verification_token',
                'email_verified_at',
                'approval_status',
                'rejection_reason',
                'approved_at',
                'approved_by',
                'location',
                'message_to_juniors',
                'social_links',
                'class_section',
                'house',
                'school_memories',
                'awards_during_school',
            ]);
        });
    }
};
