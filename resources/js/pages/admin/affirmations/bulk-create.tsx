import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Plus, Trash2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';

interface AffirmationEntry {
    quote: string;
    author: string;
    display_date: string;
}

export default function AffirmationsBulkCreate() {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Affirmations', href: '/admin/affirmations' },
        { title: 'Bulk Add', href: '/admin/affirmations/bulk-create' },
    ];

    // Get next 7 days starting from tomorrow
    const getNextWeekDates = () => {
        const dates: string[] = [];
        for (let i = 1; i <= 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            dates.push(date.toISOString().split('T')[0]);
        }
        return dates;
    };

    const initialDates = getNextWeekDates();

    const [entries, setEntries] = useState<AffirmationEntry[]>(
        initialDates.map(date => ({
            quote: '',
            author: '',
            display_date: date,
        }))
    );

    const { post, processing, errors } = useForm<{ affirmations: AffirmationEntry[] }>({
        affirmations: [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Filter out empty entries
        const validEntries = entries.filter(entry => entry.quote.trim() !== '');
        if (validEntries.length === 0) {
            alert('Please add at least one affirmation');
            return;
        }
        post('/admin/affirmations/bulk-store', {
            data: { affirmations: validEntries },
        });
    };

    const updateEntry = (index: number, field: keyof AffirmationEntry, value: string) => {
        const newEntries = [...entries];
        newEntries[index] = { ...newEntries[index], [field]: value };
        setEntries(newEntries);
    };

    const addEntry = () => {
        const lastDate = entries.length > 0 
            ? new Date(entries[entries.length - 1].display_date) 
            : new Date();
        lastDate.setDate(lastDate.getDate() + 1);
        setEntries([...entries, {
            quote: '',
            author: '',
            display_date: lastDate.toISOString().split('T')[0],
        }]);
    };

    const removeEntry = (index: number) => {
        if (entries.length > 1) {
            setEntries(entries.filter((_, i) => i !== index));
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bulk Add Affirmations" />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/affirmations">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Bulk Add Affirmations</h1>
                        <p className="text-gray-500">Add multiple thoughts of the day at once</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 max-w-4xl">
                        {entries.map((entry, index) => (
                            <Card key={index}>
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            {formatDate(entry.display_date)}
                                        </CardTitle>
                                        {entries.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-600 hover:text-red-700"
                                                onClick={() => removeEntry(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="grid md:grid-cols-4 gap-4">
                                        <div className="md:col-span-3 space-y-2">
                                            <Label>Quote *</Label>
                                            <Textarea
                                                value={entry.quote}
                                                onChange={(e) => updateEntry(index, 'quote', e.target.value)}
                                                placeholder="Enter an inspiring quote..."
                                                rows={2}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Author</Label>
                                            <Input
                                                value={entry.author}
                                                onChange={(e) => updateEntry(index, 'author', e.target.value)}
                                                placeholder="Author name"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Display Date</Label>
                                        <Input
                                            type="date"
                                            value={entry.display_date}
                                            onChange={(e) => updateEntry(index, 'display_date', e.target.value)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        <Button type="button" variant="outline" className="w-full" onClick={addEntry}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Another Day
                        </Button>

                        <div className="flex gap-2 pt-4">
                            <Button type="button" variant="outline" className="flex-1" asChild>
                                <Link href="/admin/affirmations">Cancel</Link>
                            </Button>
                            <Button type="submit" className="flex-1" disabled={processing}>
                                <Save className="h-4 w-4 mr-2" />
                                {processing ? 'Saving...' : `Save ${entries.filter(e => e.quote.trim()).length} Affirmations`}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
