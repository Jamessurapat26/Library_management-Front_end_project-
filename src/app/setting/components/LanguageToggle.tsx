'use client';

import { useEffect } from 'react';
import { useLanguage } from '../../../hooks/useLanguage';
import { useToast } from '../../../context/ToastContext';

export function LanguageToggle() {
    const { language, toggleLanguage, t, isLoading, error } = useLanguage();
    const { showSuccess, showError } = useToast();

    // Show error toast when language error occurs
    useEffect(() => {
        if (error) {
            showError(t('error.language.change'));
        }
    }, [error, showError, t]);

    const handleToggleLanguage = () => {
        toggleLanguage();

        // Show success message after language change
        // We'll use a small delay to ensure the language has been applied
        setTimeout(() => {
            if (!error) {
                showSuccess(t('success.language.changed'));
            }
        }, 100);
    };

    return (
        <div className="flex items-center justify-between p-6 bg-white rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
                {/* Language Flag Icon */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700">
                    {language === 'th' ? (
                        // Thai Flag Icon
                        <div className="w-6 h-4 rounded-sm overflow-hidden border border-gray-300 dark:border-gray-600">
                            <div className="w-full h-1/3 bg-red-600"></div>
                            <div className="w-full h-1/3 bg-white"></div>
                            <div className="w-full h-1/3 bg-blue-600"></div>
                        </div>
                    ) : (
                        // English/US Flag Icon
                        <div className="w-6 h-4 rounded-sm overflow-hidden border border-gray-300 dark:border-gray-600 relative">
                            {/* Red and white stripes */}
                            <div className="absolute inset-0">
                                <div className="w-full h-px bg-red-600"></div>
                                <div className="w-full h-px bg-white mt-px"></div>
                                <div className="w-full h-px bg-red-600 mt-px"></div>
                                <div className="w-full h-px bg-white mt-px"></div>
                                <div className="w-full h-px bg-red-600 mt-px"></div>
                                <div className="w-full h-px bg-white mt-px"></div>
                                <div className="w-full h-px bg-red-600 mt-px"></div>
                            </div>
                            {/* Blue canton */}
                            <div className="absolute top-0 left-0 w-2.5 h-2 bg-blue-800"></div>
                        </div>
                    )}
                </div>

                {/* Language Label and Description */}
                <div>
                    <h3 className="text-sm font-medium text-gray-900">
                        {t('settings.language')}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {language === 'th' ? t('language.thai') : t('language.english')}
                    </p>
                </div>
            </div>

            {/* Toggle Switch */}
            <button
                onClick={handleToggleLanguage}
                disabled={isLoading}
                className={`
                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
                    ${isLoading
                        ? 'opacity-50 cursor-not-allowed bg-gray-300'
                        : language === 'en'
                            ? 'bg-blue-600'
                            : 'bg-gray-200'
                    }
                `}
                role="switch"
                aria-checked={language === 'en'}
                aria-label={t('language.toggle')}
            >
                <span
                    className={`
                        inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out
                        ${language === 'en'
                            ? 'translate-x-6'
                            : 'translate-x-1'
                        }
                    `}
                />
            </button>
        </div>
    );
}