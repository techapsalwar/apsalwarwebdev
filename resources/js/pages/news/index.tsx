import PublicLayout from '@/layouts/public-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Calendar, ArrowRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface NewsItem {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    featured_image: string | null;
    published_at: string | null;
    is_featured: boolean;
}

interface Pagination {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface NewsIndexProps {
    news: {
        data: NewsItem[];
    } & Pagination;
    filters: {
        search?: string;
    };
}

export default function NewsIndex({ news, filters }: NewsIndexProps) {
    const [search, setSearch] = useState(filters?.search || '');

    // Safe defaults for news data
    const newsData = news?.data || [];
    const totalPages = news?.last_page || 1;
    const currentPage = news?.current_page || 1;
    const perPage = news?.per_page || 12;
    const total = news?.total || 0;
    const links = news?.links || [];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/news', { search: search || undefined }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <PublicLayout title="News & Updates - Army Public School Alwar">
            <Head title="News & Updates - APS Alwar" />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-950 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <Badge className="mb-4 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            Stay Updated
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            News & Updates
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Stay informed about the latest happenings, achievements, and events at Army Public School, Alwar.
                        </p>
                    </div>
                </div>
            </section>

            {/* Search and Filters */}
            <section className="py-8 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search news..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Button type="submit">Search</Button>
                    </form>
                </div>
            </section>

            {/* News Grid */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    {newsData.length > 0 ? (
                        <>
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {newsData.map((item) => (
                                    <Card key={item.id} className="overflow-hidden transition-all hover:shadow-lg group">
                                        <div className="aspect-video bg-gray-200 dark:bg-gray-800 overflow-hidden">
                                            {item.featured_image ? (
                                                <img 
                                                    src={item.featured_image} 
                                                    alt={item.title}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center">
                                                    <span className="text-gray-400 text-sm">No Image</span>
                                                </div>
                                            )}
                                        </div>
                                        <CardContent className="p-6">
                                            <div className="flex items-center gap-2 mb-3">
                                                {item.is_featured && (
                                                    <Badge className="bg-amber-100 text-amber-800">Featured</Badge>
                                                )}
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Calendar className="mr-1 h-3 w-3" />
                                                    {item.published_at}
                                                </div>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                                {item.title}
                                            </h3>
                                            {item.excerpt && (
                                                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                                                    {item.excerpt}
                                                </p>
                                            )}
                                            <Link 
                                                href={`/news/${item.slug}`}
                                                className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium"
                                            >
                                                Read More
                                                <ArrowRight className="ml-1 h-4 w-4" />
                                            </Link>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-12 flex flex-col items-center gap-4">
                                    <p className="text-sm text-gray-500">
                                        Showing {((currentPage - 1) * perPage) + 1} to{' '}
                                        {Math.min(currentPage * perPage, total)} of {total} articles
                                    </p>
                                    <div className="flex gap-2">
                                        {links.map((link, index) => (
                                            <Button
                                                key={index}
                                                variant={link.active ? 'default' : 'outline'}
                                                size="sm"
                                                disabled={!link.url}
                                                onClick={() => link.url && router.get(link.url)}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className={link.active ? 'bg-amber-600 hover:bg-amber-700' : ''}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-16">
                            <div className="text-gray-400 mb-4">
                                <Eye className="h-16 w-16 mx-auto" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                No News Found
                            </h3>
                            <p className="text-gray-500">
                                {filters?.search 
                                    ? `No results found for "${filters.search}". Try a different search term.`
                                    : 'There are no news articles available at the moment.'
                                }
                            </p>
                            {filters?.search && (
                                <Button 
                                    variant="outline" 
                                    className="mt-4"
                                    onClick={() => router.get('/news')}
                                >
                                    Clear Search
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
