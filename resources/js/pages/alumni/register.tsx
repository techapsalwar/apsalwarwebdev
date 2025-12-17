import PublicLayout from '@/layouts/public-layout';
import { Link, useForm } from '@inertiajs/react';
import { 
    GraduationCap,
    Users,
    Calendar,
    Star,
    Briefcase,
    Heart,
    Trophy,
    Upload,
    CheckCircle,
    ArrowRight,
    Sparkles,
    Quote,
    Shield,
    Building2,
    UserPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useRef } from 'react';

interface Benefit {
    icon: string;
    title: string;
    description: string;
}

interface Testimonial {
    name: string;
    batch: string;
    designation: string;
    organization: string;
    quote: string;
    photo: string | null;
}

interface Props {
    categories: Record<string, string>;
    houses: Record<string, string>;
    benefits: Benefit[];
    testimonials: Testimonial[];
}

const iconMap: Record<string, React.ElementType> = {
    users: Users,
    calendar: Calendar,
    star: Star,
    briefcase: Briefcase,
    heart: Heart,
    trophy: Trophy,
};

export default function AlumniRegister({ categories, houses, benefits, testimonials }: Props) {
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        batch_year: '',
        class_section: '',
        house: '',
        category: '',
        current_designation: '',
        organization: '',
        location: '',
        achievement: '',
        story: '',
        school_memories: '',
        message_to_juniors: '',
        linkedin_url: '',
        photo: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/alumni/register', {
            forceFormData: true,
        });
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('photo', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Generate batch year options (last 50 years)
    const currentYear = new Date().getFullYear();
    const batchYears = Array.from({ length: 50 }, (_, i) => currentYear - i);

    return (
        <PublicLayout title="Join Alumni Network - APS Alwar">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-950 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="mb-4 bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
                            <UserPlus className="h-3 w-3 mr-1" />
                            Alumni Registration
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Welcome Back to Your <span className="text-emerald-600">Alma Mater</span>
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Once an APSian, always an APSian! Register to reconnect with your school family, 
                            share your journey, and inspire future generations.
                        </p>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-12 bg-white dark:bg-gray-950 border-b">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Why Join Our Alumni Network?
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {benefits.map((benefit, index) => {
                            const Icon = iconMap[benefit.icon] || Star;
                            return (
                                <div key={index} className="flex items-start gap-4 p-4">
                                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                                        <Icon className="h-6 w-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {benefit.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {benefit.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Registration Form */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <Card>
                            <CardHeader className="text-center border-b bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10">
                                <CardTitle className="text-2xl flex items-center justify-center gap-2">
                                    <GraduationCap className="h-6 w-6 text-emerald-600" />
                                    Alumni Registration Form
                                </CardTitle>
                                <CardDescription>
                                    Fill in your details to join our alumni network. Fields marked with * are required.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 md:p-8">
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Personal Information */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            <Users className="h-5 w-5 text-emerald-600" />
                                            Personal Information
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Full Name *</Label>
                                                <Input
                                                    id="name"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    placeholder="Enter your full name"
                                                    required
                                                />
                                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email Address *</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    placeholder="your.email@example.com"
                                                    required
                                                />
                                                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                                <p className="text-xs text-gray-500">We'll send a verification link to this email</p>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Phone Number</Label>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    value={data.phone}
                                                    onChange={(e) => setData('phone', e.target.value)}
                                                    placeholder="+91 98765 43210"
                                                />
                                                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="location">Current Location</Label>
                                                <Input
                                                    id="location"
                                                    value={data.location}
                                                    onChange={(e) => setData('location', e.target.value)}
                                                    placeholder="City, Country"
                                                />
                                                {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* School Information */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            <GraduationCap className="h-5 w-5 text-emerald-600" />
                                            School Information
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="batch_year">Batch Year (Passing Year) *</Label>
                                                <Select 
                                                    value={data.batch_year} 
                                                    onValueChange={(value) => setData('batch_year', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select your batch year" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {batchYears.map((year) => (
                                                            <SelectItem key={year} value={year.toString()}>
                                                                {year}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.batch_year && <p className="text-sm text-red-500">{errors.batch_year}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="class_section">Class & Section (When Passed)</Label>
                                                <Input
                                                    id="class_section"
                                                    value={data.class_section}
                                                    onChange={(e) => setData('class_section', e.target.value)}
                                                    placeholder="e.g., XII-A Science"
                                                />
                                                {errors.class_section && <p className="text-sm text-red-500">{errors.class_section}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="house">House</Label>
                                                <Select 
                                                    value={data.house} 
                                                    onValueChange={(value) => setData('house', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select your house" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.entries(houses).map(([key, label]) => (
                                                            <SelectItem key={key} value={key}>
                                                                {label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.house && <p className="text-sm text-red-500">{errors.house}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Professional Information */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            <Briefcase className="h-5 w-5 text-emerald-600" />
                                            Professional Information
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="category">Professional Category *</Label>
                                                <Select 
                                                    value={data.category} 
                                                    onValueChange={(value) => setData('category', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select your field" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.entries(categories).map(([key, label]) => (
                                                            <SelectItem key={key} value={key}>
                                                                {label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="current_designation">Current Designation</Label>
                                                <Input
                                                    id="current_designation"
                                                    value={data.current_designation}
                                                    onChange={(e) => setData('current_designation', e.target.value)}
                                                    placeholder="e.g., Software Engineer, Captain, Doctor"
                                                />
                                                {errors.current_designation && <p className="text-sm text-red-500">{errors.current_designation}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="organization">Organization</Label>
                                                <Input
                                                    id="organization"
                                                    value={data.organization}
                                                    onChange={(e) => setData('organization', e.target.value)}
                                                    placeholder="e.g., Indian Army, Google, AIIMS"
                                                />
                                                {errors.organization && <p className="text-sm text-red-500">{errors.organization}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="linkedin_url">LinkedIn Profile</Label>
                                                <Input
                                                    id="linkedin_url"
                                                    type="url"
                                                    value={data.linkedin_url}
                                                    onChange={(e) => setData('linkedin_url', e.target.value)}
                                                    placeholder="https://linkedin.com/in/yourprofile"
                                                />
                                                {errors.linkedin_url && <p className="text-sm text-red-500">{errors.linkedin_url}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Photo Upload */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            <Upload className="h-5 w-5 text-emerald-600" />
                                            Profile Photo
                                        </h3>
                                        <div className="flex items-center gap-6">
                                            <div 
                                                className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden cursor-pointer border-2 border-dashed border-gray-300 hover:border-emerald-500 transition-colors"
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                {photoPreview ? (
                                                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Upload className="h-8 w-8 text-gray-400" />
                                                )}
                                            </div>
                                            <div>
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handlePhotoChange}
                                                />
                                                <Button 
                                                    type="button" 
                                                    variant="outline"
                                                    onClick={() => fileInputRef.current?.click()}
                                                >
                                                    Choose Photo
                                                </Button>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    JPG, PNG up to 2MB. A professional photo is recommended.
                                                </p>
                                                {errors.photo && <p className="text-sm text-red-500">{errors.photo}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Your Story */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            <Sparkles className="h-5 w-5 text-emerald-600" />
                                            Your Story
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="achievement">Key Achievements</Label>
                                                <Textarea
                                                    id="achievement"
                                                    value={data.achievement}
                                                    onChange={(e) => setData('achievement', e.target.value)}
                                                    placeholder="Share your notable achievements..."
                                                    rows={3}
                                                />
                                                {errors.achievement && <p className="text-sm text-red-500">{errors.achievement}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="story">Your Journey After APS Alwar</Label>
                                                <Textarea
                                                    id="story"
                                                    value={data.story}
                                                    onChange={(e) => setData('story', e.target.value)}
                                                    placeholder="Tell us about your journey after leaving school..."
                                                    rows={4}
                                                />
                                                {errors.story && <p className="text-sm text-red-500">{errors.story}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="school_memories">Favorite School Memories</Label>
                                                <Textarea
                                                    id="school_memories"
                                                    value={data.school_memories}
                                                    onChange={(e) => setData('school_memories', e.target.value)}
                                                    placeholder="Share your favorite memories from APS Alwar..."
                                                    rows={3}
                                                />
                                                {errors.school_memories && <p className="text-sm text-red-500">{errors.school_memories}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="message_to_juniors">Message to Current Students</Label>
                                                <Textarea
                                                    id="message_to_juniors"
                                                    value={data.message_to_juniors}
                                                    onChange={(e) => setData('message_to_juniors', e.target.value)}
                                                    placeholder="What advice would you give to current students?"
                                                    rows={3}
                                                />
                                                {errors.message_to_juniors && <p className="text-sm text-red-500">{errors.message_to_juniors}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Verification Notice */}
                                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200">
                                        <div className="flex gap-3">
                                            <CheckCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="font-semibold text-amber-800 dark:text-amber-200">
                                                    Email Verification Required
                                                </h4>
                                                <p className="text-sm text-amber-700 dark:text-amber-300">
                                                    After registration, you'll receive a verification email. Your profile will be reviewed 
                                                    by our admin team and published once approved. This ensures the authenticity of our 
                                                    alumni network.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex justify-center">
                                        <Button 
                                            type="submit" 
                                            size="lg" 
                                            className="bg-emerald-600 hover:bg-emerald-700 px-12"
                                            disabled={processing}
                                        >
                                            {processing ? (
                                                'Registering...'
                                            ) : (
                                                <>
                                                    Register Now
                                                    <ArrowRight className="ml-2 h-5 w-5" />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            {testimonials.length > 0 && testimonials[0].batch && (
                <section className="py-16 bg-gray-50 dark:bg-gray-900">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <Badge className="mb-4 bg-purple-100 text-purple-800">
                                <Quote className="h-3 w-3 mr-1" />
                                Alumni Stories
                            </Badge>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                What Our Alumni Say
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {testimonials.map((testimonial, index) => (
                                <Card key={index} className="bg-white dark:bg-gray-800">
                                    <CardContent className="p-6">
                                        <Quote className="h-8 w-8 text-emerald-200 mb-4" />
                                        <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
                                            "{testimonial.quote}"
                                        </p>
                                        <div className="flex items-center gap-3">
                                            {testimonial.photo ? (
                                                <img 
                                                    src={testimonial.photo} 
                                                    alt={testimonial.name}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                                    <span className="text-sm font-bold text-emerald-600">
                                                        {testimonial.name.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                                    {testimonial.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Batch {testimonial.batch}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
