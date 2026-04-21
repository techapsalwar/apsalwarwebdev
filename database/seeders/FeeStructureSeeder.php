<?php

namespace Database\Seeders;

use App\Models\FeeStructure;
use Illuminate\Database\Seeder;

class FeeStructureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * Fee data based on APS Alwar Fee Structure wef 01 Apr 2025 (2025-26)
     * Source: New Fee wef 01 Apr 2025.xlsx - FEE 2025-26 UPDT.csv
     * 
     * CSV Columns:
     * - (a) Reg Fee, (b) Adm Fee, (c) Security Deposit
     * - Annual: Library, Building, Exam, Sports, Playway, Digicamp, Devlop, Insurance
     * - Monthly: (l) Tuition, (m) Pupil, (n) Computer, (o) Science
     */
    public function run(): void
    {
        // Clear existing data
        FeeStructure::truncate();

        $academicYear = 2025;

        // Fee structure data from CSV (wef 01 Apr 2025) - 24 entries total
        $feeData = [
            // ==================== OR (Other Ranks) Category ====================
            // Row 1: Nur to UKG, OR
            [
                'category' => 'or',
                'class_range' => 'nursery_ukg',
                'registration_fee' => 500,
                'admission_fee' => 600,
                'security_deposit' => 3000,
                'annual_fee' => 2600,
                'tuition_fee' => 1695,
                'pupil_fee' => 540,
                'computer_fee' => 300,
                'science_fee' => 0,
                'other_fees' => [
                    'library' => 336, 'building' => 552, 'examination' => 204,
                    'sports' => 204, 'playway' => 504, 'digicamp' => 165,
                    'development' => 500, 'insurance' => 135,
                ],
            ],
            // Row 2: 1 to 5, OR
            [
                'category' => 'or',
                'class_range' => 'i_v',
                'registration_fee' => 500,
                'admission_fee' => 600,
                'security_deposit' => 3000,
                'annual_fee' => 2843,
                'tuition_fee' => 1795,
                'pupil_fee' => 448,
                'computer_fee' => 387,
                'science_fee' => 0,
                'other_fees' => [
                    'library' => 345, 'building' => 345, 'examination' => 458,
                    'sports' => 345, 'playway' => 500, 'digicamp' => 165,
                    'development' => 550, 'insurance' => 135,
                ],
            ],
            // Row 3: 6 to 8, OR
            [
                'category' => 'or',
                'class_range' => 'vi_viii',
                'registration_fee' => 500,
                'admission_fee' => 600,
                'security_deposit' => 3000,
                'annual_fee' => 2958,
                'tuition_fee' => 2161,
                'pupil_fee' => 448,
                'computer_fee' => 387,
                'science_fee' => 0,
                'other_fees' => [
                    'library' => 528, 'building' => 630, 'examination' => 458,
                    'sports' => 492, 'playway' => 0, 'digicamp' => 165,
                    'development' => 550, 'insurance' => 135,
                ],
            ],
            // Row 4: 9 to 10, OR
            [
                'category' => 'or',
                'class_range' => 'ix_x',
                'registration_fee' => 500,
                'admission_fee' => 600,
                'security_deposit' => 3000,
                'annual_fee' => 2958,
                'tuition_fee' => 2161,
                'pupil_fee' => 448,
                'computer_fee' => 387,
                'science_fee' => 154,
                'other_fees' => [
                    'library' => 528, 'building' => 630, 'examination' => 458,
                    'sports' => 492, 'playway' => 0, 'digicamp' => 165,
                    'development' => 550, 'insurance' => 135,
                ],
            ],
            // Row 5: 11 to 12 SCI, OR
            [
                'category' => 'or',
                'class_range' => 'xi_xii',
                'registration_fee' => 500,
                'admission_fee' => 600,
                'security_deposit' => 3000,
                'annual_fee' => 2958,
                'tuition_fee' => 2524,
                'pupil_fee' => 448,
                'computer_fee' => 387,
                'science_fee' => 220,
                'other_fees' => [
                    'library' => 528, 'building' => 630, 'examination' => 458,
                    'sports' => 492, 'playway' => 0, 'digicamp' => 165,
                    'development' => 550, 'insurance' => 135,
                ],
            ],
            // Row 6: 11 to 12 H & C, OR
            [
                'category' => 'or',
                'class_range' => 'xi_xii_hc',
                'registration_fee' => 500,
                'admission_fee' => 600,
                'security_deposit' => 3000,
                'annual_fee' => 2958,
                'tuition_fee' => 2524,
                'pupil_fee' => 448,
                'computer_fee' => 387,
                'science_fee' => 0,
                'other_fees' => [
                    'library' => 528, 'building' => 630, 'examination' => 458,
                    'sports' => 492, 'playway' => 0, 'digicamp' => 165,
                    'development' => 550, 'insurance' => 135,
                ],
            ],

            // ==================== JCO Category ====================
            // Row 7: Nur to UKG, JCO
            [
                'category' => 'jco',
                'class_range' => 'nursery_ukg',
                'registration_fee' => 500,
                'admission_fee' => 1050,
                'security_deposit' => 4000,
                'annual_fee' => 2648,
                'tuition_fee' => 1704,
                'pupil_fee' => 540,
                'computer_fee' => 300,
                'science_fee' => 0,
                'other_fees' => [
                    'library' => 336, 'building' => 600, 'examination' => 204,
                    'sports' => 204, 'playway' => 504, 'digicamp' => 165,
                    'development' => 500, 'insurance' => 135,
                ],
            ],
            // Row 8: 1 to 5, JCO
            [
                'category' => 'jco',
                'class_range' => 'i_v',
                'registration_fee' => 500,
                'admission_fee' => 1050,
                'security_deposit' => 4000,
                'annual_fee' => 3926,
                'tuition_fee' => 2161,
                'pupil_fee' => 448,
                'computer_fee' => 404,
                'science_fee' => 0,
                'other_fees' => [
                    'library' => 611, 'building' => 800, 'examination' => 480,
                    'sports' => 624, 'playway' => 561, 'digicamp' => 165,
                    'development' => 550, 'insurance' => 135,
                ],
            ],
            // Row 9: 6 to 8, JCO
            [
                'category' => 'jco',
                'class_range' => 'vi_viii',
                'registration_fee' => 500,
                'admission_fee' => 1050,
                'security_deposit' => 4000,
                'annual_fee' => 3365,
                'tuition_fee' => 2524,
                'pupil_fee' => 448,
                'computer_fee' => 404,
                'science_fee' => 0,
                'other_fees' => [
                    'library' => 611, 'building' => 800, 'examination' => 480,
                    'sports' => 624, 'playway' => 0, 'digicamp' => 165,
                    'development' => 550, 'insurance' => 135,
                ],
            ],
            // Row 10: 9 to 10, JCO
            [
                'category' => 'jco',
                'class_range' => 'ix_x',
                'registration_fee' => 500,
                'admission_fee' => 1050,
                'security_deposit' => 4000,
                'annual_fee' => 3365,
                'tuition_fee' => 2524,
                'pupil_fee' => 448,
                'computer_fee' => 404,
                'science_fee' => 160,
                'other_fees' => [
                    'library' => 611, 'building' => 800, 'examination' => 480,
                    'sports' => 624, 'playway' => 0, 'digicamp' => 165,
                    'development' => 550, 'insurance' => 135,
                ],
            ],
            // Row 11: 11 to 12 SCI, JCO
            [
                'category' => 'jco',
                'class_range' => 'xi_xii',
                'registration_fee' => 500,
                'admission_fee' => 1050,
                'security_deposit' => 4000,
                'annual_fee' => 3365,
                'tuition_fee' => 2741,
                'pupil_fee' => 576,
                'computer_fee' => 404,
                'science_fee' => 220,
                'other_fees' => [
                    'library' => 611, 'building' => 800, 'examination' => 480,
                    'sports' => 624, 'playway' => 0, 'digicamp' => 165,
                    'development' => 550, 'insurance' => 135,
                ],
            ],
            // Row 12: 11 to 12 H & C, JCO
            [
                'category' => 'jco',
                'class_range' => 'xi_xii_hc',
                'registration_fee' => 500,
                'admission_fee' => 1050,
                'security_deposit' => 4000,
                'annual_fee' => 3365,
                'tuition_fee' => 2741,
                'pupil_fee' => 576,
                'computer_fee' => 404,
                'science_fee' => 0,
                'other_fees' => [
                    'library' => 611, 'building' => 800, 'examination' => 480,
                    'sports' => 624, 'playway' => 0, 'digicamp' => 165,
                    'development' => 550, 'insurance' => 135,
                ],
            ],

            // ==================== Officers Category ====================
            // Row 13: Nur to UKG, OFFRS
            [
                'category' => 'officers',
                'class_range' => 'nursery_ukg',
                'registration_fee' => 500,
                'admission_fee' => 2100,
                'security_deposit' => 6000,
                'annual_fee' => 2708,
                'tuition_fee' => 1711,
                'pupil_fee' => 540,
                'computer_fee' => 300,
                'science_fee' => 0,
                'other_fees' => [
                    'library' => 336, 'building' => 624, 'examination' => 204,
                    'sports' => 204, 'playway' => 540, 'digicamp' => 165,
                    'development' => 500, 'insurance' => 135,
                ],
            ],
            // Row 14: 1 to 5, OFFRS
            [
                'category' => 'officers',
                'class_range' => 'i_v',
                'registration_fee' => 500,
                'admission_fee' => 2100,
                'security_deposit' => 6000,
                'annual_fee' => 4504,
                'tuition_fee' => 2524,
                'pupil_fee' => 448,
                'computer_fee' => 404,
                'science_fee' => 0,
                'other_fees' => [
                    'library' => 733, 'building' => 1008, 'examination' => 480,
                    'sports' => 742, 'playway' => 691, 'digicamp' => 165,
                    'development' => 550, 'insurance' => 135,
                ],
            ],
            // Row 15: 6 to 8, OFFRS
            [
                'category' => 'officers',
                'class_range' => 'vi_viii',
                'registration_fee' => 500,
                'admission_fee' => 2100,
                'security_deposit' => 6000,
                'annual_fee' => 3813,
                'tuition_fee' => 2741,
                'pupil_fee' => 576,
                'computer_fee' => 404,
                'science_fee' => 0,
                'other_fees' => [
                    'library' => 733, 'building' => 1008, 'examination' => 480,
                    'sports' => 742, 'playway' => 0, 'digicamp' => 165,
                    'development' => 550, 'insurance' => 135,
                ],
            ],
            // Row 16: 9 to 10, OFFRS
            [
                'category' => 'officers',
                'class_range' => 'ix_x',
                'registration_fee' => 500,
                'admission_fee' => 2100,
                'security_deposit' => 6000,
                'annual_fee' => 3813,
                'tuition_fee' => 2741,
                'pupil_fee' => 576,
                'computer_fee' => 404,
                'science_fee' => 160,
                'other_fees' => [
                    'library' => 733, 'building' => 1008, 'examination' => 480,
                    'sports' => 742, 'playway' => 0, 'digicamp' => 165,
                    'development' => 550, 'insurance' => 135,
                ],
            ],
            // Row 17: 11 to 12 SCI, OFFRS
            [
                'category' => 'officers',
                'class_range' => 'xi_xii',
                'registration_fee' => 500,
                'admission_fee' => 2100,
                'security_deposit' => 6000,
                'annual_fee' => 3813,
                'tuition_fee' => 3122,
                'pupil_fee' => 576,
                'computer_fee' => 404,
                'science_fee' => 220,
                'other_fees' => [
                    'library' => 733, 'building' => 1008, 'examination' => 480,
                    'sports' => 742, 'playway' => 0, 'digicamp' => 165,
                    'development' => 550, 'insurance' => 135,
                ],
            ],
            // Row 18: 11 to 12 H & C, OFFRS
            [
                'category' => 'officers',
                'class_range' => 'xi_xii_hc',
                'registration_fee' => 500,
                'admission_fee' => 2100,
                'security_deposit' => 6000,
                'annual_fee' => 3813,
                'tuition_fee' => 3122,
                'pupil_fee' => 576,
                'computer_fee' => 404,
                'science_fee' => 0,
                'other_fees' => [
                    'library' => 733, 'building' => 1008, 'examination' => 480,
                    'sports' => 742, 'playway' => 0, 'digicamp' => 165,
                    'development' => 550, 'insurance' => 135,
                ],
            ],

            // ==================== Civilian Category ====================
            // Row 19: Nur to UKG, CIVIL
            [
                'category' => 'civilian',
                'class_range' => 'nursery_ukg',
                'registration_fee' => 500,
                'admission_fee' => 6000,
                'security_deposit' => 8000,
                'annual_fee' => 3956,
                'tuition_fee' => 2750,
                'pupil_fee' => 564,
                'computer_fee' => 600,
                'science_fee' => 0,
                'other_fees' => [
                    'library' => 336, 'building' => 1116, 'examination' => 204,
                    'sports' => 504, 'playway' => 996, 'digicamp' => 165,
                    'development' => 500, 'insurance' => 135,
                ],
            ],
            // Row 20: 1 to 5, CIVIL
            [
                'category' => 'civilian',
                'class_range' => 'i_v',
                'registration_fee' => 500,
                'admission_fee' => 6000,
                'security_deposit' => 8000,
                'annual_fee' => 6041,
                'tuition_fee' => 3112,
                'pupil_fee' => 580,
                'computer_fee' => 514,
                'science_fee' => 0,
                'other_fees' => [
                    'library' => 950, 'building' => 1608, 'examination' => 480,
                    'sports' => 1144, 'playway' => 1009, 'digicamp' => 165,
                    'development' => 550, 'insurance' => 135,
                ],
            ],
            // Row 21: 6 to 8, CIVIL
            [
                'category' => 'civilian',
                'class_range' => 'vi_viii',
                'registration_fee' => 500,
                'admission_fee' => 6000,
                'security_deposit' => 8000,
                'annual_fee' => 5032,
                'tuition_fee' => 3284,
                'pupil_fee' => 580,
                'computer_fee' => 514,
                'science_fee' => 0,
                'other_fees' => [
                    'library' => 950, 'building' => 1608, 'examination' => 480,
                    'sports' => 1144, 'playway' => 0, 'digicamp' => 165,
                    'development' => 550, 'insurance' => 135,
                ],
            ],
            // Row 22: 9 to 10, CIVIL
            [
                'category' => 'civilian',
                'class_range' => 'ix_x',
                'registration_fee' => 500,
                'admission_fee' => 6000,
                'security_deposit' => 8000,
                'annual_fee' => 5032,
                'tuition_fee' => 3464,
                'pupil_fee' => 580,
                'computer_fee' => 514,
                'science_fee' => 220,
                'other_fees' => [
                    'library' => 950, 'building' => 1608, 'examination' => 480,
                    'sports' => 1144, 'playway' => 0, 'digicamp' => 165,
                    'development' => 550, 'insurance' => 135,
                ],
            ],
            // Row 23: 11 to 12 SCI, CIVIL
            [
                'category' => 'civilian',
                'class_range' => 'xi_xii',
                'registration_fee' => 500,
                'admission_fee' => 6000,
                'security_deposit' => 8000,
                'annual_fee' => 5032,
                'tuition_fee' => 3803,
                'pupil_fee' => 580,
                'computer_fee' => 514,
                'science_fee' => 360,
                'other_fees' => [
                    'library' => 950, 'building' => 1608, 'examination' => 480,
                    'sports' => 1144, 'playway' => 0, 'digicamp' => 165,
                    'development' => 550, 'insurance' => 135,
                ],
            ],
            // Row 24: 11 to 12 H & C, CIVIL
            [
                'category' => 'civilian',
                'class_range' => 'xi_xii_hc',
                'registration_fee' => 500,
                'admission_fee' => 6000,
                'security_deposit' => 8000,
                'annual_fee' => 5032,
                'tuition_fee' => 3803,
                'pupil_fee' => 580,
                'computer_fee' => 514,
                'science_fee' => 0,
                'other_fees' => [
                    'library' => 950, 'building' => 1608, 'examination' => 480,
                    'sports' => 1144, 'playway' => 0, 'digicamp' => 165,
                    'development' => 550, 'insurance' => 135,
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
                'pupil_fee' => $fee['pupil_fee'],
                'computer_fee' => $fee['computer_fee'],
                'science_fee' => $fee['science_fee'],
                'other_fees' => $fee['other_fees'],
                'notes' => 'Fee structure for Academic Session 2025-26 wef 01 Apr 2025.',
                'is_active' => true,
            ]);
        }

        $this->command->info('Fee structures seeded successfully! Created ' . count($feeData) . ' records for academic year ' . $academicYear);
    }
}
