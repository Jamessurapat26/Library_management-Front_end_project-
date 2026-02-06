'use client';

import { useState, useEffect } from 'react';
import type { Book, BookEditForm, BookEditFormErrors } from '@/types';
import { BOOK_CATEGORIES } from '@/constants';

interface BookEditDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdateBook: (bookId: string, updatedBook: BookEditForm) => Promise<{ success: boolean; message?: string }>;
    book: Book | null;
}

const categories = BOOK_CATEGORIES;

export default function BookEditDialog({
    isOpen,
    onClose,
    onUpdateBook,
    book
}: BookEditDialogProps) {
    const [formData, setFormData] = useState<BookEditForm>({
        title: '',
        isbn: '',
        author: '',
        publisher: '',
        publishYear: new Date().getFullYear(),
        category: 'อื่นๆ',
        description: '',
        totalCopies: 1
    });
    const [formErrors, setFormErrors] = useState<BookEditFormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Populate form when book changes
    useEffect(() => {
        if (book) {
            setFormData({
                title: book.title,
                isbn: book.isbn,
                author: book.author,
                publisher: book.publisher,
                publishYear: book.publishYear,
                category: book.category,
                description: book.description || '',
                totalCopies: book.totalCopies
            });
            setFormErrors({});
        }
    }, [book]);

    const handleClose = () => {
        setFormErrors({});
        setIsSubmitting(false);
        onClose();
    };

    if (!isOpen || !book) return null;

    // Validation functions
    const validateISBN = (isbn: string): boolean => {
        // Remove hyphens and spaces
        const cleanISBN = isbn.replace(/[-\s]/g, '');
        // Check if it's 10 or 13 digits
        return /^\d{10}$/.test(cleanISBN) || /^\d{13}$/.test(cleanISBN);
    };

    const validateYear = (year: number): boolean => {
        const currentYear = new Date().getFullYear();
        return year >= 1000 && year <= currentYear;
    };

    // Real-time field validation
    const validateField = (fieldName: string, value: string | number) => {
        const errors = { ...formErrors };

        switch (fieldName) {
            case 'title':
                if (!value.toString().trim()) {
                    errors.title = 'กรุณากรอกชื่อหนังสือ';
                } else {
                    delete errors.title;
                }
                break;

            case 'isbn':
                if (!value.toString().trim()) {
                    errors.isbn = 'กรุณากรอก ISBN';
                } else if (!validateISBN(value.toString())) {
                    errors.isbn = 'รูปแบบ ISBN ไม่ถูกต้อง (10 หรือ 13 หลัก)';
                } else {
                    delete errors.isbn;
                }
                break;

            case 'author':
                if (!value.toString().trim()) {
                    errors.author = 'กรุณากรอกชื่อผู้แต่ง';
                } else {
                    delete errors.author;
                }
                break;

            case 'publisher':
                if (!value.toString().trim()) {
                    errors.publisher = 'กรุณากรอกสำนักพิมพ์';
                } else {
                    delete errors.publisher;
                }
                break;

            case 'publishYear':
                const year = typeof value === 'string' ? parseInt(value) : value;
                if (!year || isNaN(year)) {
                    errors.publishYear = 'กรุณากรอกปีที่พิมพ์';
                } else if (!validateYear(year)) {
                    errors.publishYear = `ปีที่พิมพ์ต้องอยู่ระหว่าง 1000-${new Date().getFullYear()}`;
                } else {
                    delete errors.publishYear;
                }
                break;

            case 'totalCopies':
                const copies = typeof value === 'string' ? parseInt(value) : value;
                if (!copies || isNaN(copies) || copies < 1) {
                    errors.totalCopies = 'จำนวนเล่มต้องมากกว่า 0';
                } else if (copies < book.copies.filter(copy => copy.status === 'borrowed').length) {
                    errors.totalCopies = 'จำนวนเล่มใหม่ต้องไม่น้อยกว่าจำนวนที่ถูกยืมอยู่';
                } else {
                    delete errors.totalCopies;
                }
                break;
        }

        setFormErrors(errors);
    };

    // Validate entire form
    const validateForm = (): boolean => {
        const errors: BookEditFormErrors = {};

        if (!formData.title.trim()) {
            errors.title = 'กรุณากรอกชื่อหนังสือ';
        }

        if (!formData.isbn.trim()) {
            errors.isbn = 'กรุณากรอก ISBN';
        } else if (!validateISBN(formData.isbn)) {
            errors.isbn = 'รูปแบบ ISBN ไม่ถูกต้อง (10 หรือ 13 หลัก)';
        }

        if (!formData.author.trim()) {
            errors.author = 'กรุณากรอกชื่อผู้แต่ง';
        }

        if (!formData.publisher.trim()) {
            errors.publisher = 'กรุณากรอกสำนักพิมพ์';
        }

        if (!formData.publishYear || !validateYear(formData.publishYear)) {
            errors.publishYear = `ปีที่พิมพ์ต้องอยู่ระหว่าง 1000-${new Date().getFullYear()}`;
        }

        if (!formData.totalCopies || formData.totalCopies < 1) {
            errors.totalCopies = 'จำนวนเล่มต้องมากกว่า 0';
        } else if (formData.totalCopies < book.copies.filter(copy => copy.status === 'borrowed').length) {
            errors.totalCopies = 'จำนวนเล่มใหม่ต้องไม่น้อยกว่าจำนวนที่ถูกยืมอยู่';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await onUpdateBook(book.id, formData);

            if (result.success) {
                handleClose();
            } else {
                setFormErrors({
                    general: result.message || 'เกิดข้อผิดพลาดในการอัพเดทหนังสือ'
                });
            }
        } catch {
            setFormErrors({
                general: 'เกิดข้อผิดพลาดในการเชื่อมต่อ'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const borrowedCopies = book.copies.filter(copy => copy.status === 'borrowed').length;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">แก้ไขข้อมูลหนังสือ</h3>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* General Error Message */}
                {formErrors.general && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{formErrors.general}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                ชื่อหนังสือ *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFormData({ ...formData, title: value });
                                    validateField('title', value);
                                }}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formErrors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                placeholder="กรอกชื่อหนังสือ"
                            />
                            {formErrors.title && (
                                <p className="text-sm text-red-600 mt-1">{formErrors.title}</p>
                            )}
                        </div>

                        {/* ISBN */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                ISBN *
                            </label>
                            <input
                                type="text"
                                value={formData.isbn}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFormData({ ...formData, isbn: value });
                                    validateField('isbn', value);
                                }}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formErrors.isbn ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                placeholder="978-0123456789 หรือ 0123456789"
                            />
                            {formErrors.isbn && (
                                <p className="text-sm text-red-600 mt-1">{formErrors.isbn}</p>
                            )}
                        </div>

                        {/* Author */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                ผู้แต่ง *
                            </label>
                            <input
                                type="text"
                                value={formData.author}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFormData({ ...formData, author: value });
                                    validateField('author', value);
                                }}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formErrors.author ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                placeholder="กรอกชื่อผู้แต่ง"
                            />
                            {formErrors.author && (
                                <p className="text-sm text-red-600 mt-1">{formErrors.author}</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        {/* Publisher */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                สำนักพิมพ์ *
                            </label>
                            <input
                                type="text"
                                value={formData.publisher}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFormData({ ...formData, publisher: value });
                                    validateField('publisher', value);
                                }}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formErrors.publisher ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                placeholder="กรอกสำนักพิมพ์"
                            />
                            {formErrors.publisher && (
                                <p className="text-sm text-red-600 mt-1">{formErrors.publisher}</p>
                            )}
                        </div>

                        {/* Publish Year */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                ปีที่พิมพ์ *
                            </label>
                            <input
                                type="number"
                                value={formData.publishYear}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    setFormData({ ...formData, publishYear: value });
                                    validateField('publishYear', value);
                                }}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formErrors.publishYear ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                min="1000"
                                max={new Date().getFullYear()}
                            />
                            {formErrors.publishYear && (
                                <p className="text-sm text-red-600 mt-1">{formErrors.publishYear}</p>
                            )}
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                หมวดหมู่
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Total Copies */}
                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        จำนวนเล่มทั้งหมด *
                    </label>
                    <input
                        type="number"
                        value={Number.isFinite(formData.totalCopies) ? formData.totalCopies : ""}
                        onChange={(e) => {
                            const value = parseInt(e.target.value);
                            setFormData({ ...formData, totalCopies: value });
                            validateField('totalCopies', value);
                        }}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formErrors.totalCopies ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                        min={borrowedCopies}
                    />
                    {formErrors.totalCopies && (
                        <p className="text-sm text-red-600 mt-1">{formErrors.totalCopies}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                        ขณะนี้มีการยืม {borrowedCopies} เล่ม (ไม่สามารถลดจำนวนให้น้อยกว่านี้ได้)
                    </p>
                </div>

                {/* Description */}
                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        คำอธิบาย
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="คำอธิบายเพิ่มเติมเกี่ยวกับหนังสือ (ไม่บังคับ)"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-8 justify-end">
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || Object.keys(formErrors).length > 0}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
                    </button>
                </div>
            </div>
        </div>
    );
}
