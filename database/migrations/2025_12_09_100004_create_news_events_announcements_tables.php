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
        // News Articles Table
        Schema::create('news', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt')->nullable();
            $table->longText('content');
            $table->string('featured_image')->nullable();
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->boolean('is_featured')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->unsignedInteger('views')->default(0);
            $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            
            $table->index('published_at');
            $table->index('status');
        });

        // Events Table
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->longText('content')->nullable();
            $table->string('featured_image')->nullable();
            $table->string('venue')->nullable();
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->boolean('is_all_day')->default(false);
            $table->enum('status', ['upcoming', 'ongoing', 'completed', 'cancelled'])->default('upcoming');
            $table->boolean('is_featured')->default(false);
            $table->string('registration_link')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            
            $table->index('start_date');
            $table->index('status');
        });

        // Announcements / Notices Table
        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->enum('type', ['general', 'important', 'urgent'])->default('general');
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            $table->boolean('is_active')->default(true);
            $table->boolean('show_in_ticker')->default(false);
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('attachment')->nullable();
            $table->string('link')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            
            $table->index(['is_active', 'start_date', 'end_date']);
        });

        // Thought of the Day / Affirmations Table
        Schema::create('affirmations', function (Blueprint $table) {
            $table->id();
            $table->text('quote');
            $table->string('author')->nullable();
            $table->date('display_date')->unique();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index('display_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('affirmations');
        Schema::dropIfExists('announcements');
        Schema::dropIfExists('events');
        Schema::dropIfExists('news');
    }
};
