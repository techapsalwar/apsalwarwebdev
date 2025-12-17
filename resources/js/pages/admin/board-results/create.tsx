import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    ArrowLeft,
    Save,
    Trophy,
    GraduationCap,
    Users,
    Upload,
    X,
    Plus,
    Trash2,
    Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { type BreadcrumbItem } from '@/types';
import { FormEvent, useRef, useState } from 'react';

interface TopperEntry {
    name: string;
    percentage: number | null;
    photo: File | null;
    photoPreview: string | null;
}

export default function CreateBoardResult() {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Board Results', href: '/admin/board-results' },
        { title: 'Add Result', href: '/admin/board-results/create' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        academic_year: new Date().getFullYear().toString(),
        board: 'cbse',
        class: 'X',
        stream: '',
        appeared: '',
        passed: '',
        pass_percentage: '',
        school_average: '',
        highest_marks: '',
        above_90_percent: '',
        above_80_percent: '',
        above_70_percent: '',
        above_60_percent: '',
        api_score: '',
        overall_topper_name: '',
        overall_topper_percentage: '',
        overall_topper_photo: null as File | null,
        overall_topper_stream: '',
        is_published: false,
    });

    const [overallTopperPreview, setOverallTopperPreview] = useState<string | null>(null);
    const overallTopperInputRef = useRef<HTMLInputElement>(null);

    // Class X Toppers (5 students)
    const [classXToppers, setClassXToppers] = useState<TopperEntry[]>([]);
    
    // Class XII Stream Toppers (1 per stream)
    const [scienceToppers, setScienceToppers] = useState<TopperEntry[]>([]);
    const [commerceToppers, setCommerceToppers] = useState<TopperEntry[]>([]);
    const [humanitiesToppers, setHumanitiesToppers] = useState<TopperEntry[]>([]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        
        // Basic fields
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== '') {
                if (key === 'overall_topper_photo' && value instanceof File) {
                    formData.append(key, value);
                } else if (typeof value === 'boolean') {
                    formData.append(key, value ? '1' : '0');
                } else {
                    formData.append(key, String(value));
                }
            }
        });

        // Add Class X toppers
        classXToppers.forEach((topper, index) => {
            formData.append(`class_x_toppers[${index}][name]`, topper.name);
            formData.append(`class_x_toppers[${index}][percentage]`, String(topper.percentage || ''));
            if (topper.photo) {
                formData.append(`class_x_toppers[${index}][photo]`, topper.photo);
            }
        });

        // Add stream toppers
        const addStreamToppers = (toppers: TopperEntry[], streamKey: string) => {
            toppers.forEach((topper, index) => {
                formData.append(`${streamKey}[${index}][name]`, topper.name);
                formData.append(`${streamKey}[${index}][percentage]`, String(topper.percentage || ''));
                if (topper.photo) {
                    formData.append(`${streamKey}[${index}][photo]`, topper.photo);
                }
            });
        };

        addStreamToppers(scienceToppers, 'science_toppers');
        addStreamToppers(commerceToppers, 'commerce_toppers');
        addStreamToppers(humanitiesToppers, 'humanities_toppers');

        post('/admin/board-results', {
            data: formData,
            forceFormData: true,
        });
    };

    const handleOverallTopperPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('overall_topper_photo', file);
            setOverallTopperPreview(URL.createObjectURL(file));
        }
    };

    const removeOverallTopperPhoto = () => {
        setData('overall_topper_photo', null);
        setOverallTopperPreview(null);
        if (overallTopperInputRef.current) {
            overallTopperInputRef.current.value = '';
        }
    };

    const addTopper = (
        setToppers: React.Dispatch<React.SetStateAction<TopperEntry[]>>, 
        maxCount: number,
        currentToppers: TopperEntry[]
    ) => {
        if (currentToppers.length < maxCount) {
            setToppers([...currentToppers, { name: '', percentage: null, photo: null, photoPreview: null }]);
        }
    };

    const removeTopper = (
        setToppers: React.Dispatch<React.SetStateAction<TopperEntry[]>>,
        toppers: TopperEntry[],
        index: number
    ) => {
        const newToppers = toppers.filter((_, i) => i !== index);
        setToppers(newToppers);
    };

    const updateTopper = (
        setToppers: React.Dispatch<React.SetStateAction<TopperEntry[]>>,
        toppers: TopperEntry[],
        index: number,
        field: keyof TopperEntry,
        value: string | number | File | null
    ) => {
        const newToppers = [...toppers];
        if (field === 'photo' && value instanceof File) {
            newToppers[index] = {
                ...newToppers[index],
                photo: value,
                photoPreview: URL.createObjectURL(value),
            };
        } else {
            newToppers[index] = { ...newToppers[index], [field]: value };
        }
        setToppers(newToppers);
    };

    const calculatePassPercentage = () => {
        const appeared = parseInt(data.appeared) || 0;
        const passed = parseInt(data.passed) || 0;
        if (appeared > 0) {
            const percentage = ((passed / appeared) * 100).toFixed(2);
            setData('pass_percentage', percentage);
        }
    };

    const TopperCard = ({
        topper,
        index,
        onUpdate,
        onRemove,
        streamLabel,
    }: {
        topper: TopperEntry;
        index: number;
        onUpdate: (field: keyof TopperEntry, value: string | number | File | null) => void;
        onRemove: () => void;
        streamLabel?: string;
    }) => (
        <Card className="relative">
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 text-red-500"
                onClick={onRemove}
            >
                <X className="h-4 w-4" />
            </Button>
            <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                    {/* Photo Upload */}
                    <div className="flex-shrink-0">
                        <div className="relative">
                            {topper.photoPreview ? (
                                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-amber-200">
                                    <img
                                        src={topper.photoPreview}
                                        alt={topper.name || 'Topper'}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                                    <GraduationCap className="h-8 w-8 text-gray-400" />
                                </div>
                            )}
                            <label className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-1.5 cursor-pointer hover:bg-amber-600">
                                <Upload className="h-3 w-3 text-white" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) onUpdate('photo', file);
                                    }}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-amber-500" />
                            <span className="text-sm font-medium text-amber-600">
                                {streamLabel ? `${streamLabel} Topper` : `Rank ${index + 1}`}
                            </span>
                        </div>
                        <Input
                            placeholder="Student Name"
                            value={topper.name}
                            onChange={(e) => onUpdate('name', e.target.value)}
                        />
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                max="100"
                                placeholder="Percentage"
                                value={topper.percentage || ''}
                                onChange={(e) => onUpdate('percentage', parseFloat(e.target.value) || null)}
                                className="w-32"
                            />
                            <span className="text-gray-500">%</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Board Result" />
            
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/admin/board-results">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                <Trophy className="h-6 w-6 text-amber-500" />
                                Add Board Result
                            </h1>
                            <p className="text-gray-500">Enter examination results and toppers details</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Switch
                                id="is_published"
                                checked={data.is_published}
                                onCheckedChange={(checked) => setData('is_published', checked)}
                            />
                            <Label htmlFor="is_published">Publish</Label>
                        </div>
                        <Button type="submit" disabled={processing}>
                            <Save className="h-4 w-4 mr-2" />
                            Save Result
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5" />
                                    Basic Information
                                </CardTitle>
                                <CardDescription>Enter the examination details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="academic_year">Academic Year *</Label>
                                        <Input
                                            id="academic_year"
                                            value={data.academic_year}
                                            onChange={(e) => setData('academic_year', e.target.value)}
                                            placeholder="2024"
                                            maxLength={4}
                                        />
                                        {errors.academic_year && (
                                            <p className="text-sm text-red-500">{errors.academic_year}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="board">Board *</Label>
                                        <Select
                                            value={data.board}
                                            onValueChange={(value) => setData('board', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="cbse">CBSE</SelectItem>
                                                <SelectItem value="icse">ICSE</SelectItem>
                                                <SelectItem value="state">State Board</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="class">Class *</Label>
                                        <Select
                                            value={data.class}
                                            onValueChange={(value) => setData('class', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="X">Class X</SelectItem>
                                                <SelectItem value="XII">Class XII</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {data.class === 'XII' && (
                                        <div className="space-y-2">
                                            <Label htmlFor="stream">Stream</Label>
                                            <Select
                                                value={data.stream}
                                                onValueChange={(value) => setData('stream', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select stream" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Science">Science</SelectItem>
                                                    <SelectItem value="Commerce">Commerce</SelectItem>
                                                    <SelectItem value="Humanities">Humanities</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Statistics */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Statistics
                                </CardTitle>
                                <CardDescription>Enter pass/fail statistics</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="appeared">Students Appeared *</Label>
                                        <Input
                                            id="appeared"
                                            type="number"
                                            value={data.appeared}
                                            onChange={(e) => setData('appeared', e.target.value)}
                                            onBlur={calculatePassPercentage}
                                            min="0"
                                        />
                                        {errors.appeared && (
                                            <p className="text-sm text-red-500">{errors.appeared}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="passed">Students Passed *</Label>
                                        <Input
                                            id="passed"
                                            type="number"
                                            value={data.passed}
                                            onChange={(e) => setData('passed', e.target.value)}
                                            onBlur={calculatePassPercentage}
                                            min="0"
                                        />
                                        {errors.passed && (
                                            <p className="text-sm text-red-500">{errors.passed}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="pass_percentage">Pass Percentage *</Label>
                                        <Input
                                            id="pass_percentage"
                                            type="number"
                                            step="0.01"
                                            value={data.pass_percentage}
                                            onChange={(e) => setData('pass_percentage', e.target.value)}
                                            min="0"
                                            max="100"
                                        />
                                        {errors.pass_percentage && (
                                            <p className="text-sm text-red-500">{errors.pass_percentage}</p>
                                        )}
                                    </div>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="above_90_percent">90%+ (Distinction)</Label>
                                        <Input
                                            id="above_90_percent"
                                            type="number"
                                            value={data.above_90_percent}
                                            onChange={(e) => setData('above_90_percent', e.target.value)}
                                            min="0"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="above_80_percent">80%+ (First Div)</Label>
                                        <Input
                                            id="above_80_percent"
                                            type="number"
                                            value={data.above_80_percent}
                                            onChange={(e) => setData('above_80_percent', e.target.value)}
                                            min="0"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="above_70_percent">70%+ (Second Div)</Label>
                                        <Input
                                            id="above_70_percent"
                                            type="number"
                                            value={data.above_70_percent}
                                            onChange={(e) => setData('above_70_percent', e.target.value)}
                                            min="0"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="above_60_percent">60%+ (Third Div)</Label>
                                        <Input
                                            id="above_60_percent"
                                            type="number"
                                            value={data.above_60_percent}
                                            onChange={(e) => setData('above_60_percent', e.target.value)}
                                            min="0"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="school_average">School Average %</Label>
                                        <Input
                                            id="school_average"
                                            type="number"
                                            step="0.01"
                                            value={data.school_average}
                                            onChange={(e) => setData('school_average', e.target.value)}
                                            min="0"
                                            max="100"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="highest_marks">Highest Marks %</Label>
                                        <Input
                                            id="highest_marks"
                                            type="number"
                                            step="0.01"
                                            value={data.highest_marks}
                                            onChange={(e) => setData('highest_marks', e.target.value)}
                                            min="0"
                                            max="100"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="api_score">API Score</Label>
                                        <Input
                                            id="api_score"
                                            type="number"
                                            step="0.01"
                                            value={data.api_score}
                                            onChange={(e) => setData('api_score', e.target.value)}
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Class X Toppers (5 students) */}
                        {data.class === 'X' && (
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="flex items-center gap-2">
                                                <Trophy className="h-5 w-5 text-amber-500" />
                                                Class X Toppers
                                            </CardTitle>
                                            <CardDescription>Add up to 5 top performing students</CardDescription>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => addTopper(setClassXToppers, 5, classXToppers)}
                                            disabled={classXToppers.length >= 5}
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Topper
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {classXToppers.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                                            <Trophy className="h-10 w-10 mx-auto mb-2 opacity-50" />
                                            <p>No toppers added yet</p>
                                            <p className="text-sm">Click "Add Topper" to add top students</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {classXToppers.map((topper, index) => (
                                                <TopperCard
                                                    key={index}
                                                    topper={topper}
                                                    index={index}
                                                    onUpdate={(field, value) => updateTopper(setClassXToppers, classXToppers, index, field, value)}
                                                    onRemove={() => removeTopper(setClassXToppers, classXToppers, index)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Class XII Stream Toppers */}
                        {data.class === 'XII' && (
                            <>
                                {/* Science Toppers */}
                                <Card>
                                    <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                                                    🔬 Science Stream Topper
                                                </CardTitle>
                                                <CardDescription>Add the Science stream topper</CardDescription>
                                            </div>
                                            {scienceToppers.length === 0 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => addTopper(setScienceToppers, 1, scienceToppers)}
                                                >
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Add
                                                </Button>
                                            )}
                                        </div>
                                    </CardHeader>
                                    {scienceToppers.length > 0 && (
                                        <CardContent className="pt-4">
                                            {scienceToppers.map((topper, index) => (
                                                <TopperCard
                                                    key={index}
                                                    topper={topper}
                                                    index={index}
                                                    streamLabel="Science"
                                                    onUpdate={(field, value) => updateTopper(setScienceToppers, scienceToppers, index, field, value)}
                                                    onRemove={() => removeTopper(setScienceToppers, scienceToppers, index)}
                                                />
                                            ))}
                                        </CardContent>
                                    )}
                                </Card>

                                {/* Commerce Toppers */}
                                <Card>
                                    <CardHeader className="bg-green-50 dark:bg-green-900/20">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                                                    📊 Commerce Stream Topper
                                                </CardTitle>
                                                <CardDescription>Add the Commerce stream topper</CardDescription>
                                            </div>
                                            {commerceToppers.length === 0 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => addTopper(setCommerceToppers, 1, commerceToppers)}
                                                >
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Add
                                                </Button>
                                            )}
                                        </div>
                                    </CardHeader>
                                    {commerceToppers.length > 0 && (
                                        <CardContent className="pt-4">
                                            {commerceToppers.map((topper, index) => (
                                                <TopperCard
                                                    key={index}
                                                    topper={topper}
                                                    index={index}
                                                    streamLabel="Commerce"
                                                    onUpdate={(field, value) => updateTopper(setCommerceToppers, commerceToppers, index, field, value)}
                                                    onRemove={() => removeTopper(setCommerceToppers, commerceToppers, index)}
                                                />
                                            ))}
                                        </CardContent>
                                    )}
                                </Card>

                                {/* Humanities Toppers */}
                                <Card>
                                    <CardHeader className="bg-purple-50 dark:bg-purple-900/20">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                                                    📚 Humanities Stream Topper
                                                </CardTitle>
                                                <CardDescription>Add the Humanities stream topper</CardDescription>
                                            </div>
                                            {humanitiesToppers.length === 0 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => addTopper(setHumanitiesToppers, 1, humanitiesToppers)}
                                                >
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Add
                                                </Button>
                                            )}
                                        </div>
                                    </CardHeader>
                                    {humanitiesToppers.length > 0 && (
                                        <CardContent className="pt-4">
                                            {humanitiesToppers.map((topper, index) => (
                                                <TopperCard
                                                    key={index}
                                                    topper={topper}
                                                    index={index}
                                                    streamLabel="Humanities"
                                                    onUpdate={(field, value) => updateTopper(setHumanitiesToppers, humanitiesToppers, index, field, value)}
                                                    onRemove={() => removeTopper(setHumanitiesToppers, humanitiesToppers, index)}
                                                />
                                            ))}
                                        </CardContent>
                                    )}
                                </Card>
                            </>
                        )}
                    </div>

                    {/* Sidebar - Overall Topper */}
                    <div className="space-y-6">
                        <Card className="sticky top-6">
                            <CardHeader className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20">
                                <CardTitle className="flex items-center gap-2">
                                    <Trophy className="h-5 w-5 text-amber-600" />
                                    Overall School Topper
                                </CardTitle>
                                <CardDescription>The highest scoring student</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                {/* Photo Upload */}
                                <div className="flex flex-col items-center">
                                    <div className="relative">
                                        {overallTopperPreview ? (
                                            <div className="relative">
                                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-amber-300 shadow-lg">
                                                    <img
                                                        src={overallTopperPreview}
                                                        alt="Topper"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                                    onClick={removeOverallTopperPhoto}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <label className="w-32 h-32 rounded-full bg-gray-100 border-4 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                                                <Upload className="h-8 w-8 text-gray-400 mb-1" />
                                                <span className="text-xs text-gray-500">Upload Photo</span>
                                                <input
                                                    ref={overallTopperInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleOverallTopperPhotoChange}
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="overall_topper_name">Name</Label>
                                    <Input
                                        id="overall_topper_name"
                                        value={data.overall_topper_name}
                                        onChange={(e) => setData('overall_topper_name', e.target.value)}
                                        placeholder="Student name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="overall_topper_percentage">Percentage</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="overall_topper_percentage"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            max="100"
                                            value={data.overall_topper_percentage}
                                            onChange={(e) => setData('overall_topper_percentage', e.target.value)}
                                            placeholder="98.5"
                                        />
                                        <span className="text-gray-500 font-medium">%</span>
                                    </div>
                                </div>

                                {data.class === 'XII' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="overall_topper_stream">Stream</Label>
                                        <Select
                                            value={data.overall_topper_stream}
                                            onValueChange={(value) => setData('overall_topper_stream', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select stream" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Science">Science</SelectItem>
                                                <SelectItem value="Commerce">Commerce</SelectItem>
                                                <SelectItem value="Humanities">Humanities</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}
