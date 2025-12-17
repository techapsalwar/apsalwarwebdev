<?php

namespace App\Exports;

use App\Models\ClubMember;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ClubEnrollmentsExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected ?int $clubId;
    protected ?string $status;

    public function __construct(?int $clubId = null, ?string $status = null)
    {
        $this->clubId = $clubId;
        $this->status = $status;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        $currentYear = date('Y');
        
        $query = ClubMember::with('club')
            ->where('academic_year', $currentYear);
        
        if ($this->clubId) {
            $query->where('club_id', $this->clubId);
        }
        
        if ($this->status) {
            $query->where('status', $this->status);
        }
        
        return $query->orderBy('created_at', 'desc')->get();
    }

    /**
     * Map data for each row
     */
    public function map($enrollment): array
    {
        return [
            $enrollment->id,
            $enrollment->student_name,
            $enrollment->class,
            ucfirst($enrollment->gender ?? 'N/A'),
            $enrollment->admission_number ?? 'N/A',
            $enrollment->club->name,
            $enrollment->club->category === 'academic_interest' ? 'Academic & Interest' : 'Creative & Physical',
            $enrollment->email,
            $enrollment->phone,
            $enrollment->parent_phone ?? 'N/A',
            $enrollment->reason ?? 'N/A',
            ucfirst($enrollment->status),
            $enrollment->academic_year,
            $enrollment->created_at->format('d/m/Y H:i'),
        ];
    }

    /**
     * Define column headings
     */
    public function headings(): array
    {
        return [
            'ID',
            'Student Name',
            'Class',
            'Gender',
            'Admission Number',
            'Club Name',
            'Club Category',
            'Email',
            'Phone',
            'Parent Phone',
            'Reason for Joining',
            'Status',
            'Academic Year',
            'Applied On',
        ];
    }

    /**
     * Style the worksheet
     */
    public function styles(Worksheet $sheet)
    {
        return [
            // Style the first row as bold (header row)
            1 => [
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '4F46E5'],
                ],
            ],
        ];
    }
}
