import PublicLayout from '@/layouts/public-layout';
import { Link } from '@inertiajs/react';
import { 
    IndianRupee,
    CreditCard,
    CheckCircle,
    Info,
    ArrowRight,
    Percent,
    Calendar,
    Building2,
    Smartphone,
    FileText,
    Banknote,
    Users,
    GraduationCap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FeeItem {
    id: number;
    class_range: string;
    class_range_label: string;
    registration_fee: number;
    admission_fee: number;
    security_deposit: number;
    annual_fee: number;
    tuition_fee: number;
    computer_fee: number;
    science_fee: number;
    other_fees: Record<string, number> | null;
}

interface CategoryData {
    label: string;
    items: FeeItem[];
}

interface FeeType {
    id: number;
    name: string;
    key: string;
    type: 'one_time' | 'recurring';
    description: string | null;
    is_active: boolean;
    sort_order: number;
}

interface PaymentMode {
    mode: string;
    description: string;
    recommended: boolean;
}

interface Discount {
    type: string;
    discount: string;
    applicable: string;
}

interface Props {
    feeStructures: Record<string, CategoryData>;
    feeTypes: FeeType[];
    academicYear: number;
    categories: Record<string, string>;
    classRanges: Record<string, string>;
    paymentModes: PaymentMode[];
    discounts: Discount[];
}

const paymentIcons: Record<string, React.ElementType> = {
    'Online Payment': Smartphone,
    'Bank Transfer': Building2,
    'Demand Draft': FileText,
    'Cash': Banknote,
};

const categoryIcons: Record<string, React.ElementType> = {
    'officers': Users,
    'jco': Users,
    'or': Users,
    'civilian': GraduationCap,
};

const toNumber = (value: unknown): number => {
    if (value === null || value === undefined) return 0;
    const num = Number(value);
    return isNaN(num) ? 0 : num;
};

const formatCurrency = (amount: number | string | null | undefined): string => {
    const num = toNumber(amount);
    if (num === 0) return '—';
    return `₹${num.toLocaleString('en-IN')}`;
};

export default function FeeStructure({ feeStructures, feeTypes = [], academicYear, paymentModes, discounts }: Props) {
    // Handle empty or old format data
    const categories = feeStructures && typeof feeStructures === 'object' 
        ? Object.keys(feeStructures) 
        : [];

    // Filter custom fee types by type
    const oneTimeFeeTypes = feeTypes.filter(ft => ft.type === 'one_time');
    const recurringFeeTypes = feeTypes.filter(ft => ft.type === 'recurring');

    // If no data or old format, show fallback
    if (categories.length === 0 || !feeStructures[categories[0]]?.items) {
        return (
            <PublicLayout title="Fee Structure - APS Alwar">
                <section className="relative bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-950 py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <Badge className="mb-4 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                Transparent & Affordable
                            </Badge>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                                Fee Structure
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300">
                                Fee structure information is being updated. Please contact the school office for current fee details.
                            </p>
                        </div>
                    </div>
                </section>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout title="Fee Structure - APS Alwar">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-950 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="mb-4 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            Transparent & Affordable
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Fee Structure
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Quality education at reasonable fees. As a non-profit AWES school, 
                            we strive to make education accessible.
                        </p>
                        <Badge variant="outline" className="mt-4">
                            Academic Year {academicYear}-{(academicYear % 100) + 1}
                        </Badge>
                    </div>
                </div>
            </section>

            {/* Fee Tables by Category */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <Tabs defaultValue={categories[0]} className="max-w-6xl mx-auto">
                        <TabsList className="grid w-full mb-8" style={{ gridTemplateColumns: `repeat(${categories.length}, 1fr)` }}>
                            {categories.map((category) => {
                                const Icon = categoryIcons[category] || Users;
                                return (
                                    <TabsTrigger key={category} value={category} className="flex items-center gap-2">
                                        <Icon className="h-4 w-4" />
                                        <span className="hidden sm:inline">{feeStructures[category].label}</span>
                                        <span className="sm:hidden">{feeStructures[category].label.split(' ')[0]}</span>
                                    </TabsTrigger>
                                );
                            })}
                        </TabsList>

                        {categories.map((category) => {
                            const categoryData = feeStructures[category];
                            const items = categoryData.items || [];
                            
                            return (
                                <TabsContent key={category} value={category} className="mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <IndianRupee className="h-5 w-5 text-green-600" />
                                                Fee Structure - {categoryData.label}
                                            </CardTitle>
                                            <CardDescription>
                                                Academic Year {academicYear}-{(academicYear % 100) + 1}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {/* One-Time Fees Table */}
                                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                                <Badge variant="outline" className="bg-blue-50 text-blue-700">One-Time</Badge>
                                                Registration & Admission Fees
                                            </h3>
                                            <div className="overflow-x-auto mb-8">
                                                <table className="w-full text-sm">
                                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                                        <tr>
                                                            <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                                                                Class
                                                            </th>
                                                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                                                                Registration
                                                            </th>
                                                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                                                                Admission
                                                            </th>
                                                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                                                                Security Deposit
                                                            </th>
                                                            {/* Custom One-Time Fee Types */}
                                                            {oneTimeFeeTypes.map((ft) => (
                                                                <th key={ft.id} className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white" title={ft.description || undefined}>
                                                                    {ft.name}
                                                                </th>
                                                            ))}
                                                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                                                                Total One-Time
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                                        {items.map((fee) => {
                                                            // Calculate custom one-time fees total
                                                            const customOneTimeTotal = oneTimeFeeTypes.reduce((sum, ft) => {
                                                                return sum + toNumber(fee.other_fees?.[ft.key]);
                                                            }, 0);
                                                            
                                                            return (
                                                                <tr key={fee.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                                    <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">
                                                                        {fee.class_range_label}
                                                                    </td>
                                                                    <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">
                                                                        {formatCurrency(fee.registration_fee)}
                                                                    </td>
                                                                    <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">
                                                                        {formatCurrency(fee.admission_fee)}
                                                                    </td>
                                                                    <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">
                                                                        {formatCurrency(fee.security_deposit)}
                                                                        <span className="text-xs text-green-600 ml-1">(Refundable)</span>
                                                                    </td>
                                                                    {/* Custom One-Time Fee Values */}
                                                                    {oneTimeFeeTypes.map((ft) => (
                                                                        <td key={ft.id} className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">
                                                                            {formatCurrency(fee.other_fees?.[ft.key])}
                                                                        </td>
                                                                    ))}
                                                                    <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                                                                        {formatCurrency(
                                                                            toNumber(fee.registration_fee) + 
                                                                            toNumber(fee.admission_fee) + 
                                                                            toNumber(fee.security_deposit) +
                                                                            customOneTimeTotal
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Recurring Fees Table */}
                                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                                <Badge variant="outline" className="bg-amber-50 text-amber-700">Recurring</Badge>
                                                Monthly & Annual Fees
                                            </h3>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                                        <tr>
                                                            <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                                                                Class
                                                            </th>
                                                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                                                                Tuition Fee
                                                                <span className="block text-xs font-normal text-gray-500">/month</span>
                                                            </th>
                                                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                                                                Computer Fee
                                                                <span className="block text-xs font-normal text-gray-500">/month</span>
                                                            </th>
                                                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                                                                Science Fee
                                                                <span className="block text-xs font-normal text-gray-500">/month</span>
                                                            </th>
                                                            {/* Custom Recurring Fee Types */}
                                                            {recurringFeeTypes.map((ft) => (
                                                                <th key={ft.id} className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white" title={ft.description || undefined}>
                                                                    {ft.name}
                                                                    <span className="block text-xs font-normal text-gray-500">/month</span>
                                                                </th>
                                                            ))}
                                                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                                                                Annual Charges
                                                                <span className="block text-xs font-normal text-gray-500">/year</span>
                                                            </th>
                                                            <th className="px-4 py-3 text-right font-semibold text-green-700 dark:text-green-400">
                                                                Est. Annual Total
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                                        {items.map((fee) => {
                                                            // Calculate custom recurring fees
                                                            const customRecurringMonthly = recurringFeeTypes.reduce((sum, ft) => {
                                                                return sum + toNumber(fee.other_fees?.[ft.key]);
                                                            }, 0);
                                                            
                                                            const monthlyTotal = toNumber(fee.tuition_fee) + toNumber(fee.computer_fee) + toNumber(fee.science_fee) + customRecurringMonthly;
                                                            const annualTotal = (monthlyTotal * 12) + toNumber(fee.annual_fee);
                                                            
                                                            return (
                                                                <tr key={fee.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                                    <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">
                                                                        {fee.class_range_label}
                                                                    </td>
                                                                    <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">
                                                                        {formatCurrency(fee.tuition_fee)}
                                                                    </td>
                                                                    <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">
                                                                        {formatCurrency(fee.computer_fee)}
                                                                    </td>
                                                                    <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">
                                                                        {formatCurrency(fee.science_fee)}
                                                                    </td>
                                                                    {/* Custom Recurring Fee Values */}
                                                                    {recurringFeeTypes.map((ft) => (
                                                                        <td key={ft.id} className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">
                                                                            {formatCurrency(fee.other_fees?.[ft.key])}
                                                                        </td>
                                                                    ))}
                                                                    <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">
                                                                        {formatCurrency(fee.annual_fee)}
                                                                    </td>
                                                                    <td className="px-4 py-3 text-right font-bold text-green-700 dark:text-green-400">
                                                                        {formatCurrency(annualTotal)}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Monthly Summary for First Class Range */}
                                            {items.length > 0 && (
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                                    <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
                                                        <CardContent className="p-4 text-center">
                                                            <Calendar className="h-5 w-5 text-blue-600 mx-auto mb-2" />
                                                            <div className="text-lg font-bold text-blue-700 dark:text-blue-400">
                                                                {formatCurrency(items[0].tuition_fee)}
                                                            </div>
                                                            <div className="text-xs text-blue-600">Tuition (Nursery-UKG)</div>
                                                        </CardContent>
                                                    </Card>
                                                    <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200">
                                                        <CardContent className="p-4 text-center">
                                                            <Smartphone className="h-5 w-5 text-purple-600 mx-auto mb-2" />
                                                            <div className="text-lg font-bold text-purple-700 dark:text-purple-400">
                                                                {formatCurrency(items[0].computer_fee)}
                                                            </div>
                                                            <div className="text-xs text-purple-600">Computer Fee/month</div>
                                                        </CardContent>
                                                    </Card>
                                                    <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200">
                                                        <CardContent className="p-4 text-center">
                                                            <IndianRupee className="h-5 w-5 text-amber-600 mx-auto mb-2" />
                                                            <div className="text-lg font-bold text-amber-700 dark:text-amber-400">
                                                                {formatCurrency(items[0].annual_fee)}
                                                            </div>
                                                            <div className="text-xs text-amber-600">Annual Charges</div>
                                                        </CardContent>
                                                    </Card>
                                                    <Card className="bg-green-50 dark:bg-green-900/20 border-green-200">
                                                        <CardContent className="p-4 text-center">
                                                            <CheckCircle className="h-5 w-5 text-green-600 mx-auto mb-2" />
                                                            <div className="text-lg font-bold text-green-700 dark:text-green-400">
                                                                {formatCurrency(items[0].security_deposit)}
                                                            </div>
                                                            <div className="text-xs text-green-600">Refundable Deposit</div>
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            );
                        })}
                    </Tabs>

                    <div className="max-w-6xl mx-auto mt-6">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div className="flex items-start gap-3">
                                <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                    <strong>Note:</strong> Fee categories are based on parent's service status. OR = Other Ranks, JCO = Junior Commissioned Officers. 
                                    Fees are subject to revision. Contact school office for latest fee details.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Payment Modes */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-purple-100 text-purple-800">Convenient Options</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Payment Modes
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                        {paymentModes.map((mode, index) => {
                            const Icon = paymentIcons[mode.mode] || CreditCard;
                            return (
                                <Card key={index} className={mode.recommended ? 'border-green-500 ring-2 ring-green-200' : ''}>
                                    {mode.recommended && (
                                        <div className="px-3 py-1 bg-green-500 text-white text-xs font-medium text-center">
                                            Recommended
                                        </div>
                                    )}
                                    <CardHeader className="text-center pb-2">
                                        <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-2">
                                            <Icon className="h-6 w-6 text-amber-600" />
                                        </div>
                                        <CardTitle className="text-lg">{mode.mode}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-center">
                                            {mode.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Discounts & Concessions */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-green-100 text-green-800">Save More</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Discounts & Concessions
                        </h2>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <div className="space-y-4">
                            {discounts.map((discount, index) => (
                                <Card key={index}>
                                    <CardContent className="flex items-center gap-4 p-6">
                                        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                                            <Percent className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                {discount.type}
                                            </h3>
                                            <p className="text-green-600 font-medium">{discount.discount}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {discount.applicable}
                                            </p>
                                        </div>
                                        <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Fee Payment Schedule */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-amber-600" />
                                    Fee Payment Schedule
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">Monthly Payment</div>
                                            <div className="text-sm text-gray-500">By 10th of every month</div>
                                        </div>
                                        <Badge>Most Flexible</Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">Quarterly Payment</div>
                                            <div className="text-sm text-gray-500">April, July, October, January</div>
                                        </div>
                                        <Badge variant="outline">Popular</Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">Annual Payment</div>
                                            <div className="text-sm text-gray-500">By April 30th</div>
                                        </div>
                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                            May get discount
                                        </Badge>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                        <div className="text-sm text-amber-800 dark:text-amber-200">
                                            <strong>Late Fee:</strong> A late fee may be charged for delayed payments. 
                                            Please ensure timely payment to avoid additional charges.
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-amber-600 to-amber-700">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Questions About Fees?
                    </h2>
                    <p className="text-amber-100 mb-8 max-w-2xl mx-auto">
                        Contact our accounts department for detailed fee information or any queries.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button size="lg" variant="secondary" asChild>
                            <Link href="/contact">
                                Contact Us
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                            <Link href="/admissions/faqs">
                                Read FAQs
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
