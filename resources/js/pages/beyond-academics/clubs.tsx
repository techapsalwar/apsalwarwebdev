import PublicLayout from '@/layouts/public-layout';
import { Link, useForm, usePage } from '@inertiajs/react';
import { 
    Users,
    BookOpen,
    ChevronRight,
    Star,
    MessageSquare,
    Sparkles,
    TreePine,
    Telescope,
    Bot,
    Mic2,
    Brush,
    Flower2,
    Swords,
    UserPlus,
    CheckCircle2,
    AlertCircle,
    Camera,
    Loader2,
    TrendingUp,
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState, FormEventHandler } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Club {
    id: number;
    name: string;
    slug: string;
    category: string;
    description: string;
    image: string | null;
    icon: string | null;
    members_count: number;
    male_count: number;
    female_count: number;
    in_charge: string;
    meeting_schedule: string | null;
    accepts_enrollment: boolean;
}

interface Props {
    clubs: {
        academic_interest: Club[];
        creative_physical: Club[];
    };
    allClubs: Club[];
    categories: Record<string, string>;
    statistics: {
        total_clubs: number;
        total_enrollments: number;
        academic_count: number;
        creative_count: number;
    };
}

// Icon mapping for clubs
const clubIcons: Record<string, React.ElementType> = {
    'Environmental Club': TreePine,
    'Debate Club': MessageSquare,
    'Book Club': BookOpen,
    'Photography & Writing Club': Camera,
    'Astronomy Club': Telescope,
    'Robotics Club': Bot,
    'Dance Club': Sparkles,
    'Music Club': Mic2,
    'Art Club': Brush,
    'Gardening Club': Flower2,
    'Martial-Art Club': Swords,
};

const categoryColors: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
    academic_interest: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-200 dark:border-blue-800',
        gradient: 'from-blue-500 to-indigo-600',
    },
    creative_physical: {
        bg: 'bg-pink-50 dark:bg-pink-900/20',
        text: 'text-pink-700 dark:text-pink-300',
        border: 'border-pink-200 dark:border-pink-800',
        gradient: 'from-pink-500 to-rose-600',
    },
};

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
                <p className="font-semibold text-gray-900 dark:text-white mb-2">{data.name}</p>
                <div className="space-y-1 text-sm">
                    <p className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                        <span className="text-gray-600 dark:text-gray-400">Boys:</span>
                        <span className="font-bold text-blue-600">{data.boys}</span>
                    </p>
                    <p className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-pink-500"></span>
                        <span className="text-gray-600 dark:text-gray-400">Girls:</span>
                        <span className="font-bold text-pink-600">{data.girls}</span>
                    </p>
                    <p className="border-t pt-1 mt-1 text-gray-700 dark:text-gray-300">
                        Total: <span className="font-bold">{data.boys + data.girls}</span>
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

