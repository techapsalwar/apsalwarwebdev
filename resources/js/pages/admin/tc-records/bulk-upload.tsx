import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { FileCheck, Upload, Download, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';

interface Props {
    flash?: {
        success?: string;
        bulk_errors?: string[];
    };
}

export default function TcRecordsBulkUpload({ flash }: Props) {
    const [csvFileName, setCsvFileName] = useState<string>('');
    const [zipFileName, setZipFileName] = useState<string>('');
    
    const { data, setData, post, processing, errors, progress } = useForm({
        csv_file: null as File | null,
        zip_file: null as File | null,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Transfer Certificates', href: '/admin/tc-records' },
        { title: 'Bulk Upload', href: '/admin/tc-records/bulk-upload' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/tc-records/bulk-upload', {
            forceFormData: true,
        });
    };

    const handleCsvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('csv_file', file);
            setCsvFileName(file.name);
        }
    };

    const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('zip_file', file);
            setZipFileName(file.name);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bulk Upload Transfer Certificates" />
            
            <div className="max-w-3xl mx-auto p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Upload className="h-6 w-6" />
                        Bulk Upload Transfer Certificates
                    </h1>
                    <p className="text-gray-500">Upload multiple TC records using CSV and ZIP files</p>
                </div>

                {flash?.success && (
                    <Alert className="mb-6 border-green-500 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-800">Success</AlertTitle>
                        <AlertDescription className="text-green-700">{flash.success}</AlertDescription>
                    </Alert>
                )}

                {flash?.bulk_errors && flash.bulk_errors.length > 0 && (
                    <Alert className="mb-6 border-yellow-500 bg-yellow-50">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <AlertTitle className="text-yellow-800">Some records were skipped</AlertTitle>
                        <AlertDescription className="text-yellow-700">
                            <ul className="list-disc ml-4 mt-2">
                                {flash.bulk_errors.slice(0, 10).map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                                {flash.bulk_errors.length > 10 && (
                                    <li>... and {flash.bulk_errors.length - 10} more errors</li>
                                )}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {/* Instructions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Instructions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ol className="list-decimal ml-4 space-y-2 text-sm text-gray-600">
                                    <li>
                                        <strong>Download the CSV template</strong> to see the required format.
                                        <Button asChild variant="link" size="sm" className="ml-2 p-0 h-auto">
                                            <a href="/admin/tc-records/download-template">
                                                <Download className="h-3 w-3 mr-1" />
                                                Download Template
                                            </a>
                                        </Button>
                                    </li>
                                    <li>
                                        <strong>Fill in the CSV file</strong> with student information. Each row should have:
                                        <code className="block mt-1 p-2 bg-gray-100 rounded text-xs">
                                            tc_number, student_name, father_name, admission_number, class, date_of_issue, pdf_filename
                                        </code>
                                    </li>
                                    <li>
                                        <strong>Create a ZIP file</strong> containing all the TC PDF files. The filenames must match exactly with the <code>pdf_filename</code> column in the CSV.
                                    </li>
                                    <li>Upload both files below and click "Upload Transfer Certificates".</li>
                                </ol>

                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <h4 className="font-medium text-blue-800 mb-2">Important Notes</h4>
                                    <ul className="text-sm text-blue-700 space-y-1">
                                        <li>• Date format should be YYYY-MM-DD (e.g., 2025-03-15)</li>
                                        <li>• PDF filenames in CSV should include the .pdf extension</li>
                                        <li>• PDFs can be in subdirectories within the ZIP file</li>
                                        <li>• Duplicate TC numbers will be skipped</li>
                                        <li>• Maximum ZIP file size: 100MB</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        {/* CSV Upload */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Step 1: Upload CSV File</CardTitle>
                                <CardDescription>The CSV file containing student information</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <input
                                        type="file"
                                        id="csv_file"
                                        accept=".csv,.txt"
                                        onChange={handleCsvChange}
                                        className="hidden"
                                    />
                                    <label htmlFor="csv_file" className="cursor-pointer">
                                        <FileCheck className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                        <p className="text-sm text-gray-600">
                                            {csvFileName ? (
                                                <span className="text-green-600 font-medium">{csvFileName}</span>
                                            ) : (
                                                <>
                                                    <span className="text-primary font-medium">Click to upload CSV</span>
                                                </>
                                            )}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">CSV or TXT file (max 2MB)</p>
                                    </label>
                                </div>
                                {errors.csv_file && <p className="text-sm text-red-500 mt-2">{errors.csv_file}</p>}
                            </CardContent>
                        </Card>

                        {/* ZIP Upload */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Step 2: Upload ZIP File</CardTitle>
                                <CardDescription>The ZIP file containing all TC PDF documents</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <input
                                        type="file"
                                        id="zip_file"
                                        accept=".zip"
                                        onChange={handleZipChange}
                                        className="hidden"
                                    />
                                    <label htmlFor="zip_file" className="cursor-pointer">
                                        <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                        <p className="text-sm text-gray-600">
                                            {zipFileName ? (
                                                <span className="text-green-600 font-medium">{zipFileName}</span>
                                            ) : (
                                                <>
                                                    <span className="text-primary font-medium">Click to upload ZIP</span>
                                                </>
                                            )}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">ZIP file containing PDFs (max 100MB)</p>
                                    </label>
                                </div>
                                {errors.zip_file && <p className="text-sm text-red-500 mt-2">{errors.zip_file}</p>}
                            </CardContent>
                        </Card>

                        {/* Progress */}
                        {progress && (
                            <Card>
                                <CardContent className="py-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Uploading...</span>
                                            <span>{progress.percentage}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div 
                                                className="bg-primary h-2.5 rounded-full transition-all" 
                                                style={{ width: `${progress.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Actions */}
                        <div className="flex gap-4 justify-end">
                            <Button type="button" variant="outline" onClick={() => router.get('/admin/tc-records')}>
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={processing || !data.csv_file || !data.zip_file}
                            >
                                {processing ? 'Processing...' : 'Upload Transfer Certificates'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
