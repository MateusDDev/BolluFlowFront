import {
    Home,
    UsersIcon,
    ChefHatIcon,
    WheatIcon,
    NotepadTextIcon,
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