// Academic Interest Category Chart - Vertical Stacked Bar Chart (Boys/Girls)
function AcademicClubsChart({ clubs }: { clubs: Club[] }) {
    const [animationKey, setAnimationKey] = useState(0);
    
    const chartData = clubs.map((club) => ({
        name: club.name.replace(' Club', ''),
        boys: club.male_count,
        girls: club.female_count,
        total: club.members_count,
    })).sort((a, b) => b.total - a.total);

    const maxMembers = Math.max(...chartData.map(d => d.total), 10);

    return (
        <Card className="overflow-hidden border-2 border-blue-100 dark:border-blue-900 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/50 dark:from-blue-950/20 dark:via-gray-900 dark:to-indigo-950/20">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                <BookOpen className="h-4 w-4 text-white" />
                            </div>
                            Academic & Interest Clubs
                        </CardTitle>
                        <CardDescription className="mt-1">Gender distribution across academic clubs</CardDescription>
                    </div>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setAnimationKey(k => k + 1)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Replay
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            key={animationKey}
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis 
                                dataKey="name" 
                                tick={{ fill: '#374151', fontSize: 11 }}
                                axisLine={{ stroke: '#E5E7EB' }}
                                tickLine={false}
                                angle={-35}
                                textAnchor="end"
                                height={60}
                                interval={0}
                            />
                            <YAxis 
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                                domain={[0, maxMembers + 5]}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
                            <Bar 
                                dataKey="boys" 
                                stackId="a"
                                fill="#3B82F6"
                                radius={[0, 0, 0, 0]}
                                isAnimationActive={true}
                                animationDuration={1500}
                                animationEasing="ease-out"
                                name="Boys"
                            />
                            <Bar 
                                dataKey="girls" 
                                stackId="a"
                                fill="#EC4899"
                                radius={[8, 8, 0, 0]}
                                isAnimationActive={true}
                                animationDuration={1500}
                                animationEasing="ease-out"
                                name="Girls"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                {/* Legend */}
                <div className="mt-4 flex justify-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded bg-blue-500"></div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Boys</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded bg-pink-500"></div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Girls</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Creative & Physical Category Chart - Vertical Stacked Bar Chart (Boys/Girls)
function CreativeClubsChart({ clubs }: { clubs: Club[] }) {
    const [animationKey, setAnimationKey] = useState(0);
    
    const chartData = clubs.map((club) => ({
        name: club.name.replace(' Club', ''),
        boys: club.male_count,
        girls: club.female_count,
        total: club.members_count,
    })).sort((a, b) => b.total - a.total);

    const maxMembers = Math.max(...chartData.map(d => d.total), 10);

    return (
        <Card className="overflow-hidden border-2 border-pink-100 dark:border-pink-900 bg-gradient-to-br from-pink-50/50 via-white to-rose-50/50 dark:from-pink-950/20 dark:via-gray-900 dark:to-rose-950/20">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                                <Sparkles className="h-4 w-4 text-white" />
                            </div>
                            Creative & Physical Clubs
                        </CardTitle>
                        <CardDescription className="mt-1">Gender distribution across creative clubs</CardDescription>
                    </div>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setAnimationKey(k => k + 1)}
                        className="text-pink-600 hover:text-pink-700 hover:bg-pink-50"
                    >
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Replay
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            key={animationKey}
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis 
                                dataKey="name" 
                                tick={{ fill: '#374151', fontSize: 11 }}
                                axisLine={{ stroke: '#E5E7EB' }}
                                tickLine={false}
                                angle={-35}
                                textAnchor="end"
                                height={60}
                                interval={0}
                            />
                            <YAxis 
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                                domain={[0, maxMembers + 5]}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(236, 72, 153, 0.1)' }} />
                            <Bar 
                                dataKey="boys" 
                                stackId="a"
                                fill="#3B82F6"
                                radius={[0, 0, 0, 0]}
                                isAnimationActive={true}
                                animationDuration={1500}
                                animationEasing="ease-out"
                                name="Boys"
                            />
                            <Bar 
                                dataKey="girls" 
                                stackId="a"
                                fill="#EC4899"
                                radius={[8, 8, 0, 0]}
                                isAnimationActive={true}
                                animationDuration={1500}
                                animationEasing="ease-out"
                                name="Girls"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                {/* Legend */}
                <div className="mt-4 flex justify-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded bg-blue-500"></div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Boys</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded bg-pink-500"></div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Girls</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function EnrollmentDialog({ club, onSuccess }: { club: Club; onSuccess: () => void }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        student_name: '',
        class: '',
        gender: '',
        admission_number: '',
        email: '',
        phone: '',
        parent_phone: '',
        reason: '',
        honeypot: '', // Anti-spam honeypot
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/beyond-academics/clubs/${club.slug}/enroll`, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onSuccess();
                setTimeout(() => setOpen(false), 2000);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Apply Now
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Join {club.name}</DialogTitle>
                    <DialogDescription>
                        Fill in your details to apply for membership. Each student can join only one club per category.
                    </DialogDescription>
                </DialogHeader>

                {recentlySuccessful ? (
                    <div className="py-8 text-center">
                        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-green-700 dark:text-green-400">Application Submitted!</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            Your enrollment request has been submitted. You will be notified once it is reviewed.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={submit} className="space-y-4">
                        {/* Honeypot - hidden from users, filled by bots */}
                        <div className="hidden" aria-hidden="true">
                            <Input
                                name="honeypot"
                                value={data.honeypot}
                                onChange={(e) => setData('honeypot', e.target.value)}
                                tabIndex={-1}
                                autoComplete="off"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="student_name">Full Name *</Label>
                                <Input
                                    id="student_name"
                                    value={data.student_name}
                                    onChange={(e) => setData('student_name', e.target.value)}
                                    placeholder="Enter your full name"
                                    required
                                />
                                {errors.student_name && (
                                    <p className="text-sm text-red-500">{errors.student_name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender *</Label>
                                <Select value={data.gender} onValueChange={(value) => setData('gender', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.gender && (
                                    <p className="text-sm text-red-500">{errors.gender}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="class">Class *</Label>
                                <Select value={data.class} onValueChange={(value) => setData('class', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {['VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'].map((cls) => (
                                            <SelectItem key={cls} value={cls}>Class {cls}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.class && (
                                    <p className="text-sm text-red-500">{errors.class}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="admission_number">Admission Number *</Label>
                                <Input
                                    id="admission_number"
                                    value={data.admission_number}
                                    onChange={(e) => setData('admission_number', e.target.value)}
                                    placeholder="Enter admission number"
                                    required
                                />
                                {errors.admission_number && (
                                    <p className="text-sm text-red-500">{errors.admission_number}</p>
                                )}
                            </div>
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
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone">Student Phone *</Label>
                                <Input
                                    id="phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="10-digit number"
                                    required
                                />
                                {errors.phone && (
                                    <p className="text-sm text-red-500">{errors.phone}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="parent_phone">Parent Phone</Label>
                                <Input
                                    id="parent_phone"
                                    value={data.parent_phone}
                                    onChange={(e) => setData('parent_phone', e.target.value)}
                                    placeholder="10-digit number"
                                />
                                {errors.parent_phone && (
                                    <p className="text-sm text-red-500">{errors.parent_phone}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reason">Why do you want to join? (Optional)</Label>
                            <Textarea
                                id="reason"
                                value={data.reason}
                                onChange={(e) => setData('reason', e.target.value)}
                                placeholder="Tell us why you're interested in this club..."
                                rows={3}
                            />
                            {errors.reason && (
                                <p className="text-sm text-red-500">{errors.reason}</p>
                            )}
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Application'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}

function ClubCard({ club, colorScheme }: { club: Club; colorScheme: typeof categoryColors.academic_interest }) {
    const [showSuccess, setShowSuccess] = useState(false);
    const Icon = clubIcons[club.name] || Users;

    return (
        <Card className={`group hover:shadow-xl transition-all duration-300 border-2 ${colorScheme.border} hover:border-amber-400 relative overflow-hidden`}>
            {/* Club Image */}
            {club.image ? (
                <div className="relative h-48 overflow-hidden">
                    <img 
                        src={club.image.startsWith('http') ? club.image : `/storage/${club.image}`}
                        alt={club.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    
                    {/* Member count badge - positioned on image */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 dark:bg-gray-800/90 rounded-full px-3 py-1 shadow-md">
                        <Users className="h-4 w-4 text-amber-600" />
                        <span className="font-bold text-amber-600">{club.members_count}</span>
                    </div>
                    
                    {/* Club icon badge - positioned on image */}
                    <div className={`absolute bottom-3 left-3 w-12 h-12 rounded-xl ${colorScheme.bg} flex items-center justify-center shadow-lg`}>
                        <Icon className={`h-6 w-6 ${colorScheme.text}`} />
                    </div>
                </div>
            ) : (
                /* Fallback when no image */
                <div className={`relative h-32 ${colorScheme.bg} flex items-center justify-center`}>
                    <Icon className={`h-16 w-16 ${colorScheme.text} opacity-50`} />
                    {/* Member count badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 dark:bg-gray-800/90 rounded-full px-3 py-1 shadow-md">
                        <Users className="h-4 w-4 text-amber-600" />
                        <span className="font-bold text-amber-600">{club.members_count}</span>
                    </div>
                </div>
            )}
            
            <CardHeader className="pb-3 relative">
                <CardTitle className="text-lg group-hover:text-amber-700 transition-colors">
                    {club.name}
                </CardTitle>
            </CardHeader>
            
            <CardContent className="relative">
                <CardDescription className="mb-4 line-clamp-2">
                    {club.description}
                </CardDescription>
                
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">In-charge:</span>
                        <span>{club.in_charge}</span>
                    </div>
                    {club.meeting_schedule && (
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Schedule:</span>
                            <span>{club.meeting_schedule}</span>
                        </div>
                    )}
                </div>

                {/* Enrollment Button */}
                {club.accepts_enrollment && (
                    <EnrollmentDialog club={club} onSuccess={() => setShowSuccess(true)} />
                )}

                {showSuccess && (
                    <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-700 dark:text-green-400 text-sm flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Application submitted!
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default function Clubs({ clubs, categories, statistics }: Props) {
    const { flash } = usePage().props as any;
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const filteredClubs = selectedCategory
        ? { [selectedCategory]: clubs[selectedCategory as keyof typeof clubs] }
        : clubs;

    // Calculate totals for infographic
    const academicTotal = clubs.academic_interest?.reduce((sum, c) => sum + c.members_count, 0) || 0;
    const creativeTotal = clubs.creative_physical?.reduce((sum, c) => sum + c.members_count, 0) || 0;

    return (
        <PublicLayout title="Clubs & Societies - Beyond Academics - APS Alwar">
            {/* Hero Section with Statistics */}
            <section className="relative bg-gradient-to-b from-amber-50 via-white to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-950 py-16 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
                
                <div className="container mx-auto px-4 relative">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="mb-4 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 px-4 py-1">
                            <Users className="h-3 w-3 mr-1" />
                            Clubs & Societies
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Discover Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-pink-500">Passion</span>
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Join clubs that match your interests. Choose one from each category - 
                            Academic & Interest or Creative & Physical - and grow with like-minded peers!
                        </p>
                    </div>

                    {/* Infographic Statistics */}
                    <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
                            <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg border border-amber-100 dark:border-amber-900">
                                <div className="text-4xl font-bold text-amber-600 mb-1">{statistics.total_clubs}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Active Clubs</div>
                            </div>
                        </div>
                        
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
                            <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg border border-green-100 dark:border-green-900">
                                <div className="text-4xl font-bold text-green-600 mb-1">{statistics.total_enrollments}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Members Enrolled</div>
                            </div>
                        </div>
                        
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
                            <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg border border-blue-100 dark:border-blue-900">
                                <div className="text-4xl font-bold text-blue-600 mb-1">{statistics.academic_count}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Academic Clubs</div>
                            </div>
                        </div>
                        
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
                            <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg border border-pink-100 dark:border-pink-900">
                                <div className="text-4xl font-bold text-pink-600 mb-1">{statistics.creative_count}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Creative Clubs</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Filter */}
            <section className="py-8 border-b dark:border-gray-800 sticky top-0 bg-white/95 dark:bg-gray-950/95 backdrop-blur z-10">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Button
                            variant={selectedCategory === null ? 'default' : 'outline'}
                            size="lg"
                            onClick={() => setSelectedCategory(null)}
                            className={selectedCategory === null ? 'bg-amber-600 hover:bg-amber-700 shadow-lg' : ''}
                        >
                            <Star className="h-4 w-4 mr-2" />
                            All Clubs
                        </Button>
                        
                        <Button
                            variant={selectedCategory === 'academic_interest' ? 'default' : 'outline'}
                            size="lg"
                            onClick={() => setSelectedCategory('academic_interest')}
                            className={selectedCategory === 'academic_interest' 
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg' 
                                : 'border-blue-300 text-blue-700 hover:bg-blue-50'}
                        >
                            <BookOpen className="h-4 w-4 mr-2" />
                            Academic & Interest ({academicTotal} members)
                        </Button>
                        
                        <Button
                            variant={selectedCategory === 'creative_physical' ? 'default' : 'outline'}
                            size="lg"
                            onClick={() => setSelectedCategory('creative_physical')}
                            className={selectedCategory === 'creative_physical' 
                                ? 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 shadow-lg' 
                                : 'border-pink-300 text-pink-700 hover:bg-pink-50'}
                        >
                            <Sparkles className="h-4 w-4 mr-2" />
                            Creative & Physical ({creativeTotal} members)
                        </Button>
                    </div>
                </div>
            </section>

            {/* Club Distribution Charts */}
            <section className="py-12 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-10">
                            <Badge className="mb-4 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Club Analytics
                            </Badge>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                Student Participation Overview
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-xl mx-auto">
                                See how students are distributed across different clubs in each category
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            {clubs.academic_interest && clubs.academic_interest.length > 0 && (
                                <AcademicClubsChart clubs={clubs.academic_interest} />
                            )}
                            {clubs.creative_physical && clubs.creative_physical.length > 0 && (
                                <CreativeClubsChart clubs={clubs.creative_physical} />
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Flash Messages */}
            {flash?.success && (
                <div className="container mx-auto px-4 mt-4">
                    <div className="max-w-4xl mx-auto bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <span className="text-green-800 dark:text-green-200">{flash.success}</span>
                    </div>
                </div>
            )}

            {/* Clubs by Category */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto space-y-16">
                        {Object.entries(filteredClubs).map(([category, categoryClubs]) => {
                            const colorScheme = categoryColors[category];
                            const categoryLabel = categories[category];
                            
                            if (!categoryClubs || categoryClubs.length === 0) return null;
                            
                            return (
                                <div key={category}>
                                    {/* Category Header */}
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className={`h-1 flex-1 bg-gradient-to-r ${colorScheme.gradient} rounded-full opacity-30`} />
                                        <Badge className={`${colorScheme.bg} ${colorScheme.text} px-4 py-2 text-sm font-semibold`}>
                                            {category === 'academic_interest' ? <BookOpen className="h-4 w-4 mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                                            {categoryLabel}
                                        </Badge>
                                        <div className={`h-1 flex-1 bg-gradient-to-l ${colorScheme.gradient} rounded-full opacity-30`} />
                                    </div>

                                    <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                                        {category === 'academic_interest' 
                                            ? 'Expand your knowledge and explore your intellectual curiosities through these clubs.'
                                            : 'Express your creativity and stay active with these artistic and physical activity clubs.'}
                                    </p>

                                    {/* Club Cards Grid */}
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {categoryClubs.map((club) => (
                                            <ClubCard key={club.id} club={club} colorScheme={colorScheme} />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-emerald-100 text-emerald-800">Enrollment Process</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            How to Join a Club
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-xl mx-auto">
                            Simple 4-step process to become a club member
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-4 gap-4">
                            {[
                                {
                                    step: 1,
                                    title: 'Choose Club',
                                    description: 'Select one club from each category',
                                    icon: Star,
                                },
                                {
                                    step: 2,
                                    title: 'Fill Form',
                                    description: 'Enter your details and admission number',
                                    icon: UserPlus,
                                },
                                {
                                    step: 3,
                                    title: 'Verification',
                                    description: 'Admin verifies your enrollment',
                                    icon: AlertCircle,
                                },
                                {
                                    step: 4,
                                    title: 'Get Approved',
                                    description: 'Start participating in activities!',
                                    icon: CheckCircle2,
                                },
                            ].map((item, index) => (
                                <div key={index} className="relative">
                                    {index < 3 && (
                                        <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-200 dark:bg-gray-700" />
                                    )}
                                    <div className="relative bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg border">
                                        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
                                            <item.icon className="h-8 w-8 text-amber-600" />
                                        </div>
                                        <div className="text-2xl font-bold text-gray-400 mb-2">Step {item.step}</div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Rules & Benefits */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
                        {/* Rules Card */}
                        <Card className="border-2 border-amber-200 dark:border-amber-800">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-2">
                                    <AlertCircle className="h-6 w-6 text-amber-600" />
                                </div>
                                <CardTitle>Enrollment Rules</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {[
                                        'Each student can join ONE club per category',
                                        'You can be part of maximum 2 clubs (one from each category)',
                                        'Valid admission number is required for verification',
                                        'Enrollment is for the current academic year only',
                                        'Attendance in club activities is mandatory',
                                    ].map((rule, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <CheckCircle2 className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700 dark:text-gray-300">{rule}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Benefits Card */}
                        <Card className="border-2 border-green-200 dark:border-green-800">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-2">
                                    <Star className="h-6 w-6 text-green-600" />
                                </div>
                                <CardTitle>Benefits of Joining</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {[
                                        'Develop new skills and explore your interests',
                                        'Make friends with similar passions',
                                        'Leadership opportunities and event organization',
                                        'Certificates for active participation',
                                        'Extra-curricular points for your profile',
                                    ].map((benefit, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <Sparkles className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-amber-600 via-amber-500 to-pink-500">
                <div className="container mx-auto px-4 text-center">
                    <Users className="h-12 w-12 text-white mx-auto mb-4 opacity-90" />
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Find Your Community
                    </h2>
                    <p className="text-amber-100 mb-8 max-w-2xl mx-auto">
                        Every student can find their place at APS Alwar. Explore our clubs and 
                        discover new passions! Start your journey today.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button size="lg" variant="secondary" asChild>
                            <Link href="/beyond-academics">
                                Explore More
                                <ChevronRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                            <Link href="/contact">
                                Contact Us
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
