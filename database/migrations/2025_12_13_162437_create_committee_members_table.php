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
        Schema::create('committee_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('committee_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('designation');
            $table->string('role')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('photo')->nullable();
            $table->text('bio')->nullable();
            $table->string('organization')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['committee_id', 'order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('committee_members');
    }
};
