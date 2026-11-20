'use client'

import '../globals.css'

import NavBar from 'components/NavBar'
import { SidebarInset, SidebarProvider } from 'ui/sidebar'
import AppSidebar from 'components/AppSidebar'
import { AuthWrapper } from '@/features/login/components/AuthWrapper'
import { ModuleRouteGuard } from '@/shared/modules/ModuleRouteGuard'
import { PageTitleProvider } from 'components/providers/PageTitleProvider'
import React, { useEffect, useState } from 'react'

export default function PrivateLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [sidebarOpen, setSidebarOpen] = useState(true)

    useEffect(() => {
        const sidebarState = document.cookie
            .split('; ')
            .find((cookie) => cookie.startsWith('sidebar_state='))
            ?.split('=')[1]

        if (sidebarState != null) {
            setSidebarOpen(sidebarState === 'true')
        }
    }, [])

    return (
        <AuthWrapper>
            <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <AppSidebar />
                <SidebarInset>
                    <PageTitleProvider>
                        <NavBar />
                        <main className="w-full px-4">
                            <ModuleRouteGuard>{children}</ModuleRouteGuard>
                        </main>
                    </PageTitleProvider>
                </SidebarInset>
            </SidebarProvider>
        </AuthWrapper>
    )
}
