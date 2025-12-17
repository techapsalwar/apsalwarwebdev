<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     * Data extracted from APS_Alwar_School_Brochure_2025.md
     */
    public function run(): void
    {
        // Create Admin Users
        $this->seedUsers();

        // Seed Site Settings
        $this->seedSettings();

        // Seed School Statistics
        $this->seedStatistics();

        // Seed Houses
        $this->seedHouses();

        // Seed Departments
        $this->seedDepartments();

        // Seed Clubs
        $this->seedClubs();

        // Seed Sports Teams
        $this->seedSportsTeams();

        // Seed Facilities
        $this->seedFacilities();

        // Seed Committees
        $this->seedCommittees();

        // Seed Fee Structures
        $this->seedFeeStructures();

        // Seed Board Results
        $this->seedBoardResults();

        // Seed API Trends
        $this->seedApiTrends();

        // Seed Competitive Exams
        $this->seedCompetitiveExams();

        // Seed Initiatives
        $this->seedInitiatives();

        // Seed Partnerships
        $this->seedPartnerships();

        // Seed Staff
        $this->seedStaff();

        // Seed Achievements
        $this->seedAchievements();

        // Seed Alumni
        $this->seedAlumni();

        // Seed Sliders
        $this->seedSliders();

        // Seed Pages
        $this->seedPages();

        // Seed Announcements
        $this->seedAnnouncements();

        // Seed News
        $this->seedNews();

        // Seed Events
        $this->seedEvents();

        // Seed Celebrations
        $this->seedCelebrations();

        // Seed Quick Links
        $this->seedQuickLinks();
    }

    /**
     * Seed admin users
     */
    private function seedUsers(): void
    {
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@apsalwar.edu.in',
            'password' => Hash::make('Admin@123'),
            'role' => 'super_admin',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Dr. Neera Pandey',
            'email' => 'principal@apsalwar.edu.in',
            'password' => Hash::make('Principal@123'),
            'role' => 'admin',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Content Editor',
            'email' => 'editor@apsalwar.edu.in',
            'password' => Hash::make('Editor@123'),
            'role' => 'editor',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
    }

    /**
     * Seed site settings - Real data from brochure
     */
    private function seedSettings(): void
    {
        $settings = [
            // General Settings
            ['key' => 'site_name', 'value' => 'Army Public School, Alwar', 'group' => 'general', 'type' => 'text'],
            ['key' => 'site_tagline', 'value' => 'A Happy Learner is a Motivated Learner', 'group' => 'general', 'type' => 'text'],
            ['key' => 'site_logo', 'value' => '/images/logo.png', 'group' => 'general', 'type' => 'image'],
            ['key' => 'site_favicon', 'value' => '/images/favicon.ico', 'group' => 'general', 'type' => 'image'],
            ['key' => 'site_description', 'value' => 'Army Public School Alwar is a CBSE affiliated school established on 04 July 1981, with 44+ years of educational excellence. Located in serene, pollution-free environment at Alwar Military Station, Rajasthan.', 'group' => 'general', 'type' => 'textarea'],

            // Contact Information
            ['key' => 'contact_address', 'value' => 'Itarana, Alwar Military Station, Alwar, Rajasthan', 'group' => 'contact', 'type' => 'textarea'],
            ['key' => 'contact_phone', 'value' => '+91-XXXXXXXXXX', 'group' => 'contact', 'type' => 'text'],
            ['key' => 'contact_email', 'value' => 'principal@apsalwar.edu.in', 'group' => 'contact', 'type' => 'text'],
            ['key' => 'contact_fax', 'value' => '', 'group' => 'contact', 'type' => 'text'],

            // Social Media
            ['key' => 'social_facebook', 'value' => 'https://facebook.com/apsalwar', 'group' => 'social', 'type' => 'text'],
            ['key' => 'social_instagram', 'value' => 'https://instagram.com/apsalwar', 'group' => 'social', 'type' => 'text'],
            ['key' => 'social_youtube', 'value' => 'https://youtube.com/@apsalwar', 'group' => 'social', 'type' => 'text'],
            ['key' => 'social_twitter', 'value' => '', 'group' => 'social', 'type' => 'text'],

            // School Timings
            ['key' => 'school_timing_summer', 'value' => '7:30 AM - 1:30 PM', 'group' => 'timings', 'type' => 'text'],
            ['key' => 'school_timing_winter', 'value' => '8:30 AM - 2:30 PM', 'group' => 'timings', 'type' => 'text'],
            ['key' => 'office_timing', 'value' => '8:00 AM - 2:00 PM (Mon-Sat)', 'group' => 'timings', 'type' => 'text'],

            // CBSE Details - Real data from brochure
            ['key' => 'cbse_affiliation_number', 'value' => '1780018', 'group' => 'cbse', 'type' => 'text'],
            ['key' => 'cbse_affiliation_date', 'value' => '22 June 2001', 'group' => 'cbse', 'type' => 'text'],
            ['key' => 'school_founded_date', 'value' => '04 July 1981', 'group' => 'cbse', 'type' => 'text'],
            ['key' => 'school_founded_year', 'value' => '1981', 'group' => 'cbse', 'type' => 'text'],
            ['key' => 'first_class_x_batch', 'value' => '2004', 'group' => 'cbse', 'type' => 'text'],
            ['key' => 'first_class_xii_batch', 'value' => '2014', 'group' => 'cbse', 'type' => 'text'],

            // Vision & Mission
            ['key' => 'school_vision', 'value' => 'To foster the talent and individuality of every student, ensuring they become conscientious global citizens who understand the value of protecting the environment, ethics, community service, and commitment while becoming flexible, adaptable, and disciplined individuals.', 'group' => 'about', 'type' => 'textarea'],
            ['key' => 'school_mission', 'value' => 'To provide the fullest possible development of each learner for living morally, creatively, and productively in a democratic society.', 'group' => 'about', 'type' => 'textarea'],
            ['key' => 'school_motto', 'value' => 'A Happy Learner is a Motivated Learner', 'group' => 'about', 'type' => 'text'],

            // Principal
            ['key' => 'principal_name', 'value' => 'Dr. Neera Pandey', 'group' => 'principal', 'type' => 'text'],
            ['key' => 'principal_qualifications', 'value' => 'M.A., M.Ed., PG in School Management & Leadership, Diploma in Introduction to Psychology (Yale University)', 'group' => 'principal', 'type' => 'text'],
            ['key' => 'principal_photo', 'value' => '/images/principal.jpg', 'group' => 'principal', 'type' => 'image'],
            ['key' => 'principal_message', 'value' => 'Education at Army Public School, Alwar, transcends textbooks and every child\'s potential is realized through dedicated guidance, comprehensive facilities, and a nurturing environment.', 'group' => 'principal', 'type' => 'textarea'],

            // Homepage Settings
            ['key' => 'homepage_show_ticker', 'value' => 'true', 'group' => 'homepage', 'type' => 'boolean'],
            ['key' => 'homepage_show_statistics', 'value' => 'true', 'group' => 'homepage', 'type' => 'boolean'],
            ['key' => 'homepage_show_testimonials', 'value' => 'true', 'group' => 'homepage', 'type' => 'boolean'],
            ['key' => 'homepage_news_count', 'value' => '6', 'group' => 'homepage', 'type' => 'text'],
            ['key' => 'homepage_events_count', 'value' => '4', 'group' => 'homepage', 'type' => 'text'],

            // SEO Settings
            ['key' => 'seo_meta_title', 'value' => 'Army Public School Alwar | CBSE School in Alwar, Rajasthan | Since 1981', 'group' => 'seo', 'type' => 'text'],
            ['key' => 'seo_meta_description', 'value' => 'Army Public School Alwar is a premier CBSE affiliated (1780018) school with 44+ years of excellence. 14.5 acre campus, 1046+ students, 55 faculty members. Excellence in Education | Character Building | Nation First.', 'group' => 'seo', 'type' => 'textarea'],
            ['key' => 'seo_meta_keywords', 'value' => 'APS Alwar, Army Public School Alwar, CBSE School Alwar, Best School Alwar, Military School Rajasthan, AWES School, Defence School Alwar', 'group' => 'seo', 'type' => 'textarea'],

            // Maintenance Mode
            ['key' => 'maintenance_mode', 'value' => 'false', 'group' => 'system', 'type' => 'boolean'],
            ['key' => 'maintenance_message', 'value' => 'We are currently performing scheduled maintenance. Please check back soon.', 'group' => 'system', 'type' => 'textarea'],

            // Streams offered
            ['key' => 'streams_science', 'value' => 'English Core, Physics, Chemistry, Mathematics, Biology, Informatics Practices, Physical Education, Artificial Intelligence, PAT', 'group' => 'academics', 'type' => 'textarea'],
            ['key' => 'streams_commerce', 'value' => 'English Core, Accountancy, Business Studies, Economics, Informatics Practices, Physical Education, Mathematics (Optional), Artificial Intelligence, PAT', 'group' => 'academics', 'type' => 'textarea'],
            ['key' => 'streams_humanities', 'value' => 'English Core, History, Economics, Psychology, Informatics Practices, Physical Education, Hindi Core, Political Science, Artificial Intelligence, PAT', 'group' => 'academics', 'type' => 'textarea'],
        ];

        foreach ($settings as $setting) {
            DB::table('settings')->insert(array_merge($setting, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }

    /**
     * Seed school statistics - Real data from brochure (As on 10 November 2025)
     */
    private function seedStatistics(): void
    {
        $statistics = [
            ['key' => 'years_of_excellence', 'label' => 'Years of Excellence', 'value' => '44', 'suffix' => '+', 'icon' => 'calendar', 'order' => 1, 'description' => 'Established 04 July 1981'],
            ['key' => 'total_students', 'label' => 'Students', 'value' => '1046', 'suffix' => '', 'icon' => 'users', 'order' => 2, 'description' => 'Total student strength across all classes'],
            ['key' => 'total_faculty', 'label' => 'Faculty Members', 'value' => '55', 'suffix' => '', 'icon' => 'graduation-cap', 'order' => 3, 'description' => 'Qualified and experienced teachers'],
            ['key' => 'total_sections', 'label' => 'Sections', 'value' => '38', 'suffix' => '', 'icon' => 'layers', 'order' => 4, 'description' => 'From Nursery to Class XII'],
            ['key' => 'pass_percentage', 'label' => 'Board Result', 'value' => '100', 'suffix' => '%', 'icon' => 'trophy', 'order' => 5, 'description' => 'Consistent 100% pass rate'],
            ['key' => 'campus_area', 'label' => 'Campus Area', 'value' => '14.5', 'suffix' => ' acres', 'icon' => 'building', 'order' => 6, 'description' => 'Serene, pollution-free environment'],
            ['key' => 'smart_classrooms', 'label' => 'Smart Classes', 'value' => '38', 'suffix' => '', 'icon' => 'monitor', 'order' => 7, 'description' => '30 smart boards + 8 interactive panels'],
            ['key' => 'library_books', 'label' => 'Library Books', 'value' => '6813', 'suffix' => '+', 'icon' => 'book', 'order' => 8, 'description' => 'Including English, Hindi, and other languages'],
            ['key' => 'student_books', 'label' => 'Student Authors', 'value' => '101', 'suffix' => '', 'icon' => 'pen', 'order' => 9, 'description' => 'Books written by students (BriBooks)'],
            ['key' => 'cctv_cameras', 'label' => 'CCTV Cameras', 'value' => '75', 'suffix' => '', 'icon' => 'camera', 'order' => 10, 'description' => 'Comprehensive surveillance system'],
            ['key' => 'teacher_student_ratio', 'label' => 'Teacher:Student', 'value' => '1:19', 'suffix' => '', 'icon' => 'users', 'order' => 11, 'description' => 'Optimal teacher-pupil ratio'],
            ['key' => 'ncc_cadets', 'label' => 'NCC Cadets', 'value' => '100', 'suffix' => '', 'icon' => 'shield', 'order' => 12, 'description' => 'JD/JW authorized strength'],
        ];

        foreach ($statistics as $stat) {
            DB::table('school_statistics')->insert(array_merge($stat, [
                'show_on_homepage' => true,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }

    /**
     * Seed the four houses - Real data from brochure
     */
    private function seedHouses(): void
    {
        $houses = [
            [
                'name' => 'Cariappa House',
                'slug' => 'cariappa',
                'color' => '#3B82F6', // Blue
                'motto' => 'Courage and Determination',
                'description' => 'Named after Field Marshal K.M. Cariappa, the first Indian Commander-in-Chief of the Indian Army. The house embodies courage, determination, and leadership excellence.',
                'order' => 1,
            ],
            [
                'name' => 'Manekshaw House',
                'slug' => 'manekshaw',
                'color' => '#22C55E', // Green
                'motto' => 'Victory and Honor',
                'description' => 'Named after Field Marshal Sam Manekshaw, hero of the 1971 Indo-Pakistan War. The house represents victory, honor, and strategic brilliance.',
                'order' => 2,
            ],
            [
                'name' => 'Raina House',
                'slug' => 'raina',
                'color' => '#EF4444', // Red
                'motto' => 'Valor and Sacrifice',
                'description' => 'Named after Lieutenant General T.N. Raina, a distinguished military leader. The house symbolizes valor, sacrifice, and unwavering commitment to duty.',
                'order' => 3,
            ],
            [
                'name' => 'Thimayya House',
                'slug' => 'thimayya',
                'color' => '#EAB308', // Yellow
                'motto' => 'Leadership and Excellence',
                'description' => 'Named after General K.S. Thimayya, former Chief of Army Staff. The house embodies leadership, excellence, and distinguished service to the nation.',
                'order' => 4,
            ],
        ];

        foreach ($houses as $house) {
            DB::table('houses')->insert(array_merge($house, [
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }

    /**
     * Seed academic departments - Comprehensive list from brochure
     */
    private function seedDepartments(): void
    {
        $departments = [
            ['name' => 'Management', 'slug' => 'management', 'description' => 'School leadership and administration.', 'icon' => 'building', 'order' => 1],
            ['name' => 'English', 'slug' => 'english', 'description' => 'English language and literature education with language lab facility.', 'icon' => 'book-open', 'order' => 2],
            ['name' => 'Hindi', 'slug' => 'hindi', 'description' => 'Hindi language and literature education.', 'icon' => 'book-open', 'order' => 3],
            ['name' => 'Sanskrit', 'slug' => 'sanskrit', 'description' => 'Sanskrit language and classical literature education.', 'icon' => 'book-open', 'order' => 4],
            ['name' => 'Mathematics', 'slug' => 'mathematics', 'description' => 'Mathematics education with dedicated math lab for hands-on learning.', 'icon' => 'calculator', 'order' => 5],
            ['name' => 'Physics', 'slug' => 'physics', 'description' => 'Physics education with well-equipped laboratory featuring optical benches, meters, and modern instruments.', 'icon' => 'flask', 'order' => 6],
            ['name' => 'Chemistry', 'slug' => 'chemistry', 'description' => 'Chemistry education with comprehensive lab including digital balancing machines and full chemical range.', 'icon' => 'flask', 'order' => 7],
            ['name' => 'Biology', 'slug' => 'biology', 'description' => 'Biology education with lab featuring microscopes, specimen collections, and botanical garden access.', 'icon' => 'flask', 'order' => 8],
            ['name' => 'Science', 'slug' => 'science', 'description' => 'General science education for middle and secondary classes.', 'icon' => 'flask', 'order' => 9],
            ['name' => 'Social Science', 'slug' => 'social-science', 'description' => 'History, Geography, Political Science, and Economics education with dedicated social science lab.', 'icon' => 'globe', 'order' => 10],
            ['name' => 'History', 'slug' => 'history', 'description' => 'History education covering Indian and world history.', 'icon' => 'globe', 'order' => 11],
            ['name' => 'Economics', 'slug' => 'economics', 'description' => 'Economics education for senior secondary students.', 'icon' => 'scale', 'order' => 12],
            ['name' => 'Computer Science', 'slug' => 'computer-science', 'description' => 'Computer education with two air-conditioned labs (80 desktops), Informatics Practices, and AI curriculum.', 'icon' => 'laptop', 'order' => 13],
            ['name' => 'Commerce', 'slug' => 'commerce', 'description' => 'Accountancy, Business Studies, and Economics for 10+2 commerce stream.', 'icon' => 'scale', 'order' => 14],
            ['name' => 'Psychology', 'slug' => 'psychology', 'description' => 'Psychology education for humanities stream with dedicated counseling support.', 'icon' => 'brain', 'order' => 15],
            ['name' => 'Counseling', 'slug' => 'counseling', 'description' => 'Student counseling and mental health support services.', 'icon' => 'heart', 'order' => 16],
            ['name' => 'Physical Education', 'slug' => 'physical-education', 'description' => 'Sports and physical fitness programs with extensive outdoor and indoor facilities.', 'icon' => 'dumbbell', 'order' => 17],
            ['name' => 'Art & Craft', 'slug' => 'art-craft', 'description' => 'Creative arts including painting, drawing, pottery, embroidery, and tie-dye with 2 dedicated rooms.', 'icon' => 'palette', 'order' => 18],
            ['name' => 'Music', 'slug' => 'music', 'description' => 'Music education with instruments including congo, casio, tabla, harmonium, dholak, drums, and guitar.', 'icon' => 'music', 'order' => 19],
            ['name' => 'Dance', 'slug' => 'dance', 'description' => 'Dance education covering classical and contemporary forms with dedicated dance room.', 'icon' => 'users', 'order' => 20],
            ['name' => 'Self Defence', 'slug' => 'self-defence', 'description' => 'Self-defence training and martial arts education.', 'icon' => 'shield', 'order' => 21],
            ['name' => 'Special Education', 'slug' => 'special-education', 'description' => 'Special education support for students with diverse learning needs.', 'icon' => 'heart', 'order' => 22],
            ['name' => 'Primary Wing', 'slug' => 'primary-wing', 'description' => 'Classes I to V with focus on foundational literacy and numeracy.', 'icon' => 'graduation-cap', 'order' => 23],
            ['name' => 'Pre-Primary Wing', 'slug' => 'pre-primary-wing', 'description' => 'Nursery, LKG, UKG with playway methodology and sensory park access.', 'icon' => 'graduation-cap', 'order' => 24],
            ['name' => 'Activity', 'slug' => 'activity', 'description' => 'Co-curricular activities and student engagement programs.', 'icon' => 'users', 'order' => 25],
            ['name' => 'Administration', 'slug' => 'administration', 'description' => 'School administration, clerical, and support staff.', 'icon' => 'building', 'order' => 26],
            ['name' => 'Library', 'slug' => 'library', 'description' => 'Library services with 6813+ books including English, Hindi, and other languages.', 'icon' => 'book', 'order' => 27],
            ['name' => 'Laboratory', 'slug' => 'laboratory', 'description' => 'Laboratory support and technical assistance.', 'icon' => 'flask', 'order' => 28],
            ['name' => 'Health', 'slug' => 'health', 'description' => 'Health and nursing support services.', 'icon' => 'heart', 'order' => 29],
            ['name' => 'Support Staff', 'slug' => 'support-staff', 'description' => 'General support and maintenance staff.', 'icon' => 'wrench', 'order' => 30],
        ];

        foreach ($departments as $dept) {
            DB::table('departments')->insert(array_merge($dept, [
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }

    /**
     * Seed hobby clubs - Real data from brochure (10 clubs)
     */
    private function seedClubs(): void
    {
        $clubs = [
            ['name' => 'Environmental Club', 'slug' => 'environmental-club', 'description' => 'Conservation and sustainability awareness. Promotes environmental protection and eco-friendly practices among students.', 'order' => 1],
            ['name' => 'Debate Club', 'slug' => 'debate-club', 'description' => 'Developing argumentation, public speaking, and critical thinking skills through debates and elocution.', 'order' => 2],
            ['name' => 'Book Club', 'slug' => 'book-club', 'description' => 'Promoting reading and literary appreciation. Supporting 20 children with targeted literacy activities. Houses class libraries.', 'order' => 3],
            ['name' => 'Photography & Writing Club', 'slug' => 'photography-writing-club', 'description' => 'Visual and written storytelling. Creative writing workshops including poetry writing and essay composition.', 'order' => 4],
            ['name' => 'Astronomy Club', 'slug' => 'astronomy-club', 'description' => 'Celestial exploration and space science. Features dedicated astronomy lab inaugurated on 08 November 2025. Participated in NASA\'s Observe the Moon Night 2025.', 'order' => 5],
            ['name' => 'Robotics Club', 'slug' => 'robotics-club', 'description' => 'Technology and innovation with state-of-the-art Innovation & Robotics Lab. Features 3D printers, microcontrollers, and STEM tools. 22+ student projects completed.', 'order' => 6],
            ['name' => 'Dance Club', 'slug' => 'dance-club', 'description' => 'Classical and contemporary dance forms with dedicated dance room. SPICMACAY cultural performances.', 'order' => 7],
            ['name' => 'Music Club', 'slug' => 'music-club', 'description' => 'Instrumental and vocal training with fully equipped music room featuring congo, casio, tabla, harmonium, dholak, drums, and guitar.', 'order' => 8],
            ['name' => 'Art Club', 'slug' => 'art-club', 'description' => 'Painting, drawing, pottery, embroidery, tie-dye, and best-out-of-waste activities. Two dedicated art & craft rooms.', 'order' => 9],
            ['name' => 'Gardening Club', 'slug' => 'gardening-club', 'description' => 'Plant care and environmental stewardship. Maintains botanical garden with medicinal plants and herbal garden.', 'order' => 10],
        ];

        foreach ($clubs as $club) {
            DB::table('clubs')->insert(array_merge($club, [
                'is_active' => true,
                'accepts_enrollment' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }

    /**
     * Seed sports teams - Real data from brochure
     */
    private function seedSportsTeams(): void
    {
        $teams = [
            // Outdoor Games
            ['sport_name' => 'Football', 'slug' => 'football', 'category' => 'outdoor', 'description' => '1 dedicated football ground. U-14, U-17, U-19 teams for boys and girls.', 'order' => 1],
            ['sport_name' => 'Hockey', 'slug' => 'hockey', 'category' => 'outdoor', 'description' => '1 dedicated hockey ground.', 'order' => 2],
            ['sport_name' => 'Cricket', 'slug' => 'cricket', 'category' => 'outdoor', 'description' => '1 ground with proper pitch for cricket matches and practice.', 'order' => 3],
            ['sport_name' => 'Basketball', 'slug' => 'basketball', 'category' => 'outdoor', 'description' => '2 basketball grounds. U-17 and U-19 teams.', 'order' => 4],
            ['sport_name' => 'Volleyball', 'slug' => 'volleyball', 'category' => 'outdoor', 'description' => '2 volleyball grounds.', 'order' => 5],
            ['sport_name' => 'Kho-Kho', 'slug' => 'kho-kho', 'category' => 'outdoor', 'description' => '1 dedicated Kho-Kho ground for traditional Indian sport.', 'order' => 6],
            ['sport_name' => 'Athletics', 'slug' => 'athletics', 'category' => 'athletics', 'description' => 'Track and field events including discus throw. U-19 boys bronze medal at CBSE Cluster.', 'order' => 7],
            ['sport_name' => 'Cycling', 'slug' => 'cycling', 'category' => 'athletics', 'description' => 'Competitive cycling with U-17 participants at state level.', 'order' => 8],
            // Indoor Games
            ['sport_name' => 'Badminton', 'slug' => 'badminton', 'category' => 'indoor', 'description' => '1 badminton court for practice and competitions.', 'order' => 9],
            ['sport_name' => 'Table Tennis', 'slug' => 'table-tennis', 'category' => 'indoor', 'description' => 'Table tennis facility in multipurpose hall.', 'order' => 10],
            ['sport_name' => 'Chess', 'slug' => 'chess', 'category' => 'indoor', 'description' => 'Strategic board game promoting logical thinking.', 'order' => 11],
            ['sport_name' => 'Carrom', 'slug' => 'carrom', 'category' => 'indoor', 'description' => 'Traditional indoor game for skill development.', 'order' => 12],
            // Martial Arts
            ['sport_name' => 'Taekwondo', 'slug' => 'taekwondo', 'category' => 'martial_arts', 'description' => '1 dedicated court. U-17 selected for SGFI Nationals. Bronze medals at CBSE West Zone and district tournaments.', 'order' => 13],
            ['sport_name' => 'Boxing', 'slug' => 'boxing', 'category' => 'martial_arts', 'description' => 'Competitive boxing with U-17 gold medal at 69 District Tournament.', 'order' => 14],
            // Shooting (categorized as 'other')
            ['sport_name' => 'Pistol Shooting', 'slug' => 'pistol-shooting', 'category' => 'other', 'description' => 'U-17 selected for NRAI National Selection.', 'order' => 15],
        ];

        foreach ($teams as $team) {
            DB::table('sports_teams')->insert(array_merge($team, [
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }

    /**
     * Seed facilities - Comprehensive infrastructure from brochure
     */
    private function seedFacilities(): void
    {
        $facilities = [
            // Laboratories
            [
                'name' => 'Physics Laboratory',
                'slug' => 'physics-lab',
                'description' => 'Well-equipped physics lab with optical benches, meter bridges, potentiometers, ammeters, voltmeters, mirrors, lenses, prisms, P-N junction diode apparatus, Zener diode equipment, and physical balance.',
                'category' => 'lab',
                'features' => json_encode(['Optical benches', 'Meter bridges', 'Potentiometers', 'P-N junction apparatus', 'Zener diode equipment', 'Physical balance']),
                'order' => 1,
            ],
            [
                'name' => 'Chemistry Laboratory',
                'slug' => 'chemistry-lab',
                'description' => 'Comprehensive chemistry lab with digital balancing machines, glassware (burettes, pipettes, beakers, test tubes), full range of chemicals, and Bunsen burners with safety equipment.',
                'category' => 'lab',
                'features' => json_encode(['Digital balancing machines', 'Comprehensive glassware', 'Full chemical range', 'Bunsen burners', 'Safety equipment']),
                'order' => 2,
            ],
            [
                'name' => 'Biology Laboratory',
                'slug' => 'biology-lab',
                'description' => 'Biology lab featuring compound and simple microscopes, extensive specimen collection, section cutting materials, glassware, chemical stains, and preserved samples.',
                'category' => 'lab',
                'features' => json_encode(['Compound microscopes', 'Simple microscopes', 'Specimen collection', 'Section cutting materials', 'Chemical stains', 'Preserved samples']),
                'order' => 3,
            ],
            [
                'name' => 'Mathematics Laboratory',
                'slug' => 'mathematics-lab',
                'description' => 'Fosters mathematical awareness through concrete materials, models, charts demonstrating theorems, geometric instruments, and student-created mathematical models.',
                'category' => 'lab',
                'features' => json_encode(['Concrete materials', 'Theorem charts', 'Geometric instruments', 'Student-created models']),
                'order' => 4,
            ],
            [
                'name' => 'Social Science Laboratory',
                'slug' => 'social-science-lab',
                'description' => 'Features solar system models, volcano models, disaster management charts, railway development displays, maps, globes, and educational posters.',
                'category' => 'lab',
                'features' => json_encode(['Solar system models', 'Volcano models', 'Disaster management charts', 'Railway displays', 'Maps and globes']),
                'order' => 5,
            ],
            [
                'name' => 'Computer Lab 1',
                'slug' => 'computer-lab-1',
                'description' => 'Air-conditioned computer lab with 40 desktops running Windows 11/10, high-speed internet connectivity (FTTH + Air Fiber).',
                'category' => 'lab',
                'features' => json_encode(['40 desktops', 'Windows 11/10', 'Air-conditioned', 'High-speed internet', 'FTTH + Air Fiber']),
                'order' => 6,
            ],
            [
                'name' => 'Computer Lab 2',
                'slug' => 'computer-lab-2',
                'description' => 'Second air-conditioned computer lab with 40 desktops, 4 laptops for specialized training, and LAN connectivity.',
                'category' => 'lab',
                'features' => json_encode(['40 desktops', '4 laptops', 'Air-conditioned', 'LAN connectivity']),
                'order' => 7,
            ],
            [
                'name' => 'Innovation & Robotics Lab',
                'slug' => 'robotics-lab',
                'description' => 'State-of-the-art facility with robotics kits, 3D printers, microcontrollers, STEM education tools, and design thinking workspace. 22+ student innovation projects including blind stick, Wi-Fi controlled car, smart irrigation system.',
                'category' => 'lab',
                'features' => json_encode(['Robotics kits', '3D printers', 'Microcontrollers', 'STEM tools', 'Design thinking workspace']),
                'order' => 8,
            ],
            [
                'name' => 'Astronomy Lab',
                'slug' => 'astronomy-lab',
                'description' => 'Inaugurated 08 November 2025 by Maj Gen SC Kandpal. Features telescopes, spectral analysis equipment, data interpretation tools. Participated in NASA\'s Observe the Moon Night 2025 with 126 participants.',
                'category' => 'lab',
                'features' => json_encode(['Telescopes', 'Spectral analysis equipment', 'Data interpretation tools', 'Planetary study facilities']),
                'order' => 9,
            ],
            [
                'name' => 'English Language Lab',
                'slug' => 'english-language-lab',
                'description' => 'Dedicated facility for enhancing reading comprehension, writing skills, listening abilities, speaking confidence, pronunciation, and fluency.',
                'category' => 'lab',
                'features' => json_encode(['Audio-visual equipment', 'Pronunciation tools', 'Interactive learning', 'Phonetics training']),
                'order' => 10,
            ],
            // Library
            [
                'name' => 'Central Library',
                'slug' => 'central-library',
                'description' => 'Total 6,813 books (5,693 English, 1,053 Hindi, 67 other languages), 26 magazine subscriptions, 20 journals, E-Library on Digicamp platform. Fully automated with barcode system, audio-visual facility, and internet access.',
                'category' => 'library',
                'features' => json_encode(['6813+ books', '26 magazines', '20 journals', 'E-Library access', 'Barcode system', 'Audio-visual facility', 'Internet access']),
                'order' => 11,
            ],
            // Special Purpose Rooms
            [
                'name' => 'Music Room',
                'slug' => 'music-room',
                'description' => 'Equipped with congo, casio, tabla, harmonium, dholak, drums, and guitar for comprehensive music education.',
                'category' => 'special_room',
                'features' => json_encode(['Congo', 'Casio', 'Tabla', 'Harmonium', 'Dholak', 'Drums', 'Guitar']),
                'order' => 12,
            ],
            [
                'name' => 'Dance Room',
                'slug' => 'dance-room',
                'description' => 'Dedicated space for cultural activities, classical and contemporary dance forms, and physical expression.',
                'category' => 'special_room',
                'features' => json_encode(['Mirrors', 'Sound system', 'Spacious floor', 'Ventilation']),
                'order' => 13,
            ],
            [
                'name' => 'Art & Craft Rooms',
                'slug' => 'art-craft-rooms',
                'description' => '2 dedicated rooms for best out of waste, pottery, painting, embroidery, and tie-dye activities.',
                'category' => 'special_room',
                'features' => json_encode(['Art supplies', 'Pottery equipment', 'Painting materials', 'Embroidery tools', 'Tie-dye materials']),
                'order' => 14,
            ],
            [
                'name' => 'Multipurpose Hall',
                'slug' => 'multipurpose-hall',
                'description' => 'Hall for table tennis, indoor activities, events, and gatherings.',
                'category' => 'auditorium',
                'features' => json_encode(['Table tennis tables', 'Event space', 'Sound system']),
                'order' => 15,
            ],
            [
                'name' => 'Conference Room',
                'slug' => 'conference-room',
                'description' => 'Meeting and seminar room for staff meetings, parent-teacher meetings, and workshops.',
                'category' => 'special_room',
                'features' => json_encode(['AV equipment', 'Conference table', 'Presentation facilities']),
                'order' => 16,
            ],
            [
                'name' => 'Counseling Room',
                'slug' => 'counseling-room',
                'description' => 'Dedicated space for student counseling with full-time school counselor Mrs. Anjali Bhardwaj.',
                'category' => 'special_room',
                'features' => json_encode(['Private space', 'Comfortable seating', 'Confidential environment']),
                'order' => 17,
            ],
            [
                'name' => 'Infirmary',
                'slug' => 'infirmary',
                'description' => 'Medical facility with full-time nursing assistant, first aid, and regular health check-ups by field hospital.',
                'category' => 'special_room',
                'features' => json_encode(['Full-time nurse', 'First aid', 'Rest beds', 'Medical supplies']),
                'order' => 18,
            ],
            [
                'name' => 'IE Resource Room',
                'slug' => 'ie-resource-room',
                'description' => 'Special Education support room with Special Educator for learning disabled students.',
                'category' => 'special_room',
                'features' => json_encode(['Special educator', 'Learning aids', 'Individual attention', 'Customized support']),
                'order' => 19,
            ],
            // Sports Grounds
            [
                'name' => 'Football Ground',
                'slug' => 'football-ground',
                'description' => '1 dedicated football ground for matches and practice sessions.',
                'category' => 'playground',
                'features' => json_encode(['Full-size pitch', 'Goal posts', 'Marking']),
                'order' => 20,
            ],
            [
                'name' => 'Cricket Ground',
                'slug' => 'cricket-ground',
                'description' => 'Cricket ground with proper pitch for competitive matches.',
                'category' => 'playground',
                'features' => json_encode(['Proper pitch', 'Practice nets']),
                'order' => 21,
            ],
            [
                'name' => 'Basketball Courts',
                'slug' => 'basketball-courts',
                'description' => '2 basketball grounds for inter-house and competitive matches.',
                'category' => 'playground',
                'features' => json_encode(['2 courts', 'Hoops', 'Marking']),
                'order' => 22,
            ],
            [
                'name' => 'Hockey Ground',
                'slug' => 'hockey-ground',
                'description' => '1 dedicated hockey ground.',
                'category' => 'playground',
                'features' => json_encode(['Goal posts', 'Field marking']),
                'order' => 23,
            ],
            // Special Gardens and Parks
            [
                'name' => 'Science Park',
                'slug' => 'science-park',
                'description' => 'Interactive learning models including Play with magnet, Lift yourself, First-order lever seesaw, Newton\'s colour disk, Max/Min thermometer, Periscope, 3D Pendulum, Archimedes Principle demonstration, and Projectile equipment.',
                'category' => 'playground',
                'features' => json_encode(['Magnetic models', 'Lever demonstrations', 'Newton\'s disk', 'Thermometers', 'Periscope', '3D Pendulum', 'Archimedes demonstration', 'Projectile equipment']),
                'order' => 24,
            ],
            [
                'name' => 'Botanical Garden',
                'slug' => 'botanical-garden',
                'description' => 'Medicinal plants collection: Amla, Gwarpatha (Aloe vera), Shatavari, Ashoka, Amaltas, Neem, Peepal, Arjun, Jamun, Bamboo, Pomegranate.',
                'category' => 'playground',
                'features' => json_encode(['Amla', 'Aloe vera', 'Shatavari', 'Ashoka', 'Amaltas', 'Neem', 'Peepal', 'Arjun', 'Jamun', 'Bamboo', 'Pomegranate']),
                'order' => 25,
            ],
            [
                'name' => 'Herbal Garden',
                'slug' => 'herbal-garden',
                'description' => 'Features Rose, Tulsi, Aloevera, Mint, Marigold, Sadabahar, Giloy, Lemongrass, Curry Tree, Lemon, Patharchatta, and more.',
                'category' => 'playground',
                'features' => json_encode(['Rose', 'Tulsi', 'Aloevera', 'Mint', 'Marigold', 'Giloy', 'Lemongrass', 'Curry leaves', 'Lemon']),
                'order' => 26,
            ],
            [
                'name' => 'Animal Park',
                'slug' => 'animal-park',
                'description' => 'Educational display featuring Lion, Bear, Deer Family, Giraffe, Kangaroo, Zebra, Elephant, and Chimpanzee models.',
                'category' => 'playground',
                'features' => json_encode(['Lion model', 'Bear', 'Deer family', 'Giraffe', 'Kangaroo', 'Zebra', 'Elephant', 'Chimpanzee']),
                'order' => 27,
            ],
            [
                'name' => 'Sensory Park',
                'slug' => 'sensory-park',
                'description' => 'Multi-sensory learning environment for pre-primary students with visual stimuli, auditory elements, tactile experiences, aromatic plants, motor skills activities, and selfie corner.',
                'category' => 'playground',
                'features' => json_encode(['Visual stimuli', 'Sound pipes', 'Musical instruments', 'Soft textures', 'Sand pit', 'Aromatic plants', 'Motor skill activities', 'Selfie corner']),
                'order' => 28,
            ],
            // Classrooms
            [
                'name' => 'Smart Classrooms',
                'slug' => 'smart-classrooms',
                'description' => '38 well-ventilated, fully furnished classrooms with smart boards (30) and interactive panels (8) for technology-aided enhanced learning (TAeL).',
                'category' => 'classroom',
                'features' => json_encode(['38 classrooms', '30 smart boards', '8 interactive panels', 'TAeL enabled', 'Well-ventilated', 'Fully furnished']),
                'order' => 29,
            ],
            [
                'name' => 'Examination Cell',
                'slug' => 'examination-cell',
                'description' => 'Ensures credibility, confidentiality, and transparency. Equipped with computers, photocopier-cum-printers, and multi-function devices. Fully digitalized examination system.',
                'category' => 'special_room',
                'features' => json_encode(['Computers', 'Photocopier-printers', 'Digitalized system', 'Secure storage']),
                'order' => 30,
            ],
        ];

        foreach ($facilities as $facility) {
            DB::table('facilities')->insert(array_merge($facility, [
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }

    /**
     * Seed committees - Real data from brochure
     */
    private function seedCommittees(): void
    {
        $committees = [
            [
                'name' => 'Examination Committee',
                'slug' => 'examination-committee',
                'description' => 'Oversees all examination-related activities ensuring integrity and smooth conduct.',
                'functions' => 'Selection of question papers, Printing and security of question papers, Conduct of examinations, Distribution of answer scripts, Result declaration and PTM organization, Maintenance of consolidated marks register, Record keeping of results and exams',
                'order' => 1,
            ],
            [
                'name' => 'Discipline Committee',
                'slug' => 'discipline-committee',
                'description' => 'Monitors and addresses student behavior and maintains school discipline standards.',
                'functions' => 'Monitoring unfair means in examinations, Addressing disobedience and arrogance, Ensuring punctuality, Investigating theft and property damage, Handling inappropriate behavior and language, Preventing substance abuse, Combating casteism and discrimination',
                'order' => 2,
            ],
            [
                'name' => 'Purchase Committee',
                'slug' => 'purchase-committee',
                'description' => 'Oversees all school procurement ensuring transparency and value for money.',
                'functions' => 'Oversees all school purchases, Submits recommendations before procurement, Ensures transparency in financial transactions',
                'order' => 3,
            ],
            [
                'name' => 'Female Complaint Committee',
                'slug' => 'female-complaint-committee',
                'description' => 'Protection from sexual harassment as per Vishakha Guidelines.',
                'functions' => 'Protection from sexual harassment (Vishakha Guidelines), Investigation of complaints, Improvement of work conditions for female employees and students',
                'order' => 4,
            ],
            [
                'name' => 'Health & Hygiene Committee',
                'slug' => 'health-hygiene-committee',
                'description' => 'Ensures cleanliness and health standards across the campus.',
                'functions' => 'Cleanliness of toilets, classes, and corridors, Student health and nutrition monitoring, Annual dental and medical check-ups',
                'order' => 5,
            ],
            [
                'name' => 'Activity Committee',
                'slug' => 'activity-committee',
                'description' => 'Organizes co-curricular and extra-curricular activities.',
                'functions' => 'Conducts inter-house competitions, Organizes sports competitions, Plans educational visits and excursions, Arranges seminars and workshops, Coordinates inter-school competitions',
                'order' => 6,
            ],
            [
                'name' => 'POCSO Committee',
                'slug' => 'pocso-committee',
                'description' => 'Protection of Children from Sexual Offences - awareness and prevention.',
                'functions' => 'Awareness about sexual exploitation, Rights and responsibilities education, Training for faculty on abuse recognition, Gender sensitivity programs, Self-defense sessions',
                'order' => 7,
            ],
            [
                'name' => 'School Management Committee',
                'slug' => 'school-management-committee',
                'description' => 'Oversees overall functioning and governance of the school.',
                'functions' => 'Oversees the functioning of the school, Local financial control and fundraising, Decides building and playground locations, Recommends additional classes, Determines conditions of service, Decides school hours and vacations, Considers and approves annual budget, Arranges medical and canteen services, Nominates auditors',
                'chairman' => 'Brig Millind Vyas (Commander, 18 Artillery Brigade)',
                'order' => 8,
            ],
        ];

        foreach ($committees as $committee) {
            DB::table('committees')->insert(array_merge($committee, [
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }

    /**
     * Seed fee structures - Real data from brochure 2025-26
     */
    private function seedFeeStructures(): void
    {
        $feeStructures = [
            // Officers
            ['academic_year' => 2025, 'category' => 'officers', 'class_range' => 'Nursery-UKG', 'registration_fee' => 500, 'admission_fee' => 2100, 'security_deposit' => 6000, 'annual_fee' => 7047, 'tuition_fee' => 2551, 'computer_fee' => 404, 'science_fee' => 0],
            ['academic_year' => 2025, 'category' => 'officers', 'class_range' => 'I-V', 'registration_fee' => 500, 'admission_fee' => 2100, 'security_deposit' => 6000, 'annual_fee' => 7047, 'tuition_fee' => 3376, 'computer_fee' => 404, 'science_fee' => 0],
            ['academic_year' => 2025, 'category' => 'officers', 'class_range' => 'VI-VIII', 'registration_fee' => 500, 'admission_fee' => 2100, 'security_deposit' => 6000, 'annual_fee' => 7047, 'tuition_fee' => 3721, 'computer_fee' => 404, 'science_fee' => 0],
            ['academic_year' => 2025, 'category' => 'officers', 'class_range' => 'IX-X', 'registration_fee' => 500, 'admission_fee' => 2100, 'security_deposit' => 6000, 'annual_fee' => 7047, 'tuition_fee' => 3881, 'computer_fee' => 404, 'science_fee' => 160],
            ['academic_year' => 2025, 'category' => 'officers', 'class_range' => 'XI-XII', 'registration_fee' => 500, 'admission_fee' => 2100, 'security_deposit' => 6000, 'annual_fee' => 7047, 'tuition_fee' => 4102, 'computer_fee' => 404, 'science_fee' => 220],
            // JCOs
            ['academic_year' => 2025, 'category' => 'jco', 'class_range' => 'Nursery-UKG', 'registration_fee' => 500, 'admission_fee' => 1050, 'security_deposit' => 4000, 'annual_fee' => 6409, 'tuition_fee' => 2544, 'computer_fee' => 404, 'science_fee' => 0],
            ['academic_year' => 2025, 'category' => 'jco', 'class_range' => 'I-V', 'registration_fee' => 500, 'admission_fee' => 1050, 'security_deposit' => 4000, 'annual_fee' => 6409, 'tuition_fee' => 3013, 'computer_fee' => 404, 'science_fee' => 0],
            ['academic_year' => 2025, 'category' => 'jco', 'class_range' => 'VI-VIII', 'registration_fee' => 500, 'admission_fee' => 1050, 'security_deposit' => 4000, 'annual_fee' => 6409, 'tuition_fee' => 3376, 'computer_fee' => 404, 'science_fee' => 0],
            ['academic_year' => 2025, 'category' => 'jco', 'class_range' => 'IX-X', 'registration_fee' => 500, 'admission_fee' => 1050, 'security_deposit' => 4000, 'annual_fee' => 6409, 'tuition_fee' => 3536, 'computer_fee' => 404, 'science_fee' => 160],
            ['academic_year' => 2025, 'category' => 'jco', 'class_range' => 'XI-XII', 'registration_fee' => 500, 'admission_fee' => 1050, 'security_deposit' => 4000, 'annual_fee' => 6409, 'tuition_fee' => 3721, 'computer_fee' => 404, 'science_fee' => 220],
            // OR
            ['academic_year' => 2025, 'category' => 'or', 'class_range' => 'Nursery-UKG', 'registration_fee' => 500, 'admission_fee' => 600, 'security_deposit' => 3000, 'annual_fee' => 5893, 'tuition_fee' => 2535, 'computer_fee' => 387, 'science_fee' => 0],
            ['academic_year' => 2025, 'category' => 'or', 'class_range' => 'I-V', 'registration_fee' => 500, 'admission_fee' => 600, 'security_deposit' => 3000, 'annual_fee' => 5893, 'tuition_fee' => 2630, 'computer_fee' => 387, 'science_fee' => 0],
            ['academic_year' => 2025, 'category' => 'or', 'class_range' => 'VI-VIII', 'registration_fee' => 500, 'admission_fee' => 600, 'security_deposit' => 3000, 'annual_fee' => 5893, 'tuition_fee' => 2996, 'computer_fee' => 387, 'science_fee' => 0],
            ['academic_year' => 2025, 'category' => 'or', 'class_range' => 'IX-X', 'registration_fee' => 500, 'admission_fee' => 600, 'security_deposit' => 3000, 'annual_fee' => 5893, 'tuition_fee' => 3150, 'computer_fee' => 387, 'science_fee' => 160],
            ['academic_year' => 2025, 'category' => 'or', 'class_range' => 'XI-XII', 'registration_fee' => 500, 'admission_fee' => 600, 'security_deposit' => 3000, 'annual_fee' => 5893, 'tuition_fee' => 3359, 'computer_fee' => 387, 'science_fee' => 220],
            // Civilians
            ['academic_year' => 2025, 'category' => 'civilian', 'class_range' => 'Nursery-UKG', 'registration_fee' => 500, 'admission_fee' => 6000, 'security_deposit' => 8000, 'annual_fee' => 9832, 'tuition_fee' => 3914, 'computer_fee' => 514, 'science_fee' => 0],
            ['academic_year' => 2025, 'category' => 'civilian', 'class_range' => 'I-V', 'registration_fee' => 500, 'admission_fee' => 6000, 'security_deposit' => 8000, 'annual_fee' => 9832, 'tuition_fee' => 4206, 'computer_fee' => 514, 'science_fee' => 0],
            ['academic_year' => 2025, 'category' => 'civilian', 'class_range' => 'VI-VIII', 'registration_fee' => 500, 'admission_fee' => 6000, 'security_deposit' => 8000, 'annual_fee' => 9832, 'tuition_fee' => 4378, 'computer_fee' => 514, 'science_fee' => 0],
            ['academic_year' => 2025, 'category' => 'civilian', 'class_range' => 'IX-X', 'registration_fee' => 500, 'admission_fee' => 6000, 'security_deposit' => 8000, 'annual_fee' => 9832, 'tuition_fee' => 4778, 'computer_fee' => 514, 'science_fee' => 220],
            ['academic_year' => 2025, 'category' => 'civilian', 'class_range' => 'XI-XII', 'registration_fee' => 500, 'admission_fee' => 6000, 'security_deposit' => 8000, 'annual_fee' => 9832, 'tuition_fee' => 4897, 'computer_fee' => 514, 'science_fee' => 360],
        ];

        foreach ($feeStructures as $fee) {
            DB::table('fee_structures')->insert(array_merge($fee, [
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }

    /**
     * Seed board results - Real data from brochure
     */
    private function seedBoardResults(): void
    {
        $results = [
            ['academic_year' => 2024, 'board' => 'cbse', 'class' => 'X', 'appeared' => 73, 'passed' => 73, 'pass_percentage' => 100.00, 'api_score' => 426.03, 'above_90_percent' => 19, 'above_80_percent' => 25, 'above_70_percent' => 22, 'above_60_percent' => 7, 'is_published' => true],
            ['academic_year' => 2025, 'board' => 'cbse', 'class' => 'X', 'appeared' => 73, 'passed' => 73, 'pass_percentage' => 100.00, 'api_score' => 400.00, 'above_90_percent' => 9, 'above_80_percent' => 25, 'above_70_percent' => 22, 'above_60_percent' => 12, 'is_published' => true],
            ['academic_year' => 2024, 'board' => 'cbse', 'class' => 'XII', 'appeared' => 35, 'passed' => 35, 'pass_percentage' => 100.00, 'api_score' => 411.43, 'above_90_percent' => 3, 'above_80_percent' => 9, 'above_70_percent' => 12, 'above_60_percent' => 8, 'is_published' => true],
            ['academic_year' => 2025, 'board' => 'cbse', 'class' => 'XII', 'appeared' => 37, 'passed' => 37, 'pass_percentage' => 100.00, 'api_score' => 502.70, 'above_90_percent' => 5, 'above_80_percent' => 13, 'above_70_percent' => 12, 'above_60_percent' => 5, 'is_published' => true],
        ];

        foreach ($results as $result) {
            DB::table('board_results')->insert(array_merge($result, ['created_at' => now(), 'updated_at' => now()]));
        }
    }

    /**
     * Seed API trends - Real data from brochure (6 years)
     */
    private function seedApiTrends(): void
    {
        $trends = [
            ['academic_year' => 2020, 'class' => 'X', 'api_score' => 235.71],
            ['academic_year' => 2021, 'class' => 'X', 'api_score' => 236.99],
            ['academic_year' => 2022, 'class' => 'X', 'api_score' => 410.00],
            ['academic_year' => 2023, 'class' => 'X', 'api_score' => 445.98],
            ['academic_year' => 2024, 'class' => 'X', 'api_score' => 426.03],
            ['academic_year' => 2025, 'class' => 'X', 'api_score' => 400.00],
            ['academic_year' => 2020, 'class' => 'XII', 'api_score' => 263.88],
            ['academic_year' => 2021, 'class' => 'XII', 'api_score' => 292.31],
            ['academic_year' => 2022, 'class' => 'XII', 'api_score' => 575.76],
            ['academic_year' => 2023, 'class' => 'XII', 'api_score' => 389.47],
            ['academic_year' => 2024, 'class' => 'XII', 'api_score' => 411.43],
            ['academic_year' => 2025, 'class' => 'XII', 'api_score' => 502.70],
        ];

        foreach ($trends as $trend) {
            DB::table('api_trends')->insert(array_merge($trend, ['created_at' => now(), 'updated_at' => now()]));
        }
    }

    /**
     * Seed competitive exams
     */
    private function seedCompetitiveExams(): void
    {
        $exams = [
            ['exam_name' => 'National Defence Academy (NDA)', 'slug' => 'nda', 'short_name' => 'NDA', 'description' => 'NDA entrance for joining Indian Armed Forces.', 'eligibility' => json_encode(['Class XI', 'Class XII']), 'coaching_available' => true, 'official_website' => 'https://upsc.gov.in'],
            ['exam_name' => 'National Talent Search Examination', 'slug' => 'ntse', 'short_name' => 'NTSE', 'description' => 'NCERT scholarship examination.', 'eligibility' => json_encode(['Class X']), 'coaching_available' => true, 'official_website' => 'https://ncert.nic.in'],
            ['exam_name' => 'Sainik School Entrance', 'slug' => 'sainik-school', 'short_name' => 'AISSEE', 'description' => 'All India Sainik School Entrance.', 'eligibility' => json_encode(['Class VI', 'Class IX']), 'coaching_available' => true],
            ['exam_name' => 'Science Olympiad', 'slug' => 'science-olympiad', 'short_name' => 'NSO', 'description' => 'National Science Olympiad.', 'eligibility' => json_encode(['Class I to XII']), 'coaching_available' => true],
            ['exam_name' => 'Mathematics Olympiad', 'slug' => 'math-olympiad', 'short_name' => 'IMO', 'description' => 'International Mathematics Olympiad.', 'eligibility' => json_encode(['Class I to XII']), 'coaching_available' => true],
        ];

        foreach ($exams as $exam) {
            DB::table('competitive_exams')->insert(array_merge($exam, ['is_active' => true, 'order' => 0, 'created_at' => now(), 'updated_at' => now()]));
        }
    }

    /**
     * Seed initiatives
     */
    private function seedInitiatives(): void
    {
        $initiatives = [
            ['name' => 'CRISP', 'slug' => 'crisp', 'short_name' => 'CRISP', 'description' => 'Consortium for Research and Innovation in School Pedagogy - 10-hour online training.', 'partner' => 'CBSE', 'status' => 'active', 'is_featured' => true],
            ['name' => 'P2E - Passport to Earning', 'slug' => 'p2e', 'short_name' => 'P2E', 'description' => 'Financial literacy and employability skills with AWES-UNICEF.', 'partner' => 'AWES-UNICEF', 'status' => 'active', 'is_featured' => true],
            ['name' => 'Vidyanjali Project', 'slug' => 'vidyanjali', 'short_name' => 'Vidyanjali', 'description' => 'Adopted Govt. Upper Primary School Palka.', 'partner' => 'Ministry of Education', 'status' => 'active', 'is_featured' => true],
            ['name' => 'Embibe Platform', 'slug' => 'embibe', 'short_name' => 'Embibe', 'description' => '350 students and 12 teachers registered since July 2023.', 'status' => 'active', 'is_featured' => false],
            ['name' => 'NEP 2020 Implementation', 'slug' => 'nep-2020', 'short_name' => 'NEP', 'description' => 'No Bag Hour, Art Integration, Peer Tutoring.', 'partner' => 'Ministry of Education', 'status' => 'active', 'is_featured' => true],
            ['name' => 'Digicamp Platform', 'slug' => 'digicamp', 'short_name' => 'Digicamp', 'description' => 'Any Place, Any Time learning with parent access.', 'status' => 'active', 'is_featured' => true],
        ];

        foreach ($initiatives as $initiative) {
            DB::table('initiatives')->insert(array_merge($initiative, ['order' => 0, 'created_at' => now(), 'updated_at' => now()]));
        }
    }

    /**
     * Seed partnerships
     */
    private function seedPartnerships(): void
    {
        $partnerships = [
            ['partner_name' => 'Google Workspace for Education', 'slug' => 'google-workspace', 'description' => 'Free educational license for Google tools.', 'type' => 'technology', 'benefits' => json_encode(['Gmail', 'Drive', 'Classroom', 'Meet'])],
            ['partner_name' => 'Canva for Education', 'slug' => 'canva-education', 'description' => 'Professional design platform.', 'type' => 'technology', 'benefits' => json_encode(['Design tools', 'Templates'])],
            ['partner_name' => 'Adobe Express for Education', 'slug' => 'adobe-express', 'description' => 'Creative tools for content creation.', 'type' => 'technology', 'benefits' => json_encode(['Photo editing', 'Video creation'])],
            ['partner_name' => 'GitHub with Copilot Pro', 'slug' => 'github-copilot', 'description' => 'AI-powered coding assistance.', 'type' => 'technology', 'benefits' => json_encode(['Code repos', 'AI assistant'])],
            ['partner_name' => 'AWES', 'slug' => 'awes', 'description' => 'Army Welfare Education Society.', 'type' => 'educational', 'benefits' => json_encode(['Guidelines', 'Training'])],
            ['partner_name' => 'CBSE', 'slug' => 'cbse', 'description' => 'Affiliation Board (No. 1780018).', 'type' => 'government', 'benefits' => json_encode(['Curriculum', 'Board exams'])],
        ];

        foreach ($partnerships as $partnership) {
            DB::table('partnerships')->insert(array_merge($partnership, ['is_active' => true, 'order' => 0, 'created_at' => now(), 'updated_at' => now()]));
        }
    }

    /**
     * Seed staff
     */
    private function seedStaff(): void
    {
        // Get department IDs by slug for reference
        $departments = DB::table('departments')->pluck('id', 'slug')->toArray();

        // Complete staff list from staffnames.md (65 members)
        $staff = [
            // MANAGEMENT
            ['name' => 'Dr. Neera Pandey', 'slug' => 'dr-neera-pandey', 'designation' => 'Principal', 'qualifications' => 'M.A., M.Ed., PG in School Management & Leadership, Diploma (Yale)', 'type' => 'management', 'department_id' => $departments['management'] ?? null, 'show_on_website' => true, 'order' => 1],

            // PGT (Post Graduate Teachers)
            ['name' => 'Ms. Payal Kanwar', 'slug' => 'payal-kanwar', 'designation' => 'PGT Computer Science', 'type' => 'teaching', 'department_id' => $departments['computer-science'] ?? null, 'order' => 2],
            ['name' => 'Mr. Dravesh', 'slug' => 'dravesh', 'designation' => 'PGT Mathematics', 'type' => 'teaching', 'department_id' => $departments['mathematics'] ?? null, 'order' => 3],
            ['name' => 'Ms. Shreya Sharma', 'slug' => 'shreya-sharma', 'designation' => 'PGT Accountancy & Business Studies', 'type' => 'teaching', 'department_id' => $departments['commerce'] ?? null, 'order' => 4],
            ['name' => 'Ms. Divya', 'slug' => 'divya', 'designation' => 'PGT Biology', 'type' => 'teaching', 'department_id' => $departments['biology'] ?? null, 'order' => 5],
            ['name' => 'Mr. Amit Mittal', 'slug' => 'amit-mittal', 'designation' => 'PGT Physics', 'type' => 'teaching', 'department_id' => $departments['physics'] ?? null, 'order' => 6],
            ['name' => 'Ms. Annu Kumari', 'slug' => 'annu-kumari', 'designation' => 'PGT Psychology', 'type' => 'teaching', 'department_id' => $departments['psychology'] ?? null, 'order' => 7],
            ['name' => 'Mr. Ravi', 'slug' => 'ravi-phe', 'designation' => 'PGT Physical Education', 'type' => 'teaching', 'department_id' => $departments['physical-education'] ?? null, 'order' => 8],
            ['name' => 'Ms. Savita Kanwar', 'slug' => 'savita-kanwar', 'designation' => 'PGT History', 'type' => 'teaching', 'department_id' => $departments['history'] ?? null, 'order' => 9],
            ['name' => 'Ms. Ritu', 'slug' => 'ritu', 'designation' => 'PGT Economics', 'type' => 'teaching', 'department_id' => $departments['economics'] ?? null, 'order' => 10],
            ['name' => 'Ms. Usha V. Sharma', 'slug' => 'usha-v-sharma', 'designation' => 'PGT English', 'type' => 'teaching', 'department_id' => $departments['english'] ?? null, 'order' => 11],

            // TGT (Trained Graduate Teachers)
            ['name' => 'Mr. Dushyant Tiwari', 'slug' => 'dushyant-tiwari', 'designation' => 'TGT Hindi', 'type' => 'teaching', 'department_id' => $departments['hindi'] ?? null, 'order' => 12],
            ['name' => 'Ms. Seema Mathur', 'slug' => 'seema-mathur', 'designation' => 'TGT Hindi', 'type' => 'teaching', 'department_id' => $departments['hindi'] ?? null, 'order' => 13],
            ['name' => 'Ms. Manju Choudhary', 'slug' => 'manju-choudhary', 'designation' => 'TGT Social Science', 'type' => 'teaching', 'department_id' => $departments['social-science'] ?? null, 'order' => 14],
            ['name' => 'Mr. Satendra Kr. Sharma', 'slug' => 'satendra-kr-sharma', 'designation' => 'TGT Sanskrit', 'type' => 'teaching', 'department_id' => $departments['sanskrit'] ?? null, 'order' => 15],
            ['name' => 'Mr. Vishnu Kumar', 'slug' => 'vishnu-kumar', 'designation' => 'TGT Science', 'type' => 'teaching', 'department_id' => $departments['science'] ?? null, 'order' => 16],
            ['name' => 'Ms. Anjali Bhardwaj', 'slug' => 'anjali-bhardwaj', 'designation' => 'TGT Counsellor', 'type' => 'teaching', 'department_id' => $departments['counseling'] ?? null, 'order' => 17],
            ['name' => 'Mr. Amit Kumar', 'slug' => 'amit-kumar-tgt', 'designation' => 'TGT Mathematics', 'type' => 'teaching', 'department_id' => $departments['mathematics'] ?? null, 'order' => 18],
            ['name' => 'Ms. Manju Lata', 'slug' => 'manju-lata', 'designation' => 'TGT Hindi', 'type' => 'teaching', 'department_id' => $departments['hindi'] ?? null, 'order' => 19],
            ['name' => 'Ms. Richa Sharma', 'slug' => 'richa-sharma', 'designation' => 'TGT Science', 'type' => 'teaching', 'department_id' => $departments['science'] ?? null, 'order' => 20],
            ['name' => 'Mr. Kishore Kumar', 'slug' => 'kishore-kumar', 'designation' => 'TGT Mathematics', 'type' => 'teaching', 'department_id' => $departments['mathematics'] ?? null, 'order' => 21],
            ['name' => 'Ms. Neha Shani', 'slug' => 'neha-shani', 'designation' => 'TGT Science', 'type' => 'teaching', 'department_id' => $departments['science'] ?? null, 'order' => 22],
            ['name' => 'Ms. Ruchi Tanwar', 'slug' => 'ruchi-tanwar', 'designation' => 'TGT Social Science', 'type' => 'teaching', 'department_id' => $departments['social-science'] ?? null, 'order' => 23],
            ['name' => 'Ms. Lekshmi Priya NR', 'slug' => 'lekshmi-priya-nr', 'designation' => 'TGT English', 'type' => 'teaching', 'department_id' => $departments['english'] ?? null, 'order' => 24],
            ['name' => 'Mr. Krishan Kumar Singh', 'slug' => 'krishan-kumar-singh', 'designation' => 'TGT Artificial Intelligence', 'type' => 'teaching', 'department_id' => $departments['computer-science'] ?? null, 'order' => 25],
            ['name' => 'Ms. Monika Yadav', 'slug' => 'monika-yadav', 'designation' => 'TGT English', 'type' => 'teaching', 'department_id' => $departments['english'] ?? null, 'order' => 26],

            // PRT (Primary Teachers)
            ['name' => 'Ms. Meenu Chaudhary', 'slug' => 'meenu-chaudhary', 'designation' => 'PRT', 'type' => 'teaching', 'department_id' => $departments['primary-wing'] ?? null, 'order' => 27],
            ['name' => 'Ms. Namita Chugh', 'slug' => 'namita-chugh', 'designation' => 'PRT', 'type' => 'teaching', 'department_id' => $departments['primary-wing'] ?? null, 'order' => 28],
            ['name' => 'Ms. Rajnesh Kumari', 'slug' => 'rajnesh-kumari', 'designation' => 'PRT', 'type' => 'teaching', 'department_id' => $departments['primary-wing'] ?? null, 'order' => 29],
            ['name' => 'Ms. Alka Yadav', 'slug' => 'alka-yadav', 'designation' => 'PRT', 'type' => 'teaching', 'department_id' => $departments['primary-wing'] ?? null, 'order' => 30],
            ['name' => 'Ms. Ashu Arora', 'slug' => 'ashu-arora', 'designation' => 'PRT', 'type' => 'teaching', 'department_id' => $departments['primary-wing'] ?? null, 'order' => 31],
            ['name' => 'Ms. Rajani Sharma', 'slug' => 'rajani-sharma', 'designation' => 'PRT', 'type' => 'teaching', 'department_id' => $departments['primary-wing'] ?? null, 'order' => 32],
            ['name' => 'Ms. Renu Gund', 'slug' => 'renu-gund', 'designation' => 'PRT', 'type' => 'teaching', 'department_id' => $departments['primary-wing'] ?? null, 'order' => 33],
            ['name' => 'Mr. Mayank Sharma', 'slug' => 'mayank-sharma', 'designation' => 'PRT', 'type' => 'teaching', 'department_id' => $departments['primary-wing'] ?? null, 'order' => 34],
            ['name' => 'Mr. Ravindra Kr. Sharma', 'slug' => 'ravindra-kr-sharma', 'designation' => 'PRT', 'type' => 'teaching', 'department_id' => $departments['primary-wing'] ?? null, 'order' => 35],
            ['name' => 'Ms. Shveta Jain', 'slug' => 'shveta-jain', 'designation' => 'PRT', 'type' => 'teaching', 'department_id' => $departments['primary-wing'] ?? null, 'order' => 36],
            ['name' => 'Ms. Amrita Thakur', 'slug' => 'amrita-thakur', 'designation' => 'PRT', 'type' => 'teaching', 'department_id' => $departments['primary-wing'] ?? null, 'order' => 37],
            ['name' => 'Ms. Rupa Tomar', 'slug' => 'rupa-tomar', 'designation' => 'PRT', 'type' => 'teaching', 'department_id' => $departments['primary-wing'] ?? null, 'order' => 38],
            ['name' => 'Ms. Prachi Sharma', 'slug' => 'prachi-sharma', 'designation' => 'PRT', 'type' => 'teaching', 'department_id' => $departments['primary-wing'] ?? null, 'order' => 39],
            ['name' => 'Ms. Pinky Saini', 'slug' => 'pinky-saini', 'designation' => 'PRT Art & Craft', 'type' => 'teaching', 'department_id' => $departments['art-craft'] ?? null, 'order' => 40],
            ['name' => 'Mr. Praveen Kumar', 'slug' => 'praveen-kumar', 'designation' => 'PRT Special Education', 'type' => 'teaching', 'department_id' => $departments['special-education'] ?? null, 'order' => 41],
            ['name' => 'Mr. Manmeet Arora', 'slug' => 'manmeet-arora', 'designation' => 'PRT Music', 'type' => 'teaching', 'department_id' => $departments['music'] ?? null, 'order' => 42],
            ['name' => 'Mr. Abhimanyu Singh', 'slug' => 'abhimanyu-singh', 'designation' => 'PRT Dance', 'type' => 'teaching', 'department_id' => $departments['dance'] ?? null, 'order' => 43],
            ['name' => 'Mr. Akhtar Hussain', 'slug' => 'akhtar-hussain', 'designation' => 'PRT Physical Education', 'type' => 'teaching', 'department_id' => $departments['physical-education'] ?? null, 'order' => 44],

            // Specialized Staff
            ['name' => 'Ms. Usha Saini', 'slug' => 'usha-saini', 'designation' => 'Self Defence Instructor', 'type' => 'teaching', 'department_id' => $departments['self-defence'] ?? null, 'order' => 45],

            // Mother Teachers (Pre-Primary)
            ['name' => 'Ms. Jyoti Kumari', 'slug' => 'jyoti-kumari', 'designation' => 'Mother Teacher', 'type' => 'teaching', 'department_id' => $departments['pre-primary-wing'] ?? null, 'order' => 46],
            ['name' => 'Ms. Isha Sharma', 'slug' => 'isha-sharma', 'designation' => 'Mother Teacher', 'type' => 'teaching', 'department_id' => $departments['pre-primary-wing'] ?? null, 'order' => 47],
            ['name' => 'Ms. Anita Ahlawat', 'slug' => 'anita-ahlawat', 'designation' => 'Mother Teacher', 'type' => 'teaching', 'department_id' => $departments['pre-primary-wing'] ?? null, 'order' => 48],
            ['name' => 'Ms. Sumita Singha Mahapatra', 'slug' => 'sumita-singha-mahapatra', 'designation' => 'Mother Teacher', 'type' => 'teaching', 'department_id' => $departments['pre-primary-wing'] ?? null, 'order' => 49],
            ['name' => 'Ms. Kalpana Jaswal', 'slug' => 'kalpana-jaswal', 'designation' => 'Mother Teacher', 'type' => 'teaching', 'department_id' => $departments['pre-primary-wing'] ?? null, 'order' => 50],

            // Activity Teachers
            ['name' => 'Ms. Pallavi Dubey', 'slug' => 'pallavi-dubey', 'designation' => 'Activity Teacher', 'type' => 'teaching', 'department_id' => $departments['activity'] ?? null, 'order' => 51],
            ['name' => 'Ms. Neha Sharma', 'slug' => 'neha-sharma-art', 'designation' => 'Art & Craft Teacher', 'type' => 'teaching', 'department_id' => $departments['art-craft'] ?? null, 'order' => 52],

            // NON-TEACHING STAFF - Administration
            ['name' => 'Mr. Ravi Kumar', 'slug' => 'ravi-kumar-clerk', 'designation' => 'Head Clerk', 'type' => 'non_teaching', 'department_id' => $departments['administration'] ?? null, 'order' => 53],
            ['name' => 'Mr. Ajay Kumar Gupta', 'slug' => 'ajay-kumar-gupta', 'designation' => 'Librarian', 'type' => 'non_teaching', 'department_id' => $departments['library'] ?? null, 'order' => 54],
            ['name' => 'Mr. Mahendra Singh Rajpoot', 'slug' => 'mahendra-singh-rajpoot', 'designation' => 'Admission Supervisor', 'type' => 'non_teaching', 'department_id' => $departments['administration'] ?? null, 'order' => 55],
            ['name' => 'Mr. Subhash Chand', 'slug' => 'subhash-chand', 'designation' => 'Account Clerk', 'type' => 'non_teaching', 'department_id' => $departments['administration'] ?? null, 'order' => 56],
            ['name' => 'Ms. Khushbu Sharma', 'slug' => 'khushbu-sharma', 'designation' => 'UDC (Upper Division Clerk)', 'type' => 'non_teaching', 'department_id' => $departments['administration'] ?? null, 'order' => 57],
            ['name' => 'Mr. Yogendra Singh', 'slug' => 'yogendra-singh', 'designation' => 'LDC (Lower Division Clerk)', 'type' => 'non_teaching', 'department_id' => $departments['administration'] ?? null, 'order' => 58],
            ['name' => 'Mr. Preetam Singh Bhati', 'slug' => 'preetam-singh-bhati', 'designation' => 'LDC (Lower Division Clerk)', 'type' => 'non_teaching', 'department_id' => $departments['administration'] ?? null, 'order' => 59],
            ['name' => 'Ms. Muskan Yadav', 'slug' => 'muskan-yadav', 'designation' => 'Receptionist', 'type' => 'non_teaching', 'department_id' => $departments['administration'] ?? null, 'order' => 60],

            // IT & Lab Support
            ['name' => 'Mr. Nirmal Kumawat', 'slug' => 'nirmal-kumawat', 'designation' => 'IT Supervisor', 'type' => 'non_teaching', 'department_id' => $departments['computer-science'] ?? null, 'order' => 61],
            ['name' => 'Mr. Dal Chand', 'slug' => 'dal-chand', 'designation' => 'Physics Lab Technician', 'type' => 'non_teaching', 'department_id' => $departments['laboratory'] ?? null, 'order' => 62],
            ['name' => 'Ms. Pooja', 'slug' => 'pooja', 'designation' => 'Lab Assistant', 'type' => 'non_teaching', 'department_id' => $departments['laboratory'] ?? null, 'order' => 63],

            // Health & Support
            ['name' => 'Ms. Chinu Kumari', 'slug' => 'chinu-kumari', 'designation' => 'Nursing Assistant', 'type' => 'non_teaching', 'department_id' => $departments['health'] ?? null, 'order' => 64],
            ['name' => 'Ms. Rekha', 'slug' => 'rekha', 'designation' => 'Peon', 'type' => 'non_teaching', 'department_id' => $departments['support-staff'] ?? null, 'order' => 65],
        ];

        foreach ($staff as $member) {
            DB::table('staff')->insert(array_merge($member, [
                'is_active' => true,
                'show_on_website' => $member['show_on_website'] ?? true,
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }

    /**
     * Seed achievements
     */
    private function seedAchievements(): void
    {
        $achievements = [
            ['title' => 'National Literary Leadership Award', 'slug' => 'national-literary-award', 'description' => 'Top literary institution in Rajasthan, 35th nationally. 101 student books, 2 teacher books.', 'category' => 'academic', 'level' => 'national', 'is_featured' => true],
            ['title' => 'Cricket U-17 CBSE Nationals', 'slug' => 'cricket-u17-nationals', 'description' => 'Selected for CBSE Nationals.', 'category' => 'sports', 'level' => 'national', 'academic_year' => 2025],
            ['title' => 'Taekwondo U-17 SGFI Nationals', 'slug' => 'taekwondo-u17-nationals', 'description' => 'Selected for SGFI Nationals.', 'category' => 'sports', 'level' => 'national', 'academic_year' => 2025],
            ['title' => 'Football U-19 Girls District 1st', 'slug' => 'football-u19-district', 'description' => '1st Position at 69 District Tournament.', 'category' => 'sports', 'level' => 'district', 'academic_year' => 2025],
            ['title' => '100% Board Results', 'slug' => '100-percent-results', 'description' => 'Consistent 100% pass rate in CBSE Boards.', 'category' => 'academic', 'level' => 'school', 'is_featured' => true],
            ['title' => 'Innovation & Robotics', 'slug' => 'innovation-robotics', 'description' => '22+ student innovation projects.', 'category' => 'co_curricular', 'level' => 'school', 'is_featured' => true],
        ];

        foreach ($achievements as $achievement) {
            DB::table('achievements')->insert(array_merge($achievement, ['is_active' => true, 'order' => 0, 'created_at' => now(), 'updated_at' => now()]));
        }
    }

    /**
     * Seed alumni
     */
    private function seedAlumni(): void
    {
        $alumni = [
            ['name' => 'Ayush Choudhary', 'slug' => 'ayush-choudhary', 'achievement' => 'Selected for NDA-155', 'category' => 'defense', 'is_verified' => true],
            ['name' => 'Vikash Kumar Tawar', 'slug' => 'vikash-tawar', 'achievement' => 'Selected for CDS-1', 'category' => 'defense', 'is_verified' => true],
            ['name' => 'Ashwani', 'slug' => 'ashwani', 'achievement' => 'B.Com Law at AIL Mohali', 'organization' => 'Army Institute of Law, Mohali', 'category' => 'other', 'is_verified' => true],
            ['name' => 'Bhavishya', 'slug' => 'bhavishya', 'achievement' => 'B.Tech at IIMA Kolkata', 'category' => 'engineering', 'is_verified' => true],
        ];

        foreach ($alumni as $alum) {
            DB::table('alumni')->insert(array_merge($alum, ['is_active' => true, 'order' => 0, 'created_at' => now(), 'updated_at' => now()]));
        }
    }

    /**
     * Seed sliders
     */
    private function seedSliders(): void
    {
        $sliders = [
            ['title' => 'Welcome to Army Public School, Alwar', 'subtitle' => 'A Happy Learner is a Motivated Learner', 'description' => 'Nurturing excellence since 1981.', 'image' => '/images/sliders/hero-1.jpg', 'button_text' => 'Learn More', 'button_link' => '/about', 'text_position' => 'center', 'order' => 1],
            ['title' => 'World-Class Infrastructure', 'subtitle' => '14.5 Acres of Serene Campus', 'description' => 'Smart classrooms, labs, sports facilities.', 'image' => '/images/sliders/hero-2.jpg', 'button_text' => 'Explore', 'button_link' => '/facilities', 'text_position' => 'left', 'order' => 2],
            ['title' => 'Academic Excellence', 'subtitle' => '100% Board Results | API: 502.70', 'description' => 'Consistently achieving 100% pass rate.', 'image' => '/images/sliders/hero-3.jpg', 'button_text' => 'View Results', 'button_link' => '/academics/results', 'text_position' => 'right', 'order' => 3],
        ];

        foreach ($sliders as $slider) {
            DB::table('sliders')->insert(array_merge($slider, ['is_active' => true, 'created_at' => now(), 'updated_at' => now()]));
        }
    }

    /**
     * Seed pages
     */
    private function seedPages(): void
    {
        $pages = [
            ['title' => 'About Us', 'slug' => 'about', 'content' => '<p>Army Public School, Alwar has a distinguished legacy spanning over four decades.</p>', 'meta_title' => 'About Us | APS Alwar', 'status' => 'published', 'template' => 'about', 'show_in_menu' => true],
            ['title' => 'Vision & Mission', 'slug' => 'vision-mission', 'content' => '<h2>Vision</h2><p>To foster talent and individuality.</p>', 'status' => 'published', 'template' => 'default', 'show_in_menu' => true],
            ['title' => 'Principal\'s Message', 'slug' => 'principal-message', 'content' => '<p>Education transcends textbooks.</p>', 'status' => 'published', 'template' => 'default', 'show_in_menu' => true],
            ['title' => 'Contact Us', 'slug' => 'contact', 'content' => '<p>Itarana, Alwar Military Station, Rajasthan</p>', 'status' => 'published', 'template' => 'contact', 'show_in_menu' => true],
        ];

        foreach ($pages as $page) {
            DB::table('pages')->insert(array_merge($page, ['created_at' => now(), 'updated_at' => now()]));
        }
    }

    /**
     * Seed announcements
     */
    private function seedAnnouncements(): void
    {
        $announcements = [
            ['title' => 'Admissions Open 2025-26', 'content' => 'Registration open for Nursery to Class XII.', 'type' => 'important', 'priority' => 'high', 'show_in_ticker' => true],
            ['title' => '100% Board Results', 'content' => 'Congratulations to Class X and XII!', 'type' => 'general', 'priority' => 'medium', 'show_in_ticker' => true],
            ['title' => 'Astronomy Lab Inaugurated', 'content' => 'New lab inaugurated on 08 Nov 2025.', 'type' => 'general', 'priority' => 'medium', 'show_in_ticker' => true],
            ['title' => 'National Literary Award', 'content' => 'Ranked 35th nationally by BriBooks!', 'type' => 'important', 'priority' => 'high', 'show_in_ticker' => true],
        ];

        foreach ($announcements as $announcement) {
            DB::table('announcements')->insert(array_merge($announcement, ['is_active' => true, 'created_at' => now(), 'updated_at' => now()]));
        }
    }

    /**
     * Seed news
     */
    private function seedNews(): void
    {
        $news = [
            ['title' => 'National Literary Leadership Award', 'slug' => 'national-literary-award-2025', 'excerpt' => 'Top literary institution in Rajasthan.', 'content' => '<p>Ranked 35th nationally with 101 student books.</p>', 'status' => 'published', 'is_featured' => true, 'published_at' => now()],
            ['title' => 'Astronomy Lab Inaugurated', 'slug' => 'astronomy-lab-2025', 'excerpt' => 'State-of-the-art facility opened.', 'content' => '<p>Inaugurated 08 Nov 2025 by Maj Gen SC Kandpal.</p>', 'status' => 'published', 'is_featured' => true, 'published_at' => now()->subDays(5)],
            ['title' => 'Board Results 2024-25', 'slug' => 'board-results-2025', 'excerpt' => '100% pass rate continues.', 'content' => '<p>Class XII API: 502.70, Class X API: 400.</p>', 'status' => 'published', 'is_featured' => true, 'published_at' => now()->subDays(10)],
        ];

        foreach ($news as $item) {
            DB::table('news')->insert(array_merge($item, ['created_at' => now(), 'updated_at' => now()]));
        }
    }

    /**
     * Seed events
     */
    private function seedEvents(): void
    {
        $events = [
            ['title' => 'Annual Sports Day 2025', 'slug' => 'sports-day-2025', 'description' => 'Inter-house sports competitions.', 'venue' => 'Sports Ground', 'start_date' => now()->addDays(30)->format('Y-m-d'), 'status' => 'upcoming', 'is_featured' => true],
            ['title' => 'Republic Day 2026', 'slug' => 'republic-day-2026', 'description' => 'Flag hoisting and cultural programs.', 'venue' => 'Assembly Ground', 'start_date' => '2026-01-26', 'status' => 'upcoming', 'is_featured' => true],
            ['title' => 'Parent-Teacher Meeting', 'slug' => 'ptm-dec-2025', 'description' => 'Monthly PTM for all classes.', 'venue' => 'Classrooms', 'start_date' => now()->addDays(15)->format('Y-m-d'), 'status' => 'upcoming'],
        ];

        foreach ($events as $event) {
            DB::table('events')->insert(array_merge($event, ['created_at' => now(), 'updated_at' => now()]));
        }
    }

    /**
     * Seed celebrations
     */
    private function seedCelebrations(): void
    {
        $celebrations = [
            ['name' => 'Independence Day', 'slug' => 'independence-day', 'category' => 'national', 'celebration_date' => date('Y') . '-08-15', 'is_annual' => true],
            ['name' => 'Republic Day', 'slug' => 'republic-day', 'category' => 'national', 'celebration_date' => date('Y') . '-01-26', 'is_annual' => true],
            ['name' => 'Teachers\' Day', 'slug' => 'teachers-day', 'category' => 'school', 'celebration_date' => date('Y') . '-09-05', 'is_annual' => true],
            ['name' => 'Children\'s Day', 'slug' => 'childrens-day', 'category' => 'school', 'celebration_date' => date('Y') . '-11-14', 'is_annual' => true],
            ['name' => 'Gandhi Jayanti', 'slug' => 'gandhi-jayanti', 'category' => 'national', 'celebration_date' => date('Y') . '-10-02', 'is_annual' => true],
            ['name' => 'Kargil Vijay Diwas', 'slug' => 'kargil-vijay-diwas', 'category' => 'national', 'celebration_date' => date('Y') . '-07-26', 'is_annual' => true],
            ['name' => 'AWES Day', 'slug' => 'awes-day', 'category' => 'school', 'celebration_date' => date('Y') . '-04-29', 'is_annual' => true],
        ];

        foreach ($celebrations as $celebration) {
            DB::table('celebrations')->insert(array_merge($celebration, ['is_active' => true, 'created_at' => now(), 'updated_at' => now()]));
        }
    }

    /**
     * Seed quick links
     */
    private function seedQuickLinks(): void
    {
        $quickLinks = [
            ['title' => 'CBSE Results', 'url' => 'https://cbseresults.nic.in', 'icon' => 'award', 'target' => '_blank', 'order' => 1],
            ['title' => 'CBSE Official', 'url' => 'https://cbse.gov.in', 'icon' => 'external-link', 'target' => '_blank', 'order' => 2],
            ['title' => 'AWES Website', 'url' => 'https://awesindia.com', 'icon' => 'globe', 'target' => '_blank', 'order' => 3],
            ['title' => 'Digicamp Login', 'url' => 'https://digicamp.in', 'icon' => 'laptop', 'target' => '_blank', 'order' => 4],
            ['title' => 'Fee Payment', 'url' => '/fee-payment', 'icon' => 'credit-card', 'target' => '_self', 'order' => 5],
            ['title' => 'TC Verification', 'url' => '/tc-verification', 'icon' => 'file-check', 'target' => '_self', 'order' => 6],
        ];

        foreach ($quickLinks as $link) {
            DB::table('quick_links')->insert(array_merge($link, ['is_active' => true, 'created_at' => now(), 'updated_at' => now()]));
        }
    }
}