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
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from '@/shared/components/ui/sidebar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navItems, navSections } from '@/shared/navigation/items'
import { useMe } from '@/features/login/hooks/useMe'

const AppSidebar = () => {
    const pathname = usePathname()
    const { state } = useSidebar()
    const { data: user } = useMe()

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
                    const items = navItems.filter(
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
                                    {items.map((item) => {
                                        const hasChildren = Boolean(
                                            item.items?.length
                                        )
                                        const isActiveParent = hasChildren
                                            ? item.items?.some(
                                                  (subItem) =>
                                                      pathname === subItem.url
                                              )
                                            : pathname === item.url

                                        return (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={Boolean(
                                                        isActiveParent
                                                    )}
                                                >
                                                    <Link href={item.url}>
                                                        <item.icon className="text-primary" />
                                                        <span>
                                                            {item.title}
                                                        </span>
                                                    </Link>
                                                </SidebarMenuButton>

                                                {hasChildren && (
                                                    <SidebarMenuSub>
                                                        {item.items?.map(
                                                            (subItem) => (
                                                                <SidebarMenuSubItem
                                                                    key={
                                                                        subItem.url
                                                                    }
                                                                >
                                                                    <SidebarMenuSubButton
                                                                        asChild
                                                                        isActive={
                                                                            pathname ===
                                                                            subItem.url
                                                                        }
                                                                    >
                                                                        <Link
                                                                            href={
                                                                                subItem.url
                                                                            }
                                                                        >
                                                                            {subItem.icon && (
                                                                                <subItem.icon />
                                                                            )}
                                                                            <span>
                                                                                {
                                                                                    subItem.title
                                                                                }
                                                                            </span>
                                                                        </Link>
                                                                    </SidebarMenuSubButton>
                                                                </SidebarMenuSubItem>
                                                            )
                                                        )}
                                                    </SidebarMenuSub>
                                                )}
                                            </SidebarMenuItem>
                                        )
                                    })}
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
