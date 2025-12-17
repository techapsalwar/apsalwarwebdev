import PublicLayout from '@/layouts/public-layout';
import { Head, router } from '@inertiajs/react';
import { Search, FileCheck, ArrowLeft, Download, Lock, User, Calendar, GraduationCap, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useState, useEffect, useRef } from 'react';

interface GrecaptchaV2 {
    render: (container: HTMLElement | string, parameters: {
        sitekey: string;
        callback: (token: string) => void;
        'expired-callback'?: () => void;
        'error-callback'?: () => void;
    }) => number;
    reset: (widgetId?: number) => void;
    getResponse: (widgetId?: number) => string;
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
    searchQuery: string;
    recaptchaSiteKey?: string;
}

export default function TcSearchResults({ records, searchQuery, recaptchaSiteKey }: Props) {
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
            (window as unknown as { onRecaptchaVerifyLoad?: () => void }).onRecaptchaVerifyLoad = () => setRecaptchaLoaded(true);
            const script = document.createElement('script');
            script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaVerifyLoad&render=explicit';
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        } else {
            setRecaptchaLoaded(true);
        }

        return () => {
            (window as unknown as { onRecaptchaVerifyLoad?: () => void }).onRecaptchaVerifyLoad = undefined;
        };
    }, [recaptchaSiteKey]);

    // Render reCAPTCHA when dialog opens
    useEffect(() => {
        const grecaptcha = (window as unknown as { grecaptcha?: GrecaptchaV2 }).grecaptcha;
        if (selectedRecord && recaptchaLoaded && recaptchaSiteKey && recaptchaRef.current && grecaptcha) {
            // Small delay to ensure DOM is ready
            const timer = setTimeout(() => {
                if (recaptchaRef.current && widgetIdRef.current === null) {
                    try {
                        widgetIdRef.current = grecaptcha.render(recaptchaRef.current, {
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
                // Reset reCAPTCHA on error
                const grecaptcha = (window as unknown as { grecaptcha?: GrecaptchaV2 }).grecaptcha;
                if (grecaptcha && widgetIdRef.current !== null) {
                    grecaptcha.reset(widgetIdRef.current);
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
        <PublicLayout title="Transfer Certificate Search Results" description="Search results for Transfer Certificates">
            <Head title="TC Search Results" />
            
            {/* Header Section */}
            <section className="bg-gradient-to-b from-primary/10 to-white py-12">
                <div className="container mx-auto px-4">
                    <Button 
                        variant="ghost" 
                        className="mb-4"
                        onClick={() => router.get('/admissions/transfer-certificate')}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Search
                    </Button>
                    
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <Search className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Search Results</h1>
                            <p className="text-gray-600">
                                Showing results for "<span className="font-medium">{searchQuery}</span>"
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Results Section */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        {records.length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <FileCheck className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">No Records Found</h3>
                                    <p className="text-gray-600 mb-6">
                                        We couldn't find any Transfer Certificate matching "{searchQuery}". 
                                        Please check the spelling or try a different name.
                                    </p>
                                    <Button onClick={() => router.get('/admissions/transfer-certificate')}>
                                        <Search className="h-4 w-4 mr-2" />
                                        Try Another Search
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600 mb-4">
                                    Found {records.length} record(s). Click on a name to verify and download.
                                </p>

                                {records.map((record) => (
                                    <Card 
                                        key={record.id}
                                        className="cursor-pointer hover:shadow-md transition-shadow"
                                        onClick={() => setSelectedRecord(record)}
                                    >
                                        <CardContent className="py-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2 bg-primary/10 rounded-full">
                                                        <User className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-lg">{record.student_name}</h3>
                                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mt-1">
                                                            <span className="flex items-center gap-1">
                                                                <span className="text-gray-400">S/o D/o:</span>
                                                                {record.father_name}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <GraduationCap className="h-3 w-3" />
                                                                Class {record.class}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="h-3 w-3" />
                                                                {formatDate(record.date_of_issue)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button variant="outline" size="sm">
                                                    <Lock className="h-4 w-4 mr-2" />
                                                    Verify & Download
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
                            <Alert className="border-green-500 bg-green-50">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-700">
                                    Verification successful! Click below to download your TC.
                                </AlertDescription>
                            </Alert>
                            
                            <div className="text-center">
                                <Button asChild className="w-full">
                                    <a href={downloadUrl} download>
                                        <Download className="h-4 w-4 mr-2" />
                                        Download Transfer Certificate
                                    </a>
                                </Button>
                                <p className="text-xs text-gray-500 mt-2">
                                    Link expires in 5 minutes
                                </p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleVerify}>
                            <div className="space-y-4 py-4">
                                {selectedRecord && (
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="font-medium">{selectedRecord.student_name}</p>
                                        <p className="text-sm text-gray-600">
                                            TC #{selectedRecord.tc_number} • Class {selectedRecord.class}
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="admission_number">Admission Number</Label>
                                    <Input
                                        id="admission_number"
                                        type="text"
                                        value={admissionNumber}
                                        onChange={(e) => setAdmissionNumber(e.target.value)}
                                        placeholder="Enter your admission number"
                                        required
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
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={closeDialog}>
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={verifying || (recaptchaSiteKey ? !recaptchaToken : false) || !admissionNumber}
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
