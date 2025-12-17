import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, IndianRupee, Check, X, Columns3, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';

interface FeeType {
    id: number;
    name: string;
    key: string;
    type: 'one_time' | 'recurring';
    description: string | null;
    is_active: boolean;
    sort_order: number;
}

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
    created_at: string;
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    feeStructures: PaginatedData<FeeStructure>;
    feeTypes: FeeType[];
    filters: {
        category?: string;
        class_range?: string;
    };
    categories: Record<string, string>;
    classRanges: Record<string, string>;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

const getCategoryBadge = (category: string, categories: Record<string, string>) => {
    const colors: Record<string, string> = {
        officers: 'bg-blue-100 text-blue-800',
        jco: 'bg-green-100 text-green-800',
        or: 'bg-orange-100 text-orange-800',
        civilian: 'bg-purple-100 text-purple-800',
    };
    return (
        <Badge variant="outline" className={colors[category] || 'bg-gray-100 text-gray-800'}>
            {categories[category] || category}
        </Badge>
    );
};

const defaultNewRow = {
    category: '',
    class_range: '',
    registration_fee: 0,
    admission_fee: 0,
    security_deposit: 0,
    annual_fee: 0,
    tuition_fee: 0,
    computer_fee: 0,
    science_fee: 0,
    other_fees: {} as Record<string, number>,
};

const defaultNewFeeType = {
    name: '',
    type: 'one_time' as 'one_time' | 'recurring',
    description: '',
};

