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
        title: 'Principal',
        items: [
            { title: 'Dashboard', url: '/', icon: Home },
            { title: 'Pedidos', url: '/orders', icon: NotepadTextIcon },
        ],
    },
    {
        key: 'inventory',
        title: 'Estoque',
        items: [
            { title: 'Produtos', url: '/products', icon: PackageIcon },
            { title: 'Ingredientes', url: '/ingredients', icon: WheatIcon },
            { title: 'Insumos', url: '/supplies', icon: ShoppingBagIcon },
        ],
    },
    {
        key: 'finance',
        title: 'Financeiro',
        variant: 'highlighted',
        items: [
            {
                title: 'Resumo',
                url: '/finance/overview',
                icon: CircleDollarSignIcon,
            },
            {
                title: 'Lançamentos',
                url: '/finance/transactions',
                icon: ReceiptTextIcon,
            },
            {
                title: 'Contas Fixas',
                url: '/finance/fixed-costs',
                icon: WalletCardsIcon,
            },
        ],
    },
    {
        key: 'catalog',
        title: 'Cadastros',
        items: [
            { title: 'Receitas', url: '/recipes', icon: ChefHatIcon },
            { title: 'Clientes', url: '/customers', icon: UsersIcon },
        ],
    },
]
