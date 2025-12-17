import PublicLayout from '@/layouts/public-layout';
import { Link } from '@inertiajs/react';
import { 
    CheckCircle,
    XCircle,
    Clock,
    ArrowRight,
    Mail,
    GraduationCap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
    success: boolean;
    message: string;
    type: 'verified' | 'already_verified' | 'invalid';
    alumniName?: string;
}

export default function VerifyResult({ success, message, type, alumniName }: Props) {
    return (
        <PublicLayout title="Email Verification - Alumni - APS Alwar">
            <section className="py-20 min-h-[80vh] flex items-center">
                <div className="container mx-auto px-4">
                    <div className="max-w-xl mx-auto text-center">
                        <Card className="shadow-lg">
                            <CardHeader className="pb-4">
                                {success ? (
                                    <>
                                        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle className="h-10 w-10 text-emerald-600" />
                                        </div>
                                        <CardTitle className="text-2xl text-emerald-700">
                                            {type === 'already_verified' ? 'Already Verified' : 'Email Verified!'} 🎉
                                        </CardTitle>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                                            <XCircle className="h-10 w-10 text-red-600" />
                                        </div>
                                        <CardTitle className="text-2xl text-red-700">
                                            Verification Failed
                                        </CardTitle>
                                    </>
                                )}
                                <CardDescription className="text-base">
                                    {message}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {success && type === 'verified' && (
                                    <>
                                        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4">
                                            <div className="flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-300">
                                                <GraduationCap className="h-5 w-5" />
                                                <span className="font-medium">
                                                    Welcome, {alumniName}!
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-4 text-left">
                                            <h4 className="font-semibold text-gray-900 dark:text-white text-center">
                                                What happens now?
                                            </h4>
                                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                                                <div className="flex gap-3">
                                                    <Clock className="h-6 w-6 text-blue-600 flex-shrink-0" />
                                                    <div>
                                                        <h5 className="font-semibold text-blue-800 dark:text-blue-200">
                                                            Under Review
                                                        </h5>
                                                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                                            Your profile is now being reviewed by our admin team. 
                                                            You'll receive an email notification once your profile is approved.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                This usually takes 1-2 business days. We verify all alumni registrations 
                                                to maintain the authenticity of our alumni network.
                                            </p>
                                        </div>
                                    </>
                                )}

                                {success && type === 'already_verified' && (
                                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                                        <div className="flex gap-3">
                                            <Mail className="h-6 w-6 text-blue-600 flex-shrink-0" />
                                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                                Your email was already verified. If your profile has been approved, 
                                                you can find it in our alumni directory.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {!success && (
                                    <div className="space-y-4">
                                        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 text-left">
                                            <p className="text-sm text-amber-700 dark:text-amber-300">
                                                The verification link may have expired or is invalid. 
                                                Please try registering again or contact us for assistance.
                                            </p>
                                        </div>
                                        <Button asChild variant="outline" className="w-full">
                                            <Link href="/alumni/register">
                                                Register Again
                                            </Link>
                                        </Button>
                                    </div>
                                )}

                                <div className="pt-4">
                                    <Button asChild className="w-full">
                                        <Link href="/alumni">
                                            Go to Alumni Directory
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>

                                <p className="text-sm text-gray-500">
                                    Need help? Contact us at{' '}
                                    <a href="mailto:alumni@apsalwar.edu.in" className="text-emerald-600 hover:underline">
                                        alumni@apsalwar.edu.in
                                    </a>
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
