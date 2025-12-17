import PublicLayout from '@/layouts/public-layout';
import { Link, useForm } from '@inertiajs/react';
import { 
    CheckCircle,
    Mail,
    Clock,
    ArrowRight,
    RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface Props {
    email: string;
}

export default function RegistrationSuccess({ email }: Props) {
    const [showResend, setShowResend] = useState(false);
    const { data, setData, post, processing } = useForm({
        email: email,
    });

    const handleResend = (e: React.FormEvent) => {
        e.preventDefault();
        post('/alumni/resend-verification');
    };

    return (
        <PublicLayout title="Registration Successful - Alumni - APS Alwar">
            <section className="py-20 min-h-[80vh] flex items-center">
                <div className="container mx-auto px-4">
                    <div className="max-w-xl mx-auto text-center">
                        <Card className="shadow-lg">
                            <CardHeader className="pb-4">
                                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="h-10 w-10 text-emerald-600" />
                                </div>
                                <CardTitle className="text-2xl text-emerald-700">
                                    Registration Successful! 🎉
                                </CardTitle>
                                <CardDescription>
                                    Thank you for registering with the APS Alwar Alumni Network
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-left">
                                    <div className="flex gap-3">
                                        <Mail className="h-6 w-6 text-blue-600 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                                                Check Your Email
                                            </h3>
                                            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                                We've sent a verification link to:
                                            </p>
                                            <p className="font-medium text-blue-900 dark:text-blue-100 mt-1">
                                                {email}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 text-left">
                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                        What happens next?
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-emerald-600">
                                                1
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Click the verification link in your email to verify your email address
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-emerald-600">
                                                2
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Our admin team will review your profile for authenticity
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-emerald-600">
                                                3
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Once approved, your profile will be live on our alumni directory
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 text-left">
                                    <div className="flex gap-3">
                                        <Clock className="h-5 w-5 text-amber-600 flex-shrink-0" />
                                        <p className="text-sm text-amber-700 dark:text-amber-300">
                                            The verification link will expire in 48 hours. If you don't see the email, 
                                            please check your spam folder.
                                        </p>
                                    </div>
                                </div>

                                {/* Resend Section */}
                                <div className="pt-4 border-t">
                                    {!showResend ? (
                                        <button 
                                            onClick={() => setShowResend(true)}
                                            className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
                                        >
                                            Didn't receive the email? Click here to resend
                                        </button>
                                    ) : (
                                        <form onSubmit={handleResend} className="space-y-3">
                                            <div className="flex gap-2">
                                                <Input
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    placeholder="Enter your email"
                                                    required
                                                />
                                                <Button type="submit" disabled={processing}>
                                                    <RefreshCw className={`h-4 w-4 mr-2 ${processing ? 'animate-spin' : ''}`} />
                                                    Resend
                                                </Button>
                                            </div>
                                        </form>
                                    )}
                                </div>

                                <div className="pt-4">
                                    <Button asChild className="w-full">
                                        <Link href="/alumni">
                                            Browse Alumni Directory
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
