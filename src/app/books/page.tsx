"use client";

import { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "@/components/Layout";
import { SearchAndFilter, BookList, Pagination, BookFilters } from "./components";
import { mockBooks } from "@/mock";
import { useSidebarCollapse } from "@/hooks/useSidebarCollapse";

export default function BooksPage() {
    const { isCollapsed } = useSidebarCollapse(false);
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
    }, [searchTerm, filters]);

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
        // TODO: Implement borrow functionality
        console.log('Borrowing book:', bookId);
        // This would typically make an API call to borrow the book
        alert(`ขณะนี้ระบบการยืมหนังสือยังไม่เปิดใช้งาน`);
    };

    const handleDelete = (bookId: string) => {
        // TODO: Implement delete functionality
        console.log('Deleting book:', bookId);
        // This would typically make an API call to delete the book
        if (window.confirm('คุณต้องการลบหนังสือเล่มนี้หรือไม่?')) {
            alert(`ขณะนี้ระบบการลบหนังสือยังไม่เปิดใช้งาน`);
        }
    };

    return (
        <DashboardLayout userType="admin" username="Admin" userRole="ผู้ดูแลระบบ">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">จัดการหนังสือ</h1>
                <p className="text-gray-600">ค้นหาและจัดการหนังสือในห้องสมุด</p>
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
        </DashboardLayout>
    );
}