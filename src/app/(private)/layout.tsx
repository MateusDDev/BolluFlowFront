import '../globals.css'

import NavBar from 'components/NavBar'
import { SidebarInset, SidebarProvider } from 'ui/sidebar'
import { cookies } from 'next/headers'
import AppSidebar from 'components/AppSidebar'
import { AuthWrapper } from '@/features/login/components/AuthWrapper'
import { PageTitleProvider } from 'components/providers/PageTitleProvider'
import React from 'react'

export default async function PrivateLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true'

    return (
        <AuthWrapper>
            <SidebarProvider defaultOpen={defaultOpen}>
                <AppSidebar />
                <SidebarInset>
                    <PageTitleProvider>
                        <NavBar />
                        <main className="w-full px-4">{children}</main>
                    </PageTitleProvider>
                </SidebarInset>
            </SidebarProvider>
        </AuthWrapper>
    )
}
