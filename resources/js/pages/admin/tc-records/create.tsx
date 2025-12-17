import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { FileCheck, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';

export default function TcRecordsCreate() {
    const [pdfFileName, setPdfFileName] = useState<string>('');
    
    const { data, setData, post, processing, errors, progress } = useForm({
        tc_number: '',
        student_name: '',
        father_name: '',
        admission_number: '',
        class: '',
        date_of_issue: '',
        pdf: null as File | null,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Transfer Certificates', href: '/admin/tc-records' },
        { title: 'Add TC', href: '/admin/tc-records/create' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/tc-records', {
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
            <Head title="Add Transfer Certificate" />
            
            <div className="max-w-2xl mx-auto p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <FileCheck className="h-6 w-6" />
                        Add Transfer Certificate
                    </h1>
                    <p className="text-gray-500">Upload a single transfer certificate with student details</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Student Information</CardTitle>
                                <CardDescription>Enter the student details as they appear on the TC</CardDescription>
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
                                <CardDescription>Upload the scanned copy of the transfer certificate (PDF only, max 5MB)</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
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
                                                        <span className="text-primary font-medium">Click to upload</span> or drag and drop
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
                                {processing ? 'Uploading...' : 'Add Transfer Certificate'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
