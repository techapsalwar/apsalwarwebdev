<?php

namespace App\Http\Controllers;

use App\Models\Admission;
use App\Models\FeeStructure;
use App\Models\FeeType;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdmissionsController extends Controller
{
    /**
     * Display admissions landing page
     */
    public function index(): Response
    {
        // Get current year admissions info
        $currentAdmission = Admission::where('status', 'open')
            ->where('academic_year', now()->year . '-' . (now()->year + 1))
            ->first();

        return Inertia::render('admissions/index', [
            'currentAdmission' => $currentAdmission,
            'admissionInfo' => $this->getAdmissionInfo(),
            'eligibility' => $this->getEligibilityCriteria(),
            'statistics' => [
                'totalStudents' => 1046,
                'classesOffered' => '1 to 12',
                'averageClassSize' => 28,
                'teacherStudentRatio' => '1:16',
            ],
        ]);
    }

    /**
     * Display admission process
     */
    public function process(): Response
    {
        return Inertia::render('admissions/process', [
            'steps' => $this->getAdmissionSteps(),
            'documents' => $this->getRequiredDocuments(),
            'timeline' => $this->getAdmissionTimeline(),
            'reservations' => $this->getReservationPolicy(),
        ]);
    }

    /**
     * Display fee structure
     */
    public function feeStructure(): Response
    {
        // Get active fee structures grouped by category and class range
        $feeStructures = FeeStructure::where('is_active', true)
            ->orderByRaw("FIELD(category, 'officers', 'jco', 'or', 'civilian')")
            ->orderByRaw("FIELD(class_range, 'nursery_ukg', 'i_v', 'vi_viii', 'ix_x', 'xi_xii')")
            ->get();

        // Get active custom fee types
        $feeTypes = FeeType::active()->ordered()->get();

        // Group by category for frontend display
        $groupedFees = $feeStructures->groupBy('category')->map(function ($items, $category) {
            return [
                'label' => FeeStructure::CATEGORIES[$category] ?? $category,
                'items' => $items->map(function ($fee) {
                    return [
                        'id' => $fee->id,
                        'class_range' => $fee->class_range,
                        'class_range_label' => FeeStructure::CLASS_RANGES[$fee->class_range] ?? $fee->class_range,
                        'registration_fee' => $fee->registration_fee,
                        'admission_fee' => $fee->admission_fee,
                        'security_deposit' => $fee->security_deposit,
                        'annual_fee' => $fee->annual_fee,
                        'tuition_fee' => $fee->tuition_fee,
                        'computer_fee' => $fee->computer_fee,
                        'science_fee' => $fee->science_fee,
                        'other_fees' => $fee->other_fees,
                    ];
                })->values(),
            ];
        });

        // Get current academic year from the first record
        $academicYear = $feeStructures->first()?->academic_year ?? now()->year;

        return Inertia::render('admissions/fee-structure', [
            'feeStructures' => $groupedFees->isEmpty() 
                ? $this->getDefaultFeeStructure() 
                : $groupedFees,
            'feeTypes' => $feeTypes,
            'academicYear' => $academicYear,
            'categories' => FeeStructure::CATEGORIES,
            'classRanges' => FeeStructure::CLASS_RANGES,
            'paymentModes' => $this->getPaymentModes(),
            'discounts' => $this->getDiscountPolicy(),
        ]);
    }

    /**
     * Display FAQs
     */
    public function faqs(): Response
    {
        return Inertia::render('admissions/faqs', [
            'faqs' => $this->getAdmissionFAQs(),
            'categories' => ['General', 'Eligibility', 'Fees', 'Process', 'Facilities'],
        ]);
    }

    /**
     * Get admission info
     */
    private function getAdmissionInfo(): array
    {
        return [
            'school_type' => 'CBSE Co-Educational Day School',
            'affiliation' => '1780018',
            'classes' => 'Class 1 to Class 12',
            'medium' => 'English',
            'streams' => 'Science, Commerce, Humanities (Class 11-12)',
            'run_by' => 'Army Welfare Education Society (AWES)',
            'open_to' => [
                'Wards of Army Personnel (Serving, Retired, Widows)',
                'Wards of Defence Civilians',
                'Wards of other Defence Personnel',
                'Civilians (limited seats)',
            ],
        ];
    }

    /**
     * Get eligibility criteria
     */
    private function getEligibilityCriteria(): array
    {
        return [
            [
                'class' => 'Class 1',
                'age' => '5+ years as on 31st March',
                'requirement' => 'No formal education required',
            ],
            [
                'class' => 'Class 2-5',
                'age' => 'Age appropriate',
                'requirement' => 'TC from previous school, Report Card',
            ],
            [
                'class' => 'Class 6-8',
                'age' => 'Age appropriate',
                'requirement' => 'TC, Report Card, Entrance Test',
            ],
            [
                'class' => 'Class 9-10',
                'age' => 'Age appropriate',
                'requirement' => 'TC, Report Card, Entrance Test in core subjects',
            ],
            [
                'class' => 'Class 11 Science',
                'age' => 'Age appropriate',
                'requirement' => 'Min 60% in Class 10, with Maths & Science',
            ],
            [
                'class' => 'Class 11 Commerce/Humanities',
                'age' => 'Age appropriate',
                'requirement' => 'Min 55% in Class 10',
            ],
        ];
    }

    /**
     * Get admission process steps
     */
    private function getAdmissionSteps(): array
    {
        return [
            [
                'step' => 1,
                'title' => 'Registration',
                'description' => 'Fill online/offline registration form with required details',
                'icon' => 'form',
            ],
            [
                'step' => 2,
                'title' => 'Document Submission',
                'description' => 'Submit all required documents at the school office',
                'icon' => 'documents',
            ],
            [
                'step' => 3,
                'title' => 'Entrance Test',
                'description' => 'Appear for entrance test (for Class 6 onwards)',
                'icon' => 'test',
            ],
            [
                'step' => 4,
                'title' => 'Interview',
                'description' => 'Parent-student interaction with school authorities',
                'icon' => 'interview',
            ],
            [
                'step' => 5,
                'title' => 'Merit List',
                'description' => 'Selection based on merit and category reservation',
                'icon' => 'list',
            ],
            [
                'step' => 6,
                'title' => 'Fee Payment',
                'description' => 'Pay admission fee to confirm the seat',
                'icon' => 'payment',
            ],
            [
                'step' => 7,
                'title' => 'Admission Confirmed',
                'description' => 'Collect admission kit and start your APS journey',
                'icon' => 'confirm',
            ],
        ];
    }

    /**
     * Get required documents
     */
    private function getRequiredDocuments(): array
    {
        return [
            [
                'category' => 'Identity & Birth',
                'documents' => [
                    'Birth Certificate (Original + Photocopy)',
                    'Aadhar Card of Student',
                    'Passport Size Photographs (6 copies)',
                ],
            ],
            [
                'category' => 'Parent Documents',
                'documents' => [
                    'Service Certificate (for Army Personnel)',
                    'PPO Copy (for Retired/Widow)',
                    'Aadhar Card of Father/Mother',
                    'Address Proof (if different from Service Record)',
                ],
            ],
            [
                'category' => 'Academic Documents',
                'documents' => [
                    'Transfer Certificate from previous school',
                    'Report Card of last 2 years',
                    'Character Certificate',
                    'Migration Certificate (for Class 11)',
                ],
            ],
            [
                'category' => 'Medical Documents',
                'documents' => [
                    'Medical Fitness Certificate',
                    'Blood Group Certificate',
                    'Vaccination Record',
                ],
            ],
        ];
    }

    /**
     * Get admission timeline
     */
    private function getAdmissionTimeline(): array
    {
        return [
            ['month' => 'January', 'activity' => 'Admission notification released'],
            ['month' => 'February', 'activity' => 'Registration begins'],
            ['month' => 'March', 'activity' => 'Registration closes, Entrance tests'],
            ['month' => 'April', 'activity' => 'Merit lists published, Admission process'],
            ['month' => 'May-June', 'activity' => 'Second round admissions (if seats available)'],
            ['month' => 'July', 'activity' => 'New session begins'],
        ];
    }

    /**
     * Get reservation policy
     */
    private function getReservationPolicy(): array
    {
        return [
            ['category' => 'Category I', 'description' => 'Wards of Serving Army Personnel', 'priority' => 1],
            ['category' => 'Category II', 'description' => 'Wards of Retired Army Personnel', 'priority' => 2],
            ['category' => 'Category III', 'description' => 'Wards of Army Widows/War Widows', 'priority' => 3],
            ['category' => 'Category IV', 'description' => 'Wards of Defence Civilians', 'priority' => 4],
            ['category' => 'Category V', 'description' => 'Wards of Ex-Servicemen (Other Services)', 'priority' => 5],
            ['category' => 'Category VI', 'description' => 'Civilians', 'priority' => 6],
        ];
    }

    /**
     * Get default fee structure
     */
    private function getDefaultFeeStructure(): array
    {
        return [
            'Class 1-5' => [
                [
                    'fee_type' => 'Tuition Fee',
                    'amount' => 2500,
                    'frequency' => 'Monthly',
                ],
                [
                    'fee_type' => 'Annual Charges',
                    'amount' => 5000,
                    'frequency' => 'Yearly',
                ],
                [
                    'fee_type' => 'Computer Fee',
                    'amount' => 1200,
                    'frequency' => 'Yearly',
                ],
            ],
            'Class 6-8' => [
                [
                    'fee_type' => 'Tuition Fee',
                    'amount' => 2800,
                    'frequency' => 'Monthly',
                ],
                [
                    'fee_type' => 'Annual Charges',
                    'amount' => 5500,
                    'frequency' => 'Yearly',
                ],
                [
                    'fee_type' => 'Computer Fee',
                    'amount' => 1500,
                    'frequency' => 'Yearly',
                ],
                [
                    'fee_type' => 'Lab Fee',
                    'amount' => 1200,
                    'frequency' => 'Yearly',
                ],
            ],
            'Class 9-10' => [
                [
                    'fee_type' => 'Tuition Fee',
                    'amount' => 3200,
                    'frequency' => 'Monthly',
                ],
                [
                    'fee_type' => 'Annual Charges',
                    'amount' => 6000,
                    'frequency' => 'Yearly',
                ],
                [
                    'fee_type' => 'Computer Fee',
                    'amount' => 1800,
                    'frequency' => 'Yearly',
                ],
                [
                    'fee_type' => 'Lab Fee',
                    'amount' => 1500,
                    'frequency' => 'Yearly',
                ],
            ],
            'Class 11-12' => [
                [
                    'fee_type' => 'Tuition Fee',
                    'amount' => 3500,
                    'frequency' => 'Monthly',
                ],
                [
                    'fee_type' => 'Annual Charges',
                    'amount' => 6500,
                    'frequency' => 'Yearly',
                ],
                [
                    'fee_type' => 'Computer Fee',
                    'amount' => 2000,
                    'frequency' => 'Yearly',
                ],
                [
                    'fee_type' => 'Lab Fee',
                    'amount' => 2000,
                    'frequency' => 'Yearly',
                ],
            ],
        ];
    }

    /**
     * Get payment modes
     */
    private function getPaymentModes(): array
    {
        return [
            [
                'mode' => 'Online Payment',
                'description' => 'Pay via school portal using UPI, Net Banking, or Card',
                'recommended' => true,
            ],
            [
                'mode' => 'Bank Transfer',
                'description' => 'NEFT/RTGS to school bank account',
                'recommended' => false,
            ],
            [
                'mode' => 'Demand Draft',
                'description' => 'In favor of "Army Public School Alwar"',
                'recommended' => false,
            ],
            [
                'mode' => 'Cash',
                'description' => 'At school fee counter during office hours',
                'recommended' => false,
            ],
        ];
    }

    /**
     * Get discount policy
     */
    private function getDiscountPolicy(): array
    {
        return [
            [
                'type' => 'Sibling Discount',
                'discount' => '10% on tuition fee for second child',
                'applicable' => 'Second child onwards',
            ],
            [
                'type' => 'War Widow',
                'discount' => 'Special consideration',
                'applicable' => 'Wards of war widows',
            ],
            [
                'type' => 'Merit Scholarship',
                'discount' => 'Up to 25% based on academic performance',
                'applicable' => 'Top performers in each class',
            ],
        ];
    }

    /**
     * Get admission FAQs
     */
    private function getAdmissionFAQs(): array
    {
        return [
            [
                'category' => 'General',
                'question' => 'Who can apply for admission at APS Alwar?',
                'answer' => 'Primarily, wards of Army personnel (serving, retired, or widows), defence civilians, and limited seats for civilians. Priority is given based on AWES category system.',
            ],
            [
                'category' => 'General',
                'question' => 'What is the medium of instruction?',
                'answer' => 'The medium of instruction is English. Hindi is taught as a second language from Class 1.',
            ],
            [
                'category' => 'Eligibility',
                'question' => 'What is the age criteria for Class 1 admission?',
                'answer' => 'The child should be 5+ years of age as on 31st March of the academic year for Class 1 admission.',
            ],
            [
                'category' => 'Eligibility',
                'question' => 'Is entrance test required for all classes?',
                'answer' => 'Entrance test is required for admission to Class 6 and above. For Class 1-5, admission is based on documents and interaction.',
            ],
            [
                'category' => 'Fees',
                'question' => 'What are the fee payment options?',
                'answer' => 'Fees can be paid monthly, quarterly, or annually. Online payment, bank transfer, DD, and cash payments are accepted.',
            ],
            [
                'category' => 'Fees',
                'question' => 'Are there any fee concessions available?',
                'answer' => 'Yes, sibling discount (10% for second child), merit scholarships, and special consideration for war widows are available.',
            ],
            [
                'category' => 'Process',
                'question' => 'When does the admission process start?',
                'answer' => 'Admission notification is usually released in January. Registration begins in February and new session starts in April.',
            ],
            [
                'category' => 'Process',
                'question' => 'What documents are required for admission?',
                'answer' => 'Birth certificate, Aadhar card, service certificate (for Army personnel), TC from previous school, report cards, passport photos, and medical certificate.',
            ],
            [
                'category' => 'Facilities',
                'question' => 'Is transport facility available?',
                'answer' => 'Yes, school bus facility is available covering major routes in Alwar city and cantonment areas.',
            ],
            [
                'category' => 'Facilities',
                'question' => 'What streams are available in Class 11-12?',
                'answer' => 'We offer Science (with/without Maths), Commerce, and Humanities streams with various subject combinations.',
            ],
        ];
    }
}
