'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { mockBooks } from '@/mock/books';
import { ArrowLeft, Save, X, BookOpen } from 'lucide-react';
import { BOOK_CATEGORIES, BOOK_LANGUAGES } from '@/constants';

interface BookForm {
    title: string;
    isbn: string;
    author: string;
    publisher: string;
    publishYear: number;
    category: string;
    totalCopies: number;
    description: string;
    location: string;
    language: string;
    pages: number;
}

interface BookFormErrors {
    title?: string;
    isbn?: string;
    author?: string;
    publisher?: string;
    publishYear?: string;
    category?: string;
    totalCopies?: string;
    location?: string;
    pages?: string;
}

export default function AddBookPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<BookForm>({
        title: '',
        isbn: '',
        author: '',
        publisher: '',
        publishYear: new Date().getFullYear(),
        category: '',
        totalCopies: 1,
        description: '',
        location: '',
        language: 'ไทย',
        pages: 0,
    });
    const [errors, setErrors] = useState<BookFormErrors>({});

    const categories = BOOK_CATEGORIES;

    const languages = BOOK_LANGUAGES;

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'publishYear' || name === 'totalCopies' || name === 'pages'
                ? Number(value) || 0
                : value,
        }));

        // Clear error when user starts typing
        if (errors[name as keyof BookFormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: BookFormErrors = {};

        if (!formData.title.trim()) newErrors.title = 'กรุณากรอกชื่อหนังสือ';
        if (!formData.isbn.trim()) newErrors.isbn = 'กรุณากรอก ISBN';
        if (!formData.author.trim()) newErrors.author = 'กรุณากรอกชื่อผู้แต่ง';
        if (!formData.publisher.trim()) newErrors.publisher = 'กรุณากรอกสำนักพิมพ์';
        if (!formData.category) newErrors.category = 'กรุณาเลือกหมวดหมู่';
        if (!formData.location.trim()) newErrors.location = 'กรุณากรอกตำแหน่งที่เก็บ';

        if (formData.publishYear < 1900 || formData.publishYear > new Date().getFullYear() + 5) {
            newErrors.publishYear = 'ปีที่พิมพ์ไม่ถูกต้อง';
        }

        if (formData.totalCopies < 1) {
            newErrors.totalCopies = 'จำนวนเล่มต้องมากกว่า 0';
        }

        if (formData.pages < 0) {
            newErrors.pages = 'จำนวนหน้าต้องไม่ติดลบ';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const generateBookId = (): string => {
        const maxId = Math.max(...mockBooks.map(book => parseInt(book.id)));
        return (maxId + 1).toString();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Create copies array
            const copies = Array.from({ length: formData.totalCopies }, (_, index) => ({
                copyId: `${generateBookId()}-${String(index + 1).padStart(3, '0')}`,
                status: 'available' as const,
            }));

            // Create new book object matching the Book interface
            const newBook = {
                id: generateBookId(),
                title: formData.title,
                author: formData.author,
                isbn: formData.isbn,
                publisher: formData.publisher,
                publishYear: formData.publishYear,
                category: formData.category,
                totalCopies: formData.totalCopies,
                copies: copies,
                description: formData.description,
            };

            // Add to mock data (in real app, this would be an API call)
            mockBooks.push(newBook);

            alert('เพิ่มหนังสือสำเร็จ!');
            router.push('/books');
        } catch (error) {
            console.error('Error adding book:', error);
            alert('เกิดข้อผิดพลาดในการเพิ่มหนังสือ');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.push('/books');
    };

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={handleCancel}
                            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            กลับไปรายการหนังสือ
                        </button>

                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">เพิ่มหนังสือใหม่</h1>
                                <p className="text-gray-600">กรอกข้อมูลหนังสือที่ต้องการเพิ่มเข้าสู่ระบบ</p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <form onSubmit={handleSubmit} className="p-6 space-y-8">
                            {/* Basic Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                    ข้อมูลพื้นฐาน
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Title */}
                                    <div className="md:col-span-2">
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                            ชื่อหนังสือ *
                                        </label>
                                        <input
                                            id="title"
                                            name="title"
                                            type="text"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                                }`}
                                            placeholder="กรอกชื่อหนังสือ"
                                        />
                                        {errors.title && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                                <X className="w-4 h-4 mr-1" />
                                                {errors.title}
                                            </p>
                                        )}
                                    </div>

                                    {/* ISBN */}
                                    <div>
                                        <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-2">
                                            ISBN *
                                        </label>
                                        <input
                                            id="isbn"
                                            name="isbn"
                                            type="text"
                                            value={formData.isbn}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.isbn ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                                }`}
                                            placeholder="978-616-558-123-4"
                                        />
                                        {errors.isbn && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                                <X className="w-4 h-4 mr-1" />
                                                {errors.isbn}
                                            </p>
                                        )}
                                    </div>

                                    {/* Author */}
                                    <div>
                                        <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                                            ผู้แต่ง *
                                        </label>
                                        <input
                                            id="author"
                                            name="author"
                                            type="text"
                                            value={formData.author}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.author ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                                }`}
                                            placeholder="กรอกชื่อผู้แต่ง"
                                        />
                                        {errors.author && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                                <X className="w-4 h-4 mr-1" />
                                                {errors.author}
                                            </p>
                                        )}
                                    </div>

                                    {/* Publisher */}
                                    <div>
                                        <label htmlFor="publisher" className="block text-sm font-medium text-gray-700 mb-2">
                                            สำนักพิมพ์ *
                                        </label>
                                        <input
                                            id="publisher"
                                            name="publisher"
                                            type="text"
                                            value={formData.publisher}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.publisher ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                                }`}
                                            placeholder="กรอกสำนักพิมพ์"
                                        />
                                        {errors.publisher && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                                <X className="w-4 h-4 mr-1" />
                                                {errors.publisher}
                                            </p>
                                        )}
                                    </div>

                                    {/* Publish Year */}
                                    <div>
                                        <label htmlFor="publishYear" className="block text-sm font-medium text-gray-700 mb-2">
                                            ปีที่พิมพ์ *
                                        </label>
                                        <input
                                            id="publishYear"
                                            name="publishYear"
                                            type="number"
                                            min="1900"
                                            max={new Date().getFullYear() + 5}
                                            value={formData.publishYear}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.publishYear ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.publishYear && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                                <X className="w-4 h-4 mr-1" />
                                                {errors.publishYear}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Category and Details */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                    หมวดหมู่และรายละเอียด
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Category */}
                                    <div>
                                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                            หมวดหมู่ *
                                        </label>
                                        <select
                                            id="category"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.category ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                                }`}
                                        >
                                            <option value="">เลือกหมวดหมู่</option>
                                            {categories.map((category) => (
                                                <option key={category} value={category}>
                                                    {category}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.category && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                                <X className="w-4 h-4 mr-1" />
                                                {errors.category}
                                            </p>
                                        )}
                                    </div>

                                    {/* Language */}
                                    <div>
                                        <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                                            ภาษา
                                        </label>
                                        <select
                                            id="language"
                                            name="language"
                                            value={formData.language}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        >
                                            {languages.map((language) => (
                                                <option key={language} value={language}>
                                                    {language}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Location */}
                                    <div>
                                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                                            ตำแหน่งที่เก็บ *
                                        </label>
                                        <input
                                            id="location"
                                            name="location"
                                            type="text"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.location ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                                }`}
                                            placeholder="เช่น ชั้น 2 หมวด A-001"
                                        />
                                        {errors.location && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                                <X className="w-4 h-4 mr-1" />
                                                {errors.location}
                                            </p>
                                        )}
                                    </div>

                                    {/* Total Copies */}
                                    <div>
                                        <label htmlFor="totalCopies" className="block text-sm font-medium text-gray-700 mb-2">
                                            จำนวนเล่ม *
                                        </label>
                                        <input
                                            id="totalCopies"
                                            name="totalCopies"
                                            type="number"
                                            min="1"
                                            value={formData.totalCopies}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.totalCopies ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.totalCopies && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                                <X className="w-4 h-4 mr-1" />
                                                {errors.totalCopies}
                                            </p>
                                        )}
                                    </div>

                                    {/* Pages */}
                                    <div>
                                        <label htmlFor="pages" className="block text-sm font-medium text-gray-700 mb-2">
                                            จำนวนหน้า
                                        </label>
                                        <input
                                            id="pages"
                                            name="pages"
                                            type="number"
                                            min="0"
                                            value={formData.pages}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.pages ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                                }`}
                                            placeholder="จำนวนหน้า"
                                        />
                                        {errors.pages && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                                <X className="w-4 h-4 mr-1" />
                                                {errors.pages}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                                    คำอธิบายเพิ่มเติม
                                </h3>
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                        คำอธิบายหนังสือ
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={4}
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                                        placeholder="กรอกคำอธิบายเกี่ยวกับหนังสือ เนื้อหา หรือข้อมูลเพิ่มเติม..."
                                    />
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors ${isSubmitting
                                        ? 'bg-gray-400 text-white cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            กำลังเพิ่มหนังสือ...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            เพิ่มหนังสือ
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}