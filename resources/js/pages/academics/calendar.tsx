import PublicLayout from '@/layouts/public-layout';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, ExternalLink, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const GOOGLE_CALENDAR_EMBED_URL = 'https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Asia%2FKolkata&title=webcalendar&src=c29jaWFsQGFwc2Fsd2FyLmVkdS5pbg&src=ZW4uaW5kaWFuI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%23039be5&color=%230b8043';

export default function AcademicCalendar() {
    // Get the public calendar URL for subscription
    const getPublicCalendarUrl = () => {
        return 'https://calendar.google.com/calendar/u/0/r?cid=social@apsalwar.edu.in';
    };

    return (
        <PublicLayout title="Academic Calendar - APS Alwar">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 py-16">
                <div className="container mx-auto px-4">
                    <Button variant="ghost" size="sm" className="mb-6" asChild>
                        <Link href="/academics">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Academics
                        </Link>
                    </Button>
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="mb-4 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                            <Calendar className="h-3 w-3 mr-1" />
                            Academic Year 2024-25
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Academic Calendar
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                            Stay updated with important dates, examinations, holidays, and school events
                        </p>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button asChild variant="default">
                                <a 
                                    href={getPublicCalendarUrl()} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    <Bell className="mr-2 h-4 w-4" />
                                    Subscribe to Calendar
                                </a>
                            </Button>
                            <Button asChild variant="outline">
                                <a 
                                    href={getPublicCalendarUrl()} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Open in Google Calendar
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Calendar Legend */}
            <section className="py-6 bg-gray-50 dark:bg-gray-900 border-y">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-red-500"></span>
                            <span className="text-gray-600 dark:text-gray-400">Examinations</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-green-500"></span>
                            <span className="text-gray-600 dark:text-gray-400">Holidays</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                            <span className="text-gray-600 dark:text-gray-400">PTM</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                            <span className="text-gray-600 dark:text-gray-400">Events</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                            <span className="text-gray-600 dark:text-gray-400">Cultural Programs</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Google Calendar Embed */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <Card className="overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-primary" />
                                School Calendar
                            </CardTitle>
                            <CardDescription>
                                View all upcoming events, examinations, and important dates
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="relative w-full" style={{ paddingTop: '75%' }}>
                                <iframe
                                    src={GOOGLE_CALENDAR_EMBED_URL}
                                    className="absolute inset-0 w-full h-full border-0"
                                    style={{ border: 'solid 1px #777' }}
                                    title="APS Alwar Academic Calendar"
                                    loading="lazy"
                                    sandbox="allow-scripts allow-same-origin allow-popups"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Quick Info Cards */}
            <section className="py-12 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                    School Timings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <p><strong>Summer:</strong> 7:30 AM - 1:30 PM</p>
                                <p><strong>Winter:</strong> 8:30 AM - 2:30 PM</p>
                                <p><strong>Office:</strong> 8:00 AM - 4:00 PM</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                    Academic Session
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <p><strong>Session:</strong> April 2024 - March 2025</p>
                                <p><strong>Term 1:</strong> April - September</p>
                                <p><strong>Term 2:</strong> October - March</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                                    Important Note
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-gray-600 dark:text-gray-400">
                                <p>
                                    Dates are subject to change. Please check regularly for updates 
                                    or subscribe to receive notifications for any changes.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold mb-4">Need More Information?</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                        For detailed information about examination schedules, holiday lists, 
                        or any other queries, please contact the school office.
                    </p>
                    <Button asChild>
                        <Link href="/contact">Contact Us</Link>
                    </Button>
                </div>
            </section>
        </PublicLayout>
    );
}
