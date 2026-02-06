'use client';

import { ReactNode } from 'react';

interface SettingSectionProps {
    title: string;
    description?: string;
    children: ReactNode;
}

export function SettingSection({ title, description, children }: SettingSectionProps) {
    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">
                    {title}
                </h2>
                {description && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {description}
                    </p>
                )}
            </div>
            <div>
                {children}
            </div>
        </div>
    );
}