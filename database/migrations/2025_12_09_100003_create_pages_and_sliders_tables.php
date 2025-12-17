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
        // Static Pages Table
        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->longText('content')->nullable();
            $table->string('featured_image')->nullable();
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->string('meta_keywords')->nullable();
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->string('template')->default('default'); // default, about, contact, etc.
            $table->integer('order')->default(0);
            $table->boolean('show_in_menu')->default(false);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        // Homepage Sliders Table
        Schema::create('sliders', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->text('description')->nullable();
            $table->string('image');
            $table->string('button_text')->nullable();
            $table->string('button_link')->nullable();
            $table->string('button_text_2')->nullable();
            $table->string('button_link_2')->nullable();
            $table->enum('text_position', ['left', 'center', 'right'])->default('center');
            $table->boolean('is_active')->default(true);
            $table->integer('order')->default(0);
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->timestamps();
        });

        // Quick Links Table
        Schema::create('quick_links', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('url');
            $table->string('icon')->nullable();
            $table->enum('target', ['_self', '_blank'])->default('_self');
            $table->boolean('is_active')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quick_links');
        Schema::dropIfExists('sliders');
        Schema::dropIfExists('pages');
    }
};
