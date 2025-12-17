import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import { Search, FileCheck, Shield, AlertCircle, User, Calendar, GraduationCap, Lock, Download, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useEffect, useRef, useState } from 'react';

declare global {
    interface Window {
        grecaptcha: {
            render: (container: HTMLElement | string, parameters: {
                sitekey: string;
                callback: (token: string) => void;
                'expired-callback'?: () => void;
                'error-callback'?: () => void;
            }) => number;
            reset: (widgetId?: number) => void;
            getResponse: (widgetId?: number) => string;
        };
        onRecaptchaLoad?: () => void;
    }
}

interface TcRecord {
    id: number;
    tc_number: string;
    student_name: string;
    father_name: string;
    class: string;
    date_of_issue: string;
}

interface Props {
    records: TcRecord[];
    recaptchaSiteKey?: string;
}

export default function TcVerificationIndex({ records, recaptchaSiteKey }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRecords, setFilteredRecords] = useState<TcRecord[]>(records);
    const [selectedRecord, setSelectedRecord] = useState<TcRecord | null>(null);
    const [admissionNumber, setAdmissionNumber] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [error, setError] = useState('');
    const [downloadUrl, setDownloadUrl] = useState('');
    const [success, setSuccess] = useState(false);
    const [recaptchaToken, setRecaptchaToken] = useState('');
    const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
    const recaptchaRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<number | null>(null);

    useEffect(() => {
        if (!recaptchaSiteKey) {
            setRecaptchaLoaded(true);
            setRecaptchaToken('development-token');
            return;
        }

        // Load reCAPTCHA script if not already loaded
        if (!document.querySelector('script[src*="recaptcha/api.js"]')) {
            window.onRecaptchaLoad = () => setRecaptchaLoaded(true);
            const script = document.createElement('script');
            script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit';
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        } else if (window.grecaptcha) {
            setRecaptchaLoaded(true);
        } else {
            window.onRecaptchaLoad = () => setRecaptchaLoaded(true);
        }

        return () => {
            window.onRecaptchaLoad = undefined;
        };
    }, [recaptchaSiteKey]);

    // Render reCAPTCHA when dialog opens
    useEffect(() => {
        if (selectedRecord && recaptchaLoaded && recaptchaSiteKey && recaptchaRef.current && window.grecaptcha) {
            const timer = setTimeout(() => {
                if (recaptchaRef.current && widgetIdRef.current === null) {
                    try {
                        widgetIdRef.current = window.grecaptcha.render(recaptchaRef.current, {
                            sitekey: recaptchaSiteKey,
                            callback: (token: string) => {
                                setRecaptchaToken(token);
                                setError('');
                            },
                            'expired-callback': () => {
                                setRecaptchaToken('');
                                setError('reCAPTCHA expired. Please verify again.');
                            },
                        });
                    } catch (e) {
                        console.error('reCAPTCHA render error:', e);
                    }
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [selectedRecord, recaptchaLoaded, recaptchaSiteKey]);

    // Filter records based on search query
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredRecords(records);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = records.filter(record =>
            record.student_name.toLowerCase().includes(query) ||
            record.father_name.toLowerCase().includes(query) ||
            record.class.toLowerCase().includes(query) ||
            record.tc_number.toLowerCase().includes(query)
        );
        setFilteredRecords(filtered);
    }, [searchQuery, records]);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRecord) return;

        if (recaptchaSiteKey && !recaptchaToken) {
            setError('Please complete the reCAPTCHA verification.');
            return;
        }

        setVerifying(true);
        setError('');

        try {
            const response = await fetch(`/admissions/transfer-certificate/${selectedRecord.id}/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    admission_number: admissionNumber,
                    recaptcha_token: recaptchaToken || 'development-token',
                }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(true);
                setDownloadUrl(data.download_url);
            } else {
                setError(data.message || 'Verification failed. Please try again.');
                if (window.grecaptcha && widgetIdRef.current !== null) {
                    window.grecaptcha.reset(widgetIdRef.current);
                    setRecaptchaToken('');
                }
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setVerifying(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    const closeDialog = () => {
        setSelectedRecord(null);
        setAdmissionNumber('');
        setError('');
        setSuccess(false);
        setDownloadUrl('');
        setRecaptchaToken('');
        widgetIdRef.current = null;
    };

    return (
        <PublicLayout title="Transfer Certificate Verification" description="Verify and download your Transfer Certificate from Army Public School Alwar">
            <Head title="Transfer Certificate Verification" />
            
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-primary/10 to-white py-12">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                            <FileCheck className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">
                            Transfer Certificate Verification
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Search for your Transfer Certificate and download it securely
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search by student name, father's name, class, or TC number..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 pr-4 py-6 text-lg"
                            />
                        </div>
                        <p className="text-sm text-gray-500 mt-2 text-center">
                            {filteredRecords.length} record(s) found
                        </p>
                    </div>
                </div>
            </section>

            {/* Results Section */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {filteredRecords.length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <FileCheck className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">No Records Found</h3>
                                    <p className="text-gray-600 mb-6">
                                        {searchQuery 
                                            ? `We couldn't find any Transfer Certificate matching "${searchQuery}". Please check the spelling or try a different search.`
                                            : 'No Transfer Certificates are currently available.'
                                        }
                                    </p>
                                    {searchQuery && (
                                        <Button onClick={() => setSearchQuery('')} variant="outline">
                                            <X className="h-4 w-4 mr-2" />
                                            Clear Search
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-3">
                                {filteredRecords.map((record) => (
                                    <Card 
                                        key={record.id}
                                        className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-200"
                                        onClick={() => setSelectedRecord(record)}
                                    >
                                        <CardContent className="py-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className="p-2 bg-primary/10 rounded-full shrink-0">
                                                        <User className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-lg truncate">{record.student_name}</h3>
                                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mt-1">
                                                            <span className="flex items-center gap-1">
                                                                <span className="text-gray-400">S/o D/o:</span>
                                                                <span className="truncate">{record.father_name}</span>
                                                            </span>
                                                            <span className="flex items-center gap-1 shrink-0">
                                                                <GraduationCap className="h-3 w-3" />
                                                                Class {record.class}
                                                            </span>
                                                            <span className="flex items-center gap-1 shrink-0">
                                                                <Calendar className="h-3 w-3" />
                                                                {formatDate(record.date_of_issue)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button variant="outline" size="sm" className="shrink-0 ml-4">
                                                    <Lock className="h-4 w-4 mr-2" />
                                                    Verify
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Security Notice */}
            <section className="py-8 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-start gap-4">
                            <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-medium mb-1">Secure Verification Process</h3>
                                <p className="text-sm text-gray-600">
                                    To download your Transfer Certificate, you'll need to verify your identity by providing 
                                    your admission number. This ensures that only authorized individuals can access the document.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Verification Dialog */}
            <Dialog open={!!selectedRecord} onOpenChange={(open) => !open && closeDialog()}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5" />
                            Verify Your Identity
                        </DialogTitle>
                        <DialogDescription>
                            Enter your admission number to verify and download the Transfer Certificate.
                        </DialogDescription>
                    </DialogHeader>

                    {success ? (
                        <div className="space-y-4 py-4">
                            <div className="text-center py-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                    <CheckCircle className="h-10 w-10 text-green-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-green-900 mb-2">Verification Successful!</h3>
                                <p className="text-sm text-green-700 mb-6">
                                    Your identity has been verified. You can now download your Transfer Certificate.
                                </p>
                            </div>
                            
                            <Button asChild className="w-full" size="lg">
                                <a href={downloadUrl} download>
                                    <Download className="h-5 w-5 mr-2" />
                                    Download Transfer Certificate
                                </a>
                            </Button>
                            <p className="text-xs text-gray-500 text-center">
                                Download link expires in 5 minutes
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleVerify}>
                            <div className="space-y-4 py-4">
                                {selectedRecord && (
                                    <div className="p-3 bg-gray-50 rounded-lg border">
                                        <p className="font-medium">{selectedRecord.student_name}</p>
                                        <p className="text-sm text-gray-600">
                                            TC #{selectedRecord.tc_number} • Class {selectedRecord.class}
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="admission_number">Admission Number *</Label>
                                    <Input
                                        id="admission_number"
                                        type="text"
                                        value={admissionNumber}
                                        onChange={(e) => setAdmissionNumber(e.target.value)}
                                        placeholder="Enter your admission number"
                                        required
                                        autoFocus
                                    />
                                    <p className="text-xs text-gray-500">
                                        This is the unique number assigned at the time of admission.
                                    </p>
                                </div>

                                {/* reCAPTCHA v2 checkbox */}
                                {recaptchaSiteKey && (
                                    <div className="space-y-2">
                                        <div ref={recaptchaRef} className="flex justify-center"></div>
                                    </div>
                                )}

                                {error && (
                                    <Alert variant="destructive" className="border-red-500 bg-red-50">
                                        <div className="flex items-start gap-3">
                                            <X className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-red-900 mb-1">Verification Failed</h4>
                                                <AlertDescription className="text-red-700">{error}</AlertDescription>
                                            </div>
                                        </div>
                                    </Alert>
                                )}
                            </div>

                            <DialogFooter className="gap-2">
                                <Button type="button" variant="outline" onClick={closeDialog}>
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={verifying || (recaptchaSiteKey ? !recaptchaToken : false) || !admissionNumber.trim()}
                                >
                                    {verifying ? 'Verifying...' : 'Verify & Download'}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </PublicLayout>
    );
}
