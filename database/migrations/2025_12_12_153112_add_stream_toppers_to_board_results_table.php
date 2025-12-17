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
        Schema::table('board_results', function (Blueprint $table) {
            // Stream field for Class XII (Science, Commerce, Humanities)
            $table->string('stream')->nullable()->after('class');
            
            // Class X Toppers (top 5 students)
            $table->json('class_x_toppers')->nullable()->after('toppers');
            
            // Class XII Stream-wise Toppers
            $table->json('science_toppers')->nullable()->after('class_x_toppers');
            $table->json('commerce_toppers')->nullable()->after('science_toppers');
            $table->json('humanities_toppers')->nullable()->after('commerce_toppers');
            
            // Overall school topper (single topper for display)
            $table->string('overall_topper_name')->nullable()->after('humanities_toppers');
            $table->decimal('overall_topper_percentage', 5, 2)->nullable()->after('overall_topper_name');
            $table->string('overall_topper_photo')->nullable()->after('overall_topper_percentage');
            $table->string('overall_topper_stream')->nullable()->after('overall_topper_photo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('board_results', function (Blueprint $table) {
            $table->dropColumn([
                'stream',
                'class_x_toppers',
                'science_toppers',
                'commerce_toppers',
                'humanities_toppers',
                'overall_topper_name',
                'overall_topper_percentage',
                'overall_topper_photo',
                'overall_topper_stream',
            ]);
        });
    }
};
