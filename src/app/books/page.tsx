"use client";

import { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { mockBooks } from "@/mock";
import { useSidebarCollapse } from "@/hooks/useSidebarCollapse";
import { useLanguage } from "@/hooks/useLanguage";
import { SearchAndFilter, BookList, Pagination, BookFilters, BorrowingDialog, BorrowForm } from "./components";

interface BookEditForm {
    title: string;
    isbn: string;
    author: string;
    publisher: string;
    publishYear: number;
    category: string;
    description?: string;
    totalCopies: number;
}


export default function BooksPage() {
    const { isCollapsed } = useSidebarCollapse(false);
    const { t } = useLanguage();
    const [localCollapsed, setLocalCollapsed] = useState(isCollapsed);

    // Listen for localStorage changes to sync across components
    useEffect(() => {
        const handleStorageChange = () => {
            const savedState = localStorage.getItem('sidebar-collapsed');
            if (savedState !== null) {
                setLocalCollapsed(JSON.parse(savedState));
            }
        };

        // Listen for storage events
        window.addEventListener('storage', handleStorageChange);

        // Also listen for custom events (for same-page updates)
        window.addEventListener('sidebar-toggle', handleStorageChange);

        // Initial check
        handleStorageChange();

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('sidebar-toggle', handleStorageChange);
        };
    }, []);

    // Update local state when hook state changes
    useEffect(() => {
        setLocalCollapsed(isCollapsed);
    }, [isCollapsed]);

    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState<BookFilters>({
        category: "",
        availability: "",
        year: "",
        author: ""
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [loading] = useState(false);
    const [forceUpdate, setForceUpdate] = useState(0); // For triggering re-renders

    // Borrowing dialog state
    const [showBorrowDialog, setShowBorrowDialog] = useState(false);
    const [selectedBookForBorrow, setSelectedBookForBorrow] = useState<{
        id: string;
        title: string;
        isbn: string;
        availableCopies: number;
    } | null>(null);

    // Dynamic items per page based on sidebar state
    const itemsPerPage = localCollapsed ? 12 : 9;

    // Filter and search books
    const filteredBooks = useMemo(() => {
        return mockBooks.filter(book => {
            // Search term filter
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch = !searchTerm ||
                book.title.toLowerCase().includes(searchLower) ||
                book.author.toLowerCase().includes(searchLower) ||
                book.isbn.toLowerCase().includes(searchLower) ||
                (book.description && book.description.toLowerCase().includes(searchLower));

            // Category filter
            const matchesCategory = !filters.category || book.category === filters.category;

            // Availability filter - check if book has available copies
            const availableCopies = book.copies.filter(copy => copy.status === "available").length;
            const matchesAvailability = !filters.availability ||
                (filters.availability === "available" && availableCopies > 0) ||
                (filters.availability === "borrowed" && availableCopies === 0);

            // Year filter
            const matchesYear = !filters.year || book.publishYear.toString() === filters.year;

            // Author filter
            const matchesAuthor = !filters.author ||
                book.author.toLowerCase().includes(filters.author.toLowerCase());

            return matchesSearch && matchesCategory && matchesAvailability && matchesYear && matchesAuthor;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, filters, forceUpdate]); // forceUpdate needed to trigger re-render after borrow/return

    // Pagination
    const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedBooks = filteredBooks.slice(startIndex, startIndex + itemsPerPage);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filters]);

    // Reset page when sidebar collapse state changes
    useEffect(() => {
        setCurrentPage(1);
    }, [localCollapsed]);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    const handleFilterChange = (newFilters: BookFilters) => {
        setFilters(newFilters);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBorrow = (bookId: string) => {
        const book = mockBooks.find(b => b.id === bookId);
        if (!book) return;

        // Calculate available copies in real-time
        const availableCopies = book.copies.filter(copy => copy.status === "available").length;

        if (availableCopies === 0) {
            alert('หนังสือเล่มนี้ไม่มีให้ยืมในขณะนี้');
            return;
        }

        setSelectedBookForBorrow({
            id: book.id,
            title: book.title,
            isbn: book.isbn,
            availableCopies: availableCopies
        });
        setShowBorrowDialog(true);
    };

    const handleBorrowConfirm = (borrowForm: BorrowForm) => {
        console.log('Borrowing book with details:', {
            bookId: selectedBookForBorrow?.id,
            borrowForm
        });

        // Find the book in mock data
        const bookIndex = mockBooks.findIndex(book => book.id === selectedBookForBorrow?.id);
        if (bookIndex === -1) {
            alert('เกิดข้อผิดพลาด: ไม่พบหนังสือในระบบ');
            return;
        }

        // Find the first available copy
        const book = mockBooks[bookIndex];
        const availableCopyIndex = book.copies.findIndex(copy => copy.status === "available");

        if (availableCopyIndex === -1) {
            alert('เกิดข้อผิดพลาด: ไม่มีเล่มว่างให้ยืม');
            return;
        }

        try {
            // Update the copy status to borrowed
            mockBooks[bookIndex].copies[availableCopyIndex] = {
                ...book.copies[availableCopyIndex],
                status: "borrowed",
                borrowedBy: borrowForm.borrowerName,
                dueDate: borrowForm.dueDate
            };

            // Show success message
            alert(`ยืมหนังสือ "${selectedBookForBorrow?.title}" สำเร็จ!\nผู้ยืม: ${borrowForm.borrowerName}\nกำหนดคืน: ${borrowForm.dueDate}\nรหัสเล่ม: ${book.copies[availableCopyIndex].copyId}`);

            // Force re-render to show updated availability
            setForceUpdate(prev => prev + 1);

        } catch (error) {
            console.error('Error updating book status:', error);
            alert('เกิดข้อผิดพลาดในการยืมหนังสือ');
        }

        // Close dialog and reset state
        setShowBorrowDialog(false);
        setSelectedBookForBorrow(null);
    };

    const handleDelete = (bookId: string) => {
        const book = mockBooks.find(b => b.id === bookId);
        if (!book) return;

        const borrowedCopies = book.copies.filter(copy => copy.status === "borrowed");

        // Check if any copies are borrowed
        if (borrowedCopies.length > 0) {
            alert(`ไม่สามารถลบหนังสือได้ เนื่องจากมีคนยืมอยู่ ${borrowedCopies.length} เล่ม\n\nกรุณารอให้ผู้ยืมคืนหนังสือก่อน`);
            return;
        }

        // Confirm deletion
        const confirmDelete = window.confirm(
            `คุณต้องการลบหนังสือ "${book.title}" ออกจากระบบหรือไม่?\n\nการลบนี้ไม่สามารถยกเลิกได้`
        );

        if (confirmDelete) {
            try {
                // Remove the book from mock data
                const bookIndex = mockBooks.findIndex(b => b.id === bookId);
                if (bookIndex !== -1) {
                    mockBooks.splice(bookIndex, 1);

                    alert(`ลบหนังสือ "${book.title}" สำเร็จแล้ว`);

                    // Force re-render to show updated list
                    setForceUpdate(prev => prev + 1);

                    // Reset to first page if current page is empty
                    if (paginatedBooks.length === 1 && currentPage > 1) {
                        setCurrentPage(currentPage - 1);
                    }
                }
            } catch (error) {
                console.error('Error deleting book:', error);
                alert('เกิดข้อผิดพลาดในการลบหนังสือ');
            }
        }
    };

    const handleReturn = (bookId: string) => {
        const book = mockBooks.find(b => b.id === bookId);
        if (!book) return;

        const borrowedCopies = book.copies.filter(copy => copy.status === "borrowed");

        if (borrowedCopies.length === 0) {
            alert('หนังสือเล่มนี้ไม่มีเล่มที่ถูกยืมอยู่');
            return;
        }

        // Show borrowed copies for return
        const borrowedList = borrowedCopies.map(copy =>
            `รหัส: ${copy.copyId} | ผู้ยืม: ${copy.borrowedBy} | กำหนดคืน: ${copy.dueDate}`
        ).join('\n');

        const confirmReturn = window.confirm(
            `หนังสือที่ถูกยืมอยู่:\n${borrowedList}\n\nคุณต้องการคืนหนังสือเล่มแรกหรือไม่?`
        );

        if (confirmReturn && borrowedCopies.length > 0) {
            const bookIndex = mockBooks.findIndex(b => b.id === bookId);
            const copyIndex = mockBooks[bookIndex].copies.findIndex(
                copy => copy.copyId === borrowedCopies[0].copyId
            );

            if (bookIndex !== -1 && copyIndex !== -1) {
                // Return the book
                mockBooks[bookIndex].copies[copyIndex] = {
                    copyId: borrowedCopies[0].copyId,
                    status: "available"
                };

                alert(`คืนหนังสือสำเร็จ!\nรหัสเล่ม: ${borrowedCopies[0].copyId}\nผู้คืน: ${borrowedCopies[0].borrowedBy}`);

                // Force re-render
                setForceUpdate(prev => prev + 1);
            }
        }
    };

    const handleEdit = async (bookId: string, updatedBookData: BookEditForm): Promise<{ success: boolean; message?: string }> => {
        try {
            // Find the book in mock data
            const bookIndex = mockBooks.findIndex(book => book.id === bookId);
            if (bookIndex === -1) {
                return { success: false, message: 'ไม่พบหนังสือในระบบ' };
            }

            const currentBook = mockBooks[bookIndex];
            const borrowedCopies = currentBook.copies.filter(copy => copy.status === 'borrowed').length;

            // Validate total copies
            if (updatedBookData.totalCopies < borrowedCopies) {
                return {
                    success: false,
                    message: `จำนวนเล่มใหม่ (${updatedBookData.totalCopies}) ต้องไม่น้อยกว่าจำนวนที่ถูกยืมอยู่ (${borrowedCopies})`
                };
            }

            // Check for duplicate ISBN (excluding current book)
            const duplicateISBN = mockBooks.find(book =>
                book.id !== bookId && book.isbn === updatedBookData.isbn
            );
            if (duplicateISBN) {
                return { success: false, message: 'ISBN นี้มีอยู่ในระบบแล้ว' };
            }

            // Update the book data
            const updatedBook = {
                ...currentBook,
                title: updatedBookData.title,
                isbn: updatedBookData.isbn,
                author: updatedBookData.author,
                publisher: updatedBookData.publisher,
                publishYear: updatedBookData.publishYear,
                category: updatedBookData.category,
                description: updatedBookData.description,
                totalCopies: updatedBookData.totalCopies
            };

            // Adjust copies array if totalCopies changed
            if (updatedBookData.totalCopies !== currentBook.totalCopies) {
                const currentCopies = [...currentBook.copies];

                if (updatedBookData.totalCopies > currentBook.totalCopies) {
                    // Add new available copies
                    const copiesToAdd = updatedBookData.totalCopies - currentBook.totalCopies;
                    for (let i = 0; i < copiesToAdd; i++) {
                        currentCopies.push({
                            copyId: `${bookId}-${currentCopies.length + 1}`,
                            status: 'available'
                        });
                    }
                } else if (updatedBookData.totalCopies < currentBook.totalCopies) {
                    // Remove available copies (keep borrowed ones)
                    const availableCopies = currentCopies.filter(copy => copy.status === 'available');
                    const borrowedCopiesToKeep = currentCopies.filter(copy => copy.status === 'borrowed');
                    const availableCopiesToKeep = availableCopies.slice(0, updatedBookData.totalCopies - borrowedCopiesToKeep.length);
                    currentCopies.splice(0, currentCopies.length, ...borrowedCopiesToKeep, ...availableCopiesToKeep);
                }

                updatedBook.copies = currentCopies;
            }

            // Update the book in mock data
            mockBooks[bookIndex] = updatedBook;

            // Force re-render
            setForceUpdate(prev => prev + 1);

            return { success: true, message: 'อัพเดทข้อมูลหนังสือสำเร็จ' };

        } catch (error) {
            console.error('Error updating book:', error);
            return { success: false, message: 'เกิดข้อผิดพลาดในการอัพเดทข้อมูล' };
        }
    };

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("page.books.title")}</h1>
                    <p className="text-gray-600">{t("page.books.subtitle")}</p>
                </div>

                <SearchAndFilter
                    onSearch={handleSearch}
                    onFilterChange={handleFilterChange}
                    totalBooks={filteredBooks.length}
                />

                <BookList
                    books={paginatedBooks}
                    loading={loading}
                    onBorrow={handleBorrow}
                    onDelete={handleDelete}
                    onReturn={handleReturn}
                    onEdit={handleEdit}
                    sidebarCollapsed={localCollapsed}
                />

                {filteredBooks.length > 0 && (
                    <div className="mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            itemsPerPage={itemsPerPage}
                            totalItems={filteredBooks.length}
                        />
                    </div>
                )}

                {/* Borrowing Dialog */}
                {selectedBookForBorrow && (
                    <BorrowingDialog
                        isOpen={showBorrowDialog}
                        onClose={() => {
                            setShowBorrowDialog(false);
                            setSelectedBookForBorrow(null);
                        }}
                        onConfirm={handleBorrowConfirm}
                        bookTitle={selectedBookForBorrow.title}
                        bookId={selectedBookForBorrow.id}
                        bookIsbn={selectedBookForBorrow.isbn}
                        availableCopies={selectedBookForBorrow.availableCopies}
                    />
                )}
            </DashboardLayout>
        </ProtectedRoute>
    );
}