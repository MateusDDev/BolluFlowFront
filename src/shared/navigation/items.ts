import {
    ChefHatIcon,
    CircleDollarSignIcon,
    Home,
    NotepadTextIcon,
    PackageIcon,
    ReceiptTextIcon,
    ShoppingBagIcon,
    type LucideIcon,
    UsersIcon,
    WalletCardsIcon,
    WheatIcon,
} from 'lucide-react'

export type NavLeafItem = {
    title: string
    url: string
    icon: LucideIcon
}

export type NavGroup = {
    key: 'main' | 'inventory' | 'finance' | 'catalog'
    title: string
    variant?: 'default' | 'highlighted'
    items: NavLeafItem[]
}

export const navGroups: NavGroup[] = [
    {
        key: 'main',
        title: 'Main',
        items: [
            { title: 'Dashboard', url: '/', icon: Home },
            { title: 'Orders', url: '/orders', icon: NotepadTextIcon },
        ],
    },
    {
        key: 'inventory',
        title: 'Inventory',
        items: [
            { title: 'Products', url: '/products', icon: PackageIcon },
            { title: 'Ingredients', url: '/ingredients', icon: WheatIcon },
            { title: 'Supplies', url: '/supplies', icon: ShoppingBagIcon },
        ],
    },
    {
        key: 'finance',
        title: 'Finance',
        variant: 'highlighted',
        items: [
            {
                title: 'Overview',
                url: '/finance/overview',
                icon: CircleDollarSignIcon,
            },
            {
                title: 'Transactions',
                url: '/finance/transactions',
                icon: ReceiptTextIcon,
            },
            {
                title: 'Fixed Costs',
                url: '/finance/fixed-costs',
                icon: WalletCardsIcon,
            },
        ],
    },
    {
        key: 'catalog',
        title: 'Catalog',
        items: [
            { title: 'Recipes', url: '/recipes', icon: ChefHatIcon },
            { title: 'Customers', url: '/customers', icon: UsersIcon },
        ],
    },
]
