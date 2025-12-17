import PublicLayout from '@/layouts/public-layout';
import { Link } from '@inertiajs/react';
import { Calendar, ArrowLeft, ArrowRight, Eye, Share2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface NewsDetail {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    featured_image: string | null;
    published_at: string | null;
    meta_title: string;
    meta_description: string | null;
    views: number;
    author: {
        name: string;
    } | null;
}

interface RelatedNews {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    featured_image: string | null;
    published_at: string | null;
}

interface NewsShowProps {
    news: NewsDetail;
    relatedNews: RelatedNews[];
}

export default function NewsShow({ news, relatedNews }: NewsShowProps) {
    // Handle case where news might not be loaded yet
    if (!news) {
        return (
            <PublicLayout title="Loading... - Army Public School Alwar">
                <div className="container mx-auto px-4 py-16 text-center">
                    <p className="text-gray-500">Loading...</p>
                </div>
            </PublicLayout>
        );
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: news.title,
                text: news.excerpt || '',
                url: window.location.href,
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    // Safe meta values with fallbacks
    const pageTitle = news.meta_title || news.title;
    const pageDescription = news.meta_description || news.excerpt || '';

    return (
        <PublicLayout title={`${pageTitle} - Army Public School Alwar`}>
            {/* Breadcrumb */}
            <section className="bg-gray-50 dark:bg-gray-900 py-4 border-b">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center text-sm text-gray-500">
                        <Link href="/" className="hover:text-amber-600">Home</Link>
                        <ChevronRight className="h-4 w-4 mx-2" />
                        <Link href="/news" className="hover:text-amber-600">News</Link>
                        <ChevronRight className="h-4 w-4 mx-2" />
                        <span className="text-gray-900 dark:text-white truncate max-w-xs">
                            {news.title}
                        </span>
                    </nav>
                </div>
            </section>

            {/* Article Content */}
            <article className="py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Back button */}
                        <Button variant="ghost" size="sm" asChild className="mb-6">
                            <Link href="/news">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to News
                            </Link>
                        </Button>

                        {/* Header */}
                        <header className="mb-8">
                            <Badge className="mb-4 bg-green-100 text-green-800">News</Badge>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                {news.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                {news.published_at && (
                                    <div className="flex items-center">
                                        <Calendar className="mr-1 h-4 w-4" />
                                        {news.published_at}
                                    </div>
                                )}
                                {news.author && (
                                    <div>By {news.author.name}</div>
                                )}
                                <div className="flex items-center">
                                    <Eye className="mr-1 h-4 w-4" />
                                    {news.views} views
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={handleShare}
                                    className="ml-auto"
                                >
                                    <Share2 className="mr-2 h-4 w-4" />
                                    Share
                                </Button>
                            </div>
                        </header>

                        {/* Featured Image */}
                        {news.featured_image && (
                            <div className="mb-8 rounded-lg overflow-hidden">
                                <img 
                                    src={news.featured_image} 
                                    alt={news.title}
                                    className="w-full h-auto max-h-[500px] object-cover"
                                />
                            </div>
                        )}

                        {/* Excerpt */}
                        {news.excerpt && (
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 font-medium italic border-l-4 border-amber-500 pl-4">
                                {news.excerpt}
                            </p>
                        )}

                        {/* Content */}
                        <div 
                            className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-amber-600 hover:prose-a:text-amber-700"
                            dangerouslySetInnerHTML={{ __html: news.content }}
                        />
                    </div>
                </div>
            </article>

            {/* Related News */}
            {relatedNews.length > 0 && (
                <section className="py-16 bg-gray-50 dark:bg-gray-900">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                            Related News
                        </h2>
                        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
                            {relatedNews.map((item) => (
                                <Card key={item.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                                    <div className="aspect-video bg-gray-200 dark:bg-gray-800">
                                        {item.featured_image ? (
                                            <img 
                                                src={item.featured_image} 
                                                alt={item.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center">
                                                <span className="text-gray-400 text-sm">No Image</span>
                                            </div>
                                        )}
                                    </div>
                                    <CardContent className="p-4">
                                        <p className="text-sm text-gray-500 mb-2">
                                            {item.published_at}
                                        </p>
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                            {item.title}
                                        </h3>
                                        <Link 
                                            href={`/news/${item.slug}`}
                                            className="inline-flex items-center text-amber-600 hover:text-amber-700 text-sm font-medium"
                                        >
                                            Read More
                                            <ArrowRight className="ml-1 h-3 w-3" />
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="py-12">
                <div className="container mx-auto px-4 text-center">
                    <Button asChild className="bg-amber-600 hover:bg-amber-700">
                        <Link href="/news">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            View All News
                        </Link>
                    </Button>
                </div>
            </section>
        </PublicLayout>
    );
}
