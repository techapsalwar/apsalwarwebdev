import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { type BreadcrumbItem } from '@/types';

interface FeeStructure {
    id: number;
    academic_year: number;
    category: string;
    class_range: string;
    admission_fee: number;
    registration_fee: number;
    security_deposit: number;
    annual_fee: number;
    tuition_fee: number;
    computer_fee: number;
    science_fee: number;
    other_fees: Record<string, number> | null;
    notes: string | null;
    is_active: boolean;
}

interface Props {
    feeStructure: FeeStructure;
    categories: Record<string, string>;
    classRanges: Record<string, string>;
}

export default function FeeStructuresEdit({ feeStructure, categories, classRanges }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        academic_year: feeStructure.academic_year,
        category: feeStructure.category,
        class_range: feeStructure.class_range,
        admission_fee: feeStructure.admission_fee,
        registration_fee: feeStructure.registration_fee,
        security_deposit: feeStructure.security_deposit,
        annual_fee: feeStructure.annual_fee,
        tuition_fee: feeStructure.tuition_fee,
        computer_fee: feeStructure.computer_fee,
        science_fee: feeStructure.science_fee,
        notes: feeStructure.notes || '',
        is_active: feeStructure.is_active,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Fee Structures', href: '/admin/fee-structures' },
        { title: 'Edit', href: `/admin/fee-structures/${feeStructure.id}/edit` },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/fee-structures/${feeStructure.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Fee Structure" />
            
            <div className="max-w-4xl mx-auto p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <IndianRupee className="h-6 w-6" />
                        Edit Fee Structure
                    </h1>
                    <p className="text-gray-500">
                        Update fee structure for {categories[feeStructure.category]} - {classRanges[feeStructure.class_range]}
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {/* Basic Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>Academic year, category, and class range</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="academic_year">Academic Year</Label>
                                    <Input
                                        id="academic_year"
                                        type="number"
                                        min="2020"
                                        max="2100"
                                        value={data.academic_year}
                                        onChange={(e) => setData('academic_year', parseInt(e.target.value))}
                                    />
                                    <p className="text-sm text-gray-500">
                                        Session: {data.academic_year}-{(data.academic_year + 1).toString().slice(-2)}
                                    </p>
                                    {errors.academic_year && <p className="text-sm text-red-500">{errors.academic_year}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select value={data.category} onValueChange={(value) => setData('category', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(categories).map(([key, label]) => (
                                                <SelectItem key={key} value={key}>{label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="class_range">Class Range</Label>
                                    <Select value={data.class_range} onValueChange={(value) => setData('class_range', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select class range" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(classRanges).map(([key, label]) => (
                                                <SelectItem key={key} value={key}>{label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.class_range && <p className="text-sm text-red-500">{errors.class_range}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        {/* One-time Fees */}
                        <Card>
                            <CardHeader>
                                <CardTitle>One-time Fees</CardTitle>
                                <CardDescription>Fees charged at the time of admission</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="registration_fee">Registration Fee</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                        <Input
                                            id="registration_fee"
                                            type="number"
                                            min="0"
                                            step="1"
                                            className="pl-8"
                                            value={data.registration_fee}
                                            onChange={(e) => setData('registration_fee', parseFloat(e.target.value) || 0)}
                                        />
                                    </div>
                                    {errors.registration_fee && <p className="text-sm text-red-500">{errors.registration_fee}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="admission_fee">Admission Fee</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                        <Input
                                            id="admission_fee"
                                            type="number"
                                            min="0"
                                            step="1"
                                            className="pl-8"
                                            value={data.admission_fee}
                                            onChange={(e) => setData('admission_fee', parseFloat(e.target.value) || 0)}
                                        />
                                    </div>
                                    {errors.admission_fee && <p className="text-sm text-red-500">{errors.admission_fee}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="security_deposit">Security Deposit</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                        <Input
                                            id="security_deposit"
                                            type="number"
                                            min="0"
                                            step="1"
                                            className="pl-8"
                                            value={data.security_deposit}
                                            onChange={(e) => setData('security_deposit', parseFloat(e.target.value) || 0)}
                                        />
                                    </div>
                                    <p className="text-sm text-gray-500">Refundable upon leaving</p>
                                    {errors.security_deposit && <p className="text-sm text-red-500">{errors.security_deposit}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recurring Fees */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recurring Fees</CardTitle>
                                <CardDescription>Annual and monthly fees</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                                <div className="space-y-2">
                                    <Label htmlFor="annual_fee">Annual Fee</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                        <Input
                                            id="annual_fee"
                                            type="number"
                                            min="0"
                                            step="1"
                                            className="pl-8"
                                            value={data.annual_fee}
                                            onChange={(e) => setData('annual_fee', parseFloat(e.target.value) || 0)}
                                        />
                                    </div>
                                    <p className="text-sm text-gray-500">Per year</p>
                                    {errors.annual_fee && <p className="text-sm text-red-500">{errors.annual_fee}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tuition_fee">Tuition Fee</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                        <Input
                                            id="tuition_fee"
                                            type="number"
                                            min="0"
                                            step="1"
                                            className="pl-8"
                                            value={data.tuition_fee}
                                            onChange={(e) => setData('tuition_fee', parseFloat(e.target.value) || 0)}
                                        />
                                    </div>
                                    <p className="text-sm text-gray-500">Per month</p>
                                    {errors.tuition_fee && <p className="text-sm text-red-500">{errors.tuition_fee}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="computer_fee">Computer Fee</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                        <Input
                                            id="computer_fee"
                                            type="number"
                                            min="0"
                                            step="1"
                                            className="pl-8"
                                            value={data.computer_fee}
                                            onChange={(e) => setData('computer_fee', parseFloat(e.target.value) || 0)}
                                        />
                                    </div>
                                    <p className="text-sm text-gray-500">Per month (if applicable)</p>
                                    {errors.computer_fee && <p className="text-sm text-red-500">{errors.computer_fee}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="science_fee">Science Fee</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                        <Input
                                            id="science_fee"
                                            type="number"
                                            min="0"
                                            step="1"
                                            className="pl-8"
                                            value={data.science_fee}
                                            onChange={(e) => setData('science_fee', parseFloat(e.target.value) || 0)}
                                        />
                                    </div>
                                    <p className="text-sm text-gray-500">Per month (Class XI-XII only)</p>
                                    {errors.science_fee && <p className="text-sm text-red-500">{errors.science_fee}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Additional Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Additional Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Any additional notes about this fee structure..."
                                        rows={3}
                                    />
                                    {errors.notes && <p className="text-sm text-red-500">{errors.notes}</p>}
                                </div>

                                <div className="flex items-center gap-2">
                                    <Switch
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked)}
                                    />
                                    <Label htmlFor="is_active">Active (visible on website)</Label>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="flex gap-4 justify-end">
                            <Button type="button" variant="outline" onClick={() => router.get('/admin/fee-structures')}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Saving...' : 'Update Fee Structure'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
