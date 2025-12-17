<?php

namespace Database\Seeders;

use App\Models\FeeStructure;
use Illuminate\Database\Seeder;

class FeeStructureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * Fee data based on APS Alwar School Brochure 2025-26
     */
    public function run(): void
    {
        // Clear existing data
        FeeStructure::truncate();

        $academicYear = 2025;

        // Fee structure data from brochure
        $feeData = [
            // Officers Category
            [
                'category' => 'officers',
                'class_range' => 'nursery_ukg',
                'registration_fee' => 500,
                'admission_fee' => 2100,
                'security_deposit' => 6000,
                'annual_fee' => 7047,
                'tuition_fee' => 2551,
                'computer_fee' => 404,
                'science_fee' => 0,
                'other_fees' => [
                    'pupil_fee' => 576,
                    'library' => 733,
                    'building' => 1008,
                    'exam_stationery' => 480,
                    'games_sports' => 742,
                    'playway_science_equipment' => 691,
                    'school_journal' => 550,
                    'group_insurance' => 135,
                ],
            ],
            [
                'category' => 'officers',
                'class_range' => 'i_v',
                'registration_fee' => 500,
                'admission_fee' => 2100,
                'security_deposit' => 6000,
                'annual_fee' => 7047,
                'tuition_fee' => 3376,
                'computer_fee' => 404,
                'science_fee' => 0,
                'other_fees' => [
                    'pupil_fee' => 576,
                ],
            ],
            [
                'category' => 'officers',
                'class_range' => 'vi_viii',
                'registration_fee' => 500,
                'admission_fee' => 2100,
                'security_deposit' => 6000,
                'annual_fee' => 7047,
                'tuition_fee' => 3721,
                'computer_fee' => 404,
                'science_fee' => 0,
                'other_fees' => [
                    'pupil_fee' => 576,
                ],
            ],
            [
                'category' => 'officers',
                'class_range' => 'ix_x',
                'registration_fee' => 500,
                'admission_fee' => 2100,
                'security_deposit' => 6000,
                'annual_fee' => 7047,
                'tuition_fee' => 3881,
                'computer_fee' => 404,
                'science_fee' => 160,
                'other_fees' => [
                    'pupil_fee' => 576,
                ],
            ],
            [
                'category' => 'officers',
                'class_range' => 'xi_xii',
                'registration_fee' => 500,
                'admission_fee' => 2100,
                'security_deposit' => 6000,
                'annual_fee' => 7047,
                'tuition_fee' => 4102,
                'computer_fee' => 404,
                'science_fee' => 220,
                'other_fees' => [
                    'pupil_fee' => 576,
                ],
            ],

            // JCO Category
            [
                'category' => 'jco',
                'class_range' => 'nursery_ukg',
                'registration_fee' => 500,
                'admission_fee' => 1050,
                'security_deposit' => 4000,
                'annual_fee' => 6409,
                'tuition_fee' => 2544,
                'computer_fee' => 404,
                'science_fee' => 0,
                'other_fees' => [
                    'pupil_fee' => 576,
                    'library' => 611,
                    'building' => 800,
                    'exam_stationery' => 480,
                    'games_sports' => 624,
                    'playway_science_equipment' => 561,
                    'school_journal' => 550,
                    'group_insurance' => 135,
                ],
            ],
            [
                'category' => 'jco',
                'class_range' => 'i_v',
                'registration_fee' => 500,
                'admission_fee' => 1050,
                'security_deposit' => 4000,
                'annual_fee' => 6409,
                'tuition_fee' => 3013,
                'computer_fee' => 404,
                'science_fee' => 0,
                'other_fees' => [
                    'pupil_fee' => 576,
                ],
            ],
            [
                'category' => 'jco',
                'class_range' => 'vi_viii',
                'registration_fee' => 500,
                'admission_fee' => 1050,
                'security_deposit' => 4000,
                'annual_fee' => 6409,
                'tuition_fee' => 3376,
                'computer_fee' => 404,
                'science_fee' => 0,
                'other_fees' => [
                    'pupil_fee' => 576,
                ],
            ],
            [
                'category' => 'jco',
                'class_range' => 'ix_x',
                'registration_fee' => 500,
                'admission_fee' => 1050,
                'security_deposit' => 4000,
                'annual_fee' => 6409,
                'tuition_fee' => 3536,
                'computer_fee' => 404,
                'science_fee' => 160,
                'other_fees' => [
                    'pupil_fee' => 576,
                ],
            ],
            [
                'category' => 'jco',
                'class_range' => 'xi_xii',
                'registration_fee' => 500,
                'admission_fee' => 1050,
                'security_deposit' => 4000,
                'annual_fee' => 6409,
                'tuition_fee' => 3721,
                'computer_fee' => 404,
                'science_fee' => 220,
                'other_fees' => [
                    'pupil_fee' => 576,
                ],
            ],

            // OR (Other Ranks) Category
            [
                'category' => 'or',
                'class_range' => 'nursery_ukg',
                'registration_fee' => 500,
                'admission_fee' => 600,
                'security_deposit' => 3000,
                'annual_fee' => 5893,
                'tuition_fee' => 2535,
                'computer_fee' => 387,
                'science_fee' => 0,
                'other_fees' => [
                    'pupil_fee' => 448,
                    'library' => 528,
                    'building' => 630,
                    'exam_stationery' => 458,
                    'games_sports' => 492,
                    'playway_science_equipment' => 500,
                    'school_journal' => 550,
                    'group_insurance' => 135,
                ],
            ],
            [
                'category' => 'or',
                'class_range' => 'i_v',
                'registration_fee' => 500,
                'admission_fee' => 600,
                'security_deposit' => 3000,
                'annual_fee' => 5893,
                'tuition_fee' => 2630,
                'computer_fee' => 387,
                'science_fee' => 0,
                'other_fees' => [
                    'pupil_fee' => 448,
                ],
            ],
            [
                'category' => 'or',
                'class_range' => 'vi_viii',
                'registration_fee' => 500,
                'admission_fee' => 600,
                'security_deposit' => 3000,
                'annual_fee' => 5893,
                'tuition_fee' => 2996,
                'computer_fee' => 387,
                'science_fee' => 0,
                'other_fees' => [
                    'pupil_fee' => 448,
                ],
            ],
            [
                'category' => 'or',
                'class_range' => 'ix_x',
                'registration_fee' => 500,
                'admission_fee' => 600,
                'security_deposit' => 3000,
                'annual_fee' => 5893,
                'tuition_fee' => 3150,
                'computer_fee' => 387,
                'science_fee' => 160,
                'other_fees' => [
                    'pupil_fee' => 448,
                ],
            ],
            [
                'category' => 'or',
                'class_range' => 'xi_xii',
                'registration_fee' => 500,
                'admission_fee' => 600,
                'security_deposit' => 3000,
                'annual_fee' => 5893,
                'tuition_fee' => 3359,
                'computer_fee' => 387,
                'science_fee' => 220,
                'other_fees' => [
                    'pupil_fee' => 448,
                ],
            ],

            // Civilian Category
            [
                'category' => 'civilian',
                'class_range' => 'nursery_ukg',
                'registration_fee' => 500,
                'admission_fee' => 6000,
                'security_deposit' => 8000,
                'annual_fee' => 9832,
                'tuition_fee' => 3914,
                'computer_fee' => 514,
                'science_fee' => 0,
                'other_fees' => [
                    'pupil_fee' => 580,
                    'library' => 950,
                    'building' => 1608,
                    'exam_stationery' => 480,
                    'games_sports' => 1144,
                    'playway_science_equipment' => 1009,
                    'school_journal' => 550,
                    'group_insurance' => 135,
                ],
            ],
            [
                'category' => 'civilian',
                'class_range' => 'i_v',
                'registration_fee' => 500,
                'admission_fee' => 6000,
                'security_deposit' => 8000,
                'annual_fee' => 9832,
                'tuition_fee' => 4206,
                'computer_fee' => 514,
                'science_fee' => 0,
                'other_fees' => [
                    'pupil_fee' => 580,
                ],
            ],
            [
                'category' => 'civilian',
                'class_range' => 'vi_viii',
                'registration_fee' => 500,
                'admission_fee' => 6000,
                'security_deposit' => 8000,
                'annual_fee' => 9832,
                'tuition_fee' => 4378,
                'computer_fee' => 514,
                'science_fee' => 0,
                'other_fees' => [
                    'pupil_fee' => 580,
                ],
            ],
            [
                'category' => 'civilian',
                'class_range' => 'ix_x',
                'registration_fee' => 500,
                'admission_fee' => 6000,
                'security_deposit' => 8000,
                'annual_fee' => 9832,
                'tuition_fee' => 4778,
                'computer_fee' => 514,
                'science_fee' => 220,
                'other_fees' => [
                    'pupil_fee' => 580,
                ],
            ],
            [
                'category' => 'civilian',
                'class_range' => 'xi_xii',
                'registration_fee' => 500,
                'admission_fee' => 6000,
                'security_deposit' => 8000,
                'annual_fee' => 9832,
                'tuition_fee' => 4897,
                'computer_fee' => 514,
                'science_fee' => 360,
                'other_fees' => [
                    'pupil_fee' => 580,
                ],
            ],
        ];

        // Create fee structure records
        foreach ($feeData as $fee) {
            FeeStructure::create([
                'academic_year' => $academicYear,
                'category' => $fee['category'],
                'class_range' => $fee['class_range'],
                'registration_fee' => $fee['registration_fee'],
                'admission_fee' => $fee['admission_fee'],
                'security_deposit' => $fee['security_deposit'],
                'annual_fee' => $fee['annual_fee'],
                'tuition_fee' => $fee['tuition_fee'],
                'computer_fee' => $fee['computer_fee'],
                'science_fee' => $fee['science_fee'],
                'other_fees' => $fee['other_fees'],
                'notes' => 'Fee structure for Academic Session 2025-26 as per school brochure.',
                'is_active' => true,
            ]);
        }

        $this->command->info('Fee structures seeded successfully! Created ' . count($feeData) . ' records for academic year ' . $academicYear);
    }
}
