<?php

namespace Database\Seeders;

use App\Models\Committee;
use App\Models\CommitteeMember;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CommitteeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // School Management Committee (SMC) 2024-25
        // Data sourced from APS Alwar School Brochure 2025
        $smc = Committee::updateOrCreate(
            ['slug' => 'school-management-committee'],
            [
                'name' => 'School Management Committee',
                'type' => 'smc',
                'description' => 'The School Management Committee (SMC) provides strategic guidance and oversight for the overall functioning of Army Public School, Alwar. Comprising eminent military and educational leaders, the committee ensures excellence in all aspects of school operations.',
                'session' => '2024-25',
                'functions' => [
                    'Provide strategic direction and policy guidance',
                    'Oversee academic standards and curriculum implementation',
                    'Monitor infrastructure development and maintenance',
                    'Review financial management and budgets',
                    'Ensure welfare measures for staff and students',
                    'Approve major administrative decisions',
                    'Foster community relationships and partnerships',
                ],
                'is_active' => true,
                'order' => 1,
            ]
        );

        // SMC Members as per brochure
        $smcMembers = [
            [
                'name' => 'Brig Milind Vyas',
                'designation' => 'Chairman',
                'role' => 'Cdr 37 Arty Bde',
                'organization' => 'Indian Army',
                'order' => 1,
            ],
            [
                'name' => 'Col Udit Chawla',
                'designation' => 'Vice Chairman',
                'role' => 'CO 154 Fd Regt',
                'organization' => 'Indian Army',
                'order' => 2,
            ],
            [
                'name' => 'Dr. Neera Pandey',
                'designation' => 'Secretary & Principal',
                'role' => 'Principal, APS Alwar',
                'organization' => 'Army Public School, Alwar',
                'order' => 3,
            ],
            [
                'name' => 'Lt Col S K Das',
                'designation' => 'Member',
                'role' => 'HQ 37 Arty Bde',
                'organization' => 'Indian Army',
                'order' => 4,
            ],
            [
                'name' => 'Lt Col Vishal Sharma',
                'designation' => 'Member',
                'role' => '154 Fd Regt',
                'organization' => 'Indian Army',
                'order' => 5,
            ],
            [
                'name' => 'Mrs. Rashmi Kumari',
                'designation' => 'Member',
                'role' => 'Parent Representative',
                'organization' => null,
                'order' => 6,
            ],
            [
                'name' => 'Mr. Vinod Kumar',
                'designation' => 'Member',
                'role' => 'Parent Representative',
                'organization' => null,
                'order' => 7,
            ],
            [
                'name' => 'Ms. Sunita Sharma',
                'designation' => 'Member',
                'role' => 'Teacher Representative (Primary)',
                'organization' => 'Army Public School, Alwar',
                'order' => 8,
            ],
            [
                'name' => 'Mr. Rajesh Gupta',
                'designation' => 'Member',
                'role' => 'Teacher Representative (Secondary)',
                'organization' => 'Army Public School, Alwar',
                'order' => 9,
            ],
            [
                'name' => 'Mrs. Kavita Singh',
                'designation' => 'Member',
                'role' => 'Administrative Representative',
                'organization' => 'Army Public School, Alwar',
                'order' => 10,
            ],
            [
                'name' => 'Dr. A K Sharma',
                'designation' => 'Member',
                'role' => 'Medical Officer Representative',
                'organization' => 'Military Hospital',
                'order' => 11,
            ],
            [
                'name' => 'Nb Sub Mahender Singh',
                'designation' => 'Member',
                'role' => 'JCO Representative',
                'organization' => 'Indian Army',
                'order' => 12,
            ],
            [
                'name' => 'Hav Sukhdev Singh',
                'designation' => 'Member',
                'role' => 'OR Representative',
                'organization' => 'Indian Army',
                'order' => 13,
            ],
        ];

        foreach ($smcMembers as $member) {
            $smc->members()->create([
                'name' => $member['name'],
                'designation' => $member['designation'],
                'role' => $member['role'],
                'organization' => $member['organization'],
                'order' => $member['order'],
                'is_active' => true,
            ]);
        }

        $this->command->info('School Management Committee seeded with ' . count($smcMembers) . ' members.');
    }
}
