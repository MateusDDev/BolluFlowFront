'use client'

import '../../globals.css'

import React from 'react'
import ThemeButton from 'components/ThemeButton'
import { AuthWrapper } from '@/features/login/components/AuthWrapper'

export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AuthWrapper onboarding>
            <main className="flex min-h-screen w-full items-center justify-center p-4">
                <div className="absolute top-5 left-5">
                    <ThemeButton />
                </div>
                {children}
            </main>
        </AuthWrapper>
    )
}
