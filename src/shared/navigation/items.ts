import {
    CircleDollarSignIcon,
    ChefHatIcon,
    FileTextIcon,
    Home,
    LandmarkIcon,
    NotepadTextIcon,
    PackageIcon,
    ReceiptTextIcon,
    ShoppingBagIcon,
    type LucideIcon,
    UsersIcon,
    WheatIcon,
} from 'lucide-react'

export type NavItem = {
    title: string
    url: string
    icon: LucideIcon
    section: 'principal' | 'estoque' | 'cadastros' | 'financeiro'
    items?: Array<{
        title: string
        url: string
        icon?: LucideIcon
    }>
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
        url: '/financial/resumo',
        icon: LandmarkIcon,
        section: 'financeiro',
        items: [
            {
                title: 'Resumo',
                url: '/financial/resumo',
                icon: CircleDollarSignIcon,
            },
            {
                title: 'Lançamentos',
                url: '/financial/lancamentos',
                icon: ReceiptTextIcon,
            },
            {
                title: 'Contas Fixas',
                url: '/financial/contas-fixas',
                icon: FileTextIcon,
            },
        ],
    },
    {
        title: 'Produtos',
        url: '/products',
        icon: PackageIcon,
        section: 'estoque',
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
        section: 'cadastros',
    },
    {
        title: 'Clientes',
        url: '/customers',
        icon: UsersIcon,
        section: 'cadastros',
    },
]

export const flatNavItems = navItems.flatMap((item) => [
    item,
    ...(item.items?.map((subItem) => ({
        ...item,
        title: subItem.title,
        url: subItem.url,
        icon: subItem.icon ?? item.icon,
        items: undefined,
    })) ?? []),
])

export const navSections: Array<{
    key: NavItem['section']
    title: string
}> = [
    { key: 'principal', title: 'Principal' },
    { key: 'financeiro', title: 'Financeiro' },
    { key: 'estoque', title: 'Estoque' },
    { key: 'cadastros', title: 'Cadastros' },
]
