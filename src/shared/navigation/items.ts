import {
    ChefHatIcon,
    Home,
    WalletCardsIcon,
    NotepadTextIcon,
    PackageIcon,
    ShoppingBagIcon,
    type LucideIcon,
    UsersIcon,
    WheatIcon,
} from 'lucide-react'

export type NavItem = {
    title: string
    url: string
    icon: LucideIcon
    section: 'principal' | 'cardapio' | 'estoque' | 'cadastros'
}

export const navItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/',
        icon: Home,
        section: 'principal',
    },
    {
        title: 'Pedidos',
        url: '/orders',
        icon: NotepadTextIcon,
        section: 'principal',
    },

    {
        title: 'Financeiro',
        url: '/financeiro',
        icon: WalletCardsIcon,
        section: 'principal',
    },
    {
        title: 'Ingredientes',
        url: '/ingredients',
        icon: WheatIcon,
        section: 'estoque',
    },
    {
        title: 'Insumos',
        url: '/supplies',
        icon: ShoppingBagIcon,
        section: 'estoque',
    },
    {
        title: 'Receitas',
        url: '/recipes',
        icon: ChefHatIcon,
        section: 'cardapio',
    },
    {
        title: 'Produtos',
        url: '/products',
        icon: PackageIcon,
        section: 'cardapio',
    },
    {
        title: 'Clientes',
        url: '/customers',
        icon: UsersIcon,
        section: 'cadastros',
    },
]

export const navSections: Array<{
    key: NavItem['section']
    title: string
}> = [
    { key: 'principal', title: 'Principal' },
    { key: 'cardapio', title: 'Cardápio' },
    { key: 'estoque', title: 'Estoque' },
    { key: 'cadastros', title: 'Cadastros' },
]
