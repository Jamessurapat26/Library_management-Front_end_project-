const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="text-center text-gray-500">
                    <p>&copy; {currentYear} ระบบจัดการห้องสมุด. สงวนลิขสิทธิ์.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;