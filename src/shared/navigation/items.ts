import { AppModule } from '@/shared/modules/modules'
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
    modules?: AppModule[]
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
        modules: ['orders'],
    },

    {
        title: 'Financeiro',
        url: '/financeiro',
        icon: WalletCardsIcon,
        section: 'principal',
        modules: ['finance'],
    },
    {
        title: 'Ingredientes',
        url: '/ingredients',
        icon: WheatIcon,
        section: 'estoque',
        modules: ['recipes', 'stock'],
    },
    {
        title: 'Insumos',
        url: '/supplies',
        icon: ShoppingBagIcon,
        section: 'estoque',
        modules: ['recipes', 'stock'],
    },
    {
        title: 'Receitas',
        url: '/recipes',
        icon: ChefHatIcon,
        section: 'cardapio',
        modules: ['recipes'],
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
        modules: ['orders'],
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