export default function FeeStructuresIndex({ feeStructures, feeTypes, filters, categories, classRanges }: Props) {
    // Inline editing state
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editedData, setEditedData] = useState<Partial<FeeStructure>>({});
    const [saving, setSaving] = useState(false);
    
    // New row state
    const [isAddingRow, setIsAddingRow] = useState(false);
    const [newRowData, setNewRowData] = useState(defaultNewRow);
    
    // Add column dialog state
    const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
    const [newFeeType, setNewFeeType] = useState(defaultNewFeeType);
    const [savingFeeType, setSavingFeeType] = useState(false);
    
    // Manage columns dialog state
    const [isManageColumnsOpen, setIsManageColumnsOpen] = useState(false);

    // Filter active fee types for display
    const activeFeeTypes = feeTypes.filter(ft => ft.is_active);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Fee Structures', href: '/admin/fee-structures' },
    ];

    const handleFilter = (key: string, value: string) => {
        router.get('/admin/fee-structures', { ...filters, [key]: value === 'all' ? undefined : value }, { preserveState: true });
    };

    const handleToggleActive = (id: number) => {
        router.post(`/admin/fee-structures/${id}/toggle-active`, {}, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        router.delete(`/admin/fee-structures/${id}`);
    };

    // Start editing a row
    const handleStartEdit = (fee: FeeStructure) => {
        setEditingId(fee.id);
        setEditedData({
            academic_year: fee.academic_year,
            category: fee.category,
            class_range: fee.class_range,
            registration_fee: fee.registration_fee,
            admission_fee: fee.admission_fee,
            security_deposit: fee.security_deposit,
            annual_fee: fee.annual_fee,
            tuition_fee: fee.tuition_fee,
            computer_fee: fee.computer_fee,
            science_fee: fee.science_fee,
            other_fees: fee.other_fees || {},
        });
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditingId(null);
        setEditedData({});
    };

    // Update edited field
    const handleFieldChange = (field: keyof FeeStructure, value: string) => {
        const numValue = value === '' ? 0 : parseFloat(value);
        setEditedData(prev => ({ ...prev, [field]: isNaN(numValue) ? 0 : numValue }));
    };

    // Update other_fees field
    const handleOtherFeeChange = (key: string, value: string) => {
        const numValue = value === '' ? 0 : parseFloat(value);
        setEditedData(prev => ({
            ...prev,
            other_fees: {
                ...(prev.other_fees || {}),
                [key]: isNaN(numValue) ? 0 : numValue,
            },
        }));
    };

    // Save edited row
    const handleSaveEdit = (id: number) => {
        setSaving(true);
        router.put(`/admin/fee-structures/${id}`, editedData, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setEditingId(null);
                setEditedData({});
            },
            onError: (errors) => {
                console.error('Failed to update fee structure:', errors);
            },
            onFinish: () => setSaving(false),
        });
    };

    // New row handlers
    const handleNewRowFieldChange = (field: string, value: string | number) => {
        if (field === 'category' || field === 'class_range') {
            setNewRowData(prev => ({ ...prev, [field]: value }));
        } else {
            const numValue = value === '' ? 0 : parseFloat(value as string);
            setNewRowData(prev => ({ ...prev, [field]: isNaN(numValue) ? 0 : numValue }));
        }
    };

    const handleNewRowOtherFeeChange = (key: string, value: string) => {
        const numValue = value === '' ? 0 : parseFloat(value);
        setNewRowData(prev => ({
            ...prev,
            other_fees: {
                ...prev.other_fees,
                [key]: isNaN(numValue) ? 0 : numValue,
            },
        }));
    };

    const handleAddRow = () => {
        setIsAddingRow(true);
        setNewRowData(defaultNewRow);
    };

    const handleCancelNewRow = () => {
        setIsAddingRow(false);
        setNewRowData(defaultNewRow);
    };

    const handleSaveNewRow = () => {
        if (!newRowData.category || !newRowData.class_range) {
            alert('Please select Category and Class Range');
            return;
        }
        setSaving(true);
        router.post('/admin/fee-structures', {
            ...newRowData,
            academic_year: new Date().getFullYear(), // Current year as default
            is_active: true,
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsAddingRow(false);
                setNewRowData(defaultNewRow);
            },
            onError: (errors) => {
                console.error('Failed to create fee structure:', errors);
            },
            onFinish: () => setSaving(false),
        });
    };

    // Fee Type (Column) handlers
    const handleAddFeeType = () => {
        if (!newFeeType.name.trim()) {
            alert('Please enter a fee name');
            return;
        }
        setSavingFeeType(true);
        router.post('/admin/fee-types', newFeeType, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsAddColumnOpen(false);
                setNewFeeType(defaultNewFeeType);
            },
            onError: (errors) => {
                console.error('Failed to create fee type:', errors);
            },
            onFinish: () => setSavingFeeType(false),
        });
    };

    const handleToggleFeeTypeActive = (id: number) => {
        router.post(`/admin/fee-types/${id}/toggle-active`, {}, { preserveState: true, preserveScroll: true });
    };

    const handleDeleteFeeType = (id: number) => {
        router.delete(`/admin/fee-types/${id}`, { preserveState: true, preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Fee Structure Management" />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <IndianRupee className="h-6 w-6" />
                            Fee Structure
                        </h1>
                        <p className="text-gray-500">Manage fee structures for different categories and classes</p>
                    </div>
                    <div className="flex gap-2">
                        {/* Manage Columns Dialog */}
                        <Dialog open={isManageColumnsOpen} onOpenChange={setIsManageColumnsOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    <Columns3 className="h-4 w-4 mr-2" />
                                    Manage Columns
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Manage Fee Columns</DialogTitle>
                                    <DialogDescription>
                                        Toggle visibility or delete custom fee columns.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-3 max-h-[400px] overflow-y-auto py-4">
                                    {feeTypes.length === 0 ? (
                                        <p className="text-gray-500 text-center py-4">No custom columns added yet</p>
                                    ) : (
                                        feeTypes.map((ft) => (
                                            <div key={ft.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">{ft.name}</span>
                                                        <Badge variant={ft.type === 'recurring' ? 'default' : 'secondary'} className="text-xs">
                                                            {ft.type === 'recurring' ? 'Monthly' : 'One-time'}
                                                        </Badge>
                                                    </div>
                                                    {ft.description && (
                                                        <p className="text-sm text-gray-500 mt-1">{ft.description}</p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 ml-4">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className={ft.is_active ? 'text-green-600' : 'text-gray-400'}
                                                        onClick={() => handleToggleFeeTypeActive(ft.id)}
                                                        title={ft.is_active ? 'Hide column' : 'Show column'}
                                                    >
                                                        {ft.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button size="icon" variant="ghost" className="text-red-600 hover:text-red-700">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Delete "{ft.name}" Column?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This will permanently delete this fee column and remove all associated fee values from existing fee structures.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDeleteFeeType(ft.id)}
                                                                    className="bg-red-600 hover:bg-red-700"
                                                                >
                                                                    Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>

                        {/* Add Column Dialog */}
                        <Dialog open={isAddColumnOpen} onOpenChange={setIsAddColumnOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    <Columns3 className="h-4 w-4 mr-2" />
                                    Add Column
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Fee Column</DialogTitle>
                                    <DialogDescription>
                                        Create a new fee type column. Choose whether it's a one-time fee or a recurring monthly fee.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="fee-name">Fee Name *</Label>
                                        <Input
                                            id="fee-name"
                                            placeholder="e.g., Transport Fee, Lab Fee"
                                            value={newFeeType.name}
                                            onChange={(e) => setNewFeeType(prev => ({ ...prev, name: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Fee Type *</Label>
                                        <RadioGroup
                                            value={newFeeType.type}
                                            onValueChange={(value: 'one_time' | 'recurring') => setNewFeeType(prev => ({ ...prev, type: value }))}
                                            className="flex gap-4"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="one_time" id="one_time" />
                                                <Label htmlFor="one_time" className="font-normal cursor-pointer">
                                                    One-time (paid once per year)
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="recurring" id="recurring" />
                                                <Label htmlFor="recurring" className="font-normal cursor-pointer">
                                                    Recurring (monthly fee)
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="fee-desc">Description (optional)</Label>
                                        <Textarea
                                            id="fee-desc"
                                            placeholder="Brief description of this fee"
                                            value={newFeeType.description}
                                            onChange={(e) => setNewFeeType(prev => ({ ...prev, description: e.target.value }))}
                                            rows={2}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsAddColumnOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleAddFeeType} disabled={savingFeeType || !newFeeType.name.trim()}>
                                        {savingFeeType ? 'Adding...' : 'Add Column'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Button onClick={handleAddRow} disabled={isAddingRow || editingId !== null}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Row
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <Select 
                                value={filters.category || 'all'} 
                                onValueChange={(value) => handleFilter('category', value)}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {Object.entries(categories).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select 
                                value={filters.class_range || 'all'} 
                                onValueChange={(value) => handleFilter('class_range', value)}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Class Range" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Classes</SelectItem>
                                    {Object.entries(classRanges).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Fee Structures Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Fee Structures ({feeStructures.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Class</TableHead>
                                        <TableHead className="text-right">Registration</TableHead>
                                        <TableHead className="text-right">Admission</TableHead>
                                        <TableHead className="text-right">Security</TableHead>
                                        <TableHead className="text-right">Annual</TableHead>
                                        <TableHead className="text-right">Tuition/mo</TableHead>
                                        <TableHead className="text-right">Computer/mo</TableHead>
                                        <TableHead className="text-right">Science/mo</TableHead>
                                        {/* Dynamic columns from feeTypes */}
                                        {activeFeeTypes.map((ft) => (
                                            <TableHead key={ft.id} className="text-right">
                                                <span title={ft.description || ft.name}>
                                                    {ft.name}
                                                    {ft.type === 'recurring' && '/mo'}
                                                </span>
                                            </TableHead>
                                        ))}
                                        <TableHead>Active</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {/* New Row Input */}
                                    {isAddingRow && (
                                        <TableRow className="bg-green-50">
                                            <TableCell>
                                                <Select 
                                                    value={newRowData.category} 
                                                    onValueChange={(value) => handleNewRowFieldChange('category', value)}
                                                >
                                                    <SelectTrigger className="w-[130px] h-8">
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.entries(categories).map(([key, label]) => (
                                                            <SelectItem key={key} value={key}>{label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <Select 
                                                    value={newRowData.class_range} 
                                                    onValueChange={(value) => handleNewRowFieldChange('class_range', value)}
                                                >
                                                    <SelectTrigger className="w-[120px] h-8">
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.entries(classRanges).map(([key, label]) => (
                                                            <SelectItem key={key} value={key}>{label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={newRowData.registration_fee}
                                                    onChange={(e) => handleNewRowFieldChange('registration_fee', e.target.value)}
                                                    className="w-20 text-right h-8"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={newRowData.admission_fee}
                                                    onChange={(e) => handleNewRowFieldChange('admission_fee', e.target.value)}
                                                    className="w-20 text-right h-8"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={newRowData.security_deposit}
                                                    onChange={(e) => handleNewRowFieldChange('security_deposit', e.target.value)}
                                                    className="w-20 text-right h-8"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={newRowData.annual_fee}
                                                    onChange={(e) => handleNewRowFieldChange('annual_fee', e.target.value)}
                                                    className="w-20 text-right h-8"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={newRowData.tuition_fee}
                                                    onChange={(e) => handleNewRowFieldChange('tuition_fee', e.target.value)}
                                                    className="w-20 text-right h-8"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={newRowData.computer_fee}
                                                    onChange={(e) => handleNewRowFieldChange('computer_fee', e.target.value)}
                                                    className="w-20 text-right h-8"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={newRowData.science_fee}
                                                    onChange={(e) => handleNewRowFieldChange('science_fee', e.target.value)}
                                                    className="w-20 text-right h-8"
                                                />
                                            </TableCell>
                                            {/* Dynamic columns for new row */}
                                            {activeFeeTypes.map((ft) => (
                                                <TableCell key={ft.id}>
                                                    <Input
                                                        type="number"
                                                        value={newRowData.other_fees[ft.key] || 0}
                                                        onChange={(e) => handleNewRowOtherFeeChange(ft.key, e.target.value)}
                                                        className="w-20 text-right h-8"
                                                    />
                                                </TableCell>
                                            ))}
                                            <TableCell>-</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-1 justify-end">
                                                    <Button 
                                                        size="icon" 
                                                        variant="ghost" 
                                                        className="text-green-600 hover:text-green-700 hover:bg-green-100"
                                                        onClick={handleSaveNewRow}
                                                        disabled={saving}
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                    <Button 
                                                        size="icon" 
                                                        variant="ghost" 
                                                        className="text-gray-600 hover:text-gray-700"
                                                        onClick={handleCancelNewRow}
                                                        disabled={saving}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    
                                    {feeStructures.data.length === 0 && !isAddingRow ? (
                                        <TableRow>
                                            <TableCell colSpan={11 + activeFeeTypes.length} className="text-center py-8">
                                                <p className="text-gray-500">No fee structures found</p>
                                                <Button variant="link" className="mt-2" onClick={handleAddRow}>
                                                    Add your first fee structure
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        feeStructures.data.map((fee) => {
                                            const isEditing = editingId === fee.id;
                                            return (
                                            <TableRow key={fee.id} className={isEditing ? 'bg-blue-50' : ''}>
                                                <TableCell>
                                                    {isEditing ? (
                                                        <Select 
                                                            value={editedData.category as string} 
                                                            onValueChange={(value) => setEditedData(prev => ({ ...prev, category: value }))}
                                                        >
                                                            <SelectTrigger className="w-[130px] h-8">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {Object.entries(categories).map(([key, label]) => (
                                                                    <SelectItem key={key} value={key}>{label}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    ) : (
                                                        getCategoryBadge(fee.category, categories)
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {isEditing ? (
                                                        <Select 
                                                            value={editedData.class_range as string} 
                                                            onValueChange={(value) => setEditedData(prev => ({ ...prev, class_range: value }))}
                                                        >
                                                            <SelectTrigger className="w-[120px] h-8">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {Object.entries(classRanges).map(([key, label]) => (
                                                                    <SelectItem key={key} value={key}>{label}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    ) : (
                                                        classRanges[fee.class_range] || fee.class_range
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {isEditing ? (
                                                        <Input
                                                            type="number"
                                                            value={editedData.registration_fee ?? 0}
                                                            onChange={(e) => handleFieldChange('registration_fee', e.target.value)}
                                                            className="w-20 text-right h-8"
                                                        />
                                                    ) : (
                                                        formatCurrency(fee.registration_fee)
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {isEditing ? (
                                                        <Input
                                                            type="number"
                                                            value={editedData.admission_fee ?? 0}
                                                            onChange={(e) => handleFieldChange('admission_fee', e.target.value)}
                                                            className="w-20 text-right h-8"
                                                        />
                                                    ) : (
                                                        formatCurrency(fee.admission_fee)
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {isEditing ? (
                                                        <Input
                                                            type="number"
                                                            value={editedData.security_deposit ?? 0}
                                                            onChange={(e) => handleFieldChange('security_deposit', e.target.value)}
                                                            className="w-20 text-right h-8"
                                                        />
                                                    ) : (
                                                        formatCurrency(fee.security_deposit)
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {isEditing ? (
                                                        <Input
                                                            type="number"
                                                            value={editedData.annual_fee ?? 0}
                                                            onChange={(e) => handleFieldChange('annual_fee', e.target.value)}
                                                            className="w-20 text-right h-8"
                                                        />
                                                    ) : (
                                                        formatCurrency(fee.annual_fee)
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {isEditing ? (
                                                        <Input
                                                            type="number"
                                                            value={editedData.tuition_fee ?? 0}
                                                            onChange={(e) => handleFieldChange('tuition_fee', e.target.value)}
                                                            className="w-20 text-right h-8"
                                                        />
                                                    ) : (
                                                        formatCurrency(fee.tuition_fee)
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {isEditing ? (
                                                        <Input
                                                            type="number"
                                                            value={editedData.computer_fee ?? 0}
                                                            onChange={(e) => handleFieldChange('computer_fee', e.target.value)}
                                                            className="w-20 text-right h-8"
                                                        />
                                                    ) : (
                                                        formatCurrency(fee.computer_fee)
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {isEditing ? (
                                                        <Input
                                                            type="number"
                                                            value={editedData.science_fee ?? 0}
                                                            onChange={(e) => handleFieldChange('science_fee', e.target.value)}
                                                            className="w-20 text-right h-8"
                                                        />
                                                    ) : (
                                                        formatCurrency(fee.science_fee)
                                                    )}
                                                </TableCell>
                                                {/* Dynamic columns for existing rows */}
                                                {activeFeeTypes.map((ft) => (
                                                    <TableCell key={ft.id} className="text-right">
                                                        {isEditing ? (
                                                            <Input
                                                                type="number"
                                                                value={(editedData.other_fees as Record<string, number>)?.[ft.key] ?? 0}
                                                                onChange={(e) => handleOtherFeeChange(ft.key, e.target.value)}
                                                                className="w-20 text-right h-8"
                                                            />
                                                        ) : (
                                                            formatCurrency((fee.other_fees?.[ft.key] as number) || 0)
                                                        )}
                                                    </TableCell>
                                                ))}
                                                <TableCell>
                                                    <Switch
                                                        checked={fee.is_active}
                                                        onCheckedChange={() => handleToggleActive(fee.id)}
                                                        disabled={isEditing}
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex gap-1 justify-end">
                                                        {isEditing ? (
                                                            <>
                                                                <Button 
                                                                    size="icon" 
                                                                    variant="ghost" 
                                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                                    onClick={() => handleSaveEdit(fee.id)}
                                                                    disabled={saving}
                                                                >
                                                                    <Check className="h-4 w-4" />
                                                                </Button>
                                                                <Button 
                                                                    size="icon" 
                                                                    variant="ghost" 
                                                                    className="text-gray-600 hover:text-gray-700"
                                                                    onClick={handleCancelEdit}
                                                                    disabled={saving}
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Button 
                                                                    size="icon" 
                                                                    variant="ghost"
                                                                    onClick={() => handleStartEdit(fee)}
                                                                    disabled={editingId !== null || isAddingRow}
                                                                >
                                                                    <Pencil className="h-4 w-4" />
                                                                </Button>
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger asChild>
                                                                        <Button size="icon" variant="ghost" className="text-red-600 hover:text-red-700" disabled={editingId !== null || isAddingRow}>
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent>
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle>Delete Fee Structure?</AlertDialogTitle>
                                                                            <AlertDialogDescription>
                                                                                This will permanently delete the fee structure for {categories[fee.category]} - {classRanges[fee.class_range]}.
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                            <AlertDialogAction
                                                                                onClick={() => handleDelete(fee.id)}
                                                                                className="bg-red-600 hover:bg-red-700"
                                                                            >
                                                                                Delete
                                                                            </AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>
                                                            </>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {feeStructures.last_page > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-6">
                                {feeStructures.links.map((link, index) => (
                                    <Button
                                        key={index}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
