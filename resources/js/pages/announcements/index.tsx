import PublicLayout from '@/layouts/public-layout';
import { Link, router } from '@inertiajs/react';
import { 
    ChevronRight, 
    AlertTriangle, 
    Bell, 
    Megaphone, 
    Info,
    Calendar,
    ExternalLink,
    Paperclip,
    Filter,
    Search,
    LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, LucideIcon> = {
    AlertTriangle,
    Bell,
    Megaphone,
    Info,
};

interface Announcement {
    id: number;
    title: string;
    slug: string;
    content: string;
    type: string;
    priority: string;
    priority_color: string;
    type_color: string;
    priority_icon: string;
    start_date: string | null;
    end_date: string | null;
    link: string | null;
    attachment: string | null;
    created_at: string;
}

interface PaginatedAnnouncements {
    data: Announcement[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface AnnouncementsIndexProps {
    announcements: PaginatedAnnouncements;
}

// Priority color classes for badges
const priorityColors: Record<string, string> = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    high: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
    critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

// Type color classes for badges
const typeColors: Record<string, string> = {
    general: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
    important: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    event: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    holiday: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    admission: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
    exam: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    result: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    academic: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
    other: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
};

// Priority card backgrounds
const priorityCardStyles: Record<string, string> = {
    low: 'border-l-4 border-l-green-500 hover:bg-green-50/50 dark:hover:bg-green-950/20',
    medium: 'border-l-4 border-l-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20',
    high: 'border-l-4 border-l-amber-500 bg-amber-50/30 hover:bg-amber-50 dark:bg-amber-950/10 dark:hover:bg-amber-950/20',
    critical: 'border-l-4 border-l-red-500 bg-red-50/30 hover:bg-red-50 dark:bg-red-950/10 dark:hover:bg-red-950/20',
};

export default function AnnouncementsIndex({ announcements }: AnnouncementsIndexProps) {
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const truncateContent = (content: string, maxLength: number = 150) => {
        if (content.length <= maxLength) return content;
        return content.slice(0, maxLength).trim() + '...';
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/announcements', { search, type: typeFilter, priority: priorityFilter }, {
            preserveState: true,
        });
    };

    return (
        <PublicLayout title="Announcements & Notices - Army Public School Alwar">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl">
                        <nav className="flex items-center text-sm text-amber-100 mb-4">
                            <Link href="/" className="hover:text-white">Home</Link>
                            <ChevronRight className="h-4 w-4 mx-2" />
                            <span className="text-white">Announcements</span>
                        </nav>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Announcements & Notices
                        </h1>
                        <p className="text-xl text-amber-100">
                            Stay updated with important announcements, notices, and updates from Army Public School Alwar.
                        </p>
                    </div>
                </div>
            </section>

            {/* Filters */}
            <section className="bg-gray-50 dark:bg-gray-900 py-6 border-b">
                <div className="container mx-auto px-4">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search announcements..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-4">
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="general">General</SelectItem>
                                    <SelectItem value="important">Important</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                    <SelectItem value="event">Event</SelectItem>
                                    <SelectItem value="holiday">Holiday</SelectItem>
                                    <SelectItem value="admission">Admission</SelectItem>
                                    <SelectItem value="exam">Exam</SelectItem>
                                    <SelectItem value="result">Result</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Priorities</SelectItem>
                                    <SelectItem value="critical">Critical</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                                Search
                            </Button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Announcements List */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    {announcements.data.length === 0 ? (
                        <div className="text-center py-12">
                            <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Announcements Found</h3>
                            <p className="text-gray-500">Check back later for updates.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-4">
                                {announcements.data.map((item) => {
                                    const PriorityIcon = iconMap[item.priority_icon] || Bell;
                                    
                                    return (
                                        <Link 
                                            key={item.id} 
                                            href={`/announcements/${item.slug}`}
                                            className="block"
                                        >
                                            <Card className={`transition-all duration-200 ${priorityCardStyles[item.priority]}`}>
                                                {/* Critical Banner */}
                                                {item.priority === 'critical' && (
                                                    <div className="bg-red-600 text-white px-4 py-1 text-sm flex items-center gap-2">
                                                        <AlertTriangle className="h-4 w-4 animate-pulse" />
                                                        <span className="font-medium">Critical Announcement</span>
                                                    </div>
                                                )}
                                                
                                                <CardContent className="p-6">
                                                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                                                        {/* Icon */}
                                                        <div className={`hidden md:flex h-12 w-12 items-center justify-center rounded-lg shrink-0 ${
                                                            item.priority === 'critical' ? 'bg-red-100 text-red-600' :
                                                            item.priority === 'high' ? 'bg-amber-100 text-amber-600' :
                                                            item.priority === 'medium' ? 'bg-blue-100 text-blue-600' :
                                                            'bg-green-100 text-green-600'
                                                        }`}>
                                                            <PriorityIcon className="h-6 w-6" />
                                                        </div>
                                                        
                                                        {/* Content */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                                <Badge className={typeColors[item.type] || typeColors.other}>
                                                                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                                                </Badge>
                                                                <Badge className={priorityColors[item.priority]}>
                                                                    {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                                                                </Badge>
                                                                {item.link && (
                                                                    <Badge variant="outline" className="text-blue-600">
                                                                        <ExternalLink className="h-3 w-3 mr-1" />
                                                                        Link
                                                                    </Badge>
                                                                )}
                                                                {item.attachment && (
                                                                    <Badge variant="outline" className="text-green-600">
                                                                        <Paperclip className="h-3 w-3 mr-1" />
                                                                        Attachment
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            
                                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                                {item.title}
                                                            </h3>
                                                            
                                                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                                                                {truncateContent(item.content)}
                                                            </p>
                                                            
                                                            <div className="flex items-center text-sm text-gray-500">
                                                                <Calendar className="h-4 w-4 mr-1" />
                                                                {formatDate(item.created_at)}
                                                                {item.end_date && (
                                                                    <span className="ml-4">
                                                                        Valid till: {formatDate(item.end_date)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Arrow */}
                                                        <ChevronRight className="hidden md:block h-6 w-6 text-gray-400 shrink-0" />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Pagination */}
                            {announcements.last_page > 1 && (
                                <div className="flex justify-center gap-2 mt-8">
                                    {announcements.links.map((link, index) => (
                                        <Button
                                            key={index}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url)}
                                            className={link.active ? 'bg-amber-600 hover:bg-amber-700' : ''}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
