import PublicLayout from '@/layouts/public-layout';
import { Link, useForm, usePage } from '@inertiajs/react';
import { 
    MapPin,
    Phone,
    Mail,
    Clock,
    Send,
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Building2,
    CheckCircle,
    AlertCircle,
    Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Address {
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
}

interface PhoneContact {
    number: string;
    label: string;
}

interface EmailContact {
    address: string;
    label: string;
}

interface Social {
    platform: string;
    url: string;
    label: string;
}

interface Timing {
    days: string;
    office: string;
    school: string;
}

interface ContactInfo {
    address: Address;
    phone: PhoneContact[];
    email: EmailContact[];
    timing: Timing;
    social: Social[];
}

interface Department {
    name: string;
    description: string;
    email: string;
    phone: string;
}

interface Props {
    contactInfo: ContactInfo;
    departments: Department[];
    mapUrl: string;
}

const socialIcons: Record<string, React.ElementType> = {
    facebook: Facebook,
    twitter: Twitter,
    instagram: Instagram,
    youtube: Youtube,
};

export default function Contact({ contactInfo, departments, mapUrl }: Props) {
    const { flash } = usePage().props as any;
    
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        department: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/contact', {
            onSuccess: () => reset(),
        });
    };

    return (
        <PublicLayout title="Contact Us - APS Alwar">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-gray-950 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="mb-4 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                            Get in Touch
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Contact Us
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            We're here to help. Reach out to us for any queries about admissions, 
                            academics, or general information.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-12 -mt-8">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                        {/* Address */}
                        <Card className="text-center border-t-4 border-t-amber-500">
                            <CardHeader className="pb-2">
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <MapPin className="h-6 w-6 text-amber-600" />
                                </div>
                                <CardTitle className="text-lg">Address</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    {contactInfo.address.line1}<br />
                                    {contactInfo.address.line2}<br />
                                    {contactInfo.address.city}, {contactInfo.address.state}<br />
                                    {contactInfo.address.pincode}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Phone */}
                        <Card className="text-center border-t-4 border-t-blue-500">
                            <CardHeader className="pb-2">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Phone className="h-6 w-6 text-blue-600" />
                                </div>
                                <CardTitle className="text-lg">Phone</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-1">
                                    {contactInfo.phone.map((phone, idx) => (
                                        <p key={idx} className="text-sm">
                                            <a 
                                                href={`tel:${phone.number}`}
                                                className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
                                            >
                                                {phone.number}
                                            </a>
                                            <span className="text-gray-400 text-xs block">{phone.label}</span>
                                        </p>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Email */}
                        <Card className="text-center border-t-4 border-t-green-500">
                            <CardHeader className="pb-2">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Mail className="h-6 w-6 text-green-600" />
                                </div>
                                <CardTitle className="text-lg">Email</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-1">
                                    {contactInfo.email.slice(0, 2).map((email, idx) => (
                                        <p key={idx} className="text-sm">
                                            <a 
                                                href={`mailto:${email.address}`}
                                                className="text-gray-600 dark:text-gray-400 hover:text-green-600 break-all"
                                            >
                                                {email.address}
                                            </a>
                                        </p>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Timing */}
                        <Card className="text-center border-t-4 border-t-purple-500">
                            <CardHeader className="pb-2">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Clock className="h-6 w-6 text-purple-600" />
                                </div>
                                <CardTitle className="text-lg">Office Hours</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    {contactInfo.timing.days}<br />
                                    {contactInfo.timing.office}<br />
                                    <span className="text-xs text-gray-400">(School: {contactInfo.timing.school})</span>
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Contact Form & Map */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* Contact Form */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Send className="h-5 w-5 text-amber-600" />
                                        Send us a Message
                                    </CardTitle>
                                    <CardDescription>
                                        Fill out the form below and we'll get back to you as soon as possible.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {/* Flash Messages */}
                                    {flash?.success && (
                                        <Alert className="mb-6 border-green-200 bg-green-50">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            <AlertDescription className="text-green-700">
                                                {flash.success}
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                    {flash?.error && (
                                        <Alert className="mb-6 border-red-200 bg-red-50">
                                            <AlertCircle className="h-4 w-4 text-red-600" />
                                            <AlertDescription className="text-red-700">
                                                {flash.error}
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Full Name *</Label>
                                                <Input
                                                    id="name"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    placeholder="Your name"
                                                    className={errors.name ? 'border-red-500' : ''}
                                                />
                                                {errors.name && (
                                                    <p className="text-red-500 text-xs">{errors.name}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email Address *</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    placeholder="your.email@example.com"
                                                    className={errors.email ? 'border-red-500' : ''}
                                                />
                                                {errors.email && (
                                                    <p className="text-red-500 text-xs">{errors.email}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Phone Number</Label>
                                                <Input
                                                    id="phone"
                                                    value={data.phone}
                                                    onChange={(e) => setData('phone', e.target.value)}
                                                    placeholder="+91 9876543210"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="department">Department</Label>
                                                <Select
                                                    value={data.department}
                                                    onValueChange={(value) => setData('department', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select department" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="general">General Enquiry</SelectItem>
                                                        <SelectItem value="admissions">Admissions</SelectItem>
                                                        <SelectItem value="accounts">Accounts/Fee</SelectItem>
                                                        <SelectItem value="examination">Examination</SelectItem>
                                                        <SelectItem value="principal">Principal Office</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="subject">Subject *</Label>
                                            <Input
                                                id="subject"
                                                value={data.subject}
                                                onChange={(e) => setData('subject', e.target.value)}
                                                placeholder="What is your query about?"
                                                className={errors.subject ? 'border-red-500' : ''}
                                            />
                                            {errors.subject && (
                                                <p className="text-red-500 text-xs">{errors.subject}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message">Message *</Label>
                                            <Textarea
                                                id="message"
                                                value={data.message}
                                                onChange={(e) => setData('message', e.target.value)}
                                                placeholder="Please provide details about your query..."
                                                rows={5}
                                                className={errors.message ? 'border-red-500' : ''}
                                            />
                                            {errors.message && (
                                                <p className="text-red-500 text-xs">{errors.message}</p>
                                            )}
                                        </div>

                                        <Button 
                                            type="submit" 
                                            className="w-full bg-amber-600 hover:bg-amber-700"
                                            disabled={processing}
                                        >
                                            {processing ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="mr-2 h-4 w-4" />
                                                    Send Message
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>

                            {/* Map */}
                            <div className="space-y-6">
                                <Card className="overflow-hidden">
                                    <CardHeader className="pb-0">
                                        <CardTitle className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5 text-amber-600" />
                                            Find Us
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0 pt-4">
                                        <div className="aspect-video bg-gray-200">
                                            <iframe
                                                src={mapUrl}
                                                width="100%"
                                                height="100%"
                                                style={{ border: 0 }}
                                                allowFullScreen
                                                loading="lazy"
                                                referrerPolicy="no-referrer-when-downgrade"
                                                title="School Location"
                                                className="aspect-video"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Social Links */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Connect With Us</CardTitle>
                                        <CardDescription>Follow us on social media for updates</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex gap-4">
                                            {contactInfo.social.map((social, idx) => {
                                                const Icon = socialIcons[social.platform] || Mail;
                                                return (
                                                    <a
                                                        key={idx}
                                                        href={social.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-100 dark:hover:bg-amber-900 transition-colors group"
                                                        title={social.label}
                                                    >
                                                        <Icon className="h-5 w-5 text-gray-600 group-hover:text-amber-600" />
                                                    </a>
                                                );
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Department Contacts */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-blue-100 text-blue-800">Direct Contacts</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Department-wise Contacts
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {departments.map((dept, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-2">
                                        <Building2 className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <CardTitle className="text-lg">{dept.name}</CardTitle>
                                    <CardDescription className="text-sm">{dept.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <a
                                            href={`mailto:${dept.email}`}
                                            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
                                        >
                                            <Mail className="h-4 w-4" />
                                            {dept.email}
                                        </a>
                                        <a
                                            href={`tel:${dept.phone}`}
                                            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
                                        >
                                            <Phone className="h-4 w-4" />
                                            {dept.phone}
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-amber-600 to-amber-700">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Visit Our Campus
                    </h2>
                    <p className="text-amber-100 mb-8 max-w-2xl mx-auto">
                        Schedule a visit to experience our facilities and meet our team in person.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button size="lg" variant="secondary" asChild>
                            <Link href="/admissions">
                                Admissions Info
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                            <Link href="/facilities">
                                Campus Tour
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
