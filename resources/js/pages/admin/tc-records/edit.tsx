import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { FileCheck, Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';

interface TcRecord {
    id: number;
    tc_number: string;
    student_name: string;
    father_name: string;
    admission_number: string;
    class: string;
    date_of_issue: string;
    pdf_path: string | null;
}

interface Props {
    tcRecord: TcRecord;
}

export default function TcRecordsEdit({ tcRecord }: Props) {
    const [pdfFileName, setPdfFileName] = useState<string>('');
    
    const { data, setData, post, processing, errors, progress } = useForm({
        _method: 'PUT',
        tc_number: tcRecord.tc_number,
        student_name: tcRecord.student_name,
        father_name: tcRecord.father_name,
        admission_number: tcRecord.admission_number,
        class: tcRecord.class,
        date_of_issue: tcRecord.date_of_issue,
        pdf: null as File | null,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Transfer Certificates', href: '/admin/tc-records' },
        { title: 'Edit', href: `/admin/tc-records/${tcRecord.id}/edit` },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/tc-records/${tcRecord.id}`, {
            forceFormData: true,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('pdf', file);
            setPdfFileName(file.name);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Transfer Certificate" />
            
            <div className="max-w-2xl mx-auto p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <FileCheck className="h-6 w-6" />
                        Edit Transfer Certificate
                    </h1>
                    <p className="text-gray-500">Update TC details for {tcRecord.student_name}</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Student Information</CardTitle>
                                <CardDescription>Update the student details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="tc_number">TC Number *</Label>
                                        <Input
                                            id="tc_number"
                                            value={data.tc_number}
                                            onChange={(e) => setData('tc_number', e.target.value)}
                                            placeholder="e.g., TC-2025-001"
                                        />
                                        {errors.tc_number && <p className="text-sm text-red-500">{errors.tc_number}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="admission_number">Admission Number *</Label>
                                        <Input
                                            id="admission_number"
                                            value={data.admission_number}
                                            onChange={(e) => setData('admission_number', e.target.value)}
                                            placeholder="e.g., ADM-2020-001"
                                        />
                                        {errors.admission_number && <p className="text-sm text-red-500">{errors.admission_number}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="student_name">Student Name *</Label>
                                    <Input
                                        id="student_name"
                                        value={data.student_name}
                                        onChange={(e) => setData('student_name', e.target.value)}
                                        placeholder="Full name as on records"
                                    />
                                    {errors.student_name && <p className="text-sm text-red-500">{errors.student_name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="father_name">Father's Name *</Label>
                                    <Input
                                        id="father_name"
                                        value={data.father_name}
                                        onChange={(e) => setData('father_name', e.target.value)}
                                        placeholder="Father's full name"
                                    />
                                    {errors.father_name && <p className="text-sm text-red-500">{errors.father_name}</p>}
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="class">Class at Time of Leaving *</Label>
                                        <Input
                                            id="class"
                                            value={data.class}
                                            onChange={(e) => setData('class', e.target.value)}
                                            placeholder="e.g., XII"
                                        />
                                        {errors.class && <p className="text-sm text-red-500">{errors.class}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="date_of_issue">Date of Issue *</Label>
                                        <Input
                                            id="date_of_issue"
                                            type="date"
                                            value={data.date_of_issue}
                                            onChange={(e) => setData('date_of_issue', e.target.value)}
                                        />
                                        {errors.date_of_issue && <p className="text-sm text-red-500">{errors.date_of_issue}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>TC Document</CardTitle>
                                <CardDescription>
                                    {tcRecord.pdf_path 
                                        ? 'A PDF is already uploaded. Upload a new file only if you want to replace it.' 
                                        : 'Upload the scanned copy of the transfer certificate (PDF only, max 5MB)'
                                    }
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {tcRecord.pdf_path && !pdfFileName && (
                                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                            <FileText className="h-8 w-8 text-green-600" />
                                            <div>
                                                <p className="font-medium text-green-800">Current PDF Uploaded</p>
                                                <a 
                                                    href={`/admin/tc-records/${tcRecord.id}/download`}
                                                    className="text-sm text-green-600 hover:underline"
                                                >
                                                    Download current file
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                        <input
                                            type="file"
                                            id="pdf"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <label htmlFor="pdf" className="cursor-pointer">
                                            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                            <p className="text-sm text-gray-600">
                                                {pdfFileName ? (
                                                    <span className="text-green-600 font-medium">{pdfFileName}</span>
                                                ) : (
                                                    <>
                                                        <span className="text-primary font-medium">Click to upload</span> a new PDF
                                                    </>
                                                )}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">PDF file only (max 5MB)</p>
                                        </label>
                                    </div>
                                    {errors.pdf && <p className="text-sm text-red-500">{errors.pdf}</p>}
                                    
                                    {progress && (
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div 
                                                className="bg-primary h-2.5 rounded-full transition-all" 
                                                style={{ width: `${progress.percentage}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="flex gap-4 justify-end">
                            <Button type="button" variant="outline" onClick={() => router.get('/admin/tc-records')}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Saving...' : 'Update Transfer Certificate'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
