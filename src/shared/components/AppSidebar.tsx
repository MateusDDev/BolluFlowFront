'use client'

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/shared/components/ui/sidebar'
import Link from 'next/link'
import { navGroups } from '@/shared/navigation/items'
import { useMe } from '@/features/login/hooks/useMe'
import { usePathname } from 'next/navigation'
import { cn } from '@/shared/lib/utils'

const AppSidebar = () => {
    const { state } = useSidebar()
    const { data: user } = useMe()
    const pathname = usePathname()

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuButton asChild>
                        <Link href="/">
                            {state === 'expanded' && (
                                <span>{user?.name ?? 'Bollu Flow'}</span>
                            )}
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="gap-4 px-2 py-2">
                {navGroups.map((group) => (
                    <SidebarGroup
                        key={group.key}
                        className={cn(
                            'rounded-xl border border-transparent px-2 py-2',
                            group.variant === 'highlighted' &&
                                'border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent shadow-sm'
                        )}
                    >
                        <SidebarGroupLabel
                            className={cn(
                                group.variant === 'highlighted' &&
                                    'text-primary font-semibold'
                            )}
                        >
                            {group.title}
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => {
                                    const isActive = pathname === item.url
                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={isActive}
                                            >
                                                <Link
                                                    href={item.url}
                                                    className={cn(
                                                        group.variant ===
                                                            'highlighted' &&
                                                            'ml-1 rounded-lg'
                                                    )}
                                                >
                                                    <item.icon className="text-primary" />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    )
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
        </Sidebar>
    )
}

export default AppSidebar
