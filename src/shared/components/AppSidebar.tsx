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
import { navItems, navSections } from '@/shared/navigation/items'
import { useMe } from '@/features/login/hooks/useMe'
import { useModules } from '@/shared/modules/useModules'

const AppSidebar = () => {
    const { state } = useSidebar()
    const { data: user } = useMe()
    const { hasAnyModule } = useModules()

    const visibleItems = navItems.filter(
        (item) => !item.modules || hasAnyModule(item.modules)
    )

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuButton asChild>
                        <Link href="/">
                            {state == 'expanded' && <span>{user?.name}</span>}
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {navSections.map((section) => {
                    const items = visibleItems.filter(
                        (item) => item.section === section.key
                    )

                    if (!items.length) return null

                    return (
                        <SidebarGroup key={section.key}>
                            <SidebarGroupLabel>
                                {section.title}
                            </SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {items.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild>
                                                <Link href={item.url}>
                                                    <item.icon className="text-primary" />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    )
                })}
            </SidebarContent>
        </Sidebar>
    )
}

export default AppSidebar
