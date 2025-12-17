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
        // Photo Albums Table
        Schema::create('albums', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('cover_image')->nullable();
            $table->year('year')->nullable();
            $table->tinyInteger('month')->nullable(); // 1-12
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->boolean('is_featured')->default(false);
            $table->integer('order')->default(0);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            
            $table->index(['year', 'month']);
        });

        // Photos Table
        Schema::create('photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('album_id')->constrained()->cascadeOnDelete();
            $table->string('title')->nullable();
            $table->string('filename');
            $table->string('path');
            $table->string('thumbnail_path')->nullable();
            $table->text('alt_text')->nullable();
            $table->text('caption')->nullable();
            $table->unsignedInteger('file_size')->nullable(); // in bytes
            $table->unsignedInteger('width')->nullable();
            $table->unsignedInteger('height')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
            
            $table->index('album_id');
        });

        // Videos Table
        Schema::create('videos', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('youtube_url');
            $table->string('youtube_id')->nullable();
            $table->string('thumbnail')->nullable();
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->boolean('is_featured')->default(false);
            $table->integer('order')->default(0);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        // Documents / Downloads Table
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('filename');
            $table->string('path');
            $table->string('file_type')->nullable(); // pdf, doc, xlsx, etc.
            $table->unsignedInteger('file_size')->nullable(); // in bytes
            $table->enum('category', [
                'circular',
                'academic',
                'form',
                'report',
                'policy',
                'newsletter',
                'other'
            ])->default('other');
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('download_count')->default(0);
            $table->date('valid_from')->nullable();
            $table->date('valid_until')->nullable();
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            
            $table->index('category');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
        Schema::dropIfExists('videos');
        Schema::dropIfExists('photos');
        Schema::dropIfExists('albums');
    }
};
