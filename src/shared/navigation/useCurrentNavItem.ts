'use client'

import { usePathname } from 'next/navigation'
import { NavItem, navItems } from '@/shared/navigation/items'

export function isNavItemActive(item: NavItem, pathname: string) {
    if (item.url === '/') return pathname === '/'

    return pathname === item.url || pathname.startsWith(`${item.url}/`)
}

export function useCurrentNavItem() {
    const pathname = usePathname()

    return navItems.find((item) => isNavItemActive(item, pathname)) ?? null
}
