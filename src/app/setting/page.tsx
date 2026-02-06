'use client';

import { DashboardLayout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useLanguage } from '../../hooks/useLanguage';
import { LanguageToggle, SettingSection } from './components';

export default function SettingPage() {
    const { t, isLoading: languageLoading, error: languageError } = useLanguage();

    const isLoading = languageLoading;
    const hasError = languageError;

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="space-y-6">
                    {/* Page Header */}
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {t('settings.title')}
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {t('settings.preferences')}
                        </p>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                            <span className="ml-3 text-gray-300">
                                {t('common.loading')}
                            </span>
                        </div>
                    )}

                    {/* Error State */}
                    {hasError && !isLoading && (
                        <div className="p-4 bg-red-900/20 border border-red-700/50 rounded-lg">
                            <div className="flex">
                                <svg className="w-5 h-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-300">
                                        {t('error.settings.load')}
                                    </h3>
                                    <div className="mt-2 text-sm text-red-400">
                                        {languageError && <p>{languageError}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Settings Content */}
                    {!isLoading && (
                        <div className="max-w-2xl space-y-6">
                            {/* Language Settings Section */}
                            <SettingSection
                                title={t('settings.language')}
                                description={t('settings.language.description')}
                            >
                                <LanguageToggle />
                            </SettingSection>
                        </div>
                    )}
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}