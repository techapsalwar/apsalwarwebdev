<?php

namespace Database\Seeders;

use App\Models\Club;
use App\Models\ClubMember;
use Illuminate\Database\Seeder;

class ClubMemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $currentYear = date('Y');
        
        // Sample Indian student names - separate by gender
        $maleNames = [
            'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
            'Shaurya', 'Atharva', 'Advik', 'Pranav', 'Advaith', 'Aarush', 'Kabir', 'Ritvik', 'Anirudh', 'Dhruv',
        ];
        
        $femaleNames = [
            'Ananya', 'Aadhya', 'Myra', 'Sara', 'Aanya', 'Ira', 'Aarohi', 'Pari', 'Anika', 'Navya',
            'Diya', 'Kiara', 'Avni', 'Saanvi', 'Ishita', 'Prisha', 'Anvi', 'Riya', 'Tanya', 'Kavya',
        ];
        
        $lastNames = [
            'Sharma', 'Verma', 'Singh', 'Gupta', 'Kumar', 'Agarwal', 'Joshi', 'Patel', 'Mehta', 'Shah',
            'Yadav', 'Reddy', 'Nair', 'Iyer', 'Menon', 'Pillai', 'Rao', 'Desai', 'Thakur', 'Chauhan',
            'Tiwari', 'Pandey', 'Mishra', 'Saxena', 'Kapoor', 'Malhotra', 'Khanna', 'Chopra', 'Bhatia', 'Arora',
        ];
        
        $classes = ['VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
        
        $reasons = [
            'I am passionate about this field and want to learn more.',
            'I want to develop new skills and meet like-minded friends.',
            'This club aligns with my career interests.',
            'My teacher recommended I join this club.',
            'I want to explore my creativity and express myself.',
            'I believe this will help me grow as a person.',
            'I have always been interested in this area.',
            'I want to participate in competitions and events.',
            'Learning something new excites me.',
            'I want to contribute to the school community.',
        ];

        // Get all clubs
        $clubs = Club::all();
        
        if ($clubs->isEmpty()) {
            $this->command->warn('No clubs found. Please seed clubs first.');
            return;
        }

        $admissionCounter = 2024001;
        
        foreach ($clubs as $club) {
            // Generate random number of members per club (8-20)
            $memberCount = rand(8, 20);
            
            $this->command->info("Seeding {$memberCount} members for {$club->name}...");
            
            for ($i = 0; $i < $memberCount; $i++) {
                // Randomly select gender (roughly 50/50)
                $gender = rand(0, 1) === 0 ? 'male' : 'female';
                
                // Pick name based on gender
                $firstName = $gender === 'male' 
                    ? $maleNames[array_rand($maleNames)] 
                    : $femaleNames[array_rand($femaleNames)];
                $lastName = $lastNames[array_rand($lastNames)];
                $studentName = "{$firstName} {$lastName}";
                $class = $classes[array_rand($classes)];
                $admissionNumber = 'APS/' . $currentYear . '/' . str_pad($admissionCounter++, 4, '0', STR_PAD_LEFT);
                
                // Generate email from name
                $email = strtolower($firstName) . '.' . strtolower($lastName) . rand(1, 99) . '@student.apsalwar.edu.in';
                
                // Generate phone numbers
                $phone = '9' . rand(100000000, 999999999);
                $parentPhone = '9' . rand(100000000, 999999999);
                
                // Most members are approved (80%), some pending (15%), few rejected (5%)
                $statusRand = rand(1, 100);
                if ($statusRand <= 80) {
                    $status = 'approved';
                } elseif ($statusRand <= 95) {
                    $status = 'pending';
                } else {
                    $status = 'rejected';
                }
                
                ClubMember::create([
                    'club_id' => $club->id,
                    'student_name' => $studentName,
                    'class' => $class,
                    'gender' => $gender,
                    'admission_number' => $admissionNumber,
                    'email' => $email,
                    'phone' => $phone,
                    'parent_phone' => $parentPhone,
                    'reason' => $reasons[array_rand($reasons)],
                    'academic_year' => $currentYear,
                    'status' => $status,
                ]);
            }
        }
        
        // Summary
        $totalMembers = ClubMember::count();
        $approvedCount = ClubMember::where('status', 'approved')->count();
        $pendingCount = ClubMember::where('status', 'pending')->count();
        $rejectedCount = ClubMember::where('status', 'rejected')->count();
        
        $this->command->newLine();
        $this->command->info("✅ Club members seeded successfully!");
        $this->command->table(
            ['Status', 'Count'],
            [
                ['Total Members', $totalMembers],
                ['Approved', $approvedCount],
                ['Pending', $pendingCount],
                ['Rejected', $rejectedCount],
            ]
        );
    }
}
