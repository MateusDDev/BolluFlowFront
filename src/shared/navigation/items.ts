import {
    ChefHatIcon,
    Home,
    NotepadTextIcon,
    PackageIcon,
    UsersIcon,
    WheatIcon,
} from 'lucide-react'

export const navItems = [
    {
        title: 'Dashboard',
        url: '/',
        icon: Home,
    },
    {
        title: 'Pedidos',
        url: '/orders',
        icon: NotepadTextIcon,
    },
    {
        title: 'Receitas',
        url: '/recipes',
        icon: ChefHatIcon,
    },
    {
        title: 'Produtos',
        url: '/products',
        icon: PackageIcon,
    },
    {
        title: 'Ingredientes',
        url: '/ingredients',
        icon: WheatIcon,
    },
    {
        title: 'Clientes',
        url: '/customers',
        icon: UsersIcon,
    },
]
