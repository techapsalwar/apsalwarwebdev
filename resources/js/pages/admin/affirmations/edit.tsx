import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { type BreadcrumbItem } from '@/types';

interface Affirmation {
    id: number;
    quote: string;
    author: string | null;
    display_date: string;
    is_active: boolean;
}

interface Props {
    affirmation: Affirmation;
}

export default function AffirmationsEdit({ affirmation }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Affirmations', href: '/admin/affirmations' },
        { title: 'Edit', href: `/admin/affirmations/${affirmation.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        quote: affirmation.quote,
        author: affirmation.author || '',
        display_date: affirmation.display_date,
        is_active: affirmation.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/affirmations/${affirmation.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Affirmation" />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/affirmations">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Edit Affirmation</h1>
                        <p className="text-gray-500">
                            {new Date(affirmation.display_date).toLocaleDateString('en-IN', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Affirmation Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="quote">Quote / Thought *</Label>
                                <Textarea
                                    id="quote"
                                    value={data.quote}
                                    onChange={(e) => setData('quote', e.target.value)}
                                    placeholder="Enter an inspiring quote or thought..."
                                    rows={4}
                                    required
                                />
                                {errors.quote && <p className="text-sm text-red-500">{errors.quote}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="author">Author</Label>
                                <Input
                                    id="author"
                                    value={data.author}
                                    onChange={(e) => setData('author', e.target.value)}
                                    placeholder="e.g., Swami Vivekananda"
                                />
                                {errors.author && <p className="text-sm text-red-500">{errors.author}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="display_date">Display Date *</Label>
                                <Input
                                    id="display_date"
                                    type="date"
                                    value={data.display_date}
                                    onChange={(e) => setData('display_date', e.target.value)}
                                    required
                                />
                                {errors.display_date && <p className="text-sm text-red-500">{errors.display_date}</p>}
                                <p className="text-xs text-gray-500">Each date can only have one affirmation</p>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t">
                                <div>
                                    <Label>Active</Label>
                                    <p className="text-sm text-gray-500">Show on the scheduled date</p>
                                </div>
                                <Switch
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', checked)}
                                />
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button type="button" variant="outline" className="flex-1" asChild>
                                    <Link href="/admin/affirmations">Cancel</Link>
                                </Button>
                                <Button type="submit" className="flex-1" disabled={processing}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {processing ? 'Saving...' : 'Update'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
