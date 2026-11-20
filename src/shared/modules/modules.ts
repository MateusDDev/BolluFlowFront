export type AppModule = 'orders' | 'recipes' | 'stock' | 'finance'

export type AppModuleInfo = {
    key: AppModule
    title: string
    description: string
}

export const APP_MODULES: AppModuleInfo[] = [
    {
        key: 'orders',
        title: 'Pedidos',
        description:
            'Registrar encomendas, acompanhar o preparo e receber pedidos pelo cardápio online.',
    },
    {
        key: 'recipes',
        title: 'Receitas e custos',
        description:
            'Cadastrar ingredientes, montar fichas técnicas e descobrir quanto custa cada produto.',
    },
    {
        key: 'stock',
        title: 'Estoque',
        description:
            'Saber quanto tem de cada item, com baixa automática ao produzir e vender.',
    },
    {
        key: 'finance',
        title: 'Financeiro',
        description:
            'Acompanhar entradas e saídas. As vendas entregues entram sozinhas.',
    },
]
