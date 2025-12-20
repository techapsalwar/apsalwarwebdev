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
        Schema::create('mandatory_disclosures', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category')->nullable(); // e.g., "General", "Infrastructure", "Faculty", etc.
            $table->string('file_path');
            $table->string('file_name')->nullable(); // Original filename
            $table->integer('file_size')->nullable(); // File size in bytes
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mandatory_disclosures');
    }
};
